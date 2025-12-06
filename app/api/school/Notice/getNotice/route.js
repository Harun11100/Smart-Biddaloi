import { NextResponse } from "next/server";
import connectDb from "@/app/utils/db";
import Notice from "@/app/model/Notice";

export async function GET(req) {
  try {
    await connectDb();

    const { searchParams } = new URL(req.url);
    const schoolId = searchParams.get("schoolId");

    if (!schoolId) {
      return NextResponse.json(
        { success: false, message: "schoolId is required" },
        { status: 400 }
      );
    }
    const notices = await Notice.find({ schoolId }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, notices });
  } catch (err) {
    console.error("Error fetching notices:", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch notices" },
      { status: 500 }
    );
  }
}
