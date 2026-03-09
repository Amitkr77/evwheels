"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  BatteryCharging,
  Leaf,
  MapPin,
  ShieldCheck,
  Truck,
  IndianRupee,
  Wrench,
  HeartHandshake,
  Award,
  Battery,
  ArrowRight,
  MessageCircle,
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const staggerContainer = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

export default function WhyUsPage() {
  return (
    <div className="min-h-screen bg-[#fdfcf9] font-['Inter'] pt-20 pb-20">
       <div className="fixed top-0 left-0 w-full h-18 overflow-hidden">
        <div className="absolute inset-0 subtle-gradient"></div>
      </div>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Hero Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-center mb-20 md:mb-28"
        >
          <motion.span
            variants={fadeInUp}
            className="inline-block px-5 py-2 bg-emerald-50 text-emerald-800 rounded-full text-sm md:text-base font-medium mb-6"
          >
            Why Choose EVWheels
          </motion.span>

          <motion.h1
            variants={fadeInUp}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-['Playfair_Display'] font-medium text-neutral-900 leading-tight mb-6"
          >
            Ride Better.
            <br />
            <span className="text-emerald-800">Live Quieter.</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl text-neutral-600 font-light max-w-3xl mx-auto leading-relaxed"
          >
            We’re not just selling electric cycles — we’re building calm,
            reliable, and joyful mobility for the roads of Patna and beyond.
          </motion.p>
        </motion.div>

        {/* Core Values Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-8 lg:gap-12 mb-20 md:mb-32"
        >
          {[
            {
              icon: <BatteryCharging size={32} />,
              title: "Real Tested Range",
              desc: "80–140 km certified on actual Patna roads — not lab conditions. Ride with confidence, not range anxiety.",
            },
            {
              icon: <Leaf size={32} />,
              title: "Silent & Refined Ride",
              desc: "Mid-drive motors, torque sensors, and thoughtful ergonomics deliver the quietest, smoothest experience possible.",
            },
            {
              icon: <MapPin size={32} />,
              title: "Patna-First Support",
              desc: "Local service center, fast response, genuine parts — ownership that actually feels local and caring.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="bg-white border border-neutral-200/70 rounded-2xl p-8 hover:border-emerald-200/60 transition-colors group"
            >
              <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mb-6 text-emerald-800 group-hover:bg-emerald-100 transition-colors">
                {item.icon}
              </div>
              <h3 className="text-2xl font-['Playfair_Display'] font-medium text-neutral-900 mb-4">
                {item.title}
              </h3>
              <p className="text-neutral-600 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Why Patna Riders Choose Us */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="mb-20 md:mb-32"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-['Playfair_Display'] font-medium text-center text-neutral-900 mb-12 md:mb-16">
            Built for Patna, Loved in Patna
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                icon: <Truck size={28} />,
                title: "Free Shipping Across Bihar",
                desc: "No delivery charges — anywhere in Bihar. We bring the cycle to your door.",
              },
              {
                icon: <IndianRupee size={28} />,
                title: "EMI Starting ₹2,499/mo",
                desc: "Flexible no-cost EMI plans so you can ride today and pay comfortably.",
              },
              {
                icon: <ShieldCheck size={28} />,
                title: "2-Year Battery Warranty",
                desc: "Longest battery coverage in the segment — peace of mind for years.",
              },
              {
                icon: <Wrench size={28} />,
                title: "Local Service in Patna",
                desc: "Our own service center — quick fixes, genuine parts, no long waits.",
              },
              {
                icon: <HeartHandshake size={28} />,
                title: "Ride & Return Policy",
                desc: "Not satisfied in first 7 days? Return it hassle-free (conditions apply).",
              },
              {
                icon: <Battery size={28} />,
                title: "Real-World Range Testing",
                desc: "Every model tested in Patna traffic, heat, and monsoon — real numbers you can trust.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="flex gap-5 bg-white border border-neutral-200/70 rounded-xl p-6 hover:border-emerald-200/60 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-800 shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-lg font-medium text-neutral-900 mb-2">
                    {item.title}
                  </h4>
                  <p className="text-neutral-600 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Real-World Range & Performance */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="mb-20 md:mb-32"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-['Playfair_Display'] font-medium text-center text-neutral-900 mb-10 md:mb-14">
            Real Range — Not Just Claims
          </h2>

          <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
            <motion.div variants={fadeInUp}>
              <img
                src="https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&q=80&w=1600"
                alt="EV cycle riding in Patna street – real urban test"
                className="rounded-2xl shadow-lg w-full h-auto object-cover"
              />
            </motion.div>

            <motion.div variants={fadeInUp} className="space-y-6">
              <p className="text-lg text-neutral-600 leading-relaxed">
                Most e-cycles in India claim 100–150 km range — but in real
                Patna conditions (traffic, heat, potholes, monsoon), you get{" "}
                <strong>65–80% of claimed range</strong> in pedal-assist mode
                and <strong>45–55% in throttle-only</strong>.
              </p>

              <ul className="space-y-4 text-neutral-700">
                <li className="flex items-start gap-3">
                  <BatteryCharging
                    size={24}
                    className="text-emerald-800 shrink-0 mt-1"
                  />
                  <div>
                    <strong className="text-neutral-900">RangeX City</strong> —
                    Claimed 140 km → Real-world 90–110 km (Patna mixed riding)
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <BatteryCharging
                    size={24}
                    className="text-emerald-800 shrink-0 mt-1"
                  />
                  <div>
                    <strong className="text-neutral-900">TrailX Pro</strong> —
                    Claimed 120 km → Real-world 75–95 km (off-road + city)
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <BatteryCharging
                    size={24}
                    className="text-emerald-800 shrink-0 mt-1"
                  />
                  <div>
                    <strong className="text-neutral-900">LiteX Fold</strong> —
                    Claimed 90 km → Real-world 55–70 km (urban folding use)
                  </div>
                </li>
              </ul>

              <p className="text-sm text-neutral-500 italic">
                We test every model on actual Patna roads — not labs — so you
                get numbers you can trust.
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* Trust & Promise Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="bg-white border border-neutral-200/70 rounded-2xl p-10 md:p-16 text-center mb-20 md:mb-32"
        >
          <motion.div variants={fadeInUp}>
            <Award
              size={48}
              className="mx-auto mb-8 text-emerald-800"
              strokeWidth={1.4}
            />
            <h2 className="text-3xl md:text-4xl font-['Playfair_Display'] font-medium text-neutral-900 mb-6">
              Our Promise to You
            </h2>
            <p className="text-lg md:text-xl text-neutral-600 font-light max-w-4xl mx-auto leading-relaxed">
              We don’t just sell electric cycles — we deliver calm mornings,
              silent commutes, reliable performance, and honest ownership in
              Patna and across Bihar. Every cycle is tested here, serviced here,
              and loved here.
            </p>
          </motion.div>
        </motion.section>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="text-center"
        >
          <h3 className="text-3xl md:text-4xl font-['Playfair_Display'] font-medium text-neutral-900 mb-6">
            Ready to Ride Quieter?
          </h3>
          <p className="text-lg text-neutral-600 font-light mb-10 max-w-2xl mx-auto">
            Visit our Patna showroom or chat with us today — we’re here to help
            you choose the perfect EVWheels ride.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-5">
            <Link
              href="/cycles"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-neutral-900 text-white rounded-full text-lg font-medium hover:bg-neutral-800 transition-colors"
            >
              Explore Cycles
              <ArrowRight size={20} />
            </Link>

            <Link
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 border border-emerald-600 text-emerald-800 rounded-full text-lg font-medium hover:bg-emerald-50 transition-colors"
            >
              <MessageCircle size={20} />
              Chat on WhatsApp
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
