import { NextResponse } from "next/server";
import connectDb from "@/app/utils/db";
import Attendance from "@/app/model/Attendance";
import School from "@/app/model/School";

export async function PUT(req) {
  try {
    await connectDb();

    const { schoolId, classId, date, attendance } = await req.json();

    if (!schoolId || !classId || !date || !attendance || !Array.isArray(attendance)) {
      return NextResponse.json(
        { success: false, message: "Missing or invalid input fields." },
        { status: 400 }
      );
    }

    const normalizedDate = date.replace(/\//g, "-"); // normalize date

    // Find the attendance record for this class
    const existing = await Attendance.findOne({ schoolId, classId, date: normalizedDate });
    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Attendance record not found for today." },
        { status: 404 }
      );
    }

    // Update each student's attendance status
    const updatedList = existing.attendance.map(student => {
      const updated = attendance.find(
        s => s.studentId.toString() === student.studentId.toString()
      );
      return updated ? { ...student.toObject(), status: updated.status } : student;
    });

    existing.attendance = updatedList;

    // Recalculate totals for this class
    const totalPresent = updatedList.filter(s => s.status === "present").length;
    const totalAbsent = updatedList.filter(s => s.status === "absent").length;

    existing.totalPresent = totalPresent;
    existing.totalAbsent = totalAbsent;

    await existing.save();

    // --- Update school-level weekly chart ---
    const school = await School.findById(schoolId);
    let weeklyData = school.weeklyAttendanceChartData || [];

    // Aggregate all classes for this school/date
    const allAttendanceToday = await Attendance.find({ schoolId, date: normalizedDate });
    const schoolTotalStudents = allAttendanceToday.reduce(
      (sum, record) => sum + (record.totalPresent + record.totalAbsent),
      0
    );
    const schoolTotalPresent = allAttendanceToday.reduce(
      (sum, record) => sum + record.totalPresent,
      0
    );
    const schoolTotalAbsent = allAttendanceToday.reduce(
      (sum, record) => sum + record.totalAbsent,
      0
    );

    // Remove existing entry for this date
    weeklyData = weeklyData.filter(entry => entry.date !== normalizedDate);

    // Keep max 6 previous entries (max 7 total)
    if (weeklyData.length >= 7) weeklyData.shift();

    // Push updated school-level summary
    weeklyData.push({
      date: normalizedDate,
      totalStudents: schoolTotalStudents,
      totalPresent: schoolTotalPresent,
      totalAbsent: schoolTotalAbsent,
    });

    await School.findByIdAndUpdate(schoolId, { weeklyAttendanceChartData: weeklyData });

    return NextResponse.json({
      success: true,
      message: "Attendance updated successfully and weekly chart refreshed.",
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
