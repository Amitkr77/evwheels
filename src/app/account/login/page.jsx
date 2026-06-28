"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";

function LoginForm() {
  const { login } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setIsPending(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed. Please try again.");
        return;
      }

      await login(data.user);
      const redirectTo = searchParams.get("redirect") || "/";
      router.push(redirectTo);
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-5 py-16 font-['Inter']">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="w-full max-w-lg"
      >
        {/* Back link */}
        <div className="mb-8 text-center">
          <Link href="/" className="text-sm text-neutral-500 hover:text-[#19B5D8] transition-colors">
            ← Back to EVWheels
          </Link>
        </div>

        {/* Heading */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-medium text-neutral-900 mb-3">
            Welcome Back
          </h1>
          <p className="text-lg text-neutral-600 font-light">
            Sign in to your EVWheels account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500"
                size={20}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value.trim())}
                className="w-full pl-12 pr-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#19B5D8] transition-colors"
                placeholder="hello@evwheels.in"
                autoComplete="email"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500"
                size={20}
              />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#19B5D8] transition-colors"
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-neutral-300 text-[#19B5D8] focus:ring-[#19B5D8]"
              />
              <span className="text-neutral-600 font-light">Remember me</span>
            </label>

            <Link
              href="/account/forgot-password"
              className="text-[#19B5D8] font-medium hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isPending}
            className="w-full py-4 bg-neutral-900 text-white rounded-full text-lg font-medium hover:bg-neutral-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-4"
          >
            {isPending ? "Signing in..." : "Sign In"}
          </motion.button>
        </form>

        {/* Register Link */}
        <div className="mt-10 text-center text-neutral-600">
          Don't have an account?{" "}
          <Link
            href="/account/register"
            className="text-[#19B5D8] font-medium hover:underline"
          >
            Create one
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
