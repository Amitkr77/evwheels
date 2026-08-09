/**
 * GET /api/instagram-posts
 * Public endpoint — returns active Instagram posts ordered by displayOrder.
 */

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import InstagramPost from "@/models/InstagramPost";

export async function GET() {
  try {
    await connectDB();
    const posts = await InstagramPost.find({ isActive: true })
      .sort({ displayOrder: 1, createdAt: 1 })
      .select("imageUrl caption link")
      .limit(12);
    return NextResponse.json({ success: true, posts });
  } catch (error) {
    console.error("[instagram-posts]", error.message);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}
