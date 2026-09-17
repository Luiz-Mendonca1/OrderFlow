import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("@app:token")?.value;
  const { pathname } = request.nextUrl;

  const isPublicRoute = pathname === "/login" || pathname === "/register";
  const isPrivateRoute =
    pathname === "/dashboard" ||
    pathname === "/categories" ||
    pathname === "/products";

  if (!token && isPrivateRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};