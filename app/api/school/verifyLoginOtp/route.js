import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDb from "@/app/utils/db";
import School from "@/app/model/School";

export async function POST(req) {
  try {
    await connectDb();
    const { schoolId, loginOTP } = await req.json();

    if (!schoolId || !loginOTP) {
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

    // ✅ Check OTP and expiry
    if (
      school.loginOTP !== loginOTP ||
      !school.loginOTPExpiry ||
      school.loginOTPExpiry < Date.now()
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired login OTP" },
        { status: 400 }
      );
    }

    // ✅ Clear OTP after verification
    school.loginOTP = null;
    school.loginOTPExpiry = null;
    await school.save();

    // ✅ Generate JWT token
    const token = jwt.sign(
      {
        id: school._id,
        schoolName: school.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // valid for 3 day
    );
    console.log(token)
    // ✅ Return success + token
    return NextResponse.json({
      success: true,
      message: "OTP verified successfully.",
      token, 
    });
  } catch (error) {
    console.error("Error verifying login OTP:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
