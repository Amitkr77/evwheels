import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { getUserId } from "@/lib/getUserId";

export async function GET(req) {
  const userId = await getUserId(req);

  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  const orders = await Order.find({ user: userId })
    .sort({ createdAt: -1 });

  return NextResponse.json(orders);
}