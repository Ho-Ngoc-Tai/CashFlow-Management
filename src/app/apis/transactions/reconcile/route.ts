import { CORE_TRANSACTION_RECONCILE } from "@routes/core.api";
import { methods, RouteService } from "@services/route-service";

export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  return RouteService({
    request,
    method: methods.POST,
    endpoint: CORE_TRANSACTION_RECONCILE,
    handler: async (body: any) => {
      return {
        success: true,
        reconciledCount: 6,
        totalAvailableBalance: 142850400000,
        txId: body?.txId,
        invoiceId: body?.invoiceId,
        reconciledAt: new Date().toISOString(),
      };
    },
  });
}
