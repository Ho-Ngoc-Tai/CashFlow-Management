import { CORE_CASHFLOW_TREND } from "@routes/core.api";
import { methods, RouteService, CacheStrategy } from "@services/route-service";

export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  return RouteService({
    request,
    method: methods.GET,
    endpoint: CORE_CASHFLOW_TREND,
    cache: CacheStrategy.SHORT,
    handler: async () => [
      { date: "01/10", inflow: 4200000000, outflow: 1800000000, net: 2400000000, balance: 132000000000 },
      { date: "03/10", inflow: 6800000000, outflow: 2900000000, net: 3900000000, balance: 135900000000 },
      { date: "05/10", inflow: 5100000000, outflow: 4500000000, net: 600000000, balance: 136500000000 },
      { date: "07/10", inflow: 9400000000, outflow: 3200000000, net: 6200000000, balance: 142700000000 },
      { date: "09/10", inflow: 7300000000, outflow: 5800000000, net: 1500000000, balance: 144200000000 },
      { date: "11/10", inflow: 11200000000, outflow: 4100000000, net: 7100000000, balance: 151300000000 },
      { date: "13/10", inflow: 4900000000, outflow: 13350000000, net: -8450000000, balance: 142850000000 },
    ],
  });
}
