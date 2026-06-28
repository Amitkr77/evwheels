"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, X, Loader2 } from "lucide-react";

const STATUS_OPTIONS = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

const STATUS_COLORS = {
  PLACED: "bg-amber-50 text-amber-700",
  CONFIRMED: "bg-blue-50 text-blue-700",
  SHIPPED: "bg-indigo-50 text-indigo-700",
  DELIVERED: "bg-[#DDF8FD] text-[#19B5D8]",
  CANCELLED: "bg-red-50 text-red-700",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusError, setStatusError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/admin/orders", { credentials: "include" });
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Orders fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      !searchQuery ||
      order.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || order.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openDetail = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.orderStatus);
    setStatusNote("");
    setStatusError("");
  };

  const handleStatusUpdate = async () => {
    if (!selectedOrder || newStatus === selectedOrder.orderStatus) return;
    setUpdatingStatus(true);
    setStatusError("");
    try {
      const res = await fetch(`/api/admin/orders/${selectedOrder._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ orderStatus: newStatus, note: statusNote }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatusError(data.error || "Failed to update status.");
        return;
      }
      const updatedOrder = { ...selectedOrder, orderStatus: newStatus };
      setOrders((prev) =>
        prev.map((o) => (o._id === selectedOrder._id ? updatedOrder : o))
      );
      setSelectedOrder(updatedOrder);
    } catch {
      setStatusError("Something went wrong.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-medium mb-10">Orders</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by order ID or customer..."
          className="flex-1 sm:max-w-sm px-5 py-3.5 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#19B5D8] transition-colors text-sm"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-5 py-3.5 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#19B5D8] transition-colors text-sm"
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <span className="text-sm text-neutral-500">
          {filteredOrders.length} of {orders.length} orders
        </span>
      </div>

      <div className="border border-neutral-200/70 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50/70">
              <tr>
                <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">Order ID</th>
                <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">Customer</th>
                <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">Items</th>
                <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">Total</th>
                <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">Status</th>
                <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">Date</th>
                <th className="py-5 px-6 w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-neutral-500">Loading orders...</td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-neutral-500">No orders found.</td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="py-5 px-6 font-mono text-sm text-neutral-700">{order.id || order._id?.toString().slice(-8)}</td>
                    <td className="py-5 px-6">
                      <div>
                        <p className="font-medium text-neutral-900">{order.user?.name || "Unknown"}</p>
                        <p className="text-xs text-neutral-500">{order.user?.email || ""}</p>
                      </div>
                    </td>
                    <td className="py-5 px-6 text-neutral-600">
                      {order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0} items
                    </td>
                    <td className="py-5 px-6 font-medium text-neutral-900">
                      ₹{order.totalAmount?.toLocaleString("en-IN") || "0"}
                    </td>
                    <td className="py-5 px-6">
                      <span className={`px-3 py-1.5 text-xs font-medium rounded-full ${STATUS_COLORS[order.orderStatus] || "bg-neutral-100 text-neutral-600"}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="py-5 px-6 text-neutral-600 text-sm">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-5 px-6">
                      <button
                        onClick={() => openDetail(order)}
                        className="text-[#19B5D8] hover:text-[#19B5D8] transition-colors"
                        title="View order details"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Drawer */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setSelectedOrder(null)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed right-0 top-0 h-full w-full max-w-xl bg-white shadow-2xl z-50 overflow-y-auto"
            >
              <div className="p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-['Playfair_Display'] font-medium">Order Details</h2>
                    <p className="text-sm text-neutral-500 mt-1 font-mono">
                      {selectedOrder.id || selectedOrder._id?.toString().slice(-8)}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-neutral-400 hover:text-neutral-600 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Customer */}
                <div className="mb-6 p-5 bg-neutral-50 rounded-xl">
                  <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wide mb-3">Customer</h3>
                  <p className="font-medium text-neutral-900">{selectedOrder.user?.name || "Unknown"}</p>
                  <p className="text-sm text-neutral-600">{selectedOrder.user?.email || "—"}</p>
                </div>

                {/* Shipping */}
                {selectedOrder.shippingAddress && (
                  <div className="mb-6 p-5 bg-neutral-50 rounded-xl">
                    <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wide mb-3">Shipping Address</h3>
                    <p className="text-neutral-700 text-sm leading-relaxed">
                      {selectedOrder.shippingAddress.name && <span className="font-medium">{selectedOrder.shippingAddress.name}<br /></span>}
                      {selectedOrder.shippingAddress.street && <span>{selectedOrder.shippingAddress.street}<br /></span>}
                      {selectedOrder.shippingAddress.city && (
                        <span>
                          {selectedOrder.shippingAddress.city}
                          {selectedOrder.shippingAddress.state && `, ${selectedOrder.shippingAddress.state}`}
                          {selectedOrder.shippingAddress.pincode && ` - ${selectedOrder.shippingAddress.pincode}`}
                          <br />
                        </span>
                      )}
                      {selectedOrder.shippingAddress.phone && <span>Phone: {selectedOrder.shippingAddress.phone}</span>}
                    </p>
                  </div>
                )}

                {/* Items */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wide mb-3">
                    Items ({selectedOrder.items?.length || 0})
                  </h3>
                  <div className="space-y-3">
                    {selectedOrder.items?.map((item, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 border border-neutral-200/60 rounded-lg">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-14 h-14 object-cover rounded-lg flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-neutral-900 truncate">{item.title}</p>
                          <p className="text-sm text-neutral-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium text-neutral-900 whitespace-nowrap">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="mb-6 p-5 bg-neutral-50 rounded-xl space-y-2">
                  <div className="flex justify-between text-sm text-neutral-600">
                    <span>Payment Method</span>
                    <span className="font-medium text-neutral-900">{selectedOrder.paymentMethod || "—"}</span>
                  </div>
                  {selectedOrder.discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-[#19B5D8]">
                      <span>Discount</span>
                      <span>-₹{selectedOrder.discountAmount.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-neutral-900 pt-2 border-t border-neutral-200">
                    <span>Total</span>
                    <span>₹{selectedOrder.totalAmount?.toLocaleString("en-IN") || "0"}</span>
                  </div>
                </div>

                {/* Status Update */}
                <div className="p-5 border border-neutral-200/60 rounded-xl">
                  <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wide mb-4">Update Status</h3>

                  <div className="mb-4">
                    <span className={`px-3 py-1.5 text-xs font-medium rounded-full ${STATUS_COLORS[selectedOrder.orderStatus] || "bg-neutral-100"}`}>
                      Current: {selectedOrder.orderStatus}
                    </span>
                  </div>

                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#19B5D8] transition-colors text-sm mb-3"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>

                  <input
                    type="text"
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    placeholder="Optional note (e.g. tracking number)"
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#19B5D8] transition-colors text-sm mb-4"
                  />

                  {statusError && (
                    <p className="text-red-600 text-sm mb-3">{statusError}</p>
                  )}

                  <button
                    onClick={handleStatusUpdate}
                    disabled={updatingStatus || newStatus === selectedOrder.orderStatus}
                    className="w-full py-3.5 bg-[#19B5D8] text-white rounded-lg font-medium hover:bg-[#1297B5] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updatingStatus && <Loader2 size={16} className="animate-spin" />}
                    {updatingStatus ? "Updating..." : "Update Status"}
                  </button>
                </div>

                {/* Status History */}
                {selectedOrder.statusHistory?.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wide mb-3">History</h3>
                    <div className="space-y-2">
                      {selectedOrder.statusHistory.map((h, i) => (
                        <div key={i} className="flex items-start gap-3 text-sm">
                          <span className={`mt-0.5 px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[h.status] || "bg-neutral-100 text-neutral-600"}`}>
                            {h.status}
                          </span>
                          <div className="text-neutral-500">
                            {new Date(h.timestamp).toLocaleString("en-IN")}
                            {h.note && <span className="ml-2 text-neutral-400">— {h.note}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
