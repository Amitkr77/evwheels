import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Wishlist from "@/models/Wishlist";
import { getUserId } from "@/lib/getUserId";

export async function GET(req) {
    const userId = await getUserId(req);

    if (!userId)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const wishlist = await Wishlist.findOne({ user: userId })
        .populate("products");

    return NextResponse.json(wishlist || { products: [] });
}

export async function POST(req) {
    const userId = await getUserId(req);

    if (!userId)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { productId } = await req.json();

    await connectDB();

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
        wishlist = await Wishlist.create({
            user: userId,
            products: [productId],
        });
    } else {
        if (!wishlist.products.includes(productId)) {
            wishlist.products.push(productId);
            await wishlist.save();
        }
    }

    return NextResponse.json(wishlist);
}

export async function DELETE(req) {
    const userId = await getUserId(req);

    if (!userId)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { productId } = await req.json();

    await connectDB();

    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist)
        return NextResponse.json({ error: "Wishlist not found" }, { status: 404 });

    wishlist.products = wishlist.products.filter(
        (id) => id.toString() !== productId
    );

    await wishlist.save();

    return NextResponse.json(wishlist);
}