import mongoose from "mongoose";

const SubjectSchema = new mongoose.Schema(
  { 
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      trim: true,
    },
    schoolId: {
      type: String,
      required: true,
    },
    creditHours: {
      type: Number,
      default: 0,
    },
    maxMarks: {
      type: Number,
      default: 100,
    },
    passingMarks: {
      type: Number,
      default: 33,
    },
  },
  { timestamps: true }
);

delete mongoose.models.Subject;

export default mongoose.models.Subject || mongoose.model("Subject", SubjectSchema);
