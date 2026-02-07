import { NextResponse } from "next/server";
import connectDb from "@/app/utils/db";
import Result from "@/app/model/Result";

const calculateFinalGrade = (gpa) => {
  if (gpa === "F") return "F";
  const g = Number(gpa);
  if (g >= 5) return "A+";
  if (g >= 4) return "A";
  if (g >= 3.5) return "A-";
  if (g >= 3) return "B+";
  if (g >= 2.5) return "B";
  if (g >= 2) return "C";
  return "F";
};

export async function GET(req) {
  try {
    await connectDb();

    const { searchParams } = new URL(req.url);
    const schoolId = searchParams.get("schoolId");
    const studentId = searchParams.get("studentId");
    const examType = searchParams.get("examType");

    const filter = {};
    if (schoolId) filter.schoolId = schoolId;
    if (studentId) filter.studentId = studentId;
    if (examType) filter.examType = examType;

    const results = await Result.find(filter).sort({ createdAt: -1 }).lean();

    const resultsWithGPA = results.map((result) => {
      const subjects = result.results || [];

      const failed = subjects.some(
        (sub) => sub.grade === "F" || sub.mark < sub.passingMarks
      );

      const gpa = failed
        ? "F"
        : subjects.length
        ? (subjects.reduce((acc, sub) => acc + (sub.point || 0), 0) / subjects.length).toFixed(2)
        : "0.00";

      return {
        ...result,
        gpa,
        finalGrade: calculateFinalGrade(gpa),
        failed,
      };
    });

    return NextResponse.json({
      success: true,
      count: resultsWithGPA.length,
      data: resultsWithGPA,
    });
  } catch (error) {
    console.error("GET results error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
