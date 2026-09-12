import School from "@/app/model/School";
import connectDb from "@/app/utils/db";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    await connectDb();

    const { phone, password, expoToken } = await req.json();

    // -----------------------------------------
    // Validate input
    // -----------------------------------------

    if (!phone?.trim() || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Phone and password are required",
        },
        { status: 400 }
      );
    }

    const phoneTrimmed = phone.trim();

    // -----------------------------------------
    // Validate phone number
    // -----------------------------------------

    if (!/^[0-9]{11}$/.test(phoneTrimmed)) {
      return NextResponse.json(
        {
          success: false,
          message: "Phone number must be 11 digits",
        },
        { status: 400 }
      );
    }

    // -----------------------------------------
    // Find school
    // -----------------------------------------

    const school = await School.findOne({
      phone: phoneTrimmed,
    });

    if (!school) {
      return NextResponse.json(
        {
          success: false,
          message: "School not found with this phone",
        },
        { status: 404 }
      );
    }

    // -----------------------------------------
    // Check account status
    // -----------------------------------------

    if (!school.isActive) {
      return NextResponse.json(
        {
          success: false,
          message: "This school account is currently inactive",
        },
        { status: 403 }
      );
    }

    // -----------------------------------------
    // Compare password
    // -----------------------------------------

    const isMatch = await school.comparePassword(password);

    if (!isMatch) {
      return NextResponse.json(
        {
          success: false,
          message: "Incorrect password",
        },
        { status: 401 }
      );
    }

    // -----------------------------------------
    // Update Expo push token
    // -----------------------------------------

    if (expoToken && expoToken !== school.expoToken) {
      school.expoToken = expoToken;
      await school.save();
    }

    // -----------------------------------------
    // Check email
    // -----------------------------------------

    if (!school.email) {
      return NextResponse.json(
        {
          success: false,
          message: "School email is missing",
        },
        { status: 400 }
      );
    }

    // -----------------------------------------
    // Generate Login OTP
    // -----------------------------------------

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // OTP expires after 15 minutes
    school.loginOTP = verificationCode;
    school.loginOTPExpiry =
      Date.now() + 15 * 60 * 1000;

    await school.save();

    // -----------------------------------------
    // Gmail transporter
    // -----------------------------------------

    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
      console.error("Gmail credentials are missing");

      return NextResponse.json(
        {
          success: false,
          message: "Email service is not configured",
        },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    // -----------------------------------------
    // Send OTP email
    // -----------------------------------------

    await transporter.sendMail({
      from: `"Smart School Manager" <${process.env.GMAIL_USER}>`,
      to: school.email,

      subject: "Login Verification Code",

      text: `
Your Smart School Manager login verification code is:

${verificationCode}

This code will expire in 15 minutes.

If you did not try to log in, please ignore this email.
      `,

      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 500px;
          margin: auto;
          padding: 20px;
        ">

          <h2>Login Verification</h2>

          <p>
            Hello ${school.principalName || "Principal"},
          </p>

          <p>
            Your Smart School Manager login verification code is:
          </p>

          <div style="
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            padding: 15px;
            margin: 20px 0;
            text-align: center;
            background: #f2f4f7;
            border-radius: 8px;
          ">
            ${verificationCode}
          </div>

          <p>
            This code will expire in
            <strong>15 minutes</strong>.
          </p>

          <p>
            If you did not try to log in, please ignore this email.
          </p>

          <p>
            Thank you.
          </p>

        </div>
      `,
    });

    // -----------------------------------------
    // Safe school data
    // -----------------------------------------

    const schoolData = {
      schoolId: school._id,
      schoolName: school.schoolName,
      phone: school.phone,
      email: school.email,
      slug: school.slug || "slug-not-set",
      principalName: school.principalName,
      logo: school.logo || null,
      cover: school.cover || null,
      role: school.role,
    };

    // -----------------------------------------
    // Response
    // -----------------------------------------

    return NextResponse.json(
      {
        success: true,
        message: "Verification code sent to email",
        school: schoolData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("School login error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server error, please try again later",
      },
      { status: 500 }
    );
  }
}