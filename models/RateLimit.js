import mongoose from "mongoose";

const RateLimitSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    count: { type: Number, required: true, default: 0, min: 0 },
    expiresAt: { type: Date, required: true, index: { expires: 0 } }
  },
  { timestamps: true }
);

export default mongoose.models.RateLimit || mongoose.model("RateLimit", RateLimitSchema);
