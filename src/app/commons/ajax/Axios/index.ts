import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

export interface RequestOptions extends AxiosRequestConfig {
  encrypt?: boolean;
}

export abstract class AxiosCommon {
  protected instance: AxiosInstance;

  constructor(baseURL: string, config: AxiosRequestConfig = {}) {
    this.instance = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      ...config,
    });
  }

  public async get<T = unknown>(url: string, params?: Record<string, unknown>, options?: RequestOptions): Promise<T> {
    const res = await this.instance.get<T, AxiosResponse<T>>(url, { params, ...options });
    return res.data;
  }

  public async post<T = unknown>(url: string, data?: unknown, options?: RequestOptions): Promise<T> {
    const res = await this.instance.post<T, AxiosResponse<T>>(url, data, options);
    return res.data;
  }

  public async put<T = unknown>(url: string, data?: unknown, options?: RequestOptions): Promise<T> {
    const res = await this.instance.put<T, AxiosResponse<T>>(url, data, options);
    return res.data;
  }

  public async patch<T = unknown>(url: string, data?: unknown, options?: RequestOptions): Promise<T> {
    const res = await this.instance.patch<T, AxiosResponse<T>>(url, data, options);
    return res.data;
  }

  public async delete<T = unknown>(url: string, options?: RequestOptions): Promise<T> {
    const res = await this.instance.delete<T, AxiosResponse<T>>(url, options);
    return res.data;
  }
}
