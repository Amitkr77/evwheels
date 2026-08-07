import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import ShowcaseList, { SHOWCASE_TYPES } from "@/models/ShowcaseList";
import { verifyAdmin, verifyAdminStrict } from "@/lib/adminAuth";
import { captureServerException } from "@/lib/analytics/posthog-server";

const PRODUCT_FIELDS = "title slug images price stock isActive";

// GET /api/admin/showcase — every showcase list, products populated, for the
// curation UI (all three tabs load in one request instead of three).
export async function GET(req) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const lists = await ShowcaseList.find().populate("items.product", PRODUCT_FIELDS).lean();

    // Always return all three types, even ones with no document yet, so the
    // admin UI doesn't need to special-case "not created" vs "empty". Items
    // are flattened to plain populated products — array position already
    // encodes order, so the curation UI doesn't need a separate field for it.
    const byType = Object.fromEntries(lists.map((l) => [l.type, l]));
    const result = Object.fromEntries(
      SHOWCASE_TYPES.map((type) => [
        type,
        (byType[type]?.items || [])
          .filter((i) => i.product) // drop dangling refs to deleted products
          .sort((a, b) => a.order - b.order)
          .map((i) => i.product),
      ])
    );

    return NextResponse.json({ success: true, showcase: result });
  } catch (error) {
    console.error("[admin/showcase]", error.message);
    captureServerException(error, { route: "admin/showcase" });
    return NextResponse.json({ error: "Failed to fetch showcase lists" }, { status: 500 });
  }
}

// PUT /api/admin/showcase?type=best-sellers — replace a list's items wholesale.
// The admin UI manages add/remove/reorder locally and saves the full ordered
// array at once, rather than one request per drag/drop step.
export async function PUT(req) {
  try {
    const admin = await verifyAdminStrict(req);
    if (!admin)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    if (!SHOWCASE_TYPES.includes(type)) {
      return NextResponse.json(
        { error: `Type must be one of: ${SHOWCASE_TYPES.join(", ")}` },
        { status: 400 }
      );
    }

    const body = await req.json();
    const rawItems = Array.isArray(body.items) ? body.items : [];

    const items = [];
    for (let i = 0; i < rawItems.length; i++) {
      const productId = rawItems[i]?.product;
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return NextResponse.json({ error: `Invalid product ID at position ${i + 1}` }, { status: 400 });
      }
      items.push({ product: productId, order: i });
    }

    await connectDB();

    const list = await ShowcaseList.findOneAndUpdate(
      { type },
      { type, items },
      { upsert: true, new: true, runValidators: true }
    ).populate("items.product", PRODUCT_FIELDS);

    return NextResponse.json({ success: true, list });
  } catch (error) {
    console.error("[admin/showcase]", error.message);
    captureServerException(error, { route: "admin/showcase" });
    return NextResponse.json({ error: "Failed to update showcase list" }, { status: 500 });
  }
}
