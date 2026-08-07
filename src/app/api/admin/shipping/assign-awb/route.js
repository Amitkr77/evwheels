/**
 * POST /api/admin/shipping/assign-awb
 *
 * Assigns a courier company to the shipment and stores the AWB code.
 *
 * Body: { orderId: string, courierCompanyId: number }
 */

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { verifyAdminStrict } from "@/lib/adminAuth";
import { assignAWB } from "@/lib/shiprocket";

export async function POST(req) {
  try {
    const admin = await verifyAdminStrict(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { orderId, courierCompanyId, courierName } = await req.json();

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }
    if (!courierCompanyId) {
      return NextResponse.json({ error: "courierCompanyId is required" }, { status: 400 });
    }

    await connectDB();

    const order = await Order.findById(orderId);
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    if (!order.shiprocket?.shipmentId) {
      return NextResponse.json({ error: "Create a Shiprocket shipment first" }, { status: 400 });
    }

    const result = await assignAWB(order.shiprocket.shipmentId, courierCompanyId);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 502 });
    }

    const awb = result.data?.response?.data?.awb_code || result.data?.awb_code || "";
    const tUrl = result.data?.response?.data?.courier_tracking_url || "";

    order.shiprocket = {
      ...order.shiprocket,
      awbCode: awb,
      courierName: courierName || result.data?.response?.data?.courier_name || "",
      courierCompanyId: Number(courierCompanyId),
      trackingUrl: tUrl,
      shippingStatus: "AWB_ASSIGNED",
    };

    await order.save();

    return NextResponse.json({ success: true, awbCode: awb, trackingUrl: tUrl });
  } catch (err) {
    console.error("[assign-awb]", err.message);
    return NextResponse.json({ error: "Failed to assign AWB" }, { status: 500 });
  }
}
