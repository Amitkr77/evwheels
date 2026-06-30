import { SignJWT, jwtVerify } from "jose";

const SEVEN_DAYS_SECONDS = 60 * 60 * 24 * 7;

// Cache the CryptoKey — importKey is ~1ms; run it once per process.
let _key = null;
async function getKey(usage) {
  // Edge (middleware) and Node runtimes both support Web Crypto.
  if (_key) return _key;
  const raw = new TextEncoder().encode(process.env.JWT_SECRET);
  _key = await crypto.subtle.importKey(
    "raw",
    raw,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
  return _key;
}

/**
 * Sign a JWT with the app's secret.
 * @param {object} payload - fields to embed (id, role, name, email, …)
 * @returns {Promise<string>} signed JWT string
 */
export async function signToken(payload) {
  const key = await getKey();
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SEVEN_DAYS_SECONDS}s`)
    .sign(key);
}

/**
 * Verify a JWT and return its payload, or null if invalid/expired.
 * @param {string} token
 * @returns {Promise<object|null>}
 */
export async function verifyToken(token) {
  try {
    const key = await getKey();
    const { payload } = await jwtVerify(token, key);
    return payload;
  } catch {
    return null;
  }
}
