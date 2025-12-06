import connectDb from "@/app/utils/db";
import School from "@/app/model/School";

export async function PUT(req) {
  try {
    await connectDb();
    const { schoolId, availableAlert } = await req.json();

    // Validate inputs
    if (!schoolId || typeof availableAlert !== "boolean") {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Invalid or missing required fields",
        }),
        { status: 400 }
      );
    }

    const updated = await School.findByIdAndUpdate(
      schoolId,
      { availableAlert },
      { new: true }
    );

    if (!updated) {
      return new Response(
        JSON.stringify({ success: false, message: "School not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Alert status updated successfully",
        data: updated,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500 }
    );
  }
}
