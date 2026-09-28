import mongoose from "mongoose";

const homeworkSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: [true, "School ID is required"],
      index: true,
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: [true, "Class ID is required"],
      index: true,
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // or "Teacher" depending on your model name
      required: [true, "Teacher ID is required"],
      index: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Compound index for queries filtering by school and class together
homeworkSchema.index({ schoolId: 1, classId: 1, createdAt: -1 });

// Export or reuse existing compiled model
const Homework =
  mongoose.models.Homework || mongoose.model("Homework", homeworkSchema);

export default Homework;