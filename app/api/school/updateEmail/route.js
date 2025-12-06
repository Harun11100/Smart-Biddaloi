import { NextResponse } from "next/server";
import connectDb from "@/app/utils/db";
import School from "@/app/model/School";

export async function POST(req) {
  try {
    await connectDb();

    const body = await req.json();
    const { schoolId, email } = body;

    // Validate input
    if (!schoolId || !email) {
      return NextResponse.json(
        { success: false, message: "schoolId এবং email প্রয়োজন" },
        { status: 400 }
      );
    }

    const updated = await School.findByIdAndUpdate(
      schoolId,
      { email },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "School পাওয়া যায়নি" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "ইমেইল সফলভাবে আপডেট হয়েছে",
      school: updated,
    });
  } catch (error) {
    console.error("Update Email Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
