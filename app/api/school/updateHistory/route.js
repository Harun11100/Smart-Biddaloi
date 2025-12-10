import connectDb from "@/app/utils/db";
import Student from "@/app/model/Student";
import School from "@/app/model/School";
import PaymentHistory from "@/app/model/PaymentHistory";

export async function PUT(req) {
  try {
    await connectDb();

    const { studentId, classId, paymentId } = await req.json();

    if (!studentId || !classId || !paymentId) {
      return Response.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const student = await Student.findOne({ _id: studentId, classId });
    if (!student) {
      return Response.json(
        { success: false, message: "Student not found" },
        { status: 404 }
      );
    }

    const paymentInfo = await PaymentHistory.findOne({
      _id: paymentId,
      studentId,
    });

    if (!paymentInfo) {
      return Response.json(
        { success: false, message: "Payment record not found" },
        { status: 404 }
      );
    }

    const previousStatus = paymentInfo.paymentStatus;
    const newStatus = previousStatus === "paid" ? "unpaid" : "paid";

    const totalAmount =
      (student.tuitionFee || 0) + (student.coachingFee || 0);

    // Bengali Month + Year (MUST HAVE!)
    const paymentMonth = paymentInfo.paymentMonth;

    // ---- Update student due & paid amounts ----
    if (previousStatus === "unpaid" && newStatus === "paid") {
      student.totalDueAmount = Math.max(student.totalDueAmount - totalAmount, 0);
      student.totalPaidAmount += totalAmount;
    } else if (previousStatus === "paid" && newStatus === "unpaid") {
      student.totalDueAmount += totalAmount;
      student.totalPaidAmount -= totalAmount;
    }

    // Update main fields
    student.paymentStatus = newStatus;
    paymentInfo.paymentStatus = newStatus;
    paymentInfo.paymentDate = new Date();

    await student.save();
    await paymentInfo.save();

    // ===============================
    //   UPDATE SCHOOL MONTHLY TOTAL
    // ===============================
    if (student.schoolId) {
      const school = await School.findById(student.schoolId);

      let monthlyPaymentData = school.totalMonthlyPaymentCollection || [];

      // Remove old entry for same month
      monthlyPaymentData = monthlyPaymentData.filter(
        (entry) => entry.date !== paymentMonth
      );

      // Fetch all payments of this month again
      const payments = await PaymentHistory.find({
        schoolId: student.schoolId,
        paymentMonth,
      });

      const totalMonthlyCollection = payments
        .filter((p) => p.paymentStatus === "paid")
        .reduce((sum, p) => sum + p.totalAmount, 0);

      const totalMonthlyDue = payments
        .filter((p) => p.paymentStatus === "unpaid")
        .reduce((sum, p) => sum + p.totalAmount, 0);

      // Insert updated entry
      monthlyPaymentData.push({
        date: paymentMonth,
        totalMonthlyCollection,
        totalMonthlyDue,
      });

      // Keep only 12 months
      if (monthlyPaymentData.length > 12) {
        monthlyPaymentData.shift();
      }

      await School.findByIdAndUpdate(student.schoolId, {
        totalMonthlyPaymentCollection: monthlyPaymentData,
      });
    }

    // ===============================
    //   SEND PUSH NOTIFICATION
    // ===============================
    if (
      previousStatus === "unpaid" &&
      newStatus === "paid" &&
      student.expoToken
    ) {
      const message = {
        to: student.expoToken,
        sound: "default",
        title: "💰 পেমেন্ট সম্পন্ন হয়েছে!",
        body: "প্রিয় অভিভাবক, আপনার সন্তানের মাসিক ফি সফলভাবে পরিশোধ করা হয়েছে।",
        data: {
          studentId: student._id.toString(),
          guardianPhone: student.guardianPhone || null,
        },
      };

      try {
        await fetch("https://exp.host/--/api/v2/push/send", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(message),
        });
      } catch (err) {
        console.warn("⚠️ Push notification failed:", err);
      }
    }

    // Response Payload
    const studentData = {
      _id: student._id,
      studentName: student.name,
      className: student.className,
      guardianName: student.guardianName || "",
      guardianPhone: student.guardianPhone || "",
      roll: student.roll,
      section: student.section,
      tutionFee: student.tuitionFee,
      coachingFee: student.coachingFee,
      paymentStatus: student.paymentStatus,
      address: student.address,
      totalPaidAmount: student.totalPaidAmount,
      totalDueAmount: student.totalDueAmount,
    };

    return Response.json(
      {
        success: true,
        message: `Payment status changed to "${newStatus}" successfully`,
        updatedPayment: paymentInfo,
        updatedStudent: studentData,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Error updating payment status:", err);
    return Response.json(
      {
        success: false,
        message: "Failed to update payment status",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
