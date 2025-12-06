import { NextResponse } from "next/server";
import connectDb from "@/app/utils/db";
import School from "@/app/model/School";
import Teacher from "@/app/model/Teacher";


export async function POST(req) {
  try {
    await connectDb();
    const { schoolId,teacherId, loginOTP } = await req.json();

    if (!schoolId || !loginOTP || !teacherId) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const school = await School.findById(schoolId);
    if (!school) {
      return NextResponse.json(
        { success: false, message: "School not found" },
        { status: 404 }
      );
    }
     const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return NextResponse.json(
        { success: false, message: "Teacher not found" },
        { status: 404 }
      );
    }
      
    if (
      teacher.loginOTP !== loginOTP ||
      !teacher.loginOTPExpiry ||
      teacher.loginOTPExpiry < Date.now()
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired login OTP" },
        { status: 400 }
      );
    }

    teacher.loginOTP = null;
    teacher.loginOTPExpiry = null;
    await teacher.save();

    return NextResponse.json({
      success: true,
      message: "Your OTP is verified , You can log in ",
    });
  } catch (error) {
    console.error("Error verifying login OTP:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
