import School from "@/app/model/School";
import Student from "@/app/model/Student";
import connectDb from "@/app/utils/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDb();

    const { guardianPhone, expoToken, rollNumber, className, section } = await req.json();
    
    if (!guardianPhone || !rollNumber || !className) {
      return NextResponse.json(
        { success: false, message: "guardianPhone, rollNumber, and className are required." },
        { status: 400 }
      );
    }
    
    const student = await Student.findOne({ guardianPhone, roll: rollNumber, className, section });
    if (!student) {
      return NextResponse.json(
        { success: false, message: "Student not found." },
        { status: 404 }
      );
    }
    const school = await School.findById(student.schoolId);
    if (!school) {
      return NextResponse.json(
        { success: false, message: "School not found." },
        { status: 404 }
      );
    }

    // 📱 Save Expo push token if provided
    if (expoToken) {
      student.expoToken = expoToken;
      await student.save();
    }

    // ✂️ Safe student data
    const safeStudent = {
      studentId: student._id,
      schoolId: student.schoolId,
      classId: student.classId,
      phone:student.guardianPhone
    };
    return NextResponse.json({
      success: true,
      message: "Login successful!",
      student: safeStudent,
    });

  } catch (err) {
    console.error("❌ Login error message:", err.message);
    console.error("❌ Full stack:", err.stack);
    return NextResponse.json(
      { success: false, message: err.message || "Internal server error." },
      { status: 500 }
    );
  }
}
