"use client";

import { Suspense, useEffect, type ReactNode } from "react";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { initPostHogClient, posthog } from "@/lib/analytics";
import { usePageViewTracking } from "@/hooks/usePageViewTracking";

function PostHogPageviewTracker() {
  usePageViewTracking();
  return null;
}

/**
 * Root PostHog provider. Initializes posthog-js exactly once on the client
 * (initPostHogClient is itself idempotent), then exposes the singleton via
 * posthog-js/react's context so `usePostHog()`/`useFeatureFlagEnabled()`
 * etc. work anywhere in the tree. Mounted in src/app/layout.js, wrapping
 * <AuthProvider>, so PostHog is ready before auth session restoration runs.
 */
export default function PostHogProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    initPostHogClient();
  }, []);

  return (
    <PHProvider client={posthog}>
      {/* useSearchParams requires a Suspense boundary in the App Router */}
      <Suspense fallback={null}>
        <PostHogPageviewTracker />
      </Suspense>
      {children}
    </PHProvider>
  );
}
