import {
  Wrench,
  Search,
  Info,
  ArrowRight,
  Bike,
  Zap,
  QrCode,
  BookOpen,
  Headphones,
  MapPin,
  BatteryCharging,
  Circle,
  Cpu,
  Settings,
  LayoutGrid,
} from "lucide-react";
import Link from "next/link";

const MODELS = [
  {
    icon: Bike,
    badge: "2023 Series",
    name: "Urban Glide X1",
    type: "City Commuter E-Bike",
    parts: 42,
  },
  {
    icon: Zap,
    badge: "Pro Edition",
    name: "VoltX Scooter",
    type: "Long Range E-Scooter",
    parts: 28,
  },
  {
    icon: Bike,
    badge: "Off-Road",
    name: "Ranger 500",
    type: "Mountain E-Bike",
    parts: 56,
  },
  {
    icon: Zap,
    badge: "Legacy",
    name: "City Mate V1",
    type: "Compact Moped",
    parts: 15,
  },
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
    desc: "Send us a photo of your bike, and we'll help you identify it instantly.",
  },
];

const SERIAL_LOCATIONS = [
  "Bottom Bracket",
  "Head Tube",
  "Rear Dropout",
  "Battery Mount",
];

const CATEGORIES = [
  { icon: BatteryCharging, label: "Batteries" },
  { icon: Circle, label: "Tires & Tubes" },
  { icon: Zap, label: "Chargers" },
  { icon: Cpu, label: "Controllers" },
  { icon: Settings, label: "Brakes" },
  { icon: LayoutGrid, label: "View All" },
];

export default function SupportPage() {
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
            <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-medium text-neutral-900 mb-5 leading-tight">
              Find the perfect fit
              <br />
              <span className="text-[#19B5D8]">for your ride.</span>
            </h1>
            <p className="text-neutral-500 font-light text-lg leading-relaxed">
              Don&apos;t guess. Select your model below to instantly filter our
              catalog for compatible parts, batteries, and upgrades guaranteed to
              work.
            </p>
          </div>

          <div className="bg-neutral-50 border border-neutral-200/70 rounded-2xl p-5 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide ml-1">
                  Category
                </label>
                <select className="w-full rounded-xl bg-white border border-neutral-200 text-neutral-800 font-light py-3 px-4 focus:outline-none focus:border-[#19B5D8] focus:ring-1 focus:ring-[#19B5D8]/20">
                  <option value="">Select Type</option>
                  <option>E-Bikes</option>
                  <option>E-Scooters</option>
                  <option>Accessories</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide ml-1">
                  Brand
                </label>
                <select className="w-full rounded-xl bg-white border border-neutral-200 text-neutral-800 font-light py-3 px-4 focus:outline-none focus:border-[#19B5D8] focus:ring-1 focus:ring-[#19B5D8]/20">
                  <option value="">Select Brand</option>
                  <option>EvWheels</option>
                  <option>Urban Glide</option>
                  <option>Mountain King</option>
                  <option>VoltX</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide ml-1">
                  Model
                </label>
                <select className="w-full rounded-xl bg-white border border-neutral-200 text-neutral-800 font-light py-3 px-4 focus:outline-none focus:border-[#19B5D8] focus:ring-1 focus:ring-[#19B5D8]/20">
                  <option value="">Select Model</option>
                  <option>Glide X1</option>
                  <option>Glide X2 Pro</option>
                  <option>Ranger 500</option>
                  <option>City Commuter</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  className="w-full py-3.5 bg-[#19B5D8] hover:bg-[#1297B5] text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <Search size={18} />
                  Check Fit
                </button>
              </div>
            </div>
          </div>

          <p className="flex items-center justify-center gap-2 mt-5 text-sm text-neutral-500 font-light">
            <Info size={15} />
            Not sure about your model?{" "}
            <span className="text-[#19B5D8] underline underline-offset-4 cursor-pointer hover:text-[#19B5D8] transition-colors">
              Find your serial number
            </span>
          </p>
        </div>
      </section>

      {/* ─── Popular Models ──────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-['Playfair_Display'] font-medium text-neutral-900 mb-2">
              Popular Models
            </h2>
            <p className="text-neutral-500 font-light">
              Browse parts for our best-selling vehicles.
            </p>
          </div>
          <Link
            href="/products"
            className="flex items-center gap-1 text-sm font-medium text-[#19B5D8] hover:gap-2 transition-all"
          >
            View all models <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MODELS.map((m) => (
            <div
              key={m.name}
              className="group bg-white border border-neutral-200/70 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <div className="h-44 bg-neutral-50 flex items-center justify-center relative group-hover:bg-[#DDF8FD]/40 transition-colors">
                <m.icon
                  size={56}
                  strokeWidth={1.2}
                  className="text-neutral-300 group-hover:text-[#19B5D8] transition-colors"
                />
                <span className="absolute top-4 right-4 bg-white border border-neutral-200 px-2 py-1 rounded text-xs font-medium text-neutral-700 shadow-sm">
                  {m.badge}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-medium text-neutral-900 mb-1 group-hover:text-[#19B5D8] transition-colors">
                  {m.name}
                </h3>
                <p className="text-sm text-neutral-500 font-light mb-4">{m.type}</p>
                <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                  <span className="text-xs text-neutral-400">
                    {m.parts} compatible parts
                  </span>
                  <ArrowRight
                    size={16}
                    className="text-[#19B5D8] group-hover:translate-x-0.5 transition-transform"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Identify Your Model ─────────────────────────────────── */}
      <section className="bg-neutral-50/70 border-y border-neutral-200/70 py-16">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-['Playfair_Display'] font-medium text-neutral-900 mb-4">
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
              <button className="w-full mt-6 py-3 border border-neutral-200 hover:border-[#19B5D8] hover:text-[#19B5D8] text-neutral-700 font-medium rounded-xl transition-colors text-sm">
                Download Identification Guide
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Browse by Category ──────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 md:px-8 py-16 md:py-24">
        <h2 className="text-3xl font-['Playfair_Display'] font-medium text-neutral-900 mb-10 text-center">
          Browse Compatibility by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.label}
              href="/products"
              className="group flex flex-col items-center gap-3 p-6 rounded-xl bg-white border border-neutral-200/70 hover:border-[#19B5D8]/50 hover:shadow-md transition-all"
            >
              <cat.icon
                size={28}
                strokeWidth={1.4}
                className="text-neutral-400 group-hover:text-[#19B5D8] transition-colors"
              />
              <span className="font-medium text-sm text-neutral-700 text-center">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
