"use client";

import { Eye, EyeOff } from "lucide-react";
import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function LoginPage() {
  const { login, checkAuth } = useAuthStore();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isPending, startTransition] = useTransition();

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Login failed. Please try again.");
          return;
        }
        login(data.user); // Update auth state with user info
        await checkAuth(); // Re-validate auth state after login
        // Login successful → redirect
        router.push("/");
        // Optional: router.refresh() if you want to force re-fetch data
      } catch (err) {
        setError("Something went wrong. Please try again later.");
      }
    });
  };

  return (
    <section
      className="
        bg-background-light dark:bg-background-dark
        text-[#131811] dark:text-white
        min-h-screen transition-colors duration-300
      "
    >
      <div className="flex min-h-screen w-full flex-col lg:flex-row">
        {/* Left Column – Visual / Branding (desktop only) */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#131811]">
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#142210]/80 via-transparent to-[#142210]/20 pointer-events-none" />

          <div
            className="
              absolute inset-0 bg-center bg-no-repeat bg-cover
              transition-transform duration-700 hover:scale-105
            "
            style={{
              backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuD1yuCm8iHCm5PdxQZW60DuST-V-0cpSGs9LkhZrtBxQj8iN0_FzhDS_Nqh-g_YHKjMB1hsmjMriMO3-GXIlqGrzXCse_6vSuJBNJ-znkAPozMnc2iRN6fH9Bj3ALMUdLhICpRADdnhV-hOXDSEhr-ZHQULQVXmpFk7Kj0nDKtJxaD7_liM5XEQqP8ELQpPKoM7LuiQDJbgV1z6w242HKF0xYabY9eEQmzXm2k3amcT4KMX4FL9gYHYbIIIjNfYJqGDwZ_vY3tEOifX")`,
            }}
          />

          <div className="relative z-20 flex flex-col justify-between p-12 h-full w-full">
            {/* Logo */}
            <div className="flex items-center gap-3 text-white">
              <div className="size-8 text-primary">
                <svg
                  fill="none"
                  viewBox="0 0 48 48"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 6H42L36 24L42 42H6L12 24L6 6Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold tracking-tight">EvWheels</h1>
            </div>

            {/* Tagline */}
            <div className="max-w-md">
              <h2 className="text-5xl font-extrabold leading-tight text-white mb-6">
                Powering your <span className="text-primary">journey.</span>
              </h2>
              <p className="text-lg text-gray-300 font-medium">
                Join the revolution of sustainable urban mobility. Premium
                e-cycles designed for the modern rider.
              </p>
            </div>

            {/* Eco / Performance badges */}
            <div className="flex items-center gap-4 text-white/60 text-sm">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">
                  energy_savings_leaf
                </span>
                Eco-friendly
              </span>
              <span className="w-1 h-1 bg-white/40 rounded-full" />
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">speed</span>
                High Performance
              </span>
            </div>
          </div>
        </div>

        {/* Right Column – Form */}
        <div className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-12 lg:px-20 xl:px-32 bg-white dark:bg-background-dark">
          <div className="mx-auto w-full max-w-[440px]">
            {/* Mobile logo */}
            <div className="flex lg:hidden items-center gap-3 text-[#131811] dark:text-white mb-10">
              <div className="size-6 text-primary">
                <svg
                  fill="none"
                  viewBox="0 0 48 48"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 6H42L36 24L42 42H6L12 24L6 6Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold">EvWheels</h2>
            </div>

            {/* Heading */}
            <div className="mb-10">
              <h1 className="text-4xl font-black leading-tight tracking-tight text-[#131811] dark:text-white">
                Welcome back
              </h1>
              <p className="mt-3 text-[#6b8a60] dark:text-gray-400 text-base">
                Please enter your details to access your account.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error message */}
              {error && (
                <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-[#131811] dark:text-gray-200 text-sm font-semibold block"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value.trim())}
                  placeholder="name@example.com"
                  className="
                    flex w-full h-14 rounded-lg px-4 text-base
                    border border-[#dee6db] dark:border-gray-700
                    bg-white dark:bg-gray-800/50
                    text-[#131811] dark:text-white
                    placeholder:text-[#6b8a60]/60
                    focus:border-primary focus:ring-1 focus:ring-primary
                    transition-all outline-none
                  "
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-[#131811] dark:text-gray-200 text-sm font-semibold block"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="
                      flex w-full h-14 rounded-lg px-4 pr-12 text-base
                      border border-[#dee6db] dark:border-gray-700
                      bg-white dark:bg-gray-800/50
                      text-[#131811] dark:text-white
                      placeholder:text-[#6b8a60]/60
                      focus:border-primary focus:ring-1 focus:ring-primary
                      transition-all outline-none
                    "
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="
                      absolute right-4 top-1/2 -translate-y-1/2
                      text-[#6b8a60] hover:text-primary
                      transition-colors p-1
                    "
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="size-5" />
                    ) : (
                      <Eye className="size-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between py-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="
                      h-4 w-4 rounded border-[#dee6db] dark:border-gray-600
                      text-primary focus:ring-primary
                    "
                  />
                  <span className="text-sm font-medium text-[#131811] dark:text-gray-300 group-hover:text-primary transition-colors">
                    Remember me
                  </span>
                </label>

                <a
                  href="/forgot-password"
                  className="
                    text-sm font-semibold text-primary
                    hover:underline underline-offset-4
                  "
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isPending}
                className="
                  w-full h-14 flex items-center justify-center
                  rounded-lg bg-primary text-[#131811]
                  text-base font-bold tracking-wide
                  shadow-lg shadow-primary/20
                  hover:bg-primary/90 active:scale-[0.98]
                  transition-all disabled:opacity-60 disabled:pointer-events-none
                "
              >
                {isPending ? "Signing in..." : "Login to Dashboard"}
              </button>

              {/* Divider */}
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#dee6db] dark:border-gray-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-background-dark px-4 text-[#6b8a60]">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Social buttons placeholder – add later if needed */}
              {/* <div className="grid grid-cols-2 gap-4">
                <button>Google</button>
                <button>GitHub</button>
              </div> */}
            </form>

            {/* Sign up link */}
            <p className="mt-10 text-center text-sm text-[#6b8a60]">
              Don't have an account?{" "}
              <a
                href="/signup"
                className="
                  font-bold text-[#131811] dark:text-white
                  hover:text-primary transition-colors
                  underline decoration-primary decoration-2 underline-offset-4
                "
              >
                Create an account
              </a>
            </p>

            {/* Footer links */}
            <footer className="mt-20 flex justify-center gap-6 text-[11px] font-medium uppercase tracking-widest text-[#6b8a60]/60">
              <a
                href="/privacy"
                className="hover:text-primary transition-colors"
              >
                Privacy
              </a>
              <a href="/terms" className="hover:text-primary transition-colors">
                Terms
              </a>
              <a
                href="/support"
                className="hover:text-primary transition-colors"
              >
                Support
              </a>
            </footer>
          </div>
        </div>
      </div>
    </section>
  );
}
