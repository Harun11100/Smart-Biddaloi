import { NextResponse } from "next/server";
import connectDb from "@/app/utils/db";
import Attendance from "@/app/model/Attendance";

export async function PUT(req) {
  try {
    await connectDb();

    const { schoolId, classId, date, attendance } = await req.json();

    // ✅ Validate required fields
    if (!schoolId || !classId || !date || !attendance || !Array.isArray(attendance)) {
      return NextResponse.json(
        { success: false, message: "Missing or invalid input fields." },
        { status: 400 }
      );
    }

    // ✅ Find today's attendance record
    const existing = await Attendance.findOne({ schoolId, classId, date });
    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Attendance record not found for today." },
        { status: 404 }
      );
    }

    // ✅ Merge updated statuses
    const updatedList = existing.attendance.map((student) => {
      const updated = attendance.find(
        (s) => s.studentId.toString() === student.studentId.toString()
      );
      return updated ? { ...student.toObject(), status: updated.status } : student;
    });

    existing.attendance = updatedList;
    await existing.save();

    return NextResponse.json({
      success: true,
      message: "Attendance updated successfully.",
      attendance: existing,
    });
  } catch (error) {
    console.error("❌ Error updating attendance:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update attendance.", error: error.message },
      { status: 500 }
    );
  }
}
