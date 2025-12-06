import { NextResponse } from "next/server";
import connectDb from "@/app/utils/db";
import Student from "@/app/model/Student";
import Attendance from "@/app/model/Attendance";

export async function GET(req) {
  try {
    await connectDb();

    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");

    if (!studentId) {
      return NextResponse.json(
        { success: false, message: "Student ID is required" },
        { status: 400 }
      );
    }

    // ✅ 1. Find Student
    const student = await Student.findById(studentId);
    if (!student) {
      return NextResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 }
      );
    }

    // Format today's date: "DD-MM-YYYY"
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    const todayDate = `${dd}-${mm}-${yyyy}`;

    // ✅ 2. Find today's attendance for student's class & school
    const todayAttendance = await Attendance.findOne({
      classId: student.classId,
      schoolId: student.schoolId,
      date: todayDate,
      "attendance.studentId": studentId
    });

    let attendanceStatus = "not_taken"; // default

    if (todayAttendance) {
      const record = todayAttendance.attendance.find(
        (s) => s.studentId.toString() === studentId
      );
      if (record) {
        attendanceStatus = record.status;
      }
    }

    // ✅ 3. Return data
    return NextResponse.json({
      success: true,
      profile: student,
      todayAttendance: attendanceStatus,
      date: todayDate,
    });

  } catch (error) {
    console.error("Error fetching student profile:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
