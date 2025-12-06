import { NextResponse } from "next/server";
import connectDb from "@/app/utils/db";
import Homework from "@/app/model/Homework";

export async function GET(req) {
  try {
    await connectDb();

    // ✅ Extract query params
    const { searchParams } = new URL(req.url);
    const schoolId = searchParams.get("schoolId");
    const classId = searchParams.get("classId");

    // ✅ Validation
    if (!schoolId || !classId) {
      return NextResponse.json(
        { success: false, message: "Missing schoolId or classId" },
        { status: 400 }
      );
    }

    // ✅ Fetch homework sorted by latest
    const homework = await Homework.find({ schoolId, classId }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      homework,
    });
  } catch (error) {
    console.error("Error fetching homework:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
