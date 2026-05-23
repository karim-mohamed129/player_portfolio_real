import mongoose from "mongoose";

const ContentSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: "main" },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
    updatedBy: { type: String, default: "system" }
  },
  { timestamps: true, minimize: false }
);

export default mongoose.models.Content || mongoose.model("Content", ContentSchema);
