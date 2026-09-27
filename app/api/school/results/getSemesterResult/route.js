import { NextResponse } from "next/server";
import mongoose from "mongoose";

import connectDb from "@/app/utils/db";
import SemesterResult from "@/app/model/SemesterResult";

export async function GET(req) {
  try {
    await connectDb();

    const { searchParams } = new URL(req.url);

    const schoolId = searchParams.get("schoolId");
    const studentId = searchParams.get("studentId");
    const semesterId = searchParams.get("semesterId");

    // Required fields
    if (!schoolId || !studentId || !semesterId) {
      return NextResponse.json(
        {
          success: false,
          message: "schoolId, studentId and semesterId are required.",
        },
        { status: 400 }
      );
    }

    // Validate ObjectIds
    if (
      !mongoose.Types.ObjectId.isValid(schoolId) ||
      !mongoose.Types.ObjectId.isValid(studentId) ||
      !mongoose.Types.ObjectId.isValid(semesterId)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid ID format.",
        },
        { status: 400 }
      );
    }

    // Find student's semester result
    const result = await SemesterResult.findOne({
      schoolId,
      studentId,
      semesterId,
    })
      .populate("subjects.subjectId", "name code")
      .populate("subjects.teacherId", "name")
      .lean();

    // No result found
    if (!result) {
      return NextResponse.json(
        {
          success: true,
          message: "No result found for this semester.",
          data: null,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Semester result fetched successfully.",
        data: result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Get semester result error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error.",
      },
      { status: 500 }
    );
  }
}