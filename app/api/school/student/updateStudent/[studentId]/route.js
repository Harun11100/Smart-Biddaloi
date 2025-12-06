import connectDb from "@/app/utils/db";
import Student from "@/app/model/Student";
import Class from "@/app/model/Class";

export async function PUT(req, { params }) {
  try {
    await connectDb();
    const { studentId } = params;
    const body = await req.json();

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

    // Check if className or sectionName changed
    const isClassChanged =
      body.className && body.className !== student.className ||
      body.section && body.section !== student.section;

    if (isClassChanged) {
      // Remove student ID from old class
      await Class.findByIdAndUpdate(student.classId, {
        $pull: { students: student._id },
      });

      // Find new class by schoolId, className, sectionName
      const newClass = await Class.findOne({
        schoolId: student.schoolId,
        className: body.className,
        sectionName: body.section,
      });

      if (!newClass) {
        return new Response(
          JSON.stringify({ success: false, message: "New class not found" }),
          { status: 404 }
        );
      }

      // Update student.classId to new class ID
      body.classId = newClass._id;

      // Add student ID to new class
      await Class.findByIdAndUpdate(newClass._id, {
        $addToSet: { students: student._id },
      });
    }

    // Update student document
    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      { $set: body },
      { new: true }
    );

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
