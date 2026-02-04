import React from "react";

export default function page() {
  return (
    <section className="bg-background-light dark:bg-background-dark font-display text-deep-green min-h-screen flex flex-col">
      {/* <!-- Main Content Container (Full Width Split Screen) --> */}
      <div className="flex flex-1 flex-col lg:flex-row min-h-screen">
        {/* <!-- Left Pane: Visual Branding & Hero --> */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-deep-green items-center justify-center overflow-hidden">
          {/* <!-- Decorative Background Element --> */}
          <div
            className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1558981403-c5f91cbba527?ixlib=rb-4.0.3&amp;auto=format&amp;fit=crop&amp;w=1200&amp;q=80')] bg-cover bg-center"
            data-alt="High-end electric motorcycle in a modern studio"
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent opacity-80"></div>
          <div className="relative z-10 px-12 max-w-xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="size-10 text-primary">
                <svg
                  fill="none"
                  viewbox="0 0 48 48"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 6H42L36 24L42 42H6L12 24L6 6Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </div>
              <span className="text-white text-3xl font-black tracking-tighter">
                EvWheels
              </span>
            </div>
            <h1 className="text-white text-5xl font-black leading-tight mb-6">
              Join the <span className="text-primary italic">Revolution</span>{" "}
              of Mobility
            </h1>
            <p className="text-white/80 text-lg leading-relaxed mb-10">
              Sustainable transport doesn't mean compromising on power.
              Experience the next generation of electric bikes and scooters.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg border border-white/10">
                <span className="material-symbols-outlined text-primary mb-2">
                  eco
                </span>
                <p className="text-white font-bold">Zero Emissions</p>
                <p className="text-white/60 text-sm">Better for the planet</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg border border-white/10">
                <span className="material-symbols-outlined text-primary mb-2">
                  speed
                </span>
                <p className="text-white font-bold">Top Speed</p>
                <p className="text-white/60 text-sm">Unmatched efficiency</p>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- Right Pane: Registration Form --> */}
        <div className="flex flex-1 flex-col justify-center items-center px-6 py-12 lg:px-20 bg-white dark:bg-background-dark">
          <div className="w-full max-w-[480px]">
            {/* <!-- Logo for mobile --> */}
            <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
              <div className="size-8 text-primary">
                <svg
                  fill="none"
                  viewbox="0 0 48 48"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 6H42L36 24L42 42H6L12 24L6 6Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </div>
              <h2 className="text-deep-green dark:text-white text-2xl font-bold">
                EvWheels
              </h2>
            </div>
            {/* <!-- Form Heading --> */}
            <div className="mb-8">
              <h2 className="text-deep-green dark:text-white text-4xl font-black tracking-tight mb-2">
                Create Your Account
              </h2>
              <p className="text-text-muted text-base">
                Start your journey to eco-friendly mobility today.
              </p>
            </div>
            {/* <!-- Registration Form --> */}
            <form className="space-y-5">
              {/* <!-- Full Name --> */}
              <div>
                <label className="block text-deep-green dark:text-white text-sm font-semibold mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
                    person
                  </span>
                  <input
                    className="w-full pl-12 pr-4 py-3.5 rounded-lg border border-border-subtle bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-deep-green dark:text-white placeholder:text-text-muted/60 transition-all"
                    placeholder="John Doe"
                    type="text"
                  />
                </div>
              </div>
              <div className="flex item-center gap-2">
                {/* <!-- Email Address --> */}
                <div>
                  <label className="block text-deep-green dark:text-white text-sm font-semibold mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
                      mail
                    </span>
                    <input
                      className="w-full pl-12 pr-4 py-3.5 rounded-lg border border-border-subtle bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-deep-green dark:text-white placeholder:text-text-muted/60 transition-all"
                      placeholder="name@email.com"
                      type="email"
                    />
                  </div>
                </div>
                {/* <!-- Phone Number --> */}
                <div>
                  <label className="block text-deep-green dark:text-white text-sm font-semibold mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
                      phone_iphone
                    </span>
                    <input
                      className="w-full pl-12 pr-4 py-3.5 rounded-lg border border-border-subtle bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-deep-green dark:text-white placeholder:text-text-muted/60 transition-all"
                      placeholder="+1 (555) 000-0000"
                      type="tel"
                    />
                  </div>
                </div>
              </div>
              {/* <!-- Password --> */}
              <div>
                <label className="block text-deep-green dark:text-white text-sm font-semibold mb-2">
                  Password
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
                    lock
                  </span>
                  <input
                    className="w-full pl-12 pr-12 py-3.5 rounded-lg border border-border-subtle bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-deep-green dark:text-white placeholder:text-text-muted/60 transition-all"
                    placeholder="••••••••"
                    type="password"
                  />
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-deep-green"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      visibility
                    </span>
                  </button>
                </div>
                {/* <!-- Password Strength Bar --> */}
                <div className="mt-2 flex gap-1 h-1 w-full">
                  <div className="h-full w-1/4 bg-primary rounded-full"></div>
                  <div className="h-full w-1/4 bg-primary rounded-full"></div>
                  <div className="h-full w-1/4 bg-gray-200 dark:bg-white/10 rounded-full"></div>
                  <div className="h-full w-1/4 bg-gray-200 dark:bg-white/10 rounded-full"></div>
                </div>
                <p className="text-[10px] text-text-muted mt-1">
                  Password strength: Medium
                </p>
              </div>
              {/* <!-- Terms & Conditions --> */}
              <div className="flex items-start gap-3 py-2">
                <input
                  className="mt-1 size-4 rounded border-border-subtle text-primary focus:ring-primary cursor-pointer"
                  id="terms"
                  type="checkbox"
                />
                <label
                  className="text-sm text-text-muted leading-snug cursor-pointer"
                  for="terms"
                >
                  By creating an account, you agree to the{" "}
                  <a
                    className="text-primary font-bold hover:underline"
                    href="#"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    className="text-primary font-bold hover:underline"
                    href="#"
                  >
                    Privacy Policy
                  </a>
                  .
                </label>
              </div>
              {/* <!-- CTA Buttons --> */}
              <div className="flex flex-col gap-4 ">
                <button
                  className="w-full h-14 bg-primary hover:bg-opacity-90 text-deep-green font-bold text-lg rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
                  type="submit"
                >
                  <span>Create Account</span>
                </button>
                <div className="flex items-center gap-4 ">
                  <div className="h-px bg-border-subtle flex-1"></div>
                  <span className="text-xs font-bold text-text-muted uppercase tracking-widest">
                    or
                  </span>
                  <div className="h-px bg-border-subtle flex-1"></div>
                </div>
                <button
                  className="w-full h-12 bg-white dark:bg-background-dark border border-border-subtle hover:bg-background-light dark:hover:bg-white/5 text-deep-green dark:text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-3"
                  type="button"
                >
                  <svg
                    className="size-5"
                    viewbox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    ></path>
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    ></path>
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                      fill="#FBBC05"
                    ></path>
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                      fill="#EA4335"
                    ></path>
                  </svg>
                  <span>Sign up with Google</span>
                </button>
              </div>
              {/* <!-- Footer Link --> */}
              <div className="text-center mt-8">
                <p className="text-text-muted text-sm">
                  Already have an account?
                  <a
                    className="text-deep-green dark:text-white font-black hover:underline ml-1"
                    href="#"
                  >
                    Log in
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
