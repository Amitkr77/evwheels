import mongoose from "mongoose";

const emailLogSchema = new mongoose.Schema(
  {
    recipient: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: [
        "welcome",
        "order_confirmation",
        "order_status_update",
        "order_cancellation",
        "abandoned_cart",
        "low_stock_alert",
        "password_reset",
        "email_verification",
        "new_order_admin",
        "newsletter",
        "other",
      ],
      default: "other",
    },
    status: {
      type: String,
      enum: ["sent", "failed"],
      default: "sent",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    error: {
      type: String,
      default: null,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

emailLogSchema.index({ type: 1, createdAt: -1 });
emailLogSchema.index({ userId: 1 });
emailLogSchema.index({ status: 1 });

export default mongoose.models.EmailLog ||
  mongoose.model("EmailLog", emailLogSchema);
