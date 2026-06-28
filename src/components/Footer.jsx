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
  ShieldCheck,
  Truck,
  Battery,
  Wrench,
  Newspaper,
} from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setStatus("error");
      setTimeout(() => setStatus(""), 3000);
      return;
    }
    setStatus("success");
    setEmail("");
    setTimeout(() => setStatus(""), 4000);
  };

  return (
    <footer className="bg-[#121212] pt-16 pb-12 font-['Inter']">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-16">
          {/* Brand */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#19B5D8] flex items-center justify-center text-white font-['Playfair_Display'] font-semibold text-2xl shadow-sm">
                E
              </div>
              <h2 className="text-2xl md:text-3xl font-['Playfair_Display'] font-medium tracking-tight text-white">
                EVWheels
              </h2>
            </div>

            <p className="text-[#94A3B8] font-light leading-relaxed max-w-xs">
              Premium electric cycles crafted for real Indian roads — silent,
              capable, and built to last.
            </p>

            <div className="flex gap-5">
              <a
                href="https://facebook.com/evwheels"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="EVWheels on Facebook"
                className="text-[#64748B] hover:text-[#19B5D8] transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://instagram.com/evwheels"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="EVWheels on Instagram"
                className="text-[#64748B] hover:text-[#19B5D8] transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://twitter.com/evwheels"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="EVWheels on Twitter"
                className="text-[#64748B] hover:text-[#19B5D8] transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://youtube.com/@evwheels"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="EVWheels on YouTube"
                className="text-[#64748B] hover:text-[#19B5D8] transition-colors"
              >
                <Youtube size={20} />
              </a>
            </div>

            <div className="flex items-start gap-2 text-sm text-[#64748B]">
              <MapPin size={16} className="text-[#19B5D8] mt-0.5 shrink-0" />
              <span>Boring Road Crossing, Patna, Bihar 800001</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white mb-6 uppercase tracking-widest">
              Quick Links
            </h4>
            <ul className="space-y-3.5 text-sm text-[#94A3B8]">
              <li>
                <Link href="/cycles" className="hover:text-[#19B5D8] transition-colors">
                  Our Cycles
                </Link>
              </li>
              <li>
                <Link href="/why-us" className="hover:text-[#19B5D8] transition-colors">
                  Why EVWheels
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-[#19B5D8] transition-colors">
                  Support
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#19B5D8] transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/account/login" className="hover:text-[#19B5D8] transition-colors">
                  My Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xs font-bold text-white mb-6 uppercase tracking-widest">
              Support
            </h4>
            <ul className="space-y-3.5 text-sm text-[#94A3B8]">
              <li className="flex items-center gap-2">
                <Truck size={15} className="text-[#19B5D8] shrink-0" />
                <Link href="/shipping-policy" className="hover:text-[#19B5D8] transition-colors">
                  Shipping & Delivery
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck size={15} className="text-[#19B5D8] shrink-0" />
                <Link href="/returns" className="hover:text-[#19B5D8] transition-colors">
                  Returns & Refunds
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <Battery size={15} className="text-[#19B5D8] shrink-0" />
                <Link href="/support" className="hover:text-[#19B5D8] transition-colors">
                  Battery Care
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <Wrench size={15} className="text-[#19B5D8] shrink-0" />
                <Link href="/support" className="hover:text-[#19B5D8] transition-colors">
                  Service Centers
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={15} className="text-[#19B5D8] shrink-0" />
                <Link href="tel:+919876543210" className="hover:text-[#19B5D8] transition-colors">
                  +91 98765 43210
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xs font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-2">
              <Mail size={14} />
              Stay Updated
            </h4>
            <p className="text-sm text-[#94A3B8] mb-6 leading-relaxed">
              Get the latest on new models, offers, and Patna ride tips.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className={`w-full px-5 py-3.5 bg-[#1E293B] border ${
                  status === "error" ? "border-red-500" : "border-[#334155]"
                } rounded-xl focus:outline-none focus:border-[#19B5D8] transition-colors text-sm text-white placeholder-[#64748B]`}
                required
              />

              <button
                type="submit"
                className="w-full py-3.5 bg-[#19B5D8] text-white rounded-full text-sm font-medium hover:bg-[#1297B5] transition-colors flex items-center justify-center gap-2"
              >
                <Newspaper size={15} />
                Subscribe
              </button>

              {status === "success" && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[#19B5D8] text-sm font-light"
                >
                  Thank you! You&apos;re now on the list ⚡
                </motion.p>
              )}

              {status === "error" && (
                <p className="text-red-400 text-sm font-light">
                  Please enter a valid email address.
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#334155] pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-[#64748B]">
          <p>© {new Date().getFullYear()} EVWheels. Crafted with care in Patna.</p>

          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/returns" className="hover:text-white transition-colors">
              Returns Policy
            </Link>
            <Link href="/shipping-policy" className="hover:text-white transition-colors">
              Shipping
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
