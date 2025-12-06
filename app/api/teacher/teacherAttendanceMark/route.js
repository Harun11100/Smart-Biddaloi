import TeacherAttendance from "@/app/model/TeacherAttendance";
import connectDb from "@/app/utils/db";

export async function POST(req) {
  try {
    await connectDb();

    const { schoolId, teacherId, teacherName, teacherPhone } = await req.json();

    if (!schoolId || !teacherId) {
      return new Response(
        JSON.stringify({ success: false, message: "School ID and Teacher ID are required" }),
        { status: 400 }
      );
    }

    // Normalize today's date to midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    // Check if attendance already exists
    const existingAttendance = await TeacherAttendance.findOne({
      teacherId,
      schoolId,
      date: { $gte: today, $lt: tomorrow },
    });

    if (existingAttendance) {
      return new Response(
        JSON.stringify({ success: false, message: "Attendance already marked today" }),
        { status: 409 } // 409 Conflict
      );
    }
    const attendance = new TeacherAttendance({
      schoolId,
      teacherId,
      teacherName: teacherName || "",
      teacherPhone: teacherPhone || "",
      tempStatus: "pending",
      date: today,
      arrivalTime: new Date(), // optional: exact mark time
    });

    try {
      await attendance.save();
    } catch (err) {
      if (err.code === 11000) {
        // Handle race condition
        return new Response(
          JSON.stringify({ success: false, message: "Attendance already exists" }),
          { status: 409 }
        );
      }
      throw err;
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Attendance marked as pending",
        attendance: {
          _id: attendance._id,
          schoolId: attendance.schoolId,
          teacherId: attendance.teacherId,
          teacherName: attendance.teacherName,
          teacherPhone: attendance.teacherPhone,
          status: attendance.status,
          tempStatus: attendance.tempStatus,
          date: attendance.date.toISOString(),
          arrivalTime: attendance.arrivalTime.toISOString(),
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error marking attendance:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500 }
    );
  }
}
