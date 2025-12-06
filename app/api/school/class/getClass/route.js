
import Class from "@/app/model/Class";
import connectDb from "@/app/utils/db";
import { NextResponse } from "next/server";

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

    const classes = await Class.find({ schoolId }).sort({ createdAt: -1 });


    return NextResponse.json({ success: true, data: classes }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
