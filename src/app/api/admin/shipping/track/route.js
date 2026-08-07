/**
 * GET /api/admin/shipping/track?orderId=<mongo_id>
 *
 * Fetches live tracking events from Shiprocket for the given order,
 * refreshes the stored trackingHistory, and returns the full history.
 */

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { verifyAdminStrict } from "@/lib/adminAuth";
import { trackByAWB } from "@/lib/shiprocket";

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

    const order = await Order.findById(orderId);
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    if (!order.shiprocket?.awbCode) {
      return NextResponse.json(
        { success: true, trackingHistory: order.trackingHistory || [], message: "AWB not assigned yet" }
      );
    }

    const result = await trackByAWB(order.shiprocket.awbCode);

    if (!result.success) {
      // Return cached history even if live fetch fails
      return NextResponse.json({
        success: true,
        trackingHistory: order.trackingHistory || [],
        liveError: result.error,
      });
    }

    // Normalize Shiprocket tracking events
    const rawActivities =
      result.data?.tracking_data?.shipment_track_activities || [];

    const history = rawActivities.map((a) => ({
      status: a["sr-status-label"] || a.activity || "",
      date: a.date ? new Date(a.date) : new Date(),
      location: a.location || "",
      remark: a.activity || "",
    }));

    // Newest events first
    history.sort((a, b) => new Date(b.date) - new Date(a.date));

    const latestStatus =
      result.data?.tracking_data?.shipment_track?.[0]?.current_status || "";

    order.trackingHistory = history;
    order.shiprocket = {
      ...order.shiprocket,
      shippingStatus: latestStatus || order.shiprocket.shippingStatus,
      etd: result.data?.tracking_data?.shipment_track?.[0]?.etd
        ? new Date(result.data.tracking_data.shipment_track[0].etd)
        : order.shiprocket.etd,
      syncedAt: new Date(),
    };

    await order.save();

    return NextResponse.json({
      success: true,
      trackingHistory: history,
      currentStatus: latestStatus,
      etd: order.shiprocket.etd,
    });
  } catch (err) {
    console.error("[shipping/track]", err.message);
    return NextResponse.json({ error: "Failed to fetch tracking info" }, { status: 500 });
  }
}
