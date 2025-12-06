import mongoose from "mongoose";

const moralMessageSchema = new mongoose.Schema(
  {
    teacherId: {
      type: String,
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const MoralMessage =
  mongoose.models.MoralMessage ||
  mongoose.model("MoralMessage", moralMessageSchema);

export default MoralMessage;
