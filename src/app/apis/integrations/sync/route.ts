import { CORE_INTEGRATIONS_LIST } from "@routes/core.api";
import { methods, RouteService } from "@services/route-service";

export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  return RouteService({
    request,
    method: methods.POST,
    endpoint: CORE_INTEGRATIONS_LIST,
    handler: async (body: any) => ({
      success: true,
      id: body?.id,
      lastSync: new Date().toISOString(),
      syncedRecords: 12,
    }),
  });
}
