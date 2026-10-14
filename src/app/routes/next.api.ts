// Next.js BFF Route Handler internal endpoints
export const NEXT_API_PREFIX = "/apis";

// Auth BFF Endpoints
export const NEXT_AUTH_LOGIN = `${NEXT_API_PREFIX}/auth/signin`;
export const NEXT_AUTH_LOGOUT = `${NEXT_API_PREFIX}/auth/signout`;
export const NEXT_AUTH_ME = `${NEXT_API_PREFIX}/auth/me`;
export const NEXT_AUTH_REFRESH_TOKEN = `${NEXT_API_PREFIX}/auth/refresh`;

// Cashflow BFF Endpoints
export const NEXT_CASHFLOW_SUMMARY = `${NEXT_API_PREFIX}/cashflow/summary`;
export const NEXT_CASHFLOW_TREND = `${NEXT_API_PREFIX}/cashflow/trend`;

// Transactions BFF Endpoints
export const NEXT_TRANSACTION_LIST = `${NEXT_API_PREFIX}/transactions/list`;
export const NEXT_TRANSACTION_RECONCILE = `${NEXT_API_PREFIX}/transactions/reconcile`;
export const NEXT_TRANSACTION_EXPORT = `${NEXT_API_PREFIX}/transactions/export`;

// Integrations BFF Endpoints
export const NEXT_INTEGRATIONS_LIST = `${NEXT_API_PREFIX}/integrations/list`;
export const NEXT_INTEGRATIONS_SYNC = `${NEXT_API_PREFIX}/integrations/sync`;
