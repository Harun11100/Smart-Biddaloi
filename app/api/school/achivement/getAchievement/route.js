import { NextResponse } from "next/server";
import connectDb from "@/app/utils/db";
import Achievement from "@/app/model/Achievement";

export async function GET(req) {
  try {
    await connectDb();

    const { searchParams } = new URL(req.url);
    const schoolId = searchParams.get("schoolId");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "30", 10);

    if (!schoolId) {
      return NextResponse.json(
        { success: false, message: "Missing schoolId parameter." },
        { status: 400 }
      );
    }
    const skip = (page - 1) * limit;

    // Fetch paginated achievements
    const achievements = await Achievement.find({ schoolId }, { __v: 0 })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Count total for pagination info
    const totalCount = await Achievement.countDocuments({ schoolId });

    return NextResponse.json(
      {
        success: true,
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        achievements,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ GET Achievement error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch achievements." },
      { status: 500 }
    );
  }
}
