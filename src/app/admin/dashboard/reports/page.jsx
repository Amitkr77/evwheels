"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Package,
  DollarSign,
  ShoppingBag,
  Award,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  BoxIcon,
  CircleDollarSign,
  Activity,
} from "lucide-react";

const TABS = [
  { key: "inventory-summary", label: "Inventory Summary", icon: Package },
  { key: "sales", label: "Sales Report", icon: BarChart3 },
  { key: "product-performance", label: "Product Performance", icon: TrendingUp },
  { key: "best-selling", label: "Best Selling", icon: Award },
  { key: "revenue-summary", label: "Revenue Summary", icon: DollarSign },
];

const PERIODS = [
  { key: "7d", label: "7D" },
  { key: "30d", label: "30D" },
  { key: "90d", label: "90D" },
  { key: "1y", label: "1Y" },
];

const formatCurrency = (val) =>
  val != null ? `₹${Number(val).toLocaleString("en-IN")}` : "₹0";

const formatNumber = (val) =>
  val != null ? Number(val).toLocaleString("en-IN") : "0";

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("inventory-summary");
  const [period, setPeriod] = useState("30d");
  const [data, setData] = useState({});
  const [loading, setLoading] = useState({});
  const [productPage, setProductPage] = useState(1);

  // Fetch data for a given report type
  const fetchReport = useCallback(
    async (type) => {
      setLoading((prev) => ({ ...prev, [type]: true }));
      try {
        let url = `/api/admin/reports?type=${type}&period=${period}`;
        if (type === "product-performance") {
          url += `&page=${productPage}&limit=20`;
        }
        if (type === "best-selling") {
          url += `&limit=10`;
        }
        const res = await fetch(url);
        const json = await res.json();
        setData((prev) => ({ ...prev, [type]: json }));
      } catch (err) {
        console.error(`Report fetch error (${type}):`, err);
      } finally {
        setLoading((prev) => ({ ...prev, [type]: false }));
      }
    },
    [period, productPage]
  );

  // Fetch when tab or period changes
  useEffect(() => {
    fetchReport(activeTab);
  }, [activeTab, period, fetchReport]);

  // Re-fetch product-performance on page change
  useEffect(() => {
    if (activeTab === "product-performance") {
      fetchReport("product-performance");
    }
  }, [productPage]);

  const isLoading = loading[activeTab];
  const reportData = data[activeTab];

  // ─── Shared stat card ───
  const StatCard = ({ icon: Icon, title, value, subtitle, color = "emerald" }) => {
    const colorMap = {
      emerald: "bg-[#DDF8FD] text-[#19B5D8]",
      amber: "bg-amber-50 text-amber-700",
      red: "bg-red-50 text-red-700",
      blue: "bg-blue-50 text-blue-700",
      purple: "bg-purple-50 text-purple-700",
      neutral: "bg-neutral-100 text-neutral-700",
    };
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="bg-white border border-neutral-200/70 rounded-xl p-6 hover:border-[#19B5D8]/20 transition-colors"
      >
        <div className="flex items-start justify-between mb-3">
          <span className="text-sm font-light text-neutral-600">{title}</span>
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
            <Icon size={18} strokeWidth={1.6} />
          </div>
        </div>
        <div className="text-2xl font-medium text-neutral-900">{value}</div>
        {subtitle && (
          <div className="mt-2 text-sm font-light text-neutral-500">{subtitle}</div>
        )}
      </motion.div>
    );
  };

  // ─── CSS Bar Chart component ───
  const CSSBarChart = ({ items, valueKey = "revenue", labelKey = "_id", maxBars = 20 }) => {
    const visible = items?.slice(0, maxBars) || [];
    if (!visible.length) {
      return (
        <div className="py-12 text-center text-neutral-400 text-sm">
          No chart data available
        </div>
      );
    }
    const maxVal = Math.max(...visible.map((d) => d[valueKey] || 0), 1);
    return (
      <div className="flex items-end gap-1.5 h-56">
        {visible.map((item, i) => {
          const pct = ((item[valueKey] || 0) / maxVal) * 100;
          const label =
            typeof labelKey === "function"
              ? labelKey(item)
              : item[labelKey] || "";
          const shortLabel = label.length > 5 ? label.slice(5) : label;
          return (
            <div
              key={i}
              className="flex-1 flex flex-col items-center gap-1 min-w-0"
              title={`${label}: ${formatCurrency(item[valueKey])}`}
            >
              <div className="w-full relative" style={{ height: "200px" }}>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${pct}%` }}
                  transition={{ duration: 0.5, delay: i * 0.03 }}
                  className="absolute bottom-0 left-0 right-0 bg-[#19B5D8]/80 hover:bg-[#1297B5] rounded-t transition-colors"
                />
              </div>
              <span className="text-[10px] text-neutral-500 truncate w-full text-center">
                {shortLabel}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  // ═══════════════════════════════════════════════════
  // TAB RENDERERS
  // ═══════════════════════════════════════════════════

  // ─── 1. Inventory Summary ───
  const renderInventorySummary = () => {
    const d = reportData;
    if (!d) return null;
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          <StatCard
            icon={Package}
            title="Total Products"
            value={formatNumber(d.totalProducts)}
            color="emerald"
          />
          <StatCard
            icon={Activity}
            title="Active"
            value={formatNumber(d.activeProducts)}
            color="blue"
          />
          <StatCard
            icon={AlertTriangle}
            title="Out of Stock"
            value={formatNumber(d.outOfStock)}
            color="red"
          />
          <StatCard
            icon={AlertTriangle}
            title="Low Stock"
            value={formatNumber(d.lowStock)}
            color="amber"
          />
          <StatCard
            icon={BoxIcon}
            title="Total Stock Units"
            value={formatNumber(d.totalStock)}
            color="purple"
          />
          <StatCard
            icon={CircleDollarSign}
            title="Inventory Value"
            value={formatCurrency(d.inventoryValue)}
            color="emerald"
          />
        </div>

        {/* Category Breakdown */}
        <div className="bg-white border border-neutral-200/70 rounded-xl p-6 md:p-8 mb-10">
          <h3 className="text-xl font-['Playfair_Display'] font-medium mb-6">
            Category Breakdown
          </h3>
          <div className="border border-neutral-200/60 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-neutral-50/70">
                <tr>
                  <th className="py-4 px-6 text-left text-sm font-medium text-neutral-600">
                    Category
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-neutral-600">
                    Product Count
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-neutral-600">
                    Total Stock
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-neutral-600">
                    Avg Price
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200/60">
                {d.categoryBreakdown?.length ? (
                  d.categoryBreakdown.map((cat, i) => (
                    <tr
                      key={i}
                      className="hover:bg-neutral-50/50 transition-colors"
                    >
                      <td className="py-4 px-6 font-medium">{cat.name}</td>
                      <td className="py-4 px-6">{cat.count}</td>
                      <td className="py-4 px-6">{formatNumber(cat.totalStock)}</td>
                      <td className="py-4 px-6 text-[#19B5D8] font-medium">
                        {formatCurrency(cat.avgPrice)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-6 text-center text-neutral-500"
                    >
                      No categories found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Price Distribution */}
        <div className="bg-white border border-neutral-200/70 rounded-xl p-6 md:p-8">
          <h3 className="text-xl font-['Playfair_Display'] font-medium mb-6">
            Price Distribution
          </h3>
          {d.priceDistribution?.length ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {d.priceDistribution.map((range, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-4 py-3 bg-neutral-50/60 rounded-lg hover:bg-[#DDF8FD]/40 transition-colors"
                >
                  <span className="text-sm font-medium text-neutral-800">
                    {range._id}
                  </span>
                  <span className="px-3 py-1 text-xs font-medium bg-[#DDF8FD] text-[#19B5D8] rounded-full">
                    {range.count} product{range.count !== 1 ? "s" : ""}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-neutral-400 text-sm">No price distribution data</p>
          )}
        </div>
      </motion.div>
    );
  };

  // ─── 2. Sales Report ───
  const renderSalesReport = () => {
    const d = reportData;
    if (!d) return null;
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <StatCard
            icon={DollarSign}
            title="Total Revenue"
            value={formatCurrency(d.totalRevenue)}
            color="emerald"
          />
          <StatCard
            icon={ShoppingBag}
            title="Total Orders"
            value={formatNumber(d.totalOrders)}
            color="blue"
          />
          <StatCard
            icon={TrendingUp}
            title="Avg Order Value"
            value={formatCurrency(d.avgOrderValue)}
            color="purple"
          />
        </div>

        {/* Revenue Chart */}
        <div className="bg-white border border-neutral-200/70 rounded-xl p-6 md:p-8 mb-10">
          <h3 className="text-xl font-['Playfair_Display'] font-medium mb-6">
            Daily Revenue
          </h3>
          <CSSBarChart
            items={d.dailyRevenue}
            valueKey="revenue"
            labelKey="_id"
          />
        </div>

        {/* Orders by Status */}
        <div className="bg-white border border-neutral-200/70 rounded-xl p-6 md:p-8">
          <h3 className="text-xl font-['Playfair_Display'] font-medium mb-6">
            Orders by Status
          </h3>
          {d.byStatus?.length ? (
            <div className="space-y-3">
              {d.byStatus.map((s, i) => {
                const statusColorMap = {
                  Delivered: "bg-[#DDF8FD] text-[#19B5D8]",
                  Shipped: "bg-blue-100 text-blue-700",
                  Processing: "bg-amber-100 text-amber-700",
                  Pending: "bg-neutral-100 text-neutral-700",
                  Cancelled: "bg-red-100 text-red-700",
                  CANCELLED: "bg-red-100 text-red-700",
                };
                const badgeClass =
                  statusColorMap[s._id] || "bg-neutral-100 text-neutral-700";
                return (
                  <div
                    key={i}
                    className="flex items-center justify-between px-4 py-3 bg-neutral-50/60 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${badgeClass}`}
                      >
                        {s._id}
                      </span>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-sm text-neutral-600">
                        {s.count} order{s.count !== 1 ? "s" : ""}
                      </span>
                      <span className="text-sm font-medium text-[#19B5D8]">
                        {formatCurrency(s.revenue)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-neutral-400 text-sm">No status data available</p>
          )}
        </div>
      </motion.div>
    );
  };

  // ─── 3. Product Performance ───
  const renderProductPerformance = () => {
    const d = reportData;
    if (!d) return null;
    const { products, pagination } = d;
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="bg-white border border-neutral-200/70 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-neutral-50/70">
              <tr>
                <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">
                  Product Name
                </th>
                <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">
                  Units Sold
                </th>
                <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">
                  Revenue
                </th>
                <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">
                  Order Count
                </th>
                <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">
                  Current Stock
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200/60">
              {products?.length ? (
                products.map((p, i) => (
                  <tr
                    key={i}
                    className="hover:bg-neutral-50/50 transition-colors"
                  >
                    <td className="py-5 px-6 font-medium max-w-[280px] truncate">
                      {p.name || "Unknown Product"}
                    </td>
                    <td className="py-5 px-6">
                      <span className="text-[#19B5D8] font-medium">
                        {p.totalSold}
                      </span>
                    </td>
                    <td className="py-5 px-6 text-[#19B5D8] font-medium">
                      {formatCurrency(p.revenue)}
                    </td>
                    <td className="py-5 px-6">{p.orderCount}</td>
                    <td className="py-5 px-6">
                      <span
                        className={
                          p.stock != null && p.stock < 10
                            ? "text-red-600 font-medium"
                            : "text-neutral-700"
                        }
                      >
                        {p.stock != null ? p.stock : "—"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="py-8 text-center text-neutral-500"
                  >
                    No product performance data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <span className="text-sm text-neutral-500">
              Page {pagination.page} of {pagination.pages} ({pagination.total}{" "}
              products)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={pagination.page <= 1}
                onClick={() => setProductPage((p) => Math.max(1, p - 1))}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                disabled={pagination.page >= pagination.pages}
                onClick={() => setProductPage((p) => p + 1)}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  // ─── 4. Best Selling ───
  const renderBestSelling = () => {
    const d = reportData;
    if (!d) return null;
    const products = d.products || [];
    const topSold = products.length ? products[0].totalSold : 1;
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {products.length ? (
          <div className="space-y-4">
            {products.map((p, i) => {
              const pct = ((p.totalSold || 0) / topSold) * 100;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                  className="bg-white border border-neutral-200/70 rounded-xl p-5 hover:border-[#19B5D8]/20 transition-colors"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <span
                      className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold ${
                        i === 0
                          ? "bg-[#19B5D8] text-white"
                          : i === 1
                          ? "bg-[#1297B5] text-white"
                          : i === 2
                          ? "bg-[#5CC8E8] text-white"
                          : "bg-neutral-100 text-neutral-600"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {p.name || "Unknown Product"}
                      </div>
                      <div className="text-sm text-neutral-500 mt-0.5">
                        {p.totalSold} units sold &middot;{" "}
                        <span className="text-[#19B5D8] font-medium">
                          {formatCurrency(p.revenue)}
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, delay: i * 0.06 }}
                      className={`h-full rounded-full ${
                        i === 0
                          ? "bg-[#19B5D8]"
                          : i === 1
                          ? "bg-[#1297B5]"
                          : i === 2
                          ? "bg-[#5CC8E8]"
                          : "bg-[#85D9F0]"
                      }`}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white border border-neutral-200/70 rounded-xl p-12 text-center text-neutral-400">
            No best selling data for this period
          </div>
        )}
      </motion.div>
    );
  };

  // ─── 5. Revenue Summary ───
  const renderRevenueSummary = () => {
    const d = reportData;
    if (!d) return null;
    const monthNames = [
      "",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* All-time & Period cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <StatCard
            icon={DollarSign}
            title="All-Time Revenue"
            value={formatCurrency(d.allTime?.total)}
            subtitle={`${formatNumber(d.allTime?.orders)} total orders`}
            color="emerald"
          />
          <StatCard
            icon={TrendingUp}
            title={`Revenue (Last ${period === "7d" ? "7 Days" : period === "30d" ? "30 Days" : period === "90d" ? "90 Days" : "Year"})`}
            value={formatCurrency(d.period?.total)}
            subtitle={`${formatNumber(d.period?.orders)} orders in period`}
            color="blue"
          />
        </div>

        {/* Monthly Revenue Breakdown */}
        <div className="bg-white border border-neutral-200/70 rounded-xl p-6 md:p-8">
          <h3 className="text-xl font-['Playfair_Display'] font-medium mb-6">
            Monthly Revenue Breakdown
          </h3>
          <div className="border border-neutral-200/60 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-neutral-50/70">
                <tr>
                  <th className="py-4 px-6 text-left text-sm font-medium text-neutral-600">
                    Month
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-neutral-600">
                    Revenue
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-neutral-600">
                    Orders
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-neutral-600">
                    Avg Order Value
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200/60">
                {d.monthly?.length ? (
                  [...d.monthly].reverse().map((m, i) => (
                    <tr
                      key={i}
                      className="hover:bg-neutral-50/50 transition-colors"
                    >
                      <td className="py-4 px-6 font-medium">
                        {monthNames[m._id?.month] || m._id?.month}{" "}
                        {m._id?.year}
                      </td>
                      <td className="py-4 px-6 text-[#19B5D8] font-medium">
                        {formatCurrency(m.revenue)}
                      </td>
                      <td className="py-4 px-6">{m.orders}</td>
                      <td className="py-4 px-6">
                        {formatCurrency(
                          m.orders > 0 ? Math.round(m.revenue / m.orders) : 0
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-6 text-center text-neutral-500"
                    >
                      No monthly data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    );
  };

  // ─── Tab content router ───
  const renderTabContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-24">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-[#19B5D8] border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-neutral-500">Loading report...</span>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case "inventory-summary":
        return renderInventorySummary();
      case "sales":
        return renderSalesReport();
      case "product-performance":
        return renderProductPerformance();
      case "best-selling":
        return renderBestSelling();
      case "revenue-summary":
        return renderRevenueSummary();
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
        <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-medium">
          Reports &amp; Analytics
        </h1>
      </div>

      {/* Tab Navigation + Period Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto pb-1 -mb-1">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  if (tab.key === "product-performance") setProductPage(1);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-[#19B5D8] text-white shadow-sm"
                    : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                <tab.icon size={16} strokeWidth={1.6} />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">
                  {tab.label.split(" ")[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Period selector */}
        <div className="flex items-center gap-1 bg-neutral-100 rounded-lg p-1">
          {PERIODS.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                period === p.key
                  ? "bg-white text-[#19B5D8] shadow-sm"
                  : "text-neutral-600 hover:text-neutral-800"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">{renderTabContent()}</AnimatePresence>
    </motion.div>
  );
}
