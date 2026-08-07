import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ShowcaseList, { SHOWCASE_TYPES } from "@/models/ShowcaseList";
import Product from "@/models/Product";
import Review from "@/models/Review";
import { captureServerException } from "@/lib/analytics/posthog-server";

const PRODUCT_FIELDS = "title slug images price moq";

// GET /api/showcase?type=best-sellers&limit=12 — the "Popular Products"
// rails on the landing page. Each type falls back to a sensible automatic
// ordering when the admin hasn't curated that list yet, so the section
// never renders empty on a fresh install.
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const limit = Math.min(24, Math.max(1, Number(searchParams.get("limit")) || 12));

    if (!SHOWCASE_TYPES.includes(type)) {
      return NextResponse.json(
        { error: `type must be one of: ${SHOWCASE_TYPES.join(", ")}` },
        { status: 400 }
      );
    }

    await connectDB();

    const list = await ShowcaseList.findOne({ type })
      .populate({
        path: "items.product",
        select: PRODUCT_FIELDS,
        match: { isActive: true },
      })
      .lean();

    const curated = (list?.items || [])
      .filter((i) => i.product)
      .sort((a, b) => a.order - b.order)
      .slice(0, limit)
      .map((i) => i.product);

    if (curated.length > 0) {
      return NextResponse.json({ success: true, type, products: curated, curated: true });
    }

    // Nothing curated yet — fall back to an automatic ordering per type.
    let products;
    if (type === "new-arrivals") {
      products = await Product.find({ isActive: true })
        .select(PRODUCT_FIELDS)
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();
    } else if (type === "top-rated") {
      const topRatedIds = await Review.aggregate([
        { $match: { status: "Approved" } },
        { $group: { _id: "$product", avgRating: { $avg: "$rating" }, count: { $sum: 1 } } },
        { $sort: { avgRating: -1, count: -1 } },
        { $limit: limit },
      ]);
      const ids = topRatedIds.map((r) => r._id);
      const found = await Product.find({ _id: { $in: ids }, isActive: true })
        .select(PRODUCT_FIELDS)
        .lean();
      // Re-order to match the rating-ranked id list — $in doesn't preserve order.
      const byId = new Map(found.map((p) => [String(p._id), p]));
      products = ids.map((id) => byId.get(String(id))).filter(Boolean);
    } else {
      // best-sellers fallback — no sales-volume aggregate exists yet, so the
      // admin-curated "featured" flag is the closest honest proxy.
      products = await Product.find({ isActive: true, featured: true })
        .select(PRODUCT_FIELDS)
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();
    }

    return NextResponse.json({ success: true, type, products, curated: false });
  } catch (error) {
    console.error("[showcase]", error.message);
    captureServerException(error, { route: "showcase" });
    return NextResponse.json({ error: "Failed to fetch showcase" }, { status: 500 });
  }
}
