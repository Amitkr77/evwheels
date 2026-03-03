// app/page.tsx

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowRight, Zap, BatteryCharging, Gauge, Rocket,
  MapPin, ShieldCheck, Truck, IndianRupee, MessageCircle
} from 'lucide-react'

const fadeIn = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: 'easeOut' } }
}

const staggerFast = {
  visible: { transition: { staggerChildren: 0.08 } }
}

export default function Home() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="bg-[#0f1115] text-white min-h-screen font-sans overflow-x-hidden">

      {/* ─── Sharp Navbar ─── */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-400 ${
        scrolled
          ? 'bg-black/90 backdrop-blur-xl border-b border-lime-900/30'
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-4">
            <div className="w-10 h-10 bg-lime-600 rounded-sm flex items-center justify-center text-black font-black text-2xl shadow-[0_0_20px_rgba(190,255,0,0.4)]">
              E
            </div>
            <span className="text-3xl font-black tracking-tighter text-lime-400">EVWHEELS</span>
          </Link>

          <div className="hidden md:flex items-center gap-12 text-base font-medium tracking-wider">
            <Link href="#cycles" className="hover:text-lime-400 transition-colors">CYCLES</Link>
            <Link href="#specs" className="hover:text-lime-400 transition-colors">SPECS</Link>
            <Link href="/login" className="hover:text-lime-400 transition-colors">ACCOUNT</Link>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/cart" className="text-xl hover:text-lime-400 transition-colors">
              Cart
            </Link>
            <Link
              href="#cycles"
              className="px-8 py-3 bg-lime-600 text-black rounded-none font-black hover:bg-lime-500 transition-colors shadow-[0_0_15px_rgba(190,255,0,0.5)]"
            >
              RIDE NOW
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-950 to-black z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(190,255,0,0.08),transparent_40%)]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerFast}
            className="max-w-5xl"
          >
            <motion.div variants={fadeIn} className="text-lime-500 font-black text-xl md:text-2xl tracking-widest mb-6">
              NEXT-GEN ELECTRIC
            </motion.div>

            <motion.h1
              variants={fadeIn}
              className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-none tracking-[-0.06em] mb-10 text-white"
            >
              UNLEASH<br />
              <span className="text-lime-400">THE TORQUE</span>
            </motion.h1>

            <motion.p
              variants={fadeIn}
              className="text-2xl md:text-3xl font-light text-neutral-300 max-w-4xl mb-16 leading-tight"
            >
              Instant torque. Silent acceleration. 140 km range. Built to dominate Indian streets.
            </motion.p>

            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-8">
              <Link
                href="#cycles"
                className="group px-12 py-6 bg-lime-600 text-black font-black text-2xl hover:bg-lime-500 transition-colors shadow-[0_0_30px_rgba(190,255,0,0.4)] hover:shadow-[0_0_50px_rgba(190,255,0,0.6)]"
              >
                POWER UP →
              </Link>

              <Link
                href="#specs"
                className="px-12 py-6 border-2 border-lime-600/50 text-lime-400 font-black text-2xl hover:bg-lime-950/50 transition-colors"
              >
                SEE SPECS
              </Link>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="flex flex-wrap gap-12 mt-20 text-lg font-medium text-neutral-400"
            >
              <div className="flex items-center gap-4">
                <Zap size={28} className="text-lime-500" /> Instant Torque
              </div>
              <div className="flex items-center gap-4">
                <BatteryCharging size={28} className="text-lime-500" /> 140 km Range
              </div>
              <div className="flex items-center gap-4">
                <Rocket size={28} className="text-lime-500" /> 25 km/h Top Speed
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Floating WhatsApp */}
      <a
        href="https://wa.me/919876543210?text=Hi%20EVWheels%20team%2C%20I%20want%20to%20feel%20the%20torque..."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-10 right-10 z-50 w-16 h-16 bg-lime-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(190,255,0,0.5)] hover:scale-110 transition-transform duration-300"
      >
        <MessageCircle size={32} className="text-black" />
      </a>

      {/* ─── Performance Specs ─── */}
      <section id="specs" className="py-32 md:py-48 bg-black border-t border-lime-900/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-20">
            <h2 className="text-6xl md:text-8xl font-black text-lime-400 tracking-tighter mb-6">
              RAW NUMBERS
            </h2>
            <p className="text-2xl text-neutral-400 font-light">
              No hype. Just performance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
            {[
              { icon: Zap, value: '45 Nm', label: 'Peak Torque' },
              { icon: BatteryCharging, value: '140 km', label: 'Real Range' },
              { icon: Gauge, value: '25 km/h', label: 'Top Assisted Speed' },
              { icon: Rocket, value: '< 4 s', label: '0–25 km/h' }
            ].map((spec, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="text-center p-10 border border-lime-900/40 hover:border-lime-600/60 transition-colors bg-black/60 backdrop-blur-sm"
              >
                <spec.icon size={64} className="mx-auto mb-8 text-lime-500" strokeWidth={1.4} />
                <div className="text-6xl md:text-7xl font-black text-white mb-4">{spec.value}</div>
                <div className="text-xl text-neutral-400 font-medium">{spec.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="py-40 md:py-56 bg-gradient-to-b from-black to-neutral-950 text-center">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="max-w-5xl mx-auto px-6 lg:px-12"
        >
          <h2 className="text-6xl md:text-8xl font-black text-lime-400 tracking-tighter mb-12">
            FEEL THE FUTURE
          </h2>

          <Link
            href="#cycles"
            className="inline-flex items-center gap-6 px-16 py-8 bg-lime-600 text-black text-3xl font-black hover:bg-lime-500 transition-colors shadow-[0_0_60px_rgba(190,255,0,0.4)]"
          >
            UNLOCK POWER
            <ArrowRight size={40} />
          </Link>
        </motion.div>
      </section>

      <footer className="py-16 text-center text-neutral-500 border-t border-lime-900/30 bg-black">
        <p className="text-xl font-medium">
          EVWHEELS • PATNA • 2026
        </p>
      </footer>
    </div>
  )
}