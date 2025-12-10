import { NextResponse } from "next/server";
import connectDb from "@/app/utils/db";
import Attendance from "@/app/model/Attendance";
import School from "@/app/model/School";
import Student from "@/app/model/Student";
import Expo from "expo-server-sdk";

export async function POST(req) {
  try {
    await connectDb();
    const { schoolId, classId, date, attendance } = await req.json();

    if (!schoolId || !classId || !date || !Array.isArray(attendance)) {
      return NextResponse.json(
        { success: false, message: "Missing or invalid required fields" },
        { status: 400 }
      );
    }

    const normalizedDate = date.replace(/\//g, "-");

    // Filter valid and unique attendance entries
    const validAttendance = Array.from(
      new Map(
        attendance
          .filter(a => a.studentId && ["present", "absent"].includes(a.status))
          .map(a => [a.studentId, a])
      ).values()
    );

    if (validAttendance.length === 0) {
      return NextResponse.json(
        { success: false, message: "No valid attendance entries found." },
        { status: 400 }
      );
    }

    // Prevent double attendance for the same class/date
    const existing = await Attendance.findOne({ schoolId, classId, date: normalizedDate });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Attendance already recorded for today." },
        { status: 409 }
      );
    }

    // Calculate class-level totals
    const totalPresent = validAttendance.filter(s => s.status === "present").length;
    const totalAbsent = validAttendance.filter(s => s.status === "absent").length;

    // Save class attendance
    const savedAttendance = await Attendance.create({
      schoolId,
      classId,
      date: normalizedDate,
      attendance: validAttendance,
      totalPresent,
      totalAbsent,
    });

    // --- Update school-level weekly chart ---
    const school = await School.findById(schoolId);

    // Get all attendance for this school/date including the newly saved class
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

    // Update weeklyAttendanceChartData (max 7 entries)
    let weeklyData = school.weeklyAttendanceChartData || [];
    weeklyData = weeklyData.filter(entry => entry.date !== normalizedDate);
    if (weeklyData.length >= 7) weeklyData.shift();
    weeklyData.push({
      date: normalizedDate,
      totalStudents: schoolTotalStudents,
      totalPresent: schoolTotalPresent,
      totalAbsent: schoolTotalAbsent,
    });

    await School.findByIdAndUpdate(schoolId, { weeklyAttendanceChartData: weeklyData });

    // --- Update monthly absent count and send notifications ---
    const absentIds = validAttendance
      .filter(s => s.status === "absent")
      .map(s => s.studentId);

    if (absentIds.length > 0) {
      // Increment monthlyAbsent for each absent student
      await Student.bulkWrite(
        absentIds.map(id => ({
          updateOne: {
            filter: { _id: id },
            update: { $inc: { monthlyAbsent: 1 } },
          },
        }))
      );

      // Push notifications
      const absentStudents = await Student.find({
        _id: { $in: absentIds },
        expoToken: { $ne: null },
      });

      const expo = new Expo();
      const messages = absentStudents
        .filter(student => Expo.isExpoPushToken(student.expoToken))
        .map(student => ({
          to: student.expoToken,
          sound: "default",
          title: "🚸 Attendance Alert",
          body: `${student.name} was absent today.`,
          data: { studentId: student._id.toString(), guardianPhone: student.guardianPhone },
        }));

      const chunks = expo.chunkPushNotifications(messages);
      for (const chunk of chunks) {
        try {
          await expo.sendPushNotificationsAsync(chunk);
        } catch (err) {
          console.error("Error sending push notifications:", err);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "✅ Attendance saved successfully & notifications sent",
      savedAttendance,
    });
  } catch (err) {
    console.error("❌ Error saving attendance:", err);
    return NextResponse.json(
      { success: false, message: "Failed to save attendance", error: err.message },
      { status: 500 }
    );
  }
}
