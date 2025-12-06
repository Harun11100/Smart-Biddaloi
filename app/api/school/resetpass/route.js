import School from "@/app/model/School";
import connectDb from "@/app/utils/db";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    await connectDb();

    const { phone, email } = await req.json();

    if (!phone || !email) {
      return NextResponse.json(
        { success: false, message: "ফোন বা ইমেইল প্রয়োজন" },
        { status: 400 }
      );
    }

    const school = await School.findOne({ phone, email });
    if (!school) {
      return NextResponse.json(
        { success: false, message: "স্কুল খুঁজে পাওয়া যায়নি বা তথ্য সঠিক নয়" },
        { status: 404 }
      );
    }

    // Generate a 6-digit OTP
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP and expiry (6 minutes)
    school.passOTP = verificationCode;
    school.passOTPExpiry = Date.now() + 6 * 60 * 1000;
    await school.save();

    // Send email using Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Smart School Manager" <${process.env.GMAIL_USER}>`,
      to: school.email,
      subject: "Password Reset Verification Code",
      text: `Your verification code is: ${verificationCode}`,
      html: `<p>Your verification code is: <b>${verificationCode}</b></p>
             <p>This code will expire in 6 minutes.</p>`,
    });

    const schoolData = {
      _id: school._id,
      schoolName: school.schoolName,
      phone: school.phone,
      email: school.email,
    };

    return NextResponse.json(
      { success: true, message: "আবেদন গৃহীত হয়েছে", school: schoolData },
      { status: 200 }
    );
  } catch (error) {
    console.error("School reset password error:", error);
    return NextResponse.json(
      { success: false, message: "সার্ভার ত্রুটি" },
      { status: 500 }
    );
  }
}
