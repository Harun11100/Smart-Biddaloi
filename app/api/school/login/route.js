import School from "@/app/model/School";
import connectDb from "@/app/utils/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken"; // Make sure jsonwebtoken is installed

export async function POST(req) {
  try {
    await connectDb();

    const { phone, password } = await req.json();

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
    // Generate JWT Token
    // -----------------------------------------

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing in environment variables");
      return NextResponse.json(
        {
          success: false,
          message: "Server configuration error",
        },
        { status: 500 }
      );
    }

    const token = jwt.sign(
      { schoolId: school._id, phone: school.phone },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // Adjust token expiration as needed
    );

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
        message: "Login successful",
        token: token,
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