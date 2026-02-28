import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { verifyAdmin } from "@/lib/adminAuth";

// GET ALL ORDERS
export async function GET(req) {
    const admin = await verifyAdmin(req);

    if (!admin)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const filter = status ? { orderStatus: status } : {};

    const orders = await Order.find(filter)
        .populate("user", "name email")
        .sort({ createdAt: -1 });

    return NextResponse.json(orders);
}

// UPDATE ORDER STATUS
export async function PATCH(req, { params }) {
  const { status } = await req.json();

  await connectDB();

  const order = await Order.findById(params.id);

  if (!order)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  order.orderStatus = status;
  order.statusHistory.push({ status });

  await order.save();

  return NextResponse.json(order);
}