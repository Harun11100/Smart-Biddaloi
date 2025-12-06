import mongoose from "mongoose";

const teacherAttendanceSchema = new mongoose.Schema(
  { 
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },

    teacherName: {
      type: String,
      trim: true,
      default: "",
    },

    teacherPhone: {
      type: String,
      trim: true,
      default: "",
    },

    date: {
      type: Date,
      required: true,
      default: () => new Date()
    },

    status: {
      type: String,
      enum: ["present", "absent", "pending", "leave"],
      required: true,
      default: "absent",
    },

    tempStatus: {
      type: String,
    },

    arrivalTime: {
      type: Date,
      default: null,
    },

    approvedBy: {
      type: String,
      trim: true,
      default: "",
    },

    approvalTime: {
      type: Date,
      default: null,
    },

    remarks: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true, 
  }
);

teacherAttendanceSchema.index({ teacherId: 1, date: 1 }, { unique: true });

// ✅ Fix: reuse model if it already exists
const TeacherAttendance = mongoose.models.TeacherAttendance || mongoose.model("TeacherAttendance", teacherAttendanceSchema);

export default TeacherAttendance;
