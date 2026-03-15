"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, User, Menu, X } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";

export default function Navbar() {
  const { isAuthenticated, user, logout, isLoading } = useAuthStore();
  const totalQuantity = useCartStore((state) => state.totalQuantity);

  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [pathname]);

  // Body overflow for mobile menu
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Click outside to close user dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    if (userDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userDropdownOpen]);

  const textColor = scrolled ? "text-neutral-900" : "text-white";
  const hoverColor = scrolled
    ? "hover:text-emerald-700"
    : "hover:text-emerald-300";

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#fdfcf9]/95 backdrop-blur-xl border-b border-neutral-200/70 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            href="/"
            className={`text-2xl md:text-3xl font-['Playfair_Display'] font-bold tracking-wide ${textColor}`}
            aria-label="EVWheels Home"
          >
            EVWheels
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-10 lg:gap-12">
            <NavLink
              href="/cycles"
              label="Cycles"
              textColor={textColor}
              hoverColor={hoverColor}
            />
            <NavLink
              href="#accessories"
              label="Accessories"
              textColor={textColor}
              hoverColor={hoverColor}
            />{" "}
            {/* changed from # */}
            <NavLink
              href="/why-us"
              label="Why Us"
              textColor={textColor}
              hoverColor={hoverColor}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-5 sm:gap-7">
            <Link
              href="/cart"
              className={`relative ${textColor} transition-colors hover:opacity-80`}
              aria-label={`Shopping Cart ${totalQuantity > 0 ? `(${totalQuantity} items)` : ""}`}
            >
              <ShoppingBag size={22} strokeWidth={1.6} />
              {totalQuantity > 0 && (
                <span className="absolute -top-1 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-700 px-1.5 text-xs font-bold text-white border-2 border-white">
                  {totalQuantity > 99 ? "99+" : totalQuantity}
                </span>
              )}
            </Link>

            {!isLoading &&
              (isAuthenticated ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      scrolled ? "hover:bg-neutral-100" : "hover:bg-white/10"
                    }`}
                    onClick={() => setUserDropdownOpen((prev) => !prev)}
                    aria-expanded={userDropdownOpen}
                    aria-haspopup="true"
                  >
                    <User size={20} className={textColor} />
                    <span
                      className={`text-sm font-medium hidden lg:block ${textColor}`}
                    >
                      {user?.name?.split(" ")[0] || "Account"}
                    </span>
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white shadow-xl rounded-xl border border-neutral-200 py-2 text-sm z-50">
                      <Link
                        href="/profile"
                        className="block px-5 py-2.5 hover:bg-neutral-50"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        href="/orders"
                        className="block px-5 py-2.5 hover:bg-neutral-50"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        My Orders
                      </Link>
                      <hr className="my-1 border-neutral-200" />
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-5 py-2.5 text-red-600 hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/account/login"
                  className={`flex items-center gap-2 text-sm font-medium ${textColor} ${hoverColor}`}
                >
                  <User size={20} />
                  <span className="hidden sm:inline">Login</span>
                </Link>
              ))}

            <button
              className="md:hidden focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-lg p-1"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X size={28} className={textColor} />
              ) : (
                <Menu size={28} className={textColor} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div
            className={`fixed top-0 right-0 h-full w-4/5 max-w-xs bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
              mobileMenuOpen ? "translate-x-0" : "translate-x-full"
            } md:hidden`}
          >
            <div className="flex flex-col h-full p-6">
              <div className="flex justify-between items-center mb-10">
                <span className="text-xl font-semibold text-neutral-900">
                  Menu
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <X size={32} className="text-neutral-700" />
                </button>
              </div>

              <div className="flex flex-col gap-6 text-lg font-medium mb-10">
                <MobileNavLink
                  href="/cycles"
                  label="Cycles"
                  onClick={() => setMobileMenuOpen(false)}
                />
                <MobileNavLink
                  href="/accessories"
                  label="Accessories"
                  onClick={() => setMobileMenuOpen(false)}
                />
                <MobileNavLink
                  href="/why-us"
                  label="Why Us"
                  onClick={() => setMobileMenuOpen(false)}
                />
              </div>

              <div className="mt-auto pt-8 border-t border-neutral-200">
                {isAuthenticated ? (
                  <div className="flex flex-col gap-5 text-lg">
                    <MobileNavLink
                      href="/profile"
                      label="Profile"
                      onClick={() => setMobileMenuOpen(false)}
                    />
                    <MobileNavLink
                      href="/orders"
                      label="My Orders"
                      onClick={() => setMobileMenuOpen(false)}
                    />
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="text-left text-red-600 font-medium text-lg hover:text-red-700 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/account/login"
                    className="flex items-center gap-3 text-lg font-medium text-neutral-900 hover:text-emerald-700 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User size={24} />
                    Login / Register
                  </Link>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}

// ─── Helpers ───
function NavLink({ href, label, textColor, hoverColor }) {
  return (
    <Link
      href={href}
      className={`text-sm lg:text-base font-medium tracking-wide relative group ${textColor} ${hoverColor}`}
    >
      {label}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-current transition-all duration-300 group-hover:w-full" />
    </Link>
  );
}

function MobileNavLink({ href, label, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block py-3 text-neutral-800 hover:text-emerald-700 transition-colors"
    >
      {label}
    </Link>
  );
}
