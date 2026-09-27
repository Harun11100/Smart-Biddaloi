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

    console.log("=================================");
    console.log("GET PUBLISHED SEMESTER RESULT");
    console.log("schoolId:", schoolId);
    console.log("studentId:", studentId);
    console.log("semesterId:", semesterId);
    console.log("=================================");

    // -----------------------------------
    // REQUIRED FIELDS
    // -----------------------------------

    if (!schoolId || !studentId || !semesterId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "schoolId, studentId and semesterId are required.",
        },
        { status: 400 }
      );
    }

    // -----------------------------------
    // VALIDATE OBJECT IDS
    // -----------------------------------

    if (
      !mongoose.Types.ObjectId.isValid(schoolId) ||
      !mongoose.Types.ObjectId.isValid(studentId) ||
      !mongoose.Types.ObjectId.isValid(semesterId)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid ObjectId.",
        },
        { status: 400 }
      );
    }

    console.log("IDs are valid.");

    // -----------------------------------
    // FIND ONLY PUBLISHED RESULT
    // -----------------------------------

    const result = await SemesterResult.findOne({
      schoolId,
      studentId,
      semesterId,
      status: "published",
    }).lean();

    console.log("Published result:", result);

    // -----------------------------------
    // NO PUBLISHED RESULT
    // -----------------------------------

    if (!result) {
      return NextResponse.json(
        {
          success: true,
          published: false,
          message:
            "Semester result has not been published yet.",
          data: null,
        },
        { status: 200 }
      );
    }

    // -----------------------------------
    // PUBLISHED RESULT FOUND
    // -----------------------------------

    return NextResponse.json(
      {
        success: true,
        published: true,
        message:
          "Semester result fetched successfully.",
        data: result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "❌ GET PUBLISHED SEMESTER RESULT ERROR:"
    );
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}