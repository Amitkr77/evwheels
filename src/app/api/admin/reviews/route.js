import { verifyAdmin, verifyAdminStrict } from "@/lib/adminAuth";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Review from "@/models/Review";
import { captureServerException } from "@/lib/analytics/posthog-server";

const VALID_STATUSES = ["Pending", "Approved", "Rejected"];

export async function GET(req) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const reviews = await Review.find()
      .populate("user", "name email")
      .populate("product", "title price")
      .sort({ createdAt: -1 })
      .limit(500);

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("[admin/reviews] GET", error.message);
    captureServerException(error, { route: "admin/reviews" });
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

// Approve or reject a review (admin only)
export async function PATCH(req) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const { status } = await req.json();

    if (!id || !mongoose.Types.ObjectId.isValid(id))
      return NextResponse.json({ error: "Valid review ID required" }, { status: 400 });

    if (!VALID_STATUSES.includes(status))
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });

    await connectDB();

    const review = await Review.findById(id);
    if (!review)
      return NextResponse.json({ error: "Review not found" }, { status: 404 });

    review.status = status;
    await review.save();

    return NextResponse.json(review);
  } catch (error) {
    console.error("[admin/reviews] PATCH", error.message);
    captureServerException(error, { route: "admin/reviews" });
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
  }
}

// Delete a review (admin only)
export async function DELETE(req) {
  try {
    const admin = await verifyAdminStrict(req);
    if (!admin)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id || !mongoose.Types.ObjectId.isValid(id))
      return NextResponse.json({ error: "Valid review ID required" }, { status: 400 });

    await connectDB();

    const deletedReview = await Review.findByIdAndDelete(id);
    if (!deletedReview)
      return NextResponse.json({ error: "Review not found" }, { status: 404 });

    return NextResponse.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("[admin/reviews] DELETE", error.message);
    captureServerException(error, { route: "admin/reviews" });
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}
