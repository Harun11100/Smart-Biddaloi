import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const teacherSchema = new mongoose.Schema(
  {
    classTeacher: { type: String },
    
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    name: { type: String, required: true },
    userName: { type: String},
    password: { type: String, required: true, select: false },
    gender: { type: String },
    nid: { type: String },
    address: { type: String },
    bloodGroup: { type: String },
    experience:{type:String, default:3},
    imageUrl: { type: String, default:null },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    role: { type: String, required: true },
    totalPresentDays: [
      {
        month: { type: String },
        year: { type: String },
        days: { type: Number, default: 0 },
      },
    ],

    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },

    subjects: [{ type: String }],

    expoToken: { type: String, default: null },

    loginOTP: { type: String, default: null },

    loginOTPExpiry: { type: Date, default: null },
    answerKey: {
      type: Object, // { "1": "A", "2": "B" }
      default: {},
    },
    rawAnswerKey: {
      type: String,
      default: "",
    },
    answerKeyUpdatedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// 🧹 Prevent duplicate index creation warning
teacherSchema.set("autoIndex", false);

// 🔐 Hash password before saving
teacherSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🧩 Compare password method
teacherSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// 🧱 Model export (reuse existing model if already compiled)

delete mongoose.models.Teacher;
const Teacher =
  mongoose.models.Teacher || mongoose.model("Teacher", teacherSchema);

export default Teacher;
