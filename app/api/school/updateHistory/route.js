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

    const paymentInfo = await PaymentHistory.findOne({ _id: paymentId, studentId });
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

    if (previousStatus === "unpaid" && newStatus === "paid") {
      student.totalDueAmount = Math.max(student.totalDueAmount - totalAmount, 0);
      student.totalPaidAmount +=totalAmount
    } else if (previousStatus === "paid" && newStatus === "unpaid") {
      student.totalDueAmount += totalAmount;
      student.totalPaidAmount -= totalAmount;
      student.paymentStatus = "unpaid";

    }
    student.paymentStatus = newStatus;
    paymentInfo.paymentStatus = newStatus;
    paymentInfo.paymentDate = new Date();
    
    await student.save();
    await paymentInfo.save();

    if (previousStatus === "unpaid" && newStatus === "paid") {
      if (student.schoolId) {
        await School.findByIdAndUpdate(student.schoolId, {
          $inc: { totalPaymentCount: 1 },
        });
      }
    
      if (student.expoToken) {
        const title = "💰 পেমেন্ট সম্পন্ন হয়েছে!";
        const notificationBody =
          "প্রিয় অভিভাবক, আপনার সন্তানের মাসিক ফি সফলভাবে পরিশোধ করা হয়েছে। ধন্যবাদ আমাদের সঙ্গে থাকার জন্য।";
      
          
        const message = {
          to: student.expoToken,
          sound: "default",
          title,
          body: notificationBody,
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
        } catch (pushErr) {
          console.warn("⚠️ Push notification failed:", pushErr);
        }
      }
    }

      const studentData={
      _id:student._id,
      studentName:student.name,
      className:student.className,
      guardianName:student.guardianName ||"",
      guardianPhone:student.guardianPhone||"",
      roll:student.roll,
      section:student.section,
      tutionFee:student.tuitionFee,
      coachingFee:student.coachingFee,
      paymentStatus:student.paymentStatus,
      address:student.address,
      totalPaidAmount:student.totalPaidAmount,
      totalDueAmount:student.totalDueAmount
    }

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
