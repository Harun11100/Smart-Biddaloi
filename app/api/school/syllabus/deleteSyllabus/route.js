import { NextResponse } from "next/server";
import connectDb from "@/app/utils/db";
import Syllabus from "@/app/model/Syllabus";

export async function DELETE(req) {
  try {
    await connectDb();
    const { syllabusId } = await req.json();

    if (!syllabusId) {
      return NextResponse.json({
        success: false,
        message: "Missing syllabusId",
      });
    }

    const deleted = await Syllabus.findByIdAndDelete(syllabusId);

    if (!deleted) {
      return NextResponse.json({
        success: false,
        message: "Syllabus not found",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Syllabus deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting syllabus:", err);
    return NextResponse.json({
      success: false,
      message: "Failed to delete syllabus",
      error: err.message,
    });
  }
}
