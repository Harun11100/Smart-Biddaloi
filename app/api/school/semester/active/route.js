import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDb from "@/app/utils/db";
import Semester from "@/app/model/Semester";

export async function GET(req) {
  try {
    await connectDb();

    const { searchParams } = new URL(req.url);
    const schoolId = searchParams.get("schoolId");

    // Validate schoolId
    if (!schoolId) {
      return NextResponse.json(
        {
          success: false,
          message: "schoolId is required.",
        },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(schoolId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid schoolId.",
        },
        { status: 400 }
      );
    }

    // Find active semester
    const activeSemester = await Semester.findOne({
      schoolId: new mongoose.Types.ObjectId(schoolId),
      status: "active",
    })
      .sort({ startDate: -1 })
      .lean();

    // No active semester
    if (!activeSemester) {
      return NextResponse.json(
        {
          success: false,
          active: false,
          message: "No active semester found.",
          data: null,
        },
        { status: 404 }
      );
    }

    // Active semester found
    return NextResponse.json(
      {
        success: true,
        active: true,
        message: "Active semester fetched successfully.",
        data: activeSemester,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Get active semester error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch active semester.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}