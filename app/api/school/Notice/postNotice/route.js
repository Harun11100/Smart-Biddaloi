import Notice from "@/app/model/Notice";
import School from "@/app/model/School";
import connectDb from "@/app/utils/db";
import { NextResponse } from "next/server";
import Student from "@/app/model/Student";

export async function POST(req) {
  try {
    await connectDb();

    const { schoolId, title, description, date } = await req.json();

    // 🧩 Validate input
    if (!title || !description || !schoolId) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // 📋 Restrict number of notices
    const noticeCount = await Notice.countDocuments({ schoolId });
    if (noticeCount >= 5) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You have reached the maximum of 5 notices. Please delete a previous notice before adding a new one.",
        },
        { status: 400 }
      );
    }

    // 🏫 Create new notice
    const newNotice = await Notice.create({ schoolId, title, description, date });
    await School.findByIdAndUpdate(schoolId, { $inc: { totalNotice: 1 } });

    // 🎓 Fetch all students with expo tokens
    const students = await Student.find({
      schoolId,
      expoToken: { $exists: true, $ne: "" },
    });

    if (students.length === 0) {
      return NextResponse.json({
        success: true,
        message: "Notice saved successfully (no push recipients found)",
        notice: newNotice,
      });
    }

    // 🚀 Send notifications in small batches
    const chunkSize = 50;
    for (let i = 0; i < students.length; i += chunkSize) {
      const chunk = students.slice(i, i + chunkSize);

      const notificationPromises = chunk.map((student) =>
        fetch("https://exp.host/--/api/v2/push/send", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: student.expoToken,
            sound: "default",
            title: "নতুন নোটিশ প্রকাশিত হয়েছে 🏫",
            body: `প্রিয় অভিভাবক, ${title} শিরোনামের একটি নতুন নোটিশ প্রকাশ করা হয়েছে। বিস্তারিত জানতে অ্যাপে দেখুন। 📱`,
            data: {
              studentId: student._id.toString(),
              guardianPhone: student.guardianPhone || null,
            },
          }),
        }).catch((err) =>
          console.warn(`⚠️ Notification failed for ${student._id}:`, err)
        )
      );

      await Promise.all(notificationPromises);

      // 🕒 Optional delay between batches
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    return NextResponse.json({
      success: true,
      message: "Notice saved and notifications sent successfully",
      notice: newNotice,
    });
  } catch (err) {
    console.error("❌ Error saving notice:", err);
    return NextResponse.json(
      { success: false, message: "Failed to save notice" },
      { status: 500 }
    );
  }
}
