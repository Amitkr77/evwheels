import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Banner from "@/models/Banner";
import { verifyAdmin, verifyAdminStrict } from "@/lib/adminAuth";
import { captureServerException } from "@/lib/analytics/posthog-server";

// GET /api/admin/banners — list every banner (active + inactive), sorted for editing
export async function GET(req) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const banners = await Banner.find().sort({ displayOrder: 1, createdAt: -1 });
    return NextResponse.json({ success: true, banners });
  } catch (error) {
    console.error("[admin/banners]", error.message);
    captureServerException(error, { route: "admin/banners" });
    return NextResponse.json({ error: "Failed to fetch banners" }, { status: 500 });
  }
}

// POST /api/admin/banners — create a banner
export async function POST(req) {
  try {
    const admin = await verifyAdminStrict(req);
    if (!admin)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();

    if (!body.title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    if (!body.image?.trim()) {
      return NextResponse.json({ error: "Banner image is required" }, { status: 400 });
    }

    await connectDB();

    // New banners default to the end of the current order rather than 0,
    // so they don't silently jump ahead of everything already arranged.
    const count = await Banner.countDocuments();

    const banner = await Banner.create({
      title: body.title.trim(),
      subtitle: body.subtitle?.trim() || "",
      image: body.image.trim(),
      buttonText: body.buttonText?.trim() || "",
      buttonLink: body.buttonLink?.trim() || "",
      displayOrder: body.displayOrder ?? count,
      isActive: body.isActive ?? true,
    });

    return NextResponse.json({ success: true, banner }, { status: 201 });
  } catch (error) {
    console.error("[admin/banners]", error.message);
    captureServerException(error, { route: "admin/banners" });
    return NextResponse.json({ error: "Failed to create banner" }, { status: 500 });
  }
}

// PATCH /api/admin/banners?id=... — update a banner (content, order, or active state)
export async function PATCH(req) {
  try {
    const admin = await verifyAdminStrict(req);
    if (!admin)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Banner ID is required" }, { status: 400 });
    }

    const body = await req.json();
    const updateData = {};

    if (body.title !== undefined) updateData.title = body.title.trim();
    if (body.subtitle !== undefined) updateData.subtitle = body.subtitle.trim();
    if (body.image !== undefined) updateData.image = body.image.trim();
    if (body.buttonText !== undefined) updateData.buttonText = body.buttonText.trim();
    if (body.buttonLink !== undefined) updateData.buttonLink = body.buttonLink.trim();
    if (body.displayOrder !== undefined) updateData.displayOrder = Number(body.displayOrder) || 0;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;

    await connectDB();

    const banner = await Banner.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!banner) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, banner });
  } catch (error) {
    console.error("[admin/banners]", error.message);
    captureServerException(error, { route: "admin/banners" });
    return NextResponse.json({ error: "Failed to update banner" }, { status: 500 });
  }
}

// DELETE /api/admin/banners?id=...
export async function DELETE(req) {
  try {
    const admin = await verifyAdminStrict(req);
    if (!admin)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Banner ID is required" }, { status: 400 });
    }

    await connectDB();

    const banner = await Banner.findByIdAndDelete(id);
    if (!banner) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Banner deleted successfully" });
  } catch (error) {
    console.error("[admin/banners]", error.message);
    captureServerException(error, { route: "admin/banners" });
    return NextResponse.json({ error: "Failed to delete banner" }, { status: 500 });
  }
}
