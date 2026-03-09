import Cart from "@/models/Cart";
import Product from "@/models/Product";
import Coupon from "@/models/Coupon";

// Example tax rate & shipping calculation
const TAX_RATE = 0.08; // 8%
const FLAT_SHIPPING = 10; // flat $10 shipping

export async function getCartSummary(userId, couponCode) {
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart || cart.items.length === 0) return null;

    // 1️⃣ Subtotal
    let subtotal = 0;
    for (const item of cart.items) {
        subtotal += item.product.price * item.quantity;
    }

    // 2️⃣ Discount
    let discount = 0;
    if (couponCode) {
        const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
        if (coupon && coupon.isActive && coupon.expiryDate > new Date()) {
            if (coupon.discountType === "percentage") {
                discount = (subtotal * coupon.discountValue) / 100;
            } else {
                discount = coupon.discountValue;
            }
            // You could add min order amount & usage limit checks here
        }
    }

    // 3️⃣ Tax & Shipping
    const tax = (subtotal - discount) * TAX_RATE;
    const shipping = FLAT_SHIPPING;

    // 4️⃣ Final total
    const total = subtotal - discount + tax + shipping;

    return {
        items: cart.items,
        subtotal,
        discount,
        tax,
        shipping,
        total,
    };
}