import Teacher from "@/app/model/Teacher";
import connectDb from "@/app/utils/db";
import mongoose from "mongoose";

export async function GET(
  req,
  { params } 
) {
  try {
    await connectDb();

    const { teacherId } = params;

    console.log("Fetching teacher with ID:", teacherId)

    // ✅ Validate ObjectId early
    if (!teacherId || !mongoose.Types.ObjectId.isValid(teacherId)) {
      return Response.json(
        { success: false, message: "Invalid Teacher ID" },
        { status: 400 }
      );
    }

    const teacher = await Teacher.findById(teacherId)
      .select("-password -loginOTP -loginOTPExpiry")
      .populate("schoolId", "name") // optional but useful
      .lean();

    if (!teacher) {
      return Response.json(
        { success: false, message: "Teacher not found" },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        teacher,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching teacher:", error);
    return Response.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
