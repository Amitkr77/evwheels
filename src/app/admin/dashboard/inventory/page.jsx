"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  AlertTriangle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Plus,
  Minus,
  RefreshCw,
  History,
  Search,
  X,
  Archive,
  BoxesIcon,
  IndianRupee,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";

const TABS = [
  { key: "overview", label: "Overview", icon: Package },
  { key: "low-stock", label: "Low Stock", icon: AlertTriangle },
  { key: "out-of-stock", label: "Out of Stock", icon: AlertCircle },
  { key: "logs", label: "Adjustment Logs", icon: History },
];

const ADJUSTMENT_TYPES = [
  { value: "increase", label: "Increase", icon: TrendingUp, color: "emerald" },
  { value: "decrease", label: "Decrease", icon: TrendingDown, color: "red" },
  { value: "adjustment", label: "Set Stock", icon: ArrowUpDown, color: "blue" },
  { value: "restock", label: "Restock", icon: RefreshCw, color: "amber" },
];

// ─── Helpers ────────────────────────────────────────────────────────────
function formatCurrency(val) {
  return "₹" + Number(val || 0).toLocaleString("en-IN");
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStockStatus(stock, threshold) {
  if (stock === 0) return { label: "Out of Stock", cls: "bg-red-50 text-red-700" };
  if (stock <= threshold) return { label: "Low Stock", cls: "bg-amber-50 text-amber-700" };
  return { label: "In Stock", cls: "bg-emerald-50 text-emerald-700" };
}

function getTypeBadge(type) {
  const map = {
    increase: { label: "Increase", cls: "bg-emerald-50 text-emerald-700" },
    restock: { label: "Restock", cls: "bg-blue-50 text-blue-700" },
    decrease: { label: "Decrease", cls: "bg-red-50 text-red-700" },
    adjustment: { label: "Adjustment", cls: "bg-purple-50 text-purple-700" },
    order_deduction: { label: "Order Deduction", cls: "bg-orange-50 text-orange-700" },
    order_cancel: { label: "Order Cancel", cls: "bg-teal-50 text-teal-700" },
    initial: { label: "Initial", cls: "bg-neutral-100 text-neutral-600" },
  };
  return map[type] || { label: type, cls: "bg-neutral-100 text-neutral-600" };
}

// ─── Skeleton Loader ────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white border border-neutral-200/70 rounded-xl p-6 animate-pulse">
      <div className="h-4 bg-neutral-200 rounded w-24 mb-3" />
      <div className="h-8 bg-neutral-200 rounded w-16 mb-4" />
      <div className="h-3 bg-neutral-200 rounded w-20" />
    </div>
  );
}

