import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { BaseReducerState, LOADING_STATUS, FetchDataArgs } from "@interfaces/base";
import { IntegrationConnector } from "@interfaces/cashflow";

export interface IntegrationsState extends BaseReducerState<IntegrationConnector, FetchDataArgs> {
  activeSyncingId: string | null;
}

const mockConnectors: IntegrationConnector[] = [
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
];

const initialState: IntegrationsState = {
  status: LOADING_STATUS.IDLE,
  items: mockConnectors,
  total: mockConnectors.length,
  params: { page: 1, pageSize: 10 },
  activeSyncingId: null,
  error: null,
};

export const integrationsSlice = createSlice({
  name: "integrations",
  initialState,
  reducers: {
    getIntegrationsAction: (state) => {
      state.status = LOADING_STATUS.LOADING;
    },
    getIntegrationsSuccess: (state, action: PayloadAction<IntegrationConnector[]>) => {
      state.status = LOADING_STATUS.SUCCESS;
      state.items = action.payload;
      state.total = action.payload.length;
    },
    getIntegrationsFailure: (state, action: PayloadAction<unknown>) => {
      state.status = LOADING_STATUS.ERROR;
      state.error = action.payload;
    },
    triggerSyncAction: (state, action: PayloadAction<{ id: string }>) => {
      state.activeSyncingId = action.payload.id;
      const target = state.items.find((item) => item.id === action.payload.id);
      if (target) {
        target.status = "SYNCING";
      }
    },
    triggerSyncSuccess: (state, action: PayloadAction<{ id: string; lastSync: string }>) => {
      state.activeSyncingId = null;
      const target = state.items.find((item) => item.id === action.payload.id);
      if (target) {
        target.status = "CONNECTED";
        target.lastSync = action.payload.lastSync;
      }
    },
  },
});

export const {
  getIntegrationsAction,
  getIntegrationsSuccess,
  getIntegrationsFailure,
  triggerSyncAction,
  triggerSyncSuccess,
} = integrationsSlice.actions;

export const integrationsSelector = createSelector(
  (state: { integrations: IntegrationsState }) => state.integrations,
  (c) => c
);
