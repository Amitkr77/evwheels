import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import HomepageSettings from "@/models/HomepageSettings";
import { verifyAdmin, verifyAdminStrict } from "@/lib/adminAuth";
import { captureServerException } from "@/lib/analytics/posthog-server";

async function getOrCreateSettings() {
  let settings = await HomepageSettings.findOne();
  if (!settings) settings = await HomepageSettings.create({});
  return settings;
}

// GET /api/admin/homepage-settings
export async function GET(req) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const settings = await getOrCreateSettings();
    await settings.populate("featuredProduct", "title slug images price");

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("[admin/homepage-settings]", error.message);
    captureServerException(error, { route: "admin/homepage-settings" });
    return NextResponse.json({ error: "Failed to fetch homepage settings" }, { status: 500 });
  }
}

// PATCH /api/admin/homepage-settings — set (or clear, with featuredProduct: null) the featured product
export async function PATCH(req) {
  try {
    const admin = await verifyAdminStrict(req);
    if (!admin)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();

    if (body.featuredProduct !== null && !mongoose.Types.ObjectId.isValid(body.featuredProduct)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    await connectDB();

    const settings = await getOrCreateSettings();
    settings.featuredProduct = body.featuredProduct || null;
    await settings.save();
    await settings.populate("featuredProduct", "title slug images price");

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("[admin/homepage-settings]", error.message);
    captureServerException(error, { route: "admin/homepage-settings" });
    return NextResponse.json({ error: "Failed to update homepage settings" }, { status: 500 });
  }
}
