import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Cart from "@/models/Cart";
import jwt from "jsonwebtoken";

async function getUserId(req) {
    const token = req.cookies.get("token")?.value;
    if (!token) return null;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded.id;
    } catch {
        return null;
    }
}

export async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end();

    const userId = await getUserId(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    await connectDB();

    try {
        let userCart = await Cart.findOne({ user: userId }).populate("items.product");

        if (!userCart) {
            userCart = new Cart({ user: userId, items: [] });
        }

        const guestItems = req.body.items || [];

        const mergedItems = [...userCart.items];

        guestItems.forEach((guestItem) => {
            const existing = mergedItems.find(
                (item) => item.productId.toString() === guestItem.productId.toString()
            );

            if (existing) {
                existing.quantity += guestItem.quantity;
            } else {
                mergedItems.push(guestItem);
            }
        });

        userCart.items = mergedItems;
        await userCart.save();

        // Populate again if you need product details in the response
        await userCart.populate("items.product");

        res.status(200).json({ items: userCart.items });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}