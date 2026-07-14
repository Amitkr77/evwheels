# Analytics (PostHog)

EVWheels uses [PostHog](https://posthog.com) for product analytics, session
recording, and feature flags. This document covers setup, the internal
architecture, the full event catalogue, and how to extend it safely.

## Setup

1. Create a PostHog project (or use an existing one) and grab its **Project
   API Key** and region host.
2. Fill in `.env`:
   ```
   NEXT_PUBLIC_POSTHOG_KEY=phc_xxx
   NEXT_PUBLIC_POSTHOG_HOST=/ingest
   NEXT_PUBLIC_POSTHOG_INGEST_HOST=https://us.i.posthog.com
   NEXT_PUBLIC_POSTHOG_ASSETS_HOST=https://us-assets.i.posthog.com
   POSTHOG_SERVER_KEY=phc_xxx
   ```
   Use `https://eu.i.posthog.com` / `https://eu-assets.i.posthog.com` instead
   if your PostHog project is EU-hosted. `POSTHOG_SERVER_KEY` can be the same
   project key as `NEXT_PUBLIC_POSTHOG_KEY`.
3. `npm install` (already includes `posthog-js` and `posthog-node`).
4. `npm run dev` — with a key configured, `posthog.debug()` is enabled
   automatically in development (see `src/lib/analytics/posthog-client.ts`),
   so every captured event is logged to the browser console.

If `NEXT_PUBLIC_POSTHOG_KEY` / `POSTHOG_SERVER_KEY` are unset, the client and
server helpers become silent no-ops — the app runs normally, just without
analytics. This is intentional so local dev without a PostHog project still
works.

## How it works

### Environments
The same `analytics` facade runs in both dev and production — the only
difference is the PostHog project key you point `.env` at (use separate
PostHog projects for dev/staging vs production so test traffic doesn't
pollute production data).

### Reverse proxy
Client-side requests go through `next.config.mjs`'s `rewrites()`
(`/ingest/*` → your PostHog region host), not directly to `posthog.com`.
This avoids ad-blockers silently dropping analytics calls, and means the
existing CSP (`connect-src 'self'`) didn't need any changes.

### SSR safety
`posthog-js` only runs in the browser. Every method in
`src/lib/analytics/analytics.ts` guards with `typeof window === "undefined"`,
so importing `analytics` into a file that also renders on the server (or
calling it from code that might run during SSR) is always safe — it's just a
no-op there.

### Client vs server
- **`src/lib/analytics/analytics.ts`** (posthog-js) — all business events,
  identify/reset, feature flags, and *client-side* exception capture. This is
  what the app's UI code imports.
- **`src/lib/analytics/posthog-server.ts`** (posthog-node) — used **only**
  for capturing exceptions thrown inside Next.js API routes (server-side,
  no `window`). It is never used to track business events, to avoid the same
  event being recorded twice (once from the browser, once from the server).
  Import it directly (`@/lib/analytics/posthog-server`), never through the
  `@/lib/analytics` barrel — that barrel is client-safe only and deliberately
  does not re-export it, so posthog-node's Node built-ins never leak into a
  client bundle.

### De-duplication
- Page views are tracked manually (`capture_pageview: false` in
  `posthog-client.ts`) via `usePageViewTracking` (`src/hooks/usePageViewTracking.ts`),
  which de-dupes against the last-tracked URL with a `useRef` — this absorbs
  React's dev-mode double-invoked effects and avoids double-counting SPA
  navigations.
- Cart/wishlist events are instrumented **inside the Zustand stores**
  (`src/store/cartStore.js`, `src/store/wishlistStore.js`), not at each
  button call site — several UI buttons call the same store action, so
  instrumenting once at the source is what prevents duplicate events.
- The checkout "purchase" events (`Payment Successful`, `Order Completed`)
  fire once, from `placeOrder()`'s success branch in
  `src/app/(user)/checkout/page.jsx`, using the `POST /api/orders` response
  directly — **not** on `/order-success` page load, since that page re-fetches
  on every visit/refresh and would double-count.

## `analytics` — the facade

Import from `@/lib/analytics`. Never import `posthog-js` directly elsewhere.

| Method | Signature | Purpose |
|---|---|---|
| `analytics.track` | `track<E>(event: E, properties: AnalyticsEventMap[E])` | Fire a typed domain event. |
| `analytics.identify` | `identify(userId: string, properties: UserProperties)` | Attach person properties to a distinct_id (call on login/session-restore). |
| `analytics.reset` | `reset()` | Clear the current identity (call on logout). |
| `analytics.page` | `page(pathname: string, properties?)` | Manual `$pageview` — used by the route-change listener and for virtual views (e.g. profile tabs) that don't change the URL. |
| `analytics.captureException` | `captureException(error: unknown, context?)` | Client-side error capture. |
| `analytics.isFeatureEnabled` | `isFeatureEnabled(flag: string): boolean` | Boolean feature flag check. |
| `analytics.getFeatureFlag` | `getFeatureFlag(flag: string): string \| boolean \| undefined` | Multivariate flag value. |

`analytics.track()` is generic over `AnalyticsEventMap`
(`src/types/analytics.ts`) — passing an unknown event name, or an object
missing/mismatching that event's required properties, is a **compile error**
in any `.ts`/`.tsx` file. Plain `.jsx` call sites (most of this codebase)
don't get that compile-time check, but still get the correct runtime shape
by following the examples in the table below.

### Feature flags
```jsx
import { useFeatureFlag } from "@/hooks/useFeatureFlag";

const { enabled, variant, payload } = useFeatureFlag("new-checkout-flow");
if (enabled) { /* ... */ }
```

## Event catalogue

| Event | Fired from | Key properties |
|---|---|---|
| `$pageview` | `src/hooks/usePageViewTracking.ts` (auto, every route change) + `src/app/profile/page.jsx` `handleTabChange` (manual, per tab) | `pathname`, `url`, `referrer`, `previous_page`, `device_type`, `tab` |
| `Product Viewed` | `ProductDetailClient.jsx` | `product_id`, `slug`, `product_name`, `category`, `brand`, `price`, `currency`, `stock` |
| `Category Viewed` | `shop/page.jsx` (category fetch effect) | `category_id` (slug), `category_name` |
| `Search Performed` | `shop/page.jsx` (debounced search effect) | `query`, `number_of_results`, `filters`, `sort`, `page` |
| `Added to Cart` | `store/cartStore.js` `addToCart` | `product_id`, `product_name`, `quantity`, `price`, `category`, `source` (`pdp`\|`buy_now`\|`wishlist`), `cart_value`, `item_count` |
| `Removed from Cart` | `store/cartStore.js` `removeFromCart` | `product_id`, `product_name`, `price`, `quantity`, `cart_value`, `item_count` |
| `Cart Updated` | `store/cartStore.js` `updateQuantity` | `product_id`, `quantity`, `direction` (`increase`\|`decrease`), `cart_value`, `item_count` |
| `Cart Cleared` | `store/cartStore.js` `clearCart` | `cart_value`, `item_count` |
| `Added to Wishlist` / `Removed from Wishlist` | `store/wishlistStore.js` `toggleWishlist` | `product_id`, `product_name` |
| `Checkout Started` | `checkout/page.jsx` (mount effect) | `cart_value`, `item_count`, `currency` |
| `Shipping Address Added` | `checkout/page.jsx` `placeOrder` | `city`, `state`, `country` |
| `Shipping Method Selected` | `checkout/page.jsx` `placeOrder` | `method` (constant `"Standard"` — no method selector UI exists yet) |
| `Coupon Applied` | `cart/page.jsx` `applyCoupon` | `coupon`, `discount`, `currency` |
| `Payment Method Selected` | `checkout/page.jsx` `placeOrder` | `method` (currently always `"COD"` — no gateway UI yet) |
| `Checkout Reviewed` | `checkout/page.jsx` `placeOrder` | `cart_value`, `item_count`, `currency` |
| `Payment Initiated` | `checkout/page.jsx` `placeOrder` (before the `/api/orders` request) | `order_value`, `currency`, `payment_method` |
| `Payment Successful` / `Order Completed` | `checkout/page.jsx` `placeOrder` (on success) | `order_id`, `order_value`, `tax`, `shipping`, `discount`, `currency`, `payment_method`, `item_count` |
| `Payment Failed` | `checkout/page.jsx` `placeOrder` (on failure/error) | `error_message`, `payment_method` |
| `Order Cancelled` | *not wired — no cancel-order UI exists yet* | `order_id`, `reason` |
| `Review Submitted` / `Updated` / `Deleted` | *not wired — no review submission UI exists yet* | `product_id`, `review_id`, `rating` |
| `User Signed Up` | `account/register/page.jsx` (success) | `method` |
| `User Logged In` | `account/login/page.jsx`, `admin/login/page.jsx` | `method` |
| `User Logged Out` | `store/authStore.js` `logout` | — |
| `Password Reset Requested` | `account/forgot-password/page.jsx` | — |
| `Password Reset Completed` | `account/reset-password/page.jsx` | — |
| `Email Verified` | `account/login/page.jsx` (reads `?verified=true`) | — |
| `Profile Updated` | `components/user/Settings.jsx` `handleSave` | `fields_changed` |
| `Address Added` / `Updated` / `Deleted` | `components/user/Address.jsx` | `address_id`, `city`, `state`, `field` |
| `404 Viewed` | `components/NotFoundTracker.jsx` (mounted in `app/not-found.jsx`) | `pathname` |
| exceptions (`$exception`) | `capture_exceptions: true` (global autocapture) + `app/error.js` + `app/global-error.js` + server routes via `captureServerException` | `page`, `digest`, `route`, `distinctId` |

### Known gaps (features don't exist yet, so these events have no call site)
- **Order Cancelled** — `Myorders.jsx` has no cancel button and the Order API
  has no cancel endpoint.
- **Review Submitted/Updated/Deleted** — the product page only *displays*
  approved reviews; there's no submission/edit/delete form anywhere in the
  client app, even though `POST /api/reviews` exists server-side.

Both event types are already defined in `src/types/analytics.ts` — wiring
them up is just a matter of calling `analytics.track(...)` from the new UI
once it's built, following the pattern of any other event in this table.

### API failures — extending server-side capture to more routes
`captureServerException` (`src/lib/analytics/posthog-server.ts`) is wired
into the highest-value routes today: `orders`, `cart/apply-coupon`,
`auth/login`, `auth/register`, `reviews`, `products`. To add it to any other
API route, add one import and one line inside the existing `catch` block:
```js
import { captureServerException } from "@/lib/analytics/posthog-server";
// ...
} catch (error) {
  console.error("[my-route]", error.message);
  captureServerException(error, { route: "my-route", distinctId: userId });
  return NextResponse.json({ error: "..." }, { status: 500 });
}
```

## Naming conventions
- Events: `Title Case`, verb-noun or noun-verb (`Product Viewed`, `Added to
  Cart`) — matches PostHog's own convention for human-readable event names.
- Properties: `snake_case` (`product_id`, `cart_value`) — matches PostHog's
  own reserved properties (`$current_url`, `$referrer`, etc.) so custom and
  built-in properties read consistently in PostHog's UI.
- Every event name and its property shape is declared once in
  `AnalyticsEventMap` (`src/types/analytics.ts`) — this is the single source
  of truth; there is no second list to keep in sync.

## Adding a new event
1. Add the event name + a property interface to `AnalyticsEventMap` in
   `src/types/analytics.ts`.
2. Call `analytics.track("Your Event", { ... })` from the call site.
3. Add a row to the event table above.

## Debugging events locally
- With `NODE_ENV=development` and a valid `NEXT_PUBLIC_POSTHOG_KEY`,
  `posthog.debug()` runs automatically (`posthog-client.ts`'s `loaded`
  callback) — every captured event is logged to the browser console as it
  fires.
- PostHog's **Activity → Live events** view (in your project dashboard)
  shows events within a few seconds of being captured, including from
  localhost, as long as `NEXT_PUBLIC_POSTHOG_KEY` points at a real project.
- If events aren't appearing: check the Network tab for requests to
  `/ingest/*` — a 404 there means the `rewrites()` in `next.config.mjs`
  isn't matching (check `NEXT_PUBLIC_POSTHOG_INGEST_HOST` is set), a CORS/500
  error means the upstream region host is wrong for your project.

## Testing locally
1. Set `.env` PostHog vars to a **dev/staging** PostHog project (never test
   against production).
2. `npm run dev`, open the browser console (debug logging is on).
3. Walk the funnel: home → `/shop` (try a category + search) → a product
   page → Add to Cart → `/cart` (try a coupon code) → `/checkout` → place a
   COD order → confirm you land on `/order-success` and the console showed
   exactly one `Payment Successful`/`Order Completed` pair.
4. Log in and out; confirm exactly one `identify` and one `reset` fire per
   action (check the PostHog person's properties include email/name/phone/
   role/created_at).
5. Visit a nonexistent URL to confirm `404 Viewed` fires; temporarily
   `throw new Error("test")` in a page to confirm `error.js` fires
   `captureException`.
6. Open **Session Replay** in PostHog for your test session and confirm
   every input (email, password, address fields, etc.) appears masked.

## Production deployment checklist
- [ ] `NEXT_PUBLIC_POSTHOG_KEY` / `POSTHOG_SERVER_KEY` point at the
      **production** PostHog project (not the dev one used for testing).
- [ ] `NEXT_PUBLIC_POSTHOG_INGEST_HOST` / `NEXT_PUBLIC_POSTHOG_ASSETS_HOST`
      match your project's region (`us` vs `eu`).
- [ ] Confirm `/ingest/*` requests succeed in production (Network tab or
      PostHog's live events view) — this depends on the `rewrites()` in
      `next.config.mjs` reaching the internet from your hosting provider.
- [ ] Session recording masking verified in a real production session
      (`maskAllInputs: true` in `posthog-client.ts`) — no passwords, address
      fields, or payment info visible in a replay.
- [ ] Spot-check a few captured events in PostHog to confirm no PII beyond
      what's explicitly listed in the event table above (no passwords, JWTs,
      cookies, or raw addresses beyond city/state) is being sent.
- [ ] `npm run build` passes (TypeScript compiles cleanly for the analytics
      module; the rest of the app remains plain JS/JSX, untouched by
      type-checking).
