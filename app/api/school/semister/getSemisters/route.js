import { NextResponse } from "next/server";
import Semester from "@/app/model/Semester";
import connectDb from "@/app/utils/db";

export async function GET(req) {
  try {
    await connectDb();

    const { searchParams } = new URL(req.url);
    const schoolId = searchParams.get("schoolId");

    if (!schoolId) {
      return NextResponse.json(
        {
          success: false,
          message: "schoolId is required",
        },
        { status: 400 }
      );
    }

    const semesters = await Semester.find({
      schoolId,
    }).sort({
      startDate: 1,
    });

    return NextResponse.json(
      {
        success: true,
        schoolId,
        totalSemesters: semesters.length,
        data: semesters,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get semesters error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}