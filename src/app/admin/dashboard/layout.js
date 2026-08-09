"use client";

import { useState, useEffect, useRef } from "react";
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
    Image as ImageIcon,
    Sparkles,
    Truck,
    Instagram,
    MonitorPlay,
    AlertTriangle,
    Clock,
    ShoppingBag,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { ToastProvider } from "@/components/admin/Toast";
import { ConfirmDialogProvider, useConfirm } from "@/components/admin/ConfirmDialog";

const NAV_GROUPS = [
    {
        label: "Overview",
        items: [
            { icon: Home, label: "Dashboard", path: "/admin/dashboard" },
        ],
    },
    {
        label: "Content",
        items: [
            { icon: MonitorPlay, label: "Hero Slides",      path: "/admin/dashboard/hero" },
            { icon: ImageIcon,   label: "Banners",          path: "/admin/dashboard/banners" },
            { icon: Sparkles,    label: "Showcase",         path: "/admin/dashboard/showcase" },
            { icon: Instagram,   label: "Instagram Posts",  path: "/admin/dashboard/instagram" },
        ],
    },
    {
        label: "Catalog",
        items: [
            { icon: Package,    label: "Products",      path: "/admin/dashboard/products" },
            { icon: LayoutGrid, label: "Categories",    path: "/admin/dashboard/categories" },
            { icon: Layers,     label: "Subcategories", path: "/admin/dashboard/subcategories" },
            { icon: Layers3,    label: "Segments",      path: "/admin/dashboard/segments" },
        ],
    },
    {
        label: "Commerce",
        items: [
            { icon: ShoppingCart, label: "Orders",   path: "/admin/dashboard/orders" },
            { icon: Truck,        label: "Shipping", path: "/admin/dashboard/shipping" },
            { icon: Ticket,       label: "Coupons",  path: "/admin/dashboard/coupons" },
        ],
    },
    {
        label: "Customers",
        items: [
            { icon: Star, label: "Reviews", path: "/admin/dashboard/reviews" },
        ],
    },
    {
        label: "Analytics",
        items: [
            { icon: BarChart3, label: "Reports",   path: "/admin/dashboard/reports" },
            { icon: Warehouse, label: "Inventory", path: "/admin/dashboard/inventory" },
        ],
    },
];

