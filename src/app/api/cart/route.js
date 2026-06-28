import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import User from "@/models/User";
import { getUserId } from "@/lib/getUserId";

// Helper to update lastCartActivity on user
async function updateCartActivity(userId) {
  try {
    await User.updateOne(
      { _id: userId },
      { $set: { lastCartActivity: new Date() } }
    );
  } catch {
    // Non-critical, ignore errors
  }
}

// GET → Get Cart
export async function GET(req) {
  const userId = await getUserId(req);
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  const cart = await Cart.findOne({ user: userId }).populate("items.product");

  return NextResponse.json({ items: cart?.items || [] });
}

// POST → Add to Cart (with stock validation)
export async function POST(req) {
  const userId = await getUserId(req);
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId, quantity } = await req.json();
  const numQty = Number(quantity) || 1;

  if (numQty <= 0)
    return NextResponse.json({ error: "Quantity must be positive" }, { status: 400 });

  await connectDB();

  const product = await Product.findById(productId);
  if (!product)
    return NextResponse.json({ error: "Product not found" }, { status: 404 });

  if (!product.isActive || product.isArchived)
    return NextResponse.json({ error: "Product is not available" }, { status: 400 });

  // Stock validation
  const availableStock = product.stock ?? 0;
  if (availableStock < numQty)
    return NextResponse.json(
      { error: `Only ${availableStock} units available` },
      { status: 400 }
    );

  const moq = product.moq || 1;

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    if (numQty < moq)
      return NextResponse.json(
        { error: `Minimum order quantity is ${moq} units` },
        { status: 400 }
      );
    cart = await Cart.create({
      user: userId,
      items: [{ product: productId, quantity: numQty }],
    });
  } else {
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      const newQty = cart.items[itemIndex].quantity + numQty;
      if (newQty > availableStock) {
        return NextResponse.json(
          { error: `Only ${availableStock} units available. You already have ${cart.items[itemIndex].quantity} in cart.` },
          { status: 400 }
        );
      }
      cart.items[itemIndex].quantity = newQty;
    } else {
      if (numQty < moq)
        return NextResponse.json(
          { error: `Minimum order quantity is ${moq} units` },
          { status: 400 }
        );
      cart.items.push({ product: productId, quantity: numQty });
    }

    await cart.save();
  }

  await updateCartActivity(userId);

  const updatedCart = await Cart.findOne({ user: userId }).populate("items.product");
  return NextResponse.json({ items: updatedCart.items });
}

// PUT → Update Quantity
export async function PUT(req) {
  const userId = await getUserId(req);
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId, quantity } = await req.json();
  const numQty = Number(quantity) || 0;

  if (numQty <= 0)
    return NextResponse.json({ error: "Quantity must be positive" }, { status: 400 });

  await connectDB();

  const product = await Product.findById(productId);
  if (product) {
    const availableStock = product.stock ?? 0;
    if (numQty > availableStock)
      return NextResponse.json(
        { error: `Only ${availableStock} units available` },
        { status: 400 }
      );
    const moq = product.moq || 1;
    if (numQty < moq)
      return NextResponse.json(
        { error: `Minimum order quantity is ${moq} units` },
        { status: 400 }
      );
  }

  const cart = await Cart.findOne({ user: userId });
  if (!cart)
    return NextResponse.json({ error: "Cart not found" }, { status: 404 });

  const item = cart.items.find(
    (item) => item.product.toString() === productId
  );
  if (!item)
    return NextResponse.json({ error: "Item not in cart" }, { status: 404 });

  item.quantity = numQty;
  await cart.save();

  await updateCartActivity(userId);

  const updatedCart = await Cart.findOne({ user: userId }).populate("items.product");
  return NextResponse.json({ items: updatedCart.items });
}

// DELETE → Remove Item
export async function DELETE(req) {
  const userId = await getUserId(req);
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId } = await req.json();

  await connectDB();

  const cart = await Cart.findOne({ user: userId });
  if (!cart)
    return NextResponse.json({ error: "Cart not found" }, { status: 404 });

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  );
  await cart.save();

  await updateCartActivity(userId);

  const updatedCart = await Cart.findOne({ user: userId }).populate("items.product");
  return NextResponse.json({ items: updatedCart.items });
}
