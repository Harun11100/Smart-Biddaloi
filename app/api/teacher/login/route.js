
import School from "@/app/model/School";
import Teacher from "@/app/model/Teacher";
import connectDb from "@/app/utils/db";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    await connectDb();

    const { phone, expoToken, password } = await req.json();

    // 🧠 Validate inputs
    if (!phone || !password) {
      return NextResponse.json(
        { success: false, message: "Phone and password are required." },
        { status: 400 }
      );
    }

    // 🔍 Find teacher
  const teacher = await Teacher.findOne({ phone }).select("+password");
if (!teacher) {
  return NextResponse.json(
    { success: false, message: "Teacher not found." },
    { status: 404 }
  );
}

// Use bcrypt to compare
const isMatch = await teacher.comparePassword(password);
if (!isMatch) {
  return NextResponse.json(
    { success: false, message: "Invalid password." },
    { status: 401 }
  );
}

    // 🏫 Find school
    const school = await School.findById(teacher.schoolId);
    if (!school) {
      return NextResponse.json(
        { success: false, message: "School not found." },
        { status: 404 }
      );
    }

    if (expoToken) {
      teacher.expoToken = expoToken;
      await teacher.save();
    }

     if (!teacher.email) {
      return NextResponse.json({ success: false, message: "Teacher email missing" }, { status: 404 });
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Store the code and expiry (5 minutes)
    teacher.loginOTP = verificationCode;
    teacher.loginOTPExpiry = Date.now() + 6 * 60 * 1000;
    await teacher.save();

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
      to: teacher.email,
      subject: "Login Verification Code",
      text: `Your Login verification code is: ${verificationCode}`,
      html: `<p>Your verification code is: <b>${verificationCode}</b></p>
              <p>This code will expire in 2 minutes.</p>`,
    });

    const safeTeacher = {
      _id: teacher._id,
      phone: teacher.phone,
      schoolId: teacher.schoolId,
    };

    return NextResponse.json(
      {
        success: true,
        message: "Login successful!",
        teacher: safeTeacher,
      },
      { status: 200 }
    );

  } catch (err) {
    console.error("❌ Login error message:", err.message);
    console.error("❌ Full stack:", err.stack);
    return NextResponse.json(
      { success: false, message: err.message || "Internal server error." },
      { status: 500 }
    );
  }
}
