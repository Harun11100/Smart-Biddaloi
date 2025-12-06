import { NextResponse } from "next/server";
import connectDb from "@/app/utils/db";
import Result from "@/app/model/Result";

export async function GET(req) {
  try {
    await connectDb();

    const { searchParams } = new URL(req.url);
    const schoolId = searchParams.get("schoolId");
    const studentId = searchParams.get("studentId");
    const examType = searchParams.get("examType");

    // Build dynamic filter
    const filter = {};
    if (schoolId) filter.schoolId = schoolId;
    if (studentId) filter.studentId = studentId;
    if (examType) filter.examType = examType;
    
    const results = await Result.find(filter).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, count: results.length, data: results });
  } catch (error) {
    console.error("GET results error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
