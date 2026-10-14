import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { BaseReducerState, LOADING_STATUS, FetchDataArgs } from "@interfaces/base";
import { CashFlowSummary, CashFlowTrendPoint } from "@interfaces/cashflow";

export interface CashFlowState extends BaseReducerState<CashFlowTrendPoint, FetchDataArgs> {
  summary: CashFlowSummary | null;
  timeRange: "today" | "week" | "month";
  isReconciling: boolean;
}

const mockSummary: CashFlowSummary = {
  totalAvailableBalance: 142850400000, // 142.85 tỷ VNĐ
  netCashFlowToday: 3450000000,        // +3.45 tỷ VNĐ
  netCashFlowMonth: 28400000000,       // +28.4 tỷ VNĐ
  inflowMonth: 84600000000,            // 84.6 tỷ VNĐ
  outflowMonth: 56200000000,           // 56.2 tỷ VNĐ
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
};

const mockTrend: CashFlowTrendPoint[] = [
  { date: "01/10", inflow: 4200000000, outflow: 1800000000, net: 2400000000, balance: 132000000000 },
  { date: "03/10", inflow: 6800000000, outflow: 2900000000, net: 3900000000, balance: 135900000000 },
  { date: "05/10", inflow: 5100000000, outflow: 4500000000, net: 600000000, balance: 136500000000 },
  { date: "07/10", inflow: 9400000000, outflow: 3200000000, net: 6200000000, balance: 142700000000 },
  { date: "09/10", inflow: 7300000000, outflow: 5800000000, net: 1500000000, balance: 144200000000 },
  { date: "11/10", inflow: 11200000000, outflow: 4100000000, net: 7100000000, balance: 151300000000 },
  { date: "13/10", inflow: 4900000000, outflow: 13350000000, net: -8450000000, balance: 142850000000 },
];

const initialState: CashFlowState = {
  status: LOADING_STATUS.IDLE,
  items: mockTrend,
  total: mockTrend.length,
  params: { page: 1, pageSize: 30 },
  summary: mockSummary,
  timeRange: "today",
  isReconciling: false,
  error: null,
};

export const cashflowSlice = createSlice({
  name: "cashflow",
  initialState,
  reducers: {
    getCashflowSummaryAction: (state) => {
      state.status = LOADING_STATUS.LOADING;
    },
    getCashflowSummarySuccess: (state, action: PayloadAction<CashFlowSummary>) => {
      state.status = LOADING_STATUS.SUCCESS;
      state.summary = action.payload;
    },
    getCashflowSummaryFailure: (state, action: PayloadAction<unknown>) => {
      state.status = LOADING_STATUS.ERROR;
      state.error = action.payload;
    },
    getCashflowTrendAction: (state, action: PayloadAction<{ range: "today" | "week" | "month" }>) => {
      state.status = LOADING_STATUS.LOADING;
      state.timeRange = action.payload.range;
    },
    getCashflowTrendSuccess: (state, action: PayloadAction<CashFlowTrendPoint[]>) => {
      state.status = LOADING_STATUS.SUCCESS;
      state.items = action.payload;
      state.total = action.payload.length;
    },
    setTimeRangeAction: (state, action: PayloadAction<"today" | "week" | "month">) => {
      state.timeRange = action.payload;
    },
    triggerReconcileAction: (state) => {
      state.isReconciling = true;
    },
    triggerReconcileSuccess: (state, action: PayloadAction<{ updatedBalance: number }>) => {
      state.isReconciling = false;
      if (state.summary) {
        state.summary.totalAvailableBalance = action.payload.updatedBalance;
      }
    },
    updateBalanceRealtimeAction: (
      state,
      action: PayloadAction<{ bankId: string; delta: number }>
    ) => {
      if (state.summary) {
        state.summary.totalAvailableBalance += action.payload.delta;
        const targetBank = state.summary.bankAccounts.find((b) => b.id === action.payload.bankId);
        if (targetBank) {
          targetBank.balance += action.payload.delta;
          targetBank.lastSyncAt = new Date().toISOString();
        }
      }
    },
  },
});

export const {
  getCashflowSummaryAction,
  getCashflowSummarySuccess,
  getCashflowSummaryFailure,
  getCashflowTrendAction,
  getCashflowTrendSuccess,
  setTimeRangeAction,
  triggerReconcileAction,
  triggerReconcileSuccess,
  updateBalanceRealtimeAction,
} = cashflowSlice.actions;

export const cashflowSelector = createSelector(
  (state: { cashflow: CashFlowState }) => state.cashflow,
  (c) => c
);
