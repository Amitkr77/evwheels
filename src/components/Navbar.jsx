"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
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
  Loader2,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import UserAvatar from "@/components/user/UserAvatar";
import HeaderSearch from "@/components/HeaderSearch";
import { useDebounce } from "@/hooks/useDebounce";
import { AnimatePresence, motion } from "framer-motion";

const ACCOUNT_LINKS = [
  { label: "Profile", href: "/profile", icon: LayoutDashboard },
  { label: "Orders", href: "/profile?tab=orders", icon: Package },
  { label: "Wishlist", href: "/profile?tab=wishlist", icon: Heart },
  { label: "Settings", href: "/profile?tab=settings", icon: Settings },
];

const EV_LINKS = [
  {
    name: "Electric Cycles",
    href: "/shop?category=electric-cycles",
    icon: Zap,
    sub: "In-house manufactured",
  },
  {
    name: "Electric Scooters",
    href: "/shop?category=electric-scooters",
    icon: Gauge,
    sub: "Assembled in Patna",
  },
  {
    name: "Lithium Batteries",
    href: "/shop?category=batteries",
    icon: Battery,
    sub: "We build our own cells",
  },
  {
    name: "Conversion Kits",
    href: "/shop?category=conversion-kits",
    icon: Settings,
    sub: "Electrify your cycle",
  },
];

const PART_CATS = [
  { name: "Bells", href: "/shop?category=bells" },
  { name: "Brakes", href: "/shop?category=brakes" },
  { name: "Chains", href: "/shop?category=chains" },
  { name: "Gear Sets", href: "/shop?category=gear-sets" },
  { name: "Lights", href: "/shop?category=lights-reflectors" },
  { name: "Locks", href: "/shop?category=locks-security" },
  { name: "Mudguards", href: "/shop?category=mudguards-fenders" },
  { name: "Saddles", href: "/shop?category=saddles-seats" },
  { name: "Tyres & Tubes", href: "/shop?category=tyres-tubes" },
  { name: "Tools", href: "/shop?category=tools-maintenance" },
  { name: "Wheels & Hubs", href: "/shop?category=wheels-hubs" },
  { name: "Handlebar Parts", href: "/shop?category=handlebar-parts" },
];

