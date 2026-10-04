import mongoose from "mongoose";

const { Schema } = mongoose;

// --------------------------------------------------
// Default Monthly Fee Configuration
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
// Monthly Fee Ledger Entry
// --------------------------------------------------
const MonthlyFeeSchema = new Schema(
  {
    // Example: "2026-10"
    monthKey: {
      type: String,
      required: true,
      trim: true,
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
    note: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    _id: true,
    timestamps: true,
  }
);

// --------------------------------------------------
// Other / Additional Fee (Exam, Admission, Fines, etc.)
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
    dueMonth: {
      type: String,
      default: "", // Example: "2026-10"
      trim: true,
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
// Payment Allocation (Tracks which fee item got paid)
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
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: false }
);

// --------------------------------------------------
// Payment Transaction Record
// --------------------------------------------------
const PaymentSchema = new Schema(
  {
    receiptNumber: {
      type: String,
      required: true,
      trim: true,
    },
    // Optional digital payment gateway transaction ID (e.g. bKash TrxID)
    trxId: {
      type: String,
      default: "",
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
    allocations: {
      type: [PaymentAllocationSchema],
      default: [],
    },
    note: {
      type: String,
      default: "",
      trim: true,
    },
    collectedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    collectorName: {
      type: String,
      default: "",
      trim: true,
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
    schoolId: {
      type: Schema.Types.ObjectId,
      ref: "School",
      required: true,
      index: true,
    },
    classId: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      default: null,
      index: true, // Speeds up class-wise fee reports
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true,
    },
    defaultFees: {
      type: DefaultFeeSchema,
      default: () => ({}),
    },
    monthlyFees: {
      type: [MonthlyFeeSchema],
      default: [],
    },
    otherFees: {
      type: [OtherFeeSchema],
      default: [],
    },
    payments: {
      type: [PaymentSchema],
      default: [],
    },
    advanceBalance: {
      type: Number,
      default: 0,
      min: 0,
    },
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

// Unique compound index: One fee record per student per school
FeeCollectionSchema.index(
  { schoolId: 1, studentId: 1 },
  { unique: true }
);

// Helper index to speed up month-specific ledger lookups
FeeCollectionSchema.index({ "monthlyFees.monthKey": 1 });

const FeeCollection =
  mongoose.models.FeeCollection ||
  mongoose.model("FeeCollection", FeeCollectionSchema);

export default FeeCollection;