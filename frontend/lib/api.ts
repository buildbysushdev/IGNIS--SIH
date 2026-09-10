import axios from "axios";
import type { Fire } from "@/components/FireMap";
import type { FireStats } from "@/components/StatsPanel";

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

if (typeof window !== "undefined" && !(window as any).__IGNIS_API_LOGGED__) {
  (window as any).__IGNIS_API_LOGGED__ = true;
  console.info("[IGNIS] API_URL=", API_URL);
}

export const apiClient = axios.create({
  baseURL: API_URL || "",
  timeout: 45000, // 45s resilient timeout for Railway cold-start
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

export async function checkBackendHealth(timeoutMs: number = 8000): Promise<{ ok: boolean; data?: HealthResponse; error?: string }> {
  try {
    const res = await apiClient.get<HealthResponse>("/api/health", { timeout: timeoutMs });
    return { ok: res.status === 200, data: res.data };
  } catch (err: any) {
    const isTimeout = err.code === "ECONNABORTED" || err.message?.includes("timeout");
    const isDnsError = err.message?.includes("ERR_NAME_NOT_RESOLVED") || err.code === "ENOTFOUND";
    let message = "Backend unreachable: check NEXT_PUBLIC_API_URL";
    if (isTimeout) message = `Health check timed out (${timeoutMs / 1000}s)`;
    else if (isDnsError) message = "Backend host could not be resolved (DNS error)";
    else if (err.message) message = err.message;
    return { ok: false, error: message };
  }
}

export interface FetchFiresOptions {
  days?: number;
  force?: boolean;
  mode?: "LIVE" | "CACHED" | "DEMO";
  timeoutMs?: number;
  source?: string;
}

export interface NormalizedFiresResponse {
  fires: Fire[];
  count: number;
  total: number;
  summary?: FireStats;
  fetched_at: string;
  mode: "LIVE" | "CACHED" | "DEMO";
  source: string;
  ignis_status: string;
  message: string;
  data_source?: string;
  raw?: any;
}

export function computeSummaryFromFires(fireList: Fire[]): FireStats {
  const sum: FireStats = {
    total: fireList.length,
    emergency: 0,
    persistent: 0,
    agricultural: 0,
    forest: 0,
    unknown: 0,
  };
  for (const f of fireList) {
    const cat = (f.category || (f as any).classification || "UNKNOWN").toUpperCase();
    if (
      cat === "EMERGENCY_INDUSTRIAL" ||
      cat === "HOSPITAL_FIRE" ||
      cat === "FUEL_STATION_FIRE" ||
      cat === "SCHOOL_FIRE" ||
      cat === "SLUM_DENSE_URBAN_FIRE"
    ) {
      sum.emergency += 1;
    } else if (cat === "PERSISTENT_INDUSTRIAL") {
      sum.persistent += 1;
    } else if (cat === "AGRICULTURAL_BURNING") {
      sum.agricultural += 1;
    } else if (cat === "FOREST_FIRE") {
      sum.forest += 1;
    } else {
      sum.unknown += 1;
    }
  }
  return sum;
}

/**
 * SINGLE SOURCE OF TRUTH FETCH
 * Handles Railway cold start (45s default timeout), abort controller,
 * cache busting, and normalizes all backend payload variations.
 */
export async function fetchFires(options?: FetchFiresOptions): Promise<NormalizedFiresResponse> {
  const days = options?.days ?? 1;
  const force = options?.force ?? true; // IMPORTANT: default true on first load & retries
  const mode = options?.mode ?? "LIVE";
  const timeoutMs = options?.timeoutMs ?? 45000; // 45s for Railway cold start
  const source = options?.source ?? "all";

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const base = API_URL;
  const url = `${base ? base.replace(/\/$/, "") : ""}/api/fires?days=${encodeURIComponent(
    days
  )}&source=${encodeURIComponent(source)}&mode=${encodeURIComponent(mode)}&force=${force}&t=${Date.now()}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const raw = await res.json();

    // Data normalization: handle array, { fires: [] }, { data: [] }, { items: [] }
    let rawFires: Fire[] = [];
    if (Array.isArray(raw)) {
      rawFires = raw;
    } else if (Array.isArray(raw?.fires)) {
      rawFires = raw.fires;
    } else if (Array.isArray(raw?.data)) {
      rawFires = raw.data;
    } else if (Array.isArray(raw?.items)) {
      rawFires = raw.items;
    } else if (Array.isArray(raw?.results)) {
      rawFires = raw.results;
    }

    const count = rawFires.length;
    const total = typeof raw?.total === "number" ? raw.total : count;
    const summary = raw?.summary && raw.summary.total > 0 ? raw.summary : computeSummaryFromFires(rawFires);
    const fetched_at = raw?.fetched_at || raw?.generated_at || new Date().toISOString();
    const resolvedMode = (raw?.mode || mode).toUpperCase() as "LIVE" | "CACHED" | "DEMO";
    const ignis_status = raw?.ignis_status || (resolvedMode === "LIVE" ? "live" : "cached_fallback");
    const message = raw?.message || (count > 0 ? `Synced ${count} hotspots` : "No hotspots returned");
    const data_source = raw?.data_source || (resolvedMode === "LIVE" ? "NASA FIRMS Real-Time" : "Local Cache Repository");

    return {
      fires: rawFires,
      count,
      total,
      summary,
      fetched_at,
      mode: resolvedMode,
      source,
      ignis_status,
      message,
      data_source,
      raw,
    };
  } finally {
    clearTimeout(timer);
  }
}

// Backward compatibility alias for legacy callers
export async function fetchFiresTelemetry(
  days: number = 1,
  source: string = "all",
  mode: string = "LIVE",
  force: boolean = true
): Promise<{ ok: boolean; data?: any; error?: string }> {
  try {
    const norm = await fetchFires({ days, source, mode: mode as any, force, timeoutMs: 45000 });
    return { ok: true, data: norm.raw || norm };
  } catch (err: any) {
    const isTimeout = err.name === "AbortError" || err.message?.includes("abort") || err.message?.includes("timeout");
    return {
      ok: false,
      error: isTimeout ? "Connection timed out (45s cold start)" : err.message || "Failed to fetch fires",
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
