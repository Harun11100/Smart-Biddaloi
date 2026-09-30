import { NextResponse } from "next/server";
import connectDb from "@/app/utils/db";
import FeeCollection from "@/app/model/FeeCollection";
import Student from "@/app/model/Student";

export async function POST(req) {
  try {
    await connectDb();

    const body = await req.json();

    const {
      schoolId,
      classId,
      studentId,
      feeType,
      title,
      description = "",
      amount,
      dueMonth = null,
      createdBy = null,
    } = body;

    // -----------------------------------
    // Validation
    // -----------------------------------
    if (!schoolId || !studentId) {
      return NextResponse.json(
        {
          success: false,
          message: "schoolId and studentId are required",
        },
        { status: 400 }
      );
    }

    if (!feeType) {
      return NextResponse.json(
        {
          success: false,
          message: "feeType is required",
        },
        { status: 400 }
      );
    }

    if (!title || !title.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Fee title is required",
        },
        { status: 400 }
      );
    }

    const feeAmount = Number(amount);

    if (!feeAmount || feeAmount <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Fee amount must be greater than 0",
        },
        { status: 400 }
      );
    }

    // -----------------------------------
    // Allowed fee types
    // -----------------------------------
    const allowedFeeTypes = [
      "exam",
      "admission",
      "registration",
      "id_card",
      "transport",
      "fine",
      "library",
      "event",
      "other",
    ];

    if (!allowedFeeTypes.includes(feeType)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid fee type",
        },
        { status: 400 }
      );
    }

    // -----------------------------------
    // Find student
    // -----------------------------------
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

    // -----------------------------------
    // Find student's fee collection
    // -----------------------------------
    let feeCollection = await FeeCollection.findOne({
      schoolId,
      studentId,
    });

    // -----------------------------------
    // Create FeeCollection if it doesn't
    // exist yet
    // -----------------------------------
    if (!feeCollection) {
      const tuitionFee = Number(
        student.tuitionFee || 0
      );

      const coachingFee = Number(
        student.coachingFee || 0
      );

      feeCollection = new FeeCollection({
        schoolId,
        studentId,

        defaultFees: {
          tuitionFee,
          coachingFee,
          otherMonthlyFee: 0,
          totalMonthlyFee:
            tuitionFee + coachingFee,
        },

        monthlyFees: [],
        otherFees: [],
        payments: [],

        advanceBalance: 0,
        totalPaid: 0,
        totalDue: 0,
      });
    }

    // -----------------------------------
    // Make sure otherFees exists
    // -----------------------------------
    if (!feeCollection.otherFees) {
      feeCollection.otherFees = [];
    }

    // -----------------------------------
    // Create other fee
    // -----------------------------------
    const newOtherFee = {
      feeType,
      title: title.trim(),
      description: description.trim(),
      amount: feeAmount,
      paidAmount: 0,
      dueAmount: feeAmount,
      dueMonth: dueMonth || null,
      status: "unpaid",
      createdBy: createdBy || null,
    };

    // -----------------------------------
    // Add fee
    // -----------------------------------
    feeCollection.otherFees.push(
      newOtherFee
    );

    // -----------------------------------
    // Recalculate total due
    // -----------------------------------
    const monthlyDue =
      (feeCollection.monthlyFees || []).reduce(
        (total, fee) =>
          total + Number(fee.dueAmount || 0),
        0
      );

    const otherDue =
      feeCollection.otherFees.reduce(
        (total, fee) =>
          total + Number(fee.dueAmount || 0),
        0
      );

    feeCollection.totalDue =
      monthlyDue + otherDue;

    // -----------------------------------
    // Save
    // -----------------------------------
    await feeCollection.save();

    // Get the newly added fee
    const addedFee =
      feeCollection.otherFees[
        feeCollection.otherFees.length - 1
      ];

    // -----------------------------------
    // Response
    // -----------------------------------
    return NextResponse.json(
      {
        success: true,
        message: "Other fee added successfully",

        fee: addedFee,

        feeCollection: {
          _id: feeCollection._id,
          schoolId:
            feeCollection.schoolId,
          studentId:
            feeCollection.studentId,

          defaultFees:
            feeCollection.defaultFees,

          monthlyFees:
            feeCollection.monthlyFees,

          otherFees:
            feeCollection.otherFees,

          payments:
            feeCollection.payments,

          advanceBalance:
            Number(
              feeCollection.advanceBalance || 0
            ),

          totalPaid:
            Number(
              feeCollection.totalPaid || 0
            ),

          totalDue:
            Number(
              feeCollection.totalDue || 0
            ),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "ADD OTHER FEE ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to add other fee",
        error: error.message,
      },
      { status: 500 }
    );
  }
}