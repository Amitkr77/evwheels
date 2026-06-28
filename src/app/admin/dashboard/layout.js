"use client";

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
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";


export default function AdminDashboardLayout({ children }) {
    const { isAuthenticated, user, logout, isLoading } = useAuthStore();

    const router = useRouter();
    const currentPath = usePathname();

    const sidebarItems = [
        { icon: Home, label: "Dashboard", path: "/admin/dashboard" },
        { icon: ShoppingCart, label: "Orders", path: "/admin/dashboard/orders", },
        { icon: Package, label: "Products", path: "/admin/dashboard/products" },
        { icon: LayoutGrid, label: "Categories", path: "/admin/dashboard/categories" },
        { icon: Layers, label: "Subcategories", path: "/admin/dashboard/subcategories" },
        { icon: Ticket, label: "Coupons", path: "/admin/dashboard/coupons" },
        { icon: Star, label: "Reviews", path: "/admin/dashboard/reviews", },
        { icon: Warehouse, label: "Inventory", path: "/admin/dashboard/inventory" },
        { icon: BarChart3, label: "Reports", path: "/admin/dashboard/reports" },
    ];


    return (
        <div className="min-h-screen bg-[#fdfcf9] font-['Inter'] flex">
            {/* ─── Sidebar ─── */}
            <aside className="fixed inset-y-0 left-0 w-72 bg-white border-r border-neutral-200/70 overflow-y-auto hidden lg:flex flex-col">
                <div className="p-8 border-b border-neutral-200/60">
                    <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-emerald-800 flex items-center justify-center text-white font-['Playfair_Display'] font-semibold text-2xl shadow-sm">
                            E
                        </div>
                        <span className="text-2xl font-['Playfair_Display'] font-medium tracking-tight text-neutral-900">
                            EVWheels
                        </span>
                    </div>
                </div>

                <nav className="p-6 space-y-1 flex-1">
                    {sidebarItems.map((item) => {
                        const isActive =
                            currentPath === item.path || currentPath?.startsWith(item.path + "/");
                        return (
                            <button
                                key={item.path}
                                onClick={() => router.push(item.path)}
                                className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium rounded-lg transition-colors ${isActive
                                    ? "bg-emerald-50/60 text-emerald-800"
                                    : "text-neutral-700 hover:bg-neutral-50/80"
                                    }`}
                            >
                                <item.icon size={20} strokeWidth={1.6} />
                                {item.label}
                                {item.badge && (
                                    <span className="ml-auto px-2.5 py-1 text-xs font-medium bg-emerald-50 text-emerald-800 rounded-full">
                                        {item.badge}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </nav>

                <div className="p-6 border-t border-neutral-200/60">
                    <div className="flex items-center gap-4">
                        <div className="w-11 h-11 bg-emerald-700 rounded-full flex items-center justify-center text-white font-semibold text-base shrink-0">
                            {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="font-medium text-neutral-900 truncate">
                                {user?.name || "Admin"}
                            </div>
                            <div className="text-xs text-emerald-700 flex items-center gap-1.5">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
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
            </aside>

            {/* ─── Main Content ─── */}
            <div className="flex-1 lg:ml-72 min-h-screen flex flex-col">
                {/* Topbar */}
                <header className="h-16 bg-white border-b border-neutral-200/70 flex items-center px-6 lg:px-12 justify-between">


                    <div className="flex items-center justify-end gap-6  w-full">
                        <div className="flex items-center gap-6">
                            <div className="relative cursor-pointer">
                                <Bell size={20} className="text-neutral-600" />
                            </div>

                            {/* Profile */}
                            <div className="flex items-center gap-3">
                                <div className="text-right">
                                    <div className="text-sm font-medium text-neutral-900">
                                        {user?.name?.split(" ")[0] || "Admin"}
                                    </div>
                                    <div className="text-xs text-neutral-500">
                                        {user?.email || "admin"}
                                    </div>
                                </div>
                                <div className="w-9 h-9 bg-emerald-700 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0">
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