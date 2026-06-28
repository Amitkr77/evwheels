// app/checkout/page.tsx

"use client";

import Link from "next/link";
import { CreditCard, ShieldCheck, Phone, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cartStore";

export default function CheckoutPage() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Shipping address state – matches required backend format
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });

  // Payment method – controlled by tabs
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const { items, clearCart } = useCartStore();

  const fetchSummary = async () => {
    try {
      const res = await fetch("/api/cart/summary", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load summary");
      const data = await res.json();
      setSummary(data);
    } catch (err) {
      setError(err.message || "Could not load order summary");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [items]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const placeOrder = async () => {
    if (submitting) return;

    // Basic client-side check (expand with proper validation later)
    if (
      !shippingAddress.fullName ||
      !shippingAddress.phone ||
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.postalCode
    ) {
      setError("Please fill in all required shipping fields.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        shippingAddress,
        paymentMethod,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        clearCart();
        window.location.href = `/order-success?id=${data._id}`;
      } else {
        setError(data.error || "Failed to place order. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20">Loading order summary...</div>;
  }

  if (error && !summary) {
    return <div className="text-center py-20 text-red-600">{error}</div>;
  }

  const PAYMENT_METHODS = {
    CARD: "CARD",
    COD: "COD",
  };

  const availableMethods = ["COD"];

  const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

  if (items.length === 0) {
  return (
    <div className="min-h-screen flex items-center justify-center text-center px-6">
      <div>
        <h2 className="text-3xl font-medium mb-4">Your cart is empty</h2>
        <p className="text-neutral-600 mb-8">Add some cycles to proceed to checkout.</p>
        <Link
          href="/cycles"
          className="inline-flex items-center gap-2 px-8 py-4 bg-neutral-900 text-white rounded-full hover:bg-neutral-800"
        >
          Browse Cycles
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}

  return (
    <main className="flex-grow bg-[#fdfcf9] min-h-screen font-['Inter'] pt-20 pb-20">
      <div className="fixed top-0 left-0 w-full h-18 overflow-hidden">
        <div className="absolute inset-0 subtle-gradient"></div>
      </div>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-10 xl:gap-16">
          {/* Left Column: Forms */}
          <div className="lg:col-span-7 flex flex-col gap-12 md:gap-10">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 md:gap-3 text-sm md:text-base font-light text-neutral-600 mt-5">
              <Link
                href="/cart"
                className="hover:text-neutral-900 transition-colors"
              >
                Cart
              </Link>
              <span className="text-neutral-400">/</span>
              <span className="text-neutral-900 font-medium">Checkout</span>
              {/* <span className="text-neutral-400">/</span> */}
            </nav>

            {/* Contact Information */}
            <section>
              <h2 className="text-3xl md:text-4xl font-['Playfair_Display'] font-medium text-neutral-900 mb-8">
                Contact Information
              </h2>
              <div className="space-y-6">
                {/* You can add email back if needed – skipped for now as per payload */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="news"
                    disabled
                    className="w-4 h-4 rounded border-neutral-300 text-emerald-600 focus:ring-emerald-600"
                  />
                  <label
                    htmlFor="news"
                    className="text-sm text-neutral-600 cursor-pointer"
                  >
                    Email me with news and offers
                  </label>
                </div>
              </div>
            </section>

            {/* Shipping Address */}
            <section>
              <h2 className="text-3xl md:text-4xl font-['Playfair_Display'] font-medium text-neutral-900 mb-8">
                Shipping Address
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-neutral-600 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={shippingAddress.fullName}
                    onChange={handleAddressChange}
                    className="w-full px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-neutral-600 mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={shippingAddress.street}
                    onChange={handleAddressChange}
                    placeholder="House no, Building, Street, Area"
                    className="w-full px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-600 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleAddressChange}
                    className="w-full px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-600 mb-2">
                    State *
                  </label>
                  <select
                    name="state"
                    value={shippingAddress.state}
                    onChange={handleAddressChange}
                    className="w-full px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors bg-white"
                    required
                  >
                    <option value="">Select State</option>
                   {INDIAN_STATES.map(s => (
    <option key={s} value={s}>{s}</option>
  ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-600 mb-2">
                    Postal Code (PIN) *
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={shippingAddress.postalCode}
                    onChange={handleAddressChange}
                    className="w-full px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-neutral-600 mb-2">
                    Phone *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      value={shippingAddress.phone}
                      onChange={handleAddressChange}
                      className="w-full pl-12 pr-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors"
                      required
                    />
                    <Phone
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500"
                      size={20}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Delivery Method */}
            {/* <section>
              <h2 className="text-3xl md:text-4xl font-['Playfair_Display'] font-medium text-neutral-900 mb-8">
                Delivery Method
              </h2>

              <div className="space-y-4">
                <label className="relative block cursor-pointer group">
                  <input
                    type="radio"
                    name="delivery"
                    defaultChecked
                    className="peer sr-only"
                  />
                  <div className="p-5 rounded-xl border border-neutral-300 peer-checked:border-emerald-600 bg-white transition-all group-hover:border-emerald-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-5 h-5 rounded-full border-2 border-neutral-300 peer-checked:border-emerald-600 peer-checked:bg-emerald-600 transition-colors flex items-center justify-center">
                          <div className="w-2.5 h-2.5 bg-white rounded-full" />
                        </div>
                        <div>
                          <span className="font-medium text-neutral-900">
                            Standard Shipping
                          </span>
                          <p className="text-sm text-neutral-600">
                            4-6 business days
                          </p>
                        </div>
                      </div>
                      <span className="font-medium text-emerald-800">Free</span>
                    </div>
                  </div>
                </label>

                <label className="relative block cursor-pointer group">
                  <input
                    type="radio"
                    name="delivery"
                    className="peer sr-only"
                  />
                  <div className="p-5 rounded-xl border border-neutral-300 peer-checked:border-emerald-600 bg-white transition-all group-hover:border-emerald-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-5 h-5 rounded-full border-2 border-neutral-300 peer-checked:border-emerald-600 peer-checked:bg-emerald-600 transition-colors flex items-center justify-center">
                          <div className="w-2.5 h-2.5 bg-white rounded-full" />
                        </div>
                        <div>
                          <span className="font-medium text-neutral-900">
                            Express Priority
                          </span>
                          <p className="text-sm text-neutral-600">
                            1-2 business days
                          </p>
                        </div>
                      </div>
                      <span className="font-medium text-neutral-900">₹499</span>
                    </div>
                  </div>
                </label>
              </div>
            </section> */}

            {/* Payment */}

            <section>
              <h2 className="text-3xl md:text-4xl font-['Playfair_Display'] font-medium text-neutral-900 mb-8">
                Payment
              </h2>

              <div className="bg-white border border-neutral-200/70 rounded-xl overflow-hidden">
                {/* Payment Tabs */}
                <div className="grid grid-cols-2 border-b border-neutral-200/70">
                  {/* Credit Card */}
                  <button
                    type="button"
                    disabled={!availableMethods.includes(PAYMENT_METHODS.CARD)}
                    onClick={() => setPaymentMethod(PAYMENT_METHODS.CARD)}
                    className={`flex items-center justify-center gap-2 py-4 text-sm md:text-base font-medium transition-all border-b-2 ${
                      paymentMethod === PAYMENT_METHODS.CARD
                        ? "bg-emerald-50 text-emerald-800 border-emerald-600"
                        : "text-neutral-600 hover:text-neutral-900 border-transparent"
                    }`}
                  >
                    💳 Credit / Debit Card
                  </button>

                  {/* COD */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod(PAYMENT_METHODS.COD)}
                    className={`flex items-center justify-center gap-2 py-4 text-sm md:text-base font-medium transition-all border-b-2 ${
                      paymentMethod === PAYMENT_METHODS.COD
                        ? "bg-emerald-50 text-emerald-800 border-emerald-600"
                        : "text-neutral-600 hover:text-neutral-900 border-transparent"
                    }`}
                  >
                    💵 Cash on Delivery
                  </button>
                </div>

                {/* Payment Content */}
                <div className="p-6 md:p-8">
                  {/* CARD PAYMENT */}
                  {paymentMethod === PAYMENT_METHODS.CARD && (
                    <div className="flex flex-col items-center justify-center py-10 text-center text-neutral-600 space-y-4">
                      <div className="text-4xl">💳</div>

                      <p className="text-lg font-medium text-neutral-800">
                        Card Payments Coming Soon
                      </p>

                      <p className="text-sm text-neutral-500 max-w-sm">
                        Secure payments with Visa, Mastercard and more will be
                        available soon.
                      </p>
                    </div>
                  )}

                  {/* COD PAYMENT */}
                  {paymentMethod === PAYMENT_METHODS.COD && (
                    <div className="flex flex-col items-center text-center space-y-4 py-8">
                      <div className="text-4xl">📦</div>

                      <p className="text-lg font-medium text-neutral-800">
                        Cash on Delivery
                      </p>

                      <p className="text-sm text-neutral-500 max-w-sm">
                        Pay with cash when your order arrives at your doorstep.
                      </p>

                      <div className="text-xs text-neutral-500 bg-neutral-50 px-4 py-2 rounded-lg">
                        Additional COD charges may apply depending on location.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {error && <p className="text-red-600 text-center mt-4">{error}</p>}

            <button
              onClick={placeOrder}
              disabled={submitting || loading}
              className={`w-full py-4 bg-neutral-900 text-white rounded-full text-lg font-medium hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 mt-8 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {submitting ? "Placing Order..." : "Place Order"}
              <ArrowRight size={18} />
            </button>

            <p className="text-center text-sm text-neutral-600 mt-6">
              By placing your order, you agree to our{" "}
              <Link href="#" className="text-emerald-800 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-emerald-800 hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>

          {/* Right Column: Order Summary (Sticky) */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 space-y-8">
              <div className="bg-white border border-neutral-200/70 rounded-xl p-8">
                <h2 className="text-2xl md:text-3xl font-['Playfair_Display'] font-medium mb-8">
                  Order Summary
                </h2>

                {/* Items List */}
                <div className="space-y-8 mb-10">
                  {items.map((item) => {
                    const { product, quantity } = item;
                    return (
                      <div key={product._id}>
                        <div className="flex gap-6">
                          <div className="relative w-20 h-20 shrink-0">
                            <img
                              src={product?.images?.[0] || "/logo.png"}
                              alt={product?.title}
                              className="w-full h-full object-cover rounded-lg border border-neutral-200/60"
                            />
                            <span className="absolute -top-2 -right-2 bg-neutral-900 text-white text-xs font-medium w-6 h-6 rounded-full flex items-center justify-center">
                              {quantity}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h4 className="text-lg font-medium text-neutral-900">
                                {product?.title}
                              </h4>
                              <span className="text-xl font-medium text-emerald-800">
                                ₹{product.price.toLocaleString()}
                              </span>
                            </div>
                            {product.colors?.length > 0 && (
                              <p className="text-sm text-neutral-600 mt-1">
                                {product.colors[0]}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <hr className="border-dashed border-neutral-200/60 my-8" />

                {/* Totals */}
                <div className="space-y-4 text-neutral-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-neutral-900 font-medium">
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                      }).format(summary?.subtotal || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1.5">
                      Shipping
                      <span
                        className="text-neutral-500 cursor-help"
                        title="Calculated at next step"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </span>
                    </span>
                    <span className="text-emerald-800 font-medium">
                      {summary?.shipping === 0
                        ? "Free"
                        : new Intl.NumberFormat("en-IN", {
                            style: "currency",
                            currency: "INR",
                          }).format(summary?.shipping || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Tax</span>
                    <span className="text-neutral-900 font-medium">
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                      }).format(summary?.tax || 0)}
                    </span>
                  </div>
                  {summary?.discount > 0 && (
                    <div className="flex justify-between text-neutral-600">
                      <span>Discount</span>
                      <span className="text-emerald-700 font-medium">
                        -
                        {new Intl.NumberFormat("en-IN", {
                          style: "currency",
                          currency: "INR",
                        }).format(summary?.discount)}
                      </span>
                    </div>
                  )}
                </div>

                <hr className="border-neutral-200/60 my-8" />

                <div className="flex justify-between items-end">
                  <span className="text-xl font-medium text-neutral-900">
                    Total
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-sm text-neutral-600">INR</span>
                    <span className="text-3xl md:text-4xl font-['Playfair_Display'] font-medium text-emerald-800">
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                      }).format(summary?.total || 0)}{" "}
                    </span>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex justify-center gap-6 md:gap-10 text-neutral-500">
                <div className="flex flex-col items-center text-center gap-2">
                  <ShieldCheck
                    size={24}
                    className="text-emerald-800"
                    strokeWidth={1.5}
                  />
                  <span className="text-xs font-light">2 Year Warranty</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <svg
                    className="w-6 h-6 text-emerald-800"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span className="text-xs font-light">30-Day Returns</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <svg
                    className="w-6 h-6 text-emerald-800"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                    />
                  </svg>
                  <span className="text-xs font-light">24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
