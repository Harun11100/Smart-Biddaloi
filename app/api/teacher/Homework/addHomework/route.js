import { NextResponse } from "next/server";
import connectDb from "@/app/utils/db";
import Homework from "@/app/model/Homework";

export async function POST(req) {
  try {
    await connectDb();

    const body = await req.json();

    const {
      schoolId,
      classId,
      title,
      description,
      dueDate,
      teacherId,
    } = body;

    if (
      !schoolId ||
      !classId ||
      !title ||
      !description ||
      !dueDate ||
      !teacherId
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields",
        },
        { status: 400 }
      );
    }

    const homework = await Homework.create({
      schoolId,
      classId,
      title,
      description,
      dueDate: new Date(dueDate),
      teacherId,
    });

    return NextResponse.json({
      success: true,
      message: "Homework uploaded successfully",
      homework,
    });
  } catch (error) {
    console.error("Error uploading homework:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server error",
      },
      { status: 500 }
    );
  }
}
