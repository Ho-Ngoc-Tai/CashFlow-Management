import { CORE_INTEGRATIONS_LIST } from "@routes/core.api";
import { methods, RouteService, CacheStrategy } from "@services/route-service";

export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  return RouteService({
    request,
    method: methods.GET,
    endpoint: CORE_INTEGRATIONS_LIST,
    cache: CacheStrategy.SHORT,
    handler: async () => [
      {
        id: "conn_01",
        provider: "VIETCOMBANK",
        displayName: "Vietcombank Open Banking Corporate",
        type: "OPEN_BANKING",
        status: "CONNECTED",
        lastSync: "2026-10-14T07:18:00Z",
        dailyTransactionsCount: 184,
      },
      {
        id: "conn_02",
        provider: "TECHCOMBANK",
        displayName: "Techcombank FastConnect API",
        type: "OPEN_BANKING",
        status: "CONNECTED",
        lastSync: "2026-10-14T07:12:00Z",
        dailyTransactionsCount: 92,
      },
      {
        id: "conn_03",
        provider: "MB_BANK",
        displayName: "MB Bank Biz Connect",
        type: "OPEN_BANKING",
        status: "CONNECTED",
        lastSync: "2026-10-14T06:50:00Z",
        dailyTransactionsCount: 47,
      },
      {
        id: "conn_04",
        provider: "MOMO",
        displayName: "MoMo Business IPN Webhook",
        type: "PAYMENT_GATEWAY",
        status: "CONNECTED",
        lastSync: "2026-10-14T07:19:30Z",
        dailyTransactionsCount: 520,
      },
      {
        id: "conn_05",
        provider: "VNPAY",
        displayName: "VNPay QR Merchant Gateway",
        type: "PAYMENT_GATEWAY",
        status: "DISCONNECTED",
        lastSync: "2026-10-12T14:00:00Z",
        dailyTransactionsCount: 0,
        errorDetail: "Chứng thư bảo mật mTLS hết hạn cần làm mới",
      },
    ],
  });
}
