import { CORE_AUTH_LOGOUT } from "@routes/core.api";
import { methods, RouteService } from "@services/route-service";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  const cookieStore = await cookies();
  const tokenCookieName = process.env.COOKIE_TOKEN_NAME || "flowsync_token";
  const refreshTokenCookieName = process.env.COOKIE_REFRESH_TOKEN_NAME || "flowsync_rtoken";

  cookieStore.delete(tokenCookieName);
  cookieStore.delete(refreshTokenCookieName);

  return RouteService({
    request,
    method: methods.POST,
    endpoint: CORE_AUTH_LOGOUT,
    handler: async () => ({ message: "Signed out successfully" }),
  });
}
