"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Bike,
  Wrench,
  Package,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";

export default function Navbar() {
  const { isAuthenticated, user, logout, isLoading } = useAuthStore();
  const totalQuantity = useCartStore((state) => state.totalQuantity);

  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Mobile Accordion State
  const [mobileOpenCategory, setMobileOpenCategory] = useState(null);

  const dropdownRef = useRef(null);

  // Navigation Data Structure based on Strategy
  const navItems = [
    {
      label: "Electric Mobility",
      icon: <Zap className="w-4 h-4" />, // Assuming Zap is imported or using Bike icon as fallback
      subMenu: [
        {
          title: "E-Cycles",
          links: [
            { label: "Mountain E-Bikes", href: "/cycles/mtb" },
            { label: "City E-Bikes", href: "/cycles/city" },
          ],
        },
        {
          title: "E-Scooty",
          links: [
            { label: "High Speed", href: "/scooty/high-speed" },
            { label: "Commuter", href: "/scooty/commuter" },
          ],
        },
        {
          title: "EV Parts",
          links: [
            { label: "Batteries", href: "/parts/batteries" },
            { label: "Controllers", href: "/parts/controllers" },
          ],
        },
      ],
    },
    {
      label: "Cycles",
      href: "/cycles",
    },
    {
      label: "Parts",
      icon: <Wrench className="w-4 h-4" />,
      subMenu: [
        {
          title: "Drivetrain",
          links: [
            { label: "Chains", href: "/parts/chains" },
            { label: "Freewheels", href: "/parts/freewheels" },
            { label: "Cranksets", href: "/parts/cranksets" },
            { label: "Pedals", href: "/parts/pedals" },
          ],
        },
        {
          title: "Braking System",
          links: [
            { label: "Disc Brakes", href: "/parts/disc-brakes" },
            { label: "V-Brakes", href: "/parts/v-brakes" },
            { label: "Brake Pads", href: "/parts/brake-pads" },
          ],
        },
        {
          title: "Controls & Cockpit",
          links: [
            { label: "Handlebars", href: "/parts/handlebars" },
            { label: "Gear Shifters", href: "/parts/gear-shifters" },
            { label: "Stems", href: "/parts/stems" },
          ],
        },
        {
          title: "Wheels & Suspension",
          links: [
            { label: "Hubs & Rims", href: "/parts/wheels" },
            { label: "Forks", href: "/parts/forks" },
            { label: "Spokes", href: "/parts/spokes" },
          ],
        },
      ],
    },
    {
      label: "Accessories",
      icon: <Package className="w-4 h-4" />,
      subMenu: [
        {
          title: "Safety & Visibility",
          links: [
            { label: "Helmets", href: "/accessories/helmets" },
            { label: "Lights", href: "/accessories/lights" },
            { label: "Locks", href: "/accessories/locks" },
          ],
        },
        {
          title: "Comfort & Utility",
          links: [
            { label: "Saddles", href: "/accessories/saddles" },
            { label: "Bottle Cages", href: "/accessories/bottles" },
            { label: "Mobile Holders", href: "/accessories/holders" },
          ],
        },
        {
          title: "Maintenance",
          links: [
            { label: "Tools", href: "/accessories/tools" },
            { label: "Pumps", href: "/accessories/pumps" },
            { label: "Stands", href: "/accessories/stands" },
          ],
        },
      ],
    },
    {
      label: "Brands",
      subMenu: [
        {
          title: "Premium",
          links: [
            { label: "Shimano", href: "/brand/shimano" },
            { label: "Neco", href: "/brand/neco" },
            { label: "Prowheel", href: "/brand/prowheel" },
          ],
        },
        {
          title: "All Brands",
          links: [
            { label: "KMC / Maya", href: "/brand/kmc" },
            { label: "Beto", href: "/brand/beto" },
            { label: "View All", href: "/brands" },
          ],
        },
      ],
    },
    {
      label: "Wholesale",
      href: "/wholesale",
      isSpecial: true, // Optional flag for styling
    },
  ];

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
    setMobileOpenCategory(null);
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
          ? "bg-[#fdfcf9]/95 backdrop-blur-xl shadow-sm"
          : " max-w-7xl mx-auto px-5  mt-2 bg-black/30 backdrop-blur-sm rounded-2xl"
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
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative group h-20 flex items-center"
              >
                {item.href ? (
                  <NavLink
                    href={item.href}
                    label={item.label}
                    textColor={textColor}
                    hoverColor={hoverColor}
                    isSpecial={item.isSpecial}
                  />
                ) : (
                  // Dropdown Trigger
                  <button
                    className={`flex items-center gap-1 text-sm lg:text-base font-medium tracking-wide transition-colors ${textColor} ${hoverColor}`}
                  >
                    {item.label}
                    <ChevronDown
                      size={14}
                      className="opacity-70 group-hover:rotate-180 transition-transform duration-200"
                    />
                  </button>
                )}

                {/* Mega Dropdown Content */}
                {item.subMenu && (
                  <div
                    className="
                      absolute left-1/2 -translate-x-1/2 top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300
                      w-[650px]
                    "
                  >
                    <div className="bg-[#fdfcf9] shadow-2xl rounded-2xl border border-neutral-200/50 overflow-hidden p-6 grid grid-cols-2 gap-8">
                      {item.subMenu.map((group) => (
                        <div key={group.title}>
                          <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">
                            {group.title}
                          </h4>
                          <div className="space-y-2">
                            {group.links.map((link) => (
                              <Link
                                key={link.href}
                                href={link.href}
                                className="block text-sm text-neutral-800 hover:text-emerald-700 hover:translate-x-1 transition-all duration-200"
                              >
                                {link.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
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
                        href="/profile"
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
            className={`fixed top-0 right-0 h-full w-4/5 max-w-xs bg-[#fdfcf9] shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
              mobileMenuOpen ? "translate-x-0" : "translate-x-full"
            } md:hidden overflow-y-auto`}
          >
            <div className="flex flex-col h-full">
              {/* Mobile Header */}
              <div className="flex justify-between items-center p-6 border-b border-neutral-200">
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

              {/* Mobile Navigation Links */}
              <div className="flex-1 p-6 space-y-1">
                {navItems.map((item) => (
                  <div
                    key={item.label}
                    className="border-b border-neutral-100 last:border-0"
                  >
                    {item.href ? (
                      <MobileNavLink
                        href={item.href}
                        label={item.label}
                        isSpecial={item.isSpecial}
                        onClick={() => setMobileMenuOpen(false)}
                      />
                    ) : (
                      // Accordion Item
                      <div>
                        <button
                          onClick={() =>
                            setMobileOpenCategory(
                              mobileOpenCategory === item.label
                                ? null
                                : item.label,
                            )
                          }
                          className="w-full flex items-center justify-between py-4 text-lg font-medium text-neutral-900"
                        >
                          {item.label}
                          {mobileOpenCategory === item.label ? (
                            <ChevronDown size={18} />
                          ) : (
                            <ChevronRight size={18} />
                          )}
                        </button>

                        {mobileOpenCategory === item.label && (
                          <div className="pl-4 pb-4 space-y-4 animate-fade-in">
                            {item.subMenu.map((group) => (
                              <div key={group.title}>
                                <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 mt-2">
                                  {group.title}
                                </p>
                                <div className="space-y-1">
                                  {group.links.map((link) => (
                                    <Link
                                      key={link.href}
                                      href={link.href}
                                      onClick={() => setMobileMenuOpen(false)}
                                      className="block py-2 text-sm text-neutral-600 hover:text-emerald-700"
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
              </div>

              {/* Mobile Auth Section */}
              <div className="p-6 border-t border-neutral-200 bg-neutral-50/50">
                {isAuthenticated ? (
                  <div className="flex flex-col gap-4">
                    <MobileNavLink
                      href="/profile"
                      label="Profile"
                      onClick={() => setMobileMenuOpen(false)}
                    />
                    <MobileNavLink
                      href="/profile"
                      label="My Orders"
                      onClick={() => setMobileMenuOpen(false)}
                    />
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left py-3 text-red-600 font-medium text-lg hover:text-red-700 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/account/login"
                    className="flex items-center justify-center gap-3 py-3 bg-emerald-700 text-white rounded-lg font-medium hover:bg-emerald-800 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User size={20} />
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
function NavLink({ href, label, textColor, hoverColor, isSpecial }) {
  return (
    <Link
      href={href}
      className={`text-sm lg:text-base font-medium tracking-wide relative group ${textColor} ${hoverColor} ${isSpecial ? "text-emerald-700 hover:text-emerald-600" : ""}`}
    >
      {label}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-current transition-all duration-300 group-hover:w-full" />
    </Link>
  );
}

function MobileNavLink({ href, label, isSpecial, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`block py-3 text-lg font-medium ${isSpecial ? "text-emerald-700" : "text-neutral-900"} hover:text-emerald-700 transition-colors`}
    >
      {label}
    </Link>
  );
}
