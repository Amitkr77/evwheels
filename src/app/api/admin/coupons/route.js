import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Coupon from "@/models/Coupon";
import { verifyAdmin } from "@/lib/adminAuth";

export async function POST(req) {
  const admin = await verifyAdmin(req);
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  await connectDB();

  const coupon = await Coupon.create(body);

  return NextResponse.json(coupon);
}