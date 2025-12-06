import { NextResponse } from "next/server";
import cloudinary from "cloudinary";
import connectDb from "@/app/utils/db";
import Achievement from "@/app/model/Achievement";

// ✅ Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export async function DELETE(req) {
  try {
    await connectDb();

    const { achievementId } = await req.json();

    if (!achievementId) {
      return NextResponse.json(
        { success: false, message: "achievementId is required." },
        { status: 400 }
      );
    }

    // ✅ Find achievement
    const achievement = await Achievement.findById(achievementId);

    if (!achievement) {
      return NextResponse.json(
        { success: false, message: "Achievement not found." },
        { status: 404 }
      );
    }

    // ✅ Delete image from Cloudinary if exists
    if (achievement.image && achievement.image.public_id) {
      try {
        await cloudinary.v2.uploader.destroy(achievement.image.public_id);
      } catch (cloudErr) {
        console.error("Cloudinary delete error:", cloudErr);
      }
    }

    // ✅ Delete achievement from DB
    await achievement.deleteOne();

    return NextResponse.json(
      { success: true, message: "Achievement deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete achievement error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete achievement.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}