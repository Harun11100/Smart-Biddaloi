import connectDb from "@/app/utils/db";
import Student from "@/app/model/Student";
import PaymentHistory from "@/app/model/PaymentHistory";

export async function PUT(req) {
  try {
    await connectDb();

    const { studentId, schoolId } = await req.json();

    if (!studentId || !schoolId) {
      return Response.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return Response.json(
        { success: false, message: "Student not found" },
        { status: 404 }
      );
    }

    const totalAmount = (student.tuitionFee || 0) + (student.coachingFee || 0);
    const now = new Date();

    const paymentMonth = now.toLocaleString("bn-BD", {
      month: "long",
      year: "numeric",
    });

    student.totalDueAmount += totalAmount;
    student.paymentStatus = "unpaid";
    await student.save();

    // ✅ Check if this student's payment history for this month already exists
    const existing = await PaymentHistory.findOne({ studentId, paymentMonth });

    if (!existing) {
      const newHistory = new PaymentHistory({
        studentId,
        schoolId,
        paymentMonth,
        totalAmount,
        paymentStatus: "unpaid",
        paymentDate: now,
      });
      await newHistory.save();
    }

    return Response.json(
      { success: true, message: "Payment updated successfully" },
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
