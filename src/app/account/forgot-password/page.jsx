'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Something went wrong.')
      }

      setSubmitted(true)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-5 py-16 font-['Inter']">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="w-full max-w-md"
      >
        <Link
          href="/account/login"
          className="inline-flex items-center gap-2 text-sm md:text-base font-light text-neutral-600 hover:text-neutral-900 mb-12 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Login
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-medium text-neutral-900 mb-3">
            Forgot Password
          </h1>
          <p className="text-lg text-neutral-600 font-light">
            Enter your email to receive a password reset link
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-neutral-600 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.trim())}
                  className="w-full pl-12 pr-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#19B5D8] transition-colors"
                  placeholder="amit@evwheels.in"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full py-4 bg-neutral-900 text-white rounded-full text-lg font-medium hover:bg-neutral-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </motion.button>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#DDF8FD] flex items-center justify-center">
              <Mail size={28} className="text-[#19B5D8]" />
            </div>
            <h2 className="text-2xl md:text-3xl font-medium mb-4">
              Check Your Email
            </h2>
            <p className="text-lg text-neutral-600 font-light mb-8">
              If an account exists for <span className="font-medium text-neutral-900">{email}</span>,
              a reset link has been sent.
            </p>
            <p className="text-sm text-neutral-500">
              Didn't receive it? Check spam or{' '}
              <button
                onClick={() => setSubmitted(false)}
                className="text-[#19B5D8] hover:underline font-medium"
              >
                try again
              </button>
            </p>
          </motion.div>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/account/login"
            className="text-neutral-600 hover:text-neutral-900 font-medium transition-colors"
          >
            ← Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
