import { verifyToken } from "@/lib/jwt";

export async function getUserId(req) {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;
  const decoded = await verifyToken(token);
  return decoded?.id ?? null;
}