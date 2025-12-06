import { NextResponse } from "next/server";
import connectDb from "@/app/utils/db";
import Student from "@/app/model/Student";

export async function PUT(req) {
  try {
    await connectDb();
    const { classId } = await req.json();

    if (!classId) {
      return NextResponse.json(
        { success: false, error: "Missing classId" },
        { status: 400 }
      );
    }
    // 🔹 Proceed to reset only if 1st day
    const result = await Student.updateMany(
      { classId },
      { $set: { paymentStatus: "unpaid" } }
    );

    return NextResponse.json({
      success: true,
      message: "সব ছাত্রের পেমেন্ট স্ট্যাটাস 'unpaid' এ রিসেট হয়েছে।",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Reset payment error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to reset payments" },
      { status: 500 }
    );
  }
}
