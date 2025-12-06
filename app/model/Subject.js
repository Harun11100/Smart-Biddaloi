import mongoose from "mongoose";

const SubjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
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

export default mongoose.models.Subject || mongoose.model("Subject", SubjectSchema);
