import Cart from "@/models/Cart";
import Coupon from "@/models/Coupon";

const TAX_RATE = 0.08;
const FLAT_SHIPPING = 10;

/**
 * @param {string} userId
 * @param {string} [overrideCouponCode] - optional code to try (e.g. from query param preview)
 */
export async function getCartSummary(userId, overrideCouponCode) {
  const cart = await Cart.findOne({ user: userId }).populate("items.product").lean();
  if (!cart || cart.items.length === 0) return null;

  const couponCodeToUse = overrideCouponCode?.trim().toUpperCase() || cart.couponCode || null;

  let subtotal = 0;
  for (const item of cart.items) {
    subtotal += (item.product?.price ?? 0) * item.quantity;
  }

  let discount = 0;
  let appliedCoupon = null;

  if (couponCodeToUse) {
    const coupon = await Coupon.findOne({ code: couponCodeToUse }).lean();
    if (coupon && coupon.isActive && coupon.expiryDate > new Date()) {
      if (subtotal >= (coupon.minOrderAmount || 0)) {
        if (coupon.discountType === "percentage") {
          discount = (subtotal * coupon.discountValue) / 100;
        } else {
          discount = coupon.discountValue;
        }
        discount = Math.min(discount, subtotal);
        appliedCoupon = coupon.code;
      }
    }
  }

  const tax = Math.round((subtotal - discount) * TAX_RATE * 100) / 100;
  const shipping = FLAT_SHIPPING;
  const total = Math.round((subtotal - discount + tax + shipping) * 100) / 100;

  return {
    items: cart.items,
    subtotal,
    discount,
    tax,
    shipping,
    total,
    couponApplied: appliedCoupon,
  };
}
