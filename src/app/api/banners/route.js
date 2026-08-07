import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Banner from "@/models/Banner";
import { captureServerException } from "@/lib/analytics/posthog-server";

// Banner content changes rarely relative to read volume — cache for an hour.
export const revalidate = 3600;

// GET /api/banners — active promotional banners, for the storefront
export async function GET() {
  try {
    await connectDB();

    const banners = await Banner.find({ isActive: true })
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, banners });
  } catch (error) {
    console.error("[banners]", error.message);
    captureServerException(error, { route: "banners" });
    return NextResponse.json({ error: "Failed to fetch banners" }, { status: 500 });
  }
}
