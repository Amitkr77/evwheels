import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },

    comment: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"], 
      default: "Pending", 
    },
  },
  { timestamps: true }
);

// Ensure one review per user per product
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

export default mongoose.models.Review ||
  mongoose.model("Review", reviewSchema);