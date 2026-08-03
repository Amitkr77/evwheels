"use client";

import { useState } from "react";
import {
    Home,
    ShoppingCart,
    Package,
    Ticket,
    Star,
    Bell,
    LogOut,
    LayoutGrid,
    BarChart3,
    Warehouse,
    Layers,
    Layers3,
    Menu,
    X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";


export default function AdminDashboardLayout({ children }) {
    const { isAuthenticated, user, logout, isLoading } = useAuthStore();

    const router = useRouter();
    const currentPath = usePathname();
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    const sidebarItems = [
        { icon: Home, label: "Dashboard", path: "/admin/dashboard" },
        { icon: ShoppingCart, label: "Orders", path: "/admin/dashboard/orders", },
        { icon: Package, label: "Products", path: "/admin/dashboard/products" },
        { icon: Layers3, label: "Segments", path: "/admin/dashboard/segments" },
        { icon: LayoutGrid, label: "Categories", path: "/admin/dashboard/categories" },
        { icon: Layers, label: "Subcategories", path: "/admin/dashboard/subcategories" },
        { icon: Ticket, label: "Coupons", path: "/admin/dashboard/coupons" },
        { icon: Star, label: "Reviews", path: "/admin/dashboard/reviews", },
        { icon: Warehouse, label: "Inventory", path: "/admin/dashboard/inventory" },
        { icon: BarChart3, label: "Reports", path: "/admin/dashboard/reports" },
    ];

    const goTo = (path) => {
        router.push(path);
        setMobileNavOpen(false);
    };

    const SidebarNav = () => (
        <nav className="p-6 space-y-1 flex-1">
            {sidebarItems.map((item) => {
                const isActive =
                    currentPath === item.path || currentPath?.startsWith(item.path + "/");
                return (
                    <button
                        key={item.path}
                        onClick={() => goTo(item.path)}
                        className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium rounded-lg transition-colors ${isActive
                            ? "bg-[#DDF8FD]/60 text-[#19B5D8]"
                            : "text-neutral-700 hover:bg-neutral-50/80"
                            }`}
                    >
                        <item.icon size={20} strokeWidth={1.6} />
                        {item.label}
                        {item.badge && (
                            <span className="ml-auto px-2.5 py-1 text-xs font-medium bg-[#DDF8FD] text-[#19B5D8] rounded-full">
                                {item.badge}
                            </span>
                        )}
                    </button>
                );
            })}
        </nav>
    );

    const SidebarFooter = () => (
        <div className="p-6 border-t border-neutral-200/60">
            <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-[#19B5D8] rounded-full flex items-center justify-center text-white font-semibold text-base shrink-0">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="font-medium text-neutral-900 truncate">
                        {user?.name || "Admin"}
                    </div>
                    <div className="text-xs text-[#19B5D8] flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-[#19B5D8] rounded-full animate-pulse" />
                        Online
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="text-neutral-500 hover:text-red-600 transition-colors"
                    aria-label="Logout"
                >
                    <LogOut size={20} />
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-['Inter'] flex">
            {/* ─── Sidebar (desktop) ─── */}
            <aside className="fixed inset-y-0 left-0 w-72 bg-white border-r border-neutral-200/70 overflow-y-auto hidden lg:flex flex-col">
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

                <SidebarNav />
                <SidebarFooter />
            </aside>

            {/* ─── Sidebar (mobile drawer) ─── */}
            <AnimatePresence>
                {mobileNavOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                            onClick={() => setMobileNavOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 28, stiffness: 280 }}
                            className="fixed inset-y-0 left-0 w-72 bg-white z-50 flex flex-col lg:hidden"
                        >
                            <div className="p-6 border-b border-neutral-200/60 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-[#19B5D8] flex items-center justify-center text-white font-semibold text-lg shadow-sm">
                                        E
                                    </div>
                                    <span className="text-xl font-medium tracking-tight text-neutral-900">
                                        EVWheels
                                    </span>
                                </div>
                                <button
                                    onClick={() => setMobileNavOpen(false)}
                                    aria-label="Close menu"
                                    className="text-neutral-400 hover:text-neutral-700"
                                >
                                    <X size={22} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto">
                                <SidebarNav />
                            </div>
                            <SidebarFooter />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* ─── Main Content ─── */}
            <div className="flex-1 lg:ml-72 min-h-screen flex flex-col">
                {/* Topbar */}
                <header className="h-16 bg-white border-b border-neutral-200/70 flex items-center px-6 lg:px-12 justify-between">
                    <button
                        onClick={() => setMobileNavOpen(true)}
                        aria-label="Open menu"
                        className="lg:hidden text-neutral-600 hover:text-neutral-900"
                    >
                        <Menu size={22} />
                    </button>

                    <div className="flex items-center justify-end gap-6 w-full">
                        <div className="flex items-center gap-6">
                            <div className="relative cursor-pointer">
                                <Bell size={20} className="text-neutral-600" />
                            </div>

                            {/* Profile */}
                            <div className="flex items-center gap-3">
                                <div className="text-right hidden sm:block">
                                    <div className="text-sm font-medium text-neutral-900">
                                        {user?.name?.split(" ")[0] || "Admin"}
                                    </div>
                                    <div className="text-xs text-neutral-500">
                                        {user?.email || "admin"}
                                    </div>
                                </div>
                                <div className="w-9 h-9 bg-[#19B5D8] rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0">
                                    {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                                </div>
                            </div>
                        </div>

                    </div>
                </header>

                {/* Main children */}
                <main className="flex-1 overflow-y-auto p-6">{children}</main>
            </div>
        </div>
    );
}
