import http from "http";
import https from "https";
import { AxiosCommon } from "../Axios";
import { CORE_API_PREFIX, CORE_AUTH_REFRESH_TOKEN } from "@routes/core.api";
import { decryptPayload, encryptPayload } from "@commons/utils/crypto";
import axios, { InternalAxiosRequestConfig } from "axios";

// Preemptive token mutex state
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

function parseJwtExp(token: string): number | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(Buffer.from(parts[1], "base64").toString("utf-8"));
    return typeof payload.exp === "number" ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

export class ServerService extends AxiosCommon {
  private static instance: ServerService;

  private constructor() {
    // KeepAlive agents for optimal node socket connection reuse
    const httpAgent = new http.Agent({ keepAlive: true, maxSockets: 50 });
    const httpsAgent = new https.Agent({ keepAlive: true, maxSockets: 50 });

    super(CORE_API_PREFIX, {
      httpAgent,
      httpsAgent,
    });

    this.setupInterceptors();
  }

  public static getInstance(): ServerService {
    if (!ServerService.instance) {
      ServerService.instance = new ServerService();
    }
    return ServerService.instance;
  }

  private setupInterceptors(): void {
    // Request Interceptor: AES Encryption & Auth Token & IP forwarding
    this.instance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        // Encrypt payload if enabled
        if (process.env.NEXT_PUBLIC_ENABLE_ENCRYPT === "true" && config.data) {
          config.data = { encrypted: encryptPayload(config.data) };
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response Interceptor: Decrypt AES payload if needed
    this.instance.interceptors.response.use(
      (response) => {
        if (
          process.env.NEXT_PUBLIC_ENABLE_ENCRYPT === "true" &&
          response.data &&
          typeof response.data === "object" &&
          "encrypted" in response.data
        ) {
          response.data = decryptPayload(response.data.encrypted as string);
        }
        return response;
      },
      (error) => Promise.reject(error)
    );
  }

  /**
   * Preemptive token validation & refresh mutex for Server-Side calls
   */
  public async ensureValidToken(
    accessToken: string,
    refreshToken: string
  ): Promise<string> {
    const exp = parseJwtExp(accessToken);
    const now = Date.now();
    const SIXTY_SECONDS = 60 * 1000;

    // If token is valid for more than 60s, return directly
    if (exp && exp - now > SIXTY_SECONDS) {
      return accessToken;
    }

    // Otherwise, mutex token refresh
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      });
    }

    isRefreshing = true;

    try {
      const response = await axios.post<{
        code: number;
        data: { accessToken: string };
      }>(`${CORE_API_PREFIX}${CORE_AUTH_REFRESH_TOKEN}`, {
        refreshToken,
      });

      const newToken = response.data?.data?.accessToken;
      if (!newToken) throw new Error("Failed to receive new access token");

      processQueue(null, newToken);
      return newToken;
    } catch (err) {
      processQueue(err, null);
      throw err;
    } finally {
      isRefreshing = false;
    }
  }
}

export const serverService = ServerService.getInstance();
