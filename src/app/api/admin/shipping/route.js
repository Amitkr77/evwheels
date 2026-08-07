/**
 * GET /api/admin/shipping
 *
 * Returns all orders enriched with their Shiprocket shipping data.
 * Supports optional status filter and search by order ID / customer.
 */

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { verifyAdminStrict } from "@/lib/adminAuth";

export async function GET(req) {
  try {
    const admin = await verifyAdminStrict(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "";
    const search = searchParams.get("search") || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = 50;

    await connectDB();

    const query = {};
    if (status) query.orderStatus = status;
    if (search) {
      query.$or = [
        { id: { $regex: search, $options: "i" } },
        { "shiprocket.awbCode": { $regex: search, $options: "i" } },
      ];
    }

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate("user", "name email phone")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Order.countDocuments(query),
    ]);

    return NextResponse.json({ success: true, orders, total, page, limit });
  } catch (err) {
    console.error("[admin/shipping GET]", err.message);
    return NextResponse.json({ error: "Failed to fetch shipping orders" }, { status: 500 });
  }
}
