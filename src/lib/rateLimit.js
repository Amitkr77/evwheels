/**
 * In-process rate limiter using a sliding window algorithm.
 *
 * Works per serverless function instance. For true cross-instance rate
 * limiting on Vercel, replace the `store` Map with Upstash Redis.
 *
 * Usage:
 *   const limited = await rateLimit(req, { limit: 5, windowMs: 60_000 });
 *   if (limited) return NextResponse.json({ error: "Too many requests" }, { status: 429 });
 */

const store = new Map(); // key → [timestamp, timestamp, ...]

function getKey(req, prefix = "") {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
  return `${prefix}:${ip}`;
}

/**
 * @param {Request} req
 * @param {{ limit?: number, windowMs?: number, prefix?: string }} opts
 * @returns {boolean} true if the request should be blocked
 */
export function rateLimit(req, { limit = 10, windowMs = 60_000, prefix = "rl" } = {}) {
  const key = getKey(req, prefix);
  const now = Date.now();
  const windowStart = now - windowMs;

  const timestamps = (store.get(key) || []).filter((t) => t > windowStart);
  timestamps.push(now);
  store.set(key, timestamps);

  // Prune old keys every ~500 requests to prevent memory growth
  if (Math.random() < 0.002) {
    for (const [k, ts] of store) {
      if (ts[ts.length - 1] < windowStart) store.delete(k);
    }
  }

  return timestamps.length > limit;
}
