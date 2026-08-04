import Link from "next/link";
import { RefreshCw, CheckCircle, XCircle, Clock, Phone } from "lucide-react";

const ELIGIBLE = [
  "Product received in damaged or defective condition",
  "Wrong product delivered",
  "Product significantly different from the description on the website",
  "Unused product in original packaging within 30 days of delivery",
];

const NOT_ELIGIBLE = [
  "Products that have been used, assembled, or show signs of wear",
  "Items returned after 30 days from the delivery date",
  "Products with missing original packaging, accessories, or documentation",
  "Damage caused by misuse, accidents, or modifications",
  "Products purchased during special sales or marked as non-returnable",
];

const STEPS = [
  { step: "01", title: "Initiate Return", desc: "Contact us at support@evwheels.in or call +91 8298922623 within 30 days of delivery with your order number and reason for return." },
  { step: "02", title: "Return Approved", desc: "Our team will review your request and respond within 2 business days. We may ask for photos of the product." },
  { step: "03", title: "Ship It Back", desc: "We'll arrange pickup from your address. Please pack the product securely in its original packaging." },
  { step: "04", title: "Inspection", desc: "Once we receive the returned item, our team inspects it within 2–3 business days." },
  { step: "05", title: "Refund Processed", desc: "Approved refunds are processed within 7–10 business days to your original payment method or as store credit." },
];

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-24 font-['Inter']">
      <div className="max-w-3xl mx-auto px-5 sm:px-8">

        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-neutral-500" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="hover:text-[#19B5D8] transition-colors">Home</Link></li>
            <li>/</li>
            <li className="text-neutral-900">Returns & Refunds</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-medium text-neutral-900 mb-4">
            Returns & Refund Policy
          </h1>
          <p className="text-neutral-500 text-sm">Last updated: June 2025</p>
          <p className="mt-4 text-neutral-600 leading-relaxed">
            We want you to be completely satisfied with your EVWheels purchase. If something isn't right, we're here to help with our 30-day return policy.
          </p>
        </div>

        {/* Return Window Banner */}
        <div className="flex items-center gap-4 bg-[#DDF8FD] border border-[#19B5D8]/20 rounded-2xl p-6 mb-12">
          <div className="w-14 h-14 rounded-full bg-[#DDF8FD] flex items-center justify-center shrink-0">
            <RefreshCw size={24} className="text-[#19B5D8]" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-neutral-900">30-Day Return Window</h2>
            <p className="text-neutral-600 text-sm mt-1">
              Return any eligible item within 30 days of delivery — no questions asked for defective products.
            </p>
          </div>
        </div>

        {/* Eligibility */}
        <section className="mb-12">
          <h2 className="text-2xl font-medium text-neutral-900 mb-6">What Can Be Returned</h2>
          <div className="grid gap-4 mb-8">
            {ELIGIBLE.map((item, i) => (
              <div key={i} className="flex gap-3 items-start bg-white border border-neutral-200 rounded-xl p-4">
                <CheckCircle size={20} className="text-[#19B5D8] mt-0.5 shrink-0" />
                <p className="text-neutral-700 text-sm">{item}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-medium text-neutral-900 mb-4">What Cannot Be Returned</h2>
          <div className="grid gap-3">
            {NOT_ELIGIBLE.map((item, i) => (
              <div key={i} className="flex gap-3 items-start">
                <XCircle size={18} className="text-red-500 mt-0.5 shrink-0" />
                <p className="text-neutral-600 text-sm">{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Return Process */}
        <section className="mb-12">
          <h2 className="text-2xl font-medium text-neutral-900 mb-6">How to Return</h2>
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

        {/* Refund Timeline */}
        <section className="mb-12">
          <h2 className="text-2xl font-medium text-neutral-900 mb-4">Refund Timeline</h2>
          <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
            {[
              { label: "Return request reviewed", time: "Within 2 business days" },
              { label: "Item inspection after receipt", time: "2–3 business days" },
              { label: "Refund processing", time: "7–10 business days" },
              { label: "Credit to bank/UPI", time: "Depends on your bank" },
            ].map((row, i, arr) => (
              <div key={i} className={`flex justify-between items-center px-5 py-4 ${i < arr.length - 1 ? "border-b border-neutral-100" : ""}`}>
                <div className="flex items-center gap-2 text-neutral-700 text-sm">
                  <Clock size={16} className="text-[#19B5D8]" />
                  {row.label}
                </div>
                <span className="text-sm font-medium text-[#19B5D8]">{row.time}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Warranty note */}
        <section className="mb-12">
          <h2 className="text-2xl font-medium text-neutral-900 mb-4">Warranty Claims</h2>
          <p className="text-neutral-600 leading-relaxed">
            Warranty claims (for manufacturer defects within the warranty period) are handled separately from returns. Our electric cycles come with a <strong>2-year battery warranty</strong> and a <strong>1-year frame & motor warranty</strong>. To raise a warranty claim, contact us with your order number and a description of the issue.
          </p>
        </section>

        {/* Contact */}
        <div className="p-6 bg-[#DDF8FD] rounded-2xl border border-[#19B5D8]/20">
          <h2 className="text-lg font-semibold text-neutral-900 mb-2">Ready to return or have questions?</h2>
          <p className="text-neutral-600 text-sm mb-4">
            Email us at <a href="mailto:support@evwheels.in" className="text-[#19B5D8] hover:underline font-medium">support@evwheels.in</a> or call <a href="tel:+918298922623" className="text-[#19B5D8] hover:underline font-medium">+91 8298922623</a>. Our team is available Monday – Saturday, 10 AM – 7 PM.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#19B5D8] text-white rounded-full text-sm font-medium hover:bg-[#1297B5] transition-colors"
          >
            <Phone size={16} />
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
