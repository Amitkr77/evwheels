/**
 * Central type definitions for the PostHog analytics integration.
 *
 * `AnalyticsEventMap` is a discriminated map from event name -> property
 * shape. `analytics.track()` (src/lib/analytics/analytics.ts) is generic
 * over this map, so every call site gets full autocomplete + compile-time
 * checking of both the event name and its required properties. No `any`
 * is used anywhere in this file or the analytics module.
 */

// ─── Shared primitives ──────────────────────────────────────────────────────

export type Currency = "INR";

export type CartMeta = {
  /** Where the cart mutation originated — lets multiple UI call sites share
   * one tracking implementation (see src/store/cartStore.js) while still
   * being distinguishable in PostHog. */
  source?: "pdp" | "buy_now" | "wishlist" | "cart_page" | "unknown";
};

/** Always included on every cart event, per spec. */
export interface CartTotals {
  cart_value: number;
  item_count: number;
}

// ─── User / identify ────────────────────────────────────────────────────────

export interface UserProperties {
  email: string;
  name: string;
  phone?: string | null;
  role: string;
  created_at?: string | null;
}

// ─── Product ────────────────────────────────────────────────────────────────

export interface ProductProperties {
  product_id: string;
  sku?: string;
  slug: string;
  product_name: string;
  category?: string;
  brand: string;
  price: number;
  discounted_price?: number;
  currency: Currency;
  stock: number;
  rating?: number;
}

// ─── Order ──────────────────────────────────────────────────────────────────

export interface OrderProperties {
  order_id: string;
  order_value: number;
  tax: number;
  shipping: number;
  discount: number;
  currency: Currency;
  coupon?: string;
  payment_method: string;
}

// ─── Page view (manual, e.g. profile tab switches) ─────────────────────────

export interface PageViewProperties {
  pathname: string;
  url: string;
  referrer?: string;
  previous_page?: string | null;
  device_type?: "mobile" | "tablet" | "desktop";
  tab?: string;
}

// ─── Per-event property interfaces ──────────────────────────────────────────

export interface SearchPerformedProperties {
  query: string;
  number_of_results: number;
  filters?: Record<string, string | null>;
  sort?: string;
  page?: number;
}

export interface CategoryViewedProperties {
  category_id: string;
  category_name: string;
}

export type AddedToCartProperties = ProductProperties &
  CartMeta &
  CartTotals & { quantity: number };

export type RemovedFromCartProperties = Pick<
  ProductProperties,
  "product_id" | "product_name" | "price"
> &
  CartTotals & { quantity: number };

export type CartUpdatedProperties = Pick<
  ProductProperties,
  "product_id" | "product_name"
> &
  CartTotals & { quantity: number; direction: "increase" | "decrease" };

export type CartClearedProperties = CartTotals;

export interface WishlistProperties {
  product_id: string;
  product_name: string;
}

export interface CheckoutStartedProperties extends CartTotals {
  currency: Currency;
}

export interface ShippingAddressAddedProperties {
  city: string;
  state: string;
  country: string;
}

export interface ShippingMethodSelectedProperties {
  method: string;
}

export interface CouponAppliedProperties {
  coupon: string;
  discount: number;
  currency: Currency;
}

export interface PaymentMethodSelectedProperties {
  method: string;
}

export type CheckoutReviewedProperties = CartTotals & {
  currency: Currency;
};

export type PaymentInitiatedProperties = Pick<
  OrderProperties,
  "order_value" | "currency" | "payment_method"
>;

export type PaymentSuccessfulProperties = OrderProperties;

export interface PaymentFailedProperties {
  error_message: string;
  payment_method?: string;
}

export type OrderCompletedProperties = OrderProperties & {
  item_count: number;
};

export interface OrderCancelledProperties {
  order_id: string;
  reason?: string;
}

export interface ReviewProperties {
  product_id: string;
  review_id?: string;
  rating: number;
}

export interface AuthMethodProperties {
  method: "password" | "google";
}

export interface EmptyProperties {
  [key: string]: never;
}

export interface ProfileUpdatedProperties {
  fields_changed: string[];
}

export interface AddressProperties {
  address_id: string;
  city?: string;
  state?: string;
  field?: string;
}

export interface NotFoundProperties {
  pathname: string;
}

// ─── The event map ──────────────────────────────────────────────────────────

export interface AnalyticsEventMap {
  // Product / category / search
  "Product Viewed": ProductProperties;
  "Search Performed": SearchPerformedProperties;
  "Category Viewed": CategoryViewedProperties;

  // Cart
  "Added to Cart": AddedToCartProperties;
  "Removed from Cart": RemovedFromCartProperties;
  "Cart Updated": CartUpdatedProperties;
  "Cart Cleared": CartClearedProperties;

  // Wishlist
  "Added to Wishlist": WishlistProperties;
  "Removed from Wishlist": WishlistProperties;

  // Checkout funnel
  "Checkout Started": CheckoutStartedProperties;
  "Shipping Address Added": ShippingAddressAddedProperties;
  "Shipping Method Selected": ShippingMethodSelectedProperties;
  "Coupon Applied": CouponAppliedProperties;
  "Payment Method Selected": PaymentMethodSelectedProperties;
  "Checkout Reviewed": CheckoutReviewedProperties;
  "Payment Initiated": PaymentInitiatedProperties;
  "Payment Successful": PaymentSuccessfulProperties;
  "Payment Failed": PaymentFailedProperties;
  "Order Completed": OrderCompletedProperties;
  "Order Cancelled": OrderCancelledProperties;

  // Reviews (types ready; no client UI exists yet to call these — see docs/ANALYTICS.md)
  "Review Submitted": ReviewProperties;
  "Review Updated": ReviewProperties;
  "Review Deleted": Pick<ReviewProperties, "product_id" | "review_id">;

  // Auth
  "User Signed Up": AuthMethodProperties;
  "User Logged In": AuthMethodProperties;
  "User Logged Out": EmptyProperties;
  "Password Reset Requested": EmptyProperties;
  "Password Reset Completed": EmptyProperties;
  "Email Verified": EmptyProperties;

  // Profile
  "Profile Updated": ProfileUpdatedProperties;
  "Address Added": AddressProperties;
  "Address Updated": AddressProperties;
  "Address Deleted": AddressProperties;

  // Errors
  "404 Viewed": NotFoundProperties;
}

export type AnalyticsEventName = keyof AnalyticsEventMap;

// ─── Feature flags ──────────────────────────────────────────────────────────

export interface FeatureFlagResult {
  enabled: boolean;
  variant: string | boolean | undefined;
  payload: unknown;
}
