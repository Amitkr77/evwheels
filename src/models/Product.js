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

// Useful indexes
ProductSchema.index({ category: 1 });
ProductSchema.index({ subcategory: 1 });
ProductSchema.index({ featured: 1 });
ProductSchema.index({ isActive: 1 });
ProductSchema.index({ price: 1 });

// Auto-generate slug
ProductSchema.pre("validate", function () {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
    });
  }


});

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);