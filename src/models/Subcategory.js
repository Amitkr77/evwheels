import mongoose from "mongoose";
import slugify from "slugify";

const SubcategorySchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
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

SubcategorySchema.pre("validate", function () {
  if (!this.slug && this.name) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
    });
  }
});

// Prevent duplicate subcategory names in same category
SubcategorySchema.index(
  {
    category: 1,
    name: 1,
  },
  {
    unique: true,
  }
);

// Optional: prevent duplicate slugs in same category
SubcategorySchema.index(
  {
    category: 1,
    slug: 1,
  },
  {
    unique: true,
  }
);

export default mongoose.models.Subcategory ||
  mongoose.model("Subcategory", SubcategorySchema);