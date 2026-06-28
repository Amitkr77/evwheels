"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  ArrowRight,
  Lock,
  CreditCard,
  Package,
  ChevronRight,
} from "lucide-react";
import { formatDate, formatDateTime } from "@/lib/Date-time"; // your formatter

const getEstimatedDelivery = (placedDate) => {
  const date = new Date(placedDate);
  const min = new Date(date);
  const max = new Date(date);

  min.setDate(date.getDate() + 4);
  max.setDate(date.getDate() + 8);

  const format = (d) =>
    d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });

  return `${format(min)} – ${format(max)}`;
};

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) {
      setError("No order ID found.");
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/user/orders/${orderId}`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to load order details");

        const data = await res.json();
        setOrder(data);
      } catch (err) {
        setError(err.message || "Could not fetch order information.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#19B5D8] mx-auto mb-4"></div>
          <p className="text-lg text-neutral-600">Loading your order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-6 py-16">
        <div className="max-w-md">
          <h2 className="text-2xl md:text-3xl font-medium text-red-600 mb-4">Something went wrong</h2>
          <p className="text-neutral-700 mb-6">{error || "Order not found."}</p>
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-full hover:bg-neutral-800 transition"
          >
            View All Orders
            <ChevronRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  const placedDate = new Date(order.createdAt);
  const estDelivery = getEstimatedDelivery(placedDate);

  return (
    <main className="flex-grow bg-[#F8FAFC] min-h-screen font-['Inter'] pt-16 md:pt-20 pb-16 md:pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 xl:max-w-6xl">
        {/* Hero / Success Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-white border border-neutral-200/70 rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 text-center mb-12 md:mb-16 shadow-sm"
        >
          <div className="relative inline-flex items-center justify-center mb-6 md:mb-8">
            <div className="absolute inset-0 rounded-full bg-[#DDF8FD]/70 animate-ping opacity-75 duration-[2000ms]" />
            <div className="relative flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full bg-[#19B5D8] text-white shadow-lg">
              <CheckCircle size={32} className="md:size-40" strokeWidth={1.8} />
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-['Playfair_Display'] font-medium text-neutral-900 mb-3 md:mb-4">
            Order Confirmed!
          </h1>

          <p className="text-base sm:text-lg text-neutral-600 font-light max-w-2xl mx-auto leading-relaxed">
            Thank you for your order! We’re preparing your items. A confirmation email has been sent to{" "}
            <span className="text-neutral-900 font-medium">
              {order.user?.email || "your registered email"}
            </span>.
          </p>

          {/* Progress indicator */}
          <div className="mt-8 md:mt-10 w-full bg-neutral-50 border border-neutral-200/70 rounded-xl p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 mb-4">
              <div className="text-left">
                <p className="text-sm font-medium text-neutral-900">Order Placed</p>
                <p className="text-xs text-neutral-600">{formatDateTime(placedDate)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-neutral-900">Est. Delivery</p>
                <p className="text-[#19B5D8] font-medium">{estDelivery}</p>
              </div>
            </div>

            <div className="relative h-2.5 w-full rounded-full bg-neutral-200 overflow-hidden mb-3">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "25%" }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="absolute top-0 left-0 h-full rounded-full bg-[#19B5D8]"
              />
            </div>

            <div className="hidden sm:flex justify-between text-xs text-neutral-600 font-light">
              <span>Placed</span>
              <span>Confirmed</span>
              <span>Shipped</span>
              <span>Delivered</span>
            </div>
          </div>
        </motion.div>

        {/* Main Content – Items + Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Items List */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl sm:text-3xl font-['Playfair_Display'] font-medium text-neutral-900 mb-5 pb-3 border-b border-neutral-200/60">
              Items Ordered
            </h3>

            <div className="space-y-6 sm:space-y-8">
              {order.items.map((item, index) => (
                <div
                  key={item.product?._id || index}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 pb-6 border-b border-neutral-100 last:border-b-0 last:pb-0"
                >
                  <div className="relative w-full sm:w-24 sm:h-24 aspect-square shrink-0 bg-neutral-50 rounded-lg overflow-hidden">
                    <img
                      src={item.product?.images?.[0] || "/logo.png"}
                      alt={item.name || "Product"}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute -top-2 -right-2 bg-neutral-900 text-white text-xs font-medium min-w-[22px] h-5.5 px-1.5 flex items-center justify-center rounded-full">
                      {item.quantity}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-base sm:text-lg font-medium text-neutral-900 mb-1 line-clamp-2">
                      {item.name || item.product?.title || "Product"}
                    </h4>
                    <p className="text-sm text-neutral-600">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <div className="text-right sm:min-w-[140px]">
                    <p className="text-lg sm:text-xl font-medium text-[#19B5D8]">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </p>
                    <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
                      ₹{item.price.toLocaleString("en-IN")} each
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary – sticky on lg+ */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-neutral-200/70 rounded-xl p-6 sm:p-7 lg:p-8 lg:sticky lg:top-24">
              <h3 className="text-xl sm:text-2xl font-['Playfair_Display'] font-medium text-neutral-900 mb-6 pb-4 border-b border-neutral-200/60">
                Order Summary
              </h3>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Order ID</span>
                  <span className="font-medium text-neutral-900">
                    {order.id || `#ORD-${order._id?.slice(-6).toUpperCase() || "XXXXXX"}`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-neutral-600">Date</span>
                  <span className="font-medium text-neutral-900">{formatDate(placedDate)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-neutral-600">Payment</span>
                  <div className="flex items-center gap-2">
                    {order.paymentMethod === "COD" ? (
                      <Package size={16} className="text-neutral-600" />
                    ) : (
                      <CreditCard size={16} className="text-neutral-600" />
                    )}
                    <span className="font-medium text-neutral-900">{order.paymentMethod}</span>
                  </div>
                </div>

                <div className="pt-5 mt-3 border-t border-neutral-200/60">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-medium text-neutral-900">Total Paid</span>
                    <span className="text-2xl sm:text-3xl font-['Playfair_Display'] font-medium text-[#19B5D8]">
                      ₹{order.totalAmount?.toLocaleString("en-IN") || "—"}
                    </span>
                  </div>
                  {order.taxAmount > 0 && (
                    <p className="text-xs text-neutral-500 text-right mt-1">
                      Incl. ₹{order.taxAmount.toLocaleString("en-IN")} tax
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-10 sm:mt-12">
          <Link
            href="/profile"
            className="flex-1 py-4 px-6 bg-neutral-900 text-white rounded-full text-base sm:text-lg font-medium hover:bg-neutral-800 transition flex items-center justify-center gap-2 shadow-sm"
          >
            Track Order
            <ArrowRight size={18} />
          </Link>

          <Link
            href="/cycles"
            className="flex-1 py-4 px-6 border border-neutral-300 text-neutral-900 rounded-full text-base sm:text-lg font-medium hover:bg-neutral-50 transition flex items-center justify-center"
          >
            Continue Shopping
          </Link>
        </div>

        {/* Support note */}
        <p className="text-center text-sm text-neutral-600 mt-8 md:mt-10">
          Need help?{" "}
          <Link href="/contact" className="text-[#19B5D8] hover:underline font-medium">
            Contact Support
          </Link>{" "}
          within 2 hours of placing your order.
        </p>
      </div>
    </main>
  );
}