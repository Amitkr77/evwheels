import { verifyToken } from "@/lib/jwt";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

// Fast path: verify JWT only (no DB hit).
export async function getUserId(req) {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;
  const decoded = await verifyToken(token);
  return decoded?.id ?? null;
}

// Strict path: also confirms the token's embedded tokenVersion still matches
// the user's current one, so a token issued before a password reset is
// rejected even though it hasn't expired yet. Use for order placement and
// other sensitive mutations — not for cheap/frequent reads.
export async function getUserIdStrict(req) {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;
  const decoded = await verifyToken(token);
  if (!decoded?.id) return null;

  await connectDB();
  const user = await User.findById(decoded.id).select("tokenVersion").lean();
  if (!user || (decoded.tokenVersion ?? 0) !== (user.tokenVersion ?? 0)) return null;

  return decoded.id;
}
