import connectDb from "@/app/utils/db";
import School from "@/app/model/School";
import Class from "@/app/model/Class";
import Student from "@/app/model/Student";
import PaymentHistory from "@/app/model/PaymentHistory";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDb();
    const { searchParams } = new URL(req.url);
    const schoolId = searchParams.get("schoolId");
    const classId = searchParams.get("classId");
    const studentId = searchParams.get("studentId");

    if (!schoolId || !classId || !studentId) {
      return NextResponse.json(
        { success: false, message: "schoolId, classId, and studentId are required" },
        { status: 400 }
      );
    }

    const schoolData = await School.findById(schoolId);
    if (!schoolData) {
      return NextResponse.json({ success: false, message: "School not found" }, { status: 404 });
    }

    const classData = await Class.findOne({ _id: classId, schoolId });
    if (!classData) {
      return NextResponse.json({ success: false, message: "Class not found in this school" }, { status: 404 });
    }

    const student = await Student.findOne({ _id: studentId, classId, schoolId });
    if (!student) {
      return NextResponse.json({ success: false, message: "Student not found in this class" }, { status: 404 });
    }

    const paymentHistory = await PaymentHistory.find({ studentId: student._id }).sort({ createdAt: -1 });

    const studentData = {
      _id: student._id,
      name: student.name,
      studentName: student.name, // for frontend consistency
      className: student.className,
      section: student.section || "",
      roll: student.roll,
      gender: student.gender || "",
      guardianName: student.guardianName || "",
      guardianPhone: student.guardianPhone || "",
      tuitionFee: student.tuitionFee,
      coachingFee: student.coachingFee,
      totalPaidAmount: student.totalPaidAmount,
      totalDueAmount: student.totalDueAmount,
      paymentStatus: student.paymentStatus || "unpaid",
      address: student.address || "",
      bloodGroup: student.bloodGroup || "",
      remarks: student.remarks || "",
      dateOfBirth: student.dateOfBirth || null,
    };

    return NextResponse.json(
      { success: true, data: { student: studentData, paymentHistory } },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Error fetching student data:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error", error: err.message },
      { status: 500 }
    );
  }
}
