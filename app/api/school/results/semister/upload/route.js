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
    // 3. Validate marks settings
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
    }

    // -----------------------------------------
    // 5. Create / update semester results
    // -----------------------------------------

    const operations = [];

    for (const item of results) {
      const mark = Number(item.mark);

      // First try to update an existing subject
      const existingResult = await SemesterResult.findOne({
        studentId: item.studentId,
        semesterId,
        "subjects.subjectId": subjectId,
      });

      if (existingResult) {
        operations.push({
          updateOne: {
            filter: {
              _id: existingResult._id,
              "subjects.subjectId": subjectId,
            },

            update: {
              $set: {
                "subjects.$.teacherId": teacherId,
                "subjects.$.maxMarks": parsedMaxMarks,
                "subjects.$.passingMarks": parsedPassingMarks,
                "subjects.$.totalMarks": mark,
                "subjects.$.status": "submitted",
              },
            },
          },
        });
      } else {
        // Student semester result doesn't have this subject yet
        operations.push({
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
                  maxMarks: parsedMaxMarks,
                  passingMarks: parsedPassingMarks,
                  totalMarks: mark,
                  status: "submitted",
                },
              },
            },

            upsert: true,
          },
        });
      }
    }

    // -----------------------------------------
    // 6. Execute all updates together
    // -----------------------------------------

    if (operations.length > 0) {
      await SemesterResult.bulkWrite(operations);
    }

    // -----------------------------------------
    // 7. Response
    // -----------------------------------------

    return NextResponse.json(
      {
        success: true,
        message: "Subject results uploaded successfully.",
        data: {
          semesterId,
          subjectId,
          teacherId,
          studentsProcessed: results.length,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Upload semester result error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to upload semester results.",
      },
      { status: 500 }
    );
  }
}