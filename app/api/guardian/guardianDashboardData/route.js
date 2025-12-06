import { NextResponse } from "next/server";
import connectDb from "@/app/utils/db";
import School from "@/app/model/School";
import Student from "@/app/model/Student";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const schoolId = searchParams.get("schoolId");
    const phone = searchParams.get("phone");

    if (!schoolId || !phone) {
      return NextResponse.json(
        { success: false, message: "schoolId required" },
        { status: 400 }
      );
    }
    await connectDb();
    const checkStudent = await Student.findOne({guardianPhone:phone})
    if (!checkStudent) {
      return NextResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 }
      );
    }

    const school = await School.findById(schoolId).lean();
    if (!school) {
      return NextResponse.json(
        { success: false, message: "School not found" },
        { status: 404 }
      );
    }

    const safeSchool = {
      schoolId: school._id,
      schoolName: school.schoolName,
      logo: school.logo || null,
      cover: school.cover || null,
      appUpdateUrl:school.appUpdateUrl,
      availableAlert: school.availableAlert||false,
      alertMessage: school.alertMessage,
      alertTitle: school.alertTitle,
    };

    return NextResponse.json(
      {
        success: true,
        message: "School data fetched successfully",
        school: safeSchool,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Error fetching school:", err);
    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}
