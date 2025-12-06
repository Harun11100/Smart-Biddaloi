import { NextResponse } from "next/server";
import connectDb from "@/app/utils/db";
import Student from "@/app/model/Student";
import School from "@/app/model/School";
import PaymentHistory from "@/app/model/PaymentHistory";

export async function PUT(req) {
  try {
    await connectDb();

    const { studentId, classId, status } = await req.json();

    // ✅ Validate inputs
    if (!studentId || !classId || !status) {
      return NextResponse.json(
        { success: false, message: "Missing required fields (studentId, classId, status)" },
        { status: 400 }
      );
    }

    if(status === "unpaid"){
      return NextResponse.json(
        { success: false, message: " দয়া করে পেমেন্ট ইতিহাস থেকে স্ট্যাটাস আপডেট করুন " },
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

    // ✅ Month & Year (in Bengali)
    const paymentMonth = now.toLocaleString("bn-BD", {
      month: "long",
      year: "numeric",
    });

    // ✅ Update total due amount based on new status
    if (status === "paid") {
      student.totalDueAmount = Math.max(student.totalDueAmount - totalAmount, 0);
      student.totalPaidAmount += totalAmount
    } 

    student.paymentStatus = status;
    const existing = await PaymentHistory.findOne({ studentId, paymentMonth });

    if (status === "paid") {
      if (existing) {
        // 🔄 If record exists and was unpaid, update it to paid
        if (existing.paymentStatus === "unpaid") {
          existing.paymentStatus = "paid";
          existing.paymentDate = now;
          await existing.save();
        }
      } else {
        // 🆕 If not exist, create new record
        const newHistory = new PaymentHistory({
          studentId,
          schoolId: student.schoolId,
          paymentMonth,
          totalAmount,
          paymentStatus: "paid",
          paymentDate: now,
        });
        await newHistory.save();
      }

      // ✅ Update school’s payment count
      if (student.schoolId) {
        await School.findByIdAndUpdate(
          student.schoolId,
          { $inc: { totalPaymentCount: 1 } },
          { upsert: true }
        );
      }

      // ✅ Send Expo push notification (if token exists)
      if (student.expoToken) {
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
              body: "প্রিয় অভিভাবক, আপনার সন্তানের মাসিক ফি সফলভাবে পরিশোধ করা হয়েছে। ধন্যবাদ আমাদের সঙ্গে থাকার জন্য।",
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
    }

    // 💾 Save student data
    await student.save();

    return NextResponse.json(
      {
        success: true,
        message:
          existing && existing.paymentStatus === "paid"
            ? "Current month's payment updated successfully"
            : !existing
            ? "Payment recorded successfully"
            : "Payment status updated successfully",
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
