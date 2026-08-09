/**
 * Admin API for manually managed Instagram posts.
 * GET    — list all posts (ordered by displayOrder asc)
 * POST   — create a post
 * PATCH  — update a post (?id=<id>)
 * DELETE — delete a post (?id=<id>)
 */

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import InstagramPost from "@/models/InstagramPost";
import { verifyAdmin, verifyAdminStrict } from "@/lib/adminAuth";
import { captureServerException } from "@/lib/analytics/posthog-server";

export async function GET(req) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const posts = await InstagramPost.find().sort({ displayOrder: 1, createdAt: 1 });
    return NextResponse.json({ success: true, posts });
  } catch (error) {
    captureServerException(error, { route: "admin/instagram GET" });
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const admin = await verifyAdminStrict(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    if (!body.imageUrl?.trim())
      return NextResponse.json({ error: "imageUrl is required" }, { status: 400 });

    await connectDB();
    const count = await InstagramPost.countDocuments();
    const post = await InstagramPost.create({
      imageUrl:     body.imageUrl.trim(),
      caption:      body.caption?.trim() || "",
      link:         body.link?.trim() || "",
      isActive:     body.isActive ?? true,
      displayOrder: count,
    });
    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (error) {
    captureServerException(error, { route: "admin/instagram POST" });
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const admin = await verifyAdminStrict(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!mongoose.Types.ObjectId.isValid(id))
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const body = await req.json();

    await connectDB();
    const post = await InstagramPost.findByIdAndUpdate(id, { $set: body }, { new: true });
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    return NextResponse.json({ success: true, post });
  } catch (error) {
    captureServerException(error, { route: "admin/instagram PATCH" });
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const admin = await verifyAdminStrict(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!mongoose.Types.ObjectId.isValid(id))
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    await connectDB();
    const post = await InstagramPost.findByIdAndDelete(id);
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (error) {
    captureServerException(error, { route: "admin/instagram DELETE" });
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
