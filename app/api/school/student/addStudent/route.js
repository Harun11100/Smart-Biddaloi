import Class from "@/app/model/Class";
import School from "@/app/model/School";
import Student from "@/app/model/Student";
import connectDb from "@/app/utils/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      name,
      roll,
      className,
      section,
      gender,
      guardianPhone,
      guardianName,
      tuitionFee,
      coachingFee,
      address,
      schoolId,
      classId,
    } = body;

    // Basic validation
    if (
      !name ||
      !roll ||
      !className ||
      !gender ||
      !guardianPhone ||
      !tuitionFee ||
      !coachingFee ||
      !address ||
      !schoolId ||
      !classId
    ) {
      return NextResponse.json(
        { success: false, message: "সব প্রয়োজনীয় তথ্য প্রদান করুন।" },
        { status: 400 }
      );
    }

    await connectDb();

    // Check if student already exists
    const existing = await Student.findOne({ roll, classId, schoolId });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "এই রোল নম্বরের ছাত্র ইতিমধ্যে আছে।" },
        { status: 409 }
      );
    }

    // Create new student
    const newStudent = await Student.create({
      name,
      roll,
      className,
      section,
      gender,
      guardianPhone,
      guardianName,
      tuitionFee,
      coachingFee,
      address,
      schoolId,
      classId,
    });

    // Increment counts concurrently
    await Promise.all([
      Class.findByIdAndUpdate(classId, { $inc: { studentCount: 1 } }),
      School.findByIdAndUpdate(schoolId, { $inc: { totalStudents: 1 } }),
    ]);

    return NextResponse.json(
      {
        success: true,
        message: "ছাত্র সফলভাবে যুক্ত হয়েছে!",
        student: newStudent,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating student:", error);
    return NextResponse.json(
      { success: false, message: "সার্ভার ত্রুটি হয়েছে।" },
      { status: 500 }
    );
  }
}
