import Notice from "@/app/model/Notice";
import connectDb from "@/app/utils/db";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function PUT(req, { params }) {
  try {
    await connectDb();

    const { noticeId } = params;
    const { title, description } = await req.json();

    /* ================= VALIDATION ================= */
    if (!mongoose.Types.ObjectId.isValid(noticeId)) {
      return NextResponse.json(
        { success: false, message: "অবৈধ নোটিশ আইডি" },
        { status: 400 }
      );
    }

    if (!title || !description) {
      return NextResponse.json(
        { success: false, message: "শিরোনাম এবং বর্ণনা আবশ্যক" },
        { status: 400 }
      );
    }

    /* ================= NOTICE CHECK ================= */
    const notice = await Notice.findById(noticeId);
    if (!notice) {
      return NextResponse.json(
        { success: false, message: "নোটিশ পাওয়া যায়নি" },
        { status: 404 }
      );
    }

    /* ================= UPDATE ================= */
    notice.title = title;
    notice.description = description;
    notice.updatedAt = new Date();

    await notice.save();

    return NextResponse.json({
      success: true,
      message: "নোটিশ সফলভাবে আপডেট হয়েছে",
      notice,
    });
  } catch (error) {
    console.error("❌ Error updating notice:", error);
    return NextResponse.json(
      { success: false, message: "নোটিশ আপডেট ব্যর্থ হয়েছে" },
      { status: 500 }
    );
  }
}
