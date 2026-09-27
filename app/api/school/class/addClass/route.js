
import Class from "@/app/model/Class";
import connectDb from "@/app/utils/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDb();

    const body = await req.json();

    const {
      className,
      sectionName,
      schoolId,
      totalSubject,
    } = body;

    // =====================================================
    // Required fields
    // =====================================================

    if (!className || !schoolId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "className, sectionName and schoolId are required.",
        },
        { status: 400 }
      );
    }

    // =====================================================
    // Validate totalSubject
    // =====================================================

    const subjectCount = Number(totalSubject);

    if (
      !Number.isInteger(subjectCount) ||
      subjectCount <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "totalSubject must be a positive integer.",
        },
        { status: 400 }
      );
    }

    // =====================================================
    // Check duplicate class + section
    // =====================================================

    const existing = await Class.findOne({
      className,
      sectionName,
      schoolId,
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Class with this section already exists.",
        },
        { status: 409 }
      );
    }

    // =====================================================
    // Create new class
    // =====================================================

    const newClass = await Class.create({
      className,
      sectionName,
      schoolId,

      totalSubject: subjectCount,

      // New class starts with zero students
      studentCount: 0,
    });

    // =====================================================
    // Success
    // =====================================================

    return NextResponse.json(
      {
        success: true,
        message: "Class added successfully.",
        data: newClass,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error(
      "Add class error:",
      err
    );

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error.",
      },
      { status: 500 }
    );
  }
}

