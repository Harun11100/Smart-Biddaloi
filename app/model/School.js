import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const imageSchema = new mongoose.Schema(
  {
    public_id: { type: String },
    url: { type: String },
  },
  { _id: false }
);

const schoolSchema = new mongoose.Schema(
  {
    schoolName: { type: String, required: true, trim: true },
    principalName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Invalid email format"],
    },
    phone: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    contactNumber: {
      type: String,
      required: true,
      trim: true,
      match: [/^[0-9]{11}$/, "Phone number must be 11 digits"],
    },
    clientId: { type: String, required: true },
    union: { type: String, required: true, trim: true },
    wordNo: { type: String, required: true, trim: true },
    district: {
      type: String,
      required: true,
      enum: ["dhaka", "gazipur", "narayanganj", "others"],
      lowercase: true,
    },
    secretName: { type: String, required: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    logo: { type: imageSchema, default: null },
    cover: { type: imageSchema, default: null },
    website: { type: String, default: "" },
    role: { type: String, enum: ["Principal", "admin"], default: "Principal" },
    isActive: { type: Boolean, default: true },
    terms: { type: Boolean, default: false },
    expoToken: { type: String, default: null },
    totalStudents: { type: Number, default: 0 },
    maleStudents: { type: Number, default: 0 },
    femaleStudents: { type: Number, default: 0 },
    totalTeachers: { type: Number, default: 0 },
    totalMonthlyPaymentReceived: { type: Number, default: 0 },
    totalMonthlyPaymentDue: { type: Number, default: 0 },
    totalNotice: { type: Number, default: 0 },
    totalPaymentCount: { type: Number, default: 0 },
    appUpdateUrl: { type: String, default: "" },
    versionCode: { type: String, default: "" },
    availableAlert: { type: Boolean, default: false },
    alertTitle: { type: String, default: null },
    alertMessage: { type: String, default: null },
    resetCode: { type: String, default: null },
    resetCodeExpiry: { type: Date, default: null },
    loginOTP: { type: String, default: null },
    loginOTPExpiry: { type: Date, default: null },
    passOTP: { type: String, default: null },
    passOTPExpiry: { type: Date, default: null },
    weeklyAttendanceChartData: { type: Array, default: [] },
    totalMonthlyPaymentCollection: { type: Array, default: [] },
    totalStudentFees: { type: Number, default: 0 }
    
  },
  { timestamps: true }
);

schoolSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password
schoolSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Export model safely
const School = mongoose.models.School || mongoose.model("School", schoolSchema);
export default School;
