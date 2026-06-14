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
      index: true,
    },

    featured: {
      type: Boolean,
      default: false,
      index: true,
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
      index: true,
    },

    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subcategory",
      // required: true,
      index: true,
    },

    colors: [
      {
        type: String,
        trim: true,
      },
    ],

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

// Useful indexes
ProductSchema.index({ category: 1 });
ProductSchema.index({ subcategory: 1 });
ProductSchema.index({ featured: 1 });
ProductSchema.index({ isActive: 1 });
ProductSchema.index({ price: 1 });

// Auto-generate slug
ProductSchema.pre("validate", function (next) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
    });
  }

  next();
});

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);