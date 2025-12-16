import connectDb from "@/app/utils/db";
import Result from "@/app/model/Result"; 
import Subject from "@/app/model/Subject"; 

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

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    await connectDb();

    const { schoolId, studentId, examType, results } = req.body;

    if (!schoolId || !studentId || !examType || !Array.isArray(results)) {
      return res.status(400).json({ success: false, message: "Incomplete data" });
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

    await newResult.save();

    return res.status(200).json({ success: true, message: "Result saved successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
