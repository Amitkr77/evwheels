"use client";

import Link from "next/link";
import Image from "next/image";
import { Suspense, useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { ShieldCheck, ChevronRight, MapPin, Plus, CheckCircle2, ArrowLeft } from "lucide-react";
import { analytics } from "@/lib/analytics";

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
  "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh",
  "Uttarakhand","West Bengal","Andaman and Nicobar Islands","Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu","Delhi","Jammu and Kashmir",
  "Ladakh","Lakshadweep","Puducherry",
];

const EMPTY_ADDR = { fullName: "", phone: "", street: "", city: "", state: "", postalCode: "", country: "India" };

const fmt = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

function Field({ label, id, children, span2 }) {
  return (
    <div className={span2 ? "sm:col-span-2" : ""}>
      <label htmlFor={id} className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const PHONE_REGEX = /^\+?\d{9,15}$/;
const PIN_REGEX = /^\d{6}$/;

const inputCls = "w-full px-4 py-3 text-sm border border-neutral-200 rounded-xl bg-white focus:outline-none focus:border-[#19B5D8] focus:ring-2 focus:ring-[#19B5D8]/10 transition-colors placeholder:text-neutral-300";
const selectCls = `${inputCls} appearance-none cursor-pointer`;

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-neutral-50 pt-24 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-neutral-200 border-t-[#19B5D8] rounded-full animate-spin" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  // "Buy Now" is an isolated single-item checkout — arrives via query params and
  // must never read from or clear the shared cart.
  const buyNowProductId = searchParams.get("buyNow");
  const buyNowQty = parseInt(searchParams.get("qty"), 10) || 1;
  const isBuyNow = Boolean(buyNowProductId);

  // Hydration guard — prevents "0 items" flash before Zustand loads
  const [mounted, setMounted] = useState(false);
  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // What to actually show/order: the Buy Now product (from the summary override)
  // or the real cart, depending on how checkout was reached.
  const displayItems = (isBuyNow ? (summary?.items || []) : items).filter((i) => i.product);

  // Saved addresses
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showForm, setShowForm] = useState(true);

  const [addr, setAddr] = useState(EMPTY_ADDR);
  const [paymentMethod] = useState("COD");

  useEffect(() => { setMounted(true); }, []);

  // Fetch cart summary (or the Buy Now single-item summary)
  useEffect(() => {
    if (!mounted) return;
    setSummaryLoading(true);
    const qs = isBuyNow ? `?buyNow=${buyNowProductId}&qty=${buyNowQty}` : "";
    fetch(`/api/cart/summary${qs}`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setSummary(d))
      .catch(() => {})
      .finally(() => setSummaryLoading(false));
  }, [mounted, isBuyNow, buyNowProductId, buyNowQty]);

  // Checkout Started — fires once per real checkout visit with items to order
  const checkoutStartedTracked = useRef(false);
  useEffect(() => {
    if (!mounted || displayItems.length === 0 || checkoutStartedTracked.current) return;
    checkoutStartedTracked.current = true;
    analytics.track("Checkout Started", {
      cart_value: displayItems.reduce((sum, i) => sum + (i.product?.price || 0) * i.quantity, 0),
      item_count: displayItems.reduce((sum, i) => sum + i.quantity, 0),
      currency: "INR",
    });
  }, [mounted, displayItems]);

  // Fetch saved addresses if logged in
  useEffect(() => {
    if (!isAuthenticated) return;
    fetch("/api/user/addresses", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setSavedAddresses(data);
          setShowForm(false);
          // Pre-select default or first
          const def = data.find((a) => a.isDefault) || data[0];
          selectSavedAddress(def);
        }
      })
      .catch(() => {});
  }, [isAuthenticated]);

  function selectSavedAddress(a) {
    setSelectedAddressId(a._id);
    setAddr({
      fullName: a.fullName || "",
      phone: a.phone || "",
      street: a.addressLine || "",  // addressLine → street
      city: a.city || "",
      state: a.state || "",
      postalCode: a.postalCode || "",
      country: a.country || "India",
    });
    setShowForm(false);
  }

  const handleAddrChange = (e) => {
    const { name, value } = e.target;
    setAddr((prev) => ({ ...prev, [name]: value }));
  };

  const valid = addr.fullName && addr.phone && addr.street && addr.city && addr.state && addr.postalCode;

  const getAddressError = () => {
    if (!valid) return "Please fill in all shipping fields.";
    if (!PHONE_REGEX.test(addr.phone.trim())) return "Please enter a valid phone number.";
    if (!PIN_REGEX.test(addr.postalCode.trim())) return "PIN code must be 6 digits.";
    return null;
  };

  const placeOrder = async () => {
    const addressError = getAddressError();
    if (submitting || addressError) { if (addressError) setError(addressError); return; }
    setSubmitting(true);
    setError(null);

    // The checkout form is a single page (no multi-step wizard, no shipping-
    // method selector, no payment gateway yet — COD only), so these funnel
    // steps are all fired together at the point the user commits to
    // submitting, rather than at separate UI interactions that don't exist.
    // Shipping Method Selected/Payment Method Selected use placeholder
    // values ready to move to real onChange handlers once those UIs exist.
    analytics.track("Shipping Address Added", {
      city: addr.city,
      state: addr.state,
      country: addr.country,
    });
    analytics.track("Shipping Method Selected", { method: "Standard" });
    analytics.track("Payment Method Selected", { method: paymentMethod });
    analytics.track("Checkout Reviewed", {
      cart_value: summary?.total || 0,
      item_count: displayItems.length,
      currency: "INR",
    });
    analytics.track("Payment Initiated", {
      order_value: summary?.total || 0,
      currency: "INR",
      payment_method: paymentMethod,
    });

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          shippingAddress: addr,
          paymentMethod,
          buyNow: isBuyNow ? { productId: buyNowProductId, quantity: buyNowQty } : undefined,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        const order = data.order;
        const orderProperties = {
          order_id: order._id,
          order_value: order.totalAmount,
          tax: order.taxAmount || 0,
          shipping: order.shippingAmount || 0,
          discount: order.discountAmount || 0,
          currency: "INR",
          payment_method: order.paymentMethod,
        };
        analytics.track("Payment Successful", orderProperties);
        analytics.track("Order Completed", {
          ...orderProperties,
          item_count: displayItems.length,
        });
        // Buy Now never touched the shared cart, so there's nothing to clear.
        if (!isBuyNow) clearCart();
        router.push(`/order-success?id=${order._id}`);
      } else {
        analytics.track("Payment Failed", {
          error_message: data.error || "Failed to place order.",
          payment_method: paymentMethod,
        });
        analytics.captureException(new Error(data.error || "Order placement failed"), {
          page: "checkout",
        });
        setError(data.error || "Failed to place order.");
      }
    } catch (err) {
      analytics.track("Payment Failed", {
        error_message: "Network error",
        payment_method: paymentMethod,
      });
      analytics.captureException(err, { page: "checkout" });
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Show skeleton while Zustand hydrates, or while the Buy Now summary is loading
  // (its item list only exists once that fetch resolves, unlike the cart's)
  if (!mounted || (isBuyNow && summaryLoading)) {
    return (
      <div className="min-h-screen bg-neutral-50 pt-24 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-neutral-200 border-t-[#19B5D8] rounded-full animate-spin" />
      </div>
    );
  }

  if (displayItems.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50 pt-24 flex flex-col items-center justify-center text-center px-6 gap-4">
        <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mb-2">
          <ShieldCheck size={28} className="text-neutral-300" />
        </div>
        <h2 className="text-2xl font-bold text-neutral-900">
          {isBuyNow ? "Product not found" : "Your cart is empty"}
        </h2>
        <p className="text-neutral-500 text-sm max-w-xs">
          {isBuyNow
            ? "This product is no longer available."
            : "Add some products before proceeding to checkout."}
        </p>
        <Link href="/shop" className="mt-2 inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-full text-sm font-semibold hover:bg-neutral-800 transition-colors">
          <ArrowLeft size={15} /> Browse Products
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50 pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-12">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-neutral-400 mt-6 mb-8">
          <Link href="/cart" className="hover:text-neutral-700 transition-colors flex items-center gap-1">
            <ArrowLeft size={12} /> Cart
          </Link>
          <ChevronRight size={11} />
          <span className="text-neutral-700 font-medium">Checkout</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">

          {/* ── Left: Shipping + Payment ── */}
          <div className="flex-1 space-y-5">

            {/* Saved addresses */}
            {savedAddresses.length > 0 && (
              <div className="bg-white border border-neutral-100 rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin size={15} className="text-[#19B5D8]" />
                    <span className="text-sm font-semibold text-neutral-900">Saved Addresses</span>
                  </div>
                  <button
                    onClick={() => { setShowForm(true); setSelectedAddressId(null); setAddr(EMPTY_ADDR); }}
                    className="flex items-center gap-1 text-xs text-[#19B5D8] font-medium hover:underline"
                  >
                    <Plus size={12} /> New address
                  </button>
                </div>
                <div className="p-4 grid sm:grid-cols-2 gap-3">
                  {savedAddresses.map((a) => (
                    <button
                      key={a._id}
                      onClick={() => selectSavedAddress(a)}
                      className={`relative text-left p-4 rounded-xl border-2 transition-all ${
                        selectedAddressId === a._id
                          ? "border-[#19B5D8] bg-[#DDF8FD]/20"
                          : "border-neutral-100 hover:border-neutral-200 bg-white"
                      }`}
                    >
                      {selectedAddressId === a._id && (
                        <CheckCircle2 size={15} className="absolute top-3 right-3 text-[#19B5D8]" />
                      )}
                      {a.isDefault && (
                        <span className="text-[9px] font-semibold uppercase tracking-wide text-[#19B5D8] bg-[#DDF8FD] px-2 py-0.5 rounded-full mb-1.5 inline-block">
                          Default
                        </span>
                      )}
                      <p className="text-sm font-semibold text-neutral-900">{a.fullName}</p>
                      <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">
                        {a.addressLine}, {a.city}, {a.state} {a.postalCode}
                      </p>
                      <p className="text-xs text-neutral-400 mt-0.5">{a.phone}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Address form */}
            {(showForm || savedAddresses.length === 0) && (
              <div className="bg-white border border-neutral-100 rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-neutral-100 flex items-center gap-2">
                  <MapPin size={15} className="text-[#19B5D8]" />
                  <span className="text-sm font-semibold text-neutral-900">
                    {savedAddresses.length > 0 ? "New Shipping Address" : "Shipping Address"}
                  </span>
                </div>
                <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Full Name *" id="fullName" span2>
                    <input id="fullName" name="fullName" value={addr.fullName} onChange={handleAddrChange} className={inputCls} placeholder="e.g. Rahul Kumar" />
                  </Field>
                  <Field label="Phone *" id="phone" span2>
                    <input id="phone" name="phone" value={addr.phone} onChange={handleAddrChange} type="tel" className={inputCls} placeholder="+91 98765 43210" />
                  </Field>
                  <Field label="Street Address *" id="street" span2>
                    <input id="street" name="street" value={addr.street} onChange={handleAddrChange} className={inputCls} placeholder="House no., street, area" />
                  </Field>
                  <Field label="City *" id="city">
                    <input id="city" name="city" value={addr.city} onChange={handleAddrChange} className={inputCls} placeholder="Patna" />
                  </Field>
                  <Field label="PIN Code *" id="postalCode">
                    <input id="postalCode" name="postalCode" value={addr.postalCode} onChange={handleAddrChange} className={inputCls} placeholder="800001" maxLength={6} inputMode="numeric" />
                  </Field>
                  <Field label="State *" id="state" span2>
                    <select id="state" name="state" value={addr.state} onChange={handleAddrChange} className={selectCls}>
                      <option value="">Select State</option>
                      {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </Field>
                </div>
              </div>
            )}

            {/* Payment */}
            <div className="bg-white border border-neutral-100 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-neutral-100">
                <span className="text-sm font-semibold text-neutral-900">Payment Method</span>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-3 p-4 rounded-xl border-2 border-[#19B5D8] bg-[#DDF8FD]/20">
                  <div className="w-4 h-4 rounded-full border-2 border-[#19B5D8] flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 rounded-full bg-[#19B5D8]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">Cash on Delivery</p>
                    <p className="text-xs text-neutral-500 mt-0.5">Pay when your order arrives at your doorstep</p>
                  </div>
                </div>
                <p className="text-xs text-neutral-400 mt-3 text-center">Online payment coming soon</p>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div role="alert" className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* Place order button */}
            <button
              onClick={placeOrder}
              disabled={submitting || summaryLoading}
              className="w-full py-4 bg-neutral-900 text-white rounded-2xl text-sm font-semibold hover:bg-neutral-800 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Placing order…
                </>
              ) : (
                <>
                  Place Order · {fmt(summary?.total)}
                </>
              )}
            </button>

            <p className="text-center text-xs text-neutral-400">
              By placing your order you agree to our{" "}
              <Link href="/terms" className="underline hover:text-neutral-600">Terms of Service</Link>
              {" "}and{" "}
              <Link href="/privacy-policy" className="underline hover:text-neutral-600">Privacy Policy</Link>
            </p>
          </div>

          {/* ── Right: Order summary (sticky) ── */}
          <div className="w-full lg:w-[360px] shrink-0">
            <div className="sticky top-24 bg-white border border-neutral-100 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-neutral-100">
                <span className="text-sm font-semibold text-neutral-900">
                  Order Summary ({displayItems.length} item{displayItems.length !== 1 ? "s" : ""})
                </span>
              </div>

              {/* Items */}
              <div className="p-5 space-y-4 max-h-72 overflow-y-auto">
                {displayItems.map(({ product, quantity }) => (
                  <div key={product._id} className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl border border-neutral-100 bg-neutral-50 shrink-0 relative overflow-hidden">
                      <Image
                        src={product.images?.[0] || "/logo.png"}
                        alt={product.title || "Product"}
                        fill
                        sizes="56px"
                        className="object-contain p-1"
                      />
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-neutral-900 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                        {quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-neutral-800 line-clamp-2 leading-snug">{product.title}</p>
                    </div>
                    <p className="text-sm font-bold text-neutral-900 shrink-0">
                      {fmt(product.price * quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="px-5 pb-5 space-y-3 border-t border-neutral-100 pt-4">
                {summaryLoading ? (
                  <div className="space-y-2 animate-pulse">
                    <div className="h-3 bg-neutral-100 rounded w-full" />
                    <div className="h-3 bg-neutral-100 rounded w-2/3" />
                    <div className="h-4 bg-neutral-100 rounded w-1/2 mt-2" />
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between text-sm text-neutral-500">
                      <span>Subtotal</span>
                      <span className="text-neutral-800 font-medium">{fmt(summary?.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-neutral-500">
                      <span>Shipping</span>
                      <span className={summary?.shipping === 0 ? "text-emerald-600 font-medium" : "text-neutral-800 font-medium"}>
                        {summary?.shipping === 0 ? "Free" : fmt(summary?.shipping)}
                      </span>
                    </div>
                    {summary?.tax > 0 && (
                      <div className="flex justify-between text-sm text-neutral-500">
                        <span>Tax</span>
                        <span className="text-neutral-800 font-medium">{fmt(summary?.tax)}</span>
                      </div>
                    )}
                    {summary?.discount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-emerald-600">Discount</span>
                        <span className="text-emerald-600 font-medium">−{fmt(summary?.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-3 border-t border-neutral-100">
                      <span className="text-sm font-semibold text-neutral-900">Total</span>
                      <span className="text-xl font-bold text-neutral-900">{fmt(summary?.total)}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Trust strip */}
              <div className="px-5 pb-5 flex items-center justify-center gap-5 text-xs text-neutral-400">
                <span className="flex items-center gap-1"><ShieldCheck size={13} className="text-[#19B5D8]" /> Secure checkout</span>
                <span className="flex items-center gap-1">✓ COD available</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
