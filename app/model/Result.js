import mongoose from "mongoose";

const ResultSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true },
  examType: { type: String, required: true },
  examDate: { type: String, required: true }, // e.g., "November 2025"
  results: [
    {
      subject: { type: String, required: true },
      mark: { type: Number, required: true, min: 0, max: 100 },
      grade: { type: String, default: "" },
    },
  ],
  totalMarks: { type: Number, default: 0 },
  averageGrade: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.models.Result || mongoose.model("Result", ResultSchema);
