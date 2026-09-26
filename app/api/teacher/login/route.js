import School from "@/app/model/School";
import Teacher from "@/app/model/Teacher";
import connectDb from "@/app/utils/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDb();

    const { phone, password, expoToken } = await req.json();

    // =========================
    // Validate input
    // =========================
    if (!phone || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Phone and password are required.",
        },
        { status: 400 }
      );
    }

    // =========================
    // Find staff account
    // =========================
    const teacher = await Teacher.findOne({
      phone: phone.trim(),
    }).select("+password");

    if (!teacher) {
      return NextResponse.json(
        {
          success: false,
          message: "Phone number or password is incorrect.",
        },
        { status: 401 }
      );
    }

    // =========================
    // Check password
    // =========================
    const isMatch = await teacher.comparePassword(password);

    if (!isMatch) {
      return NextResponse.json(
        {
          success: false,
          message: "Phone number or password is incorrect.",
        },
        { status: 401 }
      );
    }

    // =========================
    // Find school
    // =========================
    const school = await School.findById(teacher.schoolId);

    if (!school) {
      return NextResponse.json(
        {
          success: false,
          message: "School not found.",
        },
        { status: 404 }
      );
    }

    // =========================
    // Update Expo Push Token
    // =========================
    if (expoToken && expoToken !== teacher.expoToken) {
      teacher.expoToken = expoToken;
      await teacher.save();
    }

    // =========================
    // Safe staff information
    // =========================
    const safeTeacher = {
      _id: teacher._id,
      name: teacher.name,
      email: teacher.email,
      phone: teacher.phone,
      role: teacher.role,
      schoolId: teacher.schoolId,
      subjects: teacher.subjects || [],
      address: teacher.address || "",
      experience: teacher.experience || "",
      imageUrl: teacher.imageUrl || null,
    };

    // =========================
    // Login successful
    // =========================
    return NextResponse.json(
      {
        success: true,
        message: "Login successful!",
        teacher: safeTeacher,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Login error:", err);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error.",
      },
      { status: 500 }
    );
  }
}