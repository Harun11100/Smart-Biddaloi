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
      classId,
      creditHours,
      maxMarks,
      passingMarks,
    } = body;


    if (!name || !schoolId || !classId) {
      return NextResponse.json(
        { success: false, message: "Name, Code, School ID and Class ID are required" },
        { status: 400 }
      );
    }

    const subject = await Subject.create({
      name: name.trim(),
      code: code.trim(),
      schoolId,
      classId,
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
