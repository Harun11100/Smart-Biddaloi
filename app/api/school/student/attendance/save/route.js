import { NextResponse } from "next/server";
import connectDb from "@/app/utils/db";
import Attendance from "@/app/model/Attendance";
import Student from "@/app/model/Student";
import Expo from "expo-server-sdk";

export async function POST(req) {
  try {
    await connectDb();

    const { schoolId, classId, date, attendance } = await req.json();

    if (!schoolId || !classId || !date || !Array.isArray(attendance)) {
      return NextResponse.json({ success: false, message: "Missing or invalid required fields" }, { status: 400 });
    }

    const normalizedDate = date.replace(/\//g, "-");

    const validAttendance = Array.from(
      new Map(
        attendance
          .filter(a => a.studentId && ["present", "absent"].includes(a.status))
          .map(a => [a.studentId, a])
      ).values()
    );

    if (validAttendance.length === 0) {
      return NextResponse.json({ success: false, message: "No valid attendance entries found." }, { status: 400 });
    }

    const existing = await Attendance.findOne({ schoolId, classId, date: normalizedDate });
    if (existing) {
      return NextResponse.json({ success: false, message: "Attendance already recorded for today." }, { status: 409 });
    }

    const savedAttendance = await Attendance.create({
      schoolId,
      classId,
      date: normalizedDate,
      attendance: validAttendance,
    });

    // Handle absentees
    const absentIds = validAttendance.filter(s => s.status === "absent").map(s => s.studentId);

    if (absentIds.length > 0) {
      await Student.bulkWrite(absentIds.map(id => ({
        updateOne: { filter: { _id: id }, update: { $inc: { monthlyAbsent: 1 } } }
      })));

      const absentStudents = await Student.find({ _id: { $in: absentIds }, expoToken: { $ne: null } });
      const expo = new Expo();

      const messages = [];
      for (const student of absentStudents) {
        if (!Expo.isExpoPushToken(student.expoToken)) continue;
        messages.push({
          to: student.expoToken,
          sound: "default",
          title: "🚸 উপস্থিতি সতর্কতা",
          body: `${student.name} আজ অনুপস্থিত রয়েছে।`,
          data: { studentId: student._id.toString(), guardianPhone: student.guardianPhone },
        });
      }

      // Send in batches
      const chunks = expo.chunkPushNotifications(messages);
      for (const chunk of chunks) {
        try {
          const tickets = await expo.sendPushNotificationsAsync(chunk);
          console.log("Expo push tickets:", tickets);
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
    return NextResponse.json({ success: false, message: "Failed to save attendance", error: err.message }, { status: 500 });
  }
}
