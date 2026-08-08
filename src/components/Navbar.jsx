"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  Heart,
  Search,
  LayoutDashboard,
  Package,
  Settings,
  LogOut,
  Zap,
  Gauge,
  Battery,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import UserAvatar from "@/components/user/UserAvatar";
import HeaderSearch from "@/components/HeaderSearch";

const ACCOUNT_LINKS = [
  { label: "Profile",  href: "/profile",              icon: LayoutDashboard },
  { label: "Orders",   href: "/profile?tab=orders",   icon: Package },
  { label: "Wishlist", href: "/profile?tab=wishlist", icon: Heart },
  { label: "Settings", href: "/profile?tab=settings", icon: Settings },
];

// EV product lines — shown as rich rows in the mega-menu
const EV_LINKS = [
  { name: "Electric Cycles",   href: "/shop?category=electric-cycles",   icon: Zap,      sub: "In-house manufactured"  },
  { name: "Electric Scooters", href: "/shop?category=electric-scooters", icon: Gauge,    sub: "Assembled in Patna"     },
  { name: "Lithium Batteries", href: "/shop?category=batteries",         icon: Battery,  sub: "We build our own cells" },
  { name: "Conversion Kits",   href: "/shop?category=conversion-kits",   icon: Settings, sub: "Electrify your cycle"   },
];

// Accessories sub-categories — compact grid in the mega-menu
const PART_CATS = [
  { name: "Bells",          href: "/shop?category=bells"             },
  { name: "Brakes",         href: "/shop?category=brakes"            },
  { name: "Chains",         href: "/shop?category=chains"            },
  { name: "Gear Sets",      href: "/shop?category=gear-sets"         },
  { name: "Lights",         href: "/shop?category=lights-reflectors" },
  { name: "Locks",          href: "/shop?category=locks-security"    },
  { name: "Mudguards",      href: "/shop?category=mudguards-fenders" },
  { name: "Saddles",        href: "/shop?category=saddles-seats"     },
  { name: "Tyres & Tubes",  href: "/shop?category=tyres-tubes"       },
  { name: "Tools",          href: "/shop?category=tools-maintenance" },
  { name: "Wheels & Hubs",  href: "/shop?category=wheels-hubs"       },
  { name: "Handlebar Parts",href: "/shop?category=handlebar-parts"   },
];

