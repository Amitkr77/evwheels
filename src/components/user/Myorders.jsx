"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import OrderDetailsModal from "./modal/OrderDetailsModal";
import OrderStatusBadge from "./OrderStatusBadge";
import { formatCurrency } from "@/lib/format";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/user/orders", {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch orders");

      const data = await res.json();
      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return <p className="text-center py-20">Loading orders...</p>;
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-neutral-500 mb-8">You have no orders yet.</p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-4 bg-neutral-900 text-white rounded-full hover:bg-neutral-800 transition-colors"
        >
          Browse Products
          <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-medium mb-10">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <motion.div
            key={order._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-neutral-200 rounded-xl p-6 hover:shadow-md transition"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div>
                <p className="font-mono text-sm text-neutral-600">
                  {order.id || order._id}
                </p>

                <p className="text-sm text-neutral-500">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div className="mt-2 md:mt-0 flex items-center gap-6">
                <p className="font-medium text-lg">
                  {formatCurrency(order.totalAmount)}
                </p>

                <OrderStatusBadge status={order.orderStatus} />
              </div>
            </div>

            <div className="space-y-2">
              {order.items?.map((item) => (
                <div
                  key={item.product}
                  className="flex items-center justify-between text-sm"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-neutral-500">Qty: {item.quantity}</p>
                  </div>

                  <p className="font-medium">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-end gap-4">
              <button
                onClick={() => setSelectedOrder(order)}
                className="text-sm font-medium text-[#19B5D8] hover:underline"
              >
                View Details
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}
