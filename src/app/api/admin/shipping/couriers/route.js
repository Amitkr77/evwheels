/**
 * GET /api/admin/shipping/couriers?orderId=<mongo_id>
 *
 * Returns the list of couriers that Shiprocket considers serviceable
 * for the order's shipment. Used in the admin "Assign Courier" dialog.
 */

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { verifyAdminStrict } from "@/lib/adminAuth";
import { getAvailableCouriers } from "@/lib/shiprocket";

export async function GET(req) {
  try {
    const admin = await verifyAdminStrict(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }

    await connectDB();

    const order = await Order.findById(orderId).lean();
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    if (!order.shiprocket?.shipmentId) {
      return NextResponse.json(
        { error: "Shiprocket shipment not yet created for this order" },
        { status: 400 }
      );
    }

    const result = await getAvailableCouriers(order.shiprocket.shipmentId);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 502 });
    }

    const couriers = result.data?.data?.available_courier_companies || [];

    return NextResponse.json({ success: true, couriers });
  } catch (err) {
    console.error("[couriers]", err.message);
    return NextResponse.json({ error: "Failed to fetch couriers" }, { status: 500 });
  }
}
