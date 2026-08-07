import mongoose from "mongoose";
import slugify from "slugify";

const CategorySchema = new mongoose.Schema(
  {
    segment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Segment",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      index: true,
    },

    image: {
      type: String,
      default: "",
    },

    // Small square glyph used in nav/category-grid tiles — distinct from
    // `image`, which is the larger banner/thumbnail shown on category pages.
    icon: {
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
    specificationFields: [
      {
        type: [String],
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  }
);

CategorySchema.pre("validate", function () {
  if (!this.slug && this.name) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
    });
  }

});

// Scope name/slug uniqueness to the parent segment (mirrors Subcategory's
// {category,name}/{category,slug} convention) so the same category name can
// exist under different segments.
CategorySchema.index({ segment: 1, name: 1 }, { unique: true });
CategorySchema.index({ segment: 1, slug: 1 }, { unique: true });

// Count active products
CategorySchema.virtual("productCount", {
  ref: "Product",
  localField: "_id",
  foreignField: "category",
  count: true,
  match: { isActive: true },
});

CategorySchema.set("toJSON", { virtuals: true });
CategorySchema.set("toObject", { virtuals: true });

export default mongoose.models.Category ||
  mongoose.model("Category", CategorySchema);