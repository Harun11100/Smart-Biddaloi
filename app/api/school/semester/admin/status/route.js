// app/api/school/result/semester/admin/status/route.js

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDb from "@/app/utils/db";

import Class from "@/app/model/Class";
import SemesterResult from "@/app/model/SemesterResult";

export async function GET(req) {
  try {
    await connectDb();

    const { searchParams } = new URL(req.url);

    const schoolId = searchParams.get("schoolId");
    const semesterId = searchParams.get("semesterId");
    const classId = searchParams.get("classId");

    // =====================================================
    // Validate required parameters
    // =====================================================

    if (!schoolId || !semesterId || !classId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "schoolId, semesterId and classId are required.",
        },
        { status: 400 }
      );
    }

    // =====================================================
    // Validate ObjectIds
    // =====================================================

    if (
      !mongoose.Types.ObjectId.isValid(schoolId) ||
      !mongoose.Types.ObjectId.isValid(semesterId) ||
      !mongoose.Types.ObjectId.isValid(classId)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid schoolId, semesterId or classId.",
        },
        { status: 400 }
      );
    }

    // =====================================================
    // Find ONLY requested class
    // =====================================================

    const cls = await Class.findOne({
      _id: classId,
      schoolId,
    })
      .select(
        "_id className sectionName totalSubject studentCount"
      )
      .lean();

    if (!cls) {
      return NextResponse.json(
        {
          success: false,
          message: "Class not found.",
        },
        { status: 404 }
      );
    }

    // =====================================================
    // Get results ONLY for this class + semester
    // =====================================================

    const results = await SemesterResult.find({
      classId,
      semesterId,
    })
      .select(
        "studentId totalSubject subjects status publishedAt"
      )
      .lean();

    // =====================================================
    // Expected values
    // =====================================================

    const expectedSubjects =
      Number(cls.totalSubject) || 0;

    const expectedStudents =
      Number(cls.studentCount) || 0;

    // =====================================================
    // Build subject status
    // =====================================================

    const subjectMap = new Map();

    results.forEach((studentResult) => {
      (studentResult.subjects || []).forEach(
        (subject) => {
          const subjectId =
            subject.subjectId?.toString();

          if (!subjectId) return;

          if (!subjectMap.has(subjectId)) {
            subjectMap.set(subjectId, {
              subjectId,
              subjectName:
                subject.subjectName ||
                "Unknown Subject",

              uploadedStudents: 0,

              submittedStudents: 0,

              verifiedStudents: 0,
            });
          }

          const subjectInfo =
            subjectMap.get(subjectId);

          // Student has this subject result
          subjectInfo.uploadedStudents += 1;

          if (
            subject.status === "submitted"
          ) {
            subjectInfo.submittedStudents += 1;
          }

          if (
            subject.status === "verified"
          ) {
            subjectInfo.verifiedStudents += 1;
          }
        }
      );
    });

    // =====================================================
    // Subject summary
    // =====================================================

    const uploadedSubjects =
      subjectMap.size;

    const remainingSubjects = Math.max(
      expectedSubjects - uploadedSubjects,
      0
    );

    // =====================================================
    // Student completion
    // =====================================================

    let studentsCompleted = 0;
    let studentsIncomplete = 0;

    results.forEach((studentResult) => {
      const subjectCount =
        studentResult.subjects?.length || 0;

      if (
        subjectCount === expectedSubjects
      ) {
        studentsCompleted += 1;
      } else {
        studentsIncomplete += 1;
      }
    });

    // =====================================================
    // Check all students are present
    // =====================================================

    const allStudentsPresent =
      expectedStudents > 0 &&
      results.length === expectedStudents;

    // =====================================================
    // Check every student has all subjects
    // =====================================================

    const allStudentsComplete =
      allStudentsPresent &&
      results.every((studentResult) => {
        const subjectCount =
          studentResult.subjects?.length || 0;

        return (
          subjectCount === expectedSubjects
        );
      });

    // =====================================================
    // Check every subject is submitted/verified
    // =====================================================

    const allSubjectsSubmitted =
      results.length > 0 &&
      results.every((studentResult) => {
        return (
          studentResult.subjects?.length ===
            expectedSubjects &&
          studentResult.subjects.every(
            (subject) =>
              subject.status === "submitted" ||
              subject.status === "verified"
          )
        );
      });

    // =====================================================
    // Check published status
    // =====================================================

    const isPublished =
      results.length > 0 &&
      results.every(
        (studentResult) =>
          studentResult.status === "published"
      );

    // =====================================================
    // Can publish?
    // =====================================================

    const canPublish =
      allStudentsComplete &&
      allSubjectsSubmitted &&
      !isPublished;

    // =====================================================
    // Published date
    // =====================================================

    const publishedAt =
      results.find(
        (item) => item.publishedAt
      )?.publishedAt || null;

    // =====================================================
    // Final class status
    // =====================================================

    const classStatus = {
      classId: cls._id,

      className: cls.className,

      sectionName:
        cls.sectionName || "",

      expectedSubjects,

      uploadedSubjects,

      remainingSubjects,

      expectedStudents,

      studentsWithResults:
        results.length,

      studentsCompleted,

      studentsIncomplete,

      allStudentsPresent,

      allStudentsComplete,

      allSubjectsSubmitted,

      canPublish,

      isPublished,

      publishedAt,

      subjects: Array.from(
        subjectMap.values()
      ),
    };

    // =====================================================
    // Response
    // =====================================================

    return NextResponse.json(
      {
        success: true,

        data: {
          schoolId,
          semesterId,
          classId,

          class: classStatus,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "❌ Admin class result status error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to load class result status.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}