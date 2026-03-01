import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const pathname = req.nextUrl.pathname;

  // Only protect specific routes
  // if (
  //   pathname.startsWith("/cart") ||
  //   pathname.startsWith("/checkout") ||
  //   pathname.startsWith("/admin")
  // ) {
  //   if (!token) {
  //     return NextResponse.redirect(new URL("/login", req.url));
  //   }

  //   try {
  //     const decoded = jwt.verify(token, process.env.JWT_SECRET);

  //     // Admin protection
  //     if (pathname.startsWith("/admin") && decoded.role !== "admin") {
  //       return NextResponse.redirect(new URL("/", req.url));
  //     }

  //     return NextResponse.next();
  //   } catch (error) {
  //     return NextResponse.redirect(new URL("/login", req.url));
  //   }
  // }

  // Allow all other routes
  return NextResponse.next();
}
