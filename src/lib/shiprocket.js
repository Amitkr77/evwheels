/**
 * Shiprocket API client
 *
 * Handles authentication with module-level token caching (token valid ~24h),
 * auto-refreshes 5 minutes before expiry, and exposes typed wrappers for every
 * action used across the admin shipping workflow.
 *
 * All public methods return { success: boolean, data?, error?: string }.
 */

const BASE_URL =
  process.env.SHIPROCKET_API_BASE_URL || "https://apiv2.shiprocket.in/v1/external";

// Module-level cache — survives across requests within the same Node process.
// In a serverless/edge environment each cold start re-authenticates once.
let _cachedToken = null;
let _tokenExpiry = 0; // Unix ms

async function getToken() {
  if (_cachedToken && Date.now() < _tokenExpiry - 5 * 60 * 1000) {
    return _cachedToken;
  }

  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Shiprocket auth failed (${res.status}): ${text}`);
  }

  const json = await res.json();
  if (!json.token) throw new Error("Shiprocket auth response missing token");

  _cachedToken = json.token;
  // Shiprocket tokens last 24 hours
  _tokenExpiry = Date.now() + 24 * 60 * 60 * 1000;
  return _cachedToken;
}

/** Invalidate cached token (called on 401 so the next request re-authenticates). */
function invalidateToken() {
  _cachedToken = null;
  _tokenExpiry = 0;
}

/**
 * Core HTTP wrapper. On 401 it invalidates the token and retries once.
 */
async function call(method, path, body, _retry = false) {
  let token;
  try {
    token = await getToken();
  } catch (err) {
    return { success: false, error: err.message };
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // Token expired mid-session — refresh once
  if (res.status === 401 && !_retry) {
    invalidateToken();
    return call(method, path, body, true);
  }

  let json;
  try {
    json = await res.json();
  } catch {
    json = {};
  }

  if (!res.ok) {
    return {
      success: false,
      error: json.message || json.error || `Shiprocket HTTP ${res.status}`,
      data: json,
    };
  }

  return { success: true, data: json };
}

// ─── Order creation ──────────────────────────────────────────────────────────

/**
 * Create a Shiprocket order from an EVWheels Order document + the owner's User doc.
 *
 * Maps our schema to Shiprocket's adhoc order payload. Package dimensions
 * default to 10×10×10 cm / 0.5 kg — these are adequate for most cycle
 * accessories; update Product.weight when you have real weights.
 */
export async function createShiprocketOrder(order, user) {
  const addr = order.shippingAddress;

  const orderItems = order.items.map((item) => ({
    name: item.name,
    sku: item.product?.toString() || "PROD",
    units: item.quantity,
    selling_price: String(item.price),
    discount: "0",
    tax: "12",
    hsn: "",
  }));

  const payload = {
    order_id: order.id || order._id.toString(),
    order_date: new Date(order.createdAt).toISOString().replace("T", " ").slice(0, 19),
    pickup_location: "Primary",

    billing_customer_name: addr.fullName,
    billing_last_name: "",
    billing_address: addr.street,
    billing_address_2: "",
    billing_city: addr.city,
    billing_pincode: addr.postalCode,
    billing_state: addr.state,
    billing_country: addr.country || "India",
    billing_email: user.email || "",
    billing_phone: addr.phone,
    billing_isd_code: "91",

    shipping_is_billing: 1,

    order_items: orderItems,
    payment_method: order.paymentMethod === "COD" ? "COD" : "Prepaid",
    shipping_charges: order.shippingAmount || 0,
    giftwrap_charges: 0,
    transaction_charges: 0,
    total_discount: order.discountAmount || 0,
    sub_total: order.totalAmount,

    // Default package dimensions — 10×10×10 cm, 0.5 kg
    length: 10,
    breadth: 10,
    height: 10,
    weight: 0.5,
  };

  return call("POST", "/orders/create/adhoc", payload);
}

// ─── Courier & AWB ───────────────────────────────────────────────────────────

/**
 * Fetch recommended couriers for a shipment, optionally filtered by serviceability.
 * Returns Shiprocket's `data.available_courier_companies` list.
 */
export async function getAvailableCouriers(shipmentId) {
  return call("GET", `/courier/serviceability/?shipment_id=${shipmentId}&order_id=&cod=0`);
}

/**
 * Assign a courier company to generate the AWB code.
 * courierCompanyId should come from getAvailableCouriers response.
 */
export async function assignAWB(shipmentId, courierCompanyId) {
  return call("POST", "/courier/assign/awb", {
    shipment_id: [String(shipmentId)],
    courier_id: String(courierCompanyId),
  });
}

// ─── Pickup ──────────────────────────────────────────────────────────────────

/** Schedule a pickup for one or more shipment IDs. */
export async function requestPickup(shipmentIds) {
  const ids = Array.isArray(shipmentIds) ? shipmentIds : [shipmentIds];
  return call("POST", "/courier/generate/pickup", { shipment_id: ids.map(String) });
}

// ─── Label & Invoice ─────────────────────────────────────────────────────────

/** Generate a shipping label PDF URL for one or more shipment IDs. */
export async function generateLabel(shipmentIds) {
  const ids = Array.isArray(shipmentIds) ? shipmentIds : [shipmentIds];
  return call("POST", "/courier/generate/label", { shipment_id: ids.map(String) });
}

/** Generate an invoice PDF URL for one or more Shiprocket order IDs. */
export async function generateInvoice(shiprocketOrderIds) {
  const ids = Array.isArray(shiprocketOrderIds) ? shiprocketOrderIds : [shiprocketOrderIds];
  return call("POST", "/orders/print/invoice", { ids: ids.map(String) });
}

// ─── Tracking ────────────────────────────────────────────────────────────────

/** Track by AWB code — returns real-time courier scan events. */
export async function trackByAWB(awbCode) {
  return call("GET", `/courier/track/awb/${awbCode}`);
}

/** Fetch Shiprocket order detail (includes latest status + etd). */
export async function getOrderDetail(shiprocketOrderId) {
  return call("GET", `/orders/show/${shiprocketOrderId}`);
}

// ─── Cancellation & Return ───────────────────────────────────────────────────

/** Cancel Shiprocket orders (before AWB is assigned). */
export async function cancelOrders(shiprocketOrderIds) {
  const ids = Array.isArray(shiprocketOrderIds) ? shiprocketOrderIds : [shiprocketOrderIds];
  return call("POST", "/orders/cancel", { ids: ids.map(String) });
}

/**
 * Create a reverse/return shipment.
 * The pickup address is the customer's address; the delivery address is our
 * warehouse at Naubatpur, Patna.
 */
export async function createReturnOrder(order, user, reason = "Customer return request") {
  const addr = order.shippingAddress;

  const items = order.items.map((item) => ({
    name: item.name,
    sku: item.product?.toString() || "PROD",
    units: item.quantity,
    selling_price: String(item.price),
    qc_enable: 0,
  }));

  return call("POST", "/orders/create/return", {
    order_id: `RET-${order.id || order._id.toString()}`,
    order_date: new Date().toISOString().split("T")[0],
    channel_id: "",

    pickup_customer_name: addr.fullName,
    pickup_last_name: "",
    pickup_address: addr.street,
    pickup_address_2: "",
    pickup_city: addr.city,
    pickup_state: addr.state,
    pickup_country: addr.country || "India",
    pickup_pincode: addr.postalCode,
    pickup_email: user.email || "",
    pickup_phone: addr.phone,
    pickup_isd_code: "91",

    shipping_customer_name: "EVWheels",
    shipping_last_name: "",
    shipping_address: "Naubatpur",
    shipping_city: "Patna",
    shipping_country: "India",
    shipping_pincode: "801109",
    shipping_state: "Bihar",
    shipping_email: process.env.ADMIN_EMAIL || process.env.EMAIL_USER || "",
    shipping_phone: "8298922623",
    shipping_isd_code: "91",

    order_items: items,
    payment_method: "Prepaid",
    sub_total: order.totalAmount,
    length: 10,
    breadth: 10,
    height: 10,
    weight: 0.5,
    return_reason: reason,
  });
}

// ─── Rates ───────────────────────────────────────────────────────────────────

/**
 * Check shipping serviceability and estimated rates between two pincodes.
 * weightKg — package weight in kg (default 0.5)
 * cod — whether the order is COD
 */
export async function getShippingRates({ pickupPincode, deliveryPincode, weightKg = 0.5, cod = false }) {
  let token;
  try {
    token = await getToken();
  } catch (err) {
    return { success: false, error: err.message };
  }

  const qs = new URLSearchParams({
    pickup_postcode: String(pickupPincode),
    delivery_postcode: String(deliveryPincode),
    weight: String(weightKg),
    cod: cod ? "1" : "0",
  });

  const res = await fetch(`${BASE_URL}/courier/serviceability/?${qs}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  let json;
  try { json = await res.json(); } catch { json = {}; }

  // Shiprocket uses non-standard HTTP codes:
  //   200 = couriers found
  //   422 = "no courier partner found" — this is a valid (not-serviceable) result, not a failure
  //   401/403 = auth problem — real error
  //   5xx = server problem — real error
  if (res.status === 401 || res.status === 403) {
    invalidateToken();
    return { success: false, error: json.message || `Shiprocket auth failed (${res.status})` };
  }
  if (res.status >= 500) {
    return { success: false, error: json.message || `Shiprocket server error (${res.status})` };
  }

  // 200 or 4xx (e.g. 422 no-couriers): both are valid — caller inspects companies list
  return { success: true, data: json, httpStatus: res.status };
}

// ─── Webhook verification ─────────────────────────────────────────────────────

import crypto from "crypto";

/**
 * Verify the HMAC-SHA256 signature that Shiprocket attaches to webhook requests.
 * Returns true if valid, false otherwise.
 *
 * Shiprocket signs the raw request body with the webhook secret
 * and puts the hex digest in the `x-shiprocket-signature` header.
 */
export function verifyWebhookSignature(rawBody, signature) {
  const secret = process.env.SHIPROCKET_WEBHOOK_SECRET;
  if (!secret) return false;
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature || ""));
}
