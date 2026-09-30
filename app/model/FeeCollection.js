import mongoose from "mongoose";

const { Schema } = mongoose;

// --------------------------------------------------
// Default Monthly Fee
// --------------------------------------------------

const DefaultFeeSchema = new Schema(
  {
    tuitionFee: {
      type: Number,
      default: 0,
      min: 0,
    },

    coachingFee: {
      type: Number,
      default: 0,
      min: 0,
    },

    otherMonthlyFee: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalMonthlyFee: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { _id: false }
);

// --------------------------------------------------
// Monthly Fee
// --------------------------------------------------

const MonthlyFeeSchema = new Schema(
  {
    // Example: "2026-09"
    monthKey: {
      type: String,
      required: true,
    },

    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },

    year: {
      type: Number,
      required: true,
    },

    tuitionFee: {
      type: Number,
      default: 0,
      min: 0,
    },

    coachingFee: {
      type: Number,
      default: 0,
      min: 0,
    },

    otherMonthlyFee: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalFee: {
      type: Number,
      required: true,
      min: 0,
    },

    paidAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    dueAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: ["unpaid", "partial", "paid"],
      default: "unpaid",
    },

    // Optional note for this month's fee
    note: {
      type: String,
      default: "",
    },
  },
  {
    _id: true,
    timestamps: true,
  }
);

// --------------------------------------------------
// Other / Additional Fee
// --------------------------------------------------

const OtherFeeSchema = new Schema(
  {
    feeType: {
      type: String,
      enum: [
        "exam",
        "admission",
        "registration",
        "id_card",
        "transport",
        "fine",
        "library",
        "event",
        "other",
      ],
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    paidAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    dueAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Which month this fee belongs to
    dueMonth: {
      type: String,
      default: "",
      // Example: "2026-10"
    },

    status: {
      type: String,
      enum: ["unpaid", "partial", "paid"],
      default: "unpaid",
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    _id: true,
    timestamps: true,
  }
);

// --------------------------------------------------
// Payment Allocation
// --------------------------------------------------
// This tells us exactly where a payment was applied.
//
// Example:
// September due      = ৳1000
// October fee        = ৳1500
// Student pays       = ৳2000
//
// Allocation:
// September = ৳1000
// October   = ৳1000
// --------------------------------------------------

const PaymentAllocationSchema = new Schema(
  {
    chargeType: {
      type: String,
      enum: ["monthly", "other"],
      required: true,
    },

    chargeId: {
      type: Schema.Types.ObjectId,
      required: true,
    },

    monthKey: {
      type: String,
      default: "",
      // Example: "2026-09"
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    description: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

// --------------------------------------------------
// Payment Transaction
// --------------------------------------------------

const PaymentSchema = new Schema(
  {
    receiptNumber: {
      type: String,
      required: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentMethod: {
      type: String,
      enum: [
        "cash",
        "bkash",
        "nagad",
        "bank_transfer",
        "card",
        "other",
      ],
      default: "cash",
    },

    paymentDate: {
      type: Date,
      default: Date.now,
    },

    // Exactly which fees this payment covered
    allocations: {
      type: [PaymentAllocationSchema],
      default: [],
    },

    note: {
      type: String,
      default: "",
    },

    collectedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    collectorName: {
      type: String,
      default: "",
    },
  },
  {
    _id: true,
    timestamps: true,
  }
);

// --------------------------------------------------
// Main Fee Collection Schema
// --------------------------------------------------

const FeeCollectionSchema = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true,
    },

    schoolId: {
      type: Schema.Types.ObjectId,
      ref: "School",
      required: true,
      index: true,
    },

    // Current/default fee configuration
    defaultFees: {
      type: DefaultFeeSchema,
      default: () => ({}),
    },

    // Monthly fees
    monthlyFees: {
      type: [MonthlyFeeSchema],
      default: [],
    },

    // Exam fees, admission fees, fines etc.
    otherFees: {
      type: [OtherFeeSchema],
      default: [],
    },

    // Complete payment history
    payments: {
      type: [PaymentSchema],
      default: [],
    },

    // Money paid in advance
    advanceBalance: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Cached totals for quick dashboard display
    totalPaid: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalDue: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// --------------------------------------------------
// One FeeCollection document per student per school
// --------------------------------------------------

FeeCollectionSchema.index(
  { schoolId: 1, studentId: 1 },
  { unique: true }
);

const FeeCollection =
  mongoose.models.FeeCollection ||
  mongoose.model("FeeCollection", FeeCollectionSchema);

export default FeeCollection;