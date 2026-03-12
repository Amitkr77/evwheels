import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Wishlist from "@/models/Wishlist";
import Product from "@/models/Product";
import { getUserId } from "@/lib/getUserId";


// GET WISHLIST

export async function GET(req) {
    const userId = await getUserId(req);

    if (!userId)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const wishlist = await Wishlist.findOne({ user: userId }).lean();

    // Transform the products array
    const transformedWishlist = {
        ...wishlist,
        products: wishlist?.products.map((p) => ({
            _id: p.productId,  
            title: p.title,
            price: p.price,
            image: p.image
        })) || []
    };

    return NextResponse.json(transformedWishlist);
}

export async function POST(req) {
    const userId = await getUserId(req);
    const { productId } = await req.json();

    await connectDB();

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
        const product = await Product.findById(productId);
        wishlist = await Wishlist.create({
            user: userId,
            products: [{
                productId: product._id,
                title: product.title,
                price: product.price,
                image: product.image,
            }]
        });
        return NextResponse.json({ productId, wished: true });
    }

    const index = wishlist.products.findIndex(
        (p) => p.productId.toString() === productId
    );

    let wished;
    if (index > -1) {
        wishlist.products.splice(index, 1);
        wished = false;
    } else {
        const product = await Product.findById(productId);
        wishlist.products.push({
            productId: product._id,
            title: product.title,
            price: product.price,
            image: product.image,
        });
        wished = true;
    }

    await wishlist.save();

    return NextResponse.json({ productId, wished });
}