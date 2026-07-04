"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, User, Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";

const SHOP_CATEGORIES = [
  { name: "Bells", href: "/shop?category=bells" },
  { name: "Brakes", href: "/shop?category=brakes" },
  { name: "Chains", href: "/shop?category=chains" },
  { name: "Gear Sets", href: "/shop?category=gear-sets" },
  { name: "Handlebar Parts", href: "/shop?category=handlebar-parts" },
  { name: "Lights", href: "/shop?category=lights-reflectors" },
  { name: "Locks", href: "/shop?category=locks-security" },
  { name: "Mudguards", href: "/shop?category=mudguards-fenders" },
  { name: "Saddles", href: "/shop?category=saddles-seats" },
  { name: "Tyres & Tubes", href: "/shop?category=tyres-tubes" },
  { name: "Tools", href: "/shop?category=tools-maintenance" },
  { name: "Wheels & Hubs", href: "/shop?category=wheels-hubs" },
];

const OTHER_LINKS = [
  { label: "Why Us", href: "/why-us" },
  { label: "Support", href: "/support" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const { isAuthenticated, user, logout, isLoading } = useAuthStore();
  const totalQuantity = useCartStore((state) => state.totalQuantity);
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);
  const [userDropOpen, setUserDropOpen] = useState(false);
  const userDropRef = useRef(null);

  // Only show transparent style on the homepage
  const isHome = pathname === "/";
  const transparent = isHome && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMobileShopOpen(false);
    setUserDropOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    if (!userDropOpen) return;
    const h = (e) => {
      if (userDropRef.current && !userDropRef.current.contains(e.target))
        setUserDropOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [userDropOpen]);

  const tx = transparent ? "text-black" : "text-neutral-900";
  const hx = transparent ? "hover:text-white/70" : "hover:text-[#19B5D8]";

  return (
    <nav
      className={`fixed inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "top-0 bg-white border-b border-neutral-200"
          : transparent
            ? "top-9 bg-transparent"
            : "top-9 bg-white border-b border-neutral-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className={`text-xl font-bold tracking-tight transition-colors ${tx}`}>
            EVWheels
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">

            {/* Shop with mega-dropdown */}
            <div className="relative group h-16 flex items-center">
              <button className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${tx} ${hx}`}>
                Shop
                <ChevronDown size={14} className="transition-transform duration-200 group-hover:rotate-180" />
              </button>

              {/* Mega dropdown */}
              <div className="absolute left-0 top-full pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="flex overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-2xl">

                  {/* Left: category grid */}
                  <div className="w-80 p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-3 px-2">
                      Browse Categories
                    </p>
                    <div className="grid grid-cols-2 gap-0.5">
                      {SHOP_CATEGORIES.map((cat) => (
                        <Link
                          key={cat.name}
                          href={cat.href}
                          className="px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-[#19B5D8] rounded-lg transition-colors"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-neutral-100">
                      <Link
                        href="/shop"
                        className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-[#19B5D8] hover:bg-[#DDF8FD]/60 rounded-lg transition-colors"
                      >
                        View All Products
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>

                  {/* Right: image panel */}
                  <div className="w-44 relative overflow-hidden bg-neutral-900">
                    <img
                      src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80&auto=format&fit=crop"
                      alt="Cycle accessories"
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                    <div className="absolute bottom-5 left-4 right-4">
                      <p className="text-white font-bold text-xl leading-tight">240+</p>
                      <p className="text-white/70 text-xs mt-0.5">Products in stock</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Other links */}
            {OTHER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  pathname === link.href
                    ? transparent ? "text-white" : "text-[#19B5D8]"
                    : `${tx} ${hx}`
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">

            {/* Cart */}
            <Link
              href="/cart"
              className={`relative transition-colors ${tx} ${hx}`}
              aria-label="Cart"
            >
              <ShoppingBag size={20} strokeWidth={1.8} />
              {totalQuantity > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#19B5D8] text-white text-[9px] font-bold flex items-center justify-center leading-none">
                  {totalQuantity > 9 ? "9+" : totalQuantity}
                </span>
              )}
            </Link>

            {/* Auth */}
            {isLoading ? (
              <div className="w-7 h-7 rounded-full bg-current opacity-10 animate-pulse" />
            ) : isAuthenticated ? (
              <div className="relative hidden sm:block" ref={userDropRef}>
                <button
                  onClick={() => setUserDropOpen((p) => !p)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${tx} ${hx}`}
                >
                  <User size={18} strokeWidth={1.8} />
                  <span className="hidden md:block max-w-[72px] truncate">
                    {user?.name?.split(" ")[0]}
                  </span>
                  <ChevronDown size={13} className={`transition-transform duration-200 ${userDropOpen ? "rotate-180" : ""}`} />
                </button>

                {userDropOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-xl shadow-xl border border-neutral-100 py-1 text-sm overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-neutral-100">
                      <p className="font-semibold text-neutral-900 truncate">{user?.name}</p>
                      <p className="text-xs text-neutral-400 mt-0.5 truncate">{user?.email}</p>
                    </div>
                    <Link href="/profile" className="block px-4 py-2.5 text-neutral-700 hover:bg-neutral-50 transition-colors" onClick={() => setUserDropOpen(false)}>My Profile</Link>
                    <Link href="/cart" className="block px-4 py-2.5 text-neutral-700 hover:bg-neutral-50 transition-colors" onClick={() => setUserDropOpen(false)}>My Cart</Link>
                    <div className="border-t border-neutral-100 mt-1">
                      <button onClick={() => { logout(); setUserDropOpen(false); }} className="w-full text-left px-4 py-2.5 text-red-500 hover:bg-red-50 transition-colors">
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/account/login"
                className={`hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${tx} ${hx}`}
              >
                <User size={18} strokeWidth={1.8} />
                <span className="hidden md:block">Login</span>
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              className={`lg:hidden p-1 transition-colors ${tx} ${hx}`}
              onClick={() => setMobileOpen((p) => !p)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed top-0 right-0 h-full w-72 max-w-[85vw] bg-white z-50 shadow-2xl flex flex-col lg:hidden">

            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 h-16 border-b border-neutral-100 shrink-0">
              <span className="font-bold text-neutral-900">EVWheels</span>
              <button onClick={() => setMobileOpen(false)} className="text-neutral-400 hover:text-neutral-900 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Nav items */}
            <div className="flex-1 overflow-y-auto px-4 py-3">

              {/* Shop accordion */}
              <div>
                <button
                  onClick={() => setMobileShopOpen((p) => !p)}
                  className="flex items-center justify-between w-full px-3 h-12 text-base font-medium text-neutral-800 hover:text-[#19B5D8] transition-colors"
                >
                  Shop
                  <ChevronDown size={16} className={`transition-transform duration-200 ${mobileShopOpen ? "rotate-180" : ""}`} />
                </button>
                {mobileShopOpen && (
                  <div className="pl-3 pb-2 grid grid-cols-2 gap-0.5">
                    {SHOP_CATEGORIES.map((cat) => (
                      <Link
                        key={cat.name}
                        href={cat.href}
                        className="px-3 py-2 text-sm text-neutral-600 hover:text-[#19B5D8] transition-colors"
                        onClick={() => setMobileOpen(false)}
                      >
                        {cat.name}
                      </Link>
                    ))}
                    <Link
                      href="/shop"
                      className="col-span-2 flex items-center gap-1 px-3 py-2.5 text-sm font-semibold text-[#19B5D8]"
                      onClick={() => setMobileOpen(false)}
                    >
                      All Products <ArrowRight size={13} />
                    </Link>
                  </div>
                )}
              </div>

              {OTHER_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center h-12 px-3 text-base font-medium transition-colors ${
                    pathname === link.href ? "text-[#19B5D8]" : "text-neutral-800 hover:text-[#19B5D8]"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Auth footer */}
            <div className="px-4 py-5 border-t border-neutral-100 shrink-0">
              {isAuthenticated ? (
                <div>
                  <div className="px-3 py-2 mb-2">
                    <p className="text-sm font-semibold text-neutral-900">{user?.name}</p>
                    <p className="text-xs text-neutral-400 truncate">{user?.email}</p>
                  </div>
                  <Link href="/profile" className="flex items-center h-11 px-3 text-sm text-neutral-700 hover:text-[#19B5D8] transition-colors" onClick={() => setMobileOpen(false)}>My Profile</Link>
                  <Link href="/cart" className="flex items-center h-11 px-3 text-sm text-neutral-700 hover:text-[#19B5D8] transition-colors" onClick={() => setMobileOpen(false)}>My Cart</Link>
                  <button onClick={() => { logout(); setMobileOpen(false); }} className="flex items-center h-11 px-3 w-full text-left text-sm text-red-500 hover:text-red-600 transition-colors">Sign Out</button>
                </div>
              ) : (
                <Link
                  href="/account/login"
                  className="flex items-center justify-center gap-2 h-11 bg-neutral-900 text-white rounded-xl text-sm font-semibold hover:bg-neutral-800 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  <User size={16} />
                  Login / Register
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
