"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Check,
  Copy,
  Package,
  CreditCard,
  MapPin,
  Phone,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import { formatDate, formatDateTime } from "@/lib/Date-time";

const getEstimatedDelivery = (placedDate) => {
  const date = new Date(placedDate);
  const min = new Date(date);
  const max = new Date(date);
  min.setDate(date.getDate() + 4);
  max.setDate(date.getDate() + 8);
  const fmt = (d) => d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
  return `${fmt(min)} – ${fmt(max)}`;
};

const ORDER_STEPS = ["Placed", "Confirmed", "Shipped", "Delivered"];

const stepIndex = (status) =>
  ({ PLACED: 0, CONFIRMED: 1, SHIPPED: 2, DELIVERED: 3 }[status] ?? 0);

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!orderId) {
      setError("No order ID provided.");
      setLoading(false);
      return;
    }
    fetch(`/api/user/orders/${orderId}`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load order details");
        return res.json();
      })
      .then((data) => setOrder(data.order))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [orderId]);

  const handleCopy = () => {
    const id = order?.id || order?._id;
    if (!id) return;
    navigator.clipboard
      .writeText(id)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => console.error("Copy failed:", err));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-[3px] border-[#DDF8FD] border-t-[#19B5D8] rounded-full animate-spin mx-auto" />
          <p className="text-sm text-neutral-500">Loading your order…</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Package size={24} className="text-red-400" strokeWidth={1.5} />
          </div>
          <h2 className="text-lg font-medium text-neutral-900 mb-2">Order not found</h2>
          <p className="text-sm text-neutral-500 mb-6">{error || "We couldn't load your order."}</p>
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-white text-sm rounded-full hover:bg-neutral-800 transition-colors"
          >
            View My Orders <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    );
  }

  const placedDate = new Date(order.createdAt);
  const estDelivery = getEstimatedDelivery(placedDate);
  const isCancelled = order.orderStatus === "CANCELLED";
  const currentStep = stepIndex(order.orderStatus);
  const displayId = order.id || `#${order._id?.slice(-8).toUpperCase()}`;
  const addr = order.shippingAddress;
  const hasAddr = addr?.street || addr?.city;
  const orderItems = order.items || [];

  return (
    <main className="min-h-screen bg-[#F8FAFC] font-['Inter'] pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10">

        {/* ── Success Hero ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="bg-white rounded-2xl border border-neutral-200/70 shadow-sm p-6 sm:p-8 md:p-10 text-center mb-5"
        >
          {/* Checkmark */}
          <div className="relative inline-flex items-center justify-center mb-5">
            <span
              className="absolute w-20 h-20 rounded-full bg-[#DDF8FD] opacity-60 animate-ping"
              style={{ animationDuration: "2.2s" }}
            />
            <motion.div
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 280, damping: 22 }}
              className="relative w-20 h-20 rounded-full bg-[#19B5D8] flex items-center justify-center shadow-lg shadow-[#19B5D8]/20"
            >
              <CheckCircle size={36} className="text-white" strokeWidth={1.8} />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-3xl sm:text-4xl font-medium text-neutral-900 mb-2 tracking-tight">
              Order Confirmed!
            </h1>
            <p className="text-sm sm:text-base text-neutral-500 max-w-sm mx-auto leading-relaxed">
              Thanks{order.user?.name ? `, ${order.user.name.split(" ")[0]}` : ""}! Confirmation sent to{" "}
              <span className="text-neutral-800 font-medium">{order.user?.email || "your email"}</span>.
            </p>
          </motion.div>

          {/* Order ID pill */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="mt-4 inline-flex items-center gap-2.5 bg-neutral-50 border border-neutral-200 rounded-full px-4 py-2"
          >
            <span className="text-xs text-neutral-400">Order</span>
            <span className="text-sm font-semibold text-neutral-900 font-mono">{displayId}</span>
            <button
              onClick={handleCopy}
              className="p-1 rounded-full hover:bg-neutral-200 transition-colors"
              title="Copy order ID"
            >
              {copied
                ? <Check size={13} className="text-[#19B5D8]" strokeWidth={2.5} />
                : <Copy size={13} className="text-neutral-400" />}
            </button>
          </motion.div>

          {/* Progress tracker */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="mt-8 px-1 sm:px-4"
          >
            {isCancelled ? (
              <div className="flex items-center justify-center gap-2 py-3 px-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium">
                This order has been cancelled
              </div>
            ) : (
            <div className="relative flex items-start justify-between">
              {/* Track line */}
              <div className="absolute top-4 left-4 right-4 h-[2px] bg-neutral-200 z-0">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{
                    width: currentStep === 0
                      ? "0%"
                      : `${(currentStep / (ORDER_STEPS.length - 1)) * 100}%`,
                  }}
                  transition={{ duration: 1.3, ease: "easeOut", delay: 0.65 }}
                  className="h-full bg-[#19B5D8]"
                />
              </div>

              {ORDER_STEPS.map((step, i) => (
                <div key={step} className="flex flex-col items-center gap-2 z-10 flex-1">
                  <div
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                      i < currentStep
                        ? "bg-[#19B5D8] border-[#19B5D8]"
                        : i === currentStep
                        ? "bg-[#19B5D8] border-[#19B5D8]"
                        : "bg-white border-neutral-300"
                    }`}
                  >
                    {i < currentStep ? (
                      <Check size={13} className="text-white" strokeWidth={2.5} />
                    ) : i === currentStep ? (
                      <div className="w-2.5 h-2.5 rounded-full bg-white" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-neutral-300" />
                    )}
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      i <= currentStep ? "text-[#19B5D8]" : "text-neutral-400"
                    }`}
                  >
                    {step}
                  </span>
                </div>
              ))}
            </div>
            )}

            <div className="flex justify-between mt-4 text-xs text-neutral-500">
              <span>{formatDateTime(placedDate)}</span>
              {!isCancelled && (
                <span className="font-medium text-[#19B5D8]">Est. {estDelivery}</span>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* ── Items + Summary ─────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

          {/* Items list */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-3 bg-white rounded-2xl border border-neutral-200/70 shadow-sm overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-neutral-900">Items Ordered</h2>
              <span className="text-xs text-neutral-400">
                {orderItems.length} item{orderItems.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="divide-y divide-neutral-100">
              {orderItems.map((item, index) => (
                <div
                  key={item.product?._id || index}
                  className="flex items-center gap-4 px-6 py-4"
                >
                  <div className="relative w-14 h-14 shrink-0 rounded-xl bg-neutral-50 overflow-hidden">
                    {item.product?.images?.[0] ? (
                      <Image
                        src={item.product.images[0]}
                        alt={item.name || "Product"}
                        fill
                        sizes="56px"
                        className="object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package size={18} className="text-neutral-300" strokeWidth={1.5} />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 line-clamp-2 leading-snug">
                      {item.name || item.product?.title || "Product"}
                    </p>
                    <p className="text-xs text-neutral-400 mt-1">Qty: {item.quantity}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-neutral-900">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </p>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      ₹{item.price.toLocaleString("en-IN")} ea.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right column: Summary + Address */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2 flex flex-col gap-4"
          >
            {/* Order Summary */}
            <div className="bg-white rounded-2xl border border-neutral-200/70 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-neutral-100">
                <h2 className="text-sm font-semibold text-neutral-900">Payment Summary</h2>
              </div>
              <div className="px-6 py-5 space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-500">Method</span>
                  <div className="flex items-center gap-1.5 font-medium text-neutral-900">
                    {order.paymentMethod === "COD" ? (
                      <Package size={13} className="text-neutral-400" />
                    ) : (
                      <CreditCard size={13} className="text-neutral-400" />
                    )}
                    {order.paymentMethod === "COD" ? "Cash on Delivery" : "Card"}
                  </div>
                </div>

                {order.discountAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Discount</span>
                    <span className="font-medium text-green-600">
                      −₹{order.discountAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-neutral-500">Shipping</span>
                  {order.shippingAmount > 0 ? (
                    <span className="font-medium text-neutral-900">
                      ₹{order.shippingAmount.toLocaleString("en-IN")}
                    </span>
                  ) : (
                    <span className="font-medium text-green-600">Free</span>
                  )}
                </div>

                {order.taxAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Tax</span>
                    <span className="font-medium text-neutral-900">
                      ₹{order.taxAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}

                <div className="pt-3 border-t border-neutral-100 flex justify-between items-center">
                  <span className="font-semibold text-neutral-900">Total Paid</span>
                  <span className="text-xl font-bold text-[#19B5D8]">
                    ₹{order.totalAmount?.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            {hasAddr && (
              <div className="bg-white rounded-2xl border border-neutral-200/70 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-neutral-100 flex items-center gap-2">
                  <MapPin size={14} className="text-neutral-400" />
                  <h2 className="text-sm font-semibold text-neutral-900">Deliver To</h2>
                </div>
                <div className="px-6 py-5 text-sm space-y-1.5">
                  {addr.fullName && (
                    <p className="font-medium text-neutral-900">{addr.fullName}</p>
                  )}
                  {addr.street && (
                    <p className="text-neutral-500">{addr.street}</p>
                  )}
                  {(addr.city || addr.state || addr.postalCode) && (
                    <p className="text-neutral-500">
                      {[addr.city, addr.state, addr.postalCode].filter(Boolean).join(", ")}
                    </p>
                  )}
                  {addr.phone && (
                    <p className="flex items-center gap-1.5 text-neutral-500 pt-1">
                      <Phone size={12} className="shrink-0" />
                      {addr.phone}
                    </p>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* ── Action Buttons ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="mt-5 flex flex-col sm:flex-row gap-3"
        >
          <Link
            href="/profile"
            className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 bg-neutral-900 text-white text-sm font-medium rounded-full hover:bg-neutral-800 transition-colors"
          >
            <Package size={15} />
            Track My Order
          </Link>
          <Link
            href="/shop"
            className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 border border-neutral-200 text-neutral-700 text-sm font-medium rounded-full hover:bg-neutral-50 transition-colors"
          >
            <ShoppingBag size={15} />
            Continue Shopping
          </Link>
        </motion.div>

        {/* Support note */}
        <p className="text-center text-xs text-neutral-400 mt-7">
          Need help?{" "}
          <Link href="/contact" className="text-[#19B5D8] hover:underline">
            Contact Support
          </Link>{" "}
          · We respond within 2 hours.
        </p>
      </div>
    </main>
  );
}
