import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Review from "@/models/Review";
import Order from "@/models/Order";
import jwt from "jsonwebtoken";

// Helper to get user ID from JWT
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

// Create a review
export async function POST(req) {
  const userId = await getUserId(req);
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId, rating, comment } = await req.json();
  await connectDB();

  console.log(userId);


  // Check if user purchased product
  const hasPurchased = await Order.findOne({
    user: userId,
    "items.product": productId,
    // orderStatus: "Delivered",
  });

  if (!hasPurchased)
    return NextResponse.json(
      { error: "You must purchase before reviewing" },
      { status: 400 }
    );

  const review = await Review.create({
    user: userId,
    product: productId,
    rating,
    comment,
    status: "Pending",
  });

  return NextResponse.json(review);
}

