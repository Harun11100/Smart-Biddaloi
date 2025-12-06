import Teacher from "@/app/model/Teacher";
import connectDb from "@/app/utils/db";

export async function GET(req) {
  try {
    await connectDb();

    const { searchParams } = new URL(req.url);
    const schoolId = searchParams.get("schoolId");

    if (!schoolId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "schoolId is required",
        }),
        { status: 400 }
      );
    }

    // Fetch teachers belonging to this school
    const teachers = await Teacher.find({ schoolId });

    return new Response(
      JSON.stringify({
        success: true,
        teachers: teachers || [], // Always return an array
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error("Error fetching teachers:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Server error",
      }),
      { status: 500 }
    );
  }
}
