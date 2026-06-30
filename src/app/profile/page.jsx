"use client";

import React, { useEffect, useState } from "react";
import {
  Home,
  Package,
  Heart,
  MapPin,
  User,
  LogOut,
  Bell,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";

import Myorders from "@/components/user/Myorders";
import Wishlist from "@/components/user/Wishlist";
import Address from "@/components/user/Address";
import Settings from "@/components/user/Settings";

const UserDashboard = () => {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const [activeTab, setActiveTab] = useState(0);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const res = await fetch("/api/user/dashboard", {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch dashboard");
      const data = await res.json();
      setDashboard(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // ─── Helpers ───
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const getStatusStyle = (status) => {
    const styles = {
      DELIVERED: "bg-[#DDF8FD] text-[#19B5D8]",
      SHIPPED: "bg-blue-50 text-blue-700",
      PLACED: "bg-amber-50 text-amber-700",
      Pending: "bg-yellow-50 text-yellow-700",
      CONFIRMED: "bg-indigo-50 text-indigo-700",
      CANCELLED: "bg-red-50 text-red-700",
    };
    return styles[status] || "bg-neutral-100 text-neutral-700";
  };

  const user = dashboard?.user || {};
  const stats = dashboard?.stats || {};
  const recentOrders = dashboard?.recentOrders || [];

  const statCards = [
    {
      label: "Total Spent",
      value: formatCurrency(stats.totalSpent || 0),
      icon: ShoppingBag,
    },
    { label: "Total Orders", value: stats.totalOrders || 0, icon: Package },
    { label: "Wishlist", value: stats.wishlistItems || 0, icon: Heart },
  ];

  return (
    <div className="h-screen bg-[#F8FAFC] font-['Inter']">
      {/* Sidebar unchanged */}
      <aside className="fixed inset-y-0 left-0 w-72 bg-white border-r border-neutral-200/70 overflow-y-auto hidden lg:block">
        {/* ... same sidebar code as before ... */}
        <div className="p-8 border-b border-neutral-200/60">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#19B5D8] flex items-center justify-center text-white font-semibold text-2xl shadow-sm">
              E
            </div>
            <span className="text-2xl font-medium tracking-tight text-neutral-900">
              EVWheels
            </span>
          </div>
        </div>

        <nav className="p-6 space-y-1">
          {[
            { icon: Home, label: "Overview", id: 0 },
            { icon: Package, label: "My Orders", id: 1 },
            { icon: Heart, label: "Wishlist", id: 2 },
            { icon: MapPin, label: "Addresses", id: 3 },
            { icon: User, label: "Profile", id: 4 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium rounded-2xl transition-all ${
                activeTab === tab.id
                  ? "bg-[#DDF8FD] text-[#19B5D8] shadow-sm"
                  : "text-neutral-700 hover:bg-neutral-50"
              }`}
            >
              <tab.icon size={20} strokeWidth={1.8} />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-neutral-200/60 mt-auto">
          <button
            onClick={async () => {
              if (confirm("Are you sure you want to logout?")) {
                await logout();
                router.push("/account/login");
              }
            }}
            className="w-full flex items-center justify-center gap-3 py-3.5 text-red-700 hover:bg-red-50 rounded-2xl transition-all font-medium"
          >
            <LogOut size={20} strokeWidth={1.8} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-72 min-h-screen flex flex-col">
        {/* Top Bar */}
        <header className="fixed top-0 left-0 right-0 lg:left-72 h-16 bg-white border-b border-neutral-200/70 flex items-center px-6 lg:px-12 justify-between z-20">
          {" "}
          <div className="w-full flex justify-end">
            <div className="flex items-center gap-6">
              <div className="relative cursor-pointer">
                <Bell size={20} className="text-neutral-600" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-medium w-4 h-4 flex items-center justify-center rounded-full">
                  3
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-neutral-900">
                    {user.name || ""}
                  </div>
                  <div className="text-xs text-neutral-500">{user.email || ""}</div>
                </div>
                <div className="w-9 h-9 rounded-full border-2 border-white bg-[#19B5D8] flex items-center justify-center text-white text-sm font-medium">
                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y p-6 pt-16 lg:p-12  lg:pt-20">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-96 gap-4">
              <div className="w-12 h-12 border-4 border-[#DDF8FD] border-t-[#19B5D8] rounded-full animate-spin"></div>
              <p className="text-lg text-neutral-600 font-medium">
                Just a moment...
              </p>
              <p className="text-sm text-neutral-400 max-w-xs text-center">
                We're gathering your recent orders, wishlist, and account
                details
              </p>
            </div>
          ) : (
            <>
              {/* OVERVIEW */}
              {activeTab === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <h1 className="text-4xl md:text-5xl font-medium mb-2">
                    {getGreeting()}, {user.name?.split(" ")[0] || "there"}
                  </h1>
                  <p className="text-neutral-600 font-light mb-10">
                    Here's what's happening with your account
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {statCards.map((stat, i) => (
                      <div
                        key={i}
                        className="bg-white border border-neutral-200/70 rounded-3xl p-7 hover:border-[#19B5D8]/20 transition-all group"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-sm font-light text-neutral-500 tracking-wide">
                              {stat.label}
                            </div>
                            <div className="text-4xl font-medium mt-3 text-neutral-900">
                              {stat.value}
                            </div>
                          </div>
                          <div className="w-14 h-14 bg-[#DDF8FD] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <stat.icon
                              size={28}
                              className="text-[#19B5D8]"
                              strokeWidth={1.6}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Recent Orders - Improved Table */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl md:text-3xl font-medium">
                        Recent Orders
                      </h2>
                      <button
                        onClick={() => setActiveTab(1)}
                        className="flex items-center gap-2 text-[#19B5D8] hover:text-[#19B5D8] font-medium transition-colors"
                      >
                        View all orders
                        <ArrowRight size={18} />
                      </button>
                    </div>

                    <div className="bg-white border border-neutral-200/60 rounded-xl overflow-hidden shadow-sm">
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[640px]">
                          <thead>
                            <tr className="bg-neutral-50/70 border-b border-neutral-200">
                              <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-700 tracking-wide">
                                Order
                              </th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-700 tracking-wide">
                                Date
                              </th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-700 tracking-wide hidden md:table-cell">
                                Status
                              </th>
                              <th className="px-6 py-4 text-right text-sm font-semibold text-neutral-700 tracking-wide">
                                Amount
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-100">
                            {recentOrders.length === 0 ? (
                              <tr>
                                <td
                                  colSpan={4}
                                  className="px-6 py-16 text-center text-neutral-500"
                                >
                                  No recent orders found
                                </td>
                              </tr>
                            ) : (
                              recentOrders.map((order, index) => (
                                <tr
                                  key={order._id}
                                  className={`
                  group transition-colors
                  ${index % 2 === 0 ? "bg-white" : "bg-neutral-50/40"}
                  hover:bg-[#DDF8FD]/30
                `}
                                >
                                  <td className="px-6 py-4.5">
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-lg bg-[#DDF8FD]/60 flex items-center justify-center text-[#19B5D8] font-medium text-xs">
                                        #{index + 1}
                                      </div>
                                      <div>
                                        <div className="font-medium text-neutral-900 group-hover:text-[#19B5D8] transition-colors cursor-pointer">
                                          {order.id}
                                        </div>
                                        <div className="text-xs text-neutral-500 md:hidden">
                                          {formatDate(order.createdAt)}
                                        </div>
                                      </div>
                                    </div>
                                  </td>

                                  <td className="px-6 py-4.5 text-sm text-neutral-600 hidden md:table-cell">
                                    {formatDate(order.createdAt)}
                                  </td>

                                  <td className="px-6 py-4.5 hidden md:table-cell">
                                    <span
                                      className={`
                      inline-flex items-center px-3.5 py-1 text-xs font-medium rounded-full
                      border border-current/20
                      ${getStatusStyle(order.orderStatus)}
                    `}
                                    >
                                      {order.orderStatus}
                                    </span>
                                  </td>

                                  <td className="px-6 py-4.5 text-right">
                                    <div className="font-semibold text-neutral-900">
                                      {formatCurrency(order.totalAmount)}
                                    </div>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Mobile-only stacked view */}
                    <div className="md:hidden mt-4 space-y-4">
                      {recentOrders.map((order) => (
                        <div
                          key={order._id + "-mobile"}
                          className="bg-white border border-neutral-200/60 rounded-xl p-5 shadow-sm hover:shadow transition-shadow"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="font-medium text-neutral-900">
                                {order.id}
                              </div>
                              <div className="text-sm text-neutral-500 mt-0.5">
                                {formatDate(order.createdAt)}
                              </div>
                            </div>
                            <span
                              className={`
              inline-flex px-3.5 py-1 text-xs font-medium rounded-full
              border border-current/20 ${getStatusStyle(order.orderStatus)}
            `}
                            >
                              {order.orderStatus}
                            </span>
                          </div>

                          <div className="flex justify-between items-center pt-3 border-t border-neutral-100">
                            <div className="text-sm text-neutral-600">
                              Total
                            </div>
                            <div className="font-semibold text-lg text-neutral-900">
                              {formatCurrency(order.totalAmount)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Other tabs */}
              {activeTab === 1 && <Myorders />}
              {activeTab === 2 && <Wishlist />}
              {activeTab === 3 && <Address />}
              {activeTab === 4 && <Settings />}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
