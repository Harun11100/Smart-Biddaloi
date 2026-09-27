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

    totalSubject:{
      type:Number,
      required:true
    },
    
    subjects: [
       {
        subjectId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Subject",
          required: true,
        },

        subjectName:{
          type: String
        },

        teacherId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Teacher",
          required: true,
        },

        maxMarks: {
          type: Number,
          required: true,
        },

        passingMarks: {
          type: Number,
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

        status: {
          type: String,
          enum: ["draft", "submitted", "verified"],
          default: "draft",
        },

        remarks: {
          type: String,
          default: "",
        },
      },
    ],

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
  { timestamps: true }
);

// One student can have only one result for one semester
SemesterResultSchema.index(
  {
    studentId: 1,
    semesterId: 1,
  },
  {
    unique: true,
  }
);

// Useful for class result/ranking queries
SemesterResultSchema.index({
  classId: 1,
  semesterId: 1,
});

export default mongoose.models.SemesterResult ||
  mongoose.model("SemesterResult", SemesterResultSchema);