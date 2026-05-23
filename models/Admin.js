import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema(
  {
    name: { type: String, default: "Admin", trim: true, maxlength: 100 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 120 },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["super_admin"], default: "super_admin" },
    active: { type: Boolean, default: true },
    lastLoginAt: { type: Date }
  },
  { timestamps: true }
);

export default mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
