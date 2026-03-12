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

export default mongoose.models.Order ||
  mongoose.model("Order", orderSchema);