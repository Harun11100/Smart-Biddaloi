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
    // -----------------------------------------
    // Basic School Information
    // -----------------------------------------

    schoolName: {
      type: String,
      required: true,
      trim: true,
    },

    principalName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Invalid email format"],
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // -----------------------------------------
    // Password
    // -----------------------------------------

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    // -----------------------------------------
    // School Images
    // -----------------------------------------

    logo: {
      type: imageSchema,
      default: null,
    },

    cover: {
      type: imageSchema,
      default: null,
    },

    // -----------------------------------------
    // Additional School Information
    // -----------------------------------------

    slogan: {
      type: String,
      default: "",
      trim: true,
    },

    website: {
      type: String,
      default: "",
      trim: true,
    },

    // -----------------------------------------
    // Role & Account Status
    // -----------------------------------------

    role: {
      type: String,
      enum: ["Principal", "admin"],
      default: "admin",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    terms: {
      type: Boolean,
      default: false,
    },

    // -----------------------------------------
    // Push Notification
    // -----------------------------------------

    expoToken: {
      type: String,
      default: null,
    },

    // -----------------------------------------
    // Student Statistics
    // -----------------------------------------

    totalStudents: {
      type: Number,
      default: 0,
    },

    maleStudents: {
      type: Number,
      default: 0,
    },

    femaleStudents: {
      type: Number,
      default: 0,
    },

    // -----------------------------------------
    // Teacher Statistics
    // -----------------------------------------

    totalTeachers: {
      type: Number,
      default: 0,
    },

    // -----------------------------------------
    // Payment Statistics
    // -----------------------------------------

    totalMonthlyPaymentReceived: {
      type: Number,
      default: 0,
    },

    totalMonthlyPaymentDue: {
      type: Number,
      default: 0,
    },

    totalNotice: {
      type: Number,
      default: 0,
    },

    totalPaymentCount: {
      type: Number,
      default: 0,
    },

    totalMonthlyPaymentCollection: {
      type: Array,
      default: [],
    },

    totalStudentFees: {
      type: Number,
      default: 0,
    },

    // -----------------------------------------
    // App Update
    // -----------------------------------------

    appUpdateUrl: {
      type: String,
      default: "",
    },

    versionCode: {
      type: String,
      default: "",
    },

    availableAlert: {
      type: Boolean,
      default: false,
    },

    alertTitle: {
      type: String,
      default: null,
    },

    alertMessage: {
      type: String,
      default: null,
    },

    // -----------------------------------------
    // Password Reset
    // -----------------------------------------

    resetCode: {
      type: String,
      default: null,
    },

    resetCodeExpiry: {
      type: Date,
      default: null,
    },

    // -----------------------------------------
    // Login OTP
    // -----------------------------------------

    loginOTP: {
      type: String,
      default: null,
    },

    loginOTPExpiry: {
      type: Date,
      default: null,
    },

    // -----------------------------------------
    // Password OTP
    // -----------------------------------------

    passOTP: {
      type: String,
      default: null,
    },

    passOTPExpiry: {
      type: Date,
      default: null,
    },

    // -----------------------------------------
    // Dashboard Chart Data
    // -----------------------------------------

    weeklyAttendanceChartData: {
      type: Array,
      default: [],
    },

    totalMonthlyPaymentCollection: {
      type: Array,
      default: [],
    },
  },

  {
    timestamps: true,
  }
);

// ==================================================
// HASH PASSWORD BEFORE SAVE
// ==================================================

schoolSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(
      this.password,
      salt
    );

    next();
  } catch (error) {
    next(error);
  }
});

// ==================================================
// COMPARE PASSWORD
// ==================================================

schoolSchema.methods.comparePassword = async function (
  enteredPassword
) {
  return bcrypt.compare(
    enteredPassword,
    this.password
  );
};

// ==================================================
// EXPORT MODEL SAFELY
// ==================================================

const School =
  mongoose.models.School ||
  mongoose.model("School", schoolSchema);

export default School;