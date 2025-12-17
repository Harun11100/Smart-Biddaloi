// app/api/school/student/result/addResult/route.js
import connectDb from "@/app/utils/db";
import Result from "@/app/model/Result";
import Student from "@/app/model/Student";

// grading scale based on percentage
const gradingScale = [
  { min: 80, grade: "A+", point: 5.0 },
  { min: 70, grade: "A", point: 4.0 },
  { min: 60, grade: "B+", point: 3.5 },
  { min: 50, grade: "B", point: 3.0 },
  { min: 40, grade: "C", point: 2.0 },
  { min: 33, grade: "D", point: 1.0 },
  { min: 0, grade: "F", point: 0.0 },
];

function calculateGrade(mark, maxMarks, passingMarks) {
  if (mark < passingMarks) return { grade: "F", point: 0.0 };
  const percentage = (mark / maxMarks) * 100;

  for (let g of gradingScale) {
    if (percentage >= g.min) return { grade: g.grade, point: g.point };
  }
  return { grade: "F", point: 0.0 };
}

// App Router POST handler
export async function POST(req) {
  try {
    await connectDb();

    const { schoolId, studentId, examType, results } = await req.json();

    if (!schoolId || !studentId || !examType || !Array.isArray(results)) {
      return new Response(
        JSON.stringify({ success: false, message: "Incomplete data" }),
        { status: 400 }
      );
    }

    let totalMarks = 0;
    let totalPoints = 0;
    let totalMaxMarks = 0;
    const processedResults = [];

    for (const r of results) {
      const mark = Number(r.mark || 0);
      const maxMarks = Number(r.maxMarks || 100);
      const passingMarks = Number(r.passingMarks || 33);

      const { grade, point } = calculateGrade(mark, maxMarks, passingMarks);

      totalMarks += mark;
      totalMaxMarks += maxMarks;
      totalPoints += point;

      processedResults.push({
        subject: r.subject,
        mark,
        maxMarks,
        passingMarks,
        grade,
        point,
      });
    }

    const gpa = results.length ? (totalPoints / results.length).toFixed(2) : "0.00";

    const newResult = new Result({
      schoolId,
      studentId,
      examType,
      totalMarks,
      totalMaxMarks,
      gpa,
      results: processedResults,
    });

    // Send push notification if student has expoToken
    const student = await Student.findById(studentId);

    if (student?.expoToken) {
      const title = `নতুন রেজাল্ট: ${examType}`;
      const body = `${student.name} এর রেজাল্ট: আপনার জিপিএ হলো ${gpa}. মোট মার্কস: ${totalMarks}/${totalMaxMarks}. আরও বিস্তারিত জানতে অ্যাপের রেজাল্ট সেকশন দেখুন।`;

      try {
        await fetch("https://exp.host/--/api/v2/push/send", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: student.expoToken,
            sound: "default",
            title,
            body,
            data: {
              studentId: student._id.toString(),
              guardianPhone: student.guardianPhone || null,
            },
          }),
        });
      } catch (pushErr) {
        console.warn("⚠️ Push notification failed:", pushErr);
      }
    }

    await newResult.save();

    return new Response(
      JSON.stringify({ success: true, message: "Result saved successfully", result: newResult }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500 }
    );
  }
}
