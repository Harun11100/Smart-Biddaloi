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
      amount,
      paymentMethod,
      allocations = [],
      note = "",
      collectedBy = null,
      collectorName = "",
    } = body;

    // =====================================================
    // VALIDATION
    // =====================================================

    if (!schoolId || !studentId) {
      return NextResponse.json(
        {
          success: false,
          message: "schoolId and studentId are required",
        },
        { status: 400 }
      );
    }

    const paymentAmount = Number(amount);

    if (!Number.isFinite(paymentAmount) || paymentAmount <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment amount must be greater than 0",
        },
        { status: 400 }
      );
    }

    const allowedPaymentMethods = [
      "cash",
      "bkash",
      "nagad",
      "bank_transfer",
      "card",
      "other",
    ];

    const finalPaymentMethod = paymentMethod || "cash";

    if (!allowedPaymentMethods.includes(finalPaymentMethod)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid payment method",
        },
        { status: 400 }
      );
    }

    // Make sure allocations is an array
    const paymentAllocationsInput = Array.isArray(
      allocations
    )
      ? allocations
      : [];

    // =====================================================
    // FIND STUDENT
    // =====================================================

    const student = await Student.findOne({
      _id: studentId,
      schoolId,
    });

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
    // DETERMINE CLASS ID
    // =====================================================

    const finalClassId =
      classId || student.classId || null;

    // =====================================================
    // FIND OR CREATE FEE COLLECTION
    // =====================================================

    let feeCollection = await FeeCollection.findOne({
      schoolId,
      studentId,
    });

    let feeCollectionCreated = false;

    // -----------------------------------------------------
    // CREATE FEE COLLECTION IF IT DOES NOT EXIST
    // -----------------------------------------------------

    if (!feeCollection) {
      console.log(
        `FeeCollection not found for student ${studentId}. Creating new record.`
      );

      // Student default fees
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
      // CURRENT MONTH
      // ---------------------------------------------------

      const now = new Date();

      const currentYear = now.getFullYear();

      const currentMonthNumber =
        now.getMonth() + 1;

      const currentMonthName =
        now.toLocaleString("en-US", {
          month: "long",
        });

      const monthKey = `${currentYear}-${String(
        currentMonthNumber
      ).padStart(2, "0")}`;

      // ---------------------------------------------------
      // CREATE INITIAL MONTHLY FEE
      // ---------------------------------------------------

      const initialMonthlyFee = {
        monthKey,
        month: currentMonthName,
        year: currentYear,

        amount: totalMonthlyFees,

        paidAmount: 0,

        dueAmount: totalMonthlyFees,

        status:
          totalMonthlyFees > 0
            ? "unpaid"
            : "paid",
      };

      // ---------------------------------------------------
      // CREATE FEE COLLECTION
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

        monthlyFees:
          totalMonthlyFees > 0
            ? [initialMonthlyFee]
            : [],

        otherFees: [],

        payments: [],

        advanceBalance: 0,

        totalPaid: 0,

        totalDue: totalMonthlyFees,
      });

      await feeCollection.save();

      feeCollectionCreated = true;

      console.log(
        `FeeCollection created successfully: ${feeCollection._id}`
      );
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
    // VALIDATE ALLOCATIONS
    // =====================================================

    let allocationTotal = 0;

    for (const allocation of paymentAllocationsInput) {
      const allocationAmount = Number(
        allocation?.amount || 0
      );

      // Ignore zero/negative allocation
      if (allocationAmount <= 0) {
        continue;
      }

      // -----------------------------------------------
      // Validate charge type
      // -----------------------------------------------

      if (
        allocation.chargeType !== "monthly" &&
        allocation.chargeType !== "other"
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Invalid allocation chargeType",
          },
          { status: 400 }
        );
      }

      // -----------------------------------------------
      // Validate charge ID
      // -----------------------------------------------

      if (!allocation.chargeId) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Allocation chargeId is required",
          },
          { status: 400 }
        );
      }

      allocationTotal += allocationAmount;
    }

    // =====================================================
    // ALLOCATION TOTAL CANNOT EXCEED PAYMENT
    // =====================================================

    if (allocationTotal > paymentAmount) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Allocation amount cannot be greater than payment amount",
        },
        { status: 400 }
      );
    }

    // =====================================================
    // GENERATE RECEIPT NUMBER
    // =====================================================

    const receiptNumber = `RCPT-${Date.now()}`;

    // =====================================================
    // PROCESS PAYMENT ALLOCATIONS
    // =====================================================

    const paymentAllocations = [];

    let remainingPayment = paymentAmount;

    for (const allocation of paymentAllocationsInput) {
      if (remainingPayment <= 0) {
        break;
      }

      let requestedAmount = Number(
        allocation?.amount || 0
      );

      if (requestedAmount <= 0) {
        continue;
      }

      // Never allocate more than remaining payment
      requestedAmount = Math.min(
        requestedAmount,
        remainingPayment
      );

      // =================================================
      // MONTHLY FEE
      // =================================================

      if (
        allocation.chargeType === "monthly"
      ) {
        const monthlyFee =
          feeCollection.monthlyFees.find(
            (item) =>
              item._id?.toString() ===
              allocation.chargeId.toString()
          );

        if (!monthlyFee) {
          return NextResponse.json(
            {
              success: false,
              message:
                `Monthly fee not found: ${allocation.chargeId}`,
            },
            { status: 404 }
          );
        }

        const currentDue = Number(
          monthlyFee.dueAmount || 0
        );

        // Already fully paid
        if (currentDue <= 0) {
          continue;
        }

        // ---------------------------------------------
        // Calculate amount to apply
        // ---------------------------------------------

        const appliedAmount = Math.min(
          requestedAmount,
          currentDue
        );

        // ---------------------------------------------
        // Update paid amount
        // ---------------------------------------------

        monthlyFee.paidAmount =
          Number(monthlyFee.paidAmount || 0) +
          appliedAmount;

        // ---------------------------------------------
        // Update due amount
        // ---------------------------------------------

        monthlyFee.dueAmount =
          currentDue - appliedAmount;

        // Prevent negative value
        if (monthlyFee.dueAmount < 0) {
          monthlyFee.dueAmount = 0;
        }

        // ---------------------------------------------
        // Update status
        // ---------------------------------------------

        if (monthlyFee.dueAmount === 0) {
          monthlyFee.status = "paid";
        } else if (
          Number(monthlyFee.paidAmount || 0) > 0
        ) {
          monthlyFee.status = "partial";
        } else {
          monthlyFee.status = "unpaid";
        }

        // ---------------------------------------------
        // Add allocation record
        // ---------------------------------------------

        paymentAllocations.push({
          chargeType: "monthly",

          chargeId: monthlyFee._id,

          monthKey:
            monthlyFee.monthKey || null,

          amount: appliedAmount,

          description:
            allocation.description ||
            `${monthlyFee.month || ""} ${
              monthlyFee.year || ""
            }`.trim(),
        });

        // ---------------------------------------------
        // Reduce remaining payment
        // ---------------------------------------------

        remainingPayment -= appliedAmount;
      }

      // =================================================
      // OTHER FEE
      // =================================================

      if (
        allocation.chargeType === "other"
      ) {
        const otherFee =
          feeCollection.otherFees.find(
            (item) =>
              item._id?.toString() ===
              allocation.chargeId.toString()
          );

        if (!otherFee) {
          return NextResponse.json(
            {
              success: false,
              message:
                `Other fee not found: ${allocation.chargeId}`,
            },
            { status: 404 }
          );
        }

        const currentDue = Number(
          otherFee.dueAmount || 0
        );

        // Already fully paid
        if (currentDue <= 0) {
          continue;
        }

        // ---------------------------------------------
        // Calculate amount to apply
        // ---------------------------------------------

        const appliedAmount = Math.min(
          requestedAmount,
          currentDue
        );

        // ---------------------------------------------
        // Update paid amount
        // ---------------------------------------------

        otherFee.paidAmount =
          Number(otherFee.paidAmount || 0) +
          appliedAmount;

        // ---------------------------------------------
        // Update due amount
        // ---------------------------------------------

        otherFee.dueAmount =
          currentDue - appliedAmount;

        if (otherFee.dueAmount < 0) {
          otherFee.dueAmount = 0;
        }

        // ---------------------------------------------
        // Update status
        // ---------------------------------------------

        if (otherFee.dueAmount === 0) {
          otherFee.status = "paid";
        } else if (
          Number(otherFee.paidAmount || 0) > 0
        ) {
          otherFee.status = "partial";
        } else {
          otherFee.status = "unpaid";
        }

        // ---------------------------------------------
        // Add allocation record
        // ---------------------------------------------

        paymentAllocations.push({
          chargeType: "other",

          chargeId: otherFee._id,

          monthKey:
            otherFee.dueMonth || null,

          amount: appliedAmount,

          description:
            allocation.description ||
            otherFee.title ||
            "Other Fee",
        });

        // ---------------------------------------------
        // Reduce remaining payment
        // ---------------------------------------------

        remainingPayment -= appliedAmount;
      }
    }

    // =====================================================
    // REMAINING PAYMENT = ADVANCE
    // =====================================================

    if (remainingPayment > 0) {
      feeCollection.advanceBalance =
        Number(
          feeCollection.advanceBalance || 0
        ) + remainingPayment;

      paymentAllocations.push({
        chargeType: "advance",

        chargeId: null,

        monthKey: null,

        amount: remainingPayment,

        description: "Advance payment",
      });

      remainingPayment = 0;
    }

    // =====================================================
    // CREATE PAYMENT RECORD
    // =====================================================

    const paymentDate = new Date();

    const paymentRecord = {
      receiptNumber,

      amount: paymentAmount,

      paymentMethod: finalPaymentMethod,

      paymentDate,

      allocations: paymentAllocations,

      note,

      collectedBy,

      collectorName,
    };

    feeCollection.payments.push(
      paymentRecord
    );

    // =====================================================
    // RECALCULATE TOTAL PAID
    // =====================================================

    const totalPaid =
      feeCollection.payments.reduce(
        (total, payment) =>
          total +
          Number(payment.amount || 0),
        0
      );

    // =====================================================
    // RECALCULATE MONTHLY DUE
    // =====================================================

    const monthlyDue =
      feeCollection.monthlyFees.reduce(
        (total, fee) =>
          total +
          Number(fee.dueAmount || 0),
        0
      );

    // =====================================================
    // RECALCULATE OTHER FEE DUE
    // =====================================================

    const otherDue =
      feeCollection.otherFees.reduce(
        (total, fee) =>
          total +
          Number(fee.dueAmount || 0),
        0
      );

    // =====================================================
    // UPDATE TOTALS
    // =====================================================

    feeCollection.totalPaid = totalPaid;

    feeCollection.totalDue =
      monthlyDue + otherDue;

    // =====================================================
    // SAVE
    // =====================================================

    await feeCollection.save();

    // =====================================================
    // RESPONSE
    // =====================================================

    return NextResponse.json(
      {
        success: true,

        message: feeCollectionCreated
          ? "Fee collection created and payment collected successfully"
          : "Payment collected successfully",

        feeCollectionCreated,

        payment: {
          receiptNumber,

          amount: paymentAmount,

          paymentMethod:
            finalPaymentMethod,

          paymentDate,

          allocations:
            paymentAllocations,
        },

        feeCollection: {
          _id: feeCollection._id,

          studentId:
            feeCollection.studentId,

          classId:
            feeCollection.classId,

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
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "COLLECT PAYMENT ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Failed to collect payment",

        error: error.message,
      },
      { status: 500 }
    );
  }
}