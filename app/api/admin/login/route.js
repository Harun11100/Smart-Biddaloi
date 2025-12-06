// app/api/admin/login/route.js
import connectDb from "@/app/utils/db";
import Admin from "@/app/model/Admin";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    await connectDb();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "ইমেইল ও পাসওয়ার্ড আবশ্যক" },
        { status: 400 }
      );
    }

    const admin = await Admin.findOne({ email }).select("+password");
    if (!admin || !(await admin.matchPassword(password))) {
      return NextResponse.json(
        { success: false, message: "ইমেইল বা পাসওয়ার্ড সঠিক নয়" },
        { status: 401 }
      );
    }

    if (!admin.email) {
      return NextResponse.json(
        { success: false, message: "email missing" },
        { status: 404 }
      );
    }

    // Generate 6-digit OTP
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP + Expiry (3 mins)
    admin.loginOTP = verificationCode;
    admin.loginOTPExpiry = Date.now() + 3 * 60 * 1000; 
    await admin.save();

    // Nodemailer setup
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    // Send email
    await transporter.sendMail({
      from: `"Smart School Manager" <${process.env.GMAIL_USER}>`,
      to: admin.email,
      subject: "Login Verification Code",
      text: `Your Login verification code is: ${verificationCode}. It will expire in 3 minutes.`,
      html: `
        <p>Your verification code is: <b>${verificationCode}</b></p>
        <p>This code will expire in <b>3 minutes</b>.</p>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "OTP sent to your email",
      admin: {
        adminId: admin._id,
      },
    });

  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { success: false, message: "সার্ভার ত্রুটি!" },
      { status: 500 }
    );
  }
}
