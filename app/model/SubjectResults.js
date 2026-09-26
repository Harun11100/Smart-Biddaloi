import mongoose from "mongoose";

const SubjectResultSchema = new mongoose.Schema(
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

    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },

    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },

    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    // Marks
    cqMarks: {
      type: Number,
      default: 0,
      min: 0,
    },

    mcqMarks: {
      type: Number,
      default: 0,
      min: 0,
    },

    practicalMarks: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalMarks: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Result information
    grade: {
      type: String,
      default: null,
    },

    gpa: {
      type: Number,
      default: null,
    },

    status: {
      type: String,
      enum: ["draft", "submitted", "verified", "published"],
      default: "draft",
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

// Prevent duplicate result for the same student,
// subject and semester.
SubjectResultSchema.index(
  {
    studentId: 1,
    subjectId: 1,
    semesterId: 1,
  },
  {
    unique: true,
  }
);

export default mongoose.models.SubjectResult ||
  mongoose.model("SubjectResult", SubjectResultSchema);