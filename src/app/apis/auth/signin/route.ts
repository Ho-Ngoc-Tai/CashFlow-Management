import { CORE_AUTH_LOGIN } from "@routes/core.api";
import { methods, RouteService } from "@services/route-service";
import { getDefaultCookieOptions } from "@commons/utils/cookies";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  const cookieStore = await cookies();
  const tokenCookieName = process.env.COOKIE_TOKEN_NAME || "flowsync_token";

  // Simulate or proxy login
  const response = await RouteService({
    request,
    method: methods.POST,
    endpoint: CORE_AUTH_LOGIN,
    handler: async (body: any) => {
      // In dev simulation, generate mock JWT
      const mockToken = "mock_jwt_token_flowsync_enterprise_cfo_2026";
      cookieStore.set(tokenCookieName, mockToken, getDefaultCookieOptions());
      return {
        user: {
          id: "usr_001",
          email: body?.email || "minh.anh@flowsync.enterprise",
          fullName: "Trần Minh Anh",
          role: "CFO",
          companyName: "FlowSync Enterprise VN",
          avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDIhaDJyMO0A9nau9f62JLydrBkwmXZUsjer3CTU4F_CTGFASc2VLGrO77tmhqFY3n1RyCZm5ySe7dz8-Qtqyal7qc1KEF9ISq1petCrI_QPDRo72KUF1ZgYocXEzNe7z1hT1jALrDAS0k6eWnW4eYo5jEvAjFK4S675SxSzOiFfbKTaTThTA8LGhDXXqJrT6nXWGE-yWFvQ7cbmzXk3wKfYv4RZYxDc8WrGl4ZJdNKTx4qBf9DGNDt",
        },
        token: mockToken,
      };
    },
  });

  return response;
}
