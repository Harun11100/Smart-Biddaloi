import { NextResponse } from "next/server";
import connectDb from "@/app/utils/db";
import Subject from "@/app/model/Subject";

export async function DELETE(req) {
  try {
    await connectDb();

    const { searchParams } = new URL(req.url);
    const subjectId = searchParams.get("subjectId"); 

    if (!subjectId) {
      return NextResponse.json(
        { success: false, message: "Subject ID is required" },
        { status: 400 }
      );
    }

    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return NextResponse.json(
        { success: false, message: "Subject not found" },
        { status: 404 }
      );
    }

    await Subject.findByIdAndDelete(subjectId);

    return NextResponse.json({
      success: true,
      message: "Subject deleted successfully",
    });
  } catch (err) {
    console.error("Delete Subject Error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
