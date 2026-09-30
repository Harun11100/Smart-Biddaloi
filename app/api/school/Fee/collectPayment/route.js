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

    const paymentAmount = Number(amount);

    if (!paymentAmount || paymentAmount <= 0) {
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

    if (
      paymentMethod &&
      !allowedPaymentMethods.includes(paymentMethod)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid payment method",
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

    // -----------------------------------
    // Find Fee Collection
    // -----------------------------------
    const feeCollection = await FeeCollection.findOne({
      schoolId,
      studentId,
    });

    if (!feeCollection) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Fee collection record not found for this student",
        },
        { status: 404 }
      );
    }

    // -----------------------------------
    // Make sure arrays exist
    // -----------------------------------
    if (!feeCollection.monthlyFees) {
      feeCollection.monthlyFees = [];
    }

    if (!feeCollection.otherFees) {
      feeCollection.otherFees = [];
    }

    if (!feeCollection.payments) {
      feeCollection.payments = [];
    }

    // -----------------------------------
    // Validate allocations
    // -----------------------------------
    let allocationTotal = 0;

    for (const allocation of allocations) {
      const allocationAmount = Number(allocation.amount || 0);

      if (allocationAmount <= 0) {
        continue;
      }

      allocationTotal += allocationAmount;

      if (
        allocation.chargeType !== "monthly" &&
        allocation.chargeType !== "other"
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid allocation chargeType",
          },
          { status: 400 }
        );
      }

      if (!allocation.chargeId) {
        return NextResponse.json(
          {
            success: false,
            message: "Allocation chargeId is required",
          },
          { status: 400 }
        );
      }
    }

    // -----------------------------------
    // Allocation total cannot exceed payment
    // -----------------------------------
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

    // -----------------------------------
    // Generate receipt number
    // -----------------------------------
    const receiptNumber = `RCPT-${Date.now()}`;

    const paymentAllocations = [];

    let remainingPayment = paymentAmount;

    // -----------------------------------
    // Process requested allocations
    // -----------------------------------
    for (const allocation of allocations) {
      if (remainingPayment <= 0) {
        break;
      }

      let requestedAmount = Number(
        allocation.amount || 0
      );

      if (requestedAmount <= 0) {
        continue;
      }

      // Never allow an allocation to exceed
      // the remaining payment.
      requestedAmount = Math.min(
        requestedAmount,
        remainingPayment
      );

      // ---------------------------------
      // MONTHLY FEE
      // ---------------------------------
      if (allocation.chargeType === "monthly") {
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

        if (currentDue <= 0) {
          continue;
        }

        const appliedAmount = Math.min(
          requestedAmount,
          currentDue
        );

        monthlyFee.paidAmount =
          Number(monthlyFee.paidAmount || 0) +
          appliedAmount;

        monthlyFee.dueAmount =
          currentDue - appliedAmount;

        // Prevent floating point negative zero
        if (monthlyFee.dueAmount < 0) {
          monthlyFee.dueAmount = 0;
        }

        if (monthlyFee.dueAmount === 0) {
          monthlyFee.status = "paid";
        } else if (
          Number(monthlyFee.paidAmount || 0) > 0
        ) {
          monthlyFee.status = "partial";
        } else {
          monthlyFee.status = "unpaid";
        }

        paymentAllocations.push({
          chargeType: "monthly",
          chargeId: monthlyFee._id,
          monthKey: monthlyFee.monthKey,
          amount: appliedAmount,
          description:
            allocation.description ||
            `${monthlyFee.month} ${monthlyFee.year}`,
        });

        remainingPayment -= appliedAmount;
      }

      // ---------------------------------
      // OTHER FEE
      // ---------------------------------
      if (allocation.chargeType === "other") {
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

        if (currentDue <= 0) {
          continue;
        }

        const appliedAmount = Math.min(
          requestedAmount,
          currentDue
        );

        otherFee.paidAmount =
          Number(otherFee.paidAmount || 0) +
          appliedAmount;

        otherFee.dueAmount =
          currentDue - appliedAmount;

        if (otherFee.dueAmount < 0) {
          otherFee.dueAmount = 0;
        }

        if (otherFee.dueAmount === 0) {
          otherFee.status = "paid";
        } else if (
          Number(otherFee.paidAmount || 0) > 0
        ) {
          otherFee.status = "partial";
        } else {
          otherFee.status = "unpaid";
        }

        paymentAllocations.push({
          chargeType: "other",
          chargeId: otherFee._id,
          monthKey: otherFee.dueMonth || null,
          amount: appliedAmount,
          description:
            allocation.description ||
            otherFee.title ||
            "Other Fee",
        });

        remainingPayment -= appliedAmount;
      }
    }

    // -----------------------------------
    // If some payment was not allocated,
    // keep it as advance balance.
    // -----------------------------------
    if (remainingPayment > 0) {
      feeCollection.advanceBalance =
        Number(feeCollection.advanceBalance || 0) +
        remainingPayment;

      paymentAllocations.push({
        chargeType: "advance",
        chargeId: null,
        monthKey: null,
        amount: remainingPayment,
        description: "Advance payment",
      });

      remainingPayment = 0;
    }

    // -----------------------------------
    // Create payment record
    // -----------------------------------
    const paymentRecord = {
      receiptNumber,
      amount: paymentAmount,
      paymentMethod: paymentMethod || "cash",
      paymentDate: new Date(),
      allocations: paymentAllocations,
      note,
      collectedBy,
      collectorName,
    };

    feeCollection.payments.push(paymentRecord);

    // -----------------------------------
    // Recalculate totals
    // -----------------------------------
    const totalPaid = feeCollection.payments.reduce(
      (total, payment) =>
        total + Number(payment.amount || 0),
      0
    );

    const monthlyDue =
      feeCollection.monthlyFees.reduce(
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

    feeCollection.totalPaid = totalPaid;

    feeCollection.totalDue =
      monthlyDue + otherDue;

    // -----------------------------------
    // Save
    // -----------------------------------
    await feeCollection.save();

    // -----------------------------------
    // Response
    // -----------------------------------
    return NextResponse.json(
      {
        success: true,
        message: "Payment collected successfully",

        payment: {
          receiptNumber,
          amount: paymentAmount,
          paymentMethod:
            paymentMethod || "cash",
          paymentDate:
            paymentRecord.paymentDate,
          allocations: paymentAllocations,
        },

        feeCollection: {
          _id: feeCollection._id,
          studentId: feeCollection.studentId,
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
            Number(feeCollection.totalPaid || 0),
          totalDue:
            Number(feeCollection.totalDue || 0),
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
        message: "Failed to collect payment",
        error: error.message,
      },
      { status: 500 }
    );
  }
}