import mongoose from "mongoose";
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

// Helper: fetch and populate the cart, return plain items array
async function getPopulatedItems(userId) {
  const cart = await Cart.findOne({ user: userId })
    .populate("items.product")
    .lean();
  return cart?.items ?? [];
}

// Runs `fn` inside a transaction. Two requests racing on the same cart document
// will conflict inside MongoDB and the loser is retried once against fresh state,
// instead of one silently overwriting the other's change (lost update).
async function withCartTransaction(fn) {
  const session = await mongoose.startSession();
  try {
    for (let attempt = 0; attempt < 2; attempt++) {
      session.startTransaction();
      try {
        const result = await fn(session);
        await session.commitTransaction();
        return result;
      } catch (err) {
        await session.abortTransaction();
        const isTransient =
          err.errorLabels?.includes("TransientTransactionError") && attempt === 0;
        if (!isTransient) throw err;
      }
    }
  } finally {
    session.endSession();
  }
}

// GET → Get Cart
export async function GET(req) {
  const userId = await getUserId(req);
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  return NextResponse.json({ items: await getPopulatedItems(userId) });
}

// POST → Add to Cart (with stock validation)
export async function POST(req) {
  const userId = await getUserId(req);
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId, quantity } = await req.json();
  if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
    return NextResponse.json({ error: "Valid productId is required" }, { status: 400 });
  }
  const numQty = Number(quantity) || 1;
  if (!Number.isInteger(numQty) || numQty <= 0)
    return NextResponse.json({ error: "Quantity must be a positive integer" }, { status: 400 });

  await connectDB();

  try {
    await withCartTransaction(async (session) => {
      const product = await Product.findById(productId).session(session);
      if (!product) throw Object.assign(new Error("Product not found"), { status: 404 });
      if (!product.isActive)
        throw Object.assign(new Error("Product is not available"), { status: 400 });

      const availableStock = product.stock ?? 0;
      if (availableStock < numQty)
        throw Object.assign(new Error(`Only ${availableStock} units available`), { status: 400 });

      const moq = product.moq || 1;

      let cart = await Cart.findOne({ user: userId }).session(session);
      if (!cart) {
        if (numQty < moq)
          throw Object.assign(new Error(`Minimum order quantity is ${moq} units`), { status: 400 });
        cart = new Cart({ user: userId, items: [{ product: productId, quantity: numQty }] });
      } else {
        const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);
        if (itemIndex > -1) {
          const newQty = cart.items[itemIndex].quantity + numQty;
          if (newQty > availableStock)
            throw Object.assign(
              new Error(
                `Only ${availableStock} units available. You already have ${cart.items[itemIndex].quantity} in cart.`
              ),
              { status: 400 }
            );
          cart.items[itemIndex].quantity = newQty;
        } else {
          if (numQty < moq)
            throw Object.assign(new Error(`Minimum order quantity is ${moq} units`), { status: 400 });
          cart.items.push({ product: productId, quantity: numQty });
        }
      }
      await cart.save({ session });
    });
  } catch (error) {
    if (error.status) return NextResponse.json({ error: error.message }, { status: error.status });
    console.error("[cart] POST", error.message);
    return NextResponse.json({ error: "Failed to add item to cart" }, { status: 500 });
  }

  updateCartActivity(userId);

  return NextResponse.json({ items: await getPopulatedItems(userId) });
}

// PUT → Update Quantity
export async function PUT(req) {
  const userId = await getUserId(req);
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId, quantity } = await req.json();
  if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
    return NextResponse.json({ error: "Valid productId is required" }, { status: 400 });
  }
  const numQty = Number(quantity) || 0;
  if (!Number.isInteger(numQty) || numQty <= 0)
    return NextResponse.json({ error: "Quantity must be a positive integer" }, { status: 400 });

  await connectDB();

  try {
    await withCartTransaction(async (session) => {
      const product = await Product.findById(productId).select("stock moq isActive").session(session);
      if (product) {
        if (!product.isActive)
          throw Object.assign(new Error("Product is no longer available"), { status: 400 });
        const availableStock = product.stock ?? 0;
        if (numQty > availableStock)
          throw Object.assign(new Error(`Only ${availableStock} units available`), { status: 400 });
        const moq = product.moq || 1;
        if (numQty < moq)
          throw Object.assign(new Error(`Minimum order quantity is ${moq} units`), { status: 400 });
      }

      const cart = await Cart.findOne({ user: userId }).session(session);
      if (!cart) throw Object.assign(new Error("Cart not found"), { status: 404 });

      const item = cart.items.find((item) => item.product.toString() === productId);
      if (!item) throw Object.assign(new Error("Item not in cart"), { status: 404 });

      item.quantity = numQty;
      await cart.save({ session });
    });
  } catch (error) {
    if (error.status) return NextResponse.json({ error: error.message }, { status: error.status });
    console.error("[cart] PUT", error.message);
    return NextResponse.json({ error: "Failed to update quantity" }, { status: 500 });
  }

  updateCartActivity(userId);

  return NextResponse.json({ items: await getPopulatedItems(userId) });
}

// DELETE → Remove Item
export async function DELETE(req) {
  const userId = await getUserId(req);
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId } = await req.json();
  if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
    return NextResponse.json({ error: "Valid productId is required" }, { status: 400 });
  }

  await connectDB();

  try {
    await withCartTransaction(async (session) => {
      const cart = await Cart.findOne({ user: userId }).session(session);
      if (!cart) throw Object.assign(new Error("Cart not found"), { status: 404 });

      cart.items = cart.items.filter((item) => item.product.toString() !== productId);
      await cart.save({ session });
    });
  } catch (error) {
    if (error.status) return NextResponse.json({ error: error.message }, { status: error.status });
    console.error("[cart] DELETE", error.message);
    return NextResponse.json({ error: "Failed to remove item" }, { status: 500 });
  }

  updateCartActivity(userId);

  return NextResponse.json({ items: await getPopulatedItems(userId) });
}
