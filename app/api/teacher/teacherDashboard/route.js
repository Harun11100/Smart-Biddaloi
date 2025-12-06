import { NextResponse } from "next/server";
import connectDb from "@/app/utils/db";
import School from "@/app/model/School";
import Teacher from "@/app/model/Teacher";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const schoolId = searchParams.get("schoolId");
    const phone = searchParams.get("phone");

    if (!schoolId) {
      return NextResponse.json(
        { success: false, message: "schoolId is required" },
        { status: 400 }
      );
    }
    await connectDb();
    const teacher = await Teacher.findOne({schoolId,phone})
    if (!teacher) {
      return NextResponse.json(
        { success: false, message: "Teacher not found" },
        { status: 404 }
      );
    } 
      const safeTeacher = {
      _id: teacher._id,
      name: teacher.name,
      email:teacher.email,
      phone: teacher.phone,
      schoolId: teacher.schoolId,
      role:teacher.role,
      subjects:teacher.subjects,
      classTeacher:teacher.classTeacher
    };
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
      availableAlert: school.availableAlert,
      alertMessage: school.alertMessage,
      alertTitle: school.alertTitle,
    };

    return NextResponse.json(
      {
        success: true,
        message: "School data fetched successfully",
        school: safeSchool,
        teacher: safeTeacher||{},
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
