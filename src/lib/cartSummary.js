import Cart from "@/models/Cart";
import Coupon from "@/models/Coupon";
import Product from "@/models/Product";

const TAX_RATE = 0.08;
const FLAT_SHIPPING = 10;

/**
 * @param {string} userId
 * @param {string} [overrideCouponCode] - optional code to try (e.g. from query param preview)
 * @param {{productId: string, quantity: number}[]} [overrideItems] - when provided, the summary
 *   is computed for just these items instead of the user's persisted cart. Used by the "Buy Now"
 *   single-item checkout flow so it never reads or mutates the shared cart.
 */
export async function getCartSummary(userId, overrideCouponCode, overrideItems) {
  let items;
  let cartCouponCode = null;

  if (overrideItems?.length) {
    const products = await Product.find({
      _id: { $in: overrideItems.map((i) => i.productId) },
    }).lean();
    const productMap = Object.fromEntries(products.map((p) => [p._id.toString(), p]));

    items = overrideItems
      .filter((i) => productMap[i.productId])
      .map((i) => ({ product: productMap[i.productId], quantity: i.quantity }));

    if (items.length === 0) return null;
  } else {
    const cart = await Cart.findOne({ user: userId }).populate("items.product").lean();
    if (!cart || cart.items.length === 0) return null;

    // A referenced product may have since been deleted (populate() returns null) —
    // drop those items rather than silently pricing them at 0 while still occupying a slot.
    items = cart.items.filter((item) => item.product);
    if (items.length === 0) return null;

    cartCouponCode = cart.couponCode;
  }

  const couponCodeToUse = overrideCouponCode?.trim().toUpperCase() || cartCouponCode || null;

  let subtotal = 0;
  for (const item of items) {
    subtotal += item.product.price * item.quantity;
  }

  let discount = 0;
  let appliedCoupon = null;
  let appliedCouponId = null;

  if (couponCodeToUse) {
    const coupon = await Coupon.findOne({ code: couponCodeToUse }).lean();
    const withinUsageLimit = !coupon?.usageLimit || coupon.usedCount < coupon.usageLimit;
    if (coupon && coupon.isActive && coupon.expiryDate > new Date() && withinUsageLimit) {
      if (subtotal >= (coupon.minOrderAmount || 0)) {
        if (coupon.discountType === "percentage") {
          discount = (subtotal * coupon.discountValue) / 100;
        } else {
          discount = coupon.discountValue;
        }
        discount = Math.max(0, Math.min(discount, subtotal));
        appliedCoupon = coupon.code;
        appliedCouponId = coupon._id;
      }
    }
  }

  const tax = Math.round((subtotal - discount) * TAX_RATE * 100) / 100;
  const shipping = FLAT_SHIPPING;
  const total = Math.round((subtotal - discount + tax + shipping) * 100) / 100;

  return {
    items,
    subtotal,
    discount,
    tax,
    shipping,
    total,
    couponApplied: appliedCoupon,
    couponId: appliedCouponId,
  };
}
