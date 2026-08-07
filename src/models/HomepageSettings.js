import mongoose from "mongoose";

// Singleton document for homepage settings that don't fit anywhere else —
// today just the trending/featured product, but a natural place to grow
// (e.g. a future "hero product" or "homepage headline override").
const HomepageSettingsSchema = new mongoose.Schema(
  {
    featuredProduct: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.HomepageSettings ||
  mongoose.model("HomepageSettings", HomepageSettingsSchema);
