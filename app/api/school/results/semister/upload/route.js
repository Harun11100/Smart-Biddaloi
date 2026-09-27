// app/api/school/result/semester/upload/route.js

import { NextResponse } from "next/server";
import mongoose from "mongoose";

import connectDb from "@/app/utils/db";
import SemesterResult from "@/app/model/SemesterResult";

// =====================================================
// Calculate Grade & GPA
// =====================================================

function calculateGradeAndGPA(mark, maxMarks) {
  const percentage = (mark / maxMarks) * 100;

  if (percentage >= 80) {
    return {
      grade: "A+",
      gpa: 5.0,
    };
  }

  if (percentage >= 70) {
    return {
      grade: "A",
      gpa: 4.0,
    };
  }

  if (percentage >= 60) {
    return {
      grade: "A-",
      gpa: 3.5,
    };
  }

  if (percentage >= 50) {
    return {
      grade: "B",
      gpa: 3.0,
    };
  }

  if (percentage >= 40) {
    return {
      grade: "C",
      gpa: 2.0,
    };
  }

  if (percentage >= 33) {
    return {
      grade: "D",
      gpa: 1.0,
    };
  }

  return {
    grade: "F",
    gpa: 0.0,
  };
}

// =====================================================
// POST
// =====================================================

export async function POST(req) {
  try {
    await connectDb();

    const body = await req.json();

    const {
      schoolId,
      classId,
      teacherId,
      semesterId,
      totalSubject,
      subjectId,
      subjectName,
      maxMarks,
      passingMarks,
      results,
    } = body;

    // =================================================
    // 1. Required fields
    // =================================================

    if (
      !schoolId ||
      !classId ||
      !teacherId ||
      !semesterId ||
      !subjectId ||
      !subjectName
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "schoolId, classId, teacherId, semesterId, subjectId and subjectName are required.",
        },
        { status: 400 }
      );
    }

    if (!Array.isArray(results) || results.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Results are required.",
        },
        { status: 400 }
      );
    }

    // =================================================
    // 2. Validate ObjectIds
    // =================================================

    const ids = [
      ["schoolId", schoolId],
      ["classId", classId],
      ["teacherId", teacherId],
      ["semesterId", semesterId],
      ["subjectId", subjectId],
    ];

    for (const [name, value] of ids) {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return NextResponse.json(
          {
            success: false,
            message: `Invalid ${name}.`,
          },
          { status: 400 }
        );
      }
    }

    // =================================================
    // 3. Validate marks configuration
    // =================================================

    const parsedMaxMarks = Number(maxMarks);
    const parsedPassingMarks = Number(passingMarks);

    if (
      !Number.isFinite(parsedMaxMarks) ||
      !Number.isFinite(parsedPassingMarks)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid maxMarks or passingMarks.",
        },
        { status: 400 }
      );
    }

    if (parsedMaxMarks <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Maximum marks must be greater than 0.",
        },
        { status: 400 }
      );
    }

    if (
      parsedPassingMarks < 0 ||
      parsedPassingMarks > parsedMaxMarks
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid passing marks.",
        },
        { status: 400 }
      );
    }

    // =================================================
    // 4. Validate students and marks
    // =================================================

    const studentIds = [];

    for (const item of results) {
      if (!item.studentId) {
        return NextResponse.json(
          {
            success: false,
            message: "Student ID is missing.",
          },
          { status: 400 }
        );
      }

      if (!mongoose.Types.ObjectId.isValid(item.studentId)) {
        return NextResponse.json(
          {
            success: false,
            message: `Invalid student ID: ${item.studentId}`,
          },
          { status: 400 }
        );
      }

      const mark = Number(item.mark);

      if (!Number.isFinite(mark)) {
        return NextResponse.json(
          {
            success: false,
            message: `Invalid mark for student ${item.studentId}.`,
          },
          { status: 400 }
        );
      }

      if (mark < 0 || mark > parsedMaxMarks) {
        return NextResponse.json(
          {
            success: false,
            message: `Mark must be between 0 and ${parsedMaxMarks}.`,
          },
          { status: 400 }
        );
      }

      studentIds.push(item.studentId);
    }

    // =================================================
    // 5. Prevent duplicate student IDs
    // =================================================

    const uniqueStudentIds = [...new Set(studentIds)];

    if (uniqueStudentIds.length !== studentIds.length) {
      return NextResponse.json(
        {
          success: false,
          message: "Duplicate student IDs found in results.",
        },
        { status: 400 }
      );
    }

    // =================================================
    // 6. Check whether this subject was already uploaded
    // =================================================

    const existingResults = await SemesterResult.find({
      semesterId,
      studentId: {
        $in: uniqueStudentIds,
      },
      "subjects.subjectId": subjectId,
    }).select("studentId");

    if (existingResults.length > 0) {
      return NextResponse.json(
        {
          success: false,
          alreadyExists: true,
          message:
            "Result for this subject has already been uploaded for one or more students.",
          students: existingResults.map(
            (item) => item.studentId
          ),
        },
        { status: 409 }
      );
    }

    // =================================================
    // 7. Create bulk operations
    // =================================================

    const operations = results.map((item) => {
      const mark = Number(item.mark);

      // Calculate grade and GPA
      const { grade, gpa } = calculateGradeAndGPA(
        mark,
        parsedMaxMarks
      );

      return {
        updateOne: {
          filter: {
            studentId: item.studentId,
            semesterId,
          },

          update: {
            // -----------------------------------------
            // Create document if student has no
            // semester result yet
            // -----------------------------------------

            $setOnInsert: {
              schoolId,
              semesterId,
              classId,
              studentId: item.studentId,

              totalMarks: 0,
              totalPossibleMarks: 0,
              averageMarks: 0,
              gpa: 0,
              position: null,
              status: "draft",
              publishedAt: null,
            },

            // -----------------------------------------
            // Add this subject result
            // -----------------------------------------

            $push: {
              subjects: {
                subjectId,
                subjectName: subjectName.trim(),
                teacherId,

                maxMarks: parsedMaxMarks,
                passingMarks: parsedPassingMarks,

                totalMarks: mark,

                grade,
                gpa,

                status: "submitted",

                remarks: "",
              },
            },
          },

          upsert: true,
        },
      };
    });

    // =================================================
    // 8. Execute bulk operation
    // =================================================

    const bulkResult =
      await SemesterResult.bulkWrite(operations);

    // =================================================
    // 9. Response
    // =================================================

    return NextResponse.json(
      {
        success: true,

        message:
          `${subjectName} results uploaded successfully.`,

        data: {
          semesterId,
          subjectId,
          subjectName,
          teacherId,

          studentsProcessed: results.length,

          createdOrUpdated:
            bulkResult.upsertedCount +
            bulkResult.modifiedCount,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "❌ Upload semester subject result error:",
      error
    );

    // =================================================
    // Duplicate key protection
    // =================================================

    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          alreadyExists: true,
          message:
            "A semester result already exists for one or more students.",
        },
        { status: 409 }
      );
    }

    // =================================================
    // Internal error
    // =================================================

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to upload semester subject results.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}