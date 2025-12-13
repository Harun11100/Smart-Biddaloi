import School from "@/app/model/School";
import Teacher from "@/app/model/Teacher";
import connectDb from "@/app/utils/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDb();

    const body = await req.json();
    const {
      classTeacher = "",
      email,
      name,
      password,
      phone,
      role,
      schoolId,
      subjects = [],
      gender = "male",
      address = "",
      bloodGroup = "",
      nid = "",
      userName = "",
    } = body;

    // Basic validation
    if (!email || !name || !password || !phone || !schoolId || !role) {
      return NextResponse.json(
        { success: false, message: "সব প্রয়োজনীয় তথ্য প্রদান করুন।" },
        { status: 400 }
      );
    }

    // Check for duplicates
    const existing = await Teacher.findOne({ $or: [{ email }, { phone }] });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "ইমেইল বা ফোন ইতিমধ্যেই ব্যবহার করা হয়েছে।" },
        { status: 409 }
      );
    }

    const newTeacher = await Teacher.create({
      classTeacher,
      email,
      name,
      password,
      phone,
      role,
      schoolId,
      subjects,
      gender,
      address,
      bloodGroup,
      nid,
      userName,
    });

    // Increment teacher count in the school
    await School.findByIdAndUpdate(schoolId, { $inc: { totalTeachers: 1 } });

    // Exclude sensitive data
    const safeTeacher = {
      _id: newTeacher._id,
      name: newTeacher.name,
      email: newTeacher.email,
      phone: newTeacher.phone,
      role: newTeacher.role,
      schoolId: newTeacher.schoolId,
      classTeacher: newTeacher.classTeacher,
      subjects: newTeacher.subjects,
      gender: newTeacher.gender,
    };

    return NextResponse.json(
      { success: true, message: "শিক্ষক সফলভাবে যুক্ত হয়েছে!", teacher: safeTeacher },
      { status: 201 }
    );
  } catch (err) {
    console.error("❌ Error creating teacher:", err);
    return NextResponse.json(
      { success: false, message: "সার্ভার ত্রুটি হয়েছে। পরে আবার চেষ্টা করুন।" },
      { status: 500 }
    );
  }
}
