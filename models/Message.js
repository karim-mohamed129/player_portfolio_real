import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 120 },
    phone: { type: String, trim: true, maxlength: 30 },
    subject: { type: String, required: true, trim: true, maxlength: 150 },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    status: { type: String, enum: ["new", "read"], default: "new" },
    source: { type: String, default: "website", maxlength: 40 },
    ip: { type: String, maxlength: 80, select: false }
  },
  { timestamps: true }
);

MessageSchema.index({ createdAt: -1 });
MessageSchema.index({ status: 1, createdAt: -1 });

export default mongoose.models.Message || mongoose.model("Message", MessageSchema);
