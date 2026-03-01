"use client";

import { Search, ShoppingCart, User, Zap, Menu, X } from "lucide-react";
import React, { useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";

export default function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Optional: cart item count (you can pull from zustand/cart store)
  const cartCount = 3; // ← placeholder – replace with real value

  const toggleDropdown = (menu) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  return (
    <header
      className="
        sticky top-0 z-50 w-full
        bg-white/95 dark:bg-background-dark/95
        backdrop-blur-md border-b border-[#e5eadd] dark:border-[#2a3825]
        transition-all duration-300
      "
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-3.5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="size-8 rounded-full bg-primary flex items-center justify-center text-primary-content shadow-sm">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <span className="text-text-main dark:text-white text-xl font-bold tracking-tight">
              EvWheels
            </span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-muted dark:text-gray-400" />
              <input
                type="search"
                placeholder="Search e-bikes, batteries, accessories..."
                className="
                  w-full rounded-full bg-[#f1f5f0] dark:bg-[#22301d]
                  border-none py-2.5 pl-10 pr-4 text-sm
                  placeholder:text-text-muted/70
                  focus:ring-2 focus:ring-primary/60 focus:bg-white dark:focus:bg-[#1a2c15]
                  transition-all duration-200
                "
              />
            </div>
          </div>

          {/* Desktop Nav + Actions */}
          <div className="hidden lg:flex items-center gap-6">
            <nav className="flex items-center gap-7">
              <Link
                href="/shop"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                E-Bikes
              </Link>

              {/* Accessories Dropdown */}
              <div className="relative">
                <button
                  className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1"
                  onMouseEnter={() => setActiveDropdown("accessories")}
                  onMouseLeave={() => setActiveDropdown(null)}
                  aria-expanded={activeDropdown === "accessories"}
                >
                  Accessories
                </button>

                {activeDropdown === "accessories" && (
                  <div
                    className="
                      absolute left-0 top-full mt-2 w-56
                      bg-white dark:bg-[#1a2c15] shadow-xl rounded-xl
                      border dark:border-[#2a3825] overflow-hidden
                      animate-fade-in
                    "
                    onMouseEnter={() => setActiveDropdown("accessories")}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <div className="py-2">
                      {["Helmets", "Batteries", "Chargers", "Spare Parts", "Locks & Security"].map(
                        (item) => (
                          <Link
                            key={item}
                            href={`/accessories/${item.toLowerCase().replace(/ & /g, "-")}`}
                            className="
                              block px-4 py-2.5 text-sm
                              hover:bg-gray-50 dark:hover:bg-[#22301d]
                              transition-colors
                            "
                          >
                            {item}
                          </Link>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Support Dropdown */}
              <div className="relative">
                <button
                  className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1"
                  onMouseEnter={() => setActiveDropdown("support")}
                  onMouseLeave={() => setActiveDropdown(null)}
                  aria-expanded={activeDropdown === "support"}
                >
                  Support
                </button>

                {activeDropdown === "support" && (
                  <div
                    className="
                      absolute left-0 top-full mt-2 w-56
                      bg-white dark:bg-[#1a2c15] shadow-xl rounded-xl
                      border dark:border-[#2a3825] overflow-hidden
                    "
                    onMouseEnter={() => setActiveDropdown("support")}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <div className="py-2">
                      <Link
                        href="/support"
                        className="block px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-[#22301d]"
                      >
                        Help Center
                      </Link>
                      <Link
                        href="/support/warranty"
                        className="block px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-[#22301d]"
                      >
                        Warranty Information
                      </Link>
                      <Link
                        href="/support/contact"
                        className="block px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-[#22301d]"
                      >
                        Contact Us
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </nav>

            {/* Auth / User Menu */}
            {isAuthenticated ? (
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
                className="
                  text-sm font-medium text-primary hover:text-primary/80
                  transition-colors border border-primary/20 hover:border-primary/40 rounded-lg px-3 py-1.5
                "
              >
                Sign in
              </Link>
            )}

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 hover:bg-gray-100 dark:hover:bg-[#22301d] rounded-full transition-colors group"
              aria-label={`Shopping cart with ${cartCount} items`}
            >
              <ShoppingCart className="w-5 h-5 group-hover:text-primary transition-colors" />
              {cartCount > 0 && (
                <span
                  className="
                    absolute -top-1 -right-1 min-w-[18px] h-5
                    bg-primary text-primary-content text-[10px] font-bold
                    rounded-full flex items-center justify-center px-1.5
                  "
                >
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="lg:hidden p-2 -mr-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="
            lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm
            animate-fade-in
          "
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="
              absolute right-0 top-0 h-full w-4/5 max-w-xs
              bg-white dark:bg-[#13200f] shadow-2xl
              animate-slide-in-right
            "
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b dark:border-[#2a3825]">
              <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2.5">
                  <Zap className="w-6 h-6 text-primary fill-current" />
                  <span className="text-lg font-bold">EvWheels</span>
                </Link>
                <button onClick={() => setMobileMenuOpen(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <nav className="p-5 space-y-2">
              <Link
                href="/shop"
                className="block py-3 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-[#22301d]"
                onClick={() => setMobileMenuOpen(false)}
              >
                E-Bikes
              </Link>

              <div>
                <button
                  className="w-full text-left py-3 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-[#22301d] flex justify-between items-center"
                  onClick={() => toggleDropdown("mobile-accessories")}
                >
                  Accessories
                  <span>{activeDropdown === "mobile-accessories" ? "−" : "+"}</span>
                </button>
                {activeDropdown === "mobile-accessories" && (
                  <div className="pl-6 space-y-2 mt-1 animate-fade-in">
                    {["Helmets", "Batteries", "Chargers", "Spare Parts"].map((item) => (
                      <Link
                        key={item}
                        href="#"
                        className="block py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-primary"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Similar for Support... */}

              <div className="pt-6 border-t dark:border-[#2a3825]">
                {isAuthenticated ? (
                  <>
                    <div className="py-3 px-4 font-medium">{user?.name}</div>
                    <Link
                      href="/profile"
                      className="block py-3 px-4 hover:bg-gray-100 dark:hover:bg-[#22301d]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="block py-3 px-4 hover:bg-gray-100 dark:hover:bg-[#22301d]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Orders
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left py-3 px-4 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-[#22301d]"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    href="/auth/login"
                    className="block py-3 px-4 bg-primary text-primary-content rounded-lg text-center font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}