import mongoose from "mongoose";

// Promotional banners shown on the landing page — fully admin-managed so
// marketing content never requires a code change to update.
const BannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    subtitle: {
      type: String,
      default: "",
      trim: true,
    },

    image: {
      type: String,
      required: true,
    },

    buttonText: {
      type: String,
      default: "",
      trim: true,
    },

    buttonLink: {
      type: String,
      default: "",
      trim: true,
    },

    displayOrder: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

BannerSchema.index({ isActive: 1, displayOrder: 1 });

export default mongoose.models.Banner || mongoose.model("Banner", BannerSchema);
