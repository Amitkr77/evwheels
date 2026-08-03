import { NextResponse } from "next/server";
import mongoose from "mongoose";
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

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json({ error: "Valid product ID required" }, { status: 400 });
    }

    const ratingNum = Number(rating);
    if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return NextResponse.json({ error: "Rating must be an integer between 1 and 5" }, { status: 400 });
    }

    if (typeof comment !== "string" || !comment.trim() || comment.length > 2000) {
      return NextResponse.json({ error: "Comment is required (max 2000 characters)" }, { status: 400 });
    }

    await connectDB();

    // Check if user purchased the product — a cancelled order doesn't count as a purchase.
    const hasPurchased = await Order.findOne({
      user: userId,
      "items.product": productId,
      orderStatus: { $ne: "CANCELLED" },
    });

    if (!hasPurchased)
      return NextResponse.json(
        { error: "You must purchase before reviewing" },
        { status: 400 }
      );

    const review = await Review.create({
      user: userId,
      product: productId,
      rating: ratingNum,
      comment: comment.trim(),
      status: "Pending",
    });

    return NextResponse.json(review);
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "You have already reviewed this product" },
        { status: 409 }
      );
    }
    console.error("[reviews]", error.message);
    captureServerException(error, { route: "reviews", distinctId: userId });
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("id");

    if (!productId || !mongoose.Types.ObjectId.isValid(productId))
      return NextResponse.json({ error: "Valid product ID required" }, { status: 400 });

    await connectDB();
    const reviews = await Review.find({ product: productId, status: "Approved" })
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .limit(200);

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("[reviews] GET", error.message);
    captureServerException(error, { route: "reviews" });
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}
