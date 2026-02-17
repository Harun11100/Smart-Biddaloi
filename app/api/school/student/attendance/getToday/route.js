// src/app/api/school/student/attendance/getToday/route.js
import { NextResponse } from "next/server";
import connectDb from "@/app/utils/db";
import Attendance from "@/app/model/Attendance";
import Student from "@/app/model/Student";

export async function POST(req) {
  try {
    await connectDb();
    const { schoolId, classId, date } = await req.json();

    if (!schoolId || !classId || !date) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    // Check if attendance already exists
    const todayAttendance = await Attendance.findOne({ schoolId, classId, date });
    
    

    if (todayAttendance) {
      return NextResponse.json({
        success: true,
        alreadyTaken: true,
        attendance: todayAttendance.attendance,
      });
    }

    // If not taken yet, return full student list
    const students = await Student.find({ schoolId, classId }).select("name roll _id");
    
    return NextResponse.json({
      success: true,
      alreadyTaken: false,
      students,
    });
  } catch (err) {
    console.error("Error getting today's attendance:", err);
    return NextResponse.json(
      { success: false, message: "Failed to get attendance" },
      { status: 500 }
    );
  }
}
