import { NextResponse } from "next/server";
import connectDb from "@/app/utils/db";
import School from "@/app/model/School";
import Student from "@/app/model/Student";

export async function POST(req) {
  try {
    await connectDb();
    const { schoolId, code } = await req.json();

    if (!schoolId || !code) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const school = await School.findById(schoolId);
    if (!school) {
      return NextResponse.json(
        { success: false, message: "School not found" },
        { status: 404 }
      );
    }

    // Check code and expiry
    if (
      school.resetCode !== code ||
      !school.resetCodeExpiry ||
      school.resetCodeExpiry < Date.now()
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired code" },
        { status: 400 }
      );
    }

    // 🔹 Update all students of this school to unpaid
    await Student.updateMany(
      { schoolId },
      { $set: { paymentStatus: "unpaid" } }
    );

    // Reset school payment count and clear code
    school.totalStudentFees = 0;
    school.totalPaymentCount = 0;
    school.resetCode = null;
    school.resetCodeExpiry = null;
    await school.save();

    return NextResponse.json({
      success: true,
      message: "Payment count reset and all students set to unpaid",
    });
  } catch (error) {
    console.error("Error verifying reset code:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
