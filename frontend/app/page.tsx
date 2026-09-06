"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import type { Fire } from "@/components/FireMap";
import StatsPanel, { FireStats } from "@/components/StatsPanel";
import AlertPanel, { AlertItem } from "@/components/AlertPanel";
import FilterBar from "@/components/FilterBar";
import AboutModal from "@/components/AboutModal";
import CaseStudies from "@/components/CaseStudies";

const FireMap = dynamic(() => import("@/components/FireMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#0b1120] text-slate-400 font-mono text-xs gap-3 skeleton-shimmer">
      <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
      <span>Initializing Tactical Cartography Engine...</span>
    </div>
  ),
});

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://web-production-b1e6a.up.railway.app";

export default function DashboardPage() {
  const [fires, setFires] = useState<Fire[]>([]);
  const [filteredFires, setFilteredFires] = useState<Fire[]>([]);
  const [stats, setStats] = useState<FireStats | null>(null);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [days, setDays] = useState<number>(1);
  const [category, setCategory] = useState<string>("all");
  const [source, setSource] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [ignisStatus, setIgnisStatus] = useState<"live" | "cached_fallback">("live");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [lastRefreshed, setLastRefreshed] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);

  // Format current local time with IST indicator
  const getFormattedTime = () => {
    return (
      new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }) + " IST"
    );
  };

  // Fetch fires and active surveillance alerts from backend
  const fetchData = useCallback(
    async (forceRefresh = false) => {
      try {
        if (forceRefresh) {
          setIsRefreshing(true);
        } else {
          setLoading(true);
        }
        setError(null);

        const firesUrl = `${API_BASE_URL}/api/fires?days=${days}&source=${source}${
          forceRefresh ? "&force=true" : ""
        }`;
        const alertsUrl = `${API_BASE_URL}/api/alerts?hours=24`;

        const [firesRes, alertsRes] = await Promise.all([
          axios.get(firesUrl),
          axios.get(alertsUrl).catch(() => ({ data: { alerts: [] } })),
        ]);

        const fetchedFires: Fire[] = Array.isArray(firesRes.data?.fires)
          ? firesRes.data.fires
          : [];
        setFires(fetchedFires);
        setStats(firesRes.data?.summary || null);
        const fetchedAlerts = Array.isArray(alertsRes.data?.alerts)
          ? alertsRes.data.alerts
          : [];
        setAlerts(fetchedAlerts);

        const backendStatus = firesRes.data?.ignis_status === "live" ? "live" : "cached_fallback";
        setIgnisStatus(backendStatus);
        setStatusMessage(firesRes.data?.message || "");
        setLastRefreshed(getFormattedTime());

        if (forceRefresh) {
          setToastMessage(`✓ Satellite feed synchronized (${fetchedFires.length} thermal targets)`);
          setTimeout(() => setToastMessage(null), 3500);
        }
      } catch (err: any) {
        console.error("Error fetching IGNIS surveillance data:", err);
        setError("Unable to connect to IGNIS backend service. Operating in offline verification mode.");
        setIgnisStatus("cached_fallback");
        setStatusMessage("Offline fallback mode");
        setLastRefreshed(getFormattedTime());
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    },
    [days, source]
  );

  // Initial load and dependency changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Client-side category filtering
  useEffect(() => {
    const safe = Array.isArray(fires) ? fires : [];
    if (category === "all") {
      setFilteredFires(safe);
    } else {
      setFilteredFires(safe.filter((f) => (f?.category || "UNKNOWN") === category));
    }
  }, [category, fires]);

  // Auto-refresh every 3 minutes (180,000 ms)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData(false);
    }, 3 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Calculate data freshness based on latest satellite acquisition date/time
  const dataFreshness = useMemo(() => {
    if (!Array.isArray(fires) || fires.length === 0) return "Awaiting pass";
    let latestMs = 0;
    for (const f of fires) {
      if (!f?.acq_date || typeof f.acq_date !== "string") continue;
      const parts = f.acq_date.split("-").map(Number);
      if (!parts || parts.length !== 3) continue;
      let hours = 0;
      let mins = 0;
      if (f.acq_time) {
        const padded = String(f.acq_time).padStart(4, "0");
        hours = parseInt(padded.slice(0, 2), 10) || 0;
        mins = parseInt(padded.slice(2, 4), 10) || 0;
      }
      const t = Date.UTC(parts[0], parts[1] - 1, parts[2], hours, mins);
      if (t > latestMs) latestMs = t;
    }
    if (!latestMs) return "Recent satellite pass";
    const diffHours = Math.max(0, Math.floor((Date.now() - latestMs) / (1000 * 60 * 60)));
    return `Latest pass: ${diffHours === 0 ? "< 1" : diffHours}h ago (VIIRS 375m)`;
  }, [fires]);

  // Export current active fires to CSV report
  const handleDownloadReport = () => {
    const safeFiltered = Array.isArray(filteredFires) ? filteredFires : [];
    const safeFires = Array.isArray(fires) ? fires : [];
    const recordsToExport = safeFiltered.length > 0 ? safeFiltered : safeFires;
    if (!recordsToExport.length) return;

    const headers = [
      "latitude",
      "longitude",
      "category",
      "risk_level",
      "frp",
      "brightness",
      "acq_date",
      "acq_time",
      "reason",
    ];

    const rows = recordsToExport.map((f) => [
      f.latitude,
      f.longitude,
      `"${f.category}"`,
      `"${f.risk_level}"`,
      f.frp,
      f.brightness,
      `"${f.acq_date}"`,
      `"${f.acq_time}"`,
      `"${(f.reason || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const today = new Date().toISOString().slice(0, 10);
    link.setAttribute("href", url);
    link.setAttribute("download", `ignis_surveillance_report_${today}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-[#f8fafc] flex flex-col antialiased">
      {/* Top Notification Toast */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[2000] bg-emerald-900/90 text-emerald-100 border border-emerald-500/80 px-4 py-2 rounded-xl text-xs font-mono shadow-2xl backdrop-blur-md animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Header with Dark Crimson to Charcoal Gradient */}
      <header className="bg-gradient-to-r from-[#7f1d1d] via-[#450a0a] to-[#0f172a] border-b border-red-900/60 px-4 py-3.5 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Left Brand */}
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
                <span className="text-red-500 drop-shadow-[0_0_12px_rgba(239,68,68,0.6)]">🔥</span> IGNIS
              </h1>
              <span className="bg-black/40 border border-white/20 text-white font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-sm shadow-inner">
                NTRO
              </span>
              <span className="bg-black/40 border border-red-500/30 text-red-300 font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-sm shadow-inner">
                SIH26162
              </span>
            </div>
            <p className="text-orange-100/75 text-xs font-medium mt-0.5">
              Intelligent Geospatial Network for Industrial fire Screening
            </p>
          </div>

          {/* Right Status Badges & Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Live / Cached Pill */}
            <div
              className={`px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-2 border shadow-sm ${
                ignisStatus === "live"
                  ? "bg-emerald-950/80 text-emerald-300 border-emerald-600"
                  : "bg-amber-950/80 text-amber-300 border-amber-600"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  ignisStatus === "live" ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                }`}
              />
              <span>{ignisStatus === "live" ? "🟢 LIVE FEED" : "🟡 CACHED MODE"}</span>
            </div>

            {/* Data Freshness Indicator */}
            <div className="bg-black/40 border border-white/10 text-slate-300 font-mono text-xs px-2.5 py-1 rounded-lg hidden sm:flex items-center gap-1.5">
              <span>🛰️</span>
              <span>{dataFreshness}</span>
            </div>

            {/* About Modal Button */}
            <button
              onClick={() => setIsAboutOpen(true)}
              className="bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold px-3 py-1 rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>ℹ️</span>
              <span>About</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full p-3.5 md:p-5 flex flex-col gap-3.5 flex-1">
        {/* Dynamic Status Banner */}
        {ignisStatus === "live" ? (
          <div className="bg-emerald-950/40 border border-emerald-800/80 text-emerald-200 px-4 py-2 rounded-xl text-xs flex flex-wrap items-center justify-between gap-2 shadow-sm font-sans">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">🟢 IGNIS LIVE:</span>
              <span>Connected to NASA FIRMS satellites & OpenStreetMap Overpass industrial database.</span>
            </div>
            {lastRefreshed && (
              <span className="font-mono text-[11px] text-emerald-400/90 font-medium">
                Last refreshed: {lastRefreshed}
              </span>
            )}
          </div>
        ) : (
          <div className="bg-amber-950/50 border border-amber-600/80 text-amber-200 px-4 py-2 rounded-xl text-xs flex flex-wrap items-center justify-between gap-2 shadow-sm font-sans">
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-bold">🟡 Cached Mode:</span>
              <span>Operating on verified satellite data repository & local industrial spatial baseline.</span>
            </div>
            {lastRefreshed && (
              <span className="font-mono text-[11px] text-amber-300 font-medium">
                Last refreshed: {lastRefreshed}
              </span>
            )}
          </div>
        )}

        {/* Backend Connection Alert if Offline */}
        {error && (
          <div className="bg-red-950/70 border border-red-800 text-red-300 p-3 rounded-xl text-xs flex items-center justify-between shadow-md font-sans">
            <span>⚠️ {error}</span>
            <button
              onClick={() => fetchData(true)}
              className="px-2.5 py-1 bg-red-700 hover:bg-red-600 text-white rounded font-medium transition cursor-pointer"
            >
              Reconnect
            </button>
          </div>
        )}

        {/* FilterBar right below Header / Banner */}
        <FilterBar
          days={days}
          category={category}
          source={source}
          lastUpdated={lastRefreshed}
          isRefreshing={isRefreshing}
          onDaysChange={setDays}
          onCategoryChange={setCategory}
          onSourceChange={setSource}
          onRefresh={() => fetchData(true)}
          onDownload={handleDownloadReport}
        />

        {/* Main Surveillance Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 flex-1">
          {/* Left Column (2 Cols): FireMap with Responsive Height */}
          <section className="lg:col-span-2 relative h-[calc(100vh-250px)] min-h-[560px] bg-[#0b1120] rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden">
            {/* Loading Shimmer Overlay */}
            {loading && (
              <div className="absolute inset-0 z-[1000] bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                <div className="w-10 h-10 border-3 border-red-500 border-t-transparent rounded-full animate-spin" />
                <span className="font-mono text-xs text-red-300 tracking-wider">
                  🛰️ IGNIS fetching NASA satellite telemetry...
                </span>
              </div>
            )}

            {/* Empty State Overlay */}
            {!loading && (!Array.isArray(filteredFires) || filteredFires.length === 0) && (
              <div className="absolute inset-0 z-[999] pointer-events-none flex flex-col items-center justify-center text-center p-6 bg-slate-950/60 backdrop-blur-[2px]">
                <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl max-w-sm pointer-events-auto">
                  <div className="text-3xl mb-2">🔍</div>
                  <h3 className="text-sm font-bold text-slate-100">No Thermal Targets Match Filter</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Try switching Category to &quot;All Categories&quot; or selecting a broader 3-Day or 7-Day window.
                  </p>
                  <button
                    onClick={() => setCategory("all")}
                    className="mt-3 px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold"
                  >
                    Reset Filter
                  </button>
                </div>
              </div>
            )}

            <FireMap fires={filteredFires} />
          </section>

          {/* Right Column (1 Col): StatsPanel + AlertPanel stacked */}
          <aside className="flex flex-col gap-3.5">
            <StatsPanel stats={stats} />
            <AlertPanel alerts={alerts} />
          </aside>
        </div>

        {/* Collapsible Case Studies Panel */}
        <CaseStudies />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#080d1a] py-3.5 px-4 text-center text-xs text-slate-500 font-mono">
        IGNIS v1.0 · NASA FIRMS · OpenStreetMap · NTRO SIH26162
      </footer>

      {/* About Modal Dialog */}
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </div>
  );
}
