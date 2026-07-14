// Client-safe barrel only. `posthog-server.ts` (posthog-node, Node-only
// built-ins) is intentionally NOT re-exported here — importing it from this
// barrel would pull posthog-node into client bundles. API routes that need
// server-side exception capture must import it directly:
//   import { captureServerException } from "@/lib/analytics/posthog-server";
export { analytics } from "./analytics";
export type { Analytics } from "./analytics";
export { initPostHogClient, posthog } from "./posthog-client";
