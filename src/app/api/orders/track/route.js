/**
 * GET /api/orders/track?orderId=<mongo_id>
 *
 * Returns live tracking information for the authenticated user's own order.
 * Pulls fresh data from Shiprocket if the last sync was more than 15 minutes ago.
 */

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { getUserId } from "@/lib/getUserId";
import { trackByAWB } from "@/lib/shiprocket";

const STALE_MS = 15 * 60 * 1000; // 15 minutes

export async function GET(req) {
  try {
    const userId = await getUserId(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }

    await connectDB();

    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    const sr = order.shiprocket || {};

    // If no AWB yet, return whatever we have (may be empty)
    if (!sr.awbCode) {
      return NextResponse.json({
        success: true,
        shiprocket: {
          shippingStatus: sr.shippingStatus || null,
          courierName: sr.courierName || null,
          awbCode: null,
          trackingUrl: null,
          etd: null,
        },
        trackingHistory: [],
        orderStatus: order.orderStatus,
      });
    }

    // Refresh from Shiprocket if stale
    const lastSync = sr.syncedAt ? new Date(sr.syncedAt).getTime() : 0;
    const isStale = Date.now() - lastSync > STALE_MS;

    if (isStale) {
      const result = await trackByAWB(sr.awbCode);
      if (result.success) {
        const rawActivities =
          result.data?.tracking_data?.shipment_track_activities || [];

        const history = rawActivities
          .map((a) => ({
            status: a["sr-status-label"] || a.activity || "",
            date: a.date ? new Date(a.date) : new Date(),
            location: a.location || "",
            remark: a.activity || "",
          }))
          .sort((a, b) => new Date(b.date) - new Date(a.date));

        const latestStatus =
          result.data?.tracking_data?.shipment_track?.[0]?.current_status || "";
        const etd = result.data?.tracking_data?.shipment_track?.[0]?.etd;

        order.trackingHistory = history;
        order.shiprocket = {
          ...order.shiprocket,
          shippingStatus: latestStatus || sr.shippingStatus,
          etd: etd ? new Date(etd) : sr.etd,
          syncedAt: new Date(),
        };

        await order.save();
      }
    }

    return NextResponse.json({
      success: true,
      shiprocket: {
        shippingStatus: order.shiprocket?.shippingStatus || null,
        courierName: order.shiprocket?.courierName || null,
        awbCode: order.shiprocket?.awbCode || null,
        trackingUrl: order.shiprocket?.trackingUrl || null,
        etd: order.shiprocket?.etd || null,
      },
      trackingHistory: order.trackingHistory || [],
      orderStatus: order.orderStatus,
    });
  } catch (err) {
    console.error("[orders/track]", err.message);
    return NextResponse.json({ error: "Failed to fetch tracking info" }, { status: 500 });
  }
}
