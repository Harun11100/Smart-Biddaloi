import Class from "@/app/model/Class";
import connectDb from "@/app/utils/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDb();
    const body = await req.json();
    const { className, sectionName, schoolId } = body;

    if (!className || !schoolId) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if class already exists
    const existing = await Class.findOne({ className, sectionName, schoolId });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Class with this section already exists" },
        { status: 409 }
      );
    }

    // Create new class
    const newClass = await Class.create({ className, sectionName, schoolId });

    return NextResponse.json(
      { success: true, message: "Class added successfully", data: newClass },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
