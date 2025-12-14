import connectDb from "@/app/utils/db";
import Student from "@/app/model/Student";
import Class from "@/app/model/Class";

export async function PUT(req, { params }) {
  try {
    await connectDb();
    const body = await req.json();

    const studentId = params?.studentId || body.studentId;
    if (!studentId) {
      return new Response(
        JSON.stringify({ success: false, message: "studentId is required" }),
        { status: 400 }
      );
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return new Response(
        JSON.stringify({ success: false, message: "Student not found" }),
        { status: 404 }
      );
    }

    // --- Convert numeric fields safely ---
    const tuitionFee = body.tuitionFee !== undefined ? Number(body.tuitionFee) : student.tuitionFee;
    const coachingFee = body.coachingFee !== undefined ? Number(body.coachingFee) : student.coachingFee;
    const monthlyAbsent = body.monthlyAbsent !== undefined ? Number(body.monthlyAbsent) : student.monthlyAbsent;
    const totalMonthlyFees = body.totalMonthlyFees !== undefined ? Number(body.totalMonthlyFees) : student.totalMonthlyFees;
    const totalDueAmount = body.totalDueAmount !== undefined ? Number(body.totalDueAmount) : student.totalDueAmount;
    const totalPaidAmount = body.totalPaidAmount !== undefined ? Number(body.totalPaidAmount) : student.totalPaidAmount;

    // --- Check if classId changed ---
    const isClassChanged = body.classId && body.classId !== student.classId;

    if (isClassChanged) {
      // Remove student from old class
      await Class.findByIdAndUpdate(student.classId, { $pull: { students: student._id } });
      // Add student to new class
      await Class.findByIdAndUpdate(body.classId, { $addToSet: { students: student._id } });
    }

    // --- Prepare the update payload ---
    const updatePayload = {
      ...body,
      tuitionFee,
      coachingFee,
      monthlyAbsent,
      totalMonthlyFees,
      totalDueAmount,
      totalPaidAmount,
    };

    // --- Update student in DB ---
    const updatedStudent = await Student.findByIdAndUpdate(studentId, { $set: updatePayload }, { new: true });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Student updated successfully",
        data: updatedStudent,
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error("Error updating student:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Server error",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
