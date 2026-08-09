"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Package,
  DollarSign,
  Award,
  RefreshCw,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

const STATUS_COLORS = {
  PLACED:     "#19B5D8",
  CONFIRMED:  "#1297B5",
  PROCESSING: "#f59e0b",
  SHIPPED:    "#3b82f6",
  DELIVERED:  "#10b981",
  CANCELLED:  "#ef4444",
};

const STATUS_BADGE = {
  PLACED:     "bg-[#DDF8FD] text-[#19B5D8]",
  CONFIRMED:  "bg-[#DDF8FD] text-[#0C7290]",
  PROCESSING: "bg-amber-100 text-amber-700",
  SHIPPED:    "bg-blue-100 text-blue-700",
  DELIVERED:  "bg-emerald-100 text-emerald-700",
  CANCELLED:  "bg-red-100 text-red-600",
};

const Skeleton = ({ className = "" }) => (
  <div className={`bg-neutral-100 rounded-xl animate-pulse ${className}`} />
);

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [orderStatus, setOrderStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [period, setPeriod] = useState("7d");

  const fetchDashboard = async () => {
    setLoading(true);
    setFetchError(false);
    try {
      const [dashRes, salesRes] = await Promise.all([
        fetch(`/api/admin/dashboard?period=${period}`, { credentials: "include" }),
        fetch(`/api/admin/reports?type=sales&period=30d`, { credentials: "include" }),
      ]);
      if (!dashRes.ok) throw new Error("Failed to load dashboard");
      const [dashData, salesData] = await Promise.all([dashRes.json(), salesRes.json()]);
      setDashboard(dashData);
      setOrderStatus(salesData.byStatus || []);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboard(); }, [period]);

  // ─── KPI cards ───
  const kpis = [
    {
      label: "Total Revenue",
      value: `₹${dashboard?.stats?.totalRevenue?.toLocaleString("en-IN") || 0}`,
      sub: `${(dashboard?.insights?.revenueGrowth || 0) >= 0 ? "+" : ""}${dashboard?.insights?.revenueGrowth || 0}% vs yesterday`,
      trend: (dashboard?.insights?.revenueGrowth || 0) >= 0 ? "up" : "down",
      icon: DollarSign,
      iconBg: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Total Orders",
      value: dashboard?.stats?.totalOrders || 0,
      sub: `${dashboard?.insights?.pendingOrders || 0} pending`,
      trend: "neutral",
      icon: ShoppingCart,
      iconBg: "bg-blue-50 text-blue-600",
    },
    {
      label: "Products",
      value: dashboard?.stats?.totalProducts || 0,
      sub: `${dashboard?.stats?.lowStock || 0} low stock`,
      trend: (dashboard?.stats?.lowStock || 0) > 0 ? "down" : "neutral",
      icon: Package,
      iconBg: "bg-amber-50 text-amber-600",
    },
    {
      label: "Top Product",
      value: dashboard?.insights?.topSellingProduct?.name || "—",
      sub: `${dashboard?.insights?.topSellingProduct?.sold || 0} units sold`,
      trend: "neutral",
      icon: Award,
      iconBg: "bg-purple-50 text-purple-600",
      isText: true,
    },
  ];

  // ─── Bar chart (revenue) ───
  const barData = {
    labels: dashboard?.revenueChart?.map((d) => d.label) || [],
    datasets: [
      {
        label: "Revenue (₹)",
        data: dashboard?.revenueChart?.map((d) => d.revenue) || [],
        backgroundColor: "rgba(25,181,216,0.7)",
        hoverBackgroundColor: "#19B5D8",
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#0c4a6e",
        padding: 10,
        displayColors: false,
        callbacks: { label: (ctx) => "₹" + ctx.raw.toLocaleString("en-IN") },
      },
    },
    scales: {
      y: {
        grid: { color: "#f3f4f6" },
        border: { color: "transparent" },
        ticks: {
          color: "#9ca3af",
          font: { size: 11 },
          callback: (v) => v >= 1000 ? "₹" + Math.round(v / 1000) + "k" : "₹" + v,
        },
      },
      x: {
        grid: { display: false },
        border: { color: "#f3f4f6" },
        ticks: { color: "#9ca3af", font: { size: 11 } },
      },
    },
  };

  // ─── Doughnut chart (orders by status) ───
  const doughnutData = {
    labels: orderStatus.map((s) => s._id || s.status || "Unknown"),
    datasets: [
      {
        data: orderStatus.map((s) => s.count),
        backgroundColor: orderStatus.map(
          (s) => STATUS_COLORS[s._id] || STATUS_COLORS[s.status] || "#e5e7eb"
        ),
        borderWidth: 2,
        borderColor: "#fff",
        hoverOffset: 4,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 10,
          boxHeight: 10,
          usePointStyle: true,
          padding: 12,
          font: { size: 11 },
          color: "#4b5563",
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.label}: ${ctx.raw} orders`,
        },
      },
    },
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-7">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">{getGreeting()}</h1>
          <p className="text-neutral-500 text-sm mt-0.5">
            Here&rsquo;s what&rsquo;s happening with your store
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-3 py-2 border border-neutral-200 rounded-lg text-sm text-neutral-700 focus:outline-none focus:border-[#19B5D8] bg-white"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>
          <button
            onClick={fetchDashboard}
            disabled={loading}
            className="p-2 border border-neutral-200 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {fetchError && (
        <div className="mb-5 p-3.5 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm">
          Couldn&rsquo;t load dashboard data. Please refresh the page.
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {loading
          ? Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-28" />)
          : kpis.map((kpi, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
                className="bg-white border border-neutral-100 rounded-2xl p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wide">
                    {kpi.label}
                  </span>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${kpi.iconBg}`}>
                    <kpi.icon size={15} />
                  </div>
                </div>
                <div className={`font-semibold text-neutral-900 mb-1.5 ${kpi.isText ? "text-sm leading-snug" : "text-2xl"}`}>
                  {kpi.value}
                </div>
                <div className="flex items-center gap-1">
                  {kpi.trend === "up"   && <TrendingUp  size={11} className="text-emerald-500 shrink-0" />}
                  {kpi.trend === "down" && <TrendingDown size={11} className="text-red-500 shrink-0" />}
                  <span className={`text-xs ${
                    kpi.trend === "up"   ? "text-emerald-600" :
                    kpi.trend === "down" ? "text-red-500"     : "text-neutral-500"
                  }`}>
                    {kpi.sub}
                  </span>
                </div>
              </motion.div>
            ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        {/* Bar chart — 2/3 width */}
        <div className="lg:col-span-2 bg-white border border-neutral-100 rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-neutral-900 mb-4">Revenue Overview</h2>
          <div className="h-60">
            {loading
              ? <Skeleton className="h-full" />
              : <Bar data={barData} options={barOptions} />
            }
          </div>
        </div>

        {/* Doughnut — 1/3 width */}
        <div className="bg-white border border-neutral-100 rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-neutral-900 mb-4">
            Orders by Status
            <span className="text-[10px] font-normal text-neutral-400 ml-1">(last 30d)</span>
          </h2>
          <div className="h-60 flex items-center justify-center">
            {loading ? (
              <Skeleton className="w-36 h-36 rounded-full" />
            ) : orderStatus.length ? (
              <Doughnut data={doughnutData} options={doughnutOptions} />
            ) : (
              <p className="text-sm text-neutral-400 text-center">No order data yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white border border-neutral-100 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-100">
          <h2 className="text-sm font-semibold text-neutral-900">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-50/60 border-b border-neutral-100">
                <th className="py-3 px-5 text-left text-[11px] font-semibold text-neutral-400 uppercase tracking-wide">Order ID</th>
                <th className="py-3 px-5 text-left text-[11px] font-semibold text-neutral-400 uppercase tracking-wide">Customer</th>
                <th className="py-3 px-5 text-left text-[11px] font-semibold text-neutral-400 uppercase tracking-wide">Amount</th>
                <th className="py-3 px-5 text-left text-[11px] font-semibold text-neutral-400 uppercase tracking-wide">Status</th>
                <th className="py-3 px-5 text-left text-[11px] font-semibold text-neutral-400 uppercase tracking-wide">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {loading
                ? Array(4).fill(0).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={5} className="px-5 py-3">
                        <Skeleton className="h-5 w-full" />
                      </td>
                    </tr>
                  ))
                : dashboard?.recentOrders?.length
                ? dashboard.recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="py-3.5 px-5 font-mono text-xs text-neutral-500">
                        #{String(order.id || "").slice(-8)}
                      </td>
                      <td className="py-3.5 px-5 font-medium text-neutral-900">{order.name}</td>
                      <td className="py-3.5 px-5 text-neutral-700">
                        ₹{Number(order.amount || 0).toLocaleString("en-IN")}
                      </td>
                      <td className="py-3.5 px-5">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                          STATUS_BADGE[order.status] || "bg-neutral-100 text-neutral-600"
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-neutral-500">
                        {new Date(order.date).toLocaleDateString("en-IN")}
                      </td>
                    </tr>
                  ))
                : (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-neutral-400 text-sm">
                        No recent orders
                      </td>
                    </tr>
                  )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
