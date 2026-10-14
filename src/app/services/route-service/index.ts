import { NextResponse } from "next/server";
import { serverService } from "@commons/ajax/server/service";
import CryptoJS from "crypto-js";
import { cookies } from "next/headers";

export enum methods {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

export enum CacheStrategy {
  NO_CACHE = "no-cache, no-store, must-revalidate",
  SHORT = "public, max-age=60, s-maxage=60, stale-while-revalidate=30",
  MEDIUM = "public, max-age=300, s-maxage=300, stale-while-revalidate=60",
  LONG = "public, max-age=1800, s-maxage=1800, stale-while-revalidate=120",
}

export interface RouteServiceParams {
  request: Request;
  method: methods;
  endpoint: string;
  cache?: CacheStrategy;
  handler?: (bodyOrParams: unknown) => Promise<unknown>;
}

export interface StandardApiResponse<T = unknown> {
  code: number;
  success: boolean;
  data: T;
  meta?: Record<string, unknown>;
  message?: string;
}

/**
 * Standardized RouteService helper for Next.js App Router Route Handlers
 */
export async function RouteService<T = unknown>({
  request,
  method,
  endpoint,
  cache = CacheStrategy.NO_CACHE,
  handler,
}: RouteServiceParams): Promise<NextResponse> {
  try {
    const url = new URL(request.url);
    const queryParams: Record<string, string> = {};
    url.searchParams.forEach((val, key) => {
      queryParams[key] = val;
    });

    let bodyData: unknown = undefined;
    if (method !== methods.GET && method !== methods.DELETE) {
      try {
        bodyData = await request.json();
      } catch {
        bodyData = undefined;
      }
    }

    // Auth Token forwarding
    const cookieStore = await cookies();
    const tokenCookieName = process.env.COOKIE_TOKEN_NAME || "flowsync_token";
    const refreshTokenCookieName = process.env.COOKIE_REFRESH_TOKEN_NAME || "flowsync_rtoken";
    const token = cookieStore.get(tokenCookieName)?.value;
    const refreshToken = cookieStore.get(refreshTokenCookieName)?.value;

    let validToken = token;
    if (token && refreshToken) {
      try {
        validToken = await serverService.ensureValidToken(token, refreshToken);
      } catch (err) {
        console.warn("[RouteService] Token refresh failed:", err);
      }
    }

    // Call custom handler or proxy directly to core backend
    let responseData: unknown;
    if (handler) {
      responseData = await handler(method === methods.GET ? queryParams : bodyData);
    } else {
      const headers: Record<string, string> = {};
      if (validToken) {
        headers["Authorization"] = `Bearer ${validToken}`;
      }

      if (method === methods.GET) {
        responseData = await serverService.get(endpoint, queryParams, { headers });
      } else if (method === methods.POST) {
        responseData = await serverService.post(endpoint, bodyData, { headers });
      } else if (method === methods.PUT) {
        responseData = await serverService.put(endpoint, bodyData, { headers });
      } else if (method === methods.PATCH) {
        responseData = await serverService.patch(endpoint, bodyData, { headers });
      } else if (method === methods.DELETE) {
        responseData = await serverService.delete(endpoint, { headers });
      }
    }

    // Format standard payload
    const standardPayload: StandardApiResponse<T> = {
      code: 200,
      success: true,
      data: (responseData as any)?.data ?? (responseData as T),
      meta: (responseData as any)?.meta,
      message: (responseData as any)?.message || "OK",
    };

    const payloadString = JSON.stringify(standardPayload);

    // Calculate ETag (MD5)
    const etag = `"${CryptoJS.MD5(payloadString).toString()}"`;
    const clientIfNoneMatch = request.headers.get("if-none-match");

    // ETag Match 304 check
    if (clientIfNoneMatch && clientIfNoneMatch === etag) {
      return new NextResponse(null, {
        status: 304,
        headers: {
          ETag: etag,
          "Cache-Control": cache,
        },
      });
    }

    return new NextResponse(payloadString, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ETag: etag,
        "Cache-Control": cache,
      },
    });
  } catch (error: any) {
    console.error("[RouteService Error]:", error);
    const status = error.response?.status || 500;
    const errorPayload: StandardApiResponse<null> = {
      code: status,
      success: false,
      data: null,
      message: error.response?.data?.message || error.message || "Lỗi xử lý hệ thống",
    };

    return NextResponse.json(errorPayload, { status });
  }
}
