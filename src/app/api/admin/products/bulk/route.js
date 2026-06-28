import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyAdmin } from "@/lib/adminAuth";
import Product from "@/models/Product";

// POST /api/admin/products/bulk
// body: { action: "activate"|"deactivate"|"feature"|"unfeature"|"delete", ids: string[] }
export async function POST(req) {
  const admin = await verifyAdmin(req);
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  const { action, ids } = await req.json();

  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: "No product IDs provided" }, { status: 400 });
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

    case "delete":
      await Product.deleteMany(filter);
      return NextResponse.json({ success: true, message: `${ids.length} products deleted` });

    default:
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }
}
