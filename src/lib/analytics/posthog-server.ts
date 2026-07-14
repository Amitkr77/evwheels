import { PostHog } from "posthog-node";

/**
 * Server-side PostHog client (posthog-node), used ONLY for capturing
 * exceptions from API route handlers (§13 "API failures"). Business events
 * (purchases, cart actions, etc.) are intentionally tracked exclusively via
 * the client-side facade (src/lib/analytics/analytics.ts) to avoid the same
 * event being double-counted from both server and client.
 *
 * posthog-js (browser SDK) cannot run in API routes since there is no
 * `window` — this is the standard PostHog-recommended split for Next.js.
 */
let client: PostHog | null = null;

function getServerClient(): PostHog | null {
  const key = process.env.POSTHOG_SERVER_KEY;
  if (!key) return null;

  if (!client) {
    client = new PostHog(key, {
      host: process.env.NEXT_PUBLIC_POSTHOG_INGEST_HOST || "https://us.i.posthog.com",
      flushAt: 1,
      flushInterval: 0,
    });
  }
  return client;
}

/**
 * Captures a server-side (API route) exception. `distinctId` should be the
 * authenticated user's id when available, falling back to "anonymous" —
 * PostHog requires a distinct_id for every event.
 */
export function captureServerException(
  error: unknown,
  context: { route: string; distinctId?: string; extra?: Record<string, unknown> }
): void {
  const ph = getServerClient();
  if (!ph) return;

  ph.captureException(error, context.distinctId || "anonymous", {
    route: context.route,
    ...context.extra,
  });
}

/** Flushes any queued events — call from a process-exit handler if needed. */
export async function shutdownPostHogServer(): Promise<void> {
  if (client) await client._shutdown();
}
