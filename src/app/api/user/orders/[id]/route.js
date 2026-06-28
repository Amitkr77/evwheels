import { NextResponse } from "next/server";
import Order from "@/models/Order";
import { connectDB } from "@/lib/db";
import { getUserId } from "@/lib/getUserId";

export async function GET(req, { params }) {
  const userId = await getUserId(req);
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  const { id } = await params;

  const order = await Order.findOne({ _id: id, user: userId })
    .populate("items.product")
    .populate("user", "email name");
  if (!order)
    return NextResponse.json({ error: "Order not found" }, { status: 404 });

  return NextResponse.json(order);
}

export async function PATCH(req, { params }) {
  const userId = await getUserId(req);
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  const { id } = await params;

  const order = await Order.findOne({ _id: id, user: userId });
  if (!order)
    return NextResponse.json({ error: "Order not found" }, { status: 404 });

  if (!["PLACED", "CONFIRMED"].includes(order.orderStatus)) {
    return NextResponse.json(
      { error: "Order cannot be cancelled at this stage" },
      { status: 400 }
    );
  }

  order.orderStatus = "CANCELLED";
  order.statusHistory.push({ status: "CANCELLED" });
  await order.save();

  return NextResponse.json({ message: "Order cancelled successfully" });
}
