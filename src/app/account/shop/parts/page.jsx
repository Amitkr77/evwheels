// app/page.tsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  BatteryCharging,
  Leaf,
  ShieldCheck,
  Zap,
  ShoppingBag,
  MapPin,
  Truck,
  IndianRupee,
  HeartHandshake,
  MessageCircleHeart,
} from "lucide-react";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.15], [1, 0.92]);

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handle, { passive: true });
    return () => window.removeEventListener("scroll", handle);
  }, []);

  return (
    <div className="bg-neutral-50/70 min-h-screen text-neutral-900 font-sans antialiased">
      {/* ─── Navbar ─── */}
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-400 ${
          scrolled
            ? "bg-white/90 backdrop-blur-xl shadow-sm border-b border-neutral-100/80"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-8xl mx-auto px-5 sm:px-6 lg:px-8 flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#19B5D8] to-[#1297B5] flex items-center justify-center text-white font-black text-xl shadow-md group-hover:shadow-lg transition-shadow"
            >
              E
            </motion.div>
            <span className="text-2xl md:text-3xl font-extrabold tracking-tight">
              EVWheels
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-10 text-sm font-medium">
            <Link
              href="#cycles"
              className="hover:text-[#19B5D8] transition-colors"
            >
              Cycles
            </Link>
            <Link
              href="#accessories"
              className="hover:text-[#19B5D8] transition-colors"
            >
              Accessories
            </Link>
            <Link
              href="#why"
              className="hover:text-[#19B5D8] transition-colors"
            >
              Why EVWheels
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/cart"
              className="p-2.5 hover:bg-neutral-100 rounded-full transition-colors"
            >
              <ShoppingBag size={20} strokeWidth={1.8} />
            </Link>
            <Link
              href="#cycles"
              className="hidden sm:flex items-center gap-2.5 bg-neutral-900 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-neutral-800 transition-colors shadow-sm"
            >
              Shop Now
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="relative min-h-[100svh] flex items-center pt-20">
        <motion.div style={{ opacity, scale }} className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-950/60 via-neutral-900/40 to-[#0A4A5E]/30 mix-blend-multiply z-10" />
          <img
            src="https://images.unsplash.com/photo-1621577239950-449fb208e624?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Electric bicycle riding at dusk"
            className="object-cover w-full h-full brightness-[0.85] contrast-[1.05]"
          />
        </motion.div>

        <div className="relative z-10 max-w-8xl mx-auto px-5 sm:px-6 lg:px-8 w-full">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-lg border border-white/10 text-white/90 text-sm font-medium mb-8">
              <Leaf size={16} className="text-[#7DE8F5]" /> Ride Clean • Ride
              Far
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9] mb-10 text-white">
              Electric.
              <br />
              <span className="text-[#7DE8F5]">Effortless.</span>
            </h1>

            <p className="text-xl sm:text-2xl text-white/80 font-light max-w-2xl mb-14 leading-relaxed">
              Long-range e-cycles engineered for Indian cities, campuses and
              small towns.
            </p>

            <div className="flex flex-col sm:flex-row gap-5">
              <Link
                href="#cycles"
                className="group relative overflow-hidden bg-[#19B5D8] text-white px-10 py-5 rounded-full text-lg font-semibold inline-flex items-center justify-center gap-3 shadow-xl shadow-[#0C6E87]/25 hover:shadow-[#0C6E87]/40 transition-all duration-400"
              >
                <span className="relative z-10">Discover Cycles</span>
                <ArrowRight
                  className="relative z-10 group-hover:translate-x-1.5 transition-transform"
                  size={22}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#1297B5] to-[#0EA5C9] opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
              </Link>

              <Link
                href="#why"
                className="group px-10 py-5 rounded-full text-lg font-semibold border-2 border-white/30 text-white backdrop-blur-sm hover:bg-white/10 transition-all duration-300 inline-flex items-center justify-center gap-3"
              >
                Why Patna riders choose us
              </Link>
            </div>

            {/* Trust row */}
            <div className="flex flex-wrap gap-x-8 gap-y-4 mt-16 text-white/80 text-sm">
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={18} className="text-[#7DE8F5]" /> 24-month
                battery warranty
              </div>
              <div className="flex items-center gap-2.5">
                <Truck size={18} className="text-[#7DE8F5]" /> Free delivery
                in Bihar
              </div>
              <div className="flex items-center gap-2.5">
                <IndianRupee size={18} className="text-[#7DE8F5]" /> Easy EMI
                options
              </div>
              <div className="flex items-center gap-2.5">
                <HeartHandshake size={18} className="text-[#7DE8F5]" />{" "}
                After-sales in Patna
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating WhatsApp CTA */}
      <a
        href="https://wa.me/919876543210?text=Hello%20EVWheels%20team%2C%20I'm%20interested%20in%20your%20e-cycles%20%E2%80%A6"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-6 z-50 w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-transform duration-200"
      >
        <MessageCircleHeart size={32} className="text-white" fill="white" />
      </a>

      {/* ─── Value highlights ─── */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-8xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-10 lg:gap-16">
            {[
              {
                icon: BatteryCharging,
                title: "80–130 km real range",
                text: "Tested on Patna roads — one charge lasts most people 4–7 days of commuting",
              },
              {
                icon: Zap,
                title: "Smooth torque sensing",
                text: "Pedal-assist feels natural — no sudden jerks, just helpful power when you need it",
              },
              {
                icon: MapPin,
                title: "Local service & support",
                text: "Service center in Patna • quick response • original spares always available",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.8, delay: i * 0.12 }}
                className="bg-neutral-50/60 rounded-3xl p-10 border border-neutral-100 hover:border-[#19B5D8]/20 transition-colors group"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#DDF8FD] flex items-center justify-center mb-8 group-hover:bg-[#DDF8FD]/80 transition-colors">
                  <item.icon
                    size={32}
                    className="text-[#19B5D8]"
                    strokeWidth={1.8}
                  />
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-neutral-600 leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* You can continue with product showcase, accessories, testimonials, etc. */}

      <footer className="py-16 text-center text-neutral-500 border-t border-neutral-100">
        <p className="text-base">
          EVWheels Patna • Electric mobility for Bihar • ©{" "}
          {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
