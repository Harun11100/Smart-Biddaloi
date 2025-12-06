import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema(
  {
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: String, required: true }, 
  },
  { timestamps: true }
);

export default mongoose.models.Notice || mongoose.model("Notice", noticeSchema);
