"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { analytics } from "@/lib/analytics";
import type { PageViewProperties } from "@/types/analytics";

function getDeviceType(): PageViewProperties["device_type"] {
  if (typeof window === "undefined") return "desktop";
  const ua = window.navigator.userAgent;
  if (/tablet|ipad/i.test(ua)) return "tablet";
  if (/mobile|iphone|android/i.test(ua)) return "mobile";
  return "desktop";
}

/**
 * Fires a `$pageview` exactly once per real route change. Next.js App
 * Router doesn't emit a navigation event posthog-js can hook into directly,
 * so this listens to `usePathname`/`useSearchParams` and de-dupes against
 * the last-tracked URL via a ref — this also absorbs React 19's dev-mode
 * double-invoked effects, which would otherwise double-count every page view.
 */
export function usePageViewTracking(): void {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedUrl = useRef<string | null>(null);
  const previousPage = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;

    const query = searchParams?.toString();
    const url = query ? `${pathname}?${query}` : pathname;

    if (lastTrackedUrl.current === url) return;

    analytics.page(pathname, {
      url: typeof window !== "undefined" ? window.location.href : url,
      referrer: typeof document !== "undefined" ? document.referrer : undefined,
      previous_page: previousPage.current,
      device_type: getDeviceType(),
    });

    previousPage.current = url;
    lastTrackedUrl.current = url;
  }, [pathname, searchParams]);
}
