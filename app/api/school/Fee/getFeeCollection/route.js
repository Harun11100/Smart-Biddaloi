import { NextResponse } from "next/server";
import connectDb from "@/app/utils/db";
import FeeCollection from "@/app/model/FeeCollection";
import Student from "@/app/model/Student";

export async function GET(req) {
  try {
    await connectDb();

    const { searchParams } = new URL(req.url);

    const schoolId = searchParams.get("schoolId");
    const studentId = searchParams.get("studentId");

    // -----------------------------
    // Validation
    // -----------------------------
    if (!schoolId || !studentId) {
      return NextResponse.json(
        {
          success: false,
          message: "schoolId and studentId are required",
        },
        { status: 400 }
      );
    }

    // -----------------------------
    // Find Student
    // -----------------------------
    const student = await Student.findOne({
      _id: studentId,
      schoolId,
    }).lean();

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          message: "Student not found",
        },
        { status: 404 }
      );
    }

    // -----------------------------
    // Find Fee Collection
    // -----------------------------
    let feeCollection = await FeeCollection.findOne({
      schoolId,
      studentId,
    }).lean();

    // -----------------------------
    // If no fee collection exists
    // -----------------------------
    if (!feeCollection) {
      return NextResponse.json(
        {
          success: true,
          feeCollection: {
            _id: null,
            schoolId,
            studentId,

            defaultFees: {
              tuitionFee: Number(student.tuitionFee || 0),
              coachingFee: Number(student.coachingFee || 0),
              otherMonthlyFee: 0,
              totalMonthlyFee:
                Number(student.tuitionFee || 0) +
                Number(student.coachingFee || 0),
            },

            monthlyFees: [],
            otherFees: [],
            payments: [],

            advanceBalance: 0,
            totalPaid: 0,
            totalDue: 0,
          },

          student: {
            _id: student._id,
            name: student.name,
            roll: student.roll,
            className: student.className,
            section: student.section,
            guardianName: student.guardianName,
            guardianPhone: student.guardianPhone,
          },
        },
        { status: 200 }
      );
    }

    // -----------------------------
    // Calculate totals
    // -----------------------------
    const monthlyFees = feeCollection.monthlyFees || [];
    const otherFees = feeCollection.otherFees || [];
    const payments = feeCollection.payments || [];

    const totalMonthlyDue = monthlyFees.reduce(
      (total, item) => total + Number(item.dueAmount || 0),
      0
    );

    const totalOtherDue = otherFees.reduce(
      (total, item) => total + Number(item.dueAmount || 0),
      0
    );

    const totalDue = totalMonthlyDue + totalOtherDue;

    const totalPaid = payments.reduce(
      (total, payment) => total + Number(payment.amount || 0),
      0
    );

    // -----------------------------
    // Response
    // -----------------------------
    return NextResponse.json(
      {
        success: true,

        feeCollection: {
          ...feeCollection,

          defaultFees: {
            tuitionFee: Number(
              feeCollection.defaultFees?.tuitionFee || 0
            ),

            coachingFee: Number(
              feeCollection.defaultFees?.coachingFee || 0
            ),

            otherMonthlyFee: Number(
              feeCollection.defaultFees?.otherMonthlyFee || 0
            ),

            totalMonthlyFee: Number(
              feeCollection.defaultFees?.totalMonthlyFee || 0
            ),
          },

          monthlyFees,
          otherFees,
          payments,

          advanceBalance: Number(
            feeCollection.advanceBalance || 0
          ),

          totalPaid,

          totalDue,
        },

        student: {
          _id: student._id,
          name: student.name,
          roll: student.roll,
          className: student.className,
          section: student.section,
          guardianName: student.guardianName,
          guardianPhone: student.guardianPhone,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "GET FEE COLLECTION ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch fee collection",
        error: error.message,
      },
      { status: 500 }
    );
  }
}