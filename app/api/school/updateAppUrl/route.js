import connectDb from "@/app/utils/db";
import School from "@/app/model/School";

export async function PUT(req) {
  try {
    await connectDb();
    const { schoolId, appUpdateUrl,versionCode } = await req.json();

    if (!schoolId) {
      return new Response(
        JSON.stringify({ success: false, message: "Missing required fields" }),
        { status: 400 }
      );
    }
    await School.findByIdAndUpdate(schoolId, { appUpdateUrl ,versionCode });
    return new Response(
      JSON.stringify({ success: true, message: "App URL updated successfully" }),
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
