import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";
import { DecodedJwtPayload } from "./types/authTypes";

// Only define routes restricted to certain roles
const protectedRoutes: Record<string, string[]> = {
  host: ["/host-dashboard", "/host-dashboard/create-listing-add", "/host-dashboard/listed-properties"],
};

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("refreshtoken")?.value;
  const { pathname } = request.nextUrl;

  // Step 1: If no token and accessing protected routes → redirect
  if (!accessToken) {
    for (const routes of Object.values(protectedRoutes)) {
      if (routes.some((route) => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
    return NextResponse.next(); // allow access to public/guest routes
  }

  let decoded: DecodedJwtPayload;
  try {
    decoded = jwtDecode<DecodedJwtPayload>(accessToken);
  } catch {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const userRole = decoded.role;

  // Step 2: Only block users with insufficient role
  // e.g., guest trying to access host routes
  const hostOnlyRoutes = protectedRoutes["host"];
  if (
    userRole === "guest" &&
    hostOnlyRoutes.some((route) => pathname.startsWith(route))
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Step 3: Optional: Redirect host from "/" to dashboard
  // if (pathname === "/" && userRole === "host") {
  //   return NextResponse.redirect(new URL("/host-dashboard", request.url));
  // }
  if (
    pathname === "/" &&
    userRole === "host" &&
    !request.headers.get("referer")
  ) {
    return NextResponse.redirect(new URL("/host-dashboard", request.url));
  }

  return NextResponse.next();
}
