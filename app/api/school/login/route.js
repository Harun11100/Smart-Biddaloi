import School from "@/app/model/School";
import connectDb from "@/app/utils/db";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    await connectDb();

    const { phone, password, expoToken } = await req.json();

    if (!phone?.trim() || !password) {
      return NextResponse.json(
        { message: "Phone and password are required" },
        { status: 400 }
      );
    }

    const phoneTrimmed = phone.trim();

    if (!/^[0-9]{11}$/.test(phoneTrimmed)) {
      return NextResponse.json(
        { message: "Phone number must be 11 digits" },
        { status: 400 }
      );
    }

    const school = await School.findOne({ phone: phoneTrimmed});
    
    if (!school) {
      return NextResponse.json(
        { message: "School not found with this phone" },
        { status: 404 }
      );
    }

    const isMatch = await school.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Incorrect password" },
        { status: 401 }
      );
    }

    if (expoToken && expoToken !== school.expoToken) {
      school.expoToken = expoToken;
      await school.save();
    }

     if (!school.email) {
          return NextResponse.json({ success: false, message: "School not found or email missing" }, { status: 404 });
        }
    
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
        // Store the code and expiry (5 minutes)
        school.loginOTP = verificationCode;
        school.loginOTPExpiry = Date.now() + 15 * 60 * 1000;
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
          subject: "Login Verification Code",
          text: `Your Login verification code is: ${verificationCode}`,
          html: `<p>Your verification code is: <b>${verificationCode}</b></p>
                 <p>This code will expire in 2 minutes.</p>`,
        });
    
    const schoolData = {
      schoolId: school._id,
      schoolName: school.schoolName,
      phone: school.phone,
      slug: school.slug||"slug-not-set",
      principalName:school.principalName,
    };

    return NextResponse.json(
      { message: "Verification code sent to email", school: schoolData },
      { status: 200 }
    );
  } catch (error) {
    console.error("School login error:", error);
    return NextResponse.json(
      { message: "Server error, please try again later" },
      { status: 500 }
    );
  }
}
