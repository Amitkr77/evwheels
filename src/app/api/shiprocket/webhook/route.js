/**
 * POST /api/shiprocket/webhook
 *
 * Receives Shiprocket status-update webhooks, verifies the HMAC-SHA256
 * signature, updates the matching Order document, and syncs the main
 * orderStatus when the shipment reaches a terminal state.
 *
 * Webhook secret is set in SHIPROCKET_WEBHOOK_SECRET env variable.
 * Configure the webhook URL in the Shiprocket dashboard:
 *   Settings → Webhooks → Add URL → https://yourdomain.com/api/shiprocket/webhook
 *
 * Shiprocket sends a JSON body with at minimum:
 *   { awb, current_status, order_id, shipment_id, ... }
 */

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { verifyWebhookSignature } from "@/lib/shiprocket";
import { sendEmail } from "@/lib/email/sendMail";
import { orderStatusUpdateTemplate } from "@/lib/email/templates/orderStatusUpdate";
import User from "@/models/User";

// Map Shiprocket status strings to EVWheels orderStatus enum values.
// Only statuses that should override the local status are listed here.
const SHIPROCKET_TO_ORDER_STATUS = {
  "Delivered": "DELIVERED",
  "DELIVERED": "DELIVERED",
  "RTO Delivered": "CANCELLED",  // Returned to origin
  "Cancelled": "CANCELLED",
  "CANCELLED": "CANCELLED",
  "Shipment Picked Up": "SHIPPED",
  "In Transit": "SHIPPED",
  "Out For Delivery": "SHIPPED",
};

export async function POST(req) {
  try {
    // Read raw body for signature verification
    const rawBody = await req.text();
    const signature = req.headers.get("x-shiprocket-signature") || "";

    // Verify signature if webhook secret is configured
    const secret = process.env.SHIPROCKET_WEBHOOK_SECRET;
    if (secret) {
      const valid = verifyWebhookSignature(rawBody, signature);
      if (!valid) {
        console.warn("[webhook] Invalid Shiprocket signature");
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    }

    let payload;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { awb, current_status, order_id, shipment_id, location, remark } = payload;

    if (!awb && !order_id) {
      // Not an order event we can process
      return NextResponse.json({ success: true, skipped: true });
    }

    await connectDB();

    // Find the matching order by AWB or Shiprocket order ID
    const filter = awb
      ? { "shiprocket.awbCode": awb }
      : { "shiprocket.orderId": String(order_id) };

    const order = await Order.findOne(filter);
    if (!order) {
      // Not our order — acknowledge without error so Shiprocket doesn't retry
      console.warn("[webhook] No matching order for awb=%s orderId=%s", awb, order_id);
      return NextResponse.json({ success: true, skipped: true });
    }

    // Append tracking event
    const trackingEvent = {
      status: current_status || "",
      date: new Date(),
      location: location || "",
      remark: remark || current_status || "",
    };
    order.trackingHistory = [trackingEvent, ...(order.trackingHistory || [])];

    // Update Shiprocket status string
    order.shiprocket = {
      ...order.shiprocket,
      shippingStatus: current_status || order.shiprocket?.shippingStatus,
      syncedAt: new Date(),
    };

    // Sync to main orderStatus for terminal events
    const newOrderStatus = SHIPROCKET_TO_ORDER_STATUS[current_status];
    const TERMINAL = ["DELIVERED", "CANCELLED"];

    if (newOrderStatus && !TERMINAL.includes(order.orderStatus)) {
      const prev = order.orderStatus;
      order.orderStatus = newOrderStatus;
      order.statusHistory.push({ status: newOrderStatus });

      // Fire-and-forget status update email
      User.findById(order.user)
        .select("email name")
        .lean()
        .then((user) => {
          if (!user?.email) return;
          sendEmail({
            to: user.email,
            subject: `Your Order ${order.id} — ${newOrderStatus}`,
            html: orderStatusUpdateTemplate({
              orderId: order.id || order._id.toString(),
              orderDbId: order._id.toString(),
              newStatus: newOrderStatus,
              previousStatus: prev,
              items: order.items || [],
              total: order.totalAmount,
              trackingNote: awb
                ? `AWB: ${awb}${order.shiprocket?.courierName ? ` (${order.shiprocket.courierName})` : ""}${order.shiprocket?.trackingUrl ? ` — Track at ${order.shiprocket.trackingUrl}` : ""}`
                : undefined,
            }),
            type: "order_status_update",
            userId: user._id,
            metadata: { orderId: order.id },
          });
        })
        .catch((e) => console.error("[webhook] email error:", e.message));
    }

    await order.save();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[webhook]", err.message);
    // Always return 200 to prevent Shiprocket from retrying indefinitely
    return NextResponse.json({ success: false, error: err.message });
  }
}
