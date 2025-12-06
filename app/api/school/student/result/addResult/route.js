import { NextResponse } from "next/server";
import connectDb from "@/app/utils/db";
import Result from "@/app/model/Result";
import Student from "@/app/model/Student";

export async function POST(req) {
  try {
    await connectDb();

    const body = await req.json();
    const { schoolId, studentId, examType, results, totalMarks, averageGrade } = body;

    // ✅ Validate input
    if (!schoolId || !studentId || !examType || !results || results.length === 0) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ Generate current month-year
    const month = new Date().toLocaleString("default", { month: "long" });
    const year = new Date().getFullYear();
    const examDate = `${month} ${year}`; // e.g., "November 2025"

    // ✅ Save result to database
    const newResult = await Result.create({
      schoolId,
      studentId,
      examType,
      results,
      totalMarks,
      averageGrade,
      examDate, // save month-year
    });

    // ✅ Find student with valid expoToken
    const student = await Student.findOne({
      _id: studentId,
      schoolId,
      expoToken: { $exists: true, $ne: "" },
    });

    // ✅ Send notification if token exists
    if (student && student.expoToken) {
      try {
        await fetch("https://exp.host/--/api/v2/push/send", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: student.expoToken,
            sound: "default",
            title: "ফলাফল প্রকাশিত হয়েছে 📊",
            body: `প্রিয় অভিভাবক, ${examType} পরীক্ষার ফলাফল প্রকাশিত হয়েছে। অনুগ্রহ করে বিস্তারিত জানতে অ্যাপে প্রবেশ করুন। 📱`,
            data: {
              studentId: student._id.toString(),
              guardianPhone: student.guardianPhone || null,
            },
          }),
        });
      } catch (pushErr) {
        console.warn("⚠️ Push notification failed:", pushErr);
      }
    }

    return NextResponse.json(
      { success: true, message: "Result uploaded successfully", result: newResult },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Result upload error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
