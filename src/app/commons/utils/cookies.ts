export interface CookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
  path?: string;
  maxAge?: number;
  domain?: string;
}

export function getDefaultCookieOptions(isProduction = process.env.NODE_ENV === "production"): CookieOptions {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    domain: process.env.COOKIE_DOMAIN || undefined,
  };
}

export function getRefreshTokenCookieOptions(isProduction = process.env.NODE_ENV === "production"): CookieOptions {
  return {
    ...getDefaultCookieOptions(isProduction),
    maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
  };
}
