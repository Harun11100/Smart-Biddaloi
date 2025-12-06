import connectDb from "@/app/utils/db";
import School from "@/app/model/School";

export async function PUT(req) {
  try {
    await connectDb();
    const { schoolId, alertTitle, alertMessage, availableAlert } = await req.json();
     
    if (!schoolId) {
      return new Response(
        JSON.stringify({ success: false, message: "Missing required field: schoolId" }),
        { status: 400 }
      );
    }

    const updateData = {};
    if (alertTitle !== undefined) updateData.alertTitle = alertTitle;
    if (alertMessage !== undefined) updateData.alertMessage = alertMessage;
    if (availableAlert !== undefined) updateData.availableAlert = availableAlert;

    if (Object.keys(updateData).length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "Nothing to update" }),
        { status: 400 }
      );
    }

    await School.findByIdAndUpdate(schoolId, updateData);

    return new Response(
      JSON.stringify({ success: true, message: "Alert updated successfully" }),
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
