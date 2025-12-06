// models/Admin.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false }, // hashed password
    role: { type: String, default: "superadmin" }, // could be 'superadmin', 'manager', etc.
    phone: { type: String, unique: true, sparse: true },
    loginOTP: { type: String, default: null },
    loginOTPExpiry: { type: Date, default: null },
    avatar: { type: String }, // optional profile image URL
    isActive: { type: Boolean, default: true }, // for soft delete / deactivation
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Hash password before saving
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password during login
adminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.models.Admin || mongoose.model("Admin", adminSchema);
