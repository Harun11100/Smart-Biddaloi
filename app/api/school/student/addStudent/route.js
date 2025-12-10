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

    // Required fields
    const requiredFields = [
      "name",
      "roll",
      "className",
      "gender",
      "guardianPhone",
      "tuitionFee",
      "coachingFee",
      "address",
      "schoolId",
      "classId",
    ];

    const missing = requiredFields.filter((field) => !body[field]);

    if (missing.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide all required fields.",
          missingFields: missing,
        },
        { status: 400 }
      );
    }

    await connectDb();

    // Check if student already exists in same class & school
    const existing = await Student.findOne({ roll, classId, schoolId });

    if (existing) {
      return NextResponse.json(
        { success: false, message: "A student with this roll already exists." },
        { status: 409 }
      );
    }

    const totalMonthlyFees = Number(tuitionFee) + Number(coachingFee);

    // Create student
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
      totalMonthlyFees,
      address,
      schoolId,
      classId,
    });

    // Update counts concurrently
    await Promise.all([
      Class.findByIdAndUpdate(classId, { $inc: { studentCount: 1 } }),
      School.findByIdAndUpdate(schoolId, { $inc: { totalStudents: 1 } }),
      School.findByIdAndUpdate(schoolId, { $inc: { totalStudentFees: totalMonthlyFees } })
    ]);

    // Update gender counters
    const genderField =
      gender === "male" ? "maleStudents" : gender === "female" ? "femaleStudents" : null;

    if (genderField) {
      await School.findByIdAndUpdate(schoolId, { $inc: { [genderField]: 1 } });
     
    }

    return NextResponse.json(
      {
        success: true,
        message: "Student added successfully!",
        student: newStudent,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating student:", error);
    return NextResponse.json(
      { success: false, message: "A server error occurred." },
      { status: 500 }
    );
  }
}