export default function Navbar() {
  const { isAuthenticated, user, logout, isLoading } = useAuthStore();
  const totalQuantity = useCartStore((state) => state.totalQuantity);
  const pathname = usePathname();

  const [scrolled,         setScrolled]         = useState(false);
  const [mobileOpen,       setMobileOpen]        = useState(false);
  const [mobileShopOpen,   setMobileShopOpen]    = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen]  = useState(false);
  const [userDropOpen,     setUserDropOpen]      = useState(false);
  const userDropRef = useRef(null);

  const isHome    = pathname === "/";
  const transparent = isHome && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close everything on route change
  useEffect(() => {
    setMobileOpen(false);
    setMobileShopOpen(false);
    setMobileSearchOpen(false);
    setUserDropOpen(false);
  }, [pathname]);

  // Lock body scroll while mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Close user dropdown on outside click
  useEffect(() => {
    if (!userDropOpen) return;
    const h = (e) => {
      if (userDropRef.current && !userDropRef.current.contains(e.target))
        setUserDropOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [userDropOpen]);

  return (
    <nav
      className={`fixed inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "top-0 bg-white/95 backdrop-blur-md border-b border-neutral-200/70 shadow-sm"
          : transparent
            ? "top-9 bg-transparent"
            : "top-9 bg-white/95 backdrop-blur-md border-b border-neutral-200/70"
      }`}
    >
      <div className="max-w-8xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex items-center h-16">

          {/* ── Logo (left) ── */}
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/black_logo.png"
              alt="EVWheels"
              width={160}
              height={160}
              priority
              className="h-28 w-auto object-contain"
            />
          </Link>

          {/* ── Center: Shop + Search ── */}
          <div className="hidden lg:flex flex-1 items-center justify-center gap-3">
            {/* CSS :hover group — mega-menu stays open while cursor moves into it */}
            <div className="relative group h-16 flex items-center">
              <button
                aria-haspopup="true"
                className="flex items-center gap-1.5 px-4 py-2 text-[13.5px] font-semibold text-neutral-800 rounded-full hover:bg-neutral-100 hover:text-[#0C7290] transition-all duration-200"
              >
                Shop
                <ChevronDown
                  size={13}
                  strokeWidth={2.2}
                  className="text-neutral-400 transition-transform duration-200 group-hover:rotate-180 group-hover:text-[#0C7290]"
                />
              </button>

              {/* Mega-menu panel */}
              <div className="absolute left-0 top-full pt-2 opacity-0 invisible pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto transition-all duration-200 ease-out z-50">
                <div className="flex rounded-2xl border border-neutral-100 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.12)] overflow-hidden">

                  {/* EV Products column */}
                  <div className="w-60 p-5 border-r border-neutral-50">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-3 px-1">
                      EV Products
                    </p>
                    <div className="space-y-0.5">
                      {EV_LINKS.map((ev) => (
                        <Link
                          key={ev.name}
                          href={ev.href}
                          className="group/row flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-[#F0FEFF] transition-colors"
                        >
                          <div className="w-8 h-8 rounded-lg bg-[#DDF8FD] flex items-center justify-center shrink-0">
                            <ev.icon size={15} className="text-[#0C7290]" strokeWidth={1.8} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[13px] font-semibold text-neutral-800 group-hover/row:text-[#0C7290] leading-tight transition-colors">
                              {ev.name}
                            </p>
                            <p className="text-[11px] text-neutral-400 leading-tight">{ev.sub}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Parts & Accessories column */}
                  <div className="w-56 p-5 border-r border-neutral-50">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-3 px-1">
                      Parts & Accessories
                    </p>
                    <div className="grid grid-cols-2 gap-0.5">
                      {PART_CATS.map((cat) => (
                        <Link
                          key={cat.name}
                          href={cat.href}
                          className="px-2 py-2 text-[12px] text-neutral-600 hover:bg-neutral-50 hover:text-[#19B5D8] rounded-lg transition-colors leading-tight"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-neutral-50">
                      <Link
                        href="/shop"
                        className="flex items-center gap-1.5 px-2 py-2 text-[12.5px] font-semibold text-[#19B5D8] hover:bg-[#DDF8FD]/50 rounded-lg transition-colors"
                      >
                        View All Products <ArrowRight size={11} />
                      </Link>
                    </div>
                  </div>

                  {/* Image panel */}
                  <div className="w-40 relative bg-neutral-900 overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80&auto=format&fit=crop"
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    <div className="absolute bottom-5 left-4 right-4">
                      <p className="text-[#19B5D8] text-[9px] font-bold uppercase tracking-widest mb-1.5">
                        In Stock
                      </p>
                      <p className="text-white font-bold text-2xl leading-none">240+</p>
                      <p className="text-white/55 text-[11px] mt-1.5 leading-snug">
                        Products across 16 categories
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Search — sits right of Shop inside the centered group */}
            <div className="w-72">
              <HeaderSearch />
            </div>
          </div>

          {/* Spacer — pushes actions to the right on mobile */}
          <div className="flex-1 lg:hidden" />

          {/* ── Right actions ── */}
          <div className="flex items-center gap-0.5 shrink-0">

            {/* Mobile search toggle */}
            <button
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full text-neutral-600 hover:bg-neutral-100 hover:text-[#19B5D8] transition-all"
              onClick={() => setMobileSearchOpen((p) => !p)}
              aria-label="Toggle search"
            >
              {mobileSearchOpen
                ? <X size={19} strokeWidth={1.8} />
                : <Search size={19} strokeWidth={1.8} />
              }
            </button>

            {/* Wishlist */}
            <Link
              href="/profile?tab=wishlist"
              className="w-9 h-9 flex items-center justify-center rounded-full text-neutral-600 hover:bg-neutral-100 hover:text-[#19B5D8] transition-all"
              aria-label="Wishlist"
            >
              <Heart size={19} strokeWidth={1.8} />
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative w-9 h-9 flex items-center justify-center rounded-full text-neutral-600 hover:bg-neutral-100 hover:text-[#19B5D8] transition-all"
              aria-label="Cart"
            >
              <ShoppingBag size={19} strokeWidth={1.8} />
              {totalQuantity > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-[#19B5D8] text-white text-[8px] font-bold flex items-center justify-center leading-none">
                  {totalQuantity > 9 ? "9+" : totalQuantity}
                </span>
              )}
            </Link>

            {/* Auth — desktop */}
            {isLoading ? (
              <div className="hidden sm:block w-8 h-8 rounded-full bg-neutral-100 animate-pulse ml-1" />
            ) : isAuthenticated ? (
              <div className="relative hidden sm:block ml-1" ref={userDropRef}>
                <button
                  onClick={() => setUserDropOpen((p) => !p)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-full text-neutral-700 hover:bg-neutral-100 transition-all"
                >
                  <UserAvatar name={user?.name} size="sm" />
                  <span className="hidden md:block text-[13px] font-medium max-w-[72px] truncate">
                    {user?.name?.split(" ")[0]}
                  </span>
                  <ChevronDown
                    size={12}
                    strokeWidth={2.2}
                    className={`text-neutral-400 transition-transform duration-200 ${userDropOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {userDropOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-neutral-100 py-1.5 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-neutral-50">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-[#19B5D8] mb-1">
                        My Account
                      </p>
                      <p className="text-[13px] font-semibold text-neutral-900 truncate">{user?.name}</p>
                      <p className="text-[11px] text-neutral-400 mt-0.5 truncate">{user?.email}</p>
                    </div>
                    {ACCOUNT_LINKS.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-neutral-700 hover:bg-neutral-50 hover:text-[#19B5D8] transition-colors"
                        onClick={() => setUserDropOpen(false)}
                      >
                        <link.icon size={14} strokeWidth={1.8} className="shrink-0" />
                        {link.label}
                      </Link>
                    ))}
                    <div className="border-t border-neutral-50 mt-1 pt-1">
                      <button
                        onClick={() => { logout(); setUserDropOpen(false); }}
                        className="w-full flex items-center gap-3 text-left px-4 py-2.5 text-[13px] text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={14} strokeWidth={1.8} className="shrink-0" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/account/login"
                className="hidden sm:flex items-center gap-1.5 ml-1 px-4 py-2 text-[13px] font-semibold bg-neutral-900 text-white rounded-full hover:bg-neutral-700 transition-all"
              >
                Login
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full text-neutral-600 hover:bg-neutral-100 transition-all ml-0.5"
              onClick={() => setMobileOpen((p) => !p)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile search — slides in below the bar */}
        {mobileSearchOpen && (
          <div className="lg:hidden pb-4 px-0.5">
            <HeaderSearch />
          </div>
        )}
      </div>

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <>
          {/* Scrim */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />

          {/* Panel */}
          <div className="fixed top-0 right-0 h-full w-72 max-w-[85vw] bg-white z-50 shadow-2xl flex flex-col lg:hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-5 h-16 border-b border-neutral-100 shrink-0">
              <Image
                src="/black_logo.png"
                alt="EVWheels"
                width={160}
                height={160}
                className="h-10 w-auto object-contain"
              />
              <button
                onClick={() => setMobileOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
              >
                <X size={17} />
              </button>
            </div>

            {/* Nav items */}
            <div className="flex-1 overflow-y-auto py-2">

              {/* Shop accordion */}
              <button
                onClick={() => setMobileShopOpen((p) => !p)}
                className="flex items-center justify-between w-full px-5 py-3.5 text-[15px] font-semibold text-neutral-800 hover:text-[#0C7290] transition-colors"
              >
                Shop
                <ChevronDown
                  size={14}
                  strokeWidth={2.2}
                  className={`text-neutral-400 transition-transform duration-200 ${mobileShopOpen ? "rotate-180" : ""}`}
                />
              </button>

              {mobileShopOpen && (
                <div className="px-3 pb-3">
                  {/* EV section */}
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400 px-2 pb-2">
                    EV Products
                  </p>
                  <div className="space-y-0.5 mb-4">
                    {EV_LINKS.map((ev) => (
                      <Link
                        key={ev.name}
                        href={ev.href}
                        className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-[#F0FEFF] transition-colors"
                        onClick={() => setMobileOpen(false)}
                      >
                        <div className="w-7 h-7 rounded-lg bg-[#DDF8FD] flex items-center justify-center shrink-0">
                          <ev.icon size={13} className="text-[#0C7290]" strokeWidth={1.8} />
                        </div>
                        <span className="text-[13.5px] font-medium text-neutral-800">{ev.name}</span>
                      </Link>
                    ))}
                  </div>

                  {/* Parts section */}
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400 px-2 pb-2">
                    Parts & Accessories
                  </p>
                  <div className="grid grid-cols-2 gap-0.5">
                    {PART_CATS.map((cat) => (
                      <Link
                        key={cat.name}
                        href={cat.href}
                        className="px-2 py-2 text-[12px] text-neutral-600 hover:text-[#19B5D8] hover:bg-neutral-50 rounded-lg transition-colors"
                        onClick={() => setMobileOpen(false)}
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>

                  <Link
                    href="/shop"
                    className="flex items-center gap-1.5 px-2 pt-4 text-[13px] font-semibold text-[#19B5D8]"
                    onClick={() => setMobileOpen(false)}
                  >
                    All Products <ArrowRight size={12} />
                  </Link>
                </div>
              )}

              {/* Divider */}
              <div className="mx-5 my-1 h-px bg-neutral-100" />

              {[
                { label: "Contact", href: "/contact" },
                { label: "Support", href: "/support" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center px-5 py-3.5 text-[14px] font-medium text-neutral-700 hover:text-[#19B5D8] transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Auth footer */}
            <div className="px-4 pb-6 pt-3 border-t border-neutral-100 shrink-0">
              {isAuthenticated ? (
                <div>
                  <div className="flex items-center gap-3 px-1 py-2 mb-1">
                    <UserAvatar name={user?.name} size="sm" />
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-neutral-900 truncate">{user?.name}</p>
                      <p className="text-[11px] text-neutral-400 truncate">{user?.email}</p>
                    </div>
                  </div>
                  {ACCOUNT_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-3 px-1 py-3 text-[13px] text-neutral-700 hover:text-[#19B5D8] transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      <link.icon size={15} strokeWidth={1.8} className="shrink-0" />
                      {link.label}
                    </Link>
                  ))}
                  <button
                    onClick={() => { logout(); setMobileOpen(false); }}
                    className="flex items-center gap-3 px-1 py-3 w-full text-left text-[13px] text-red-500 hover:text-red-600 transition-colors"
                  >
                    <LogOut size={15} strokeWidth={1.8} className="shrink-0" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/account/login"
                  className="flex items-center justify-center gap-2 h-11 bg-neutral-900 text-white rounded-xl text-[13.5px] font-semibold hover:bg-neutral-800 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  <User size={15} />
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
