import { NextResponse } from "next/server";
import connectDb from "@/app/utils/db";
import Subject from "@/app/model/Subject";

export async function PUT(req) {
  try {
    await connectDb();

    const body = await req.json();
    const { subjectId, name, code, creditHours, maxMarks, passingMarks } = body;

    if (!subjectId) {
      return NextResponse.json(
        { success: false, message: "Subject ID is required" },
        { status: 400 }
      );
    }

    // Find the subject
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return NextResponse.json(
        { success: false, message: "Subject not found" },
        { status: 404 }
      );
    }

    // Check if new code already exists in the same school (exclude current subject)
    if (code && code.toUpperCase() !== subject.code) {
      const existing = await Subject.findOne({
        code: code.toUpperCase(),
        schoolId: subject.schoolId,
        _id: { $ne: subjectId },
      });

      if (existing) {
        return NextResponse.json(
          { success: false, message: "Subject code already exists" },
          { status: 409 }
        );
      }
    }

    // Update fields
    subject.name = name?.trim() || subject.name;
    subject.code = code ? code.toUpperCase().trim() : subject.code;
    subject.creditHours = Number(creditHours) ?? subject.creditHours;
    subject.maxMarks = Number(maxMarks) ?? subject.maxMarks;
    subject.passingMarks = Number(passingMarks) ?? subject.passingMarks;

    await subject.save();

    return NextResponse.json({
      success: true,
      message: "Subject updated successfully",
      subject,
    });
  } catch (err) {
    console.error("Update Subject Error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
