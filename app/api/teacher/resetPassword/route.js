import Teacher from "@/app/model/Teacher";
import connectDb from "@/app/utils/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDb();

    const { teacherId, password } = await req.json();

    if (!teacherId || !password) {
      return NextResponse.json(
        { message: "teacher ID এবং password প্রয়োজন" },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { message: "পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে" },
        { status: 400 }
      );
    }

    const teacher = await Teacher.findById(teacherId).select("+password");
    if (!teacher) {
      return NextResponse.json(
        { message: "শিক্ষক পাওয়া যায়নি" },
        { status: 404 }
      );
    }

    // Update and save (auto-hashes via pre('save'))
    teacher.password = password;
    await teacher.save();

    const teacherData = {
      _id: teacher._id.toString(),
      name: teacher.name,
      phone: teacher.phone,
      email: teacher.email,
      role: teacher.role,
    };

    return NextResponse.json(
      { message: "পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে", teacher: teacherData },
      { status: 200 }
    );
  } catch (error) {
    console.error("New password error:", error);
    return NextResponse.json(
      { message: "সার্ভার ত্রুটি" },
      { status: 500 }
    );
  }
}
