import TeacherAttendance from "@/app/model/TeacherAttendance";
import Teacher from "@/app/model/Teacher"; // ← Add this
import connectDb from "@/app/utils/db";

export async function GET(req) {
  try {
    await connectDb();

    const { searchParams } = new URL(req.url);
    const schoolId = searchParams.get("schoolId");
    const date = searchParams.get("date"); // optional, format: YYYY-MM-DD

    // ✅ Validate required field
    if (!schoolId) {
      return new Response(
        JSON.stringify({ success: false, message: "schoolId is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 🧠 Build query dynamically
    const query = { schoolId };

    if (date) {
      // Match records for the whole day
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      query.date = { $gte: start, $lte: end };
    }

    // 🔍 Fetch attendance records, newest first
    const records = await TeacherAttendance.find(query)
      .sort({ createdAt: -1 })
      .populate("teacherId", "name phone");

    // ⚠️ Handle empty result
    if (!records.length) {
      return new Response(
        JSON.stringify({ success: false, message: "No attendance records found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // ✅ Successful response
    return new Response(
      JSON.stringify({ success: true, attendance: records }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching attendance records:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || "Server error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
