import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
  date: { type: String, required: true }, // "DD-MM-YYYY"
  attendance: [
    {
      studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
      name:{ type: String, required: true },
      roll:{ type: String, required: true },
      status: { type: String, enum: ["present", "absent"], required: true }
    }
  ]
}, { timestamps: true });

// prevent duplicate attendance for same day
attendanceSchema.index({ schoolId: 1, classId: 1, date: 1 }, { unique: true });

export default mongoose.models.Attendance || mongoose.model("Attendance", attendanceSchema);
