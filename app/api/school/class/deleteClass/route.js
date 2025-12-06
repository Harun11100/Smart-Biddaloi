import Class from "@/app/model/Class";
import Student from "@/app/model/Student";
import connectDb from "@/app/utils/db";
import { NextResponse } from "next/server";

export async function DELETE(req) {
  try {
    await connectDb();

    const { searchParams } = new URL(req.url);
    const classId = searchParams.get("classId");

    if (!classId) {
      return NextResponse.json(
        { success: false, message: "Class ID is required" },
        { status: 400 }
      );
    }

    // 🔍 Check whether students exist under this class
    const students = await Student.find({ classId });

    if (students.length > 0) {
      return NextResponse.json(
        { success: false, message: "This class has students, so it cannot be deleted" },
        { status: 400 }
      );
    }

    // 🗑 Delete the class
    await Class.findByIdAndDelete(classId);

    return NextResponse.json(
      { success: true, message: "Class deleted successfully" },
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
