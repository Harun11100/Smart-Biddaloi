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
      classId,
      section,
      gender,
      guardianPhone,
      guardianName,
      tuitionFee,
      coachingFee,
      address,
      schoolId,
      bloodGroup,
      remarks,
      dateOfBirth,
    } = body;

    // Required fields
    const requiredFields = [
      "name",
      "roll",
      "classId",
      "gender",
      "guardianPhone",
      "tuitionFee",
      "coachingFee",
      "address",
      "schoolId",
    ];

    // Check missing fields with numeric fields handled
    const missing = requiredFields.filter((field) => {
      const value = body[field];
      if (field === "tuitionFee" || field === "coachingFee") {
        return value === undefined || value === null;
      }
      return !value;
    });

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

    // Check if student already exists in the same class & school
    const existing = await Student.findOne({ roll, classId, schoolId });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "A student with this roll already exists." },
        { status: 409 }
      );
    }

    const tuition = Number(tuitionFee);
    const coaching = Number(coachingFee);
    const totalMonthlyFees = tuition + coaching;

    // Fetch class info
    const cls = await Class.findById(classId);
    const className = cls?.className || "";

    // Create student
    const newStudent = await Student.create({
      name,
      roll,
      className,
      section: section || "",
      gender,
      guardianPhone,
      guardianName: guardianName || "",
      tuitionFee: tuition,
      coachingFee: coaching,
      totalMonthlyFees,
      address,
      schoolId,
      classId,
      bloodGroup: bloodGroup || "",
      remarks: remarks || "",
      dateOfBirth,
      totalDueAmount: totalMonthlyFees,
      totalPaidAmount: 0,
      monthlyAbsent: 0,
    });

    // Update counts
    await Promise.all([
      Class.findByIdAndUpdate(classId, { $inc: { studentCount: 1 } }),
      School.findByIdAndUpdate(schoolId, { $inc: { totalStudents: 1, totalStudentFees: totalMonthlyFees } }),
      gender === "male"
        ? School.findByIdAndUpdate(schoolId, { $inc: { maleStudents: 1 } })
        : gender === "female"
        ? School.findByIdAndUpdate(schoolId, { $inc: { femaleStudents: 1 } })
        : null,
    ]);

    return NextResponse.json(
      { success: true, message: "Student added successfully!", student: newStudent },
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
