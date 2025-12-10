import Student from "@/app/model/Student";
import School from "@/app/model/School";
import Class from "@/app/model/Class";
import connectDb from "@/app/utils/db";

export async function DELETE(req, { params }) {
  try {
    await connectDb();

    const { studentId } = params;

    if (!studentId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "studentId is required",
        }),
        { status: 400 }
      );
    }

    // Delete student
    const deletedStudent = await Student.findByIdAndDelete(studentId);

    if (!deletedStudent) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Student not found",
        }),
        { status: 404 }
      );
    }

    // Update school total count
    if (deletedStudent.schoolId) {
      await School.findByIdAndUpdate(deletedStudent.schoolId, {
        $inc: { totalStudents: -1 },
      });
        await School.findByIdAndUpdate(deletedStudent.schoolId, {
        $inc: { totalStudentFees: - deletedStudent.totalMonthlyFees },
      });
    }

    // Update class student count
    if (deletedStudent.classId) {
      await Class.findByIdAndUpdate(deletedStudent.classId, {
        $inc: { studentCount: -1 },
      });
    }

    // Update gender count
    const gender = deletedStudent.gender;
    const genderField =
      gender === "male"
        ? "maleStudents"
        : gender === "female"
        ? "femaleStudents"
        : null;

    if (genderField && deletedStudent.schoolId) {
      await School.findByIdAndUpdate(deletedStudent.schoolId, {
        $inc: { [genderField]: -1 },
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Student deleted successfully",
        student: deletedStudent,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error deleting student:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal server error",
      }),
      { status: 500 }
    );
  }
}
