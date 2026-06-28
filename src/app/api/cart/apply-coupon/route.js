import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";
import Coupon from "@/models/Coupon";
import { getCartSummary } from "@/lib/cartSummary";
import { getUserId } from "@/lib/getUserId";

export async function POST(req) {
  const userId = await getUserId(req);
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { couponCode } = await req.json();
  if (!couponCode?.trim())
    return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });

  await connectDB();

  try {
    const coupon = await Coupon.findOne({ code: couponCode.trim().toUpperCase() });

    if (!coupon || !coupon.isActive || coupon.expiryDate < new Date()) {
      return NextResponse.json({ error: "Invalid or expired coupon" }, { status: 400 });
    }

    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json({ error: "Coupon usage limit reached" }, { status: 400 });
    }

    // Check minimum order amount
    const previewSummary = await getCartSummary(userId);
    if (!previewSummary) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (coupon.minOrderAmount > 0 && previewSummary.subtotal < coupon.minOrderAmount) {
      return NextResponse.json(
        { error: `Minimum order amount of ₹${coupon.minOrderAmount} required` },
        { status: 400 }
      );
    }

    // Save coupon code on cart
    await Cart.findOneAndUpdate(
      { user: userId },
      { couponCode: coupon.code },
      { new: true }
    );

    // Return updated summary with coupon applied
    const summary = await getCartSummary(userId);
    return NextResponse.json({ message: "Coupon applied successfully", summary });
  } catch (err) {
    console.error("Apply coupon error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// Remove applied coupon
export async function DELETE(req) {
  const userId = await getUserId(req);
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  await Cart.findOneAndUpdate({ user: userId }, { couponCode: null });

  const summary = await getCartSummary(userId);
  return NextResponse.json({ message: "Coupon removed", summary });
}
