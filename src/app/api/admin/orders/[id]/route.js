import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { verifyAdmin } from "@/lib/adminAuth";

const VALID_STATUSES = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

export async function PATCH(req, { params }) {
  const admin = await verifyAdmin(req);
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const orderStatus = body.orderStatus || body.status;
  const note = body.note || "";

  if (!VALID_STATUSES.includes(orderStatus)) {
    return NextResponse.json({ error: "Invalid order status" }, { status: 400 });
  }

  await connectDB();

  const order = await Order.findById(id);
  if (!order)
    return NextResponse.json({ error: "Order not found" }, { status: 404 });

  order.orderStatus = orderStatus;
  order.statusHistory.push({ status: orderStatus, note });
  await order.save();

  return NextResponse.json(order);
}
