import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Wishlist from "@/models/Wishlist";
import Product from "@/models/Product";
import { getUserId } from "@/lib/getUserId";

export async function GET(req) {
  const userId = await getUserId(req);
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  const wishlist = await Wishlist.findOne({ user: userId }).lean();

  const products = (wishlist?.products || []).map((p) => ({
    _id: p.productId,
    title: p.title,
    price: p.price,
    image: p.image,
  }));

  return NextResponse.json({ products });
}

// Toggle: add if not present, remove if present
export async function POST(req) {
  const userId = await getUserId(req);
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId } = await req.json();
  if (!productId)
    return NextResponse.json({ error: "Product ID required" }, { status: 400 });

  await connectDB();

  let wishlist = await Wishlist.findOne({ user: userId });

  if (!wishlist) {
    const product = await Product.findById(productId).select("title price images");
    if (!product)
      return NextResponse.json({ error: "Product not found" }, { status: 404 });

    wishlist = await Wishlist.create({
      user: userId,
      products: [{
        productId: product._id,
        title: product.title,
        price: product.price,
        image: product.images?.[0] || "",
      }],
    });
    return NextResponse.json({ productId, wished: true });
  }

  const index = wishlist.products.findIndex(
    (p) => p.productId.toString() === productId
  );

  if (index > -1) {
    wishlist.products.splice(index, 1);
    await wishlist.save();
    return NextResponse.json({ productId, wished: false });
  }

  const product = await Product.findById(productId).select("title price images");
  if (!product)
    return NextResponse.json({ error: "Product not found" }, { status: 404 });

  wishlist.products.push({
    productId: product._id,
    title: product.title,
    price: product.price,
    image: product.images?.[0] || "",
  });
  await wishlist.save();

  return NextResponse.json({ productId, wished: true });
}
