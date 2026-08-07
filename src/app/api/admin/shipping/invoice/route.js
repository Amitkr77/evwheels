/**
 * POST /api/admin/shipping/invoice
 *
 * Generates an invoice PDF for one or more Shiprocket orders.
 *
 * Body: { orderIds: string[] }  — MongoDB _ids
 */

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { verifyAdminStrict } from "@/lib/adminAuth";
import { generateInvoice } from "@/lib/shiprocket";

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
    const withShiprocket = orders.filter((o) => o.shiprocket?.orderId);

    if (!withShiprocket.length) {
      return NextResponse.json({ error: "No Shiprocket orders found" }, { status: 400 });
    }

    const shiprocketIds = withShiprocket.map((o) => o.shiprocket.orderId);
    const result = await generateInvoice(shiprocketIds);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 502 });
    }

    const invoiceUrl = result.data?.invoice_url || "";

    if (invoiceUrl) {
      await Promise.all(
        withShiprocket.map((o) => {
          o.shiprocket = { ...o.shiprocket, invoiceUrl };
          return o.save();
        })
      );
    }

    return NextResponse.json({ success: true, invoiceUrl });
  } catch (err) {
    console.error("[invoice]", err.message);
    return NextResponse.json({ error: "Failed to generate invoice" }, { status: 500 });
  }
}
