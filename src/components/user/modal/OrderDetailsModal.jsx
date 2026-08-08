"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { X, Package, MapPin, Receipt, CreditCard } from "lucide-react";
import OrderTracker from "./OrderTracker";
import OrderStatusBadge from "../OrderStatusBadge";
import { formatCurrency } from "@/lib/format";

export default function OrderDetailsModal({ order, onClose }) {
  if (!order) return null;

  // Lock body scroll while open
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  const addressLine = order.shippingAddress?.street || order.shippingAddress?.addressLine;
  const orderId     = (order.id || order._id).toString();
  const shortId     = orderId.slice(-8).toUpperCase();

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric", month: "long", year: "numeric",
    });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 px-0 sm:px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-modal-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
        className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl overflow-hidden max-h-[92vh] sm:max-h-[88vh] flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 shrink-0">
          <div>
            <p className="text-[10px] font-mono text-neutral-400 mb-0.5">ORDER #{shortId}</p>
            <div className="flex items-center gap-2">
              <h2 id="order-modal-title" className="text-base font-bold text-neutral-900 leading-none">
                Order Details
              </h2>
              <OrderStatusBadge status={order.orderStatus} />
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-5 py-5 space-y-6">

          {/* Tracker */}
          <OrderTracker status={order.orderStatus} orderId={order._id?.toString()} />

          {/* Items */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Package size={14} className="text-neutral-400" strokeWidth={1.8} />
              <p className="text-[12px] font-semibold text-neutral-500 uppercase tracking-wider">Items</p>
            </div>
            <div className="rounded-xl border border-neutral-100 divide-y divide-neutral-50 overflow-hidden">
              {order.items.map((item) => (
                <div key={item.product} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0">
                      <Package size={14} className="text-neutral-400" strokeWidth={1.6} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-neutral-800 truncate">{item.name}</p>
                      <p className="text-[11px] text-neutral-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="text-[13px] font-semibold text-neutral-800 shrink-0">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Price breakdown */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Receipt size={14} className="text-neutral-400" strokeWidth={1.8} />
              <p className="text-[12px] font-semibold text-neutral-500 uppercase tracking-wider">Price Breakdown</p>
            </div>
            <div className="rounded-xl border border-neutral-100 px-4 py-3 space-y-2">
              <div className="flex justify-between text-[13px] text-neutral-600">
                <span>Subtotal</span>
                <span className="font-medium">{formatCurrency((order.totalAmount || 0) - (order.taxAmount || 0) - (order.shippingAmount || 0))}</span>
              </div>
              {order.taxAmount > 0 && (
                <div className="flex justify-between text-[13px] text-neutral-600">
                  <span>Tax</span>
                  <span className="font-medium">{formatCurrency(order.taxAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[13px] text-neutral-600">
                <span>Shipping</span>
                <span className="font-medium">
                  {order.shippingAmount > 0 ? formatCurrency(order.shippingAmount) : "Free"}
                </span>
              </div>
              <div className="flex justify-between text-[13.5px] font-bold text-neutral-900 pt-2 border-t border-neutral-100">
                <span>Total</span>
                <span>{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Shipping address */}
          {order.shippingAddress && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={14} className="text-neutral-400" strokeWidth={1.8} />
                <p className="text-[12px] font-semibold text-neutral-500 uppercase tracking-wider">Shipping Address</p>
              </div>
              <div className="rounded-xl border border-neutral-100 px-4 py-3">
                <p className="text-[13px] font-semibold text-neutral-800">{order.shippingAddress.fullName}</p>
                {addressLine && <p className="text-[13px] text-neutral-500 mt-0.5">{addressLine}</p>}
                <p className="text-[13px] text-neutral-500">
                  {order.shippingAddress.city}
                  {order.shippingAddress.state ? `, ${order.shippingAddress.state}` : ""}
                  {order.shippingAddress.postalCode ? ` – ${order.shippingAddress.postalCode}` : ""}
                </p>
              </div>
            </div>
          )}

          {/* Order meta */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CreditCard size={14} className="text-neutral-400" strokeWidth={1.8} />
              <p className="text-[12px] font-semibold text-neutral-500 uppercase tracking-wider">Order Info</p>
            </div>
            <div className="rounded-xl border border-neutral-100 px-4 py-3 space-y-2">
              <div className="flex justify-between text-[13px]">
                <span className="text-neutral-500">Placed on</span>
                <span className="font-medium text-neutral-800">{formatDate(order.createdAt)}</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-neutral-500">Payment</span>
                <span className="font-medium text-neutral-800 capitalize">
                  {order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod || "Online"}
                </span>
              </div>
              <div className="flex justify-between items-start text-[13px]">
                <span className="text-neutral-500">Order ID</span>
                <span className="font-mono text-[11px] text-neutral-500 text-right break-all max-w-[55%]">{orderId}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-neutral-100 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 text-sm font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
