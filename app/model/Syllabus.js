import mongoose from "mongoose";

const syllabusSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
      index: true, // ✅ index directly here
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
      index: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now, // ✅ fallback to current date
    },
  },
  { timestamps: true }
);

// ✅ Compound index for faster lookups by school and class
syllabusSchema.index({ schoolId: 1, classId: 1, subject: 1 });

export default mongoose.models.Syllabus ||
  mongoose.model("Syllabus", syllabusSchema);
