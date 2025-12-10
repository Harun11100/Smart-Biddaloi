import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    roll: { type: String, required: true },
    className: { type: String, required: true },
    grade: { type: String },
    section: { type: String },
    gender: { type: String, required: true },
    dateOfBirth: { type: Date },
    guardianName: { type: String },
    guardianPhone: { type: String, required: true },
    bloodGroup: { type: String },
    tuitionFee: { type: Number, required: true },
    coachingFee: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["paid", "unpaid", "partial"],
      default: "unpaid",
    },
    totalMonthlyFees: { type: Number, required: true, default: 0 },
    address: { type: String, required: true },
    schoolId: { type: String, required: true },
    expoToken: { type: String, default: null },
    classId: { type: String, required: true },
    remarks: { type: String },
    monthlyAbsent: { type: Number, default: 0 },
    totalDueAmount: { type: Number, required: true, default: 0 },
    totalPaidAmount: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Student ||
  mongoose.model("Student", StudentSchema);
