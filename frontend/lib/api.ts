import axios from "axios";

// ==============================================================================
// IGNIS — Centralized API Client & Service Gateway
// Single Source of Truth for backend communication, timeouts, and health checks
// ==============================================================================

function cleanApiUrl(url?: string): string {
  if (!url) return "";
  let clean = url.trim().replace(/^["']|["']$/g, "").replace(/\/$/, "");
  if (clean && !clean.startsWith("http://") && !clean.startsWith("https://") && !clean.startsWith("/")) {
    clean = `https://${clean}`;
  }
  return clean;
}

export const API_URL = cleanApiUrl(process.env.NEXT_PUBLIC_API_URL);
export const isApiConfigured = Boolean(API_URL);

// Log useful debug once on startup
if (typeof window !== "undefined" && !(window as any).__IGNIS_API_LOGGED__) {
  (window as any).__IGNIS_API_LOGGED__ = true;
  console.info("[IGNIS] API_URL=", API_URL);
}

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30-second resilient timeout
  headers: {
    Accept: "application/json",
  },
});

export interface HealthResponse {
  status: "healthy" | "degraded" | "offline";
  nasa_firms?: string;
  active_fires_24h?: number;
  mode?: string;
  message?: string;
  timestamp?: string;
  error?: string;
}

export async function checkBackendHealth(): Promise<{ ok: boolean; data?: HealthResponse; error?: string }> {
  try {
    const res = await apiClient.get<HealthResponse>("/api/health", { timeout: 10000 });
    return { ok: res.status === 200, data: res.data };
  } catch (err: any) {
    const isTimeout = err.code === "ECONNABORTED" || err.message?.includes("timeout");
    const isDnsError = err.message?.includes("ERR_NAME_NOT_RESOLVED") || err.code === "ENOTFOUND";
    let message = "Backend unreachable: check NEXT_PUBLIC_API_URL";
    if (isTimeout) message = "Health check timed out (10s)";
    else if (isDnsError) message = "Backend host could not be resolved (DNS error)";
    else if (err.message) message = err.message;
    return {
      ok: false,
      error: message,
    };
  }
}

export async function fetchFiresTelemetry(
  days: number = 1,
  source: string = "all",
  mode: string = "LIVE",
  force: boolean = false
): Promise<{ ok: boolean; data?: any; error?: string }> {
  try {
    const res = await apiClient.get("/api/fires", {
      params: {
        days,
        source,
        mode,
        ...(force ? { force: "true" } : {}),
      },
      timeout: 30000,
    });
    return { ok: true, data: res.data };
  } catch (err: any) {
    const isTimeout = err.code === "ECONNABORTED" || err.message?.includes("timeout");
    return {
      ok: false,
      error: isTimeout ? "Connection timed out (30s)" : (err.message || "Failed to fetch fires"),
    };
  }
}

export async function fetchAlertsTelemetry(hours: number = 24): Promise<{ ok: boolean; data?: any; error?: string }> {
  try {
    const res = await apiClient.get("/api/alerts", {
      params: { hours },
      timeout: 10000,
    });
    return { ok: true, data: res.data };
  } catch (err: any) {
    return { ok: false, error: err.message, data: { alerts: [] } };
  }
}
