import mongoose from "mongoose";
import slugify from "slugify";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
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
    },

    image: {
      type: String,
      required: true,
    },

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
    },

    category: {
      type: String,
      default: "electric-cycle",
    },

    color: String,

    warranty: Number,

    specs: {
      battery: {
        capacity: { type: Number },
        range: { type: Number },
        chargingTime: { type: Number },
        type: { type: String },
      },
      motor: {
        power: { type: Number },
        type: { type: String },
        topSpeed: { type: Number },
        pedalAssistLevels: { type: Number },
      },
      physical: {
        weight: { type: Number },
        frameMaterial: { type: String },
        wheelSize: { type: Number },
        maxLoad: { type: Number },
      },
      components: {
        brakeType: { type: String },
        suspension: { type: String },
        gearSystem: { type: String },
      },
      smartFeatures: {
        displayType: { type: String },
        mobileAppSupport: { type: Boolean, default: false },
        gps: { type: Boolean, default: false },
      },
    },
  },
  { timestamps: true }
);


// 👇 ADD MIDDLEWARE HERE
productSchema.pre("save", function () {
  if (!this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
});


export default mongoose.models.Product || mongoose.model("Product", productSchema);