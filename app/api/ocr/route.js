// app/api/ocr/route.js
import { NextResponse } from "next/server";
import FormData from "form-data";
import fetch from "node-fetch";
import { Document, Packer, Paragraph, TextRun } from "docx";

const OCR_SPACE_API_KEY = process.env.OCR_SPACE_API_KEY;

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return NextResponse.json({ success: false, error: "No image URL provided" }, { status: 400 });
    }

    // Fetch image from URL
    const imageResponse = await fetch(imageUrl);
    const arrayBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Prepare form-data for OCR.Space
    const form = new FormData();
    form.append("file", buffer, { filename: "image.jpg" });
    form.append("apikey", OCR_SPACE_API_KEY);
    form.append("language", "eng"); // adjust language if supported

    const ocrResponse = await fetch("https://api.ocr.space/parse/image", {
      method: "POST",
      body: form,
    });

    const result = await ocrResponse.json();

    if (!result.ParsedResults || !result.ParsedResults[0] || result.ParsedResults[0].FileParseExitCode !== 1) {
      throw new Error(result.ErrorMessage?.[0] || "Failed to extract text from image");
    }

    const parsedText = result.ParsedResults[0].ParsedText || "";

    // Generate Word document
    const doc = new Document({
      sections: [
        {
          children: parsedText.split("\n").map(line => new Paragraph({ children: [new TextRun(line)] })),
        },
      ],
    });

    const docBuffer = await Packer.toBuffer(doc);

    return new NextResponse(docBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": 'attachment; filename="questions.docx"',
      },
    });
  } catch (error) {
    console.error("OCR Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
