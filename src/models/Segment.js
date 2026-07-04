import mongoose from "mongoose";
import slugify from "slugify";

const SegmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    slug: {
      type: String,
      unique: true,
      index: true,
    },

    image: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

SegmentSchema.pre("validate", function () {
  if (!this.slug && this.name) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
    });
  }
});

// Count active categories
SegmentSchema.virtual("categoryCount", {
  ref: "Category",
  localField: "_id",
  foreignField: "segment",
  count: true,
  match: { isActive: true },
});

SegmentSchema.set("toJSON", { virtuals: true });
SegmentSchema.set("toObject", { virtuals: true });

export default mongoose.models.Segment ||
  mongoose.model("Segment", SegmentSchema);
