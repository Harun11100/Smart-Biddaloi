import School from "@/app/model/School";
import Teacher from "@/app/model/Teacher";
import connectDb from "@/app/utils/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDb();

    const body = await req.json();

    console.log(
      "Received staff creation request:",
      body
    );

    const {
      email,
      name,
      password,
      phone,
      role,
      schoolId,
      subjects = [],
      address = "",
      experience = "",
      imageUrl = null,
    } = body;

    // ==========================================
    // REQUIRED FIELD VALIDATION
    // ==========================================
    if (
      !email ||
      !name ||
      !password ||
      !phone ||
      !schoolId ||
      !role
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "নাম, ইমেইল, ফোন, পিন, দায়িত্ব এবং স্কুলের তথ্য প্রদান করুন।",
        },
        { status: 400 }
      );
    }

    // ==========================================
    // VALIDATE ROLE
    // ==========================================
    const allowedRoles = [
      "teacher",
      "accountant",
      "admin",
    ];

    if (!allowedRoles.includes(role)) {
      return NextResponse.json(
        {
          success: false,
          message: "অবৈধ দায়িত্ব নির্বাচন করা হয়েছে।",
        },
        { status: 400 }
      );
    }

    // ==========================================
    // CHECK SCHOOL
    // ==========================================
    const school = await School.findById(schoolId);

    if (!school) {
      return NextResponse.json(
        {
          success: false,
          message: "স্কুল খুঁজে পাওয়া যায়নি।",
        },
        { status: 404 }
      );
    }

    // ==========================================
    // CHECK DUPLICATE EMAIL / PHONE
    // ==========================================
    const existing = await Teacher.findOne({
      $or: [
        { email: email.trim().toLowerCase() },
        { phone: phone.trim() },
      ],
    });

    if (existing) {
      let message =
        "ইমেইল বা ফোন ইতিমধ্যেই ব্যবহার করা হয়েছে।";

      if (
        existing.email ===
        email.trim().toLowerCase()
      ) {
        message =
          "এই ইমেইল ইতিমধ্যেই ব্যবহার করা হয়েছে।";
      } else if (
        existing.phone === phone.trim()
      ) {
        message =
          "এই ফোন নম্বর ইতিমধ্যেই ব্যবহার করা হয়েছে।";
      }

      return NextResponse.json(
        {
          success: false,
          message,
        },
        { status: 409 }
      );
    }

    // ==========================================
    // CREATE TEACHER / STAFF
    // ==========================================
    const newTeacher = await Teacher.create({
      name: name.trim(),

      email: email.trim().toLowerCase(),

      phone: phone.trim(),

      password: password.trim(),

      role,

      schoolId,

      subjects: Array.isArray(subjects)
        ? subjects
        : [],

      address: address.trim(),

      experience,

      imageUrl,
    });

    // ==========================================
    // INCREMENT SCHOOL STAFF COUNT
    // ==========================================
    await School.findByIdAndUpdate(
      schoolId,
      {
        $inc: {
          totalTeachers: 1,
        },
      }
    );

    // ==========================================
    // SAFE RESPONSE
    // Never send password to frontend
    // ==========================================
    const safeTeacher = {
      _id: newTeacher._id,
      name: newTeacher.name,
      email: newTeacher.email,
      phone: newTeacher.phone,
      role: newTeacher.role,
      experience: newTeacher.experience,
      imageUrl: newTeacher.imageUrl,
      schoolId: newTeacher.schoolId,
      subjects: newTeacher.subjects,
      address: newTeacher.address,
    };

    return NextResponse.json(
      {
        success: true,
        message: "স্টাফ সফলভাবে যুক্ত হয়েছে!",
        teacher: safeTeacher,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error(
      "❌ Error creating staff:",
      err
    );

    // ==========================================
    // MONGOOSE DUPLICATE KEY ERROR
    // ==========================================
    if (err.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message:
            "ইমেইল অথবা ফোন নম্বর ইতিমধ্যে ব্যবহার করা হয়েছে।",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          "সার্ভার ত্রুটি হয়েছে। পরে আবার চেষ্টা করুন।",
      },
      { status: 500 }
    );
  }
}