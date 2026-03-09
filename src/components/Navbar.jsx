"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, User } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";

export default function Navbar() {
  const { isAuthenticated, user, logout ,isLoading} = useAuthStore();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const totalQuantity = useCartStore((state) => state.totalQuantity);

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDropdown = (menu) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };
  return (
    <div>
      {/* ─── Improved Navbar ─── */}
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-400 ${
          scrolled
            ? "bg-[#fdfcf9]/98 backdrop-blur-xl border-b border-neutral-200/60 shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-20">
          <Link
            href="/"
            className={`text-2xl font-['Playfair_Display'] font-bold tracking-wide transition-colors ${scrolled ? "text-neutral-900" : "text-white"}`}
          >
            EVWheels
          </Link>

          <div className="hidden md:flex items-center gap-10">
            <Link
              href="/shop"
              className={`text-sm font-medium tracking-wide  hover:text-neutral-900 transition-colors relative group ${scrolled ? "text-neutral-900" : "text-white hover:text-white "}`}
            >
              Cycles
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neutral-900 transition-all group-hover:w-full" />
            </Link>
            <Link
              href="#accessories"
              className={`text-sm font-medium tracking-wide  hover:text-neutral-900 transition-colors relative group ${scrolled ? "text-neutral-900" : "text-white hover:text-white "}`}
            >
              Accessories
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neutral-900 transition-all group-hover:w-full" />
            </Link>
            <Link
              href="/why-us"
              className={`text-sm font-medium tracking-wide  hover:text-neutral-900 transition-colors relative group ${scrolled ? "text-neutral-900" : "text-white hover:text-white "}`}
            >
              Why Us
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neutral-900 transition-all group-hover:w-full" />
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <div>Cart ({totalQuantity})</div>
            <Link
              href="/cart"
              className={`transition-colors ${scrolled ? "text-neutral-700 hover:text-neutral-900" : "text-white hover:text-white"}`}
            >
              <ShoppingBag size={22} strokeWidth={1.6} />
            </Link>

            {/* {isAuthenticated ? (
              <div className="relative">
                <button
                  className="
                    flex items-center gap-1 px-3 py-1.5 rounded-lg
                     dark:hover:bg-[#22301d] transition-colors border border-primary/20 hover:border-primary/40
                  "
                  onClick={() => toggleDropdown("user")}
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium hidden xl:block">
                    {user?.name?.split(" ")[0] || "Account"}
                  </span>
                </button>

                {activeDropdown === "user" && (
                  <div
                    className="
                      absolute right-0 top-full mt-2 w-56
                      bg-white dark:bg-[#1a2c15] shadow-xl rounded-xl
                      border dark:border-[#2a3825] py-2
                    "
                  >
                    <Link
                      href="/profile"
                      className="block px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-[#22301d]"
                    >
                      Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="block px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-[#22301d]"
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={logout}
                      className="
                        w-full text-left px-4 py-2.5 text-sm text-red-600
                        dark:text-red-400 hover:bg-gray-50 dark:hover:bg-[#22301d]
                      "
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/account/login"
                className={`text-sm font-medium transition-colors flex items-center gap-2 ${scrolled ? "text-neutral-700 hover:text-neutral-900" : "text-white hover:text-white"}`}
              >
                <User size={18} strokeWidth={1.6} />
                Login
              </Link>
            )} */}

            {!isLoading &&
              (isAuthenticated ? (
                <div className="relative">
                  <button
                    className="
                    flex items-center gap-1 px-3 py-1.5 rounded-lg
                     dark:hover:bg-[#22301d] transition-colors border border-primary/20 hover:border-primary/40
                  "
                    onClick={() => toggleDropdown("user")}
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium hidden xl:block">
                      {user?.name?.split(" ")[0] || "Account"}
                    </span>
                  </button>

                  {activeDropdown === "user" && (
                    <div
                      className="
                      absolute right-0 top-full mt-2 w-56
                      bg-white dark:bg-[#1a2c15] shadow-xl rounded-xl
                      border dark:border-[#2a3825] py-2
                    "
                    >
                      <Link
                        href="/profile"
                        className="block px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-[#22301d]"
                      >
                        Profile
                      </Link>
                      <Link
                        href="/orders"
                        className="block px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-[#22301d]"
                      >
                        My Orders
                      </Link>
                      <button
                        onClick={logout}
                        className="
                        w-full text-left px-4 py-2.5 text-sm text-red-600
                        dark:text-red-400 hover:bg-gray-50 dark:hover:bg-[#22301d]
                      "
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/account/login"
                  className={`text-sm font-medium transition-colors flex items-center gap-2 ${
                    scrolled
                      ? "text-neutral-700 hover:text-neutral-900"
                      : "text-white hover:text-white"
                  }`}
                >
                  <User size={18} strokeWidth={1.6} />
                  Login
                </Link>
              ))}
          </div>
        </div>
      </nav>
    </div>
  );
}
