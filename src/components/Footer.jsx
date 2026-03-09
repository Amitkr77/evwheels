// components/Footer.tsx

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  MessageCircle,
  ShieldCheck,
  Truck,
  Battery,
  Wrench,
  Newspaper,
} from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(""); // "success" | "error" | ""

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setStatus("error");
      setTimeout(() => setStatus(""), 3000);
      return;
    }

    // Simulate successful subscription
    setStatus("success");
    setEmail("");
    setTimeout(() => setStatus(""), 4000);
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#fdfcf9]   pt-16 pb-12 font-['Inter']">
      {" "}
      {/* border-t border-neutral-200/70*/}
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-16">
          {/* Brand & Description */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-800 flex items-center justify-center text-white font-['Playfair_Display'] font-semibold text-2xl shadow-sm">
                E
              </div>
              <h2 className="text-2xl md:text-3xl font-['Playfair_Display'] font-medium tracking-tight text-neutral-900">
                EVWheels
              </h2>
            </div>

            <p className="text-neutral-600 font-light leading-relaxed max-w-xs">
              Premium electric cycles crafted for real Indian roads — silent,
              capable, and built to last.
            </p>

            {/* Social Icons */}
            <div className="flex gap-5">
              <a
                href="#"
                className="text-neutral-500 hover:text-emerald-800 transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-neutral-500 hover:text-emerald-800 transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-neutral-500 hover:text-emerald-800 transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="text-neutral-500 hover:text-emerald-800 transition-colors"
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-medium text-neutral-900 mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm text-neutral-600">
              <li>
                <Link
                  href="/cycles"
                  className="hover:text-emerald-800 transition-colors"
                >
                  Our Cycles
                </Link>
              </li>
              <li>
                <Link
                  href="/accessories"
                  className="hover:text-emerald-800 transition-colors"
                >
                  Accessories
                </Link>
              </li>
              <li>
                <Link
                  href="/why-us"
                  className="hover:text-emerald-800 transition-colors"
                >
                  Why EVWheels
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-emerald-800 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="hover:text-emerald-800 transition-colors"
                >
                  My Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-medium text-neutral-900 mb-6">
              Support
            </h4>
            <ul className="space-y-3 text-sm text-neutral-600">
              <li className="flex items-center gap-2">
                <Truck size={16} className="text-emerald-800" />
                <Link
                  href="#"
                  className="hover:text-emerald-800 transition-colors"
                >
                  Shipping & Delivery
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-800" />
                <Link
                  href="#"
                  className="hover:text-emerald-800 transition-colors"
                >
                  Warranty & Returns
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <Battery size={16} className="text-emerald-800" />
                <Link
                  href="#"
                  className="hover:text-emerald-800 transition-colors"
                >
                  Battery Care
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <Wrench size={16} className="text-emerald-800" />
                <Link
                  href="#"
                  className="hover:text-emerald-800 transition-colors"
                >
                  Service Centers
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-emerald-800" />
                <Link
                  href="tel:+919876543210"
                  className="hover:text-emerald-800 transition-colors"
                >
                  +91 98765 43210
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-medium text-neutral-900 mb-6 flex items-center gap-2">
              <Mail size={18} />
              Stay Updated
            </h4>
            <p className="text-sm text-neutral-600 mb-6 leading-relaxed">
              Get the latest on new models, offers, and Patna ride tips.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className={`w-full px-5 py-4 border ${
                  status === "error" ? "border-red-500" : "border-neutral-300"
                } rounded-lg focus:outline-none focus:border-emerald-600 transition-colors text-sm`}
                required
              />

              <button
                type="submit"
                className="w-full py-4 bg-neutral-900 text-white rounded-full text-sm md:text-base font-medium hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
              >
                <Newspaper size={16} />
                Subscribe
              </button>

              {status === "success" && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-emerald-700 text-sm font-light mt-2"
                >
                  Thank you! You're now on the list ⚡
                </motion.p>
              )}

              {status === "error" && (
                <p className="text-red-600 text-sm font-light mt-2">
                  Please enter a valid email address.
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-200/70 pt-10 mt-12 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-neutral-600">
          <p>
            © {new Date().getFullYear()} EVWheels. Crafted with care in Patna.
          </p>

          <div className="flex gap-6">
            <Link href="#" className="hover:text-neutral-900 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-neutral-900 transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-neutral-900 transition-colors">
              Warranty
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
