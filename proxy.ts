import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/budget") {
    // Read last visited budget path if available
    const lastVisited = request.cookies.get("last-visited-budget")?.value;

    if (lastVisited) {
      return NextResponse.redirect(new URL(lastVisited, request.url));
    }

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    return NextResponse.redirect(
      new URL(`/budget/${year}/${month}`, request.url)
    );
  }

  // Save last visited budget path in cookie
  const response = NextResponse.next();
  if (pathname.startsWith("/budget/")) {
    response.cookies.set("last-visited-budget", pathname);
  }
  return response;
}

export const config = {
  matcher: "/budget/:path*",
};
