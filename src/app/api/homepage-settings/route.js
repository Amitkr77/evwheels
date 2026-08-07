import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import HomepageSettings from "@/models/HomepageSettings";
import Product from "@/models/Product";
import { captureServerException } from "@/lib/analytics/posthog-server";

const PRODUCT_FIELDS = "title slug images price moq description stock";

// GET /api/homepage-settings — the trending/featured product for the
// landing page. Falls back to the newest featured product (then the newest
// product overall) if the admin hasn't picked one explicitly.
export async function GET() {
  try {
    await connectDB();

    const settings = await HomepageSettings.findOne()
      .populate({ path: "featuredProduct", select: PRODUCT_FIELDS, match: { isActive: true } })
      .lean();

    let featuredProduct = settings?.featuredProduct || null;

    if (!featuredProduct) {
      featuredProduct = await Product.findOne({ isActive: true, featured: true })
        .select(PRODUCT_FIELDS)
        .sort({ createdAt: -1 })
        .lean();
    }

    if (!featuredProduct) {
      featuredProduct = await Product.findOne({ isActive: true })
        .select(PRODUCT_FIELDS)
        .sort({ createdAt: -1 })
        .lean();
    }

    return NextResponse.json({ success: true, featuredProduct: featuredProduct || null });
  } catch (error) {
    console.error("[homepage-settings]", error.message);
    captureServerException(error, { route: "homepage-settings" });
    return NextResponse.json({ error: "Failed to fetch homepage settings" }, { status: 500 });
  }
}
