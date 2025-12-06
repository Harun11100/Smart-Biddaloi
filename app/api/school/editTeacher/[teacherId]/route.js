import Teacher from "@/app/model/Teacher";
import connectDb from "@/app/utils/db";

export async function PUT(req, { params }) {
  try {
    await connectDb();

    const { teacherId } = params;
    const body = await req.json();

    if (!teacherId) {
      return new Response(
        JSON.stringify({ success: false, message: "Teacher ID is required" }),
        { status: 400 }
      );
    }

    // Update teacher data
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      teacherId,
      {
        $set: {
          name: body.name,
          email: body.email,
          phone: body.phone,
          subjects: body.subjects,
          role: body.role,
          classTeacher: body.classTeacher,
        },
      },
      { new: true }
    ).select("-password"); // Hide password for security

    if (!updatedTeacher) {
      return new Response(
        JSON.stringify({ success: false, message: "Teacher not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Teacher updated successfully",
        teacher: updatedTeacher,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating teacher:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500 }
    );
  }
}
