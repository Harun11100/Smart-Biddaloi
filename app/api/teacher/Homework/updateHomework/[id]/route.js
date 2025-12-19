import { NextResponse } from "next/server";
import connectDb from "@/app/utils/db";
import Homework from "@/app/model/Homework";

export async function PUT(req, { params }) {
  try {
    await connectDb();

    const { id } = params;

    // ✅ Parse JSON body
    const body = await req.json();
    const { title, description, dueDate, schoolId, classId } = body;

    // ✅ Validation
    if (!id || !title || !description || !dueDate || !schoolId || !classId) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const updatedHomework = await Homework.findByIdAndUpdate(
      id,
      {
        title,
        description,
        dueDate: new Date(dueDate),
        schoolId,
        classId,
      },
      { new: true }
    );

    if (!updatedHomework) {
      return NextResponse.json(
        { success: false, message: "Homework not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Homework updated successfully",
      homework: updatedHomework,
    });
  } catch (error) {
    console.error("Error updating homework:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
