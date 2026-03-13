"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/admin/orders");
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Orders fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Filter orders by search
  const filteredOrders = orders.filter((order) =>
    order.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderOrdersTable = () => {
    if (!filteredOrders.length) {
      return (
        <tr>
          <td colSpan={7} className="text-center py-6 text-neutral-500">
            No orders found.
          </td>
        </tr>
      );
    }

    return filteredOrders.map((order) => (
      <tr
        key={order._id}
        className="hover:bg-neutral-50/50 transition-colors"
      >
        <td className="py-6 px-6 font-mono text-sm">{order.id}</td>
        <td className="py-6 px-6">{order.user?.name || "Unknown"}</td>
        <td className="py-6 px-6">
          {order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0} items
        </td>
        <td className="py-6 px-6 font-medium">
          ₹{order.totalAmount?.toLocaleString("en-IN") || "0"}
        </td>
        <td className="py-6 px-6">
          <span
            className={`px-4 py-1.5 text-xs font-medium rounded-full ${
              order.orderStatus === "Delivered"
                ? "bg-emerald-50 text-emerald-800"
                : order.orderStatus === "Shipped"
                ? "bg-blue-50 text-blue-700"
                : "bg-amber-50 text-amber-700"
            }`}
          >
            {order.orderStatus}
          </span>
        </td>
        <td className="py-6 px-6 text-neutral-600">
          {new Date(order.createdAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </td>
        <td className="py-6 px-6">
          <button className="text-emerald-700 hover:text-emerald-900">
            <Eye size={18} />
          </button>
        </td>
      </tr>
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-medium mb-10">
        Orders
      </h1>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search orders..."
          className="w-full sm:w-80 px-5 py-3.5 border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors"
        />
        <button className="px-8 py-3.5 bg-emerald-800 text-white rounded-full text-sm font-medium hover:bg-emerald-900 transition-colors">
          Filter
        </button>
      </div>

      <div className="border border-neutral-200/70 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-50/70">
            <tr>
              <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">
                Order ID
              </th>
              <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">
                Customer
              </th>
              <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">
                Items
              </th>
              <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">
                Total
              </th>
              <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">
                Status
              </th>
              <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">
                Date
              </th>
              <th className="py-5 px-6 w-24"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200/60">
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-6 text-neutral-500">
                  Loading orders...
                </td>
              </tr>
            ) : (
              renderOrdersTable()
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}