// components/TopBar.tsx

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  User,
  Menu,
  X,
  MessageCircle,
  ChevronDown,
  BatteryCharging,
  Zap,
  Lightbulb,
  Bike,
  ShieldCheck,
  Wrench,
} from "lucide-react";

export default function TopBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccessoriesOpen, setIsAccessoriesOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Cycles", href: "/cycles" },
    { label: "Accessories", href: "/accessories", hasDropdown: true },
    { label: "Why Us", href: "/why-us" },
    { label: "Contact", href: "/contact" },
  ];

  const accessoriesDropdown = [
    {
      label: "Batteries & Chargers",
      icon: BatteryCharging,
      href: "/accessories/batteries",
    },
    {
      label: "Lights & Safety",
      icon: Lightbulb,
      href: "/accessories/lights-safety",
    },
    { label: "Racks & Bags", icon: Bike, href: "/accessories/racks-bags" },
    {
      label: "Locks & Security",
      icon: ShieldCheck,
      href: "/accessories/locks",
    },
    { label: "Tools & Maintenance", icon: Wrench, href: "/accessories/tools" },
    { label: "Performance Upgrades", icon: Zap, href: "/accessories/upgrades" },
  ];

  return (
    <>
      {/* Top Bar / Navbar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#fdfcf9]/95 backdrop-blur-md shadow-sm border-b border-neutral-200/60"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3.5 z-50">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-emerald-800 flex items-center justify-center text-white font-['Playfair_Display'] font-semibold text-xl md:text-2xl shadow-sm">
                E
              </div>
              <span className="text-xl md:text-2xl font-['Playfair_Display'] font-medium tracking-tight text-neutral-900">
                EVWheels
              </span>
            </Link>

            {/* Desktop Menu */}
            <nav className="hidden lg:flex items-center gap-10">
              {navItems.map((item) => (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() =>
                    item.hasDropdown && setIsAccessoriesOpen(true)
                  }
                  onMouseLeave={() =>
                    item.hasDropdown && setIsAccessoriesOpen(false)
                  }
                >
                  <Link
                    href={item.href}
                    className="text-sm md:text-base font-medium text-neutral-700 hover:text-emerald-800 transition-colors flex items-center gap-1 group"
                  >
                    {item.label}
                    {item.hasDropdown && (
                      <ChevronDown
                        size={16}
                        className="transition-transform group-hover:rotate-180"
                      />
                    )}
                  </Link>

                  {/* Accessories Dropdown */}
                  {item.hasDropdown && (
                    <AnimatePresence>
                      {isAccessoriesOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-3 w-64 bg-white border border-neutral-200/70 rounded-xl shadow-lg overflow-hidden z-50"
                          onMouseEnter={() => setIsAccessoriesOpen(true)}
                          onMouseLeave={() => setIsAccessoriesOpen(false)}
                        >
                          <div className="py-3">
                            {accessoriesDropdown.map((subItem) => (
                              <Link
                                key={subItem.href}
                                href={subItem.href}
                                className="flex items-center gap-3 px-5 py-3 text-sm text-neutral-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
                              >
                                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-800">
                                  <subItem.icon size={18} />
                                </div>
                                <span>{subItem.label}</span>
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Icons */}
            <div className="flex items-center gap-5 md:gap-8">
              {/* WhatsApp Quick */}
              <Link
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                className="hidden md:flex items-center gap-2 text-neutral-700 hover:text-emerald-800 transition-colors"
              >
                <MessageCircle size={20} />
                <span className="text-sm font-medium">Chat</span>
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative text-neutral-700 hover:text-emerald-800 transition-colors"
              >
                <ShoppingBag size={22} strokeWidth={1.6} />
                <span className="absolute -top-1 -right-1 bg-emerald-800 text-white text-[10px] font-medium w-4 h-4 rounded-full flex items-center justify-center">
                  2
                </span>
              </Link>

              {/* User / Login */}
              <Link
                href="/login"
                className="text-neutral-700 hover:text-emerald-800 transition-colors"
              >
                <User size={22} strokeWidth={1.6} />
              </Link>

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden text-neutral-700 hover:text-emerald-800 transition-colors z-50"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-80 bg-[#fdfcf9] border-l border-neutral-200/70 z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-6">
                <button
                  className="absolute top-6 right-6 text-neutral-700 hover:text-emerald-800"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X size={28} />
                </button>

                <div className="flex items-center gap-3 mb-10">
                  <div className="w-10 h-10 rounded-xl bg-emerald-800 flex items-center justify-center text-white font-['Playfair_Display'] font-semibold text-2xl">
                    E
                  </div>
                  <span className="text-2xl font-['Playfair_Display'] font-medium text-neutral-900">
                    EVWheels
                  </span>
                </div>

                <div className="flex flex-col gap-6 mb-12">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-lg font-medium text-neutral-800 hover:text-emerald-800 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>

                <div className="space-y-4">
                  <Link
                    href="https://wa.me/919876543210"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 px-5 py-4 bg-emerald-800 text-white rounded-xl text-base font-medium hover:bg-emerald-900 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <MessageCircle size={20} />
                    Chat on WhatsApp
                  </Link>

                  <Link
                    href="/cart"
                    className="flex items-center gap-3 px-5 py-4 border border-neutral-300 text-neutral-900 rounded-xl text-base font-medium hover:bg-neutral-50 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <ShoppingBag size={20} />
                    View Cart (2)
                  </Link>

                  <Link
                    href="/login"
                    className="flex items-center gap-3 px-5 py-4 border border-neutral-300 text-neutral-900 rounded-xl text-base font-medium hover:bg-neutral-50 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User size={20} />
                    My Account
                  </Link>
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* Prevent content jump when navbar becomes sticky */}
      <div className="h-16 md:h-20" />
    </>
  );
}
