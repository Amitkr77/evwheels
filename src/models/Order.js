import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    items: [
      {
        _id: false,
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: String,
        price: Number,
        quantity: Number,
      },
    ],

    shippingAddress: {
      fullName: String,
      phone: String,
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "CARD"],
    },

    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED"],
      default: "PENDING",
    },
    id: {
      type: String
    },

    orderStatus: {
      type: String,
      enum: [
        "PLACED",
        "CONFIRMED",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
      ],
      default: "PLACED",
    },

    statusHistory: [
      {
        _id: false,
        status: String,
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },
    discountAmount: Number,
    taxAmount: Number,
    shippingAmount: Number,
  },
  { timestamps: true }
);

// Compound index for the most common query: user's orders sorted by date
orderSchema.index({ user: 1, createdAt: -1 });
// Admin queries filtering by status + date range
orderSchema.index({ orderStatus: 1, createdAt: -1 });
// Revenue aggregation (delivered orders by date)
orderSchema.index({ orderStatus: 1, totalAmount: 1 });

export default mongoose.models.Order ||
  mongoose.model("Order", orderSchema);