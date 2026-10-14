// Core Backend endpoints (Golang / Java / Node.js Core API)
export const CORE_API_PREFIX = process.env.NEXT_PUBLIC_CORE_API_URL || "http://localhost:8080/api/v1";

// Auth Core Endpoints
export const CORE_AUTH_LOGIN = "/auth/login";
export const CORE_AUTH_LOGOUT = "/auth/logout";
export const CORE_AUTH_ME = "/auth/me";
export const CORE_AUTH_REFRESH_TOKEN = "/auth/refresh-token";

// Cash Flow & Treasury Core Endpoints
export const CORE_CASHFLOW_SUMMARY = "/cashflow/summary";
export const CORE_CASHFLOW_METRICS = "/cashflow/metrics";
export const CORE_CASHFLOW_TREND = "/cashflow/trend";

// Transactions Core Endpoints
export const CORE_TRANSACTION_LIST = "/transactions";
export const CORE_TRANSACTION_DETAIL = (id: string | number) => `/transactions/${id}`;
export const CORE_TRANSACTION_RECONCILE = "/transactions/reconcile";
export const CORE_TRANSACTION_EXPORT = "/transactions/export";

// Bank Accounts & API Integrations
export const CORE_INTEGRATIONS_LIST = "/integrations/connectors";
export const CORE_INTEGRATIONS_SYNC = (id: string | number) => `/integrations/connectors/${id}/sync`;
export const CORE_INTEGRATIONS_CONNECT = "/integrations/connect";
