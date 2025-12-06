import { NextResponse } from "next/server";
import connectDb from "@/app/utils/db";
import Syllabus from "@/app/model/Syllabus";

export async function GET(req) {
  try {
    await connectDb();
    const { searchParams } = new URL(req.url);
    const schoolId = searchParams.get("schoolId");
    const classId = searchParams.get("classId");

    if (!schoolId || !classId) {
      return NextResponse.json({
        success: false,
        message: "Missing schoolId or classId",
      });
    }

    const syllabus = await Syllabus.find({ schoolId, classId }).sort({
      createdAt: -1,
    });

    return NextResponse.json({ success: true, syllabus });
  } catch (err) {
    console.error("Error fetching syllabus:", err);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch syllabus",
      error: err.message,
    });
  }
}
