import { posthog } from "./posthog-client";
import type {
  AnalyticsEventMap,
  AnalyticsEventName,
  UserProperties,
  PageViewProperties,
} from "@/types/analytics";

/**
 * The single, centralized analytics facade. The rest of the app must import
 * `analytics` from here (or `@/lib/analytics`) rather than calling
 * `posthog-js` directly — this keeps every call site typed against
 * `AnalyticsEventMap`, makes the vendor swappable, and guarantees the
 * SSR-safety guard (`typeof window === "undefined"`) is applied uniformly.
 */
function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export const analytics = {
  /**
   * Tracks a domain event. `event` and `properties` are fully typed against
   * `AnalyticsEventMap` — passing an unknown event name or missing/extra
   * properties is a compile error.
   */
  track<E extends AnalyticsEventName>(event: E, properties: AnalyticsEventMap[E]): void {
    if (!isBrowser()) return;
    posthog.capture(event, properties);
  },

  /** Identifies the current user and sets their person properties. */
  identify(userId: string, properties: UserProperties): void {
    if (!isBrowser()) return;
    posthog.identify(userId, properties);
  },

  /** Clears the current PostHog session/identity — call on logout. */
  reset(): void {
    if (!isBrowser()) return;
    posthog.reset();
  },

  /**
   * Manually captures a `$pageview`. Used both by the automatic route-change
   * listener (usePageViewTracking) and for virtual "views" that don't change
   * the URL (e.g. profile tab switches).
   */
  page(pathname: string, properties?: Partial<PageViewProperties>): void {
    if (!isBrowser()) return;
    posthog.capture("$pageview", {
      pathname,
      url: window.location.href,
      ...properties,
    });
  },

  /** Captures an exception with optional extra context (page, user id, etc). */
  captureException(error: unknown, context?: Record<string, unknown>): void {
    if (!isBrowser()) return;
    posthog.captureException(error, context);
  },

  /** Returns whether a boolean feature flag is enabled (defaults to false). */
  isFeatureEnabled(flag: string): boolean {
    if (!isBrowser()) return false;
    return posthog.isFeatureEnabled(flag) ?? false;
  },

  /** Returns a feature flag's value — boolean for on/off flags, string for multivariate. */
  getFeatureFlag(flag: string): string | boolean | undefined {
    if (!isBrowser()) return undefined;
    return posthog.getFeatureFlag(flag);
  },
};

export type Analytics = typeof analytics;
