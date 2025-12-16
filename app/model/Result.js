import mongoose from "mongoose";

const ResultSchema = new mongoose.Schema(
  {
    schoolId: { type: String, required: true },
    studentId: { type: String, required: true },
    examType: { type: String, required: true },
    totalMarks: { type: Number, required: true },
    gpa: { type: Number, required: true },
    results: [
      {
        subject: String,
        mark: Number,
        maxMarks: Number,
        passingMarks: Number,
        grade: String,
        point: Number,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Result || mongoose.model("Result", ResultSchema);
