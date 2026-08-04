"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Wrench,
  Search,
  Info,
  ArrowRight,
  QrCode,
  BookOpen,
  Headphones,
  MapPin,
  Bell,
  Disc,
  Link2,
  Cog,
  Handshake,
  Lightbulb,
  Lock,
  ShieldHalf,
  Armchair,
  CircleDot,
  Hammer,
  CircleDashed,
} from "lucide-react";
import Link from "next/link";

// Mirrors the real categories used by the Shop page and Navbar — this page
// filters into the actual catalog, so it can't invent categories the store
// doesn't carry.
const CATEGORIES = [
  { slug: "bells", label: "Bells", icon: Bell },
  { slug: "brakes", label: "Brakes", icon: Disc },
  { slug: "chains", label: "Chains", icon: Link2 },
  { slug: "gear-sets", label: "Gear Sets", icon: Cog },
  { slug: "handlebar-parts", label: "Handlebar Parts", icon: Handshake },
  { slug: "lights-reflectors", label: "Lights & Reflectors", icon: Lightbulb },
  { slug: "locks-security", label: "Locks & Security", icon: Lock },
  { slug: "mudguards-fenders", label: "Mudguards", icon: ShieldHalf },
  { slug: "saddles-seats", label: "Saddles & Seats", icon: Armchair },
  { slug: "tyres-tubes", label: "Tyres & Tubes", icon: CircleDot },
  { slug: "tools-maintenance", label: "Tools & Maintenance", icon: Hammer },
  { slug: "wheels-hubs", label: "Wheels & Hubs", icon: CircleDashed },
];

const IDENTIFY_STEPS = [
  {
    icon: QrCode,
    title: "Check the frame sticker",
    desc: "Usually located on the underside of the frame near the pedals or under the battery pack.",
  },
  {
    icon: BookOpen,
    title: "Consult your manual",
    desc: "Your original owner's manual will have the model specifications on the first page.",
  },
  {
    icon: Headphones,
    title: "Ask our experts",
    desc: "Send us a photo of your bike over WhatsApp and our team will help you identify the right parts.",
  },
];

const SERIAL_LOCATIONS = [
  "Bottom Bracket",
  "Head Tube",
  "Rear Dropout",
  "Battery Mount",
];

