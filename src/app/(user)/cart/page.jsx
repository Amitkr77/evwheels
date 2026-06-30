"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Trash2,
  Plus,
  Minus,
  Lock,
  ArrowRight,
  ShieldCheck,
  ShoppingCart,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import Image from "next/image";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity } = useCartStore(); 

  const [summary, setSummary] = useState(null);
  const [coupon, setCoupon] = useState("");
  const [isSummaryLoading, setIsSummaryLoading] = useState(true);
  const [couponError, setCouponError] = useState("");

  const fetchSummary = useCallback(async () => {
    setIsSummaryLoading(true);
    try {
      const res = await fetch("/api/cart/summary", { credentials: "include" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to load summary");
      }
      const data = await res.json();
      setSummary(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSummaryLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [items, fetchSummary]);

  const applyCoupon = async () => {
    if (!coupon.trim()) return;
    setIsSummaryLoading(true);
    setCouponError("");
    try {
      const res = await fetch("/api/cart/apply-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ couponCode: coupon.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCouponError(data.error || "Invalid coupon code.");
        setIsSummaryLoading(false);
        return;
      }
      // Refetch summary now that coupon is saved on the cart
      await fetchSummary();
    } catch {
      setCouponError("Could not apply coupon. Please try again.");
      setIsSummaryLoading(false);
    }
  };

  const handleQuantityChange = async (productId, newQty, moq = 1) => {
    if (newQty < moq) return;
    await updateQuantity(productId, newQty);
  };

  if (items.length === 0) {
    return (
      <main className="flex-grow bg-[#F8FAFC] min-h-screen pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 text-center py-20">
          <ShoppingCart size={64} className="mx-auto text-neutral-400 mb-6" strokeWidth={1.2} />
          <h2 className="text-3xl font-medium mb-4">Your cart is empty</h2>
          <p className="text-neutral-600 mb-8 max-w-md mx-auto">
            Looks like you haven't added anything yet. Start browsing our collection!
          </p>
          <Link
            href="/cycles"
            className="inline-flex items-center gap-2 px-8 py-4 bg-neutral-900 text-white rounded-full hover:bg-neutral-800 transition"
          >
            Start Shopping
            <ArrowRight size={18} />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow bg-[#F8FAFC] min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-10 border-b border-neutral-200/70 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-2">
              Your Shopping Cart
            </h1>
            <p className="text-lg text-neutral-600 font-light">
              {items.length} item{items.length !== 1 ? "s" : ""}
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
          {/* Cart Items */}
          <div className="flex-1 flex flex-col gap-6 lg:gap-8">
            {summary?.shipping === 0 && !isSummaryLoading && (
              <div className="flex items-center gap-3 p-5 bg-[#DDF8FD]/70 border border-[#19B5D8]/20 rounded-xl text-sm text-neutral-700">
                <ShieldCheck size={20} className="text-[#19B5D8] flex-shrink-0" />
                <span>
                  You&apos;ve qualified for <strong className="text-[#19B5D8]">Free Shipping</strong>!
                </span>
              </div>
            )}

            {items.map((item) => {
              const { product, quantity } = item;
              return (
                <div
                  key={product._id}
                  className="bg-white border border-neutral-200/70 rounded-xl p-5 sm:p-6 hover:border-[#19B5D8]/20 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row gap-5 sm:gap-6">
                    <div className="relative shrink-0 w-full sm:w-32 aspect-square">
                      <Image
                        src={product.images?.[0] || "/logo.png"}
                        fill
                        sizes="(max-width: 640px) 100vw, 128px"
                        alt={product.title || "Product image"}
                        className="object-cover rounded-lg"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-xl font-semibold mb-1 line-clamp-2">
                              {product.title}
                            </h3>
                            <p className="text-sm text-neutral-600">
                              Brand: <span className="text-neutral-900">{product.brand || "—"}</span>
                            </p>
                            <p className="text-sm text-neutral-600">
                              Color: <span className="text-neutral-900">{product.colors?.[0] || "—"}</span>
                            </p>
                          </div>
                          <p className="text-xl font-medium text-[#19B5D8] whitespace-nowrap">
                            ₹{Number(product.price).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-5 sm:mt-6">
                        <div className="flex items-center gap-5">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center border border-neutral-300 rounded-lg overflow-hidden">
                              <button
                                onClick={() => handleQuantityChange(product._id, quantity - 1, product.moq || 1)}
                                disabled={quantity <= (product.moq || 1)}
                                aria-label="Decrease quantity"
                                className="w-10 h-10 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="w-12 text-center text-sm font-medium">{quantity}</span>
                              <button
                                onClick={() => handleQuantityChange(product._id, quantity + 1, product.moq || 1)}
                                aria-label="Increase quantity"
                                className="w-10 h-10 flex items-center justify-center text-neutral-600 hover:bg-neutral-100"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                            {(product.moq || 1) > 1 && (
                              <span className="text-xs text-[#19B5D8] font-medium text-center">
                                Min. {product.moq} pcs
                              </span>
                            )}
                          </div>

                          <button
                            onClick={async () => {
                              await removeFromCart(product._id);
                            }}
                            aria-label={`Remove ${product.title} from cart`}
                            className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-red-600 transition-colors"
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

          {/* Order Summary – Sticky on lg */}
          <div className="lg:w-[380px] shrink-0">
            <div className="lg:sticky lg:top-24 flex flex-col gap-8">
              <div className="bg-white border border-neutral-200/70 rounded-xl p-6 sm:p-8">
                <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

                {isSummaryLoading ? (
                  <div className="space-y-4 animate-pulse">
                    <div className="h-5 bg-neutral-200 rounded w-3/4"></div>
                    <div className="h-5 bg-neutral-200 rounded w-3/4"></div>
                    <div className="h-5 bg-neutral-200 rounded w-3/4"></div>
                    <div className="h-8 bg-neutral-200 rounded w-full mt-6"></div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-8 pb-8 border-b border-neutral-200/60">
                      <div className="flex justify-between text-neutral-600">
                        <span>Subtotal</span>
                        <span className="text-neutral-900 font-medium">
                          ₹{(summary?.subtotal || 0).toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="flex justify-between text-neutral-600">
                        <span>Shipping</span>
                        <span className="text-neutral-900 font-medium">
                          {summary?.shipping === 0 ? "Free" : `₹${(summary?.shipping || 0).toLocaleString("en-IN")}`}
                        </span>
                      </div>
                      <div className="flex justify-between text-neutral-600">
                        <span>Tax</span>
                        <span className="text-neutral-900 font-medium">
                          ₹{(summary?.tax || 0).toLocaleString("en-IN")}
                        </span>
                      </div>
                      {summary?.discount > 0 && (
                        <div className="flex justify-between text-[#22C55E] font-medium">
                          <span>Discount</span>
                          <span>-₹{(summary.discount).toLocaleString("en-IN")}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center mb-8">
                      <span className="text-xl font-medium">Total</span>
                      <span className="text-3xl font-bold text-[#19B5D8]">
                        ₹{(summary?.total || 0).toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="mb-8">
                      <label className="block text-sm font-medium text-neutral-600 mb-3">Promo Code</label>
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={coupon}
                          onChange={(e) => {
                            setCoupon(e.target.value.toUpperCase());
                            setCouponError("");
                          }}
                          placeholder="Enter code"
                          className="flex-1 px-5 py-3.5 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#19B5D8] focus:ring-2 focus:ring-[#19B5D8]/10 transition text-sm uppercase"
                        />
                        <button
                          onClick={applyCoupon}
                          disabled={!coupon.trim() || isSummaryLoading}
                          className="px-6 py-3.5 disabled:opacity-50 bg-neutral-900 text-white rounded-lg text-sm font-medium hover:bg-neutral-800 transition"
                        >
                          Apply
                        </button>
                      </div>
                      {couponError && <p className="text-red-600 text-sm mt-2">{couponError}</p>}
                      {summary?.couponApplied && (
                        <p className="text-[#22C55E] text-sm font-medium mt-2">
                          Coupon "{summary.couponApplied}" applied successfully!
                        </p>
                      )}
                    </div>

                    <Link href="/checkout">
                      <button
                        disabled={isSummaryLoading || items.length === 0}
                        className="w-full py-4 bg-neutral-900 text-white rounded-full text-lg font-medium hover:bg-neutral-800 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-disabled={isSummaryLoading || items.length === 0}
                      >
                        Proceed to Checkout
                        <ArrowRight size={18} />
                      </button>
                    </Link>

                    <div className="mt-6 flex items-center justify-center gap-2 text-xs text-neutral-500">
                      <Lock size={14} />
                      Secure SSL Checkout
                    </div>
                  </>
                )}
              </div>

              {/* Trust badges – optional on mobile */}
              <div className="hidden lg:grid grid-cols-3 gap-4">
                {/* ... keep your trust badges ... */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}