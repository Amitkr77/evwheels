"use client";

import { Search, ShoppingCart, User, Zap, Menu, X, ChevronRight, ChevronDown } from "lucide-react";
import React, { useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";

export default function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const totalQuantity = useCartStore((state) => state.totalQuantity);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Mobile Accordion State
  const [openMobileCategory, setOpenMobileCategory] = useState(null);

  const toggleDropdown = (menu) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  // Navigation Data Structure based on Strategy
  const navData = [
    {
      label: "Electric Mobility",
      key: "electric-mobility",
      subMenu: [
        { title: "E-Cycles", links: [{ label: "Mountain E-Bikes", href: "/cycles/mtb" }, { label: "City E-Bikes", href: "/cycles/city" }] },
        { title: "E-Scooty", links: [{ label: "High Speed", href: "/scooty/high-speed" }, { label: "Commuter", href: "/scooty/commuter" }] },
        { title: "EV Parts", links: [{ label: "Batteries", href: "/parts/batteries" }, { label: "Controllers", href: "/parts/controllers" }, { label: "Smart Displays", href: "/parts/displays" }] },
      ],
    },
    {
      label: "Cycles",
      key: "cycles",
      href: "/cycles", // Direct link to listing
    },
    {
      label: "Parts",
      key: "parts",
      subMenu: [
        { 
          title: "Drivetrain", 
          links: [
            { label: "Chains", href: "/parts/chains" }, 
            { label: "Freewheels", href: "/parts/freewheels" },
            { label: "Cranksets", href: "/parts/cranksets" },
            { label: "Pedals", href: "/parts/pedals" }
          ] 
        },
        { 
          title: "Braking System", 
          links: [
            { label: "Disc Brakes", href: "/parts/disc-brakes" }, 
            { label: "V-Brakes", href: "/parts/v-brakes" },
            { label: "Brake Pads", href: "/parts/brake-pads" }
          ] 
        },
        { 
          title: "Controls", 
          links: [
            { label: "Handlebars", href: "/parts/handlebars" }, 
            { label: "Gear Shifters", href: "/parts/gear-shifters" },
            { label: "Stems", href: "/parts/stems" }
          ] 
        },
        { 
          title: "Wheels & Suspension", 
          links: [
            { label: "Hubs & Rims", href: "/parts/wheels" }, 
            { label: "Forks", href: "/parts/forks" },
            { label: "Spokes", href: "/parts/spokes" }
          ] 
        },
      ],
    },
    {
      label: "Accessories",
      key: "accessories",
      subMenu: [
        { title: "Safety & Visibility", links: [{ label: "Helmets", href: "/accessories/helmets" }, { label: "Lights", href: "/accessories/lights" }, { label: "Locks", href: "/accessories/locks" }] },
        { title: "Comfort & Utility", links: [{ label: "Saddles", href: "/accessories/saddles" }, { label: "Bottle Cages", href: "/accessories/bottles" }, { label: "Mobile Holders", href: "/accessories/holders" }] },
        { title: "Maintenance", links: [{ label: "Tools", href: "/accessories/tools" }, { label: "Pumps", href: "/accessories/pumps" }, { label: "Stands", href: "/accessories/stands" }] },
      ],
    },
    {
      label: "Brands",
      key: "brands",
      subMenu: [
        { 
          title: "Premium Brands", 
          links: [
            { label: "Shimano", href: "/brand/shimano" }, 
            { label: "Neco", href: "/brand/neco" },
            { label: "Prowheel", href: "/brand/prowheel" }
          ] 
        },
        { 
          title: "All Brands", 
          links: [
            { label: "KMC / Maya", href: "/brand/kmc" }, 
            { label: "Beto", href: "/brand/beto" },
            { label: "Giant", href: "/brand/giant" },
            { label: "View All", href: "/brands" }
          ] 
        },
      ],
    },
    {
      label: "Wholesale / B2B",
      key: "wholesale",
      href: "/wholesale",
      isSpecial: true, // Optional flag for styling
    },
  ];

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
                placeholder="Search e-bikes, parts, Shimano..."
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

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navData.map((item) => (
              <div key={item.key} className="relative group">
                {item.href ? (
                  <Link
                    href={item.href}
                    className={`text-sm font-medium hover:text-primary transition-colors ${
                      item.isSpecial ? "text-primary" : ""
                    }`}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1"
                    onMouseEnter={() => setActiveDropdown(item.key)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    {item.label}
                    <ChevronDown className="w-3 h-3 opacity-50" />
                  </button>
                )}

                {/* Mega Dropdown */}
                {item.subMenu && activeDropdown === item.key && (
                  <div
                    className="
                      absolute left-1/2 -translate-x-1/2 top-full mt-3 w-[600px]
                      bg-white dark:bg-[#1a2c15] shadow-2xl rounded-2xl
                      border dark:border-[#2a3825] overflow-hidden
                      grid grid-cols-2 gap-0
                      animate-fade-in
                      z-50
                    "
                    onMouseEnter={() => setActiveDropdown(item.key)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    {item.subMenu.map((group) => (
                      <div key={group.title} className="p-4 even:bg-gray-50/50 dark:even:bg-white/5">
                        <h4 className="text-xs font-bold text-text-muted dark:text-gray-400 uppercase tracking-wider mb-3 px-2">
                          {group.title}
                        </h4>
                        <div className="space-y-1">
                          {group.links.map((link) => (
                            <Link
                              key={link.href}
                              href={link.href}
                              className="
                                block px-2 py-2 text-sm text-text-main dark:text-gray-200
                                hover:text-primary hover:translate-x-1
                                transition-all duration-200
                              "
                            >
                              {link.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-4 ml-4">
            {/* Auth */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  className="
                    flex items-center gap-2 px-3 py-1.5 rounded-lg
                    hover:bg-gray-100 dark:hover:bg-[#22301d] transition-colors border border-primary/20
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
                      absolute right-0 top-full mt-2 w-48
                      bg-white dark:bg-[#1a2c15] shadow-xl rounded-xl
                      border dark:border-[#2a3825] py-2 z-50
                    "
                  >
                    <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-[#22301d]">
                      Profile
                    </Link>
                    <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-[#22301d]">
                      My Orders
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-[#22301d]"
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
                  transition-colors border border-primary/20 hover:border-primary/40 rounded-lg px-4 py-1.5
                "
              >
                Sign in
              </Link>
            )}

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 hover:bg-gray-100 dark:hover:bg-[#22301d] rounded-full transition-colors group"
              aria-label={`Shopping cart with ${totalQuantity} items`}
            >
              <ShoppingCart className="w-5 h-5 group-hover:text-primary transition-colors" />
              {totalQuantity > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-5 bg-primary text-primary-content text-[10px] font-bold rounded-full flex items-center justify-center px-1.5">
                  {totalQuantity > 99 ? "99+" : totalQuantity}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden p-2 -mr-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div
            className="absolute right-0 top-0 h-full w-4/5 max-w-xs bg-white dark:bg-[#13200f] shadow-2xl overflow-y-auto animate-slide-in-right"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b dark:border-[#2a3825] flex justify-between items-center">
              <Link href="/" className="flex items-center gap-2.5" onClick={() => setMobileMenuOpen(false)}>
                <Zap className="w-6 h-6 text-primary fill-current" />
                <span className="text-lg font-bold">EvWheels</span>
              </Link>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="p-5">
              {navData.map((item) => (
                <div key={item.key} className="border-b dark:border-[#2a3825] last:border-0">
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="block py-4 font-medium text-text-main dark:text-white flex items-center justify-between"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    // Accordion Item
                    <div>
                      <button
                        className="w-full text-left py-4 font-medium text-text-main dark:text-white flex items-center justify-between"
                        onClick={() => setOpenMobileCategory(openMobileCategory === item.key ? null : item.key)}
                      >
                        {item.label}
                        {openMobileCategory === item.key ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                      
                      {openMobileCategory === item.key && (
                        <div className="pb-4 pl-4 space-y-4 animate-fade-in">
                          {item.subMenu.map((group) => (
                            <div key={group.title}>
                              <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                                {group.title}
                              </p>
                              <div className="space-y-2">
                                {group.links.map((link) => (
                                  <Link
                                    key={link.href}
                                    href={link.href}
                                    className="block py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-primary pl-2 border-l-2 border-transparent hover:border-primary transition-all"
                                    onClick={() => setMobileMenuOpen(false)}
                                  >
                                    {link.label}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* Mobile Auth Section */}
              <div className="pt-6 mt-4 border-t dark:border-[#2a3825]">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-3 mb-4 px-1">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                        {user?.name?.[0] || "U"}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full py-3 text-left text-sm text-red-600 dark:text-red-400 font-medium pl-2"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    href="/account/login"
                    className="block w-full py-3 text-center bg-primary text-primary-content rounded-lg font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In / Register
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