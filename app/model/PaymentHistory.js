import mongoose from "mongoose";

const PaymentHistorySchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true },
  paymentMonth: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ["paid", "unpaid", "partial"], default: "unpaid" },
  paymentDate: { type: Date },
}, { timestamps: true });

export default mongoose.models.PaymentHistory ||
  mongoose.model("PaymentHistory", PaymentHistorySchema);
