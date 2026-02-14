import Teacher from "@/app/model/Teacher";
import connectDb from "@/app/utils/db";

export async function PUT(req, { params }) {
  try {
    await connectDb();
    const { teacherId } = params;
    const body = await req.json();

    if (!teacherId) {
      return new Response(JSON.stringify({ success: false, message: "Teacher ID is required" }), { status: 400 });
    }

    const updateData = {
      name: body.name,
      email: body.email,
      userName: body.userName,
      phone: body.phone,
      role: body.role,
      classTeacher: body.classTeacher,
      experience: body.experience,
      address: body.address,
      bloodGroup: body.bloodGroup,
      nid: body.nid,
      imageUrl: body.imageUrl || null,
      gender: body.gender,
      subjects: (body.subjects || []).filter(Boolean),
    };

    // Update password only if provided
    if (body.password) {
      updateData.password = body.password;
    }

    const updatedTeacher = await Teacher.findByIdAndUpdate(
      teacherId,
      { $set: updateData },
      { new: true, runValidators: true, context: "query" }
    ).select("-password");

    if (!updatedTeacher) {
      return new Response(JSON.stringify({ success: false, message: "Teacher not found" }), { status: 404 });
    }

    return new Response(
      JSON.stringify({ success: true, message: "Teacher updated successfully", teacher: updatedTeacher }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating teacher:", error);
    return new Response(JSON.stringify({ success: false, message: "Server error" }), { status: 500 });
  }
}
