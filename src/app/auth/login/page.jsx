"use client";
import GoogleSignIn from "@/components/GoogleSignIn";
import { Eye } from "lucide-react";
import React, { useEffect } from "react";

export default function page() {
  
  return (
    <section className="bg-background-light dark:bg-background-dark text-[#131811] dark:text-white transition-colors duration-300">
      <div className="flex min-h-screen w-full flex-col lg:flex-row">
        {/* <!-- Left Column: Visual Storytelling --> */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#131811]">
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#142210]/80 via-transparent to-[#142210]/20"></div>
          <div
            className="absolute inset-0 bg-center bg-ngo-repeat bg-cover transition-transform duration-700 hover:scale-105"
            data-alt="Modern electric bicycle leaning against a minimalist urban concrete wall"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD1yuCm8iHCm5PdxQZW60DuST-V-0cpSGs9LkhZrtBxQj8iN0_FzhDS_Nqh-g_YHKjMB1hsmjMriMO3-GXIlqGrzXCse_6vSuJBNJ-znkAPozMnc2iRN6fH9Bj3ALMUdLhICpRADdnhV-hOXDSEhr-ZHQULQVXmpFk7Kj0nDKtJxaD7_liM5XEQqP8ELQpPKoM7LuiQDJbgV1z6w242HKF0xYabY9eEQmzXm2k3amcT4KMX4FL9gYHYbIIIjNfYJqGDwZ_vY3tEOifX")',
            }}
          ></div>
          <div className="relative z-20 flex flex-col justify-between p-12 h-full w-full">
            {/* <!-- Logo --> */}
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
                  ></path>
                </svg>
              </div>
              <h1 className="text-2xl font-bold tracking-tight">EvWheels</h1>
            </div>
            {/* <!-- Tagline --> */}
            <div className="max-w-md">
              <h2 className="text-5xl font-extrabold leading-tight text-white mb-6">
                Powering your <span className="text-primary">journey.</span>
              </h2>
              <p className="text-lg text-gray-300 font-medium">
                Join the revolution of sustainable urban mobility. Premium
                e-cycles designed for the modern rider.
              </p>
            </div>
            {/* <!-- Footer Visual Info --> */}
            <div className="flex items-center gap-4 text-white/60 text-sm">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">
                  energy_savings_leaf
                </span>{" "}
                Eco-friendly
              </span>
              <span className="w-1 h-1 bg-white/40 rounded-full"></span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">speed</span>
                High Performance
              </span>
            </div>
          </div>
        </div>
        {/* <!-- Right Column: Login Form --> */}
        <div className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-12 lg:px-20 xl:px-32 bg-white dark:bg-background-dark">
          <div className="mx-auto w-full max-w-[440px]">
            {/* <!-- Mobile Logo (only shows on mobile/tablet) --> */}
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
                  ></path>
                </svg>
              </div>
              <h2 className="text-xl font-bold">EvWheels</h2>
            </div>
            {/* <!-- Page Heading --> */}
            <div className="mb-10">
              <h1 className="text-4xl font-black leading-tight tracking-tight text-[#131811] dark:text-white">
                Welcome back
              </h1>
              <p className="mt-3 text-[#6b8a60] dark:text-gray-400 text-base">
                Please enter your details to access your account.
              </p>
            </div>
            <form className="space-y-5">
              {/* <!-- Email Field --> */}
              <div className="flex flex-col gap-2">
                <label className="text-[#131811] dark:text-gray-200 text-sm font-semibold">
                  Email Address
                </label>
                <input
                  className="form-input flex w-full rounded-lg text-[#131811] dark:text-white border border-[#dee6db] dark:border-gray-700 bg-white dark:bg-gray-800/50 focus:border-primary focus:ring-1 focus:ring-primary h-14 placeholder:text-[#6b8a60]/60 p-4 text-base transition-all"
                  placeholder="name@example.com"
                  type="email"
                />
              </div>
              {/* <!-- Password Field --> */}
              <div className="flex flex-col gap-2">
                <label className="text-[#131811] dark:text-gray-200 text-sm font-semibold">
                  Password
                </label>
                <div className="relative flex items-stretch rounded-lg group">
                  <input
                    className="form-input flex w-full rounded-lg text-[#131811] dark:text-white border border-[#dee6db] dark:border-gray-700 bg-white dark:bg-gray-800/50 focus:border-primary focus:ring-1 focus:ring-primary h-14 placeholder:text-[#6b8a60]/60 p-4 text-base transition-all pr-12"
                    placeholder="Enter your password"
                    type="password"
                  />
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6b8a60] hover:text-primary transition-colors"
                    type="button"
                  >
                    <Eye className="material-symbols-outlined" />
                  </button>
                </div>
              </div>
              {/* <!-- Utilities --> */}
              <div className="flex items-center justify-between py-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    className="rounded border-[#dee6db] text-primary focus:ring-primary h-4 w-4"
                    type="checkbox"
                  />
                  <span className="text-sm font-medium text-[#131811] dark:text-gray-300 group-hover:text-primary transition-colors">
                    Remember me
                  </span>
                </label>
                <a
                  className="text-sm font-semibold text-primary hover:underline underline-offset-4"
                  href="#"
                >
                  Forgot password?
                </a>
              </div>
              {/* <!-- Primary CTA --> */}
              <button className="w-full flex h-14 items-center justify-center rounded-lg bg-primary text-[#131811] text-base font-bold tracking-wide shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-[0.98] transition-all">
                Login to Dashboard
              </button>
              {/* <!-- Divider --> */}
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#dee6db] dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-background-dark px-4 text-[#6b8a60]">
                    Or continue with
                  </span>
                </div>
              </div>
              {/* <!-- Social Login --> */}
              <div className="grid grid-cols-1 gap-4">
               
                <GoogleSignIn/>
              </div>
            </form>
            {/* <!-- Registration Link --> */}
            <p className="mt-10 text-center text-sm text-[#6b8a60]">
              Don't have an account?
              <a
                className="font-bold text-[#131811] dark:text-white hover:text-primary transition-colors underline decoration-primary decoration-2 underline-offset-4 ml-2"
                href="#"
              >
                Create an account
              </a>
            </p>
            {/* <!-- Simple Footer --> */}
            <footer className="mt-20 flex justify-center gap-6 text-[11px] font-medium uppercase tracking-widest text-[#6b8a60]/60">
              <a className="hover:text-primary" href="#">
                Privacy
              </a>
              <a className="hover:text-primary" href="#">
                Terms
              </a>
              <a className="hover:text-primary" href="#">
                Support
              </a>
            </footer>
          </div>
        </div>
      </div>
    </section>
  );
}
