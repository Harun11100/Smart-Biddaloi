import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDb from "@/app/utils/db";
import School from "@/app/model/School";

export async function POST(req) {
  try {
    await connectDb();

    const { schoolId, loginOTP } = await req.json();

    // Validate required fields
    if (!schoolId || !loginOTP) {
      return NextResponse.json(
        {
          success: false,
          message: "School ID and login OTP are required.",
        },
        { status: 400 }
      );
    }

    // Find school
    const school = await School.findById(schoolId);

    if (!school) {
      return NextResponse.json(
        {
          success: false,
          message: "School not found.",
        },
        { status: 404 }
      );
    }

    // Check if school account is active
    if (!school.isActive) {
      return NextResponse.json(
        {
          success: false,
          message: "This school account is inactive.",
        },
        { status: 403 }
      );
    }

    // Check OTP and expiry
    if (
      school.loginOTP !== loginOTP ||
      !school.loginOTPExpiry ||
      school.loginOTPExpiry.getTime() < Date.now()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired login OTP.",
        },
        { status: 400 }
      );
    }

    // Clear OTP immediately after successful verification
    school.loginOTP = null;
    school.loginOTPExpiry = null;

    await school.save();

    // Make sure JWT secret exists
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not configured.");

      return NextResponse.json(
        {
          success: false,
          message: "Server configuration error.",
        },
        { status: 500 }
      );
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: school._id.toString(),
        schoolName: school.schoolName,
        principalName: school.principalName,
        role: school.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return NextResponse.json({
      success: true,
      message: "OTP verified successfully.",
      token,
    });
  } catch (error) {
    console.error("Error verifying login OTP:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error.",
      },
      { status: 500 }
    );
  }
}