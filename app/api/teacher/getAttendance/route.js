import TeacherAttendance from "@/app/model/TeacherAttendance";
import connectDb from "@/app/utils/db";

export async function GET(req) {
  try {
    await connectDb();

    const { searchParams } = new URL(req.url);
    const teacherId = searchParams.get("teacherId");
    const schoolId = searchParams.get("schoolId");

    if (!teacherId || !schoolId) {
      return new Response(
        JSON.stringify({ success: false, message: "Teacher ID and School ID are required" }),
        { status: 400 }
      );
    }

    // Normalize today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    // Check if attendance exists for today
    let attendance = await TeacherAttendance.findOne({
      teacherId,
      schoolId,
      date: { $gte: today, $lt: tomorrow },
    });

    // Optional: create a pending attendance if none exists
    if (!attendance) {
      attendance = await TeacherAttendance.create({
        teacherId,
        schoolId,
        tempStatus: "pending",
        status: "pending",
        date: today,
      });
    }

    return new Response(
      JSON.stringify({ success: true, attendance }),
      { status: 200 }
    );

  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500 }
    );
  }
}
