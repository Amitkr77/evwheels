import { verifyAdmin } from "@/lib/adminAuth"; // assume you have this helper
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Review from "@/models/Review";

export async function GET(req) {
    const admin = await verifyAdmin(req);
    if (!admin)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const reviews = await Review.find()
        .populate("user", "name email")
        .populate("product", "name price");

    return NextResponse.json(reviews);
}


// Approve or reject a review (admin only)
export async function PATCH(req) {
    const admin = await verifyAdmin(req);
    if (!admin)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const { status } = await req.json(); 

    if (!id)
        return NextResponse.json({ error: "Review ID required" }, { status: 400 });

    await connectDB();

    const review = await Review.findById(id);
    if (!review)
        return NextResponse.json({ error: "Review not found" }, { status: 404 });

    review.status = status;
    await review.save();

    return NextResponse.json(review);
}

// Delete a review (admin only)
export async function DELETE(req) {
    const admin = await verifyAdmin(req);
    if (!admin)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id)
        return NextResponse.json({ error: "Review ID required" }, { status: 400 });

    await connectDB();

    const deletedReview = await Review.findByIdAndDelete(id);
    if (!deletedReview)
        return NextResponse.json({ error: "Review not found" }, { status: 404 });

    return NextResponse.json({ message: "Review deleted successfully" });
}
