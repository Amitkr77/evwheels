"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Truck, Package, X, Loader2, RefreshCw, ExternalLink,
  MapPin, CheckCircle2, AlertCircle, ChevronDown, ChevronUp,
  RotateCcw, FileText, Printer, Search,
} from "lucide-react";
import { useToast } from "@/components/admin/Toast";
import { useConfirm } from "@/components/admin/ConfirmDialog";

// ── Status helpers ────────────────────────────────────────────────────────────

const ORDER_STATUS_COLORS = {
  PLACED: "bg-amber-50 text-amber-700",
  CONFIRMED: "bg-blue-50 text-blue-700",
  SHIPPED: "bg-indigo-50 text-indigo-700",
  DELIVERED: "bg-[#DDF8FD] text-[#19B5D8]",
  CANCELLED: "bg-red-50 text-red-700",
};

const SR_STATUS_COLORS = {
  NEW: "bg-neutral-100 text-neutral-600",
  AWB_ASSIGNED: "bg-blue-50 text-blue-600",
  PICKUP_SCHEDULED: "bg-violet-50 text-violet-600",
  PICKUP_GENERATED: "bg-violet-50 text-violet-700",
  "In Transit": "bg-indigo-50 text-indigo-600",
  "Out For Delivery": "bg-amber-50 text-amber-700",
  Delivered: "bg-emerald-50 text-emerald-700",
  DELIVERED: "bg-emerald-50 text-emerald-700",
  Cancelled: "bg-red-50 text-red-600",
  CANCELLED: "bg-red-50 text-red-600",
};

function ShippingBadge({ status }) {
  if (!status) return <span className="text-xs text-neutral-400 italic">Not pushed</span>;
  const cls = SR_STATUS_COLORS[status] || "bg-neutral-100 text-neutral-600";
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${cls}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

// ── Courier picker dialog ─────────────────────────────────────────────────────

function CourierDialog({ order, onClose, onAssigned }) {
  const showToast = useToast();
  const [couriers, setCouriers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/shipping/couriers?orderId=${order._id}`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setCouriers(d.couriers || []))
      .catch(() => setCouriers([]))
      .finally(() => setLoading(false));
  }, [order._id]);

  const handleAssign = async () => {
    if (!selected) return;
    setAssigning(true);
    try {
      const res = await fetch("/api/admin/shipping/assign-awb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          orderId: order._id,
          courierCompanyId: selected.courier_company_id,
          courierName: selected.courier_name,
        }),
      });
      const data = await res.json();
      if (!res.ok) { showToast(data.error || "Failed to assign AWB", "error"); return; }
      showToast(`AWB assigned — ${data.awbCode}`);
      onAssigned(data.awbCode, selected.courier_name, data.trackingUrl);
      onClose();
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="courier-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10">
        <div className="flex items-center justify-between mb-5">
          <h2 id="courier-dialog-title" className="text-lg font-semibold">Select Courier</h2>
          <button onClick={onClose} aria-label="Close" className="text-neutral-400 hover:text-neutral-600">
            <X size={20} />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 size={22} className="animate-spin text-[#19B5D8]" />
          </div>
        ) : couriers.length === 0 ? (
          <p className="text-sm text-neutral-500 text-center py-6">
            No serviceable couriers found for this pincode.
          </p>
        ) : (
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1 mb-4">
            {couriers.map((c) => (
              <label
                key={c.courier_company_id}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  selected?.courier_company_id === c.courier_company_id
                    ? "border-[#19B5D8] bg-[#DDF8FD]/40"
                    : "border-neutral-200 hover:border-neutral-300"
                }`}
              >
                <input
                  type="radio"
                  name="courier"
                  className="accent-[#19B5D8]"
                  checked={selected?.courier_company_id === c.courier_company_id}
                  onChange={() => setSelected(c)}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-neutral-900">{c.courier_name}</p>
                  <p className="text-xs text-neutral-500">
                    ₹{c.rate} · ETD {c.estimated_delivery_days} day{c.estimated_delivery_days !== 1 ? "s" : ""}
                    {c.cod ? " · COD" : ""}
                  </p>
                </div>
                {c.is_recommended && (
                  <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full font-medium shrink-0">
                    Recommended
                  </span>
                )}
              </label>
            ))}
          </div>
        )}

        <button
          onClick={handleAssign}
          disabled={!selected || assigning}
          className="w-full py-3 bg-[#19B5D8] text-white rounded-xl font-medium text-sm disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {assigning && <Loader2 size={15} className="animate-spin" />}
          {assigning ? "Assigning…" : "Assign & Generate AWB"}
        </button>
      </div>
    </div>
  );
}

