"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, User, Mail, Phone, Lock, Loader2 } from "lucide-react";
import Link from "next/link";

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
        if (!/[a-z]/.test(value)) return "Must contain at least one lowercase letter";
        if (!/[A-Z]/.test(value)) return "Must contain at least one uppercase letter";
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
    return Object.values(newErrors).every((err) => err === "");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));

    if (serverMessage) setServerMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      const firstErrorField = Object.keys(errors).find((key) => errors[key]);
      if (firstErrorField) document.getElementById(firstErrorField)?.focus();
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
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setServerMessage(data.error || "Registration failed. Please try again.");
      } else {
        setServerMessage("Account created successfully! Redirecting to login...");
        setIsSuccess(true);
        setTimeout(() => router.push("/account/login"), 1500);

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

  const getPasswordStrength = () => {
    const pwd = form.password;
    if (!pwd) return { width: 0, text: "", color: "" };
    if (pwd.length < 8) return { width: 25, text: "Too short", color: "bg-red-500" };
    if (pwd.length < 12 || !/[A-Z]/.test(pwd) || !/\d/.test(pwd)) {
      return { width: 50, text: "Medium", color: "bg-amber-500" };
    }
    return { width: 100, text: "Strong", color: "bg-[#19B5D8]" };
  };

  const { width, text, color } = getPasswordStrength();

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
            Create Account
          </h1>
          <p className="text-lg text-neutral-600 font-light">
            Start your journey with EVWheels
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {serverMessage && (
            <div
              className={`p-4 rounded-lg text-center text-sm font-medium border ${
                isSuccess
                  ? "bg-[#DDF8FD] text-[#1297B5] border-[#19B5D8]/30"
                  : "bg-red-50 text-red-700 border-red-200"
              }`}
            >
              {serverMessage}
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                className={`w-full pl-12 pr-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#19B5D8] transition-colors ${
                  errors.name ? "border-red-500" : ""
                }`}
                placeholder="Amit Sharma"
                autoFocus
                disabled={loading}
              />
            </div>
            {errors.name && (
              <p className="mt-2 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Email + Phone */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-neutral-600 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#19B5D8] transition-colors ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  placeholder="amit@evwheels.in"
                  disabled={loading}
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-600 mb-2">
                Phone
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#19B5D8] transition-colors ${
                    errors.phone ? "border-red-500" : ""
                  }`}
                  placeholder="+91 98765 43210"
                  disabled={loading}
                />
              </div>
              {errors.phone && (
                <p className="mt-2 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                className={`w-full pl-12 pr-12 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#19B5D8] transition-colors ${
                  errors.password ? "border-red-500" : ""
                }`}
                placeholder="••••••••"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-900 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={loading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Password strength bar */}
            {form.password && (
              <div className="mt-4">
                <div className="h-1.5 w-full bg-neutral-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${color}`}
                    style={{ width: `${width}%` }}
                  />
                </div>
                <p className="mt-2 text-sm text-neutral-600 font-light">
                  Strength: <span className="font-medium">{text}</span>
                </p>
              </div>
            )}
            {errors.password && (
              <p className="mt-2 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {/* Terms */}
          <div className="flex items-start gap-3 pt-2">
            <input
              id="terms"
              type="checkbox"
              className="mt-1 w-4 h-4 rounded border-neutral-300 text-[#19B5D8] focus:ring-[#19B5D8]"
              required
              disabled={loading}
            />
            <label
              htmlFor="terms"
              className="text-sm text-neutral-600 leading-relaxed cursor-pointer"
            >
              I agree to the{" "}
              <Link href="/terms" className="text-[#19B5D8] hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy-policy" className="text-[#19B5D8] hover:underline">
                Privacy Policy
              </Link>
            </label>
          </div>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-neutral-900 text-white rounded-full text-lg font-medium hover:bg-neutral-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-4 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </motion.button>
        </form>

        {/* Login link */}
        <p className="mt-10 text-center text-neutral-600">
          Already have an account?{" "}
          <Link href="/account/login" className="text-[#19B5D8] font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}