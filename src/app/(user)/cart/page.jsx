// app/cart/page.tsx

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Trash2,
  Plus,
  Minus,
  Lock,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";

export default function CartPage() {
  const { items, removeFromCart } = useCartStore();

  const [summary, setSummary] = useState(null);
  const [coupon, setCoupon] = useState("");

  const fetchSummary = async (couponCode) => {
    const url = couponCode
      ? `/api/cart/summary?coupon=${couponCode}`
      : `/api/cart/summary`;

    const res = await fetch(url, { credentials: "include" });
    const data = await res.json();

    setSummary(data);
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const applyCoupon = async () => {
    await fetchSummary(coupon);
  };

  return (
    <main className="flex-grow bg-[#fdfcf9] min-h-screen font-['Inter'] pt-24 pb-20">
      {/* <div className="fixed top-0 left-0 w-full h-20 bg-gradient-to-r from-emerald-700 via-emerald-500 to-emerald-300 z-20" />{" "} */}
      <div className="fixed top-0 left-0 w-full h-18 overflow-hidden">
        <div className="absolute inset-0 subtle-gradient"></div>
      </div>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-10 border-b border-neutral-200/70 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-medium text-neutral-900 mb-2">
              Your Shopping Cart
            </h1>
            <p className="text-lg text-neutral-600 font-light">
              You have {items.length} items in your cart
            </p>
          </div>

          <Link
            href="/cycles"
            className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 font-medium transition-colors"
          >
            <ArrowLeft size={18} />
            Continue Shopping
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* Left: Cart Items */}
          <div className="flex-1 flex flex-col gap-8">
            {/* Free Shipping Alert */}
            <div className="flex items-center gap-3 p-5 bg-emerald-50/60 border border-emerald-100 rounded-xl text-sm text-neutral-700">
              <span className="text-emerald-800">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </span>
              <span className="font-medium">
                You've qualified for{" "}
                <span className="text-emerald-800 font-semibold">
                  Free Shipping
                </span>{" "}
                on this order!
              </span>
            </div>

            {items.map((item) => {
              const { product, quantity } = item;

              return (
                <div
                  key={product._id}
                  className="bg-white border border-neutral-200/70 rounded-xl p-6 hover:border-emerald-200/60 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="relative shrink-0 w-full sm:w-32 h-32">
                      <img
                        src={product?.image}
                        alt={product?.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-['Playfair_Display'] font-medium text-neutral-900 mb-1">
                              {product?.title}
                            </h3>

                            <p className="text-sm text-neutral-600 mb-1">
                              Brand:{" "}
                              <span className="text-neutral-900 font-medium">
                                {product.brand}
                              </span>
                            </p>

                            <p className="text-sm text-neutral-600">
                              Color:{" "}
                              <span className="text-neutral-900 font-medium">
                                {product.color}
                              </span>
                            </p>
                          </div>

                          <p className="text-xl font-medium text-emerald-800">
                            ₹{product.price.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-6">
                        <div className="flex items-center gap-4">
                          {/* Quantity UI */}
                          <div className="flex items-center border border-neutral-300 rounded-lg overflow-hidden">
                            <button className="w-10 h-10 flex items-center justify-center text-neutral-600 hover:bg-neutral-100">
                              <Minus size={16} />
                            </button>

                            <span className="w-12 text-center text-sm font-medium">
                              {quantity}
                            </span>

                            <button className="w-10 h-10 flex items-center justify-center text-neutral-600 hover:bg-neutral-100">
                              <Plus size={16} />
                            </button>
                          </div>

                          {/* Remove */}
                          <button
                            onClick={async () => {
                              await removeFromCart(product._id);
                              fetchSummary();
                            }}
                            className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Order Summary */}
          <div className="lg:w-[380px] shrink-0">
            <div className="sticky top-24 flex flex-col gap-8">
              <div className="bg-white border border-neutral-200/70 rounded-xl p-8">
                <h2 className="text-2xl font-['Playfair_Display'] font-medium mb-8">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-8 pb-8 border-b border-neutral-200/60">
                  <div className="flex justify-between text-neutral-600">
                    <span>Subtotal</span>
                    <span className="text-neutral-900 font-medium">
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                      }).format(summary?.subtotal || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Shipping Estimate</span>
                    <span className="text-neutral-900 font-medium">
                      {summary?.shipping === 0
                        ? "Free"
                        : new Intl.NumberFormat("en-IN", {
                            style: "currency",
                            currency: "INR",
                          }).format(summary?.shipping || 0)}
                    </span>{" "}
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Tax Estimate</span>
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

                <div className="flex justify-between items-center mb-10">
                  <span className="text-xl font-medium">Total</span>
                  <span className="text-3xl font-['Playfair_Display'] font-medium text-emerald-800">
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                    }).format(summary?.total || 0)}
                  </span>
                </div>

                {/* Promo Code */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-neutral-600 mb-3">
                    Promo Code
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1 px-5 py-3.5 border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors text-sm"
                    />
                    <button
                      onClick={applyCoupon}
                      className="px-6 py-3.5 bg-neutral-900 text-white rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </div>

                <Link href="/checkout">
                  <button
                    disabled={!summary}
                    className="w-full py-4 bg-neutral-900 text-white rounded-full text-lg font-medium hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
                  >
                    Proceed to Checkout
                    <ArrowRight size={18} />
                  </button>
                </Link>

                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-neutral-500">
                  <Lock size={14} />
                  Secure SSL Checkout
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center text-center gap-2 p-4 border border-neutral-200/60 rounded-lg">
                  <ShieldCheck
                    size={28}
                    className="text-emerald-800"
                    strokeWidth={1.5}
                  />
                  <span className="text-xs font-medium text-neutral-600">
                    2 Year Warranty
                  </span>
                </div>
                <div className="flex flex-col items-center text-center gap-2 p-4 border border-neutral-200/60 rounded-lg">
                  <svg
                    className="w-7 h-7 text-emerald-800"
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
                  <span className="text-xs font-medium text-neutral-600">
                    30-Day Returns
                  </span>
                </div>
                <div className="flex flex-col items-center text-center gap-2 p-4 border border-neutral-200/60 rounded-lg">
                  <svg
                    className="w-7 h-7 text-emerald-800"
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
                  <span className="text-xs font-medium text-neutral-600">
                    24/7 Support
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
