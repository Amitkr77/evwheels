import mongoose from "mongoose";
import slugify from "slugify";


const SpecificationSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      trim: true,
    },

    value: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  }
);

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
      required: true,
    },

    shortDescription: {
      type: String,
      trim: true,
      default: "",
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    images: [
      {
        type: String,
      },
    ],

    //     images: {
    //   type: [String],
    //   validate: {
    //     validator: (arr) => arr.length > 0,
    //     message: "At least one image is required",
    //   },
    // },

    isActive: {
      type: Boolean,
      default: true,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
    },

    brand: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subcategory",
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

    colors: [
      {
        type: String,
        trim: true,
      },
    ],

    moq: {
      type: Number,
      default: 1,
      min: 1,
    },

    boxQty: {
      type: Number,
      default: 1,
      min: 1,
    },

    warranty: {
      type: Number,
      default: 0,
    },
    specifications: {
      type: [SpecificationSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Single-field indexes (kept for targeted lookups)
ProductSchema.index({ category: 1 });
ProductSchema.index({ subcategory: 1 });
ProductSchema.index({ segment: 1 });
ProductSchema.index({ price: 1 });

// Compound indexes for common query patterns
// Default shop listing: active products sorted by date
ProductSchema.index({ isActive: 1, createdAt: -1 });
// Featured products on home page
ProductSchema.index({ isActive: 1, featured: 1, createdAt: -1 });
// Category + active listing
ProductSchema.index({ isActive: 1, category: 1, createdAt: -1 });
// Segment + active listing
ProductSchema.index({ isActive: 1, segment: 1, createdAt: -1 });
// Price range filter
ProductSchema.index({ isActive: 1, price: 1 });
// Text search (required for $text queries)
ProductSchema.index({ title: "text", description: "text", brand: "text" });

// Derive segment from category + auto-generate slug
ProductSchema.pre("validate", async function () {
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

  if (!this.slug && this.title) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
    });
  }
});

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);