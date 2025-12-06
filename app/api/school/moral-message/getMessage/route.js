import connectDb from "@/app/utils/db";
import MoralMessage from "@/app/model/MoralMessage";
import { NextResponse } from "next/server";

// ✅ Fetch all moral messages for a school (Guardian view)
export async function GET(req) {
  try {
    await connectDb();
    const { searchParams } = new URL(req.url);
    const schoolId  = searchParams.get("schoolId");
    const classId  = searchParams.get("classId");
    if (!schoolId || !classId) {
      return NextResponse.json(
        { success: false, message: "schoolId or classId is required" },
        { status: 400 }
      );
    }

    const messages = await MoralMessage.find({ schoolId,classId })
      .sort({ createdAt: -1 })
      .select("title message createdAt");

    return NextResponse.json({ success: true, messages }, { status: 200 });
  } catch (error) {
    console.error("Moral message GET error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
