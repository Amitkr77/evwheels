import mongoose from "mongoose";

const InstagramPostSchema = new mongoose.Schema(
  {
    imageUrl:     { type: String, required: true },
    caption:      { type: String, default: "" },
    link:         { type: String, default: "" }, // defaults to profile if empty
    isActive:     { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.InstagramPost ||
  mongoose.model("InstagramPost", InstagramPostSchema);
