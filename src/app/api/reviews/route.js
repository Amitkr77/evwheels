import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Review from "@/models/Review";
import Order from "@/models/Order";
import { getUserId } from "@/lib/getUserId";
import { captureServerException } from "@/lib/analytics/posthog-server";

// Create a review
export async function POST(req) {
  const userId = await getUserId(req);
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { productId, rating, comment } = await req.json();
    await connectDB();

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
  } catch (error) {
    console.error("[reviews]", error.message);
    captureServerException(error, { route: "reviews", distinctId: userId });
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("id");

  if (!productId)
    return NextResponse.json({ error: "Product ID required" }, { status: 400 });

  await connectDB();
  const reviews = await Review.find({ product: productId, status: "Approved" })
    .populate("user", "name") 
    .sort({ createdAt: -1 }); 

  return NextResponse.json(reviews);
}