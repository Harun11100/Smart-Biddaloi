import mongoose from "mongoose";

const SemesterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    academicYear: {
      type: String,
      required: true,
      trim: true,
    },

    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["upcoming", "active", "completed"],
      default: "upcoming",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate semester names within the same school and academic year
SemesterSchema.index(
  {
    schoolId: 1,
    academicYear: 1,
    name: 1,
  },
  {
    unique: true,
  }
);

export default mongoose.models.Semester ||
  mongoose.model("Semester", SemesterSchema);