import Link from "next/link";
import { Truck, Clock, MapPin, Phone, Package, CheckCircle } from "lucide-react";

const COVERAGE = [
  "Patna", "Muzaffarpur", "Gaya", "Bhagalpur", "Darbhanga",
  "Arrah", "Begusarai", "Katihar", "Purnia", "Saharsa",
];

const STEPS = [
  { step: "01", title: "Order Confirmed", desc: "You receive a confirmation email with your order details." },
  { step: "02", title: "Processing", desc: "We verify payment and prepare your cycle for dispatch within 1–2 business days." },
  { step: "03", title: "Dispatched", desc: "Your order is handed to our logistics partner. You'll receive a tracking link." },
  { step: "04", title: "Out for Delivery", desc: "Our delivery partner is on the way. Expect a call before arrival." },
  { step: "05", title: "Delivered", desc: "Sign, inspect, and enjoy your new EVWheels electric cycle." },
];

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-24 font-['Inter']">
      <div className="max-w-3xl mx-auto px-5 sm:px-8">

        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-neutral-500" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="hover:text-[#19B5D8] transition-colors">Home</Link></li>
            <li>/</li>
            <li className="text-neutral-900">Shipping Policy</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-medium text-neutral-900 mb-4">
            Shipping Policy
          </h1>
          <p className="text-neutral-500 text-sm">Last updated: June 2025</p>
          <p className="mt-4 text-neutral-600 leading-relaxed">
            We deliver premium electric cycles across Bihar with care and speed. Here's everything you need to know about our shipping process.
          </p>
        </div>

        {/* Key Info Cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          <div className="bg-white border border-neutral-200 rounded-xl p-5">
            <Truck size={24} className="text-[#19B5D8] mb-3" />
            <h3 className="font-semibold text-neutral-900 mb-1">Free Shipping</h3>
            <p className="text-sm text-neutral-600">On all electric cycles across Bihar</p>
          </div>
          <div className="bg-white border border-neutral-200 rounded-xl p-5">
            <Clock size={24} className="text-[#19B5D8] mb-3" />
            <h3 className="font-semibold text-neutral-900 mb-1">4–8 Business Days</h3>
            <p className="text-sm text-neutral-600">Standard delivery to major cities</p>
          </div>
          <div className="bg-white border border-neutral-200 rounded-xl p-5">
            <Package size={24} className="text-[#19B5D8] mb-3" />
            <h3 className="font-semibold text-neutral-900 mb-1">Carefully Packed</h3>
            <p className="text-sm text-neutral-600">Heavy-duty packaging for safe transit</p>
          </div>
        </div>

        {/* Delivery Timeline */}
        <section className="mb-12">
          <h2 className="text-2xl font-medium text-neutral-900 mb-6">
            Delivery Timeline
          </h2>
          <div className="space-y-4">
            {STEPS.map((s) => (
              <div key={s.step} className="flex gap-4 bg-white border border-neutral-200 rounded-xl p-5">
                <span className="text-2xl font-bold text-[#19B5D8] shrink-0">{s.step}</span>
                <div>
                  <h3 className="font-semibold text-neutral-900">{s.title}</h3>
                  <p className="text-sm text-neutral-600 mt-1">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Coverage Area */}
        <section className="mb-12">
          <h2 className="text-2xl font-medium text-neutral-900 mb-4">
            Cities We Deliver To
          </h2>
          <p className="text-neutral-600 mb-5">
            We currently deliver to all major cities and towns across Bihar. Don't see your city? Contact us and we'll do our best to arrange delivery.
          </p>
          <div className="flex flex-wrap gap-3">
            {COVERAGE.map((city) => (
              <span key={city} className="flex items-center gap-1.5 px-4 py-2 bg-[#DDF8FD] text-[#19B5D8] rounded-full text-sm font-medium border border-[#19B5D8]/20">
                <MapPin size={14} />
                {city}
              </span>
            ))}
            <span className="flex items-center gap-1.5 px-4 py-2 bg-neutral-100 text-neutral-600 rounded-full text-sm font-medium">
              + more cities
            </span>
          </div>
        </section>

        {/* Important Notes */}
        <section className="mb-12">
          <h2 className="text-2xl font-medium text-neutral-900 mb-4">
            Important Notes
          </h2>
          <ul className="space-y-3">
            {[
              "Delivery timelines are estimates and may vary during peak seasons, public holidays, or due to weather conditions.",
              "For COD orders, please keep the exact amount ready at the time of delivery.",
              "Please inspect the package before signing. Report any visible damage to the delivery agent and contact us immediately.",
              "If you are unavailable during delivery, the courier will attempt re-delivery or leave a notification for pickup.",
              "We are not responsible for delays caused by incorrect or incomplete delivery addresses.",
            ].map((note, i) => (
              <li key={i} className="flex gap-3 text-neutral-600 text-sm">
                <CheckCircle size={18} className="text-[#19B5D8] mt-0.5 shrink-0" />
                {note}
              </li>
            ))}
          </ul>
        </section>

        {/* Contact */}
        <div className="p-6 bg-[#DDF8FD] rounded-2xl border border-[#19B5D8]/20">
          <h2 className="text-lg font-semibold text-neutral-900 mb-2">Need help with your delivery?</h2>
          <p className="text-neutral-600 text-sm mb-4">
            Call or WhatsApp us at <a href="tel:+919876543210" className="text-[#19B5D8] hover:underline font-medium">+91 98765 43210</a>, or visit our <Link href="/contact" className="text-[#19B5D8] hover:underline">Contact page</Link>.
          </p>
          <p className="text-neutral-500 text-xs">Support hours: Monday – Saturday, 10:00 AM – 7:00 PM</p>
        </div>
      </div>
    </div>
  );
}
