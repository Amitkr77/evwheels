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
} from "lucide-react";
import { formatDate, formatDateTime } from "@/lib/Date-time"; // keep your formatter

// Optional: helper to estimate delivery (customize days based on your policy)
const getEstimatedDelivery = (placedDate) => {
  const date = new Date(placedDate);
  const min = new Date(date);
  const max = new Date(date);

  min.setDate(date.getDate() + 4); // e.g. 4 days for standard
  max.setDate(date.getDate() + 8); // up to 8 days

  // Simple skip weekends if you want (not perfect, ignores holidays)
  // You can improve with date-fns or luxon later

  const format = (d) =>
    d.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
    });

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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-neutral-600">
          Loading your order details...
        </p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-6">
        <div>
          <h2 className="text-2xl font-medium text-red-600 mb-4">Oops!</h2>
          <p className="text-neutral-700">{error || "Order not found."}</p>
          <Link
            href="/profile/orders"
            className="text-emerald-800 hover:underline mt-4 inline-block"
          >
            View all orders →
          </Link>
        </div>
      </div>
    );
  }

  const placedDate = new Date(order.createdAt);
  const estDelivery = getEstimatedDelivery(placedDate);

  return (
    <main className="flex-grow bg-[#fdfcf9] min-h-screen font-['Inter'] pt-20 pb-20">
      <div className="max-w-4xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Success Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="flex flex-col items-center gap-8 rounded-2xl bg-white border border-neutral-200/70 p-8 md:p-12 text-center mb-16"
        >
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-emerald-50/60 animate-ping opacity-75 duration-1000" />
            <div className="relative flex size-20 items-center justify-center rounded-full bg-emerald-800 text-white shadow-md">
              <CheckCircle size={40} strokeWidth={1.8} />
            </div>
          </div>

          <div className="space-y-3 max-w-xl">
            <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-medium text-neutral-900">
              Order Confirmed!
            </h1>
            <p className="text-lg text-neutral-600 font-light leading-relaxed">
              Thank you for your order! Your gear is on the way. A confirmation
              email has been sent to{" "}
              <span className="text-neutral-900 font-medium">
                {/* Replace with real email – from user session or order.user.email if populated */}
                {order.user?.email || "your registered email"}
              </span>
              .
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full mt-4 bg-neutral-50 border border-neutral-200/70 rounded-xl p-6">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-sm font-medium text-neutral-900 mb-1">
                    Order Placed
                  </p>
                  <p className="text-xs text-neutral-600">
                    {formatDateTime(placedDate)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-neutral-900 mb-1">
                    Est. Delivery
                  </p>
                  <p className="text-emerald-800 font-medium">{estDelivery}</p>
                </div>
              </div>

              <div className="relative h-2.5 w-full rounded-full bg-neutral-200 overflow-hidden">
                <div className="absolute top-0 left-0 h-full w-[25%] rounded-full bg-emerald-600 transition-all duration-1000" />
              </div>

              <div className="flex justify-between text-xs font-light text-neutral-600">
                <span>Placed</span>
                <span>Confirmed</span>
                <span>Shipped</span>
                <span>Delivered</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Order Details & Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Left: Items List */}
          <div className="md:col-span-2 flex flex-col gap-6">
            <h3 className="text-2xl md:text-3xl font-['Playfair_Display'] font-medium text-neutral-900 pb-4 border-b border-neutral-200/60">
              Items Ordered
            </h3>

            {order.items.map((item, index) => (
              <div
                key={item.product || index}
                className={`flex gap-6 ${index > 0 ? "border-t border-neutral-200/60 pt-6" : ""}`}
              >
                <div className="relative w-24 h-24 shrink-0 bg-neutral-50 rounded-lg overflow-hidden">
                  <img
                    src={item.product.image || "/placeholder-product.jpg"} // ← use real product.image if populated in backend
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute -top-2 -right-2 bg-neutral-900 text-white text-xs font-medium w-6 h-6 rounded-full flex items-center justify-center">
                    {item.quantity}
                  </span>
                </div>

                <div className="flex-1">
                  <h4 className="text-lg font-medium text-neutral-900 mb-1">
                    {item.name}
                  </h4>
                  {/* Add variant/color if you have it in data */}
                  <p className="text-sm text-neutral-600">
                    Qty: {item.quantity}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xl font-medium text-emerald-800">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </p>
                  <p className="text-xs text-neutral-600 mt-1">
                    ₹{item.price.toLocaleString("en-IN")} each
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-white border border-neutral-200/70 rounded-xl p-8 sticky top-24">
              <h3 className="text-2xl font-['Playfair_Display'] font-medium text-neutral-900 mb-6 pb-4 border-b border-neutral-200/60">
                Summary
              </h3>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-medium text-neutral-600 uppercase tracking-wider">
                    Order ID
                  </p>
                  <p className="text-sm font-medium text-neutral-900">
                    {order.id || `#ORD-${order._id.slice(-6).toUpperCase()}`}
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  <p className="text-xs font-medium text-neutral-600 uppercase tracking-wider">
                    Date
                  </p>
                  <p className="text-sm font-medium text-neutral-900">
                    {formatDate(placedDate)}
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  <p className="text-xs font-medium text-neutral-600 uppercase tracking-wider">
                    Payment Method
                  </p>
                  <div className="flex items-center gap-2">
                    {order.paymentMethod === "COD" ? (
                      <Package size={16} className="text-neutral-600" />
                    ) : (
                      <CreditCard size={16} className="text-neutral-600" />
                    )}
                    <p className="text-sm font-medium text-neutral-900">
                      {order.paymentMethod}
                      {order.paymentMethod !== "COD" && " •••• (card)"}
                    </p>
                  </div>
                </div>

                <div className="mt-auto pt-6 border-t border-neutral-200/60">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-neutral-600">
                      Total Paid
                    </p>
                    <p className="text-2xl font-['Playfair_Display'] font-medium text-emerald-800">
                      ₹{order.totalAmount.toLocaleString("en-IN")}
                    </p>
                  </div>
                  {order.taxAmount > 0 && (
                    <p className="text-xs text-neutral-600 mt-1 text-right">
                      Incl. ₹{order.taxAmount.toLocaleString("en-IN")} tax
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-12">
          <button className="flex-1 py-4 bg-neutral-900 text-white rounded-full text-lg font-medium hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2">
            Track Order
            <ArrowRight size={18} />
          </button>

          <Link
            href="/cycles" // or /products, /shop etc.
            className="flex-1 py-4 border border-neutral-300 text-neutral-900 rounded-full text-lg font-medium hover:bg-neutral-50 transition-colors flex items-center justify-center"
          >
            Continue Shopping
          </Link>
        </div>

        {/* Footer Text */}
        <p className="text-center text-sm text-neutral-600 mt-8">
          Need to make changes?{" "}
          <Link
            href="/contact"
            className="text-emerald-800 hover:underline font-medium"
          >
            Contact Support
          </Link>{" "}
          within 2 hours.
        </p>
      </div>
    </main>
  );
}
