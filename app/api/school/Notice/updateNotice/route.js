import Notice from "@/app/model/Notice";
import School from "@/app/model/School";
import connectDb from "@/app/utils/db";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function PUT(req, { params }) {
  try {
    await connectDb();

    const { noticeId } = params;
    const { schoolId, title, description, date } = await req.json();

    /* ================= VALIDATION ================= */
    if (!mongoose.Types.ObjectId.isValid(noticeId)) {
      return NextResponse.json(
        { success: false, message: "অবৈধ নোটিশ আইডি" },
        { status: 400 }
      );
    }

    if (!schoolId || !title || !description) {
      return NextResponse.json(
        {
          success: false,
          message: "schoolId, শিরোনাম এবং বর্ণনা আবশ্যক",
        },
        { status: 400 }
      );
    }

    /* ================= SCHOOL CHECK ================= */
    const schoolExists = await School.findById(schoolId);
    if (!schoolExists) {
      return NextResponse.json(
        { success: false, message: "স্কুল পাওয়া যায়নি" },
        { status: 404 }
      );
    }

    /* ================= NOTICE CHECK ================= */
    const notice = await Notice.findOne({
      _id: noticeId,
      schoolId,
    });

    if (!notice) {
      return NextResponse.json(
        {
          success: false,
          message: "এই স্কুলের জন্য নোটিশ পাওয়া যায়নি",
        },
        { status: 404 }
      );
    }

    /* ================= UPDATE ================= */
    notice.title = title;
    notice.description = description;
    notice.date = date || notice.date;

    await notice.save();

    return NextResponse.json({
      success: true,
      message: "নোটিশ সফলভাবে আপডেট হয়েছে",
      notice,
    });
  } catch (error) {
    console.error("❌ Error updating notice:", error);
    return NextResponse.json(
      {
        success: false,
        message: "সার্ভার ত্রুটি! নোটিশ আপডেট ব্যর্থ হয়েছে",
      },
      { status: 500 }
    );
  }
}
