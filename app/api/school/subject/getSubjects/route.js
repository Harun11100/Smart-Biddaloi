import { NextResponse } from "next/server";
import Subject from "@/app/model/Subject";
import Class from "@/app/model/Class";
import connectDb from "@/app/utils/db";

export async function GET(req) {
  try {
    await connectDb();

    const { searchParams } = new URL(req.url);
    const classId = searchParams.get("classId");

    if (!classId) {
      return NextResponse.json(
        {
          success: false,
          message: "classId is required",
        },
        { status: 400 }
      );
    }

    // Check whether the class exists
    const classData = await Class.findById(classId);

    if (!classData) {
      return NextResponse.json(
        {
          success: false,
          message: "Class not found",
        },
        { status: 404 }
      );
    }

    // Get subjects belonging to this class
    const subjects = await Subject.find({
      classId: classData._id,
    }).sort({ name: 1 });

    return NextResponse.json(
      {
        success: true,
        classId,
        totalSubjects: subjects.length,
        data: subjects,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get subjects error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}