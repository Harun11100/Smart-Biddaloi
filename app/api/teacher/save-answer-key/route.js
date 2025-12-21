import { NextResponse } from "next/server";
import connectDb from "@/app/utils/db";
import Teacher from "@/app/model/Teacher";

/* ================= HELPER: PARSE ANSWER KEY ================= */
function parseAnswerKey(input) {
  const result = {};
  
  // Split by comma
  input.split(",").forEach((pair) => {
    // Match number followed immediately by a letter A-E
    const match = pair.match(/^(\d+)([A-Ea-e])$/);
    if (match) {
      result[match[1]] = match[2].toUpperCase();
    }
  });

  return result;
}


/* ================= POST ================= */
export async function POST(req) {
  try {
    await connectDb();

    const { teacherId, answerKey } = await req.json();

    if (!teacherId || !answerKey) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const parsedKey = parseAnswerKey(answerKey);

    if (Object.keys(parsedKey).length === 0) {
      return NextResponse.json(
        { success: false, message: "Invalid answer key format" },
        { status: 400 }
      );
    }

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return NextResponse.json(
        { success: false, message: "Teacher not found" },
        { status: 404 }
      );
    }

    /* ✅ Save ONLY what is needed */
    teacher.rawAnswerKey = answerKey;     // original string
    teacher.answerKey = parsedKey;        // parsed object
    teacher.answerKeyUpdatedAt = new Date();

    await teacher.save();

    return NextResponse.json({
      success: true,
      message: "Answer key saved successfully",
      totalQuestions: Object.keys(parsedKey).length,
    });
  } catch (error) {
    console.error("Error saving answer key:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
