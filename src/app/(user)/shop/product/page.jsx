// app/cycles/[slug]/page.tsx
// (or app/products/[id]/page.tsx — adjust path as needed)

'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Star, MessageCircle } from 'lucide-react'

export default function ProductDetailPage() {
  // Example product data — in real app this would come from params / API
  const product = {
    name: 'RangeX City',
    price: '₹54,999',
    range: '140 km',
    weight: '25 kg',
    description:
      'Designed for daily urban commuting in cities like Patna. Silent mid-drive motor, torque-sensing pedal assist, removable battery, and upright riding position for comfort on Indian roads.',
    specs: [
      { label: 'Motor', value: '250W mid-drive' },
      { label: 'Battery', value: '48V 15Ah lithium-ion' },
      { label: 'Charging Time', value: '5–6 hours' },
      { label: 'Top Speed', value: '25 km/h (assist)' },
      { label: 'Frame', value: 'Aluminum alloy' },
      { label: 'Brakes', value: 'Hydraulic disc' },
    ],
    rating: 4.7,
    reviewCount: 42,
    reviews: [
      {
        name: 'Rahul Kumar',
        date: 'Feb 15, 2026',
        rating: 5,
        comment: 'Perfect for Patna traffic. Battery lasts 4–5 days of my 18 km daily commute. Very silent and smooth.',
      },
      {
        name: 'Priya Singh',
        date: 'Jan 28, 2026',
        rating: 4,
        comment: 'Lightweight and easy to carry upstairs. Range is real — got 132 km on one charge. Would love more color options.',
      },
    ],
  }

  const suggestedProducts = [
    {
      name: 'TrailX Pro',
      price: '₹74,999',
      image: 'https://images.unsplash.com/photo-1649972077917-2d9b0d2e3e8d?w=800',
    },
    {
      name: 'LiteX Fold',
      price: '₹44,999',
      image: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800',
    },
  ]

  return (
    <div className="min-h-screen bg-[#fdfcf9] pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Breadcrumb */}
        <nav className="mb-10 md:mb-16 text-sm md:text-base font-light text-neutral-600">
          <ol className="flex items-center gap-2 md:gap-4">
            <li>
              <Link href="/" className="hover:text-neutral-900 transition-colors">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/cycles" className="hover:text-neutral-900 transition-colors">
                Cycles
              </Link>
            </li>
            <li>/</li>
            <li className="text-neutral-900 font-medium">{product.name}</li>
          </ol>
        </nav>

        {/* Product Hero + Info */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 mb-20 md:mb-32">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="aspect-[4/3] overflow-hidden"
          >
            <img
              src="https://images.unsplash.com/photo-1631631480669-535cc43f232c?w=1600"
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-['Playfair_Display'] font-medium mb-6">
              {product.name}
            </h1>

            <div className="text-4xl md:text-5xl font-light text-emerald-800 mb-8">
              {product.price}
            </div>

            <div className="space-y-4 text-lg md:text-xl font-light text-neutral-700 mb-10">
              <p>Range: {product.range}</p>
              <p>Weight: {product.weight}</p>
            </div>

            <p className="text-lg md:text-xl font-light text-neutral-600 leading-relaxed mb-12">
              {product.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-5">
              <button className="px-10 py-4 bg-neutral-900 text-white rounded-full text-lg font-medium hover:bg-neutral-800 transition-colors">
                Add to Cart
              </button>
              <button className="px-10 py-4 border border-neutral-400 text-neutral-800 rounded-full text-lg font-medium hover:bg-neutral-100 transition-colors">
                Buy Now
              </button>
            </div>
          </motion.div>
        </div>

        {/* Specs Table */}
        <div className="mb-20 md:mb-32">
          <h2 className="text-3xl md:text-4xl font-['Playfair_Display'] font-medium mb-8 md:mb-12">
            Specifications
          </h2>
          <div className="grid md:grid-cols-2 gap-6 md:gap-12">
            {product.specs.map((spec, i) => (
              <div key={i} className="flex justify-between py-4 border-b border-neutral-200/60">
                <span className="text-lg font-light text-neutral-600">{spec.label}</span>
                <span className="text-lg font-medium">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews Section */}
        <section className="mb-20 md:mb-32">
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-3xl md:text-4xl font-['Playfair_Display'] font-medium">
              Reviews
            </h2>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={i < Math.floor(product.rating) ? 'fill-emerald-700 text-emerald-700' : 'text-neutral-300'}
                  />
                ))}
              </div>
              <span className="text-lg font-light text-neutral-600">
                {product.rating} • {product.reviewCount} reviews
              </span>
            </div>
          </div>

          <div className="space-y-10 md:space-y-12">
            {product.reviews.map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.15 }}
                className="border-b border-neutral-200/60 pb-10 last:border-b-0 last:pb-0"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, idx) => (
                      <Star
                        key={idx}
                        size={18}
                        className={idx < review.rating ? 'fill-emerald-700 text-emerald-700' : 'text-neutral-300'}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-neutral-500">{review.date}</span>
                </div>
                <p className="text-lg font-light mb-3">“{review.comment}”</p>
                <p className="text-sm font-medium text-neutral-700">{review.name}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Suggested Products */}
        <section className="py-16 md:py-24 bg-white border-t border-neutral-200/60">
          <div className="max-w-6xl mx-auto px-6 lg:px-12">
            <h2 className="text-3xl md:text-4xl font-['Playfair_Display'] font-medium text-center mb-12 md:mb-16">
              You May Also Like
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-16">
              {suggestedProducts.map((p, i) => (
                <motion.div
                  key={p.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                  className="group"
                >
                  <div className="aspect-[4/3] overflow-hidden mb-6">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="text-xl md:text-2xl font-medium mb-2">{p.name}</h3>
                  <p className="text-lg font-light text-emerald-800">{p.price}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Floating WhatsApp */}
      <a
        href="https://wa.me/919876543210?text=Hello%20EVWheels%20team..."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-emerald-800 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
      >
        <MessageCircle size={24} className="text-white" />
      </a>
    </div>
  )
}