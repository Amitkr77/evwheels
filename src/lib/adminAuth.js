import { verifyToken } from "@/lib/jwt";
import User from "@/models/User";
import { connectDB } from "@/lib/db";

// Fast path: verify JWT only (no DB hit). Role is embedded in the token.
// Use verifyAdminStrict for sensitive mutations that need a live DB check.
export async function verifyAdmin(req) {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;
  const decoded = await verifyToken(token);
  if (!decoded || decoded.role !== "admin") return null;
  return decoded;
}

// Strict version: confirms the admin still exists and hasn't been deactivated.
// Use for: delete operations, role changes, financial mutations.
export async function verifyAdminStrict(req) {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;
  const decoded = await verifyToken(token);
  if (!decoded || decoded.role !== "admin") return null;

  await connectDB();
  const user = await User.findById(decoded.id).select("role").lean();
  if (!user || user.role !== "admin") return null;
  return decoded;
}