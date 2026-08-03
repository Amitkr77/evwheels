import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { verifyAdminStrict } from "@/lib/adminAuth";
import Product from "@/models/Product";
import Order from "@/models/Order";
import { captureServerException } from "@/lib/analytics/posthog-server";

// POST /api/admin/products/bulk
// body: { action: "activate"|"deactivate"|"feature"|"unfeature"|"delete", ids: string[] }
export async function POST(req) {
  try {
    const admin = await verifyAdminStrict(req);
    if (!admin)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const { action, ids } = await req.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "No product IDs provided" }, { status: 400 });
    }

    if (!ids.every((id) => mongoose.Types.ObjectId.isValid(id))) {
      return NextResponse.json({ error: "One or more product IDs are invalid" }, { status: 400 });
    }

    const filter = { _id: { $in: ids } };

    switch (action) {
      case "activate":
        await Product.updateMany(filter, { isActive: true });
        return NextResponse.json({ success: true, message: `${ids.length} products activated` });

      case "deactivate":
        await Product.updateMany(filter, { isActive: false });
        return NextResponse.json({ success: true, message: `${ids.length} products deactivated` });

      case "feature":
        await Product.updateMany(filter, { featured: true });
        return NextResponse.json({ success: true, message: `${ids.length} products featured` });

      case "unfeature":
        await Product.updateMany(filter, { featured: false });
        return NextResponse.json({ success: true, message: `${ids.length} products unfeatured` });

      case "delete": {
        const referencedCount = await Order.countDocuments({ "items.product": { $in: ids } });
        if (referencedCount > 0) {
          return NextResponse.json(
            { error: "One or more selected products appear in existing orders. Deactivate them instead." },
            { status: 409 }
          );
        }
        await Product.deleteMany(filter);
        return NextResponse.json({ success: true, message: `${ids.length} products deleted` });
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("[admin/products/bulk]", error.message);
    captureServerException(error, { route: "admin/products/bulk" });
    return NextResponse.json({ error: "Bulk operation failed" }, { status: 500 });
  }
}
