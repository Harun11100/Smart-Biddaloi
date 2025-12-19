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

    // Build update object dynamically to avoid overwriting undefined fields
    const updateData = {
      name: body.name,
      email: body.email,
      phone: body.phone,
      subjects: Array.isArray(body.subjects) ? body.subjects : [],
      role: body.role,
      classTeacher: body.classTeacher,
      gender: body.gender || "male",
      address: body.address || "",
      bloodGroup: body.bloodGroup || "",
      nid: body.nid || "",
    };

    // Update teacher data
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      teacherId,
      { $set: updateData },
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
        data: updatedTeacher,
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
