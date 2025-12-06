import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDb from "@/app/utils/db";
import Admin from "@/app/model/Admin";

export async function POST(req) {
  try {
    await connectDb();

    const { adminId, loginOTP } = await req.json();

    if (!adminId || !loginOTP) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Admin not found" },
        { status: 404 }
      );
    }

    // OTP Validation
    const isExpired =
      !admin.loginOTPExpiry || admin.loginOTPExpiry < Date.now();
    const isInvalid = admin.loginOTP !== loginOTP;

    if (isInvalid || isExpired) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    // Clear OTP after successful verification
    admin.loginOTP = null;
    admin.loginOTPExpiry = null;
    await admin.save();

    // Generate JWT Token (2 days)
    const token = jwt.sign(
      {
        id: admin._id,
        adminName: admin.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2d" } 
    );

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
