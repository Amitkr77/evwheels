"use client";

import React, { useState } from "react";
import {
  Zap,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  HelpCircle,
  Package,
  Truck,
  Shield,
  Phone,
  ShoppingCart,
  Battery,
  Wrench,
  Gift,
  Newspaper,
} from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(""); // "success", "error", or ""

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setTimeout(() => setStatus(""), 3000);
      return;
    }
    setStatus("success");
    setEmail("");
    setTimeout(() => setStatus(""), 3000);
  };

  return (
    <footer className="bg-white dark:bg-zinc-950 border-t border-gray-200 dark:border-gray-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-primary flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-text-main dark:text-white">
                EvWheels
              </h2>
            </div>
            <p className="text

text-sm text-text-muted dark:text-gray-400 leading-relaxed max-w-xs">
              Your one-stop shop for premium electric mobility solutions. We power your journey with quality parts and accessories.
            </p>
            <div className="flex gap-5">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-gray-500 hover:text-primary transition-colors"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-gray-500 hover:text-primary transition-colors"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter / X"
                className="text-gray-500 hover:text-primary transition-colors"
              >
                <Twitter className="w-6 h-6" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="text-gray-500 hover:text-primary transition-colors"
              >
                <Youtube className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-bold text-text-main dark:text-white mb-5">Shop</h4>
            <ul className="space-y-3 text-sm text-text-muted dark:text-gray-400">
              <li>
                <a href="#" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <ShoppingCart className="w-4 h-4" />
                  Electric Cycles
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <Battery className="w-4 h-4" />
                  Batteries
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <Wrench className="w-4 h-4" />
                  Spare Parts
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <Package className="w-4 h-4" />
                  Accessories
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <Gift className="w-4 h-4" />
                  New Arrivals
                </a>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-bold text-text-main dark:text-white mb-5">Support</h4>
            <ul className="space-y-3 text-sm text-text-muted dark:text-gray-400">
              <li>
                <a href="#" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <HelpCircle className="w-4 h-4" />
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <Shield className="w-4 h-4" />
                  Compatibility Guide
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <Truck className="w-4 h-4" />
                  Shipping & Returns
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <Shield className="w-4 h-4" />
                  Warranty Info
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <Phone className="w-4 h-4" />
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold text-text-main dark:text-white mb-5 flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Stay Charged
            </h4>
            <p className="text-sm text-text-muted dark:text-gray-400 mb-6">
              Subscribe for latest updates and exclusive offers.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <input
                className={`flex-1 px-4 py-3 rounded-lg text-sm bg-gray-100 dark:bg-zinc-900 border ${
                  status === "error" ? "border-red-500" : "border-transparent"
                } focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-gray-500 transition-all`}
                placeholder="Your email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="bg-primary hover:bg-green-500 text-primary-foreground font-bold px-6 py-3 rounded-lg text-sm transition-all duration-200 whitespace-nowrap flex items-center justify-center gap-2"
              >
                <Newspaper className="w-4 h-4" />
                Subscribe
              </button>
            </form>
            {status === "success" && (
              <p className="text-green-600 dark:text-green-400 text-xs mt-2">
                Thanks for subscribing! ⚡
              </p>
            )}
            {status === "error" && (
              <p className="text-red-600 dark:text-red-400 text-xs mt-2">
                Please enter a valid email.
              </p>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p className="text-text-muted dark:text-gray-500">
            © {new Date().getFullYear()} EvWheels Inc. All rights reserved.
          </p>
          <div className="flex gap-6 text-text-muted dark:text-gray-500">
            <a href="#" className="hover:text-text-main dark:hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-text-main dark:hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-text-main dark:hover:text-white transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}