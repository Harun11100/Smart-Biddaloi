import { NextResponse } from "next/server";
import connectDb from "@/app/utils/db";
import Homework from "@/app/model/Homework";
import mongoose from "mongoose";

export async function DELETE(req) {
  try {
    await connectDb();

    let homeworkId = null;

    // 1. Try to read from query params first (e.g. ?homeworkId=xxx)
    const { searchParams } = new URL(req.url);
    homeworkId = searchParams.get("homeworkId");

    // 2. If not in query params, try to read from JSON body safely
    if (!homeworkId) {
      try {
        const body = await req.json();
        homeworkId = body?.homeworkId;
      } catch (err) {
        // req.json() throws if request body is empty; safely ignore
      }
    }

    // 3. Validation: Check if homeworkId was provided
    if (!homeworkId) {
      return NextResponse.json(
        { success: false, message: "Homework ID required" },
        { status: 400 }
      );
    }

    // 4. Validation: Check if homeworkId is a valid MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(homeworkId)) {
      return NextResponse.json(
        { success: false, message: "Invalid Homework ID format" },
        { status: 400 }
      );
    }

    // 5. Perform deletion
    const deletedHomework = await Homework.findByIdAndDelete(homeworkId);

    if (!deletedHomework) {
      return NextResponse.json(
        { success: false, message: "Homework not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Homework deleted successfully",
        deletedHomework,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting homework:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}