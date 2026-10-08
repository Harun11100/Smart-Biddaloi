import { NextResponse } from "next/server";
import connectDb from "@/app/utils/db";
import SemesterResult from "@/app/model/SemesterResult";
import Class from "@/app/model/Class";
import Semester from "@/app/model/Semester";

/*
===========================================================
GRADING SYSTEM HELPERS
===========================================================
Calculates Subject Grade & GPA based on marks percentage.
*/
function calculateSubjectGrade(mark, maxMarks = 100, passingMarks = 33) {
  const obtainedMark = Number(mark) || 0;
  const passMark = Number(passingMarks) || 33;
  const max = Number(maxMarks) || 100;

  // Check if student failed passing threshold
  if (obtainedMark < passMark) {
    return { grade: "F", gpa: 0.0, status: "FAIL" };
  }

  // Calculate percentage
  const percentage = (obtainedMark / max) * 100;

  if (percentage >= 80) return { grade: "A+", gpa: 5.0, status: "PASS" };
  if (percentage >= 70) return { grade: "A", gpa: 4.0, status: "PASS" };
  if (percentage >= 60) return { grade: "A-", gpa: 3.5, status: "PASS" };
  if (percentage >= 50) return { grade: "B", gpa: 3.0, status: "PASS" };
  if (percentage >= 40) return { grade: "C", gpa: 2.0, status: "PASS" };
  if (percentage >= 33) return { grade: "D", gpa: 1.0, status: "PASS" };

  return { grade: "F", gpa: 0.0, status: "FAIL" };
}

/*
===========================================================
OVERALL GRADE FROM GPA
===========================================================
*/
function getOverallGrade(gpa, hasFailed = false) {
  if (hasFailed || gpa < 1.0) return "F";
  if (gpa >= 5.0) return "A+";
  if (gpa >= 4.0) return "A";
  if (gpa >= 3.5) return "A-";
  if (gpa >= 3.0) return "B";
  if (gpa >= 2.0) return "C";
  if (gpa >= 1.0) return "D";

  return "F";
}

