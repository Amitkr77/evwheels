"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { analytics } from "@/lib/analytics";

export default function Error({ error, reset }) {
  const pathname = usePathname();

  useEffect(() => {
    analytics.captureException(error, { page: pathname, digest: error?.digest });
  }, [error, pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-[#F8FAFC]">
      <h1 className="text-3xl font-medium text-neutral-900 mb-3">Something went wrong</h1>
      <p className="text-neutral-600 mb-8 max-w-md">
        An unexpected error occurred. Our team has been notified.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-neutral-900 text-white rounded-full text-sm font-medium hover:bg-neutral-800 transition-colors"
        >
          Try again
        </button>
        <Link
          href="/"
          className="px-6 py-3 border border-neutral-300 rounded-full text-sm font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
