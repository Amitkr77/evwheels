// app/contact/page.tsx

'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  CheckCircle,
} from 'lucide-react'

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })

  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e = {}

    if (!form.name.trim()) e.name = 'Full name is required'
    else if (form.name.trim().length < 3) e.name = 'Name must be at least 3 characters'

    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address'

    const phone = form.phone.replace(/\s+/g, '').trim()
    if (!phone) e.phone = 'Phone number is required'
    else if (!/^\d{10}$/.test(phone)) e.phone = 'Enter valid 10 digit mobile number'

    if (!form.subject) e.subject = 'Please select a subject'

    if (!form.message.trim()) e.message = 'Message is required'
    else if (form.message.trim().length < 10) e.message = 'Message must be at least 10 characters'
    else if (form.message.length > 500) e.message = 'Message must be under 500 characters'

    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    // Simulate API call (replace with real /api/contact endpoint)
    setTimeout(() => {
      setLoading(false)
      setSent(true)
      setForm({ name: '', email: '', phone: '', subject: '', message: '' })
    }, 1800)
  }

  const contactCards = [
    {
      icon: <MapPin size={24} />,
      title: 'Visit Our Office',
      lines: [
        'Boring Road Crossing',
        'Near Boring Canal Road',
        'Patna, Bihar 800001',
      ],
    },
    {
      icon: <Phone size={24} />,
      title: 'Call / WhatsApp',
      lines: ['+91 98765 43210'],
      link: 'tel:+919876543210',
    },
    {
      icon: <Mail size={24} />,
      title: 'Email Us',
      lines: ['support@evwheels.in'],
      link: 'mailto:support@evwheels.in',
    },
    {
      icon: <Clock size={24} />,
      title: 'Working Hours',
      lines: ['Mon – Sat: 10:00 AM – 7:00 PM', 'Sunday: Closed'],
    },
  ]

  const faqs = [
    {
      q: 'What types of electric cycles do you offer?',
      a: 'We offer city commuters (RangeX City), off-road capable (TrailX Pro), and foldable urban models (LiteX Fold) — all designed and tested for real Indian roads.',
    },
    {
      q: 'Is EMI available for purchases?',
      a: 'Yes! We offer easy EMI options starting from ₹2,499/month through leading banks and financial partners.',
    },
    {
      q: 'Where is your service center?',
      a: 'Our dedicated service center is located in Patna, Bihar — offering fast response, genuine parts, and complete ownership support.',
    },
    {
      q: 'What is your warranty policy?',
      a: 'All our cycles come with a 2-year battery warranty and 1-year comprehensive warranty on frame & motor. Extended plans are also available.',
    },
  ]

  return (
    <div className="min-h-screen bg-[#fdfcf9] font-['Inter']">
       <div className="fixed top-0 left-0 w-full h-18 overflow-hidden">
        <div className="absolute inset-0 subtle-gradient"></div>
      </div>
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/30 via-transparent to-emerald-50/20" />
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Text + Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block px-4 py-1.5 bg-emerald-50 text-emerald-800 rounded-full text-sm font-medium mb-6">
                📬 Contact Us
              </span>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-['Playfair_Display'] font-medium text-neutral-900 leading-tight mb-6">
                Get in Touch with <span className="text-emerald-800">EVWheels</span>
              </h1>

              <p className="text-lg md:text-xl text-neutral-600 font-light leading-relaxed mb-10 max-w-xl">
                Have questions about our cycles, range, service, or EMI? Our Patna-based team is here to help — reach out today.
              </p>

              {/* Quick Contact Chips */}
              <div className="flex flex-wrap gap-4 mb-10">
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-emerald-800 text-white rounded-full text-sm md:text-base font-medium hover:bg-emerald-900 transition-colors"
                >
                  <MessageCircle size={18} />
                  WhatsApp Us
                </a>

                <a
                  href="mailto:support@evwheels.in"
                  className="flex items-center gap-2 px-6 py-3 border border-neutral-300 text-neutral-900 rounded-full text-sm md:text-base font-medium hover:bg-neutral-50 transition-colors"
                >
                  <Mail size={18} />
                  Email Us
                </a>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-5">
                <span className="text-sm font-medium text-neutral-600">Follow Us:</span>
                {[
                  { icon: Linkedin, href: '#', color: '#0077b5' },
                  { icon: Twitter, href: '#', color: '#1da1f2' },
                  { icon: Instagram, href: '#', color: '#e4405f' },
                  { icon: Youtube, href: '#', color: '#ff0000' },
                ].map((s, i) => (
                  <a
                    key={i}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-neutral-500 hover:text-emerald-800 transition-colors"
                  >
                    <s.icon size={20} />
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Right: Map Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white border border-neutral-200/70 rounded-2xl overflow-hidden shadow-sm"
            >
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald-800 flex items-center justify-center text-white">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-neutral-900">EVWheels Service Center</h3>
                    <p className="text-sm text-neutral-600">
                      Boring Road Crossing, Near Boring Canal Road<br />
                      Patna, Bihar 800001
                    </p>
                  </div>
                </div>

                {/* Replace with your actual Google Maps embed link for Patna location */}
                <iframe
                  title="EVWheels Patna Service Center"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3598.123456789012!2d85.135789!3d25.594094!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed585000000001%3A0x0!2sBoring%20Road%2C%20Patna!5e0!3m2!1sen!2sin!4v1698765432100"
                  width="100%"
                  height="240"
                  style={{ border: 0, borderRadius: '12px' }}
                  allowFullScreen=""
                  loading="lazy"
                />

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 text-sm">
                  <Link
                    href="https://maps.google.com/?q=Boring+Road+Patna+Bihar"
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-800 hover:underline font-medium flex items-center gap-1.5"
                  >
                    📍 Get Directions
                  </Link>
                  <span className="text-neutral-600">🕒 Mon–Sat: 10AM–7PM</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Info Cards */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {contactCards.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-white border border-neutral-200/70 rounded-xl p-6 hover:border-emerald-200/60 transition-colors"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-5 text-emerald-800"
                  style={{ background: 'rgba(16,185,129,0.08)' }}
                >
                  {card.icon}
                </div>
                <h4 className="text-lg font-medium text-neutral-900 mb-3">{card.title}</h4>
                {card.link ? (
                  <Link href={card.link} className="text-sm text-neutral-600 hover:text-emerald-800 transition-colors block">
                    {card.lines.map((l, j) => (
                      <span key={j}>{l}</span>
                    ))}
                  </Link>
                ) : (
                  card.lines.map((l, j) => (
                    <p key={j} className="text-sm text-neutral-600">{l}</p>
                  ))
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Form + Quick Contact Sidebar */}
      <section className="py-16 md:py-24 bg-[#fdfcf9]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Form */}
            <div className="lg:col-span-2">
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white border border-neutral-200/70 rounded-2xl p-10 md:p-12 text-center"
                >
                  <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-emerald-50 flex items-center justify-center">
                    <CheckCircle size={40} className="text-emerald-800" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-['Playfair_Display'] font-medium text-neutral-900 mb-4">
                    Message Sent Successfully!
                  </h2>
                  <p className="text-lg text-neutral-600 font-light mb-8">
                    Thank you for reaching out. Our Patna team will get back to you within <strong>24 hours</strong>.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link
                      href="https://wa.me/919876543210"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 px-8 py-4 bg-emerald-800 text-white rounded-full text-sm md:text-base font-medium hover:bg-emerald-900 transition-colors"
                    >
                      <MessageCircle size={18} />
                      WhatsApp Us
                    </Link>
                    <button
                      onClick={() => setSent(false)}
                      className="px-8 py-4 border border-neutral-300 text-neutral-900 rounded-full text-sm md:text-base font-medium hover:bg-neutral-50 transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-white border border-neutral-200/70 rounded-2xl p-8 md:p-12">
                  <h2 className="text-3xl md:text-4xl font-['Playfair_Display'] font-medium text-neutral-900 mb-2">
                    Send Us a Message
                  </h2>
                  <p className="text-lg text-neutral-600 font-light mb-10">
                    We usually respond within <strong>24 hours</strong>
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name + Phone */}
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-neutral-600 mb-2">
                          Full Name <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Your full name"
                          className={`w-full px-5 py-4 border ${errors.name ? 'border-red-500' : 'border-neutral-300'} rounded-lg focus:outline-none focus:border-emerald-600 transition-colors`}
                        />
                        {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-600 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="+91 98765 43210"
                          className={`w-full px-5 py-4 border ${errors.phone ? 'border-red-500' : 'border-neutral-300'} rounded-lg focus:outline-none focus:border-emerald-600 transition-colors`}
                        />
                        {errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone}</p>}
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-600 mb-2">
                        Email Address <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        className={`w-full px-5 py-4 border ${errors.email ? 'border-red-500' : 'border-neutral-300'} rounded-lg focus:outline-none focus:border-emerald-600 transition-colors`}
                      />
                      {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-600 mb-2">
                        I'm Interested In <span className="text-red-600">*</span>
                      </label>
                      <select
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        className={`w-full px-5 py-4 border ${errors.subject ? 'border-red-500' : 'border-neutral-300'} rounded-lg focus:outline-none focus:border-emerald-600 transition-colors`}
                      >
                        <option value="">Select an option...</option>
                        <option>RangeX City</option>
                        <option>TrailX Pro</option>
                        <option>LiteX Fold</option>
                        <option>Accessories</option>
                        <option>EMI / Finance</option>
                        <option>Service & Warranty</option>
                        <option>General Inquiry</option>
                      </select>
                      {errors.subject && <p className="mt-2 text-sm text-red-600">{errors.subject}</p>}
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-600 mb-2">
                        Your Message <span className="text-red-600">*</span>
                      </label>
                      <textarea
                        name="message"
                        maxLength={500}
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Tell us about your needs or questions..."
                        rows={5}
                        className={`w-full px-5 py-4 border ${errors.message ? 'border-red-500' : 'border-neutral-300'} rounded-lg focus:outline-none focus:border-emerald-600 transition-colors resize-none`}
                      />
                      <div className="flex justify-between text-xs text-neutral-500 mt-2">
                        <span>{form.message.length} / 500 characters</span>
                      </div>
                      {errors.message && <p className="mt-2 text-sm text-red-600">{errors.message}</p>}
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full py-4 bg-neutral-900 text-white rounded-full text-lg font-medium hover:bg-neutral-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4`}
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Sending...
                        </>
                      ) : (
                        'Send Message'
                      )}
                    </button>

                    <p className="text-center text-sm text-neutral-500 mt-6">
                      🔒 Your information is 100% secure. We never share your data.
                    </p>
                  </form>
                </div>
              )}
            </div>

            {/* Quick Contact Sidebar */}
            <div className="space-y-8">
              {/* WhatsApp Quick Card */}
              <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-6 text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
                  <MessageCircle size={28} className="text-emerald-800" />
                </div>
                <h3 className="text-xl font-medium text-neutral-900 mb-2">Chat on WhatsApp</h3>
                <p className="text-sm text-neutral-600 mb-6">Instant reply from our Patna team</p>
                <Link
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-emerald-800 text-white rounded-full text-sm font-medium hover:bg-emerald-900 transition-colors"
                >
                  Open WhatsApp
                </Link>
              </div>

              {/* Office & Response Info */}
              <div className="bg-white border border-neutral-200/70 rounded-xl p-6">
                <h4 className="text-lg font-medium text-neutral-900 mb-6">Our Details</h4>
                <div className="space-y-5 text-sm text-neutral-600">
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-emerald-800 mt-0.5 shrink-0" />
                    <div>
                      <strong className="text-neutral-900 block">EVWheels</strong>
                      Boring Road Crossing<br />
                      Near Boring Canal Road<br />
                      Patna, Bihar 800001
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock size={18} className="text-emerald-800 mt-0.5 shrink-0" />
                    <div>
                      <strong className="text-neutral-900 block">Working Hours</strong>
                      Mon – Sat: 10:00 AM – 7:00 PM<br />
                      Sunday: Closed
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone size={18} className="text-emerald-800 mt-0.5 shrink-0" />
                    <div>
                      <strong className="text-neutral-900 block">Call / WhatsApp</strong>
                      <Link href="tel:+919876543210" className="hover:text-emerald-800 transition-colors">
                        +91 98765 43210
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Response Time */}
              <div className="bg-white border border-neutral-200/70 rounded-xl p-6">
                <h4 className="text-lg font-medium text-neutral-900 mb-6">Response Time</h4>
                <div className="space-y-3 text-sm">
                  {[
                    { label: 'WhatsApp', time: 'Within 1 Hour' },
                    { label: 'Phone', time: 'Immediate' },
                    { label: 'Email', time: 'Within 24 hrs' },
                    { label: 'Contact Form', time: 'Within 24 hrs' },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between">
                      <span className="text-neutral-600">{item.label}</span>
                      <span className="text-emerald-800 font-medium">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="text-center mb-12 md:mb-16">
            <span className="inline-block px-4 py-1.5 bg-emerald-50 text-emerald-800 rounded-full text-sm font-medium mb-4">
              ❓ FAQs
            </span>
            <h2 className="text-4xl md:text-5xl font-['Playfair_Display'] font-medium text-neutral-900">
              Frequently Asked <span className="text-emerald-800">Questions</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-white border border-neutral-200/70 rounded-xl p-6 hover:border-emerald-200/60 transition-colors"
              >
                <h4 className="text-lg font-medium text-neutral-900 mb-3">{faq.q}</h4>
                <p className="text-neutral-600">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 md:py-24 bg-[#fdfcf9]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white border border-neutral-200/70 rounded-2xl p-10 md:p-12"
          >
            <h2 className="text-3xl md:text-4xl font-['Playfair_Display'] font-medium text-neutral-900 mb-4">
              Still Have Questions?
            </h2>
            <p className="text-lg text-neutral-600 font-light mb-8">
              Reach out to our Patna team — we're here to help you choose the perfect ride.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-emerald-800 text-white rounded-full text-sm md:text-base font-medium hover:bg-emerald-900 transition-colors"
              >
                <MessageCircle size={18} />
                WhatsApp Us
              </Link>

              <Link
                href="mailto:support@evwheels.in"
                className="flex items-center justify-center gap-2 px-8 py-4 border border-neutral-300 text-neutral-900 rounded-full text-sm md:text-base font-medium hover:bg-neutral-50 transition-colors"
              >
                <Mail size={18} />
                Email Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}