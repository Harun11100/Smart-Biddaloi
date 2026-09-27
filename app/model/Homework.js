import mongoose from "mongoose";

const homeworkSchema = new mongoose.Schema(
  {
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    teacherId:{type: String, required: true},
    dueDate: { type: Date, required: true },
  },
  { timestamps: true }
);

homeworkSchema.index({ schoolId: 1 });
homeworkSchema.index({ classId: 1 });

export default mongoose.models.Homework ||
  mongoose.model("Homework", homeworkSchema);
