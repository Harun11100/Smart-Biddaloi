import { NextResponse } from "next/server";
import mongoose from "mongoose";

import Semester from "@/app/model/Semester";
import School from "@/app/model/School";
import connectDb from "@/app/utils/db";

export async function POST(req) {
  try {
    await connectDb();

    const body = await req.json();

    const {
      name,
      academicYear,
      schoolId,
      startDate,
      endDate,
      status,
    } = body;

    // -----------------------------
    // Validate required fields
    // -----------------------------

    if (
      !name ||
      !academicYear ||
      !schoolId ||
      !startDate ||
      !endDate
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "name, academicYear, schoolId, startDate and endDate are required",
        },
        { status: 400 }
      );
    }

    // -----------------------------
    // Validate ObjectId
    // -----------------------------

    if (!mongoose.Types.ObjectId.isValid(schoolId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid schoolId",
        },
        { status: 400 }
      );
    }

    // -----------------------------
    // Check school exists
    // -----------------------------

    const school = await School.findById(schoolId);

    if (!school) {
      return NextResponse.json(
        {
          success: false,
          message: "School not found",
        },
        { status: 404 }
      );
    }

    // -----------------------------
    // Validate dates
    // -----------------------------

    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    if (
      isNaN(parsedStartDate.getTime()) ||
      isNaN(parsedEndDate.getTime())
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid startDate or endDate",
        },
        { status: 400 }
      );
    }

    if (parsedEndDate < parsedStartDate) {
      return NextResponse.json(
        {
          success: false,
          message:
            "End date must be after start date",
        },
        { status: 400 }
      );
    }

    // -----------------------------
    // Validate status
    // -----------------------------

    const allowedStatuses = [
      "upcoming",
      "active",
      "completed",
    ];

    const semesterStatus =
      status || "upcoming";

    if (
      !allowedStatuses.includes(
        semesterStatus
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid semester status",
        },
        { status: 400 }
      );
    }

    // -----------------------------
    // Check duplicate semester
    // -----------------------------

    const existingSemester =
      await Semester.findOne({
        schoolId,
        academicYear: academicYear.trim(),
        name: name.trim(),
      });

    if (existingSemester) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This semester already exists for this academic year.",
        },
        { status: 409 }
      );
    }

    // -----------------------------
    // Create semester
    // -----------------------------

    const semester =
      await Semester.create({
        name: name.trim(),
        academicYear:
          academicYear.trim(),
        schoolId,

        startDate: parsedStartDate,
        endDate: parsedEndDate,

        status: semesterStatus,
      });

    // -----------------------------
    // Response
    // -----------------------------

    return NextResponse.json(
      {
        success: true,
        message:
          "Semester created successfully",
        data: semester,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Create semester error:",
      error
    );

    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This semester already exists for this academic year.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          "Internal server error",
      },
      { status: 500 }
    );
  }
}