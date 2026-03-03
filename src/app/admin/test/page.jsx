// app/page.tsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ShoppingBag, User } from "lucide-react";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.25], [0.92, 1]);

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handle, { passive: true });
    return () => window.removeEventListener("scroll", handle);
  }, []);

  return (
    <div className="bg-white text-neutral-900 min-h-screen font-sans antialiased overflow-x-hidden">
      {/* ─── Ultra-minimal Navbar ─── */}
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/95 backdrop-blur-xl shadow-[0_1px_0_rgba(0,0,0,0.06)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1920px] mx-auto px-8 lg:px-16 flex items-center justify-between h-20">
          <Link
            href="/"
            className="text-3xl font-light tracking-widest text-neutral-900"
          >
            EVWHEELS
          </Link>

          <div className="flex items-center gap-10">
            <Link
              href="/login"
              className="text-base font-light text-neutral-700 hover:text-black transition-colors"
            >
              <User size={20} strokeWidth={1.6} />
            </Link>

            <Link
              href="/cart"
              className="text-base font-light text-neutral-700 hover:text-black transition-colors"
            >
              <ShoppingBag size={22} strokeWidth={1.6} />
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero – pure image + huge number reveal ─── */}
      <section className="relative h-screen flex items-center justify-center">
        <motion.div
          style={{ scale, opacity }}
          className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white/30 z-10 pointer-events-none"
        />

        <img
          src="https://images.unsplash.com/photo-1631631480669-535cc43f232c?auto=format&fit=crop&q=90&w=2400"
          alt="EVWheels RangeX City – front three-quarter view"
          className="object-cover w-full h-full brightness-[0.92] contrast-[1.05]"
        />

        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1.4 }}
            className="text-[18vw] md:text-[16vw] lg:text-[14vw] font-black leading-none tracking-tighter text-neutral-900"
          >
            140
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="text-2xl md:text-4xl font-light mt-[-30px] md:mt-[-60px]"
          >
            km
          </motion.div>
        </div>
      </section>

      {/* ─── Second product full-bleed ─── */}
      <section className="relative h-screen flex items-center justify-center border-t border-neutral-200">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-200px" }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white/40 z-10 pointer-events-none"
        />

        <img
          src="https://images.unsplash.com/photo-1649972077917-2d9b0d2e3e8d?auto=format&fit=crop&q=90&w=2400"
          alt="EVWheels TrailX Pro – side profile on trail"
          className="object-cover w-full h-full brightness-[0.94]"
        />

        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="text-[18vw] md:text-[16vw] lg:text-[14vw] font-black leading-none tracking-tighter text-neutral-900"
          >
            25
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 1 }}
            className="text-2xl md:text-4xl font-light mt-[-30px] md:mt-[-60px]"
          >
            kg
          </motion.div>
        </div>
      </section>

      {/* ─── Third product + subtle specs ─── */}
      <section className="relative h-screen flex items-center justify-center border-t border-neutral-200">
        <img
          src="https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&q=90&w=2400"
          alt="EVWheels LiteX Fold – folded and riding modes"
          className="object-cover w-full h-full brightness-[0.96]"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white/30 z-10 pointer-events-none" />

        <div className="absolute bottom-20 md:bottom-32 left-6 md:left-12 lg:left-24 z-20">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="text-[14vw] md:text-[12vw] lg:text-[10vw] font-black leading-none tracking-tighter text-neutral-900 mb-4"
          >
            FOLD
          </motion.div>

          <motion.p
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 1 }}
            className="text-2xl md:text-4xl font-light text-neutral-700"
          >
            Compact. Portable. Effortless.
          </motion.p>
        </div>
      </section>

      {/* ─── Very minimal trust + CTA ─── */}
      <section className="py-40 md:py-64 bg-white text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="max-w-4xl mx-auto px-6 lg:px-12"
        >
          <div className="text-4xl md:text-6xl font-light leading-tight mb-16">
            Crafted for real roads.
            <br />
            Backed by real care.
          </div>

          <div className="flex flex-wrap justify-center gap-12 md:gap-20 text-xl md:text-2xl font-light text-neutral-600 mb-20">
            <div>2-Year Battery Warranty</div>
            <div>Free Shipping in Bihar</div>
            <div>EMI from ₹2,499/mo</div>
            <div>Patna Service Center</div>
          </div>

          <Link
            href="#cycles"
            className="inline-flex items-center gap-4 px-12 py-6 bg-neutral-900 text-white rounded-full text-2xl font-light hover:bg-neutral-800 transition-colors"
          >
            View All Models
            <ArrowRight size={28} />
          </Link>
        </motion.div>
      </section>

      <footer className="py-20 text-center text-neutral-500 border-t border-neutral-200 bg-white">
        <p className="text-lg font-light tracking-wide">
          EVWheels • Patna, Bihar • Designed for tomorrow
        </p>
      </footer>
    </div>
  );
}
