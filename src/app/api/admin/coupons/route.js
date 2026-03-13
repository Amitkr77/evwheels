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

// Get all coupons or a specific coupon by id
export async function GET(req) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id) {
    const coupon = await Coupon.findById(id);
    if (!coupon)
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    return NextResponse.json(coupon);
  } else {
    const coupons = await Coupon.find();
    return NextResponse.json(coupons);
  }
}

// Update a coupon by id
export async function PATCH(req) {
  const admin = await verifyAdmin(req);
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Coupon ID is required" }, { status: 400 });
  }

  const body = await req.json();
  await connectDB();

  const updatedCoupon = await Coupon.findByIdAndUpdate(id, body, { new: true });
  if (!updatedCoupon)
    return NextResponse.json({ error: "Coupon not found" }, { status: 404 });

  return NextResponse.json(updatedCoupon);
}

// Delete a coupon by id
export async function DELETE(req) {
  const admin = await verifyAdmin(req);
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Coupon ID is required" }, { status: 400 });
  }

  await connectDB();

  const deletedCoupon = await Coupon.findByIdAndDelete(id);
  if (!deletedCoupon)
    return NextResponse.json({ error: "Coupon not found" }, { status: 404 });

  return NextResponse.json({ message: "Coupon deleted successfully" });
}