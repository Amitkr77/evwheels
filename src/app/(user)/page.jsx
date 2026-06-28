// app/page.tsx

"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BatteryCharging,
  Leaf,
  MapPin,
  ShieldCheck,
  Truck,
  IndianRupee,
  MessageCircle,
  Bike,
  Headphones,
  Lock,
  Lightbulb,
  Zap,
} from "lucide-react";
import HeroSlider from "@/components/home/HeroSlider";
import UpgradeYourRide from "@/components/home/UpgradeYourRide";
import ShopByCategory from "@/components/home/ShopBycategory";
import BestSellersShimano from "@/components/home/BestSellersShimano";
import SafetyFirst from "@/components/home/SafetyFirst";
import MechanicsChoice from "@/components/home/MechanicsChoice";
import BudgetEssentials from "@/components/home/BudgetEssentials";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: "easeOut" } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.18 } },
};

export default function Home() {

  return (
    <>
      {/* Font imports – add to layout.tsx or document head if preferred */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <div className="bg-[#fdfcf9] text-neutral-900 min-h-screen font-['Inter']">
        {/* ─── hero section ─── */}
        <section className="relative h-[85vh] md:h-screen flex items-center pt-20 pb-16 md:pb-0">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1621577239950-449fb208e624?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="EV cycle on Patna street – golden hour calm ride"
              className="object-cover w-full h-full brightness-[0.93] contrast-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#fdfcf9] via-transparent/40 to-transparent/70" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full">
            <motion.h1
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.3, delay: 0.4 }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-['Playfair_Display'] font-bold leading-tight tracking-tight text-neutral-900"
            >
              Electric.
              <br />
              <span className="text-white">Effortless.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.7 }}
              className="mt-8 text-lg md:text-xl lg:text-2xl font-light text-white max-w-2xl"
            >
              Electric cycles crafted for real roads —{" "}
              <span className="font-bold text-emerald-500">
                long range, silent motion, thoughtful design.
              </span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
              className="mt-12 flex flex-col sm:flex-row gap-6"
            >
              <Link
                href="#cycles"
                className="inline-flex items-center gap-3 px-10 py-4 bg-neutral-900 text-white rounded-full text-lg font-light hover:bg-neutral-800 transition-colors"
              >
                Explore Cycles
                <ArrowRight size={20} />
              </Link>

              <Link
                href="/why-us"
                className="inline-flex items-center gap-3 px-10 py-4 border border-neutral-400 text-white hover:text-neutral-800 rounded-full text-lg font-light hover:bg-neutral-100 transition-colors"
              >
                Why EVWheels
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ─── Light Trust Bar ─── */}
        <section className="pt-24 md:pt-32 bg-white border-t border-neutral-200/60">
          <div className="max-w-7xl mx-auto px-8 lg:px-16">
            <div className="grid md:grid-cols-4 gap-12 text-center">
              <div>
                <ShieldCheck
                  size={24}
                  className="mx-auto mb-6 text-emerald-800"
                  strokeWidth={1.4}
                />
                <p className="text-base font-light">2-Year Battery Warranty</p>
              </div>
              <div>
                <Truck
                  size={24}
                  className="mx-auto mb-6 text-emerald-800"
                  strokeWidth={1.4}
                />
                <p className="text-base font-light">Free Bihar Shipping</p>
              </div>
              <div>
                <IndianRupee
                  size={24}
                  className="mx-auto mb-6 text-emerald-800"
                  strokeWidth={1.4}
                />
                <p className="text-base font-light">EMI from ₹2,499/mo</p>
              </div>
              <div>
                <MapPin
                  size={24}
                  className="mx-auto mb-6 text-emerald-800"
                  strokeWidth={1.4}
                />
                <p className="text-base font-light">Patna Service</p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── HeroSlider ─── */}
        {/* <HeroSlider /> */}

        {/* upgrade your ride */}
        <UpgradeYourRide />

        {/* Shop by Category */}
        <ShopByCategory />

        {/* Best seller */}
        <BestSellersShimano />

        {/* Safety first  */}
        <SafetyFirst />

        {/* ─── MechanicsChoice ─── */}
        <MechanicsChoice />

        {/* Budget Essentials */}
        <BudgetEssentials />

        {/* ─── Featured Products ─── */}
        {/* <section id="cycles" className="pt-24 md:pt-40 bg-white">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-4xl md:text-5xl font-['Playfair_Display'] font-medium text-center mb-16 md:mb-20"
          >
            Featured Cycles
          </motion.h2>

          <div className="max-w-6xl mx-auto px-6 lg:px-12 space-y-32 md:space-y-48">
            {loading ? (
              <div className="text-center py-20 text-neutral-500">
                Loading featured cycles...
              </div>
            ) : featuredProducts.length === 0 ? (
              <div className="text-center py-20 text-neutral-500">
                No featured products available at the moment.
              </div>
            ) : (
              featuredProducts.map((product, index) => {
                const isEven = index % 2 === 0;

                return (
                  <Link
                    key={product._id}
                    href={`/cycles/${product.slug}`}
                    className={`block`}
                  >
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true, margin: "-150px" }}
                      transition={{ duration: 1.4 }}
                      className={`grid md:grid-cols-2 gap-16 lg:gap-24 items-center cursor-pointer ${
                        !isEven ? "md:flex-row-reverse" : ""
                      }`}
                    >
                      <div className={isEven ? "" : "order-2 md:order-1"}>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-['Playfair_Display'] font-light leading-tight mb-10">
                          {product.title}
                        </h2>
                        <div className="space-y-5 text-lg md:text-xl font-light text-neutral-700">
                          <div className="text-3xl font-medium text-neutral-900">
                            ₹ {product.price.toLocaleString("en-IN")}
                          </div>
                          <div>
                            {product.specs?.battery?.range || "?"} km real range
                          </div>
                          <div>{product.specs?.physical?.weight || "?"} kg</div>
                          {product.description && (
                            <p className="text-base text-neutral-600 mt-4">
                              {product.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className={isEven ? "" : "order-1 md:order-2"}>
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-full h-auto object-cover rounded-none shadow-xl"
                        />
                      </div>
                    </motion.div>
                  </Link>
                );
              })
            )}
          </div>
        </section> */}

        {/* ─── Accessories Section ─── */}
        <section
          id="accessories"
          className="pt-20 md:pt-28  bg-white border-neutral-200/60"
        >
          <div className="max-w-6xl mx-auto px-6 lg:px-12">
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="text-4xl md:text-5xl font-['Playfair_Display'] font-medium text-center mb-16 md:mb-20"
            >
              Accessories
            </motion.h2>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 md:gap-12 lg:gap-16 text-center"
            >
              {[
                { icon: Bike, title: "Rear Rack", desc: "25 kg capacity" },
                {
                  icon: Headphones,
                  title: "Helmet",
                  desc: "Ventilated & lightweight",
                },
                { icon: Lock, title: "Smart Lock", desc: "App connected" },
                { icon: Lightbulb, title: "Front Light", desc: "200 lumens" },
                { icon: ShieldCheck, title: "Frame Lock", desc: "Heavy-duty" },
                {
                  icon: BatteryCharging,
                  title: "Extra Battery",
                  desc: "Range extender",
                },
                { icon: MapPin, title: "Phone Mount", desc: "Secure grip" },
                { icon: Zap, title: "Fast Charger", desc: "4-hour charge" },
              ].map((item, i) => (
                <motion.div key={i} variants={fadeIn} className="group">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-5 sm:mb-6 rounded-full bg-emerald-50/40 flex items-center justify-center transition-colors group-hover:bg-emerald-50">
                    <item.icon
                      size={24}
                      className="text-emerald-800"
                      strokeWidth={1.5}
                    />
                  </div>
                  <h3 className="text-base sm:text-lg font-medium mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-neutral-600 font-light">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ─── Why Us – thin & airy ─── */}
        <section id="why-us" className="py-32 md:py-48  bg-white">
          <div className="max-w-5xl mx-auto px-8 lg:px-16 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-light mb-20 md:mb-28"
            >
              Why EVWheels
            </motion.h2>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="grid md:grid-cols-3 gap-16 lg:gap-24"
            >
              <motion.div variants={fadeIn}>
                <div className="w-10 h-10 mx-auto mb-10 rounded-full bg-emerald-50/40 flex items-center justify-center">
                  <BatteryCharging
                    size={22}
                    className="text-emerald-800"
                    strokeWidth={1.4}
                  />
                </div>
                <h3 className="text-2xl font-light mb-5">Real Range</h3>
                <p className="text-base text-neutral-600 font-light leading-relaxed">
                  80–140 km tested in real Patna conditions.
                </p>
              </motion.div>

              <motion.div variants={fadeIn}>
                <div className="w-10 h-10 mx-auto mb-10 rounded-full bg-emerald-50/40 flex items-center justify-center">
                  <Leaf
                    size={22}
                    className="text-emerald-800"
                    strokeWidth={1.4}
                  />
                </div>
                <h3 className="text-2xl font-light mb-5">Silent Craft</h3>
                <p className="text-base text-neutral-600 font-light leading-relaxed">
                  No noise. No vibration. Pure calm movement.
                </p>
              </motion.div>

              <motion.div variants={fadeIn}>
                <div className="w-10 h-10 mx-auto mb-10 rounded-full bg-emerald-50/40 flex items-center justify-center">
                  <MapPin
                    size={22}
                    className="text-emerald-800"
                    strokeWidth={1.4}
                  />
                </div>
                <h3 className="text-2xl font-light mb-5">Patna Care</h3>
                <p className="text-base text-neutral-600 font-light leading-relaxed">
                  Local service. Fast response. Real support.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ─── Final CTA ─── */}
        {/* <section className="py-32 md:py-48 bg-[#fdfcf9] text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="max-w-4xl mx-auto px-8 lg:px-16"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-thin leading-tight mb-12">
              Move gently.
              <br />
              Arrive clearly.
            </h2>

            <Link
              href="#cycles"
              className="inline-flex items-center gap-3 px-10 py-4 bg-neutral-900 text-white rounded-full text-lg font-light hover:bg-neutral-800 transition-colors"
            >
              View Cycles
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </section> */}

        <section className="relative h-screen flex items-center justify-center border-t border-neutral-200">
          <img
            src="https://images.unsplash.com/photo-1621394457665-6e6d4961f686?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
              Move gently.
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

        {/* Floating WhatsApp – subtle */}
        <a
          href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210"}?text=Hello%20EVWheels...`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-10 right-10 z-50 w-12 h-12 bg-emerald-800/80 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform duration-300"
        >
          <MessageCircle size={24} className="text-white" />
        </a>

        
      </div>
    </>
  );
}
