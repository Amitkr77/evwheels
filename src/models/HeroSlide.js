import mongoose from "mongoose";

const HeroSlideSchema = new mongoose.Schema(
  {
    badgeIcon:    { type: String, default: "Zap" }, // icon name string — mapped on frontend
    badge:        { type: String, default: "" },
    headline0:    { type: String, default: "" },    // first line of headline
    headline1:    { type: String, default: "" },    // second line
    accent:       { type: String, default: "" },    // teal colored line
    description:  { type: String, default: "" },
    cta1Label:    { type: String, default: "Shop Now" },
    cta1Href:     { type: String, default: "/shop" },
    cta2Label:    { type: String, default: "" },
    cta2Href:     { type: String, default: "" },
    isActive:     { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.HeroSlide ||
  mongoose.model("HeroSlide", HeroSlideSchema);
