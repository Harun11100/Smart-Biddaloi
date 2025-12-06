import School from "@/app/model/School";
import Teacher from "@/app/model/Teacher";
import connectDb from "@/app/utils/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDb();

    const body = await req.json();
    const { classTeacher, email, name, password, phone, role, schoolId, subjects } = body;

    // 🧾 Basic validation
    if (!email || !name || !password || !phone || !schoolId) {
      return NextResponse.json(
        { success: false, message: "সব প্রয়োজনীয় তথ্য প্রদান করুন।" },
        { status: 400 }
      );
    }

    // 🧩 Try creating new teacher
    try {
      const newTeacher = await Teacher.create({
        classTeacher,
        email,
        name,
        password,
        phone,
        role,
        schoolId,
        subjects,
      });

      // Increment totalTeachers count in the School collection
      await School.findByIdAndUpdate(schoolId, { $inc: { totalTeachers: 1 } });

      // Exclude sensitive data before sending back
      const safeTeacher = {
        _id: newTeacher._id,
        name: newTeacher.name,
        phone: newTeacher.phone,
        email: newTeacher.email,
        role: newTeacher.role,
        schoolId: newTeacher.schoolId,
        classTeacher: newTeacher.classTeacher,
        subjects: newTeacher.subjects,
      };

      return NextResponse.json(
        { success: true, message: "শিক্ষক সফলভাবে যুক্ত হয়েছে!", teacher: safeTeacher },
        { status: 201 }
      );
    } catch (err) {
      // 🧱 Handle duplicate key error (email or phone already exists)
      if (err.code === 11000) {
        return NextResponse.json(
          { success: false, message: "ইমেইল বা ফোন ইতিমধ্যেই ব্যবহার করা হয়েছে।" },
          { status: 409 }
        );
      }
      throw err; // Let outer catch handle unexpected errors
    }

  } catch (error) {
    console.error("❌ Error creating teacher:", error);
    return NextResponse.json(
      { success: false, message: "সার্ভার ত্রুটি হয়েছে। পরে আবার চেষ্টা করুন।" },
      { status: 500 }
    );
  }
}
