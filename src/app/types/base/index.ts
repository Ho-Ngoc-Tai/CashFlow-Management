export type LoadingStatus = "idle" | "loading" | "success" | "error";

export const LOADING_STATUS = {
  IDLE: "idle" as const,
  LOADING: "loading" as const,
  SUCCESS: "success" as const,
  ERROR: "error" as const,
};

export interface FetchDataArgs {
  page?: number;
  pageSize?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  [key: string]: unknown;
}

export interface BaseReducerState<T, P = FetchDataArgs> {
  status: LoadingStatus;
  error: unknown;
  params: P;
  total: number;
  items: T[];
  data?: T;
}