// ── Tracking drawer ───────────────────────────────────────────────────────────

function TrackingDrawer({ order, onClose }) {
  const [history, setHistory] = useState(order.trackingHistory || []);
  const [refreshing, setRefreshing] = useState(false);
  const showToast = useToast();

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await fetch(`/api/admin/shipping/track?orderId=${order._id}`, { credentials: "include" });
      const data = await res.json();
      if (data.trackingHistory) setHistory(data.trackingHistory);
      if (data.currentStatus) showToast(`Status: ${data.currentStatus}`);
    } catch {
      showToast("Failed to refresh tracking", "error");
    } finally {
      setRefreshing(false);
    }
  }, [order._id, showToast]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
      />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "tween", duration: 0.28 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tracking-drawer-title"
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto"
      >
        <div className="p-7">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 id="tracking-drawer-title" className="text-xl font-semibold">Tracking</h2>
              <p className="text-sm text-neutral-500 font-mono mt-0.5">{order.id || order._id?.toString().slice(-8)}</p>
            </div>
            <button onClick={onClose} aria-label="Close" className="text-neutral-400 hover:text-neutral-600">
              <X size={22} />
            </button>
          </div>

          {/* Courier info */}
          {order.shiprocket?.awbCode && (
            <div className="mb-5 p-4 bg-neutral-50 rounded-xl space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">AWB</span>
                <span className="font-mono font-medium">{order.shiprocket.awbCode}</span>
              </div>
              {order.shiprocket.courierName && (
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Courier</span>
                  <span className="font-medium">{order.shiprocket.courierName}</span>
                </div>
              )}
              {order.shiprocket.etd && (
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">ETD</span>
                  <span>{new Date(order.shiprocket.etd).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                </div>
              )}
              {order.shiprocket.trackingUrl && (
                <a
                  href={order.shiprocket.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-[#19B5D8] hover:underline pt-1"
                >
                  Track on courier site <ExternalLink size={11} />
                </a>
              )}
            </div>
          )}

          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-neutral-700">Scan Events</h3>
            <button
              onClick={refresh}
              disabled={refreshing}
              className="flex items-center gap-1.5 text-xs text-[#19B5D8] hover:text-[#0C7290] transition-colors disabled:opacity-50"
            >
              <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          {history.length === 0 ? (
            <p className="text-sm text-neutral-400 text-center py-8">No tracking events yet.</p>
          ) : (
            <ol className="relative border-l border-neutral-200 space-y-0 ml-2">
              {history.map((event, i) => (
                <li key={i} className="ml-5 pb-6 last:pb-0">
                  <div className="absolute -left-[7px] w-3.5 h-3.5 rounded-full border-2 border-white bg-[#19B5D8] mt-0.5" />
                  <p className="text-sm font-semibold text-neutral-900 leading-snug">{event.status}</p>
                  {event.location && (
                    <p className="flex items-center gap-1 text-xs text-neutral-500 mt-0.5">
                      <MapPin size={11} /> {event.location}
                    </p>
                  )}
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {event.date ? new Date(event.date).toLocaleString("en-IN") : "—"}
                  </p>
                  {event.remark && event.remark !== event.status && (
                    <p className="text-xs text-neutral-500 mt-1 italic">{event.remark}</p>
                  )}
                </li>
              ))}
            </ol>
          )}
        </div>
      </motion.div>
    </>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

const STATUS_FILTER_OPTIONS = ["", "PLACED", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function ShippingPage() {
  const showToast = useToast();
  const confirmDialog = useConfirm();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [courierOrder, setCourierOrder] = useState(null);   // order needing AWB
  const [trackingOrder, setTrackingOrder] = useState(null); // order in tracking drawer
  const [actionLoading, setActionLoading] = useState({});   // { [orderId]: true }
  const [expanded, setExpanded] = useState({});             // { [orderId]: true } for mobile detail

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const qs = new URLSearchParams();
      if (statusFilter) qs.set("status", statusFilter);
      if (search) qs.set("search", search);
      const res = await fetch(`/api/admin/shipping?${qs}`, { credentials: "include" });
      const data = await res.json();
      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch {
      showToast("Failed to load shipping orders", "error");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search, showToast]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const setLoaderFor = (id, val) =>
    setActionLoading((prev) => ({ ...prev, [id]: val }));

  // ── Actions ──────────────────────────────────────────────────────────────

  const handleCreateShipment = async (order) => {
    setLoaderFor(order._id, "create");
    try {
      const res = await fetch("/api/admin/shipping/create-shipment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ orderId: order._id }),
      });
      const data = await res.json();
      if (!res.ok) { showToast(data.error || "Failed to create shipment", "error"); return; }
      showToast("Shipment created in Shiprocket");
      setOrders((prev) =>
        prev.map((o) =>
          o._id === order._id
            ? { ...o, shiprocket: { ...o.shiprocket, orderId: data.shiprocketOrderId, shipmentId: data.shipmentId, shippingStatus: "NEW" } }
            : o
        )
      );
    } finally {
      setLoaderFor(order._id, null);
    }
  };

  const handlePickup = async (order) => {
    setLoaderFor(order._id, "pickup");
    try {
      const res = await fetch("/api/admin/shipping/pickup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ orderIds: [order._id] }),
      });
      const data = await res.json();
      if (!res.ok) { showToast(data.error || "Failed to schedule pickup", "error"); return; }
      showToast("Pickup scheduled");
      setOrders((prev) =>
        prev.map((o) =>
          o._id === order._id
            ? { ...o, shiprocket: { ...o.shiprocket, pickupStatus: 1, shippingStatus: "PICKUP_SCHEDULED" } }
            : o
        )
      );
    } finally {
      setLoaderFor(order._id, null);
    }
  };

  const handleLabel = async (order) => {
    setLoaderFor(order._id, "label");
    try {
      const res = await fetch("/api/admin/shipping/label", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ orderIds: [order._id] }),
      });
      const data = await res.json();
      if (!res.ok) { showToast(data.error || "Failed to generate label", "error"); return; }
      if (data.labelUrl) {
        window.open(data.labelUrl, "_blank", "noopener,noreferrer");
        setOrders((prev) =>
          prev.map((o) =>
            o._id === order._id ? { ...o, shiprocket: { ...o.shiprocket, labelUrl: data.labelUrl } } : o
          )
        );
      } else {
        showToast("Label generated — check Shiprocket dashboard");
      }
    } finally {
      setLoaderFor(order._id, null);
    }
  };

  const handleInvoice = async (order) => {
    setLoaderFor(order._id, "invoice");
    try {
      const res = await fetch("/api/admin/shipping/invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ orderIds: [order._id] }),
      });
      const data = await res.json();
      if (!res.ok) { showToast(data.error || "Failed to generate invoice", "error"); return; }
      if (data.invoiceUrl) window.open(data.invoiceUrl, "_blank", "noopener,noreferrer");
      else showToast("Invoice generated — check Shiprocket dashboard");
    } finally {
      setLoaderFor(order._id, null);
    }
  };

  const handleCancelShipment = async (order) => {
    const ok = await confirmDialog({
      title: "Cancel Shiprocket Shipment",
      message: `Cancel the courier-side shipment for order ${order.id}? The order itself won't be cancelled here.`,
      confirmLabel: "Cancel Shipment",
    });
    if (!ok) return;

    setLoaderFor(order._id, "cancel");
    try {
      const res = await fetch("/api/admin/shipping/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ orderId: order._id }),
      });
      const data = await res.json();
      if (!res.ok) { showToast(data.error || "Failed to cancel shipment", "error"); return; }
      showToast("Shiprocket shipment cancelled");
      setOrders((prev) =>
        prev.map((o) =>
          o._id === order._id ? { ...o, shiprocket: { ...o.shiprocket, shippingStatus: "CANCELLED" } } : o
        )
      );
    } finally {
      setLoaderFor(order._id, null);
    }
  };

  const handleReturn = async (order) => {
    const ok = await confirmDialog({
      title: "Create Return Shipment",
      message: `Create a reverse pickup for order ${order.id}? This will collect the package from the customer.`,
      confirmLabel: "Create Return",
    });
    if (!ok) return;

    setLoaderFor(order._id, "return");
    try {
      const res = await fetch("/api/admin/shipping/return", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ orderId: order._id }),
      });
      const data = await res.json();
      if (!res.ok) { showToast(data.error || "Failed to create return", "error"); return; }
      showToast(`Return shipment created — ID: ${data.returnOrderId}`);
    } finally {
      setLoaderFor(order._id, null);
    }
  };

  const handleAWBAssigned = (orderId, awbCode, courierName, trackingUrl) => {
    setOrders((prev) =>
      prev.map((o) =>
        o._id === orderId
          ? { ...o, shiprocket: { ...o.shiprocket, awbCode, courierName, trackingUrl, shippingStatus: "AWB_ASSIGNED" } }
          : o
      )
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-start justify-between mb-8">
        <h1 className="text-4xl md:text-5xl font-medium">Shipping</h1>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-800 transition-colors mt-2"
        >
          <RefreshCw size={15} /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-7">
        <div className="relative flex-1 sm:max-w-xs">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order ID or AWB…"
            className="w-full pl-9 pr-4 py-3 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:border-[#19B5D8] transition-colors"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:border-[#19B5D8] transition-colors"
        >
          {STATUS_FILTER_OPTIONS.map((s) => (
            <option key={s} value={s}>{s || "All Statuses"}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="border border-neutral-200/70 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50/70">
              <tr>
                <th className="py-4 px-5 text-left font-medium text-neutral-600">Order</th>
                <th className="py-4 px-5 text-left font-medium text-neutral-600">Customer</th>
                <th className="py-4 px-5 text-left font-medium text-neutral-600 hidden md:table-cell">Order Status</th>
                <th className="py-4 px-5 text-left font-medium text-neutral-600">Shipping Status</th>
                <th className="py-4 px-5 text-left font-medium text-neutral-600 hidden lg:table-cell">AWB / Courier</th>
                <th className="py-4 px-5 text-left font-medium text-neutral-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-14 text-neutral-400">
                    <Loader2 size={22} className="animate-spin mx-auto mb-2" />
                    Loading orders…
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-14 text-neutral-400">No orders found.</td>
                </tr>
              ) : (
                orders.map((order) => {
                  const sr = order.shiprocket || {};
                  const busy = actionLoading[order._id];

                  return (
                    <tr key={order._id} className="hover:bg-neutral-50/40 transition-colors">
                      {/* Order ID */}
                      <td className="py-4 px-5">
                        <span className="font-mono text-neutral-700">{order.id || order._id?.toString().slice(-8)}</span>
                        <p className="text-xs text-neutral-400 mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                        </p>
                      </td>

                      {/* Customer */}
                      <td className="py-4 px-5">
                        <p className="font-medium text-neutral-900">{order.user?.name || "—"}</p>
                        <p className="text-xs text-neutral-500">{order.shippingAddress?.city || ""} {order.shippingAddress?.postalCode || ""}</p>
                      </td>

                      {/* Order Status */}
                      <td className="py-4 px-5 hidden md:table-cell">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${ORDER_STATUS_COLORS[order.orderStatus] || "bg-neutral-100 text-neutral-600"}`}>
                          {order.orderStatus}
                        </span>
                      </td>

                      {/* Shipping Status */}
                      <td className="py-4 px-5">
                        <ShippingBadge status={sr.shippingStatus} />
                        {sr.syncedAt && (
                          <p className="text-[10px] text-neutral-400 mt-1">
                            Synced {new Date(sr.syncedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        )}
                      </td>

                      {/* AWB / Courier */}
                      <td className="py-4 px-5 hidden lg:table-cell">
                        {sr.awbCode ? (
                          <div>
                            <p className="font-mono text-sm">{sr.awbCode}</p>
                            {sr.courierName && <p className="text-xs text-neutral-500">{sr.courierName}</p>}
                          </div>
                        ) : (
                          <span className="text-xs text-neutral-400 italic">—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {/* Step 1: Create Shiprocket order (only if CONFIRMED and not yet pushed) */}
                          {order.orderStatus === "CONFIRMED" && !sr.orderId && (
                            <ActionBtn
                              label="Push to Shiprocket"
                              icon={<Truck size={13} />}
                              loading={busy === "create"}
                              onClick={() => handleCreateShipment(order)}
                              variant="primary"
                            />
                          )}

                          {/* Step 2: Assign AWB */}
                          {sr.shipmentId && !sr.awbCode && (
                            <ActionBtn
                              label="Assign Courier"
                              icon={<Package size={13} />}
                              loading={busy === "awb"}
                              onClick={() => setCourierOrder(order)}
                            />
                          )}

                          {/* Step 3: Request pickup */}
                          {sr.awbCode && !sr.pickupStatus && (
                            <ActionBtn
                              label="Schedule Pickup"
                              icon={<MapPin size={13} />}
                              loading={busy === "pickup"}
                              onClick={() => handlePickup(order)}
                            />
                          )}

                          {/* Print label */}
                          {sr.shipmentId && (
                            <ActionBtn
                              label={sr.labelUrl ? "Label ↗" : "Print Label"}
                              icon={<Printer size={13} />}
                              loading={busy === "label"}
                              onClick={sr.labelUrl ? () => window.open(sr.labelUrl, "_blank", "noopener,noreferrer") : () => handleLabel(order)}
                            />
                          )}

                          {/* Invoice */}
                          {sr.orderId && (
                            <ActionBtn
                              label={sr.invoiceUrl ? "Invoice ↗" : "Invoice"}
                              icon={<FileText size={13} />}
                              loading={busy === "invoice"}
                              onClick={sr.invoiceUrl ? () => window.open(sr.invoiceUrl, "_blank", "noopener,noreferrer") : () => handleInvoice(order)}
                            />
                          )}

                          {/* Track */}
                          {sr.awbCode && (
                            <ActionBtn
                              label="Track"
                              icon={<Search size={13} />}
                              onClick={() => setTrackingOrder(order)}
                            />
                          )}

                          {/* Return */}
                          {order.orderStatus === "DELIVERED" && (
                            <ActionBtn
                              label="Return"
                              icon={<RotateCcw size={13} />}
                              loading={busy === "return"}
                              onClick={() => handleReturn(order)}
                              variant="warn"
                            />
                          )}

                          {/* Cancel shipment */}
                          {sr.orderId && !["DELIVERED", "CANCELLED"].includes(order.orderStatus) && sr.shippingStatus !== "CANCELLED" && (
                            <ActionBtn
                              label="Cancel"
                              icon={<X size={13} />}
                              loading={busy === "cancel"}
                              onClick={() => handleCancelShipment(order)}
                              variant="danger"
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Courier dialog */}
      <AnimatePresence>
        {courierOrder && (
          <CourierDialog
            key="courier-dialog"
            order={courierOrder}
            onClose={() => setCourierOrder(null)}
            onAssigned={(awb, courierName, trackingUrl) =>
              handleAWBAssigned(courierOrder._id, awb, courierName, trackingUrl)
            }
          />
        )}
      </AnimatePresence>

      {/* Tracking drawer */}
      <AnimatePresence>
        {trackingOrder && (
          <TrackingDrawer
            key="tracking-drawer"
            order={trackingOrder}
            onClose={() => setTrackingOrder(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Reusable action button ────────────────────────────────────────────────────

function ActionBtn({ label, icon, loading, onClick, variant = "default" }) {
  const base = "inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-50";
  const variants = {
    default: "bg-neutral-100 text-neutral-700 hover:bg-neutral-200",
    primary: "bg-[#19B5D8] text-white hover:bg-[#1297B5]",
    warn: "bg-amber-50 text-amber-700 hover:bg-amber-100",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
  };

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`${base} ${variants[variant]}`}
    >
      {loading ? <Loader2 size={13} className="animate-spin" /> : icon}
      {label}
    </button>
  );
}
