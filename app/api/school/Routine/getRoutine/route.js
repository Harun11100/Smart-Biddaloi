import Routine from "@/app/model/Routine";
import connectDb from "@/app/utils/db";

// GET /api/school/routine/getRoutines?schoolId=68ea59dbe0ba9989379d66eb
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const schoolId = searchParams.get("schoolId");

    if (!schoolId) {
      return new Response(
        JSON.stringify({ success: false, message: "schoolId is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    await connectDb(); // connect to MongoDB

    const routines = await Routine.find({ schoolId }).sort({ createdAt: -1 });

    return new Response(
      JSON.stringify({ success: true, routines }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Fetch routines error:", err);
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
