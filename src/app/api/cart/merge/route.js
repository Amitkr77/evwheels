import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import { getUserId } from "@/lib/getUserId";

export async function POST(req) {
  const userId = await getUserId(req);
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { items: guestItems = [] } = await req.json();

  await connectDB();

  try {
    let userCart = await Cart.findOne({ user: userId });

    if (!userCart) {
      userCart = new Cart({ user: userId, items: [] });
    }

    for (const guestItem of guestItems) {
      const productId = guestItem.productId || guestItem.product?._id;
      if (!productId) continue;

      const product = await Product.findById(productId).lean();
      if (!product || !product.isActive) continue;

      const existingIndex = userCart.items.findIndex(
        (item) => item.product.toString() === productId.toString()
      );

      if (existingIndex > -1) {
        const newQty = userCart.items[existingIndex].quantity + (guestItem.quantity || 1);
        userCart.items[existingIndex].quantity = Math.min(newQty, product.stock ?? 999);
      } else {
        userCart.items.push({
          product: productId,
          quantity: Math.min(guestItem.quantity || 1, product.stock ?? 999),
        });
      }
    }

    await userCart.save();
    await userCart.populate("items.product");

    return NextResponse.json({ items: userCart.items });
  } catch (err) {
    console.error("Cart merge error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
