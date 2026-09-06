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
    <div className="w-full h-full min-h-[560px] flex flex-col items-center justify-center bg-[#020617] text-slate-400 font-mono text-xs gap-3.5 skeleton-shimmer rounded-3xl border border-white/10">
      <div className="relative flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
        <span className="absolute text-xs">🔥</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <span className="text-slate-200 font-semibold tracking-wider">
          SYNCHRONIZING TACTICAL MAP TILES
        </span>
        <span className="text-[10px] text-slate-500 uppercase tracking-widest">
          CARTO DARK MATTER • VIIRS SATELLITE OVERLAY
        </span>
      </div>
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
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

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

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
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
          setToastMessage(`✓ Satellite telemetry synchronized (${fetchedFires.length} hotspots active)`);
          setTimeout(() => setToastMessage(null), 3500);
        }
      } catch (err: any) {
        console.error("Error fetching IGNIS surveillance data:", err);
        setError("Unable to reach IGNIS cloud node. Operating in verified offline fallback mode.");
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
    <div className="min-h-screen bg-command-radial text-[#f8fafc] flex flex-col antialiased selection:bg-red-600 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[3000] glass-card bg-emerald-950/90 text-emerald-200 border border-emerald-500/80 px-4 py-2 rounded-2xl text-xs font-mono shadow-2xl backdrop-blur-xl flex items-center gap-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1) COMMAND TOPBAR (Header)                                                */}
      {/* ========================================================================= */}
      <header className="relative z-40 glass-card bg-[#020617]/80 backdrop-blur-xl border-b border-white/10 px-4 py-3 md:px-8 md:py-3.5">
        <div className="max-w-[1700px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3.5">
          {/* Left: App mark, Title, Subtitle, Meta row */}
          <div className="flex items-center gap-3.5">
            {/* Hexagonal / Flame Style App Mark */}
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 p-0.5 shadow-lg shadow-red-600/30 flex items-center justify-center shrink-0 glow-red">
              <div className="w-full h-full bg-[#0b1220] rounded-[14px] flex items-center justify-center text-xl">
                🔥
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl md:text-2xl font-black tracking-wider text-white font-mono">
                  IGNIS
                </h1>
                {/* Tiny Meta Row Badges */}
                <div className="flex items-center gap-1.5">
                  <span className="bg-white/5 border border-white/15 text-slate-300 font-mono text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                    NTRO
                  </span>
                  <span className="bg-red-950/60 border border-red-500/40 text-red-300 font-mono text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                    SIH26162
                  </span>
                  <span className="bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-mono text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider hidden sm:inline">
                    FIRMS / VIIRS
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide">
                Intelligent Geospatial Network for Industrial Fire Screening
              </p>
            </div>
          </div>

          {/* Right: Live Pill, Monospace Time, About, Fullscreen */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Live Link Pill with Animated Dot */}
            <div
              className={`glass-card px-3 py-1.5 rounded-full text-[11px] font-mono font-bold flex items-center gap-2 border shadow-md ${
                ignisStatus === "live"
                  ? "border-cyan-500/40 text-cyan-300 bg-cyan-950/30 glow-cyan"
                  : "border-amber-500/40 text-amber-300 bg-amber-950/30 glow-amber"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  ignisStatus === "live" ? "bg-cyan-400 pulse-live" : "bg-amber-400"
                }`}
              />
              <span className="tracking-wider">
                {ignisStatus === "live" ? "SYSTEM NOMINAL • LIVE LINK" : "CACHED LINK"}
              </span>
            </div>

            {/* Last Refreshed Time in Monospace */}
            {lastRefreshed && (
              <div className="glass-card px-3 py-1.5 rounded-xl border border-white/10 text-slate-300 font-mono text-[11px] hidden sm:flex items-center gap-1.5">
                <span className="text-slate-500">SYNC:</span>
                <span className="text-slate-200 font-semibold">{lastRefreshed}</span>
              </div>
            )}

            {/* Ghost About Button */}
            <button
              onClick={() => setIsAboutOpen(true)}
              className="glass-card hover:border-white/20 text-slate-300 hover:text-white px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
            >
              <span className="text-cyan-400">ℹ️</span>
              <span>About</span>
            </button>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="glass-card hover:border-white/20 text-slate-400 hover:text-white px-2.5 py-1.5 rounded-xl text-xs transition-all duration-200 cursor-pointer hidden md:flex items-center justify-center"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen View"}
            >
              {isFullscreen ? "⤢" : "⤡"}
            </button>
          </div>
        </div>

        {/* 2px Red Accent Line Under Header */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-80" />
      </header>

      {/* ========================================================================= */}
      {/* MAIN CONTAINER                                                            */}
      {/* ========================================================================= */}
      <main className="max-w-[1700px] mx-auto w-full p-3.5 md:p-6 flex flex-col gap-4 flex-1">
        {/* ========================================================================= */}
        {/* 2) SLEEK STATUS BANNER                                                    */}
        {/* ========================================================================= */}
        {ignisStatus === "live" ? (
          <div className="glass-card bg-cyan-950/20 border border-cyan-500/30 text-cyan-200 px-4 py-2 rounded-2xl text-xs flex flex-wrap items-center justify-between gap-2 shadow-lg">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
              </span>
              <span className="font-mono font-bold text-cyan-300 tracking-wide uppercase text-[11px]">
                IGNIS LIVE
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300">
                NASA FIRMS + OpenStreetMap industrial baseline linked
              </span>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-mono text-cyan-400/90">
              <span className="hidden sm:inline">{dataFreshness}</span>
              {lastRefreshed && <span>Updated {lastRefreshed}</span>}
            </div>
          </div>
        ) : (
          <div className="glass-card bg-amber-950/30 border border-amber-500/40 text-amber-200 px-4 py-2 rounded-2xl text-xs flex flex-wrap items-center justify-between gap-2 shadow-lg">
            <div className="flex items-center gap-2.5">
              <span>⚠️</span>
              <span className="font-mono font-bold text-amber-300 tracking-wide uppercase text-[11px]">
                CACHED REPOSITORY
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300">
                Operating on verified satellite dataset & local industrial spatial baseline
              </span>
            </div>
            {lastRefreshed && (
              <span className="text-[10px] font-mono text-amber-400/90">
                Snapshot: {lastRefreshed}
              </span>
            )}
          </div>
        )}

        {/* Backend Error Alert if Node Disconnected */}
        {error && (
          <div className="glass-card bg-red-950/40 border border-red-500/50 text-red-300 p-3.5 rounded-2xl text-xs flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2">
              <span>🚨</span>
              <span>{error}</span>
            </div>
            <button
              onClick={() => fetchData(true)}
              className="px-3 py-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl font-mono text-[11px] font-bold transition shadow-md cursor-pointer"
            >
              RECONNECT
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3) FLOATING FILTER BAR DECK                                               */}
        {/* ========================================================================= */}
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

        {/* ========================================================================= */}
        {/* 4) TRUE COMMAND LAYOUT: 68% MAP + 32% TELEMETRY STACK                      */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
          {/* Left 68%: Map Stage (8 cols on lg screen) */}
          <section className="lg:col-span-8 relative h-[calc(100vh-250px)] min-h-[580px] md:min-h-[640px] rounded-3xl overflow-hidden shadow-2xl">
            {/* Loading Shimmer Overlay */}
            {loading && (
              <div className="absolute inset-0 z-[1000] bg-[#020617]/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                <div className="relative flex items-center justify-center">
                  <div className="w-12 h-12 border-3 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
                  <span className="absolute text-sm">🛰️</span>
                </div>
                <span className="font-mono text-xs text-red-300 tracking-widest uppercase">
                  IGNIS Ingesting NASA Thermal Telemetry...
                </span>
              </div>
            )}

            {/* Empty Filter State */}
            {!loading && (!Array.isArray(filteredFires) || filteredFires.length === 0) && (
              <div className="absolute inset-0 z-[999] pointer-events-none flex flex-col items-center justify-center text-center p-6 bg-[#020617]/70 backdrop-blur-[2px]">
                <div className="glass-card bg-[#0b1220]/95 border border-white/15 p-6 rounded-3xl max-w-sm pointer-events-auto shadow-2xl">
                  <div className="text-3xl mb-2">🔍</div>
                  <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                    Zero Anomaly Matches
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    No thermal targets in the selected window match category &quot;{category}&quot;.
                  </p>
                  <button
                    onClick={() => setCategory("all")}
                    className="mt-4 px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl text-xs font-mono font-bold tracking-wider shadow-lg shadow-red-600/30 cursor-pointer"
                  >
                    RESET TO ALL
                  </button>
                </div>
              </div>
            )}

            <FireMap fires={Array.isArray(filteredFires) ? filteredFires : []} />
          </section>

          {/* Right 32%: Telemetry Stack (4 cols on lg screen) */}
          <aside className="lg:col-span-4 flex flex-col gap-4">
            <StatsPanel stats={stats} />
            <AlertPanel alerts={Array.isArray(alerts) ? alerts : []} />
          </aside>
        </div>

        {/* ========================================================================= */}
        {/* 5) BOTTOM CASE STUDIES & BENCHMARKS STRIP                                  */}
        {/* ========================================================================= */}
        <CaseStudies />
      </main>

      {/* ========================================================================= */}
      {/* 6) SLIM FOOTER                                                            */}
      {/* ========================================================================= */}
      <footer className="border-t border-white/10 bg-[#020617]/90 py-3.5 px-4 text-center text-xs text-slate-500 font-mono tracking-wider">
        IGNIS v1.0 • NASA FIRMS • OpenStreetMap • Built for NTRO SIH26162
      </footer>

      {/* About Modal Dialog */}
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </div>
  );
}