export default function Navbar() {
  const { isAuthenticated, user, logout, isLoading } = useAuthStore();
  const totalQuantity = useCartStore((state) => state.totalQuantity);
  const pathname = usePathname();
  const router = useRouter();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [userDropOpen, setUserDropOpen] = useState(false);

  // Full-screen mobile search state
  const [mobileQ, setMobileQ] = useState("");
  const [mobileResults, setMobileResults] = useState([]);
  const [mobileSearchLoading, setMobileSearchLoading] = useState(false);
  const mobileInputRef = useRef(null);
  const debouncedMobileQ = useDebounce(mobileQ, 300);

  const userDropRef = useRef(null);

  const isHome = pathname === "/";
  const transparent = isHome && !scrolled;

  // Scroll listener
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
    setMobileQ("");
    setMobileResults([]);
    setUserDropOpen(false);
  }, [pathname]);

  // Lock body scroll while mobile drawer or search is open
  useEffect(() => {
    document.body.style.overflow =
      mobileOpen || mobileSearchOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen, mobileSearchOpen]);

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

  // Debounced product search for mobile full-screen
  useEffect(() => {
    const term = debouncedMobileQ.trim();
    if (!term) {
      setMobileResults([]);
      setMobileSearchLoading(false);
      return;
    }
    let cancelled = false;
    setMobileSearchLoading(true);
    fetch(`/api/products?search=${encodeURIComponent(term)}&limit=6`)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setMobileResults(d.products || []);
      })
      .catch(() => {
        if (!cancelled) setMobileResults([]);
      })
      .finally(() => {
        if (!cancelled) setMobileSearchLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedMobileQ]);

  // Auto-focus input when search overlay opens
  useEffect(() => {
    if (mobileSearchOpen) {
      const t = setTimeout(() => mobileInputRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
  }, [mobileSearchOpen]);

  const closeMobileSearch = () => {
    setMobileSearchOpen(false);
    setMobileQ("");
    setMobileResults([]);
  };

  const goToResults = (term) => {
    const t = term.trim();
    if (t) router.push(`/shop?search=${encodeURIComponent(t)}`);
    closeMobileSearch();
  };

  return (
    <>
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
          {/* ── Desktop bar ─────────────────────────────────── */}
          <div className="hidden lg:flex items-center h-16">
            {/* Logo */}
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

            {/* Center: Shop mega-menu + Search */}
            <div className="flex flex-1 items-center justify-center gap-3">
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
                              <ev.icon
                                size={15}
                                className="text-[#0C7290]"
                                strokeWidth={1.8}
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[13px] font-semibold text-neutral-800 group-hover/row:text-[#0C7290] leading-tight transition-colors">
                                {ev.name}
                              </p>
                              <p className="text-[11px] text-neutral-400 leading-tight">
                                {ev.sub}
                              </p>
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
                        <p className="text-white font-bold text-2xl leading-none">
                          240+
                        </p>
                        <p className="text-white/55 text-[11px] mt-1.5 leading-snug">
                          Products across 16 categories
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Search */}
              <div className="w-72">
                <HeaderSearch />
              </div>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-0.5 shrink-0">
              <Link
                href="/profile?tab=wishlist"
                className="w-9 h-9 flex items-center justify-center rounded-full text-neutral-600 hover:bg-neutral-100 hover:text-[#19B5D8] transition-all"
                aria-label="Wishlist"
              >
                <Heart size={19} strokeWidth={1.8} />
              </Link>

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

              {isLoading ? (
                <div className="w-8 h-8 rounded-full bg-neutral-100 animate-pulse ml-1" />
              ) : isAuthenticated ? (
                <div className="relative ml-1" ref={userDropRef}>
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
                        <p className="text-[13px] font-semibold text-neutral-900 truncate">
                          {user?.name}
                        </p>
                        <p className="text-[11px] text-neutral-400 mt-0.5 truncate">
                          {user?.email}
                        </p>
                      </div>
                      {ACCOUNT_LINKS.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-neutral-700 hover:bg-neutral-50 hover:text-[#19B5D8] transition-colors"
                          onClick={() => setUserDropOpen(false)}
                        >
                          <link.icon
                            size={14}
                            strokeWidth={1.8}
                            className="shrink-0"
                          />
                          {link.label}
                        </Link>
                      ))}
                      <div className="border-t border-neutral-50 mt-1 pt-1">
                        <button
                          onClick={() => {
                            logout();
                            setUserDropOpen(false);
                          }}
                          className="w-full flex items-center gap-3 text-left px-4 py-2.5 text-[13px] text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <LogOut
                            size={14}
                            strokeWidth={1.8}
                            className="shrink-0"
                          />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/account/login"
                  className="flex items-center gap-1.5 ml-1 px-4 py-2 text-[13px] font-semibold bg-neutral-900 text-white rounded-full hover:bg-neutral-700 transition-all"
                >
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* ── Mobile bar ──────────────────────────────────── */}
          <div className="flex items-center h-16 lg:hidden">
            {/* Left: Hamburger */}
            <div className="flex-1 flex justify-start">
              <button
                className="w-10 h-10 flex items-center justify-center rounded-full text-neutral-700 hover:bg-neutral-100 transition-all"
                onClick={() => setMobileOpen((p) => !p)}
                aria-label="Open menu"
              >
                <Menu size={21} strokeWidth={1.8} />
              </button>
            </div>

            {/* Center: Logo */}
            <Link href="/" className="shrink-0">
              <Image
                src="/black_logo.png"
                alt="EVWheels"
                width={140}
                height={140}
                priority
                className="h-24 w-auto object-contain"
              />
            </Link>

            {/* Right: Search + Login/Avatar */}
            <div className="flex-1 flex justify-end items-center gap-1">
              <button
                className="w-10 h-10 flex items-center justify-center rounded-full text-neutral-600 hover:bg-neutral-100 hover:text-[#19B5D8] transition-all"
                onClick={() => setMobileSearchOpen(true)}
                aria-label="Search"
              >
                <Search size={19} strokeWidth={1.8} />
              </button>

              {isLoading ? (
                <div className="w-8 h-8 rounded-full bg-neutral-100 animate-pulse" />
              ) : isAuthenticated ? (
                <button
                  onClick={() => setMobileOpen(true)}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-all"
                  aria-label="Account"
                >
                  <UserAvatar name={user?.name} size="sm" />
                </button>
              ) : (
                <Link
                  href="/account/login"
                  className="w-10 h-10 flex items-center justify-center rounded-full text-neutral-600 hover:bg-neutral-100 hover:text-[#19B5D8] transition-all"
                  aria-label="Login"
                >
                  <User size={19} strokeWidth={1.8} />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* ── Mobile drawer ─────────────────────────────────── */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/50 z-[150] lg:hidden"
                onClick={() => setMobileOpen(false)}
              />

              {/* Drawer — slides in from LEFT */}
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 300 }}
                className="fixed top-0 left-0 h-full w-72 max-w-[85vw] bg-white z-[200] flex flex-col lg:hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-5 h-[60px] border-b border-neutral-100 shrink-0">
                  <Image
                    src="/black_logo.png"
                    alt="EVWheels"
                    width={120}
                    height={40}
                    className="h-8 w-auto object-contain"
                  />
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
                    aria-label="Close menu"
                  >
                    <X size={17} />
                  </button>
                </div>

                {/* Nav */}
                <div className="flex-1 overflow-y-auto py-3 px-2">
                  {/* Shop accordion */}
                  <button
                    onClick={() => setMobileShopOpen((p) => !p)}
                    className="flex items-center justify-between w-full px-3 py-3 rounded-xl text-[14px] font-semibold text-neutral-800 hover:bg-neutral-50 hover:text-[#0C7290] transition-colors"
                  >
                    <span className="flex items-center gap-3">
                      <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#DDF8FD]">
                        <ShoppingBag
                          size={15}
                          className="text-[#0C7290]"
                          strokeWidth={1.8}
                        />
                      </span>
                      Shop
                    </span>
                    <ChevronDown
                      size={14}
                      strokeWidth={2.2}
                      className={`text-neutral-400 transition-transform duration-200 ${mobileShopOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {mobileShopOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-2 pb-2 pt-1">
                          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400 px-2 pb-2">
                            EV Products
                          </p>
                          <div className="space-y-0.5 mb-3">
                            {EV_LINKS.map((ev) => (
                              <Link
                                key={ev.name}
                                href={ev.href}
                                className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-[#F0FEFF] transition-colors"
                                onClick={() => setMobileOpen(false)}
                              >
                                <div className="w-7 h-7 rounded-lg bg-[#DDF8FD] flex items-center justify-center shrink-0">
                                  <ev.icon
                                    size={13}
                                    className="text-[#0C7290]"
                                    strokeWidth={1.8}
                                  />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-[13px] font-medium text-neutral-800 leading-tight">
                                    {ev.name}
                                  </p>
                                  <p className="text-[11px] text-neutral-400 leading-tight truncate">
                                    {ev.sub}
                                  </p>
                                </div>
                              </Link>
                            ))}
                          </div>

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
                            className="flex items-center gap-1.5 px-2 pt-3 pb-1 text-[12.5px] font-semibold text-[#19B5D8]"
                            onClick={() => setMobileOpen(false)}
                          >
                            All Products <ArrowRight size={12} />
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="mx-2 my-2 h-px bg-neutral-100" />

                  {[
                    { label: "Why EVWheels", href: "/why-us" },
                    { label: "Contact", href: "/contact" },
                    { label: "Support", href: "/support" },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center px-3 py-3 rounded-xl text-[14px] font-medium text-neutral-700 hover:text-[#19B5D8] hover:bg-neutral-50 transition-colors"
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
                      <div className="flex items-center gap-3 px-1 py-2 mb-2">
                        <UserAvatar name={user?.name} size="sm" />
                        <div className="min-w-0">
                          <p className="text-[13px] font-semibold text-neutral-900 truncate">
                            {user?.name}
                          </p>
                          <p className="text-[11px] text-neutral-400 truncate">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                      {ACCOUNT_LINKS.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="flex items-center gap-3 px-1 py-2.5 text-[13px] text-neutral-700 hover:text-[#19B5D8] transition-colors"
                          onClick={() => setMobileOpen(false)}
                        >
                          <link.icon
                            size={15}
                            strokeWidth={1.8}
                            className="shrink-0 text-neutral-400"
                          />
                          {link.label}
                        </Link>
                      ))}
                      <button
                        onClick={() => {
                          logout();
                          setMobileOpen(false);
                        }}
                        className="flex items-center gap-3 px-1 py-2.5 w-full text-left text-[13px] text-red-500 hover:text-red-600 transition-colors"
                      >
                        <LogOut
                          size={15}
                          strokeWidth={1.8}
                          className="shrink-0"
                        />
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <Link
                      href="/account/login"
                      className="flex items-center justify-center gap-2 h-11 bg-neutral-900 text-white rounded-xl text-[13.5px] font-semibold hover:bg-[#0C7290] transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      <User size={15} />
                      Login / Register
                    </Link>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>

      {/* ── Full-screen search overlay (mobile) ─────────────── */}
      {mobileSearchOpen && (
        <div className="fixed inset-0 z-[60] bg-white flex flex-col lg:hidden">
          {/* Top bar */}
          <div className="flex items-center gap-3 px-4 h-16 border-b border-neutral-100 shrink-0">
            <Search size={18} className="text-neutral-400 shrink-0" />
            <form
              onSubmit={(e) => {
                e.preventDefault();
                goToResults(mobileQ);
              }}
              className="flex-1"
            >
              <input
                ref={mobileInputRef}
                type="text"
                value={mobileQ}
                onChange={(e) => setMobileQ(e.target.value)}
                placeholder="Search electric cycles, parts…"
                className="w-full text-[15px] text-neutral-900 placeholder:text-neutral-400 outline-none bg-transparent"
              />
            </form>
            {mobileQ && (
              <button
                onClick={() => setMobileQ("")}
                className="w-6 h-6 flex items-center justify-center rounded-full bg-neutral-100 text-neutral-500 transition-colors shrink-0"
                aria-label="Clear"
              >
                <X size={13} />
              </button>
            )}
            <button
              onClick={closeMobileSearch}
              className="text-[13px] font-semibold text-neutral-500 hover:text-neutral-900 transition-colors shrink-0 pl-1"
            >
              Cancel
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto">
            {/* Empty state — show category shortcuts */}
            {mobileQ.trim() === "" && (
              <div className="px-5 pt-7 pb-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-4">
                  Browse by category
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {EV_LINKS.map((ev) => (
                    <Link
                      key={ev.name}
                      href={ev.href}
                      onClick={closeMobileSearch}
                      className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-neutral-50 hover:bg-[#F0FEFF] border border-neutral-100 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-xl bg-[#DDF8FD] flex items-center justify-center shrink-0">
                        <ev.icon
                          size={15}
                          className="text-[#0C7290]"
                          strokeWidth={1.8}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[12.5px] font-semibold text-neutral-800 leading-tight truncate">
                          {ev.name}
                        </p>
                        <p className="text-[10.5px] text-neutral-400 leading-tight truncate">
                          {ev.sub}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>

                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mt-6 mb-3">
                  Parts & accessories
                </p>
                <div className="flex flex-wrap gap-2">
                  {PART_CATS.slice(0, 8).map((cat) => (
                    <Link
                      key={cat.name}
                      href={cat.href}
                      onClick={closeMobileSearch}
                      className="px-3 py-1.5 text-[12px] font-medium text-neutral-700 bg-neutral-100 rounded-full hover:bg-[#DDF8FD] hover:text-[#0C7290] transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Loading */}
            {mobileQ.trim() !== "" && mobileSearchLoading && (
              <div className="flex items-center justify-center gap-2.5 py-14 text-sm text-neutral-400">
                <Loader2 size={18} className="animate-spin" />
                Searching…
              </div>
            )}

            {/* Results */}
            {mobileQ.trim() !== "" &&
              !mobileSearchLoading &&
              mobileResults.length > 0 && (
                <>
                  <ul className="divide-y divide-neutral-50">
                    {mobileResults.map((p) => (
                      <li key={p._id}>
                        <Link
                          href={`/shop/${p.slug}`}
                          onClick={closeMobileSearch}
                          className="flex items-center gap-3.5 px-5 py-3.5 hover:bg-neutral-50 transition-colors"
                        >
                          <div className="relative w-12 h-12 rounded-xl bg-neutral-50 border border-neutral-100 overflow-hidden shrink-0">
                            {p.images?.[0] ? (
                              <Image
                                src={p.images[0]}
                                alt={p.title}
                                fill
                                sizes="48px"
                                className="object-contain"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-neutral-300 text-sm font-bold">
                                {p.title?.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[13.5px] font-medium text-neutral-900 truncate">
                              {p.title}
                            </p>
                            <p className="text-[12px] text-neutral-500 mt-0.5">
                              ₹{Number(p.price).toLocaleString("en-IN")}
                            </p>
                          </div>
                          <ArrowRight
                            size={14}
                            className="text-neutral-300 shrink-0"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => goToResults(mobileQ)}
                    className="w-full px-5 py-4 text-[13px] font-semibold text-[#0C7290] text-left border-t border-neutral-100 hover:bg-neutral-50 transition-colors"
                  >
                    See all results for &ldquo;{mobileQ.trim()}&rdquo; →
                  </button>
                </>
              )}

            {/* No results */}
            {mobileQ.trim() !== "" &&
              !mobileSearchLoading &&
              mobileResults.length === 0 && (
                <div className="px-5 py-14 text-center">
                  <p className="text-sm font-medium text-neutral-500 mb-1">
                    No results for &ldquo;{mobileQ.trim()}&rdquo;
                  </p>
                  <p className="text-xs text-neutral-400">
                    Try a different keyword
                  </p>
                </div>
              )}
          </div>
        </div>
      )}
    </>
  );
}
