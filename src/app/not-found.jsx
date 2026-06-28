import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#fdfcf9] flex items-center justify-center px-5 pt-20 pb-24 font-['Inter']">
        <div className="text-center max-w-lg mx-auto">
          <p className="text-8xl font-['Playfair_Display'] font-medium text-emerald-800 mb-4">
            404
          </p>
          <h1 className="text-3xl md:text-4xl font-['Playfair_Display'] font-medium text-neutral-900 mb-4">
            Page Not Found
          </h1>
          <p className="text-lg text-neutral-600 font-light leading-relaxed mb-10">
            The page you're looking for doesn't exist or may have moved.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="px-8 py-4 bg-neutral-900 text-white rounded-full text-sm font-medium hover:bg-neutral-800 transition-colors"
            >
              Go to Homepage
            </Link>
            <Link
              href="/cycles"
              className="px-8 py-4 border border-neutral-300 text-neutral-900 rounded-full text-sm font-medium hover:bg-neutral-50 transition-colors"
            >
              Browse Cycles
            </Link>
          </div>

          <div className="mt-12 pt-8 border-t border-neutral-200 flex flex-wrap justify-center gap-6 text-sm text-neutral-500">
            <Link href="/contact" className="hover:text-emerald-800 transition-colors">Contact Support</Link>
            <Link href="/why-us" className="hover:text-emerald-800 transition-colors">Why EVWheels</Link>
            <Link href="/support" className="hover:text-emerald-800 transition-colors">Help Center</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
