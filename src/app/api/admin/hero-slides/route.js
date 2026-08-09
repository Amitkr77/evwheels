/**
 * Admin API for hero slides.
 * GET    — list all slides (ordered by displayOrder asc), seeding defaults on first run
 * POST   — create a slide
 * PATCH  — update a slide (?id=<id>)
 * DELETE — delete a slide (?id=<id>)
 */

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import HeroSlide from "@/models/HeroSlide";
import { verifyAdmin, verifyAdminStrict } from "@/lib/adminAuth";
import { captureServerException } from "@/lib/analytics/posthog-server";

// Default slides — identical to the hardcoded values in HomeClient.jsx.
// Seeded on first GET so the admin always has something to edit.
const DEFAULT_SLIDES = [
  {
    badgeIcon:   "Zap",
    badge:       "In-house manufactured · COD Available · Pan-India Delivery",
    headline0:   "Electric Cycles",
    headline1:   "& Scooters.",
    accent:      "Made in Patna.",
    description: "We manufacture electric cycles and lithium batteries in-house. Assemble e-scooters. Supply conversion kits and 240+ accessories — retail or wholesale, delivered Pan-India.",
    cta1Label:   "Shop Now",
    cta1Href:    "/shop",
    cta2Label:   "Get Wholesale Quote",
    cta2Href:    "/contact",
    isActive:    true,
    displayOrder: 0,
  },
  {
    badgeIcon:   "Battery",
    badge:       "In-house battery manufacturing",
    headline0:   "Batteries built",
    headline1:   "by us.",
    accent:      "Not outsourced.",
    description: "We make our own lithium-ion battery packs — the safety-critical part most EV brands import or rebadge. Our cells power our cycles, scooters, and conversion kits.",
    cta1Label:   "Browse Batteries",
    cta1Href:    "/shop?category=batteries",
    cta2Label:   "Get Wholesale Quote",
    cta2Href:    "/contact",
    isActive:    true,
    displayOrder: 1,
  },
  {
    badgeIcon:   "Settings",
    badge:       "Conversion kits · 240+ spare parts",
    headline0:   "Electrify your",
    headline1:   "existing cycle.",
    accent:      "Simpler than you think.",
    description: "Our conversion kits include motor, battery, controller and all hardware. Plus 240+ genuine parts across 23 categories — Shimano, disc brakes, lights, helmets and more.",
    cta1Label:   "Shop Conversion Kits",
    cta1Href:    "/shop?category=conversion-kits",
    cta2Label:   "Browse All Parts",
    cta2Href:    "/shop",
    isActive:    true,
    displayOrder: 2,
  },
];

async function seedIfEmpty() {
  const count = await HeroSlide.countDocuments();
  if (count === 0) await HeroSlide.insertMany(DEFAULT_SLIDES);
}

export async function GET(req) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    await seedIfEmpty();
    const slides = await HeroSlide.find().sort({ displayOrder: 1 });
    return NextResponse.json({ success: true, slides });
  } catch (error) {
    captureServerException(error, { route: "admin/hero-slides GET" });
    return NextResponse.json({ error: "Failed to fetch slides" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const admin = await verifyAdminStrict(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    if (!body.headline0?.trim())
      return NextResponse.json({ error: "headline0 is required" }, { status: 400 });

    await connectDB();
    const count = await HeroSlide.countDocuments();
    const slide = await HeroSlide.create({ ...body, displayOrder: count });
    return NextResponse.json({ success: true, slide }, { status: 201 });
  } catch (error) {
    captureServerException(error, { route: "admin/hero-slides POST" });
    return NextResponse.json({ error: "Failed to create slide" }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const admin = await verifyAdminStrict(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!mongoose.Types.ObjectId.isValid(id))
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const body = await req.json();
    await connectDB();
    const slide = await HeroSlide.findByIdAndUpdate(id, { $set: body }, { new: true });
    if (!slide) return NextResponse.json({ error: "Slide not found" }, { status: 404 });

    return NextResponse.json({ success: true, slide });
  } catch (error) {
    captureServerException(error, { route: "admin/hero-slides PATCH" });
    return NextResponse.json({ error: "Failed to update slide" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const admin = await verifyAdminStrict(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!mongoose.Types.ObjectId.isValid(id))
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    await connectDB();
    const slide = await HeroSlide.findByIdAndDelete(id);
    if (!slide) return NextResponse.json({ error: "Slide not found" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (error) {
    captureServerException(error, { route: "admin/hero-slides DELETE" });
    return NextResponse.json({ error: "Failed to delete slide" }, { status: 500 });
  }
}
