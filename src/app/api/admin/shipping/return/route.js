/**
 * POST /api/admin/shipping/return
 *
 * Creates a Shiprocket return/reverse shipment for a delivered order.
 *
 * Body: { orderId: string, reason?: string }
 */

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import User from "@/models/User";
import { verifyAdminStrict } from "@/lib/adminAuth";
import { createReturnOrder } from "@/lib/shiprocket";

export async function POST(req) {
  try {
    const admin = await verifyAdminStrict(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { orderId, reason } = await req.json();

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }

    await connectDB();

    const order = await Order.findById(orderId);
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    const user = await User.findById(order.user).select("email name phone").lean();
    if (!user) return NextResponse.json({ error: "Order user not found" }, { status: 404 });

    const result = await createReturnOrder(order, user, reason || "Admin initiated return");

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 502 });
    }

    return NextResponse.json({
      success: true,
      returnOrderId: result.data?.order_id,
      shipmentId: result.data?.shipment_id,
    });
  } catch (err) {
    console.error("[shipping/return]", err.message);
    return NextResponse.json({ error: "Failed to create return shipment" }, { status: 500 });
  }
}
