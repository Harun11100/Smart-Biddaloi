import Achievement from "@/app/model/Achievement";
import connectDb from "@/app/utils/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDb();

    const body = await req.json();
    const {
      schoolId,
      studentName,
      studentRoll,
      batch,
      sessionYear,
      achievementTitle,
      achievementName,
      image,
    } = body;

    // ✅ Validation
    if (
      !schoolId ||
      !studentName ||
      !studentRoll ||
      !sessionYear ||
      !achievementTitle ||
      !achievementName ||
      !image
    ) {
      return NextResponse.json(
        { success: false, message: "All fields are required." },
        { status: 400 }
      );
    }

    // ✅ Create new achievement
    const newAchievement = await Achievement.create({
      schoolId,
      studentName,
      studentRoll,
      batch,
      sessionYear,
      achievementTitle,
      achievementName,
      image,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Achievement uploaded successfully!",
        data: newAchievement,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Achievement upload error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while uploading achievement.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}