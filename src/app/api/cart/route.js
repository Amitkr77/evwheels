import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";
import Product from "@/models/Product";

async function getUserId(req) {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id;
  } catch {
    return null;
  }
}

// GET → Get Cart
export async function GET(req) {
  const userId = await getUserId(req);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const cart = await Cart.findOne({ user: userId }).populate("items.product");

  return NextResponse.json({ items: cart?.items || [] });
}

// POST → Add to Cart
export async function POST(req) {
  const userId = await getUserId(req);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId, quantity } = await req.json();

  await connectDB();

  const product = await Product.findById(productId);

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [{ product: productId, quantity }],
    });
  } else {
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
  }

  // return updated cart
  const updatedCart = await Cart.findOne({ user: userId }).populate(
    "items.product"
  );

  return NextResponse.json({ items: updatedCart.items });
}

// PUT → Update Quantity
export async function PUT(req) {
  const userId = await getUserId(req);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId, quantity } = await req.json();

  await connectDB();

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    return NextResponse.json({ error: "Cart not found" }, { status: 404 });
  }

  const item = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (!item) {
    return NextResponse.json({ error: "Item not in cart" }, { status: 404 });
  }

  item.quantity = quantity;

  await cart.save();

  const updatedCart = await Cart.findOne({ user: userId }).populate(
    "items.product"
  );

  return NextResponse.json({ items: updatedCart.items });
}

// DELETE → Remove Item
export async function DELETE(req) {
  const userId = await getUserId(req);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId } = await req.json();

  await connectDB();

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    return NextResponse.json({ error: "Cart not found" }, { status: 404 });
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  );

  await cart.save();

  const updatedCart = await Cart.findOne({ user: userId }).populate(
    "items.product"
  );

  return NextResponse.json({ items: updatedCart.items });
}