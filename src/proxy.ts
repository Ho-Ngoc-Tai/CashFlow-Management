import { AUTH_SIGNIN_PAGE, HOME_PAGE } from "@routes/web";
import { WEB_PRIVATE_ROUTE } from "@routes/web.private";
import { NextRequest, NextResponse } from "next/server";

function attachSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https: blob:; connect-src 'self' https: ws: wss:;"
  );
  return response;
}

export async function proxy(req: NextRequest): Promise<NextResponse> {
  const { pathname } = req.nextUrl;
  const cookieName = process.env.COOKIE_TOKEN_NAME || "flowsync_token";
  const token = req.cookies.get(cookieName)?.value;
  const isAuth = Boolean(token);

  // If authenticated user visits sign-in page, redirect to home/dashboard
  if (pathname === AUTH_SIGNIN_PAGE && isAuth) {
    return attachSecurityHeaders(NextResponse.redirect(new URL(HOME_PAGE, req.nextUrl.origin)));
  }

  // If unauthenticated user visits protected routes, redirect to sign-in
  const isPrivateRoute = WEB_PRIVATE_ROUTE.some((route) =>
    route === "/" ? pathname === "/" : pathname.startsWith(route)
  );

  if (isPrivateRoute && !isAuth) {
    // Note: Allow development preview if cookie is bypass or for initial load
    const bypassAuth = process.env.NODE_ENV === "development" && req.cookies.get("bypass_auth")?.value === "true";
    if (!bypassAuth) {
      const loginUrl = new URL(AUTH_SIGNIN_PAGE, req.nextUrl.origin);
      loginUrl.searchParams.set("redirect", pathname);
      return attachSecurityHeaders(NextResponse.redirect(loginUrl));
    }
  }

  return attachSecurityHeaders(NextResponse.next());
}
