import { NextResponse } from "next/server";
import connectDb from "@/app/utils/db";
import Result from "@/app/model/Result";

export async function DELETE(req) {
  try {
    await connectDb();

    const { studentId, schoolId, resultId } = await req.json();

    if (!studentId || !schoolId || !resultId) {
      return NextResponse.json(
        { success: false, error: "Missing studentId, schoolId or resultId" },
        { status: 400 }
      );
    }

    // Match all fields to prevent unauthorized deletion
    const deleted = await Result.findOneAndDelete({
      _id: resultId,
      studentId: studentId,
      schoolId: schoolId,
    });

    if (!deleted) {
      return NextResponse.json({
        success: false,
        message:
          "Result not found or does not match the provided student/school ID",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Result deleted successfully",
    });
  } catch (error) {
    console.error("❌ Delete result error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete result" },
      { status: 500 }
    );
  }
}
