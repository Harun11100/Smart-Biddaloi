import { NextResponse } from "next/server";
import connectDb from "@/app/utils/db";
import Homework from "@/app/model/Homework";

export async function DELETE(req) {
  try {
    await connectDb();

    // ✅ Parse JSON body
    const { homeworkId } = await req.json();

    // ✅ Validation
    if (!homeworkId) {
      return NextResponse.json(
        { success: false, message: "Missing homework ID" },
        { status: 400 }
      );
    }

    // ✅ Delete homework
    const deletedHomework = await Homework.findByIdAndDelete(homeworkId);

    if (!deletedHomework) {
      return NextResponse.json(
        { success: false, message: "Homework not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Homework deleted successfully",
      deletedHomework,
    });
  } catch (error) {
    console.error("Error deleting homework:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
