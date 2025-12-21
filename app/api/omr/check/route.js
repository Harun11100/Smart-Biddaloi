import { NextResponse } from "next/server";
import connectDb from "@/app/utils/db";
import Teacher from "@/app/model/Teacher";
import formidable from "formidable";
import fs from "fs";
import fetch from "node-fetch"; // or global fetch if supported

export const config = {
  api: { bodyParser: false },
};

/* ================= HELPER: CALL GEMINI ================= */
async function detectOmrAnswersWithGemini(filePath) {
  // Convert image to base64
  const imageBuffer = fs.readFileSync(filePath);
  const base64Image = imageBuffer.toString("base64");

  // Replace with your Gemini API endpoint and key
  const GEMINI_API_URL = process.env.GEMINI_API_URL;
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  const prompt = `
You are an AI OMR checker. 
The student OMR sheet is provided as an image (base64). 
Extract the answers and return ONLY a JSON object in this format:
{"1":"A","2":"B","3":"C",...}
Only include questions that are answered, ignore blanks.
`;

  const response = await fetch(GEMINI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GEMINI_API_KEY}`,
    },
    body: JSON.stringify({
      prompt,
      image: base64Image,
      max_tokens: 500,
    }),
  });

  const data = await response.json();

  // Gemini should return text; parse it as JSON
  try {
    const studentAnswers = JSON.parse(data.text); 
    return studentAnswers;
  } catch (err) {
    console.error("Error parsing Gemini response:", err);
    return {};
  }
}

/* ================= API ROUTE ================= */
export async function POST(req) {
  try {
    await connectDb();

    const form = new formidable.IncomingForm();
    form.keepExtensions = true;

    const data = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const { teacherId } = data.fields;
    if (!teacherId || !data.files?.image) {
      return NextResponse.json(
        { success: false, message: "Missing teacherId or image file" },
        { status: 400 }
      );
    }

    const teacher = await Teacher.findById(teacherId);
    if (!teacher || !teacher.answerKey) {
      return NextResponse.json(
        { success: false, message: "Teacher not found or answer key not set" },
        { status: 404 }
      );
    }

    const filePath = data.files.image.filepath;

    // 1️⃣ Detect student answers using Gemini
    const studentAnswers = await detectOmrAnswersWithGemini(filePath);

    // 2️⃣ Compare with teacher's answer key
    const answerKey = teacher.answerKey;
    let score = 0;
    const total = Object.keys(answerKey).length;

    Object.keys(answerKey).forEach((q) => {
      if (
        studentAnswers[q] &&
        studentAnswers[q].toUpperCase() === answerKey[q].toUpperCase()
      ) {
        score++;
      }
    });

    // Delete temp file
    fs.unlinkSync(filePath);

    return NextResponse.json({
      success: true,
      score,
      total,
      studentAnswers, // optional for debug
    });
  } catch (err) {
    console.error("OMR Check Error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