function SkeletonTable({ cols = 5, rows = 5 }) {
  return (
    <div className="border border-neutral-200/70 rounded-xl overflow-hidden">
      <div className="bg-neutral-50/70 px-6 py-5 flex gap-6">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-4 bg-neutral-200 rounded flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="px-6 py-6 flex gap-6 border-t border-neutral-200/60">
          {Array.from({ length: cols }).map((_, i) => (
            <div key={i} className="h-4 bg-neutral-100 rounded flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Pagination ─────────────────────────────────────────────────────────
function Pagination({ page, pages, total, onPageChange }) {
  if (pages <= 1) return null;

  const getPageNumbers = () => {
    const nums = [];
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(pages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) nums.push(i);
    return nums;
  };

  return (
    <div className="flex items-center justify-between mt-6">
      <span className="text-sm text-neutral-500">
        {total} result{total !== 1 ? "s" : ""}
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="p-2 rounded-lg hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        {getPageNumbers().map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
              p === page
                ? "bg-emerald-800 text-white"
                : "hover:bg-neutral-100 text-neutral-600"
            }`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pages}
          className="p-2 rounded-lg hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

// ─── Empty State ────────────────────────────────────────────────────────
function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mb-4">
        <Icon size={28} className="text-neutral-400" />
      </div>
      <h3 className="text-lg font-medium text-neutral-700 mb-1">{title}</h3>
      <p className="text-sm text-neutral-400 max-w-xs">{description}</p>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────
export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [summary, setSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(true);

  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [lowStockPagination, setLowStockPagination] = useState({ total: 0, page: 1, limit: 20, pages: 1 });
  const [loadingLowStock, setLoadingLowStock] = useState(false);

  const [outOfStockProducts, setOutOfStockProducts] = useState([]);
  const [outOfStockPagination, setOutOfStockPagination] = useState({ total: 0, page: 1, limit: 20, pages: 1 });
  const [loadingOutOfStock, setLoadingOutOfStock] = useState(false);

  const [logs, setLogs] = useState([]);
  const [logsPagination, setLogsPagination] = useState({ total: 0, page: 1, limit: 20, pages: 1 });
  const [loadingLogs, setLoadingLogs] = useState(false);

  const [threshold, setThreshold] = useState(10);
  const [thresholdInput, setThresholdInput] = useState("10");

  // Modal state
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [modalDefaultProduct, setModalDefaultProduct] = useState(null);
  const [adjustForm, setAdjustForm] = useState({
    productId: "",
    type: "increase",
    quantity: "",
    reason: "",
  });
  const [productSearch, setProductSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchingProducts, setSearchingProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [adjustError, setAdjustError] = useState("");
  const [adjustSuccess, setAdjustSuccess] = useState("");

  // ─── Fetch Summary ──────────────────────────────────────────────────
  const fetchSummary = useCallback(async () => {
    setLoadingSummary(true);
    try {
      const res = await fetch("/api/admin/inventory?type=summary");
      const data = await res.json();
      setSummary(data);
      if (data.lowStockThreshold) {
        setThreshold(data.lowStockThreshold);
        setThresholdInput(String(data.lowStockThreshold));
      }
    } catch (err) {
      console.error("Summary fetch error:", err);
    } finally {
      setLoadingSummary(false);
    }
  }, []);

  // ─── Fetch Low Stock ────────────────────────────────────────────────
  const fetchLowStock = useCallback(async (page = 1) => {
    setLoadingLowStock(true);
    try {
      const res = await fetch(
        `/api/admin/inventory?type=low-stock&threshold=${threshold}&page=${page}&limit=20`
      );
      const data = await res.json();
      setLowStockProducts(data.products || []);
      setLowStockPagination(data.pagination || { total: 0, page: 1, limit: 20, pages: 1 });
    } catch (err) {
      console.error("Low stock fetch error:", err);
    } finally {
      setLoadingLowStock(false);
    }
  }, [threshold]);

  // ─── Fetch Out of Stock ─────────────────────────────────────────────
  const fetchOutOfStock = useCallback(async (page = 1) => {
    setLoadingOutOfStock(true);
    try {
      const res = await fetch(
        `/api/admin/inventory?type=out-of-stock&page=${page}&limit=20`
      );
      const data = await res.json();
      setOutOfStockProducts(data.products || []);
      setOutOfStockPagination(data.pagination || { total: 0, page: 1, limit: 20, pages: 1 });
    } catch (err) {
      console.error("Out of stock fetch error:", err);
    } finally {
      setLoadingOutOfStock(false);
    }
  }, []);

  // ─── Fetch Logs ─────────────────────────────────────────────────────
  const fetchLogs = useCallback(async (page = 1) => {
    setLoadingLogs(true);
    try {
      const res = await fetch(
        `/api/admin/inventory?type=logs&page=${page}&limit=20`
      );
      const data = await res.json();
      setLogs(data.logs || []);
      setLogsPagination(data.pagination || { total: 0, page: 1, limit: 20, pages: 1 });
    } catch (err) {
      console.error("Logs fetch error:", err);
    } finally {
      setLoadingLogs(false);
    }
  }, []);

  // ─── Search Products for Modal ──────────────────────────────────────
  const searchProducts = useCallback(async (query) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }
    setSearchingProducts(true);
    try {
      const res = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=10&admin=true`);
      const data = await res.json();
      setSearchResults(data.products || []);
    } catch (err) {
      console.error("Product search error:", err);
    } finally {
      setSearchingProducts(false);
    }
  }, []);

  // ─── Initial Load ───────────────────────────────────────────────────
  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  useEffect(() => {
    if (activeTab === "low-stock") fetchLowStock(1);
    if (activeTab === "out-of-stock") fetchOutOfStock(1);
    if (activeTab === "logs") fetchLogs(1);
  }, [activeTab, fetchLowStock, fetchOutOfStock, fetchLogs]);

  // ─── Debounced Product Search ───────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      searchProducts(productSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [productSearch, searchProducts]);

  // ─── Stock Adjustment Preview ───────────────────────────────────────
  const getStockPreview = () => {
    if (!selectedProduct) return null;
    const current = selectedProduct.inventory?.stock ?? 0;
    const qty = Number(adjustForm.quantity) || 0;
    let newStock;
    if (adjustForm.type === "increase" || adjustForm.type === "restock") {
      newStock = current + qty;
    } else if (adjustForm.type === "decrease") {
      newStock = Math.max(0, current - qty);
    } else {
      newStock = qty;
    }
    return { current, newStock, change: newStock - current };
  };

  // ─── Handle Adjust Submit ───────────────────────────────────────────
  const handleAdjustSubmit = async () => {
    if (!adjustForm.productId || !adjustForm.type || !adjustForm.quantity) {
      setAdjustError("Please fill all required fields.");
      return;
    }
    setSubmitting(true);
    setAdjustError("");
    setAdjustSuccess("");
    try {
      const res = await fetch("/api/admin/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: adjustForm.productId,
          type: adjustForm.type,
          quantity: Number(adjustForm.quantity),
          reason: adjustForm.reason,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to adjust stock");
      setAdjustSuccess(`Stock updated: ${data.previousStock} → ${data.newStock}`);
      // Refresh data
      fetchSummary();
      if (activeTab === "low-stock") fetchLowStock(lowStockPagination.page);
      if (activeTab === "out-of-stock") fetchOutOfStock(outOfStockPagination.page);
      if (activeTab === "logs") fetchLogs(logsPagination.page);
      // Update selected product in modal
      if (selectedProduct) {
        setSelectedProduct({
          ...selectedProduct,
          inventory: { ...selectedProduct.inventory, stock: data.newStock },
        });
      }
    } catch (err) {
      setAdjustError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Open Quick Adjust Modal ────────────────────────────────────────
  const openQuickAdjust = (product, defaultType = "increase") => {
    setSelectedProduct(product);
    setAdjustForm({
      productId: product._id,
      type: defaultType,
      quantity: "",
      reason: "",
    });
    setProductSearch(product.name || "");
    setSearchResults([]);
    setAdjustError("");
    setAdjustSuccess("");
    setShowAdjustModal(true);
  };

  // ─── Threshold Update ───────────────────────────────────────────────
  const handleThresholdApply = () => {
    const val = Number(thresholdInput);
    if (val > 0) {
      setThreshold(val);
      if (activeTab === "low-stock") fetchLowStock(1);
    }
  };

  // ─── Summary Cards Config ───────────────────────────────────────────
  const summaryCards = summary
    ? [
        {
          title: "Total Products",
          value: summary.totalProducts,
          icon: Package,
          color: "emerald",
          bgIcon: "bg-emerald-50",
          textIcon: "text-emerald-600",
        },
        {
          title: "Active Products",
          value: summary.activeProducts,
          icon: Package,
          color: "emerald",
          bgIcon: "bg-emerald-50",
          textIcon: "text-emerald-600",
        },
        {
          title: "Out of Stock",
          value: summary.outOfStock,
          icon: AlertCircle,
          color: "red",
          bgIcon: "bg-red-50",
          textIcon: "text-red-600",
        },
        {
          title: "Low Stock",
          value: summary.lowStock,
          icon: AlertTriangle,
          color: "amber",
          bgIcon: "bg-amber-50",
          textIcon: "text-amber-600",
        },
        {
          title: "Total Stock Units",
          value: summary.totalStock?.toLocaleString("en-IN"),
          icon: BoxesIcon,
          color: "emerald",
          bgIcon: "bg-emerald-50",
          textIcon: "text-emerald-600",
        },
        {
          title: "Inventory Value",
          value: formatCurrency(summary.inventoryValue),
          icon: IndianRupee,
          color: "emerald",
          bgIcon: "bg-emerald-50",
          textIcon: "text-emerald-600",
        },
        {
          title: "Archived Products",
          value: summary.archivedProducts,
          icon: Archive,
          color: "neutral",
          bgIcon: "bg-neutral-100",
          textIcon: "text-neutral-500",
        },
      ]
    : [];

  // ─── Render Summary Cards ───────────────────────────────────────────
  const renderSummaryCards = () => {
    if (loadingSummary) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4 mb-8">
          {Array.from({ length: 7 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4 mb-8">
        {summaryCards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className="bg-white border border-neutral-200/70 rounded-xl p-5 hover:border-emerald-200/60 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-light text-neutral-500 uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`w-8 h-8 rounded-lg ${card.bgIcon} flex items-center justify-center`}>
                <card.icon size={16} className={card.textIcon} />
              </div>
            </div>
            <div className="text-2xl font-medium text-neutral-900">{card.value}</div>
          </motion.div>
        ))}
      </div>
    );
  };

  // ─── Render Overview Tab ────────────────────────────────────────────
  const renderOverview = () => (
    <div>
      {renderSummaryCards()}

      {/* Threshold Setting */}
      <div className="bg-white border border-neutral-200/70 rounded-xl p-6 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-medium text-neutral-900">Low Stock Threshold</h3>
            <p className="text-sm text-neutral-500 mt-1">
              Products with stock at or below this value are flagged as low stock
            </p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="1"
              value={thresholdInput}
              onChange={(e) => setThresholdInput(e.target.value)}
              className="w-24 px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors text-center text-sm"
            />
            <button
              onClick={handleThresholdApply}
              className="px-5 py-2.5 bg-emerald-800 text-white rounded-lg text-sm font-medium hover:bg-emerald-900 transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      {/* Recent Adjustment Logs */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-['Playfair_Display'] font-medium">
            Recent Adjustments
          </h2>
          <button
            onClick={() => setActiveTab("logs")}
            className="text-sm text-emerald-700 hover:text-emerald-900 font-medium transition-colors"
          >
            View All →
          </button>
        </div>

        {loadingLogs ? (
          <SkeletonTable cols={5} rows={5} />
        ) : logs.length === 0 ? (
          <div className="bg-white border border-neutral-200/70 rounded-xl">
            <EmptyState
              icon={History}
              title="No adjustments yet"
              description="Inventory adjustments will appear here when stock is modified"
            />
          </div>
        ) : (
          <div className="border border-neutral-200/70 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-neutral-50/70">
                <tr>
                  <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">Date</th>
                  <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">Product</th>
                  <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">Type</th>
                  <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">Change</th>
                  <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200/60">
                {logs.slice(0, 10).map((log) => {
                  const badge = getTypeBadge(log.type);
                  return (
                    <tr key={log._id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="py-5 px-6 text-sm text-neutral-600">
                        {formatDate(log.createdAt)}
                      </td>
                      <td className="py-5 px-6 font-medium text-neutral-900 max-w-[200px] truncate">
                        {log.productName}
                      </td>
                      <td className="py-5 px-6">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${badge.cls}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="py-5 px-6 text-sm">
                        {log.type === "decrease" || log.type === "order_deduction" ? (
                          <span className="text-red-600 font-medium">-{log.quantity}</span>
                        ) : log.type === "adjustment" ? (
                          <span className="text-purple-600 font-medium">→ {log.newStock}</span>
                        ) : (
                          <span className="text-emerald-600 font-medium">+{log.quantity}</span>
                        )}
                      </td>
                      <td className="py-5 px-6 text-sm text-neutral-600">
                        {log.previousStock} → {log.newStock}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  // ─── Render Low Stock Tab ───────────────────────────────────────────
  const renderLowStock = () => {
    if (loadingLowStock) return <SkeletonTable cols={6} rows={6} />;

    if (!lowStockProducts.length) {
      return (
        <div className="bg-white border border-neutral-200/70 rounded-xl">
          <EmptyState
            icon={AlertTriangle}
            title="No low stock products"
            description={`All products have stock above ${threshold} units`}
          />
        </div>
      );
    }

    return (
      <div>
        <div className="border border-neutral-200/70 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-neutral-50/70">
              <tr>
                <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">Product Name</th>
                <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">Category</th>
                <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">Current Stock</th>
                <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">MOQ</th>
                <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">Status</th>
                <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200/60">
              {lowStockProducts.map((product) => {
                const stock = product.inventory?.stock ?? 0;
                const moq = product.inventory?.moq ?? 1;
                const status = getStockStatus(stock, threshold);
                return (
                  <tr key={product._id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="py-5 px-6 font-medium text-neutral-900 max-w-[240px] truncate">
                      {product.name}
                    </td>
                    <td className="py-5 px-6 text-sm text-neutral-600">
                      {product.category?.name || "—"}
                    </td>
                    <td className="py-5 px-6">
                      <span className="text-amber-700 font-semibold text-lg">{stock}</span>
                    </td>
                    <td className="py-5 px-6 text-sm text-neutral-600">{moq}</td>
                    <td className="py-5 px-6">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${status.cls}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="py-5 px-6">
                      <button
                        onClick={() => openQuickAdjust(product, "restock")}
                        className="flex items-center gap-1.5 px-4 py-2 bg-emerald-800 text-white rounded-lg text-xs font-medium hover:bg-emerald-900 transition-colors"
                      >
                        <Plus size={14} />
                        Quick Adjust
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <Pagination
          page={lowStockPagination.page}
          pages={lowStockPagination.pages}
          total={lowStockPagination.total}
          onPageChange={(p) => fetchLowStock(p)}
        />
      </div>
    );
  };

  // ─── Render Out of Stock Tab ────────────────────────────────────────
  const renderOutOfStock = () => {
    if (loadingOutOfStock) return <SkeletonTable cols={5} rows={6} />;

    if (!outOfStockProducts.length) {
      return (
        <div className="bg-white border border-neutral-200/70 rounded-xl">
          <EmptyState
            icon={AlertCircle}
            title="No out of stock products"
            description="All products currently have stock available"
          />
        </div>
      );
    }

    return (
      <div>
        <div className="border border-neutral-200/70 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-neutral-50/70">
              <tr>
                <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">Product Name</th>
                <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">Category</th>
                <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">Price</th>
                <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">Status</th>
                <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200/60">
              {outOfStockProducts.map((product) => (
                <tr key={product._id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="py-5 px-6 font-medium text-neutral-900 max-w-[240px] truncate">
                    {product.name}
                  </td>
                  <td className="py-5 px-6 text-sm text-neutral-600">
                    {product.category?.name || "—"}
                  </td>
                  <td className="py-5 px-6 font-medium text-emerald-800">
                    {formatCurrency(product.price?.base ?? 0)}
                  </td>
                  <td className="py-5 px-6">
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-50 text-red-700">
                      Out of Stock
                    </span>
                  </td>
                  <td className="py-5 px-6">
                    <button
                      onClick={() => openQuickAdjust(product, "restock")}
                      className="flex items-center gap-1.5 px-4 py-2 bg-emerald-800 text-white rounded-lg text-xs font-medium hover:bg-emerald-900 transition-colors"
                    >
                      <RefreshCw size={14} />
                      Quick Restock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination
          page={outOfStockPagination.page}
          pages={outOfStockPagination.pages}
          total={outOfStockPagination.total}
          onPageChange={(p) => fetchOutOfStock(p)}
        />
      </div>
    );
  };

  // ─── Render Logs Tab ────────────────────────────────────────────────
  const renderLogs = () => {
    if (loadingLogs) return <SkeletonTable cols={7} rows={8} />;

    if (!logs.length) {
      return (
        <div className="bg-white border border-neutral-200/70 rounded-xl">
          <EmptyState
            icon={History}
            title="No adjustment logs"
            description="Inventory adjustment history will appear here"
          />
        </div>
      );
    }

    return (
      <div>
        <div className="border border-neutral-200/70 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-neutral-50/70">
                <tr>
                  <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">Date</th>
                  <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">Product</th>
                  <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">Type</th>
                  <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">Qty Change</th>
                  <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">Prev Stock</th>
                  <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">New Stock</th>
                  <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">Reason</th>
                  <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">Performed By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200/60">
                {logs.map((log) => {
                  const badge = getTypeBadge(log.type);
                  return (
                    <tr key={log._id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="py-5 px-6 text-sm text-neutral-600 whitespace-nowrap">
                        {formatDate(log.createdAt)}
                      </td>
                      <td className="py-5 px-6 font-medium text-neutral-900 max-w-[180px] truncate">
                        {log.productName}
                      </td>
                      <td className="py-5 px-6">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${badge.cls}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="py-5 px-6 text-sm">
                        {log.type === "decrease" || log.type === "order_deduction" ? (
                          <span className="text-red-600 font-medium flex items-center gap-1">
                            <TrendingDown size={14} /> -{log.quantity}
                          </span>
                        ) : log.type === "adjustment" ? (
                          <span className="text-purple-600 font-medium flex items-center gap-1">
                            <ArrowUpDown size={14} /> → {log.newStock}
                          </span>
                        ) : (
                          <span className="text-emerald-600 font-medium flex items-center gap-1">
                            <TrendingUp size={14} /> +{log.quantity}
                          </span>
                        )}
                      </td>
                      <td className="py-5 px-6 text-sm text-neutral-600">{log.previousStock}</td>
                      <td className="py-5 px-6 text-sm font-medium text-neutral-900">{log.newStock}</td>
                      <td className="py-5 px-6 text-sm text-neutral-500 max-w-[160px] truncate">
                        {log.reason || "—"}
                      </td>
                      <td className="py-5 px-6 text-sm text-neutral-600">
                        {log.performedBy?.name || "System"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <Pagination
          page={logsPagination.page}
          pages={logsPagination.pages}
          total={logsPagination.total}
          onPageChange={(p) => fetchLogs(p)}
        />
      </div>
    );
  };

  // ─── Render Stock Adjustment Modal ──────────────────────────────────
  const renderAdjustModal = () => {
    const preview = getStockPreview();

    return (
      <AnimatePresence>
        {showAdjustModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-lg p-8 md:p-10 overflow-y-auto max-h-[90vh]"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-['Playfair_Display'] font-medium">
                  Stock Adjustment
                </h2>
                <button
                  onClick={() => setShowAdjustModal(false)}
                  className="text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Success / Error Messages */}
              {adjustSuccess && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-sm">
                  {adjustSuccess}
                </div>
              )}
              {adjustError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                  {adjustError}
                </div>
              )}

              {/* Product Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-600 mb-2">
                  Product *
                </label>
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
                  />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => {
                      setProductSearch(e.target.value);
                      if (!e.target.value) {
                        setSelectedProduct(null);
                        setAdjustForm((f) => ({ ...f, productId: "" }));
                      }
                    }}
                    placeholder="Search products..."
                    className="w-full pl-11 pr-4 py-3.5 border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors text-sm"
                  />
                  {searchingProducts && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>

                {/* Search Results Dropdown */}
                {searchResults.length > 0 && !selectedProduct && (
                  <div className="mt-2 border border-neutral-200 rounded-lg max-h-48 overflow-y-auto bg-white shadow-lg">
                    {searchResults.map((p) => (
                      <button
                        key={p._id}
                        onClick={() => {
                          setSelectedProduct(p);
                          setAdjustForm((f) => ({ ...f, productId: p._id }));
                          setProductSearch(p.name);
                          setSearchResults([]);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-neutral-50 transition-colors flex items-center justify-between border-b border-neutral-100 last:border-0"
                      >
                        <div>
                          <div className="text-sm font-medium text-neutral-900">{p.name}</div>
                          <div className="text-xs text-neutral-500">
                            {p.category?.name || "—"} · Stock: {p.inventory?.stock ?? 0}
                          </div>
                        </div>
                        <span className="text-xs text-emerald-700 font-medium">
                          {formatCurrency(p.price?.base ?? 0)}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Selected Product Info */}
                {selectedProduct && (
                  <div className="mt-3 p-4 bg-emerald-50/60 border border-emerald-100 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-neutral-900">
                          {selectedProduct.name}
                        </div>
                        <div className="text-xs text-neutral-500 mt-0.5">
                          {selectedProduct.category?.name || "—"} · SKU: {selectedProduct.sku || "N/A"}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-emerald-800">
                          Stock: {selectedProduct.inventory?.stock ?? 0}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Adjustment Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-600 mb-2">
                  Adjustment Type *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {ADJUSTMENT_TYPES.map((at) => {
                    const isActive = adjustForm.type === at.value;
                    return (
                      <button
                        key={at.value}
                        onClick={() =>
                          setAdjustForm((f) => ({ ...f, type: at.value }))
                        }
                        className={`flex items-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                          isActive
                            ? at.color === "emerald"
                              ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                              : at.color === "red"
                              ? "border-red-300 bg-red-50 text-red-800"
                              : at.color === "blue"
                              ? "border-blue-300 bg-blue-50 text-blue-800"
                              : "border-amber-300 bg-amber-50 text-amber-800"
                            : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
                        }`}
                      >
                        <at.icon size={16} />
                        {at.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-600 mb-2">
                  {adjustForm.type === "adjustment" ? "New Stock Level" : "Quantity"} *
                </label>
                <input
                  type="number"
                  min="0"
                  value={adjustForm.quantity}
                  onChange={(e) =>
                    setAdjustForm((f) => ({ ...f, quantity: e.target.value }))
                  }
                  placeholder={
                    adjustForm.type === "adjustment"
                      ? "Enter new stock level"
                      : "Enter quantity"
                  }
                  className="w-full px-5 py-3.5 border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors text-sm"
                />
              </div>

              {/* Reason */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-600 mb-2">
                  Reason
                </label>
                <textarea
                  value={adjustForm.reason}
                  onChange={(e) =>
                    setAdjustForm((f) => ({ ...f, reason: e.target.value }))
                  }
                  placeholder="Optional reason for this adjustment..."
                  rows={3}
                  className="w-full px-5 py-3.5 border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors text-sm resize-none"
                />
              </div>

              {/* Stock Preview */}
              {preview && adjustForm.quantity && (
                <div className="mb-8 p-4 bg-neutral-50 border border-neutral-200/70 rounded-lg">
                  <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">
                    Stock Change Preview
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-xs text-neutral-500 mb-1">Current</div>
                      <div className="text-xl font-semibold text-neutral-900">
                        {preview.current}
                      </div>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                      {preview.change > 0 ? (
                        <div className="flex items-center gap-1 text-emerald-600">
                          <TrendingUp size={20} />
                          <span className="font-semibold">+{preview.change}</span>
                        </div>
                      ) : preview.change < 0 ? (
                        <div className="flex items-center gap-1 text-red-600">
                          <TrendingDown size={20} />
                          <span className="font-semibold">{preview.change}</span>
                        </div>
                      ) : (
                        <span className="text-neutral-400 text-sm">No change</span>
                      )}
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-neutral-500 mb-1">New</div>
                      <div className="text-xl font-semibold text-emerald-800">
                        {preview.newStock}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  onClick={() => setShowAdjustModal(false)}
                  className="flex-1 py-3.5 text-neutral-600 hover:bg-neutral-100 rounded-lg font-medium transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdjustSubmit}
                  disabled={submitting || !adjustForm.productId || !adjustForm.quantity}
                  className="flex-1 py-3.5 bg-emerald-800 text-white rounded-lg font-medium hover:bg-emerald-900 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <RefreshCw size={16} />
                      Apply Adjustment
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  };

  // ─── Tab Content Rendering ──────────────────────────────────────────
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverview();
      case "low-stock":
        return renderLowStock();
      case "out-of-stock":
        return renderOutOfStock();
      case "logs":
        return renderLogs();
      default:
        return null;
    }
  };

  // ─── Main Render ────────────────────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-medium">
            Inventory
          </h1>
          <p className="text-neutral-500 font-light mt-2">
            Manage stock levels and track inventory changes
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedProduct(null);
            setAdjustForm({ productId: "", type: "increase", quantity: "", reason: "" });
            setProductSearch("");
            setSearchResults([]);
            setAdjustError("");
            setAdjustSuccess("");
            setShowAdjustModal(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-800 text-white rounded-full text-sm font-medium hover:bg-emerald-900 transition-colors"
        >
          <Plus size={18} />
          Adjust Stock
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                isActive
                  ? "bg-emerald-800 text-white shadow-sm"
                  : "text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
              {tab.key === "low-stock" && summary?.lowStock > 0 && (
                <span
                  className={`ml-1 px-2 py-0.5 text-xs font-semibold rounded-full ${
                    isActive ? "bg-white/20 text-white" : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {summary.lowStock}
                </span>
              )}
              {tab.key === "out-of-stock" && summary?.outOfStock > 0 && (
                <span
                  className={`ml-1 px-2 py-0.5 text-xs font-semibold rounded-full ${
                    isActive ? "bg-white/20 text-white" : "bg-red-100 text-red-700"
                  }`}
                >
                  {summary.outOfStock}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {renderTabContent()}

      {/* Stock Adjustment Modal */}
      {renderAdjustModal()}
    </motion.div>
  );
}
