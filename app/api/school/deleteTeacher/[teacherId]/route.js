import Teacher from "@/app/model/Teacher";
import School from "@/app/model/School";
import connectDb from "@/app/utils/db";

export async function DELETE(req, { params }) {
  try {
    await connectDb();

    const { teacherId } = params;

    if (!teacherId) {
      return new Response(
        JSON.stringify({ success: false, message: "TeacherId is required" }),
        { status: 400 }
      );
    }

    // Find and delete the teacher
    const deletedTeacher = await Teacher.findByIdAndDelete(teacherId);

    if (!deletedTeacher) {
      return new Response(
        JSON.stringify({ success: false, message: "Teacher not found" }),
        { status: 404 }
      );
    }

    // Decrement totalTeachers in the associated school
    if (deletedTeacher.schoolId) {
      await School.findByIdAndUpdate(deletedTeacher.schoolId, { $inc: { totalTeachers: -1 } });
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Teacher deleted successfully",
        teacher: deletedTeacher,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting teacher:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500 }
    );
  }
}
