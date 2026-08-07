import mongoose from "mongoose";

// The three admin-curated homepage product rails. One document per type —
// `items` is the ordered product list an admin builds by hand (add/remove/
// reorder), which is why this isn't just a boolean flag on Product: the
// same list needs an explicit order independent of any product field.
export const SHOWCASE_TYPES = ["best-sellers", "new-arrivals", "top-rated"];

const ShowcaseItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const ShowcaseListSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: SHOWCASE_TYPES,
      required: true,
      unique: true,
    },
    items: {
      type: [ShowcaseItemSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.models.ShowcaseList ||
  mongoose.model("ShowcaseList", ShowcaseListSchema);
