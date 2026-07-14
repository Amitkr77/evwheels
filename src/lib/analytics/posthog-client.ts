import posthog from "posthog-js";

let initialized = false;

/**
 * Initializes the client-side posthog-js singleton exactly once. Safe to
 * call multiple times (e.g. from React effects that re-run in dev) — only
 * the first call actually runs `posthog.init`.
 *
 * `capture_pageview` is disabled because page views are tracked manually via
 * `usePageViewTracking` (src/hooks/usePageViewTracking.ts) — this avoids
 * double-counting on client-side navigations, which posthog-js's built-in
 * pageview autocapture cannot distinguish from route changes.
 *
 * `capture_exceptions` enables the SDK's built-in global `window.onerror` /
 * `unhandledrejection` listener, covering "unexpected exceptions" per the
 * privacy/errors spec without any extra wiring.
 *
 * Session recording masks every input by default (`maskAllInputs: true`) so
 * passwords, payment fields, and personal information are never recorded —
 * elements can opt out of masking individually with `data-ph-mask` if a
 * specific low-risk field is later identified as safe to record in full.
 */
export function initPostHogClient(): typeof posthog | null {
  if (typeof window === "undefined") return null;
  if (initialized) return posthog;

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) {
    // No key configured (e.g. local dev without a PostHog project yet) —
    // fail silently rather than throwing, so the app still runs.
    return null;
  }

  posthog.init(key, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "/ingest",
    ui_host: process.env.NEXT_PUBLIC_POSTHOG_INGEST_HOST || "https://us.i.posthog.com",
    capture_pageview: false,
    capture_pageleave: true,
    autocapture: true,
    capture_exceptions: true,
    person_profiles: "identified_only",
    session_recording: {
      maskAllInputs: true,
      maskTextSelector: "[data-ph-mask]",
    },
    loaded: (ph) => {
      if (process.env.NODE_ENV === "development") {
        ph.debug();
      }
    },
  });

  initialized = true;
  return posthog;
}

export { posthog };
