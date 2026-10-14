import { CORE_CASHFLOW_SUMMARY } from "@routes/core.api";
import { methods, RouteService, CacheStrategy } from "@services/route-service";

export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  return RouteService({
    request,
    method: methods.GET,
    endpoint: CORE_CASHFLOW_SUMMARY,
    cache: CacheStrategy.SHORT,
    handler: async () => ({
      totalAvailableBalance: 142850400000,
      netCashFlowToday: 3450000000,
      netCashFlowMonth: 28400000000,
      inflowMonth: 84600000000,
      outflowMonth: 56200000000,
      runwayDays: 245,
      burnRateMonth: 18700000000,
      bankAccounts: [
        {
          id: "vcb_01",
          bankName: "Vietcombank Hội sở",
          bankCode: "VCB",
          accountNumber: "0011004589999",
          accountHolder: "CTY CP FLOWSYNC VN",
          balance: 78500200000,
          currency: "VND",
          lastSyncAt: new Date().toISOString(),
          status: "ACTIVE",
        },
        {
          id: "tcb_01",
          bankName: "Techcombank Chi nhánh Nam Kỳ",
          bankCode: "TCB",
          accountNumber: "19034567888019",
          accountHolder: "CTY CP FLOWSYNC VN",
          balance: 42150000000,
          currency: "VND",
          lastSyncAt: new Date().toISOString(),
          status: "ACTIVE",
        },
        {
          id: "mbb_01",
          bankName: "MB Bank Khối Doanh nghiệp",
          bankCode: "MBB",
          accountNumber: "8888099992222",
          accountHolder: "CTY CP FLOWSYNC VN",
          balance: 18200200000,
          currency: "VND",
          lastSyncAt: new Date().toISOString(),
          status: "ACTIVE",
        },
        {
          id: "momo_01",
          bankName: "MoMo Merchant Gateway",
          bankCode: "MOMO",
          accountNumber: "MERCHANT-849091",
          accountHolder: "FLOWSYNC STOREFRONT",
          balance: 4000000000,
          currency: "VND",
          lastSyncAt: new Date().toISOString(),
          status: "ACTIVE",
        },
      ],
    }),
  });
}
