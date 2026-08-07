/**
 * POST /api/admin/shipping/cancel
 *
 * Cancels the Shiprocket shipment for an order. The EVWheels order itself
 * must be cancelled separately via /api/admin/orders/[id] (which handles
 * inventory reversal). This route only cancels the courier-side shipment.
 *
 * Body: { orderId: string }  — MongoDB _id
 */

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { verifyAdminStrict } from "@/lib/adminAuth";
import { cancelOrders } from "@/lib/shiprocket";

export async function POST(req) {
  try {
    const admin = await verifyAdminStrict(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { orderId } = await req.json();

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }

    await connectDB();

    const order = await Order.findById(orderId);
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    if (!order.shiprocket?.orderId) {
      return NextResponse.json({ error: "No Shiprocket order found for this order" }, { status: 400 });
    }

    const result = await cancelOrders([order.shiprocket.orderId]);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 502 });
    }

    order.shiprocket = {
      ...order.shiprocket,
      shippingStatus: "CANCELLED",
    };

    await order.save();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[shipping/cancel]", err.message);
    return NextResponse.json({ error: "Failed to cancel Shiprocket shipment" }, { status: 500 });
  }
}
