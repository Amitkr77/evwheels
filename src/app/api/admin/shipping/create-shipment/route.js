/**
 * POST /api/admin/shipping/create-shipment
 *
 * Pushes a confirmed EVWheels order to Shiprocket and stores the
 * resulting orderId + shipmentId back on the Order document.
 *
 * Body: { orderId: string }  — MongoDB _id of the Order
 */

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import User from "@/models/User";
import { verifyAdminStrict } from "@/lib/adminAuth";
import { createShiprocketOrder } from "@/lib/shiprocket";

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

    if (order.shiprocket?.orderId) {
      return NextResponse.json(
        { error: "Shiprocket order already exists", shiprocketOrderId: order.shiprocket.orderId },
        { status: 409 }
      );
    }

    const user = await User.findById(order.user).select("email name phone").lean();
    if (!user) return NextResponse.json({ error: "Order user not found" }, { status: 404 });

    const result = await createShiprocketOrder(order, user);

    if (!result.success) {
      console.error("[create-shipment] Shiprocket error:", result.error);
      return NextResponse.json(
        { error: `Shiprocket rejected the order: ${result.error}` },
        { status: 502 }
      );
    }

    const { order_id, shipment_id } = result.data;

    order.shiprocket = {
      ...order.shiprocket,
      orderId: String(order_id),
      shipmentId: String(shipment_id),
      shippingStatus: "NEW",
      pickupStatus: 0,
    };

    await order.save();

    return NextResponse.json({
      success: true,
      shiprocketOrderId: order_id,
      shipmentId: shipment_id,
    });
  } catch (err) {
    console.error("[create-shipment]", err.message);
    return NextResponse.json({ error: "Failed to create Shiprocket shipment" }, { status: 500 });
  }
}
