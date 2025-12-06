import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    public_id: { type: String, trim: true },
    url: { type: String, trim: true },
  },
  { _id: false }
);

const achievementSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
      index: true,
    },
    studentName: {
      type: String,
      required: true,
      trim: true,
    },
    studentRoll: {
      type: String,
      required: true,
      trim: true,
    },
    batch: {
      type: String,
      trim: true,
    },
    sessionYear: {
      type: String,
      trim: true,
    },
    achievementTitle: {
      type: String,
      required: true,
      trim: true,
    },
    achievementName: {
      type: String,
      required: true,
      trim: true,
    },
    image: { type: imageSchema, default: null },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// ✅ Prevent model overwrite in Next.js or hot reload
const Achievement =
  mongoose.models.Achievement || mongoose.model("Achievement", achievementSchema);

export default Achievement;