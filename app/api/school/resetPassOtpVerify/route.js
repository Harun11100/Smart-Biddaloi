import { NextResponse } from "next/server";
import connectDb from "@/app/utils/db";
import School from "@/app/model/School";

export async function POST(req) {
  try {
    await connectDb();
    const { schoolId, passOTP } = await req.json();

    if (!schoolId || !passOTP) {
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

    // Trim OTP to avoid whitespace issues
    const trimmedOTP = passOTP.toString().trim();

    if (
      school.passOTP !== trimmedOTP ||
      !school.passOTPExpiry ||
      school.passOTPExpiry < Date.now()
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired Password Reset OTP" },
        { status: 400 }
      );
    }

    // Clear OTP after verification
    school.passOTP = null;
    school.passOTPExpiry = null;
    await school.save();

    return NextResponse.json({
      success: true,
      message: "OTP verified successfully. You can now reset your password.",
      schoolId: school._id, // useful for redirecting to reset password page
    });
  } catch (error) {
    console.error("Error verifying pass OTP:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
