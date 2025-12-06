import { NextResponse } from "next/server";
import connectDb from "@/app/utils/db";
import School from "@/app/model/School";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    await connectDb();
    const { schoolId } = await req.json();

    if (!schoolId) {
      return NextResponse.json({ success: false, message: "Missing schoolId" }, { status: 400 });
    }
    const school = await School.findById(schoolId);
    if (!school || !school.email) {
      return NextResponse.json({ success: false, message: "School not found or email missing" }, { status: 404 });
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Store the code and expiry (5 minutes)
    school.resetCode = verificationCode;
    school.resetCodeExpiry = Date.now() + 5 * 60 * 1000;
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
      subject: "Reset Payment Count Verification Code",
      text: `Your verification code is: ${verificationCode}`,
      html: `<p>Your verification code is: <b>${verificationCode}</b></p>
             <p>This code will expire in 5 minutes.</p>`,
    });

    return NextResponse.json({ success: true, message: "Verification code sent to email" });
  } catch (error) {
    console.error("Error in resetPaymentCount:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
