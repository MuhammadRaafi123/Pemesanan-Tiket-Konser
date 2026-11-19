import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoggedIn = request.cookies.get("tixora_session")?.value === "1";
  const role = request.cookies.get("tixora_role")?.value;

  if (pathname === "/" || pathname === "/landing") {
    if (isLoggedIn) {
      return NextResponse.redirect(
        new URL(role === "admin" ? "/admin" : "/home", request.url),
      );
    }
    return NextResponse.next();
  }

  if (pathname === "/home" || pathname.startsWith("/home/")) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/home", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/landing", "/home/:path*", "/admin/:path*"],
};
