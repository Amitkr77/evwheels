import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const protectedRoutes = ["/cart", "/checkout", "/profile", "/order-success"];
const adminRoutes = ["/admin/dashboard"];
const authRoutes = ["/account/login", "/account/register", "/admin/login"];

function getToken(req) {
  return req.cookies.get("token")?.value;
}

async function verifyToken(token) {
  try {
    const keyData = new TextEncoder().encode(process.env.JWT_SECRET);
    // Import as CryptoKey so jose skips its minimum-length check
    // (jose v5 rejects Uint8Array keys shorter than 32 bytes for HS256)
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );
    const { payload } = await jwtVerify(token, cryptoKey);
    return payload;
  } catch {
    return null;
  }
}

function matches(pathname, routes) {
  return routes.some((route) => pathname.startsWith(route));
}

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = getToken(req);
  const decoded = token ? await verifyToken(token) : null;

  const isAdminRoute = matches(pathname, adminRoutes);
  const isProtectedRoute = matches(pathname, protectedRoutes);
  const isAuthRoute = matches(pathname, authRoutes);

  if (isAdminRoute) {
    if (!decoded) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    if (decoded.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  if (isProtectedRoute) {
    if (!decoded) {
      const loginUrl = new URL("/account/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  if (isAuthRoute && decoded) {
    const redirectTo = decoded.role === "admin" ? "/admin/dashboard" : "/";
    return NextResponse.redirect(new URL(redirectTo, req.url));
  }

  if (token && !decoded) {
    const res = NextResponse.next();
    res.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(0),
    });
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|manifest)$).*)",
  ],
};
