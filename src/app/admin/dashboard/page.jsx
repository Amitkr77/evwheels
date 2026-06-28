"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Line } from "react-chartjs-2";
import { ArrowRight } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function page() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("7d");

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/dashboard?period=${period}`, {
          credentials: "include",
        });
        const data = await res.json();
        setDashboard(data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [period]);

  const stats = [
    {
      title: "Total Revenue",
      value: `₹${dashboard?.stats?.totalRevenue?.toLocaleString("en-IN") || 0}`,
      change: `${dashboard?.insights?.revenueGrowth || 0}% today`,
      color: "emerald",
    },
    {
      title: "Total Orders",
      value: dashboard?.stats?.totalOrders || 0,
      change: `${dashboard?.insights?.pendingOrders || 0} pending`,
      color: "blue",
    },
    {
      title: "Products",
      value: dashboard?.stats?.totalProducts || 0,
      change: `${dashboard?.stats?.lowStock || 0} low stock`,
      color: "amber",
    },
    {
      title: "Top Product",
      value: dashboard?.insights?.topSellingProduct?.name || "—",
      change: `${dashboard?.insights?.topSellingProduct?.sold || 0} sold`,
      color: "yellow",
    },
  ];

  // Sales Chart Data (unchanged)
  const chartData = {
    labels: dashboard?.revenueChart?.map((d) => d.label) || [],
    datasets: [
      {
        label: "Revenue (₹)",
        data: dashboard?.revenueChart?.map((d) => d.revenue) || [],
        borderColor: "#10b981",
        backgroundColor: "rgba(16,185,129,0.08)",
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#064e3b",
        titleFont: { size: 14 },
        bodyFont: { size: 16, weight: "600" },
        displayColors: false,
        callbacks: { label: (ctx) => "₹" + ctx.raw.toLocaleString("en-IN") },
      },
    },
    scales: {
      y: {
        grid: { color: "#e5e7eb" },
        ticks: { callback: (v) => "₹" + v / 1000 + "k" },
      },
      x: { grid: { color: "#e5e7eb" } },
    },
  };

  // Render Recent Orders (Dashboard)
  const renderRecentOrders = () => {
    if (!dashboard?.recentOrders?.length) {
      return (
        <tr>
          <td colSpan="5" className="text-center py-6 text-neutral-500">
            No recent orders
          </td>
        </tr>
      );
    }

    return dashboard.recentOrders.map((order) => (
      <tr key={order.id} className="border-t">
        <td className="py-4 px-6 font-medium">{order.id}</td>
        <td className="py-4 px-6">{order.name}</td>
        <td className="py-4 px-6">₹{order.amount.toLocaleString("en-IN")}</td>
        <td className="py-4 px-6">
          <span className="px-3 py-1 text-xs rounded-full bg-emerald-100 text-emerald-700">
            {order.status}
          </span>
        </td>
        <td className="py-4 px-6">
          {new Date(order.date).toLocaleDateString("en-IN")}
        </td>
      </tr>
    ));
  };
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      // variants={stagger}
    >
      <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-medium mb-3">
        {getGreeting()}
      </h1>
      <p className="text-neutral-600 font-light mb-12">
        Here's what's happening with your store today
      </p>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-16">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            // variants={fadeIn}
            className="bg-white border border-neutral-200/70 rounded-xl p-6 hover:border-emerald-200/60 transition-colors"
          >
            <div className="text-sm font-light text-neutral-600">
              {stat.title}
            </div>
            <div
              className={`text-3xl font-medium mt-2 ${
                stats.value === dashboard?.insights?.topSellingProduct?.name
                  ? "text-3xl"
                  : "text-xl"
              }`}
            >
              {stat.value}
            </div>
            <div
              className={`mt-4 text-sm font-light ${stat.color === "emerald" ? "text-emerald-700" : stat.color === "blue" ? "text-blue-700" : stat.color === "amber" ? "text-amber-700" : "text-yellow-700"}`}
            >
              {stat.change}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Sales Chart */}
      <div className="bg-white border border-neutral-200/70 rounded-xl p-8 mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-['Playfair_Display'] font-medium">
            Sales Overview
          </h2>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 border border-neutral-300 rounded-lg text-sm font-light focus:outline-none focus:border-emerald-600"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>
        </div>
        <div className="h-80">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-['Playfair_Display'] font-medium">
            Recent Orders
          </h2>
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
                  Amount
                </th>
                <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">
                  Status
                </th>
                <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>{renderRecentOrders()}</tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
