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

    // =====================================================
    // VALIDATION
    // =====================================================

    if (!schoolId || !studentId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "schoolId and studentId are required",
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

    if (
      !Number.isFinite(feeAmount) ||
      feeAmount <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Fee amount must be greater than 0",
        },
        { status: 400 }
      );
    }

    // =====================================================
    // ALLOWED FEE TYPES
    // =====================================================

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

    // =====================================================
    // FIND STUDENT
    // =====================================================

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

    // =====================================================
    // FINAL CLASS ID
    // =====================================================

    const finalClassId =
      classId || student.classId || null;

    // =====================================================
    // FIND FEE COLLECTION
    // =====================================================

    let feeCollection =
      await FeeCollection.findOne({
        schoolId,
        studentId,
      });

    let feeCollectionCreated = false;

    // =====================================================
    // CREATE FEE COLLECTION IF NOT EXISTS
    // =====================================================

    if (!feeCollection) {
      console.log(
        `FeeCollection not found for student ${studentId}. Creating new record.`
      );

      // ---------------------------------------------------
      // Student default fees
      // ---------------------------------------------------

      const tuitionFee = Number(
        student.tuitionFee ??
          student.tutionFee ??
          student.tutionFees ??
          0
      );

      const coachingFee = Number(
        student.coachingFee ?? 0
      );

      const otherMonthlyFee = Number(
        student.otherMonthlyFee ?? 0
      );

      const totalMonthlyFees =
        tuitionFee +
        coachingFee +
        otherMonthlyFee;

      // ---------------------------------------------------
      // Create FeeCollection
      // ---------------------------------------------------

      feeCollection = new FeeCollection({
        schoolId,

        classId: finalClassId,

        studentId,

        defaultFees: {
          tuitionFee,

          coachingFee,

          otherMonthlyFee,

          totalMonthlyFees,
        },

        monthlyFees: [],

        otherFees: [],

        payments: [],

        advanceBalance: 0,

        totalPaid: 0,

        totalDue: 0,
      });

      feeCollectionCreated = true;
    }

    // =====================================================
    // MAKE SURE ARRAYS EXIST
    // =====================================================

    if (!Array.isArray(feeCollection.monthlyFees)) {
      feeCollection.monthlyFees = [];
    }

    if (!Array.isArray(feeCollection.otherFees)) {
      feeCollection.otherFees = [];
    }

    if (!Array.isArray(feeCollection.payments)) {
      feeCollection.payments = [];
    }

    // =====================================================
    // CREATE OTHER FEE
    // =====================================================

    const newOtherFee = {
      feeType,

      title: title.trim(),

      description:
        typeof description === "string"
          ? description.trim()
          : "",

      amount: feeAmount,

      paidAmount: 0,

      dueAmount: feeAmount,

      dueMonth: dueMonth || null,

      status: "unpaid",

      createdBy: createdBy || null,
    };

    // =====================================================
    // ADD OTHER FEE
    // =====================================================

    feeCollection.otherFees.push(
      newOtherFee
    );

    // =====================================================
    // RECALCULATE TOTAL DUE
    // =====================================================

    const monthlyDue =
      feeCollection.monthlyFees.reduce(
        (total, fee) =>
          total +
          Number(fee.dueAmount || 0),
        0
      );

    const otherDue =
      feeCollection.otherFees.reduce(
        (total, fee) =>
          total +
          Number(fee.dueAmount || 0),
        0
      );

    feeCollection.totalDue =
      monthlyDue + otherDue;

    // =====================================================
    // TOTAL PAID
    // =====================================================

    // Do not change totalPaid here.
    // Adding a fee does not mean the student has paid it.

    feeCollection.totalPaid =
      feeCollection.payments.reduce(
        (total, payment) =>
          total +
          Number(payment.amount || 0),
        0
      );

    // =====================================================
    // SAVE
    // =====================================================

    await feeCollection.save();

    // =====================================================
    // GET NEWLY ADDED FEE
    // =====================================================

    const addedFee =
      feeCollection.otherFees[
        feeCollection.otherFees.length - 1
      ];

    // =====================================================
    // RESPONSE
    // =====================================================

    return NextResponse.json(
      {
        success: true,

        message:
          "Other fee added successfully",

        feeCollectionCreated,

        fee: addedFee,

        feeCollection: {
          _id: feeCollection._id,

          schoolId:
            feeCollection.schoolId,

          classId:
            feeCollection.classId,

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

        message:
          "Failed to add other fee",

        error: error.message,
      },
      { status: 500 }
    );
  }
}