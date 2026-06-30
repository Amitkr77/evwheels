"use client";

import React, { useEffect, useState } from "react";
import {
  Home,
  Package,
  Heart,
  MapPin,
  User,
  LogOut,
  ShoppingBag,
  ArrowRight,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";

import Myorders from "@/components/user/Myorders";
import Wishlist from "@/components/user/Wishlist";
import Address from "@/components/user/Address";
import Settings from "@/components/user/Settings";

const TABS = [
  { icon: LayoutDashboard, label: "Overview",  id: 0 },
  { icon: Package,         label: "My Orders", id: 1 },
  { icon: Heart,           label: "Wishlist",  id: 2 },
  { icon: MapPin,          label: "Addresses", id: 3 },
  { icon: User,            label: "Profile",   id: 4 },
];

const UserDashboard = () => {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const [activeTab, setActiveTab]   = useState(0);
  const [visited,   setVisited]     = useState(new Set([0]));
  const [dashboard, setDashboard]   = useState(null);
  const [loading,   setLoading]     = useState(true);

  const handleTabChange = (id) => {
    setVisited((prev) => new Set([...prev, id]));
    setActiveTab(id);
  };

  useEffect(() => {
    fetch("/api/user/dashboard", { credentials: "include" })
      .then((res) => { if (!res.ok) throw new Error(); return res.json(); })
      .then(setDashboard)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const formatCurrency = (n) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(n);

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-IN", {
      month: "short", day: "numeric", year: "numeric",
    });

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const getStatusStyle = (status) =>
    ({
      DELIVERED: "bg-[#DDF8FD] text-[#19B5D8]",
      SHIPPED:   "bg-blue-50 text-blue-700",
      PLACED:    "bg-amber-50 text-amber-700",
      CONFIRMED: "bg-indigo-50 text-indigo-700",
      CANCELLED: "bg-red-50 text-red-600",
    }[status] || "bg-neutral-100 text-neutral-600");

  const handleLogout = async () => {
    if (confirm("Sign out of your account?")) {
      await logout();
      router.push("/account/login");
    }
  };

  const user         = dashboard?.user        || {};
  const stats        = dashboard?.stats        || {};
  const recentOrders = dashboard?.recentOrders || [];

  const statCards = [
    { label: "Total Spent",   value: formatCurrency(stats.totalSpent || 0), icon: ShoppingBag },
    { label: "Total Orders",  value: stats.totalOrders  || 0,               icon: Package },
    { label: "Wishlist Items",value: stats.wishlistItems || 0,               icon: Heart },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-['Inter']">

      {/* ── Sidebar ─────────────────────────────────────── */}
      <aside className="fixed inset-y-0 left-0 w-60 bg-white border-r border-neutral-200/70 hidden lg:flex flex-col z-30">

        {/* Logo → links to home */}
        <div className="px-5 py-5 border-b border-neutral-200/60">
          <Link href="/" className="flex items-center gap-3 group w-fit">
            <div className="w-8 h-8 rounded-lg bg-[#19B5D8] flex items-center justify-center text-white font-bold text-base shadow-sm shrink-0">
              E
            </div>
            <span className="text-base font-semibold tracking-tight text-neutral-900 group-hover:text-[#19B5D8] transition-colors duration-150">
              EVWheels
            </span>
          </Link>
        </div>

        {/* Nav tabs */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl transition-all ${
                activeTab === tab.id
                  ? "bg-[#DDF8FD] text-[#19B5D8]"
                  : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
              }`}
            >
              <tab.icon size={17} strokeWidth={1.9} />
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="p-3 border-t border-neutral-200/60 space-y-0.5">
          <Link
            href="/"
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 rounded-xl transition-all"
          >
            <Home size={17} strokeWidth={1.9} />
            Back to Store
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50/80 rounded-xl transition-all"
          >
            <LogOut size={17} strokeWidth={1.9} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────── */}
      <div className="lg:ml-60 min-h-screen flex flex-col">

        {/* Top bar */}
        <header className="fixed top-0 left-0 right-0 lg:left-60 h-14 bg-white/95 backdrop-blur-sm border-b border-neutral-200/70 flex items-center px-5 lg:px-8 justify-between z-20">
          {/* Mobile: brand logo → home */}
          <Link href="/" className="flex items-center gap-2 lg:hidden">
            <div className="w-7 h-7 rounded-lg bg-[#19B5D8] flex items-center justify-center text-white font-bold text-sm">
              E
            </div>
            <span className="text-base font-semibold text-neutral-900 tracking-tight">EVWheels</span>
          </Link>

          {/* Desktop: breadcrumb label */}
          <span className="hidden lg:block text-sm text-neutral-400 font-light">My Account</span>

          {/* User identity */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-neutral-900 leading-none">{user.name || ""}</p>
              <p className="text-xs text-neutral-400 mt-0.5">{user.email || ""}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#19B5D8] flex items-center justify-center text-white text-sm font-semibold ring-2 ring-[#DDF8FD]">
              {user.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
          </div>
        </header>

        {/* Content area — pb-24 on mobile for bottom nav clearance */}
        <main className="flex-1 p-5 pt-20 pb-24 lg:p-10 lg:pt-20 lg:pb-10 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-72 gap-4">
              <div className="w-10 h-10 border-[3px] border-[#DDF8FD] border-t-[#19B5D8] rounded-full animate-spin" />
              <p className="text-sm text-neutral-500">Loading your dashboard…</p>
            </div>
          ) : (
            <>
              {/* ── Overview ──────────────────────────────────── */}
              {activeTab === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium mb-1">
                    {getGreeting()},{" "}
                    <span className="text-neutral-700">{user.name?.split(" ")[0] || "there"}</span>
                  </h1>
                  <p className="text-sm text-neutral-400 font-light mb-8">
                    Here's what's happening with your account.
                  </p>

                  {/* Stat cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                    {statCards.map((stat, i) => (
                      <div
                        key={i}
                        className="bg-white border border-neutral-200/70 rounded-2xl p-5 hover:border-[#19B5D8]/30 transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                              {stat.label}
                            </p>
                            <p className="text-2xl sm:text-3xl font-medium mt-2 text-neutral-900">
                              {stat.value}
                            </p>
                          </div>
                          <div className="w-10 h-10 bg-[#DDF8FD] rounded-xl flex items-center justify-center shrink-0">
                            <stat.icon size={20} className="text-[#19B5D8]" strokeWidth={1.7} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Recent orders */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-neutral-900">Recent Orders</h2>
                      <button
                        onClick={() => handleTabChange(1)}
                        className="flex items-center gap-1 text-sm text-[#19B5D8] font-medium hover:underline"
                      >
                        View all <ArrowRight size={14} />
                      </button>
                    </div>

                    {recentOrders.length === 0 ? (
                      <div className="bg-white border border-neutral-200/70 rounded-2xl p-12 text-center">
                        <Package size={28} className="text-neutral-300 mx-auto mb-3" strokeWidth={1.4} />
                        <p className="text-sm text-neutral-400">No orders yet</p>
                      </div>
                    ) : (
                      <div className="bg-white border border-neutral-200/70 rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full min-w-[500px]">
                            <thead>
                              <tr className="border-b border-neutral-100">
                                <th className="px-5 py-3.5 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                                  Order
                                </th>
                                <th className="px-5 py-3.5 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wide hidden sm:table-cell">
                                  Date
                                </th>
                                <th className="px-5 py-3.5 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                                  Status
                                </th>
                                <th className="px-5 py-3.5 text-right text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                                  Amount
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-50">
                              {recentOrders.map((order) => (
                                <tr key={order._id} className="hover:bg-neutral-50/60 transition-colors">
                                  <td className="px-5 py-4">
                                    <p className="text-sm font-medium text-neutral-900">{order.id}</p>
                                    <p className="text-xs text-neutral-400 sm:hidden mt-0.5">
                                      {formatDate(order.createdAt)}
                                    </p>
                                  </td>
                                  <td className="px-5 py-4 text-sm text-neutral-500 hidden sm:table-cell">
                                    {formatDate(order.createdAt)}
                                  </td>
                                  <td className="px-5 py-4">
                                    <span
                                      className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${getStatusStyle(order.orderStatus)}`}
                                    >
                                      {order.orderStatus}
                                    </span>
                                  </td>
                                  <td className="px-5 py-4 text-right">
                                    <p className="text-sm font-semibold text-neutral-900">
                                      {formatCurrency(order.totalAmount)}
                                    </p>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Other tabs — keep mounted after first visit */}
              {[
                { id: 1, el: <Myorders /> },
                { id: 2, el: <Wishlist /> },
                { id: 3, el: <Address /> },
                { id: 4, el: <Settings /> },
              ].map(({ id, el }) =>
                visited.has(id) ? (
                  <div key={id} className={activeTab === id ? "" : "hidden"}>
                    {el}
                  </div>
                ) : null
              )}
            </>
          )}
        </main>
      </div>

      {/* ── Mobile Bottom Tab Bar ───────────────────────── */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200/70 flex items-center lg:hidden z-30">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex-1 flex flex-col items-center gap-1 py-2.5 transition-colors ${
              activeTab === tab.id ? "text-[#19B5D8]" : "text-neutral-400 hover:text-neutral-600"
            }`}
          >
            <tab.icon size={19} strokeWidth={1.9} />
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default UserDashboard;
