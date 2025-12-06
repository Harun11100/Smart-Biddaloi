import { NextResponse } from "next/server";
import connectDb from "@/app/utils/db";
import TeacherAttendance from "@/app/model/TeacherAttendance";
import Teacher from "@/app/model/Teacher";

export async function POST(req) {
  try {
    await connectDb();

    const { schoolId, date, attendance } = await req.json();

    if (!schoolId || !date || !Array.isArray(attendance)) {
      return NextResponse.json(
        { success: false, message: "Missing or invalid required fields" },
        { status: 400 }
      );
    }
    const [day, month, year] = date.split("-");
    const attendanceDate = new Date(`${year}-${month}-${day}T00:00:00Z`);
    const nextDay = new Date(attendanceDate.getTime() + 24 * 60 * 60 * 1000);

    // ✅ Filter valid entries and remove duplicates
    const validAttendance = Array.from(
      new Map(
        attendance
          .filter(
            (a) =>
              a.teacherId &&
              ["present", "absent", "leave", "pending"].includes(a.status)
          )
          .map((a) => [a.teacherId, a])
      ).values()
    );

    if (validAttendance.length === 0) {
      return NextResponse.json(
        { success: false, message: "No valid attendance entries found." },
        { status: 400 }
      );
    }

    const results = [];

    for (const record of validAttendance) {
      const { teacherId, status } = record;

      // ✅ Save attendance (create or update)
      const updated = await TeacherAttendance.findOneAndUpdate(
        {
          schoolId,
          teacherId,
          date: { $gte: attendanceDate, $lt: nextDay },
        },
        {
          $set: {
            status,
            tempStatus: "",
            date: attendanceDate,
          },
        },
        { upsert: true, new: true }
      );

      results.push(updated);

      // ✅ Update teacher’s monthly present days count
      if (status === "present") {
        const monthStr = (attendanceDate.getMonth() + 1).toString(); // e.g. "10"
        const yearStr = attendanceDate.getFullYear().toString();      // e.g. "2025"

        // Try incrementing existing month/year record
        const incResult = await Teacher.findOneAndUpdate(
          { _id: teacherId },
          {
            $inc: { "totalPresentDays.$[elem].days": 1 },
          },
          {
            arrayFilters: [{ "elem.month": monthStr, "elem.year": yearStr }],
            new: true,
          }
        );

        // If the month/year entry doesn’t exist, create one
        if (!incResult) {
          await Teacher.findOneAndUpdate(
            {
              _id: teacherId,
              totalPresentDays: { $not: { $elemMatch: { month: monthStr, year: yearStr } } },
            },
            {
              $push: { totalPresentDays: { month: monthStr, year: yearStr, days: 1 } },
            }
          );
        }
      }
    }

    // ✅ Notify absent teachers
    const absentIds = validAttendance
      .filter((t) => t.status === "absent")
      .map((t) => t.teacherId);

    if (absentIds.length > 0) {
      const absentTeachers = await Teacher.find({
        _id: { $in: absentIds },
        expoToken: { $ne: null },
      });

      const messages = absentTeachers.map((t) => ({
        to: t.expoToken,
        sound: "default",
        title: "Attendance Alert 🚸",
        body: `${t.name}, you are marked absent today.`,
        data: { teacherId: t._id.toString(), phone: t.phone },
      }));

      try {
        await fetch("https://exp.host/--/api/v2/push/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(messages),
        });
      } catch (err) {
        console.error("Error sending notifications:", err);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Teacher attendance saved successfully.",
      saved: results.length,
    });
  } catch (err) {
    console.error("❌ Error saving teacher attendance:", err);
    return NextResponse.json(
      { success: false, message: "Server error while saving attendance" },
      { status: 500 }
    );
  }
}
