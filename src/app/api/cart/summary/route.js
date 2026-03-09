import { NextResponse } from "next/server";
import { getCartSummary } from "@/lib/cartSummary";
import jwt from "jsonwebtoken";

async function getUserId(req) {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return (decoded).id;
  } catch {
    return null;
  }
}

export async function GET(req) {
  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const couponCode = req.nextUrl.searchParams.get("coupon");

  const summary = await getCartSummary(userId, couponCode);

  if (!summary) return NextResponse.json({ items: [], subtotal: 0, total: 0 });

  return NextResponse.json(summary);
}