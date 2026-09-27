// app/api/school/result/semester/admin/publish/route.js

import { NextResponse } from "next/server";

import connectDb from "@/app/utils/db";

import Class from "@/app/model/Class";
import SemesterResult from "@/app/model/SemesterResult";

export async function POST(req) {
  try {
    await connectDb();

    const body = await req.json();

    const {
      schoolId,
      semesterId,
      classId,
    } = body;

    // =====================================================
    // Validate
    // =====================================================

    if (
      !schoolId ||
      !semesterId ||
      !classId
    ) {
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
    // Find class
    // =====================================================

    const classData = await Class.findOne({
      _id: classId,
      schoolId,
    }).lean();

    if (!classData) {
      return NextResponse.json(
        {
          success: false,
          message: "Class not found.",
        },
        { status: 404 }
      );
    }

    const expectedSubjects =
      Number(classData.totalSubject) || 0;

    const expectedStudents =
      Number(classData.studentCount) || 0;

    // =====================================================
    // Get all student semester results
    // =====================================================

    const results =
      await SemesterResult.find({
        classId,
        semesterId,
        schoolId,
      }).lean();

    // =====================================================
    // Check student count
    // =====================================================

    if (
      results.length !== expectedStudents
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Cannot publish. Not all students have semester results.",
          expectedStudents,
          studentsWithResults:
            results.length,
        },
        { status: 409 }
      );
    }

    // =====================================================
    // Check every student has all subjects
    // =====================================================

    const incompleteStudents = [];

    for (const result of results) {
      const subjectCount =
        result.subjects?.length || 0;

      if (
        subjectCount !== expectedSubjects
      ) {
        incompleteStudents.push({
          studentId: result.studentId,
          uploadedSubjects: subjectCount,
          expectedSubjects,
        });
      }
    }

    if (incompleteStudents.length > 0) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Cannot publish. Some students do not have all subject results.",

          incompleteStudents,
        },
        { status: 409 }
      );
    }

    // =====================================================
    // Check subject statuses
    // =====================================================

    const unsubmittedStudents = [];

    for (const result of results) {
      const hasUnsubmittedSubject =
        result.subjects.some(
          (subject) =>
            subject.status !== "submitted" &&
            subject.status !== "verified"
        );

      if (hasUnsubmittedSubject) {
        unsubmittedStudents.push(
          result.studentId
        );
      }
    }

    if (
      unsubmittedStudents.length > 0
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Cannot publish. Some subject results are not submitted.",

          students:
            unsubmittedStudents,
        },
        { status: 409 }
      );
    }

    // =====================================================
    // Check already published
    // =====================================================

    const alreadyPublished =
      results.every(
        (result) =>
          result.status === "published"
      );

    if (alreadyPublished) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This class result has already been published.",
        },
        { status: 409 }
      );
    }

    // =====================================================
    // Publish
    // =====================================================

    const publishedAt = new Date();

    const updateResult =
      await SemesterResult.updateMany(
        {
          classId,
          semesterId,
          schoolId,
        },
        {
          $set: {
            status: "published",
            publishedAt,
          },
        }
      );

    // =====================================================
    // Response
    // =====================================================

    return NextResponse.json(
      {
        success: true,

        message:
          "Semester result published successfully.",

        data: {
          classId,

          semesterId,

          studentsPublished:
            updateResult.modifiedCount,

          publishedAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "❌ Publish semester result error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to publish semester result.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
