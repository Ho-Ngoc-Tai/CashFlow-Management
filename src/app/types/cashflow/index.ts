export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: "CFO" | "TREASURER" | "ACCOUNTANT" | "ADMIN";
  companyName: string;
}

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  status: "idle" | "loading" | "success" | "error";
  error: unknown;
}

export interface BankAccount {
  id: string;
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountHolder: string;
  balance: number;
  currency: string;
  lastSyncAt: string;
  status: "ACTIVE" | "SYNCING" | "ERROR" | "PAUSED";
  logoUrl?: string;
}

export interface CashFlowSummary {
  totalAvailableBalance: number;
  netCashFlowToday: number;
  netCashFlowMonth: number;
  inflowMonth: number;
  outflowMonth: number;
  runwayDays: number;
  burnRateMonth: number;
  bankAccounts: BankAccount[];
}

export interface CashFlowTrendPoint {
  date: string;
  inflow: number;
  outflow: number;
  net: number;
  balance: number;
}

export interface Transaction {
  id: string;
  txCode: string;
  bankCode: string;
  accountNumber: string;
  amount: number;
  direction: "INFLOW" | "OUTFLOW";
  counterpartyName: string;
  counterpartyAccount?: string;
  category: string;
  description: string;
  timestamp: string;
  reconcileStatus: "MATCHED" | "PENDING" | "REVIEW_REQUIRED";
  matchedInvoiceId?: string;
}

export interface IntegrationConnector {
  id: string;
  provider: "VIETCOMBANK" | "TECHCOMBANK" | "MOMO" | "MB_BANK" | "VNPAY" | "CUSTOM_WEBHOOK";
  displayName: string;
  type: "OPEN_BANKING" | "PAYMENT_GATEWAY" | "ERP";
  status: "CONNECTED" | "DISCONNECTED" | "SYNCING" | "ERROR";
  lastSync: string;
  dailyTransactionsCount: number;
  errorDetail?: string;
}
