import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Address from "@/models/Address";
import { getUserId } from "@/lib/getUserId"; // or your existing function

export async function GET(req) {
  const userId = await getUserId(req);
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  const addresses = await Address.find({ user: userId }).sort({
    isDefault: -1,
    createdAt: -1,
  });

  return NextResponse.json(addresses);
}

export async function POST(req) {
  const userId = await getUserId(req);
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  await connectDB();

  // If isDefault = true → remove default from others
  if (body.isDefault) {
    await Address.updateMany(
      { user: userId },
      { isDefault: false }
    );
  }

  const address = await Address.create({
    ...body,
    user: userId,
  });

  return NextResponse.json(address);
}