import mongoose from "mongoose";

const SemesterResultSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },

    semesterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Semester",
      required: true,
    },

    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    // Complete subject-wise result
    subjects: [
      {
        subjectId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Subject",
          required: true,
        },

        totalMarks: {
          type: Number,
          default: 0,
        },

        grade: {
          type: String,
          default: null,
        },

        gpa: {
          type: Number,
          default: null,
        },
      },
    ],

    // Overall result
    totalMarks: {
      type: Number,
      default: 0,
    },

    totalPossibleMarks: {
      type: Number,
      default: 0,
    },

    averageMarks: {
      type: Number,
      default: 0,
    },

    gpa: {
      type: Number,
      default: 0,
    },

    position: {
      type: Number,
      default: null,
    },

    // Publication status
    status: {
      type: String,
      enum: ["draft", "verified", "published"],
      default: "draft",
    },

    publishedAt: {
      type: Date,
      default: null,
    },

    remarks: {
      type: String,
      default: "",
    },
  },

  {
    timestamps: true,
  }
);

// One student can have only one semester result
SemesterResultSchema.index(
  {
    studentId: 1,
    semesterId: 1,
  },
  {
    unique: true,
  }
);

export default mongoose.models.SemesterResult ||
  mongoose.model("SemesterResult", SemesterResultSchema);