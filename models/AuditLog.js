import mongoose from "mongoose";

const AuditLogSchema = new mongoose.Schema(
  {
    adminEmail: { type: String, required: true, index: true },
    adminId: { type: String, default: null },
    action: { type: String, required: true, index: true },
    target: { type: String, default: "system", index: true },
    status: { type: String, enum: ["success", "failed"], default: "success", index: true },
    details: { type: mongoose.Schema.Types.Mixed, default: {} },
    ip: { type: String, default: "unknown" },
    userAgent: { type: String, default: "" }
  },
  { timestamps: true, minimize: false }
);

AuditLogSchema.index({ createdAt: -1 });
AuditLogSchema.index({ adminEmail: 1, createdAt: -1 });

export default mongoose.models.AuditLog || mongoose.model("AuditLog", AuditLogSchema);
