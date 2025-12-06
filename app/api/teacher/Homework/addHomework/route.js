import { NextResponse } from "next/server";
import connectDb from "@/app/utils/db";
import Homework from "@/app/model/Homework";

export async function POST(req) {
  try {
    await connectDb();

    // ✅ Parse FormData from request
    const formData = await req.formData();

    const schoolId = formData.get("schoolId");
    const classId = formData.get("classId");
    const title = formData.get("title");
    const description = formData.get("description");
    const dueDate = formData.get("dueDate");

    // ✅ Validation
    if (!schoolId || !classId || !title || !description || !dueDate) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ Create homework in MongoDB
    const homework = await Homework.create({
      schoolId,
      classId,
      title,
      description,
      dueDate: new Date(dueDate),
    });

    return NextResponse.json({
      success: true,
      message: "Homework uploaded successfully",
      homework,
    });
  } catch (error) {
    console.error("Error uploading homework:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