export default function SupportPage() {
  const router = useRouter();
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");

  const handleCheckFit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (brand.trim()) params.set("search", brand.trim());
    const qs = params.toString();
    router.push(qs ? `/shop?${qs}` : "/shop");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-['Inter']">
      {/* ─── Hero / Part Finder ─────────────────────────────────── */}
      <section className="bg-white border-b border-neutral-200/70 py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-[#DDF8FD] to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DDF8FD] text-[#19B5D8] text-xs font-semibold uppercase tracking-wider mb-6">
              <Wrench size={14} />
              Part Finder
            </div>
            <h1 className="text-4xl md:text-5xl font-medium text-neutral-900 mb-5 leading-tight">
              Find the perfect fit
              <br />
              <span className="text-[#19B5D8]">for your ride.</span>
            </h1>
            <p className="text-neutral-500 font-light text-lg leading-relaxed">
              Pick a category and, if you know it, the brand — we&apos;ll filter
              our live catalog down to what fits.
            </p>
          </div>

          <form
            onSubmit={handleCheckFit}
            className="bg-neutral-50 border border-neutral-200/70 rounded-2xl p-5 shadow-sm"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="finder-category" className="text-xs font-medium text-neutral-500 uppercase tracking-wide ml-1">
                  Category
                </label>
                <select
                  id="finder-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl bg-white border border-neutral-200 text-neutral-800 font-light py-3 px-4 focus:outline-none focus:border-[#19B5D8] focus:ring-1 focus:ring-[#19B5D8]/20"
                >
                  <option value="">All categories</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.slug} value={c.slug}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="finder-brand" className="text-xs font-medium text-neutral-500 uppercase tracking-wide ml-1">
                  Brand <span className="normal-case font-normal text-neutral-400">(optional)</span>
                </label>
                <input
                  id="finder-brand"
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. Shimano"
                  className="w-full rounded-xl bg-white border border-neutral-200 text-neutral-800 font-light py-3 px-4 focus:outline-none focus:border-[#19B5D8] focus:ring-1 focus:ring-[#19B5D8]/20"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#19B5D8] hover:bg-[#1297B5] text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <Search size={18} />
                  Check Fit
                </button>
              </div>
            </div>
          </form>

          <p className="flex items-center justify-center gap-2 mt-5 text-sm text-neutral-500 font-light">
            <Info size={15} />
            Not sure what you need?{" "}
            <a
              href="#identify"
              className="text-[#19B5D8] underline underline-offset-4 hover:text-[#1297B5] transition-colors"
            >
              Find your serial number
            </a>
          </p>
        </div>
      </section>

      {/* ─── Browse by Category ──────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-medium text-neutral-900 mb-2">
              Browse by Category
            </h2>
            <p className="text-neutral-500 font-light">
              Every category in our catalog — jump straight in.
            </p>
          </div>
          <Link
            href="/shop"
            className="flex items-center gap-1 text-sm font-medium text-[#19B5D8] hover:gap-2 transition-all"
          >
            View all products <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/shop?category=${cat.slug}`}
              className="group flex flex-col items-center gap-3 p-6 rounded-xl bg-white border border-neutral-200/70 hover:border-[#19B5D8]/50 hover:shadow-md transition-all text-center"
            >
              <cat.icon
                size={28}
                strokeWidth={1.4}
                className="text-neutral-400 group-hover:text-[#19B5D8] transition-colors"
              />
              <span className="font-medium text-sm text-neutral-700">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Identify Your Model ─────────────────────────────────── */}
      <section id="identify" className="bg-neutral-50/70 border-y border-neutral-200/70 py-16 scroll-mt-24">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-medium text-neutral-900 mb-4">
                How to identify your model?
              </h2>
              <p className="text-neutral-500 font-light mb-8 leading-relaxed">
                To ensure you purchase the correct parts, you&apos;ll need the
                exact model name or serial number of your vehicle. Here is where
                you can typically find this information.
              </p>
              <div className="space-y-6">
                {IDENTIFY_STEPS.map((step) => (
                  <div key={step.title} className="flex gap-4">
                    <div className="w-11 h-11 shrink-0 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-[#19B5D8] shadow-sm">
                      <step.icon size={20} strokeWidth={1.6} />
                    </div>
                    <div>
                      <h4 className="font-medium text-neutral-900 mb-1">{step.title}</h4>
                      <p className="text-sm text-neutral-500 font-light">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-neutral-200/70 rounded-2xl p-8 shadow-sm">
              <h3 className="text-lg font-medium text-neutral-900 mb-6">
                Common Serial Number Locations
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {SERIAL_LOCATIONS.map((loc) => (
                  <div
                    key={loc}
                    className="bg-neutral-50 border border-neutral-100 p-4 rounded-xl text-center"
                  >
                    <MapPin
                      size={28}
                      strokeWidth={1.4}
                      className="text-[#19B5D8] mx-auto mb-2"
                    />
                    <p className="font-medium text-sm text-neutral-800">{loc}</p>
                  </div>
                ))}
              </div>
              <a
                href="https://wa.me/918298922623?text=Hi%20EVWheels%2C%20I%20need%20help%20identifying%20my%20bike%20model%20so%20I%20can%20find%20the%20right%20parts."
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full mt-6 py-3 border border-neutral-200 hover:border-[#19B5D8] hover:text-[#19B5D8] text-neutral-700 font-medium rounded-xl transition-colors text-sm"
              >
                <Headphones size={16} />
                Ask us on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
