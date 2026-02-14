import { NextResponse } from "next/server";
import connectDb from "@/app/utils/db";
import Subject from "@/app/model/Subject";

export async function GET(req) {
  try {
    await connectDb();

    // Get classId from query parameters
    const { searchParams } = new URL(req.url);
    const classId = searchParams.get("classId");

    if (!classId) {
      return NextResponse.json(
        { success: false, message: "Class ID is required" },
        { status: 400 }
      );
    }
    
    const subjects = await Subject.find({ classId });

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
