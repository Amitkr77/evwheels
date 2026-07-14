"use client";

import { useFeatureFlagEnabled, useFeatureFlagPayload, useFeatureFlagVariantKey } from "posthog-js/react";
import type { FeatureFlagResult } from "@/types/analytics";

/**
 * Single reusable hook for reading a PostHog feature flag. Wraps
 * posthog-js/react's hooks so the rest of the app never imports posthog-js
 * directly — consistent with the "avoid calling PostHog directly" principle
 * applied to the `analytics` facade.
 *
 * @example
 *   const { enabled } = useFeatureFlag("new-checkout-flow");
 *   if (enabled) { ... }
 *
 * @example multivariate
 *   const { variant } = useFeatureFlag("pricing-experiment");
 *   if (variant === "control") { ... }
 */
export function useFeatureFlag(flagKey: string): FeatureFlagResult {
  const enabled = useFeatureFlagEnabled(flagKey);
  const variant = useFeatureFlagVariantKey(flagKey);
  const payload = useFeatureFlagPayload(flagKey);

  return {
    enabled: enabled ?? false,
    variant,
    payload,
  };
}
