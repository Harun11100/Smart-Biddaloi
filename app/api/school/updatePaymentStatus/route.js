import { NextResponse } from "next/server";
import connectDb from "@/app/utils/db";
import Student from "@/app/model/Student";
import School from "@/app/model/School";
import PaymentHistory from "@/app/model/PaymentHistory";

export async function PUT(req) {
  try {
    await connectDb();

    const { studentId, classId, status } = await req.json();

    if (!studentId || !classId || !status) {
      return NextResponse.json(
        { success: false, message: "Missing required fields (studentId, classId, status)" },
        { status: 400 }
      );
    }

    if (status === "unpaid") {
      return NextResponse.json(
        { success: false, message: "দয়া করে পেমেন্ট ইতিহাস থেকে স্ট্যাটাস আপডেট করুন" },
        { status: 400 }
      );
    }

    if (!["paid", "unpaid"].includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid payment status value" },
        { status: 400 }
      );
    }

    const student = await Student.findOne({ _id: studentId, classId });
    if (!student) {
      return NextResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 }
      );
    }

    const previousStatus = student.paymentStatus;
    const totalAmount = (student.tuitionFee || 0) + (student.coachingFee || 0);

    const now = new Date();
    const paymentMonth = now.toLocaleString("bn-BD", {
      month: "long",
      year: "numeric",
    });

    // -----------------------------
    // UPDATE STUDENT PAYMENT STATUS
    // -----------------------------
    if (status === "paid") {
      student.totalDueAmount = Math.max(student.totalDueAmount - totalAmount, 0);
      student.totalPaidAmount += totalAmount;
    }

    student.paymentStatus = status;

    // -----------------------------
    // PAYMENT HISTORY UPDATE
    // -----------------------------
    const existing = await PaymentHistory.findOne({ studentId, paymentMonth });

    if (status === "paid") {
      if (existing) {
        if (existing.paymentStatus === "unpaid") {
          existing.paymentStatus = "paid";
          existing.paymentDate = now;
          await existing.save();
        }
      } else {
        await new PaymentHistory({
          studentId,
          schoolId: student.schoolId,
          paymentMonth,
          totalAmount,
          paymentStatus: "paid",
          paymentDate: now,
        }).save();
      }

      // Increase payment count
      await School.findByIdAndUpdate(student.schoolId, {
        $inc: { totalPaymentCount: 1 },
      });
    }

    // -----------------------------
    // UPDATE SCHOOL MONTHLY PAYMENT DATA
    // -----------------------------
    const school = await School.findById(student.schoolId);

    let monthlyPaymentData = school.totalMonthlyPaymentCollection || [];

    // Remove old entry for same month
    monthlyPaymentData = monthlyPaymentData.filter(
      (entry) => entry.date !== paymentMonth
    );

    // Compute monthly totals fresh from DB
    const allPaymentsThisMonth = await PaymentHistory.find({
      schoolId: student.schoolId,
      paymentMonth,
    });

    const totalMonthlyCollection = allPaymentsThisMonth
      .filter((p) => p.paymentStatus === "paid")
      .reduce((sum, p) => sum + p.totalAmount, 0);

    const totalMonthlyDue = allPaymentsThisMonth
      .filter((p) => p.paymentStatus === "unpaid")
      .reduce((sum, p) => sum + p.totalAmount, 0);

    // Add updated entry
    monthlyPaymentData.push({
      date: paymentMonth,
      totalMonthlyCollection,
      totalMonthlyDue,
    });

    // Keep only last 12 months
    if (monthlyPaymentData.length > 12) {
      monthlyPaymentData.shift();
    }

    await School.findByIdAndUpdate(student.schoolId, {
      totalMonthlyPaymentCollection: monthlyPaymentData,
    });

    // -----------------------------
    // SEND PUSH NOTIFICATION
    // -----------------------------
    if (status === "paid" && student.expoToken) {
      try {
        await fetch("https://exp.host/--/api/v2/push/send", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: student.expoToken,
            sound: "default",
            title: "💰 পেমেন্ট সম্পন্ন হয়েছে!",
            body: "আপনার সন্তানের মাসিক ফি সফলভাবে পরিশোধ করা হয়েছে।",
            data: {
              studentId: student._id.toString(),
              guardianPhone: student.guardianPhone || null,
            },
          }),
        });
      } catch (pushErr) {
        console.warn("⚠️ Push notification failed:", pushErr);
      }
    }

    await student.save();

    return NextResponse.json(
      {
        success: true,
        message: "Payment status updated successfully",
        updatedStudent: student,
      },
      { status: 200 }
    );

  } catch (err) {
    console.error("❌ Error updating payment status:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update payment status",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
