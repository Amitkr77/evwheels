/**
 * POST /api/admin/shipping/label
 *
 * Generates a shipping label PDF for one or more orders and stores the URL.
 *
 * Body: { orderIds: string[] }  — MongoDB _ids
 */

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { verifyAdminStrict } from "@/lib/adminAuth";
import { generateLabel } from "@/lib/shiprocket";

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

    if (!withShipment.length) {
      return NextResponse.json({ error: "No orders with Shiprocket shipments found" }, { status: 400 });
    }

    const shipmentIds = withShipment.map((o) => o.shiprocket.shipmentId);
    const result = await generateLabel(shipmentIds);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 502 });
    }

    const labelUrl = result.data?.label_url || "";

    // Persist the label URL for each order
    if (labelUrl) {
      await Promise.all(
        withShipment.map((o) => {
          o.shiprocket = { ...o.shiprocket, labelUrl };
          return o.save();
        })
      );
    }

    return NextResponse.json({ success: true, labelUrl });
  } catch (err) {
    console.error("[label]", err.message);
    return NextResponse.json({ error: "Failed to generate label" }, { status: 500 });
  }
}
