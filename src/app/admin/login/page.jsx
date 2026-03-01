'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Shield } from 'lucide-react';
import Link from 'next/link';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Prefill for demo (your name)
  React.useEffect(() => {
    setEmail('amit@shopifyadmin.com');
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Fake API delay (real app: call your /api/login)
    setTimeout(() => {
      if (email && password.length >= 6) {
        // Success → redirect to dashboard
        localStorage.setItem('adminLoggedIn', 'true'); // simple demo auth
        router.push('/admin');
      } else {
        setError('Please enter valid credentials');
      }
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-amber-50 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-violet-600 rounded-3xl flex items-center justify-center text-white font-black text-4xl shadow-xl">
              S
            </div>
            <div>
              <span className="font-bold text-4xl tracking-tighter text-gray-900">Shopify</span>
              <span className="block text-xs text-violet-600 -mt-1 font-medium">ADMIN</span>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-violet-100/50 border border-gray-100 overflow-hidden">
          <div className="px-10 pt-10 pb-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-semibold text-gray-900">Welcome back, Amit 👋</h1>
              <p className="text-gray-500 mt-2">Sign in to access your admin dashboard</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Email address</label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail size={20} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-gray-50 border border-gray-200 focus:border-violet-400 rounded-2xl py-4 pl-12 pr-5 text-sm outline-none transition-all"
                    placeholder="amit@shopifyadmin.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Password</label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock size={20} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full bg-gray-50 border border-gray-200 focus:border-violet-400 rounded-2xl py-4 pl-12 pr-12 text-sm outline-none transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-violet-600" defaultChecked />
                  <span className="text-gray-600">Remember me</span>
                </label>
                <Link href="#" className="text-violet-600 hover:underline font-medium">
                  Forgot password?
                </Link>
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-red-600 text-sm text-center font-medium bg-red-50 py-2.5 rounded-2xl">
                  {error}
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.985]"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in to Dashboard
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 border-t border-gray-100 px-10 py-6 text-center text-xs text-gray-500 flex items-center justify-center gap-2">
            <Shield size={16} />
            Secure admin access • Patna, Bihar
          </div>
        </div>

        {/* Demo hint */}
        <p className="text-center text-xs text-gray-400 mt-8">
          Demo: Click Sign in (password can be anything ≥6 chars)
        </p>
      </div>
    </div>
  );
};

export default LoginPage;