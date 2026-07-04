"use client";

import { useState, useEffect } from "react";
import { Phone, Mail, Truck, ChevronLeft, ChevronRight } from "lucide-react";

const ANNOUNCEMENTS = [
  "Free Delivery on Orders Above ₹5,000",
  "B2B Wholesale Pricing — Bulk Orders Welcome",
  "Cash on Delivery Available Across Bihar & Jharkhand",
];

export default function TopBar() {
  const [scrolled, setScrolled] = useState(false);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Auto-rotate announcements
  useEffect(() => {
    const t = setInterval(() => {
      setCurrent((c) => (c + 1) % ANNOUNCEMENTS.length);
    }, 4000);
    return () => clearInterval(t);
  }, []);

  const prev = () =>
    setCurrent((c) => (c - 1 + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length);
  const next = () => setCurrent((c) => (c + 1) % ANNOUNCEMENTS.length);

  return (
    <div
      className={`fixed top-0 inset-x-0 z-[70] h-9 bg-neutral-900 text-white text-xs transition-transform duration-300 ${
        scrolled ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 h-full flex items-center justify-between gap-4">
        {/* Left — contact info (desktop only) */}
        <div className="hidden lg:flex items-center gap-5 shrink-0">
          <a
            href="tel:+919876543210"
            className="flex items-center gap-1.5 text-neutral-300 hover:text-white transition-colors"
          >
            <Phone size={12} />
            +91 8298922623{" "}
          </a>
          <a
            href="mailto:info@evwheels.in"
            className="flex items-center gap-1.5 text-neutral-300 hover:text-white transition-colors"
          >
            <Mail size={12} />
            info@evwheels.in
          </a>
        </div>

        {/* Center — rotating announcements */}
        <div className="flex-1 flex items-center justify-center gap-3 min-w-0">
          <button
            onClick={prev}
            className="text-neutral-400 hover:text-white transition-colors shrink-0"
            aria-label="Previous announcement"
          >
            <ChevronLeft size={14} />
          </button>

          <div className="flex items-center gap-1.5 font-medium tracking-wide truncate">
            <Truck size={12} className="text-[#19B5D8] shrink-0" />
            <span className="truncate">{ANNOUNCEMENTS[current]}</span>
          </div>

          <button
            onClick={next}
            className="text-neutral-400 hover:text-white transition-colors shrink-0"
            aria-label="Next announcement"
          >
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Right — dots (desktop) */}
        <div className="hidden lg:flex items-center shrink-0">
          {ANNOUNCEMENTS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="p-[9px] flex items-center justify-center"
              aria-label={`Go to announcement ${i + 1}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === current
                    ? "bg-[#19B5D8]"
                    : "bg-neutral-600 hover:bg-neutral-400"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