export async function GET(request) {
  try {
    await connectDb();

    const { searchParams } = new URL(request.url);

    const schoolId = searchParams.get("schoolId");
    const classId = searchParams.get("classId");
    const semesterId = searchParams.get("semesterId");

    if (!schoolId || !classId || !semesterId) {
      return NextResponse.json(
        {
          success: false,
          message: "schoolId, classId and semesterId are required",
        },
        { status: 400 }
      );
    }

    const results = await SemesterResult.find({
      schoolId,
      classId,
      semesterId,
    })
      .populate({
        path: "studentId",
        select: "name roll className section gender",
      })
      .populate({
        path: "semesterId",
        select: "name semesterName title year",
      })
      .lean();

    if (!results.length) {
      return NextResponse.json({
        success: true,
        results: [],
        subjects: [],
        totalStudents: 0,
      });
    }

    /*
    -------------------------------------------------------
    1. EXTRACT ALL DISTINCT SUBJECTS
    -------------------------------------------------------
    */
    const subjectMap = new Map();

    results.forEach((result) => {
      result.subjects?.forEach((subject) => {
        const id = String(subject.subjectId);

        if (!subjectMap.has(id)) {
          subjectMap.set(id, {
            id,
            name: subject.subjectName || "Subject",
            maxMarks: subject.maxMarks || 100,
            passingMarks: subject.passingMarks || 33,
          });
        }
      });
    });

    const subjects = Array.from(subjectMap.values());

    /*
    -------------------------------------------------------
    2. COMPUTE GPA & GRADE FOR EVERY STUDENT & SUBJECT
    -------------------------------------------------------
    */
    const computedResults = results.map((result) => {
      const studentSubjects = {};
      let calculatedTotalMarks = 0;
      let calculatedTotalPossibleMarks = 0;
      let totalGpaPoints = 0;
      let hasFailedSubject = false;
      let totalSubjectCount = 0;

      result.subjects?.forEach((subject) => {
        const subjectId = String(subject.subjectId);
        const obtainedMark = subject.totalMarks || 0;
        const maxMarks = subject.maxMarks || 100;
        const passingMarks = subject.passingMarks || 33;

        // Calculate Grade & GPA for this subject
        const { grade, gpa, status } = calculateSubjectGrade(
          obtainedMark,
          maxMarks,
          passingMarks
        );

        if (status === "FAIL") {
          hasFailedSubject = true;
        }

        calculatedTotalMarks += obtainedMark;
        calculatedTotalPossibleMarks += maxMarks;
        totalGpaPoints += gpa;
        totalSubjectCount += 1;

        studentSubjects[subjectId] = {
          subjectName: subject.subjectName,
          mark: obtainedMark,
          maxMarks,
          passingMarks,
          grade,
          gpa,
          status,
        };
      });

      // Compute Overall GPA and Grade
      const rawGpa =
        totalSubjectCount > 0 ? totalGpaPoints / totalSubjectCount : 0;
      
      // If student fails in any subject, overall GPA is 0
      const finalGpa = hasFailedSubject
        ? 0.0
        : parseFloat(rawGpa.toFixed(2));

      const overallGrade = getOverallGrade(finalGpa, hasFailedSubject);
      const averageMarks =
        totalSubjectCount > 0
          ? parseFloat((calculatedTotalMarks / totalSubjectCount).toFixed(2))
          : 0;

      return {
        ...result,
        studentSubjects,
        totalMarks: calculatedTotalMarks,
        totalPossibleMarks: calculatedTotalPossibleMarks,
        averageMarks,
        gpa: finalGpa,
        grade: overallGrade,
        status: hasFailedSubject ? "FAILED" : "PASSED",
      };
    });

    /*
    -------------------------------------------------------
    3. SORT STUDENTS FOR MERIT LIST
    -------------------------------------------------------
    Ranking hierarchy:
    1. Passed students above Failed students
    2. Highest Total Marks
    3. Highest Average Marks
    4. Highest GPA
    5. Ascending Roll Number
    */
    const sortedResults = [...computedResults].sort((a, b) => {
      // Prioritize PASSED over FAILED
      if (a.status !== b.status) {
        return a.status === "PASSED" ? -1 : 1;
      }

      const totalDifference = (b.totalMarks || 0) - (a.totalMarks || 0);
      if (totalDifference !== 0) return totalDifference;

      const averageDifference = (b.averageMarks || 0) - (a.averageMarks || 0);
      if (averageDifference !== 0) return averageDifference;

      const gpaDifference = (b.gpa || 0) - (a.gpa || 0);
      if (gpaDifference !== 0) return gpaDifference;

      return (
        Number(a.studentId?.roll || 999999) -
        Number(b.studentId?.roll || 999999)
      );
    });

    /*
    -------------------------------------------------------
    4. ASSIGN MERIT POSITIONS
    -------------------------------------------------------
    Competition ranking: 1, 2, 2, 4
    */
    let previousTotal = null;
    let previousAverage = null;
    let previousGpa = null;
    let currentPosition = 0;

    const students = sortedResults.map((result, index) => {
      const total = result.totalMarks || 0;
      const average = result.averageMarks || 0;
      const gpa = result.gpa || 0;

      const sameAsPrevious =
        previousTotal === total &&
        previousAverage === average &&
        previousGpa === gpa;

      if (!sameAsPrevious) {
        currentPosition = index + 1;
      }

      previousTotal = total;
      previousAverage = average;
      previousGpa = gpa;

      return {
        resultId: result._id,
        position: currentPosition,
        studentId: result.studentId?._id,
        name: result.studentId?.name || "Unknown Student",
        roll: result.studentId?.roll || "-",
        className: result.studentId?.className || "",
        section: result.studentId?.section || "",
        subjects: result.studentSubjects,
        totalMarks: result.totalMarks,
        totalPossibleMarks: result.totalPossibleMarks,
        averageMarks: result.averageMarks,
        gpa: result.gpa,
        grade: result.grade,
        status: result.status,
        publishedAt: result.publishedAt,
      };
    });

    /*
    -------------------------------------------------------
    5. CLASS & SEMESTER METADATA
    -------------------------------------------------------
    */
    const classInfo = await Class.findById(classId)
      .select("className sectionName studentCount")
      .lean();

    const semesterInfo = await Semester.findById(semesterId)
      .select("name semesterName title year")
      .lean();

    return NextResponse.json({
      success: true,
      classInfo,
      semesterInfo,
      subjects,
      students,
      totalStudents: students.length,
      totalSubjects: subjects.length,
    });
  } catch (error) {
    console.error("Class Result Sheet Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load class result sheet",
        error: error.message,
      },
      { status: 500 }
    );
  }
}