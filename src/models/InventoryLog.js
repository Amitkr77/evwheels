import mongoose from "mongoose";

const InventoryLogSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    productName: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["increase", "decrease", "adjustment", "order_deduction", "order_cancel", "restock", "initial"],
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },

    previousStock: {
      type: Number,
      required: true,
    },

    newStock: {
      type: Number,
      required: true,
    },

    reason: {
      type: String,
      default: "",
    },

    reference: {
      type: String,
      default: "",
    },

    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

InventoryLogSchema.index({ createdAt: -1 });
InventoryLogSchema.index({ product: 1, createdAt: -1 });

export default mongoose.models.InventoryLog ||
  mongoose.model("InventoryLog", InventoryLogSchema);
