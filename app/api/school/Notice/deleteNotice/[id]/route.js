import { NextResponse } from "next/server";
import connectDb from "@/app/utils/db";
import Notice from "@/app/model/Notice";
import School from "@/app/model/School";

export async function DELETE(req, context) {
  try {
    await connectDb();
    const { id } = await context.params;


    if (!id) {
      return NextResponse.json(
        { success: false, message: "Missing ID" },
        { status: 400 }
      );
    }

    const deleted = await Notice.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Notice not found" },
        { status: 404 }
      );
    }
      if (deleted.schoolId) {
          await School.findByIdAndUpdate(deleted.schoolId, { $inc: { totalNotice: -1 } });
        }

    return NextResponse.json({
      success: true,
      message: "Notice deleted successfully",
    });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
