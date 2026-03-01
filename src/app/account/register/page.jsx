"use client";

import React, { useState } from "react";
import {
  Mail,
  User,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Leaf,
  Gauge,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverMessage, setServerMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        return value.trim() ? "" : "Full name is required";
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) return "Email is required";
        if (!emailRegex.test(value)) return "Please enter a valid email";
        return "";
      case "phone":
        const phoneRegex = /^\+?\d{9,15}$/;
        if (!value.trim()) return "Phone number is required";
        if (!phoneRegex.test(value)) return "Please enter a valid phone number";
        return "";
      case "password":
        if (value.length < 8) return "Password must be at least 8 characters";
        if (!/[a-z]/.test(value))
          return "Must contain at least one lowercase letter";
        if (!/[A-Z]/.test(value))
          return "Must contain at least one uppercase letter";
        if (!/\d/.test(value)) return "Must contain at least one number";
        return "";
      default:
        return "";
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: validateField("name", form.name),
      email: validateField("email", form.email),
      phone: validateField("phone", form.phone),
      password: validateField("password", form.password),
    };

    setErrors(newErrors);

    // Return true only if no errors
    return Object.values(newErrors).every((err) => err === "");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Real-time validation
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));

    // Clear server message when user starts typing again
    if (serverMessage) setServerMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      // Focus first invalid field (optional UX improvement)
      const firstErrorField = Object.keys(errors).find((key) => errors[key]);
      if (firstErrorField) {
        document.getElementById(firstErrorField)?.focus();
      }
      return;
    }

    setLoading(true);
    setServerMessage("");
    setIsSuccess(false);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerMessage(
          data.error || "Registration failed. Please try again.",
        );
      } else {
        setServerMessage(
          "Account created successfully! Redirecting to login...",
        );
        setIsSuccess(true);
        setTimeout(() => {
          router.push("/account/login"); 
        }, 1200);

        setForm({ name: "", email: "", phone: "", password: "" });
        setErrors({ name: "", email: "", phone: "", password: "" });
      }
    } catch (err) {
      setServerMessage("Network error — please check your connection.");
      console.error(err);
      
    } finally {
      setLoading(false);
    }
  };

  // Simple password strength calculation
  const getPasswordStrength = () => {
    const pwd = form.password;
    if (!pwd) return { width: 0, text: "", color: "" };
    if (pwd.length < 8)
      return { width: 25, text: "Too short", color: "bg-red-500" };
    if (pwd.length < 12 || !/[A-Z]/.test(pwd) || !/\d/.test(pwd)) {
      return { width: 50, text: "Medium", color: "bg-yellow-500" };
    }
    return { width: 100, text: "Strong", color: "bg-green-500" };
  };

  const { width, text, color } = getPasswordStrength();

  return (
    <section className="bg-background-light dark:bg-background-dark font-display text-deep-green min-h-screen flex flex-col">
      <div className="flex flex-1 flex-col lg:flex-row min-h-screen">
        {/* Left — Branding / Hero */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-deep-green items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 opacity-40 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD1yuCm8iHCm5PdxQZW60DuST-V-0cpSGs9LkhZrtBxQj8iN0_FzhDS_Nqh-g_YHKjMB1hsmjMriMO3-GXIlqGrzXCse_6vSuJBNJ-znkAPozMnc2iRN6fH9Bj3ALMUdLhICpRADdnhV-hOXDSEhr-ZHQULQVXmpFk7Kj0nDKtJxaD7_liM5XEQqP8ELQpPKoM7LuiQDJbgV1z6w242HKF0xYabY9eEQmzXm2k3amcT4KMX4FL9gYHYbIIIjNfYJqGDwZ_vY3tEOifX')",
            }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent opacity-80" />
          <div className="relative z-10 px-8 xl:px-16 max-w-2xl">
            <div className="flex items-center gap-3 mb-10">
              <div className="size-12 text-primary">
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
              <span className="text-white text-4xl font-black tracking-tight">
                EvWheels
              </span>
            </div>
            <h1 className="text-white text-5xl xl:text-6xl font-black leading-tight mb-6">
              Join the <span className="text-primary italic">Revolution</span>{" "}
              of Mobility
            </h1>
            <p className="text-white/80 text-xl leading-relaxed mb-12">
              Sustainable transport doesn't mean compromising on power.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/10">
                <Leaf className="text-primary mb-3 size-8" />
                <p className="text-white font-bold text-lg">Zero Emissions</p>
                <p className="text-white/70 text-sm mt-1">
                  Better for the planet
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/10">
                <Gauge className="text-primary mb-3 size-8" />
                <p className="text-white font-bold text-lg">Instant Torque</p>
                <p className="text-white/70 text-sm mt-1">Silent & powerful</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right — Form */}
        <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-12 xl:px-20 bg-white dark:bg-zinc-950">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <div className="lg:hidden flex justify-center items-center gap-3 mb-10">
              <div className="size-10 text-primary">
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
              <h2 className="text-deep-green dark:text-white text-3xl font-black">
                EvWheels
              </h2>
            </div>

            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-4xl font-black tracking-tight text-deep-green dark:text-white">
                Create Account
              </h2>
              <p className="mt-2 text-text-muted">
                Start your clean mobility journey today.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold mb-2 text-deep-green dark:text-white"
                >
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted size-5" />
                  <input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3.5 rounded-xl border bg-white dark:bg-zinc-900 text-deep-green dark:text-white placeholder:text-text-muted/60 transition-all focus:outline-none focus:ring-2
                      ${errors.name ? "border-red-500 focus:ring-red-500/30" : "border-border-subtle focus:ring-primary focus:border-primary"}`}
                    placeholder="John Doe"
                    autoFocus
                    disabled={loading}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email + Phone */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold mb-2 text-deep-green dark:text-white"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted size-5" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-3.5 rounded-xl border bg-white dark:bg-zinc-900 text-deep-green dark:text-white placeholder:text-text-muted/60 transition-all focus:outline-none focus:ring-2
                        ${errors.email ? "border-red-500 focus:ring-red-500/30" : "border-border-subtle focus:ring-primary focus:border-primary"}`}
                      placeholder="name@example.com"
                      disabled={loading}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-semibold mb-2 text-deep-green dark:text-white"
                  >
                    Phone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted size-5" />
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-3.5 rounded-xl border bg-white dark:bg-zinc-900 text-deep-green dark:text-white placeholder:text-text-muted/60 transition-all focus:outline-none focus:ring-2
                        ${errors.phone ? "border-red-500 focus:ring-red-500/30" : "border-border-subtle focus:ring-primary focus:border-primary"}`}
                      placeholder="+1 (555) 000-0000"
                      disabled={loading}
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold mb-2 text-deep-green dark:text-white"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted size-5" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-12 py-3.5 rounded-xl border bg-white dark:bg-zinc-900 text-deep-green dark:text-white placeholder:text-text-muted/60 transition-all focus:outline-none focus:ring-2
                      ${errors.password ? "border-red-500 focus:ring-red-500/30" : "border-border-subtle focus:ring-primary focus:border-primary"}`}
                    placeholder="••••••••"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-deep-green transition-colors"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {/* Password strength bar */}
                <div className="mt-3">
                  <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${color}`}
                      style={{ width: `${width}%` }}
                    />
                  </div>
                  {form.password && (
                    <p className="mt-1.5 text-xs text-text-muted">
                      Strength: <span className="font-medium">{text}</span>
                    </p>
                  )}
                  {errors.password && (
                    <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-3 pt-2">
                <input
                  id="terms"
                  type="checkbox"
                  className="mt-1 size-4 rounded border-border-subtle text-primary focus:ring-primary"
                  required
                  disabled={loading}
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-text-muted leading-snug cursor-pointer"
                >
                  I agree to the{" "}
                  <a
                    href="#"
                    className="text-primary font-semibold hover:underline"
                  >
                    Terms
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="text-primary font-semibold hover:underline"
                  >
                    Privacy Policy
                  </a>
                </label>
              </div>

              {/* Server feedback */}
              {serverMessage && (
                <div
                  className={`mt-4 p-4 rounded-xl text-center text-sm font-medium border
                    ${
                      isSuccess
                        ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-green-200 dark:border-green-800/50"
                        : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-200 dark:border-red-800/50"
                    }`}
                >
                  {serverMessage}
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-primary hover:bg-primary/90 disabled:bg-primary/60 disabled:cursor-not-allowed text-deep-green font-bold text-lg rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border-subtle" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-zinc-950 px-4 text-text-muted font-semibold tracking-wider">
                    or
                  </span>
                </div>
              </div>

              <p className="text-center text-text-muted text-sm">
                Already have an account?{" "}
                <a
                  href="#"
                  className="text-deep-green dark:text-white font-bold hover:underline"
                >
                  Log in
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
