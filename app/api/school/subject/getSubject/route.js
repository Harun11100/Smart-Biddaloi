import { NextResponse } from "next/server";
import connectDb from "@/app/utils/db";
import Subject from "@/app/model/Subject";

export async function GET(req) {
  try {
    await connectDb();

    // Get schoolId from query parameters
    const { searchParams } = new URL(req.url);
    const schoolId = searchParams.get("schoolId");

    if (!schoolId) {
      return NextResponse.json(
        { success: false, message: "School ID is required" },
        { status: 400 }
      );
    }

    // Find all subjects for this school
    const subjects = await Subject.find({ schoolId });

    return NextResponse.json({
      success: true,
      message: "Subjects fetched successfully",
      subjects,
    });
  } catch (err) {
    console.error("Fetch Subjects Error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
