import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { BaseReducerState, LOADING_STATUS, FetchDataArgs } from "@interfaces/base";
import { Transaction } from "@interfaces/cashflow";

export interface TransactionFilterParams extends FetchDataArgs {
  bankCode?: string;
  direction?: "ALL" | "INFLOW" | "OUTFLOW";
  reconcileStatus?: "ALL" | "MATCHED" | "PENDING" | "REVIEW_REQUIRED";
}

export interface TransactionsState extends BaseReducerState<Transaction, TransactionFilterParams> {
  selectedTx: Transaction | null;
}

const mockTransactions: Transaction[] = [
  {
    id: "tx_001",
    txCode: "FT2628809121",
    bankCode: "VCB",
    accountNumber: "0011004589999",
    amount: 1250000000,
    direction: "INFLOW",
    counterpartyName: "TẬP ĐOÀN BÁN LẺ VINCOMMERCE",
    counterpartyAccount: "0491000129999",
    category: "Thanh toán Đơn hàng Đối tác",
    description: "Thanh toán đối soát kỳ 1 tháng 10 - HD-2026-9912",
    timestamp: "2026-10-14T07:15:22Z",
    reconcileStatus: "MATCHED",
    matchedInvoiceId: "INV-2026-10-091",
  },
  {
    id: "tx_002",
    txCode: "FT2628809122",
    bankCode: "TCB",
    accountNumber: "19034567888019",
    amount: 450000000,
    direction: "OUTFLOW",
    counterpartyName: "AMAZON WEB SERVICES VIETNAM",
    counterpartyAccount: "AWS-CLOUD-BILLING",
    category: "Hạ tầng & Cloud Server",
    description: "Chi phí Server AWS Production & CDN tháng 09/2026",
    timestamp: "2026-10-14T06:40:11Z",
    reconcileStatus: "MATCHED",
    matchedInvoiceId: "INV-AWS-7712",
  },
  {
    id: "tx_003",
    txCode: "FT2628809123",
    bankCode: "MBB",
    accountNumber: "8888099992222",
    amount: 890000000,
    direction: "INFLOW",
    counterpartyName: "CTY TNHH PHẦN MỀM THIÊN LONG",
    counterpartyAccount: "1029384756",
    category: "Doanh thu Bản quyền SaaS",
    description: "Thanh toán gói license doanh nghiệp 12 tháng",
    timestamp: "2026-10-14T05:22:04Z",
    reconcileStatus: "MATCHED",
    matchedInvoiceId: "INV-SL-0044",
  },
  {
    id: "tx_004",
    txCode: "FT2628809124",
    bankCode: "MOMO",
    accountNumber: "MERCHANT-849091",
    amount: 154200000,
    direction: "INFLOW",
    counterpartyName: "CỔNG THANH TOÁN MOMO",
    counterpartyAccount: "MOMO-PAY-AGG",
    category: "Thanh toán Vi mô / Ví điện tử",
    description: "Quyết toán dòng tiền bán lẻ ca sáng 14/10",
    timestamp: "2026-10-14T04:10:00Z",
    reconcileStatus: "PENDING",
  },
  {
    id: "tx_005",
    txCode: "FT2628809125",
    bankCode: "VCB",
    accountNumber: "0011004589999",
    amount: 620000000,
    direction: "OUTFLOW",
    counterpartyName: "CTY CP BẤT ĐỘNG SẢN SUNSHINE",
    counterpartyAccount: "99018273645",
    category: "Chi phí Thuê Văn phòng",
    description: "Tiền thuê văn phòng Landmark 81 T10/2026",
    timestamp: "2026-10-13T16:00:00Z",
    reconcileStatus: "REVIEW_REQUIRED",
  },
  {
    id: "tx_006",
    txCode: "FT2628809126",
    bankCode: "TCB",
    accountNumber: "19034567888019",
    amount: 3200000000,
    direction: "OUTFLOW",
    counterpartyName: "NGÂN HÀNG TECHCOMBANK",
    counterpartyAccount: "TCB-INTEREST-LOAN",
    category: "Chi phí Tài chính & Lãi vay",
    description: "Chi trả lãi suất tín chấp tuần 2 T10",
    timestamp: "2026-10-13T10:30:15Z",
    reconcileStatus: "MATCHED",
    matchedInvoiceId: "INV-TCB-LOAN-98",
  },
];

const initialState: TransactionsState = {
  status: LOADING_STATUS.IDLE,
  items: mockTransactions,
  total: mockTransactions.length,
  params: {
    page: 1,
    pageSize: 10,
    direction: "ALL",
    reconcileStatus: "ALL",
  },
  selectedTx: null,
  error: null,
};

export const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    getTransactionsAction: (state, action: PayloadAction<TransactionFilterParams | undefined>) => {
      state.status = LOADING_STATUS.LOADING;
      if (action.payload) {
        state.params = { ...state.params, ...action.payload };
      }
    },
    getTransactionsSuccess: (
      state,
      action: PayloadAction<{ items: Transaction[]; total: number }>
    ) => {
      state.status = LOADING_STATUS.SUCCESS;
      state.items = action.payload.items;
      state.total = action.payload.total;
    },
    getTransactionsFailure: (state, action: PayloadAction<unknown>) => {
      state.status = LOADING_STATUS.ERROR;
      state.error = action.payload;
    },
    filterTransactionsAction: (state, action: PayloadAction<Partial<TransactionFilterParams>>) => {
      state.params = { ...state.params, ...action.payload };
    },
    reconcileTxAction: (state, _action: PayloadAction<{ txId: string; invoiceId: string }>) => {
      state.status = LOADING_STATUS.LOADING;
    },
    reconcileTxSuccess: (state, action: PayloadAction<{ txId: string; invoiceId: string }>) => {
      state.status = LOADING_STATUS.SUCCESS;
      const target = state.items.find((t) => t.id === action.payload.txId);
      if (target) {
        target.reconcileStatus = "MATCHED";
        target.matchedInvoiceId = action.payload.invoiceId;
      }
    },
    setSelectedTxAction: (state, action: PayloadAction<Transaction | null>) => {
      state.selectedTx = action.payload;
    },
  },
});

export const {
  getTransactionsAction,
  getTransactionsSuccess,
  getTransactionsFailure,
  filterTransactionsAction,
  reconcileTxAction,
  reconcileTxSuccess,
  setSelectedTxAction,
} = transactionsSlice.actions;

export const transactionsSelector = createSelector(
  (state: { transactions: TransactionsState }) => state.transactions,
  (tx) => tx
);
