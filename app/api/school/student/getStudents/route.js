import Class from "@/app/model/Class";
import Student from "@/app/model/Student";
import connectDb from "@/app/utils/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDb();
    const { searchParams } = new URL(req.url);
    const schoolId = searchParams.get("schoolId");
    const classId = searchParams.get("classId");
    
    if (!schoolId || !classId) {
      return NextResponse.json(
        { success: false, message: "schoolId and classId are required" },
        { status: 400 }
      );
    }
    const classData = await Class.findOne({ _id: classId, schoolId });
    if (!classData) {
      return NextResponse.json(
        { success: false, message: "Class not found in this school" },
        { status: 404 }
      );
    }

    const students = await Student.find({ classId:classData._id });
    const totalStudents=students.length
    return NextResponse.json(
      {
        success: true,
        schoolId,
        class: classData.className,
        data: students,
        totalStudents
      },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
