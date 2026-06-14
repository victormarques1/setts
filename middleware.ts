import NextAuth from "next-auth";

import { authConfig } from "@/lib/auth.config";

const PROTECTED_PREFIXES = [
  "/workouts",
  "/exercises",
  "/sessions",
  "/progress",
  "/history",
] as const;

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

const { auth } = NextAuth(authConfig);

export default auth((request) => {
  const { pathname } = request.nextUrl;
  const isLoggedIn = !!request.auth;

  if (isProtectedPath(pathname) && !isLoggedIn) {
    const loginUrl = new URL("/login", request.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return Response.redirect(loginUrl);
  }

  if ((pathname === "/login" || pathname === "/register") && isLoggedIn) {
    return Response.redirect(new URL("/workouts", request.nextUrl.origin));
  }
});

export const config = {
  matcher: [
    "/workouts/:path*",
    "/exercises/:path*",
    "/sessions/:path*",
    "/progress/:path*",
    "/history/:path*",
    "/login",
    "/register",
  ],
};
