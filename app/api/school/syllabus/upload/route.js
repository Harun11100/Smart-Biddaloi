import { NextResponse } from "next/server";
import connectDb from "@/app/utils/db";
import Syllabus from "@/app/model/Syllabus";

export async function POST(req) {
  try {
    await connectDb();

    const { schoolId, classId, subject, description, date } = await req.json();

    if (!schoolId || !classId || !subject || !description || !date) {
      return NextResponse.json({
        success: false,
        message: "All fields are required",
      });
    }

    const syllabus = await Syllabus.create({
      schoolId,
      classId,
      subject,
      description,
      date: new Date(date),
    });

    return NextResponse.json({
      success: true,
      message: "Syllabus uploaded successfully",
      syllabus,
    });
  } catch (err) {
    console.error("Error uploading syllabus:", err);
    return NextResponse.json({
      success: false,
      message: "Failed to upload syllabus",
      error: err.message,
    });
  }
}
