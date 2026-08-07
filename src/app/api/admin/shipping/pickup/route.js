/**
 * POST /api/admin/shipping/pickup
 *
 * Schedules a courier pickup for one or more orders.
 *
 * Body: { orderIds: string[] }  — MongoDB _ids
 */

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { verifyAdminStrict } from "@/lib/adminAuth";
import { requestPickup } from "@/lib/shiprocket";

export async function POST(req) {
  try {
    const admin = await verifyAdminStrict(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { orderIds } = await req.json();
    const ids = Array.isArray(orderIds) ? orderIds : [orderIds];

    if (!ids.every((id) => mongoose.Types.ObjectId.isValid(id))) {
      return NextResponse.json({ error: "Invalid order ID(s)" }, { status: 400 });
    }

    await connectDB();

    const orders = await Order.find({ _id: { $in: ids } });
    const withShipment = orders.filter((o) => o.shiprocket?.shipmentId);

    if (withShipment.length === 0) {
      return NextResponse.json({ error: "No orders with Shiprocket shipments found" }, { status: 400 });
    }

    const shipmentIds = withShipment.map((o) => o.shiprocket.shipmentId);
    const result = await requestPickup(shipmentIds);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 502 });
    }

    // Mark pickupStatus = 1 (scheduled)
    await Promise.all(
      withShipment.map((o) => {
        o.shiprocket = { ...o.shiprocket, pickupStatus: 1, shippingStatus: "PICKUP_SCHEDULED" };
        return o.save();
      })
    );

    return NextResponse.json({ success: true, scheduled: withShipment.length });
  } catch (err) {
    console.error("[pickup]", err.message);
    return NextResponse.json({ error: "Failed to schedule pickup" }, { status: 500 });
  }
}
