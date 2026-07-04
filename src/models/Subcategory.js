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

    // Denormalized from category.segment — never set directly by clients,
    // kept in sync via the pre("validate") hook below so segment-level
    // queries/filters don't need a 2-hop populate through category.
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

SubcategorySchema.pre("validate", async function () {
  if (this.isModified("category") || !this.segment) {
    const Category = mongoose.models.Category || mongoose.model("Category");
    const parent = await Category.findById(this.category)
      .select("segment")
      .lean();

    if (!parent) {
      this.invalidate("category", "Referenced category does not exist");
    } else {
      this.segment = parent.segment;
    }
  }

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