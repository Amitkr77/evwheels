"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Package,
  ArrowRight,
  ChevronRight,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  ShoppingBag,
  MapPin,
  CalendarDays,
} from "lucide-react";
import OrderDetailsModal from "./modal/OrderDetailsModal";
import OrderStatusBadge from "./OrderStatusBadge";
import { formatCurrency } from "@/lib/format";

const ORDER_STEPS = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED"];

// Compact inline step bar shown on each order card
function MiniTracker({ status }) {
  if (status === "CANCELLED") {
    return (
      <div className="flex items-center gap-1.5 text-[11px] text-red-500 font-medium">
        <XCircle size={12} className="shrink-0" /> Order cancelled
      </div>
    );
  }

  const currentStep = ORDER_STEPS.indexOf(status);

  return (
    <div className="flex items-center gap-0">
      {ORDER_STEPS.map((step, i) => {
        const done    = i <= currentStep;
        const isCurr  = i === currentStep;
        const isLast  = i === ORDER_STEPS.length - 1;

        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                  done
                    ? isCurr
                      ? "bg-[#19B5D8] ring-4 ring-[#DDF8FD]"
                      : "bg-[#19B5D8]"
                    : "bg-neutral-200"
                }`}
              >
                {done && !isCurr ? (
                  <CheckCircle2 size={10} className="text-white" strokeWidth={3} />
                ) : (
                  <div className={`w-1.5 h-1.5 rounded-full ${done ? "bg-white" : "bg-neutral-400"}`} />
                )}
              </div>
              <span className={`text-[9px] font-medium whitespace-nowrap ${done ? "text-[#19B5D8]" : "text-neutral-400"}`}>
                {step === "PLACED" ? "Placed" : step === "CONFIRMED" ? "Confirmed" : step === "SHIPPED" ? "Shipped" : "Delivered"}
              </span>
            </div>
            {!isLast && (
              <div className={`flex-1 h-px mx-1 mb-3.5 ${i < currentStep ? "bg-[#19B5D8]" : "bg-neutral-200"}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white border border-neutral-200/70 rounded-2xl p-5 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-2">
          <div className="h-3 w-32 bg-neutral-100 rounded-full" />
          <div className="h-3 w-20 bg-neutral-100 rounded-full" />
        </div>
        <div className="h-6 w-20 bg-neutral-100 rounded-full" />
      </div>
      <div className="space-y-2.5 mb-4">
        <div className="h-3 w-full bg-neutral-100 rounded-full" />
        <div className="h-3 w-3/4 bg-neutral-100 rounded-full" />
      </div>
      <div className="flex items-center gap-2 pt-4 border-t border-neutral-100">
        {[0,1,2,3].map((i) => (
          <React.Fragment key={i}>
            <div className="w-5 h-5 rounded-full bg-neutral-100" />
            {i < 3 && <div className="flex-1 h-px bg-neutral-100" />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default function MyOrders() {
  const [orders,        setOrders]        = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetch("/api/user/orders", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setOrders(Array.isArray(d.orders) ? d.orders : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
    });

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="text-[#0C7290] text-[11px] font-semibold tracking-[0.18em] uppercase mb-1">
          Account
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">My Orders</h1>
      </div>

      {/* Loading skeletons */}
      {loading && (
        <div className="space-y-4">
          {[0, 1, 2].map((i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Empty state */}
      {!loading && orders.length === 0 && (
        <div className="bg-white border border-neutral-200/70 rounded-2xl p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-neutral-50 flex items-center justify-center mx-auto mb-5">
            <ShoppingBag size={28} className="text-neutral-300" strokeWidth={1.4} />
          </div>
          <p className="text-base font-semibold text-neutral-700 mb-1">No orders yet</p>
          <p className="text-sm text-neutral-400 mb-7">Your orders will appear here once you make a purchase.</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-neutral-900 text-white text-sm font-semibold rounded-full hover:bg-neutral-700 transition-colors"
          >
            Browse Products <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* Order cards */}
      {!loading && orders.length > 0 && (
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {orders.map((order, idx) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="bg-white border border-neutral-200/70 rounded-2xl overflow-hidden hover:border-neutral-300 hover:shadow-sm transition-all"
              >
                {/* Card header */}
                <div className="px-5 pt-5 pb-4">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <p className="text-[11px] font-mono text-neutral-400 mb-0.5">
                        Order #{(order.id || order._id).toString().slice(-8).toUpperCase()}
                      </p>
                      <p className="flex items-center gap-1 text-[12px] text-neutral-500">
                        <CalendarDays size={11} className="shrink-0" />
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <p className="text-base font-bold text-neutral-900">
                        {formatCurrency(order.totalAmount)}
                      </p>
                      <OrderStatusBadge status={order.orderStatus} />
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="space-y-2 mb-4">
                    {order.items?.slice(0, 2).map((item) => (
                      <div key={item.product} className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0">
                            <Package size={13} className="text-neutral-400" strokeWidth={1.6} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[12.5px] font-medium text-neutral-800 truncate">{item.name}</p>
                            <p className="text-[11px] text-neutral-400">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="text-[12.5px] font-semibold text-neutral-700 shrink-0">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                    {order.items?.length > 2 && (
                      <p className="text-[11px] text-neutral-400 pl-10.5">
                        +{order.items.length - 2} more item{order.items.length - 2 > 1 ? "s" : ""}
                      </p>
                    )}
                  </div>

                  {/* Delivery address snippet */}
                  {order.shippingAddress?.city && (
                    <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 mb-1">
                      <MapPin size={10} className="shrink-0" />
                      <span className="truncate">
                        {order.shippingAddress.fullName && `${order.shippingAddress.fullName}, `}
                        {order.shippingAddress.city}
                        {order.shippingAddress.postalCode && ` – ${order.shippingAddress.postalCode}`}
                      </span>
                    </div>
                  )}
                </div>

                {/* Mini tracker */}
                <div className="px-5 py-3 border-t border-neutral-100 bg-neutral-50/60">
                  <MiniTracker status={order.orderStatus} />
                </div>

                {/* Footer action */}
                <div className="px-5 py-3 border-t border-neutral-100 flex items-center justify-between">
                  {order.orderStatus === "SHIPPED" && (
                    <div className="flex items-center gap-1.5 text-[11.5px] text-[#19B5D8] font-medium">
                      <Truck size={12} className="shrink-0" />
                      In transit — tap to track
                    </div>
                  )}
                  {order.orderStatus === "DELIVERED" && (
                    <div className="flex items-center gap-1.5 text-[11.5px] text-emerald-600 font-medium">
                      <CheckCircle2 size={12} className="shrink-0" />
                      Delivered
                    </div>
                  )}
                  {!["SHIPPED", "DELIVERED"].includes(order.orderStatus) && (
                    <div />
                  )}
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="flex items-center gap-1 text-[12.5px] font-semibold text-[#19B5D8] hover:text-[#0C7290] transition-colors"
                  >
                    View Details <ChevronRight size={13} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Details modal */}
      <AnimatePresence>
        {selectedOrder && (
          <OrderDetailsModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
