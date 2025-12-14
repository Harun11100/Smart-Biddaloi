import { NextResponse } from "next/server";
import connectDb from "@/app/utils/db";
import Subject from "@/app/model/Subject";

export async function POST(req) {
  try {
    await connectDb();

    const body = await req.json();
    const {
      name,
      code,
      schoolId,
      creditHours,
      maxMarks,
      passingMarks,
    } = body;

    // 🔴 Validation
    if (!name || !code || !schoolId) {
      return NextResponse.json(
        { success: false, message: "Name, Code and School ID are required" },
        { status: 400 }
      );
    }

    // 🔴 Check duplicate subject code in same school
    const existing = await Subject.findOne({
      code: code.toUpperCase(),
      schoolId,
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: "Subject code already exists" },
        { status: 409 }
      );
    }

    // ✅ Create subject
    const subject = await Subject.create({
      name: name.trim(),
      code: code.toUpperCase().trim(),
      schoolId,
      creditHours:Number(creditHours),
      maxMarks:Number(maxMarks),
      passingMarks:Number(passingMarks),
    });

    return NextResponse.json({
      success: true,
      message: "Subject created successfully",
      subject,
    });
  } catch (error) {
    console.error("Create Subject Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
