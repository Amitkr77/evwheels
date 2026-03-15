import Cart from "@/models/Cart";
import Product from "@/models/Product";
import Coupon from "@/models/Coupon";

// Example tax rate & shipping calculation
const TAX_RATE = 0.08;
const FLAT_SHIPPING = 10;

export async function getCartSummary(userId) {
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart || cart.items.length === 0) return null;

    const appliedCouponCode = cart.couponCode
    // 1️⃣ Subtotal
    let subtotal = 0;
    for (const item of cart.items) {
        subtotal += item.product.price * item.quantity;
    }

    // 2️⃣ Discount
    let discount = 0;

    if (appliedCouponCode) {
        const coupon = await Coupon.findOne({ code: appliedCouponCode.toUpperCase() });
        if (coupon && coupon.isActive && coupon.expiryDate > new Date()) {
            if (coupon.discountType === "percentage") {
                discount = (subtotal * coupon.discountValue) / 100;
            } else {
                discount = coupon.discountValue;
            }

            // Ensure discount does not exceed subtotal
            discount = Math.min(discount, subtotal);
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
        couponApplied: appliedCouponCode || null,
    };
}