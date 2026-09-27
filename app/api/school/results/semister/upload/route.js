// app/api/school/result/semester/upload/route.js

import { NextResponse } from "next/server";
import mongoose from "mongoose";

import connectDb from "@/app/utils/db";
import SemesterResult from "@/app/model/SemesterResult";

export async function POST(req) {
  try {
    await connectDb();

    const body = await req.json();

    const {
      schoolId,
      classId,
      teacherId,
      semesterId,
      subjectId,
      subjectName,
      maxMarks,
      passingMarks,
      results,
    } = body;

    // -----------------------------------------
    // 1. Basic validation
    // -----------------------------------------

    if (
      !schoolId ||
      !classId ||
      !teacherId ||
      !semesterId ||
      !subjectName||
      !subjectId
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Required information is missing.",
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

    // -----------------------------------------
    // 2. Validate ObjectIds
    // -----------------------------------------

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

    // -----------------------------------------
    // 3. Validate max marks & passing marks
    // -----------------------------------------

    const parsedMaxMarks = Number(maxMarks);
    const parsedPassingMarks = Number(passingMarks);

    if (
      !Number.isFinite(parsedMaxMarks) ||
      !Number.isFinite(parsedPassingMarks)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid max marks or passing marks.",
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

    // -----------------------------------------
    // 4. Validate student results
    // -----------------------------------------

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

    // -----------------------------------------
    // 5. Prevent duplicate student IDs
    // -----------------------------------------

    const uniqueStudentIds = [
      ...new Set(studentIds),
    ];

    if (uniqueStudentIds.length !== studentIds.length) {
      return NextResponse.json(
        {
          success: false,
          message: "Duplicate student IDs found in results.",
        },
        { status: 400 }
      );
    }

    // -----------------------------------------
    // 6. Check if this subject result
    //    already exists for any student
    // -----------------------------------------

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
            "Result for this subject has already been uploaded.",
          students: existingResults.map(
            (item) => item.studentId
          ),
        },
        { status: 409 }
      );
    }

    // -----------------------------------------
    // 7. Create / update semester result
    // -----------------------------------------

    const operations = results.map((item) => {
      const mark = Number(item.mark);

      return {
        updateOne: {
          filter: {
            studentId: item.studentId,
            semesterId,
          },

          update: {
            $setOnInsert: {
              schoolId,
              semesterId,
              classId,
              studentId: item.studentId,
            },

            $push: {
              subjects: {
                subjectId,
                teacherId,
                subjectName,
                maxMarks: parsedMaxMarks,
                passingMarks: parsedPassingMarks,
                totalMarks: mark,
                status: "submitted",
              },
            },
          },

          upsert: true,
        },
      };
    });

    // -----------------------------------------
    // 8. Execute all operations
    // -----------------------------------------

    const bulkResult =
      await SemesterResult.bulkWrite(operations);

    // -----------------------------------------
    // 9. Response
    // -----------------------------------------

    return NextResponse.json(
      {
        success: true,
        message:
          "Subject results uploaded successfully.",

        data: {
          semesterId,
          subjectId,
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
      "Upload semester result error:",
      error
    );

    // -----------------------------------------
    // Duplicate key protection
    // -----------------------------------------

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

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to upload semester results.",
      },
      { status: 500 }
    );
  }
}
