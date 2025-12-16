import Notice from "@/app/model/Notice";
import School from "@/app/model/School";
import connectDb from "@/app/utils/db";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  try {
    await connectDb();

    const { noticeId } = params; // /updateNotice/:noticeId
    const { title, description } = await req.json();

    // 🧩 Validate input
    if (!title || !description) {
      return NextResponse.json(
        { success: false, message: "শিরোনাম এবং বর্ণনা অবশ্যই প্রয়োজন" },
        { status: 400 }
      );
    }

    // 📝 Check if notice exists
    const notice = await Notice.findById(noticeId);
    if (!notice) {
      return NextResponse.json(
        { success: false, message: "নোটিশ পাওয়া যায়নি" },
        { status: 404 }
      );
    }

    notice.title = title;
    notice.description = description;
    await notice.save();

    return NextResponse.json({
      success: true,
      message: "নোটিশ সফলভাবে আপডেট হয়েছে",
      notice,
    });
  } catch (err) {
    console.error("❌ Error updating notice:", err);
    return NextResponse.json(
      { success: false, message: "নোটিশ আপডেট ব্যর্থ হয়েছে" },
      { status: 500 }
    );
  }
}
