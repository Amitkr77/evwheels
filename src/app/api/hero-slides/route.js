/**
 * GET /api/hero-slides
 * Public endpoint — returns active hero slides ordered by displayOrder.
 * Seeds defaults if collection is empty.
 */

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import HeroSlide from "@/models/HeroSlide";

const DEFAULT_SLIDES = [
  {
    badgeIcon: "Zap",
    badge: "In-house manufactured · COD Available · Pan-India Delivery",
    headline0: "Electric Cycles",
    headline1: "& Scooters.",
    accent: "Made in Patna.",
    description:
      "We manufacture electric cycles and lithium batteries in-house. Assemble e-scooters. Supply conversion kits and 240+ accessories — retail or wholesale, delivered Pan-India.",
    cta1Label: "Shop Now",
    cta1Href: "/shop",
    cta2Label: "Get Wholesale Quote",
    cta2Href: "/contact",
  },
  {
    badgeIcon: "Battery",
    badge: "In-house battery manufacturing",
    headline0: "Batteries built",
    headline1: "by us.",
    accent: "Not outsourced.",
    description:
      "We make our own lithium-ion battery packs — the safety-critical part most EV brands import or rebadge. Our cells power our cycles, scooters, and conversion kits.",
    cta1Label: "Browse Batteries",
    cta1Href: "/shop?category=batteries",
    cta2Label: "Get Wholesale Quote",
    cta2Href: "/contact",
  },
  {
    badgeIcon: "Settings",
    badge: "Conversion kits · 240+ spare parts",
    headline0: "Electrify your",
    headline1: "existing cycle.",
    accent: "Simpler than you think.",
    description:
      "Our conversion kits include motor, battery, controller and all hardware. Plus 240+ genuine parts across 23 categories — Shimano, disc brakes, lights, helmets and more.",
    cta1Label: "Shop Conversion Kits",
    cta1Href: "/shop?category=conversion-kits",
    cta2Label: "Browse All Parts",
    cta2Href: "/shop",
  },
];

export async function GET() {
  try {
    await connectDB();

    let slides = await HeroSlide.find({ isActive: true })
      .sort({ displayOrder: 1 })
      .lean();

    // Fall back to hardcoded defaults if DB has no slides yet
    if (slides.length === 0) return NextResponse.json({ success: true, slides: DEFAULT_SLIDES });

    return NextResponse.json({ success: true, slides });
  } catch (error) {
    console.error("[hero-slides]", error.message);
    // On error still return defaults so the homepage doesn't break
    return NextResponse.json({ success: true, slides: DEFAULT_SLIDES });
  }
}
