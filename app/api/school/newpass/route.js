
import School from "@/app/model/School";
import connectDb from "@/app/utils/db";
import { NextResponse } from "next/server";


export async function POST(req) {
  try {

    await connectDb();
    const { schoolId, password } = await req.json();

    if (!schoolId || !password) {
      return NextResponse.json(
        { message: "School ID এবং password প্রয়োজন" },
        { status: 400 }
      );
      
    }

    // 🔍 Find school by ID
    const school = await School.findById(schoolId);
    if (!school) {
      return NextResponse.json(
        { message: " স্কুল পাওয়া যায়নি" },
        { status: 404 }
      );
    }

    // 📝 Update password
    school.password = password;
    await school.save();

    // Response
    const schoolData = {
      _id: school._id.toString(),
      schoolName: school.schoolName,
      phone: school.phone,
      email: school.email,
    };

    return NextResponse.json(
      { message: "পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে", school: schoolData },
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
