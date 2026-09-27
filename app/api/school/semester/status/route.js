import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDb from "@/app/utils/db";
import Semester from "@/app/model/Semester";

export async function PATCH(req) {
  try {
    await connectDb();

    const body = await req.json();

    const {
      schoolId,
      semesterId,
      status,
    } = body;

    // -----------------------------
    // VALIDATION
    // -----------------------------

    if (!schoolId || !semesterId || !status) {
      return NextResponse.json(
        {
          success: false,
          message:
            "schoolId, semesterId and status are required.",
        },
        { status: 400 }
      );
    }

    if (
      !mongoose.Types.ObjectId.isValid(schoolId) ||
      !mongoose.Types.ObjectId.isValid(semesterId)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid schoolId or semesterId.",
        },
        { status: 400 }
      );
    }

    // Only these three statuses are allowed
    const allowedStatuses = [
      "upcoming",
      "active",
      "completed",
    ];

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid status. Status must be upcoming, active or completed.",
        },
        { status: 400 }
      );
    }

    // -----------------------------
    // CHECK SEMESTER
    // -----------------------------

    const semester = await Semester.findOne({
      _id: semesterId,
      schoolId: schoolId,
    });

    if (!semester) {
      return NextResponse.json(
        {
          success: false,
          message: "Semester not found.",
        },
        { status: 404 }
      );
    }

    // -----------------------------
    // ALREADY SAME STATUS
    // -----------------------------

    if (semester.status === status) {
      return NextResponse.json(
        {
          success: true,
          message: `Semester is already ${status}.`,
          data: semester,
        },
        { status: 200 }
      );
    }

    // -----------------------------
    // IF ACTIVATING A SEMESTER
    // -----------------------------
    // Make the previous active semester
    // completed automatically.

    if (status === "active") {
      await Semester.updateMany(
        {
          schoolId: schoolId,
          status: "active",
          _id: {
            $ne: semesterId,
          },
        },
        {
          $set: {
            status: "completed",
          },
        }
      );
    }

    // -----------------------------
    // UPDATE SELECTED SEMESTER
    // -----------------------------

    semester.status = status;

    await semester.save();

    // -----------------------------
    // RESPONSE
    // -----------------------------

    return NextResponse.json(
      {
        success: true,
        message: `Semester status changed to ${status} successfully.`,
        data: semester,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "❌ Update semester status error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to update semester status.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}