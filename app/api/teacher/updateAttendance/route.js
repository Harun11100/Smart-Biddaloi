import TeacherAttendance from "@/app/model/TeacherAttendance";
import connectDb from "@/app/utils/db";
import mongoose from "mongoose";

export async function PUT(req) {
  try {
    await connectDb();

    const { schoolId, attendance } = await req.json();

    if (!schoolId || !attendance || !Array.isArray(attendance) || attendance.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "schoolId and attendance array are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // 🔹 Prepare bulk operations
    const bulkOps = attendance.map((item) => {
      const { teacherId, status, tempStatus } = item;
      if (!teacherId || !status) return null;

      return {
        updateOne: {
          filter: { schoolId: mongoose.Types.ObjectId(schoolId), teacherId: mongoose.Types.ObjectId(teacherId), date: { $gte: todayStart, $lte: todayEnd } },
          update: { status, tempStatus, date: new Date() },
          upsert: true,
        },
      };
    }).filter(Boolean);

    if (bulkOps.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "No valid attendance records to update" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const result = await TeacherAttendance.bulkWrite(bulkOps);

    return new Response(
      JSON.stringify({ success: true, message: "Attendance updated successfully", result }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error updating attendance:", err);
    return new Response(
      JSON.stringify({ success: false, message: err.message || "Server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
