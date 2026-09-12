export const runtime = "nodejs"; // REQUIRED — must be top-level

import { NextResponse } from "next/server";
import connectDb from "@/app/utils/db";
import Teacher from "@/app/model/Teacher";

import fs from "fs/promises"; // ✅ IMPORTANT
import path from "path";
import os from "os";
// this is just for tempoorayr  sjfisf

/* ================= HELPER: CALL GEMINI ================= */
async function detectOmrAnswersWithGemini(filePath) {
  // DEV MOCK (prevents API spam)
  if (process.env.NODE_ENV === "development") {
    return { "1": "A", "2": "B", "3": "C" };
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const GEMINI_API_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

  if (!GEMINI_API_KEY) {
    return { error: "Gemini API key missing" };
  }

  const imageBuffer = await fs.readFile(filePath);
  const base64Image = imageBuffer.toString("base64");

  const prompt = `
You are an AI OMR checker.
Extract answers from the OMR sheet image.
Return ONLY valid JSON like:
{"1":"A","2":"B","3":"C"}
Ignore unanswered questions.
`;

  const res = await fetch(GEMINI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-goog-api-key": GEMINI_API_KEY,
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: "image/png",
                data: base64Image,
              },
            },
          ],
        },
      ],
    }),
  });

  if (!res.ok) {
    return { error: `Gemini failed (${res.status})` };
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) return { error: "No Gemini output" };

  try {
    return JSON.parse(text);
  } catch {
    return { error: "Invalid JSON from Gemini" };
  }
}

/* ================= API ROUTE ================= */
export async function POST(req) {
  let tempPath;

  try {
    await connectDb();

    const formData = await req.formData();
    const teacherId = formData.get("teacherId");
    const imageFile = formData.get("image");

    if (!teacherId || !imageFile) {
      return NextResponse.json(
        { success: false, message: "Missing data" },
        { status: 400 }
      );
    }

    const teacher = await Teacher.findById(teacherId);
    if (!teacher?.answerKey) {
      return NextResponse.json(
        { success: false, message: "Answer key not found" },
        { status: 404 }
      );
    }

    const buffer = Buffer.from(await imageFile.arrayBuffer());
    tempPath = path.join(os.tmpdir(), `omr_${Date.now()}.png`);
    await fs.writeFile(tempPath, buffer);

    const studentAnswers = await detectOmrAnswersWithGemini(tempPath);

    if (studentAnswers.error) {
      return NextResponse.json(
        { success: false, message: studentAnswers.error },
        { status: 502 }
      );
    }

    let score = 0;
    const answerKey = teacher.answerKey;

    for (const q in answerKey) {
      if (
        studentAnswers[q]?.toUpperCase() ===
        answerKey[q]?.toUpperCase()
      ) {
        score++;
      }
    }

    return NextResponse.json({
      success: true,
      score,
      total: Object.keys(answerKey).length,
      studentAnswers,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  } finally {
    if (tempPath) {
      try {
        await fs.unlink(tempPath);
      } catch {}
    }
  }
}