function NotificationBell() {
    const [open, setOpen] = useState(false);
    const [notifData, setNotifData] = useState(null);
    const [loading, setLoading] = useState(false);
    const ref = useRef(null);

    const fetchNotifications = async () => {
        if (notifData) return;
        setLoading(true);
        try {
            const res = await fetch("/api/admin/dashboard?period=7d", { credentials: "include" });
            if (res.ok) setNotifData(await res.json());
        } catch {}
        setLoading(false);
    };

    const handleToggle = () => {
        const next = !open;
        setOpen(next);
        if (next) fetchNotifications();
    };

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const pendingOrders = notifData?.insights?.pendingOrders || 0;
    const lowStock = notifData?.stats?.lowStock || 0;
    const badgeCount = pendingOrders + lowStock;
    const recentOrders = notifData?.recentOrders?.slice(0, 4) || [];

    return (
        <div ref={ref} className="relative">
            <button
                onClick={handleToggle}
                className="relative w-9 h-9 flex items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
                aria-label="Notifications"
            >
                <Bell size={18} />
                {badgeCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                        {badgeCount > 9 ? "9+" : badgeCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.97 }}
                        transition={{ duration: 0.13 }}
                        className="absolute right-0 top-full mt-2 w-80 bg-white border border-neutral-200 rounded-2xl shadow-xl shadow-neutral-200/60 z-50 overflow-hidden"
                    >
                        <div className="px-4 py-3 border-b border-neutral-100 flex items-center justify-between">
                            <p className="text-sm font-semibold text-neutral-900">Notifications</p>
                            {badgeCount > 0 && (
                                <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-600 text-xs font-semibold">
                                    {badgeCount} alert{badgeCount !== 1 ? "s" : ""}
                                </span>
                            )}
                        </div>

                        {loading ? (
                            <div className="py-8 flex items-center justify-center">
                                <div className="w-5 h-5 border-2 border-[#19B5D8] border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : (
                            <div className="max-h-80 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                {pendingOrders > 0 && (
                                    <div className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 transition-colors">
                                        <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                                            <Clock size={15} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-neutral-900">
                                                {pendingOrders} pending order{pendingOrders !== 1 ? "s" : ""}
                                            </p>
                                            <p className="text-xs text-neutral-500">Waiting for your action</p>
                                        </div>
                                    </div>
                                )}
                                {lowStock > 0 && (
                                    <div className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 transition-colors">
                                        <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                                            <AlertTriangle size={15} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-neutral-900">
                                                {lowStock} low stock item{lowStock !== 1 ? "s" : ""}
                                            </p>
                                            <p className="text-xs text-neutral-500">Running low on inventory</p>
                                        </div>
                                    </div>
                                )}
                                {recentOrders.length > 0 && (
                                    <>
                                        <div className="px-4 py-2 bg-neutral-50 border-t border-neutral-100">
                                            <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">Recent Orders</p>
                                        </div>
                                        {recentOrders.map((o) => (
                                            <div key={o.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-neutral-50 transition-colors">
                                                <div className="w-8 h-8 rounded-lg bg-[#DDF8FD] text-[#19B5D8] flex items-center justify-center shrink-0">
                                                    <ShoppingBag size={14} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-neutral-900 truncate">
                                                        #{String(o.id).slice(-6)}
                                                    </p>
                                                    <p className="text-xs text-neutral-500 truncate">
                                                        {o.name} · ₹{Number(o.amount || 0).toLocaleString("en-IN")}
                                                    </p>
                                                </div>
                                                <span className="text-[10px] px-2 py-0.5 bg-[#DDF8FD] text-[#19B5D8] rounded-full font-medium shrink-0">
                                                    {o.status}
                                                </span>
                                            </div>
                                        ))}
                                    </>
                                )}
                                {!pendingOrders && !lowStock && !recentOrders.length && (
                                    <div className="py-10 text-center text-sm text-neutral-400">
                                        All caught up! 🎉
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function DashboardShell({ children }) {
    const { user, logout } = useAuthStore();
    const confirm = useConfirm();
    const router = useRouter();
    const currentPath = usePathname();
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    const handleLogout = async () => {
        const ok = await confirm({
            title: "Sign out?",
            message: "You'll need to sign in again to access the admin dashboard.",
            confirmLabel: "Sign Out",
            tone: "default",
        });
        if (ok) logout();
    };

    const goTo = (path) => {
        router.push(path);
        setMobileNavOpen(false);
    };

    const isActive = (path) => {
        if (path === "/admin/dashboard") return currentPath === path;
        return currentPath === path || currentPath?.startsWith(path + "/");
    };

    const SidebarContent = () => (
        <>
            {/* Logo */}
            <div className="px-5 py-4 border-b border-neutral-100 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#19B5D8] flex items-center justify-center text-white font-bold text-lg shadow-sm shrink-0">
                        E
                    </div>
                    <div>
                        <p className="text-sm font-semibold tracking-tight text-neutral-900 leading-tight">EVWheels</p>
                        <p className="text-[10px] text-neutral-400 leading-tight">Admin Panel</p>
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {NAV_GROUPS.map((group) => (
                    <div key={group.label}>
                        <p className="px-2 mb-1 text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                            {group.label}
                        </p>
                        <div className="space-y-0.5">
                            {group.items.map((item) => {
                                const active = isActive(item.path);
                                return (
                                    <button
                                        key={item.path}
                                        onClick={() => goTo(item.path)}
                                        className={`w-full flex items-center gap-2.5 px-2.5 py-2 text-sm font-medium rounded-lg transition-all border-l-2 ${
                                            active
                                                ? "bg-[#DDF8FD]/70 text-[#0C7290] border-[#19B5D8]"
                                                : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 border-transparent"
                                        }`}
                                    >
                                        <item.icon size={16} strokeWidth={active ? 2.2 : 1.6} />
                                        {item.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Footer */}
            <div className="px-3 py-3 border-t border-neutral-100 shrink-0">
                <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-neutral-50 transition-colors group">
                    <div className="w-8 h-8 bg-[#19B5D8] rounded-full flex items-center justify-center text-white font-semibold text-xs shrink-0">
                        {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 truncate leading-tight">
                            {user?.name || "Admin"}
                        </p>
                        <p className="text-xs text-neutral-400 truncate leading-tight">
                            {user?.email || ""}
                        </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-neutral-400 hover:text-red-500 transition-colors p-1 opacity-0 group-hover:opacity-100"
                        aria-label="Logout"
                    >
                        <LogOut size={15} />
                    </button>
                </div>
            </div>
        </>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-['Inter'] flex">
            {/* ─── Sidebar (desktop) ─── */}
            <aside className="fixed inset-y-0 left-0 w-60 bg-white border-r border-neutral-100 hidden lg:flex flex-col">
                <SidebarContent />
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
                            className="fixed inset-y-0 left-0 w-60 bg-white z-50 flex flex-col lg:hidden"
                        >
                            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-[#19B5D8] flex items-center justify-center text-white font-bold text-lg shadow-sm">
                                        E
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold tracking-tight text-neutral-900 leading-tight">EVWheels</p>
                                        <p className="text-[10px] text-neutral-400 leading-tight">Admin Panel</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setMobileNavOpen(false)}
                                    aria-label="Close menu"
                                    className="text-neutral-400 hover:text-neutral-700 p-1"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Reuse nav content */}
                            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                {NAV_GROUPS.map((group) => (
                                    <div key={group.label}>
                                        <p className="px-2 mb-1 text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                                            {group.label}
                                        </p>
                                        <div className="space-y-0.5">
                                            {group.items.map((item) => {
                                                const active = isActive(item.path);
                                                return (
                                                    <button
                                                        key={item.path}
                                                        onClick={() => goTo(item.path)}
                                                        className={`w-full flex items-center gap-2.5 px-2.5 py-2 text-sm font-medium rounded-lg transition-all border-l-2 ${
                                                            active
                                                                ? "bg-[#DDF8FD]/70 text-[#0C7290] border-[#19B5D8]"
                                                                : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 border-transparent"
                                                        }`}
                                                    >
                                                        <item.icon size={16} strokeWidth={active ? 2.2 : 1.6} />
                                                        {item.label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </nav>

                            <div className="px-3 py-3 border-t border-neutral-100 shrink-0">
                                <div className="flex items-center gap-2.5 px-2 py-2">
                                    <div className="w-8 h-8 bg-[#19B5D8] rounded-full flex items-center justify-center text-white font-semibold text-xs shrink-0">
                                        {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-neutral-900 truncate leading-tight">{user?.name || "Admin"}</p>
                                        <p className="text-xs text-neutral-400 truncate leading-tight">{user?.email || ""}</p>
                                    </div>
                                    <button onClick={handleLogout} className="text-neutral-400 hover:text-red-500 transition-colors p-1" aria-label="Logout">
                                        <LogOut size={15} />
                                    </button>
                                </div>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* ─── Main Content ─── */}
            <div className="flex-1 lg:ml-60 min-h-screen flex flex-col">
                {/* Topbar */}
                <header className="h-14 bg-white border-b border-neutral-100 flex items-center px-4 lg:px-8 sticky top-0 z-30">
                    <button
                        onClick={() => setMobileNavOpen(true)}
                        aria-label="Open menu"
                        className="lg:hidden text-neutral-600 hover:text-neutral-900 p-1 mr-2"
                    >
                        <Menu size={20} />
                    </button>

                    <div className="flex items-center gap-3 ml-auto">
                        <NotificationBell />
                        <div className="w-px h-5 bg-neutral-200" />
                        <div className="flex items-center gap-2.5">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-neutral-900 leading-tight">
                                    {user?.name?.split(" ")[0] || "Admin"}
                                </p>
                                <p className="text-xs text-neutral-400 leading-tight">Administrator</p>
                            </div>
                            <div className="w-8 h-8 bg-[#19B5D8] rounded-full flex items-center justify-center text-white font-semibold text-xs shrink-0">
                                {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-4 lg:p-8 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default function AdminDashboardLayout({ children }) {
    return (
        <ToastProvider>
            <ConfirmDialogProvider>
                <DashboardShell>{children}</DashboardShell>
            </ConfirmDialogProvider>
        </ToastProvider>
    );
}
