import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getCartSummary } from "@/lib/cartSummary";
import { getUserId } from "@/lib/getUserId";

export async function GET(req) {
  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  const couponCode = req.nextUrl.searchParams.get("coupon");

  const summary = await getCartSummary(userId, couponCode);

  if (!summary) return NextResponse.json({ items: [], subtotal: 0, total: 0 });

  return NextResponse.json(summary);
}