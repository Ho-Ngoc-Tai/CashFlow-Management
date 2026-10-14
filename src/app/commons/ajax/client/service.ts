import { AxiosCommon } from "../Axios";
import { decryptPayload } from "@commons/utils/crypto";
import { toast } from "sonner";
import { AUTH_SIGNIN_PAGE } from "@routes/web";

export class ClientService extends AxiosCommon {
  private static instance: ClientService;

  private constructor() {
    super("", {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    });

    this.setupInterceptors();
  }

  public static getInstance(): ClientService {
    if (!ClientService.instance) {
      ClientService.instance = new ClientService();
    }
    return ClientService.instance;
  }

  private setupInterceptors(): void {
    // Response interceptor
    this.instance.interceptors.response.use(
      (response) => {
        // Automatically decrypt if payload is encrypted
        if (
          response.data &&
          typeof response.data === "object" &&
          "encrypted" in response.data &&
          typeof response.data.encrypted === "string"
        ) {
          response.data = decryptPayload(response.data.encrypted);
        }
        return response;
      },
      (error) => {
        const status = error.response?.status;

        if (typeof window !== "undefined") {
          if (status === 401) {
            toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
            if (!window.location.pathname.includes(AUTH_SIGNIN_PAGE)) {
              window.location.href = `${AUTH_SIGNIN_PAGE}?redirect=${encodeURIComponent(
                window.location.pathname
              )}`;
            }
          } else if (status === 403) {
            toast.error("Bạn không có quyền thực hiện thao tác này.");
          } else if (status >= 500) {
            toast.error("Hệ thống máy chủ đang bận. Vui lòng thử lại sau.");
          }
        }

        return Promise.reject(error);
      }
    );
  }
}

export const clientService = ClientService.getInstance();

export const get = <T = unknown>(url: string, params?: Record<string, unknown>) =>
  clientService.get<T>(url, params);

export const post = <T = unknown>(url: string, data?: unknown) =>
  clientService.post<T>(url, data);

export const put = <T = unknown>(url: string, data?: unknown) =>
  clientService.put<T>(url, data);

export const patch = <T = unknown>(url: string, data?: unknown) =>
  clientService.patch<T>(url, data);

export const del = <T = unknown>(url: string) =>
  clientService.delete<T>(url);
