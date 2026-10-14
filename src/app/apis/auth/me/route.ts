import { CORE_AUTH_ME } from "@routes/core.api";
import { methods, RouteService } from "@services/route-service";

export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  return RouteService({
    request,
    method: methods.GET,
    endpoint: CORE_AUTH_ME,
    handler: async () => ({
      id: "usr_001",
      email: "minh.anh@flowsync.enterprise",
      fullName: "Trần Minh Anh",
      role: "CFO",
      companyName: "FlowSync Enterprise VN",
      avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDIhaDJyMO0A9nau9f62JLydrBkwmXZUsjer3CTU4F_CTGFASc2VLGrO77tmhqFY3n1RyCZm5ySe7dz8-Qtqyal7qc1KEF9ISq1petCrI_QPDRo72KUF1ZgYocXEzNe7z1hT1jALrDAS0k6eWnW4eYo5jEvAjFK4S675SxSzOiFfbKTaTThTA8LGhDXXqJrT6nXWGE-yWFvQ7cbmzXk3wKfYv4RZYxDc8WrGl4ZJdNKTx4qBf9DGNDt",
    }),
  });
}
