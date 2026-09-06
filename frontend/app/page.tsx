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
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-400 font-mono text-sm gap-2 animate-pulse">
      <span>🛰️ Initializing Cartographic Engine...</span>
    </div>
  ),
});

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function DashboardPage() {
  const [fires, setFires] = useState<Fire[]>([]);
  const [filteredFires, setFilteredFires] = useState<Fire[]>([]);
  const [stats, setStats] = useState<FireStats | null>(null);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [days, setDays] = useState<number>(1);
  const [category, setCategory] = useState<string>("all");
  const [source, setSource] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [ignisStatus, setIgnisStatus] = useState<string>("live");
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);

  // Fetch fires and active surveillance alerts from backend
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const firesUrl = `${API_BASE_URL}/api/fires?days=${days}&source=${source}`;
      const alertsUrl = `${API_BASE_URL}/api/alerts?hours=24`;

      const [firesRes, alertsRes] = await Promise.all([
        axios.get(firesUrl),
        axios.get(alertsUrl).catch(() => ({ data: { alerts: [] } })),
      ]);

      const fetchedFires: Fire[] = firesRes.data.fires || [];
      setFires(fetchedFires);
      setStats(firesRes.data.summary || null);
      setAlerts(alertsRes.data.alerts || []);
      setIgnisStatus(firesRes.data.ignis_status || "live");
    } catch (err: any) {
      console.error("Error fetching IGNIS surveillance data:", err);
      setError("Unable to reach IGNIS backend. Ensure FastAPI is running on port 8000.");
      setIgnisStatus("cached_fallback");
    } finally {
      setLoading(false);
    }
  }, [days, source]);

  // Initial load and dependency trigger
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Category filter effect
  useEffect(() => {
    if (category === "all") {
      setFilteredFires(fires);
    } else {
      setFilteredFires(fires.filter((f) => f.category === category));
    }
  }, [category, fires]);

  // Auto-refresh every 5 minutes (300,000 ms)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Calculate data freshness based on latest satellite acquisition date/time
  const dataFreshness = useMemo(() => {
    if (!fires.length) return "Awaiting pass";
    let latestMs = 0;
    for (const f of fires) {
      if (!f.acq_date) continue;
      const parts = f.acq_date.split("-").map(Number);
      if (parts.length !== 3) continue;
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
    if (!latestMs) return "Recent";
    const diffHours = Math.max(0, Math.floor((Date.now() - latestMs) / (1000 * 60 * 60)));
    const satelliteLabel =
      source === "VIIRS_NOAA20_NRT"
        ? "VIIRS NOAA-20"
        : "VIIRS SNPP";
    return `Last update: ${diffHours === 0 ? "< 1" : diffHours} hours ago (${satelliteLabel})`;
  }, [fires, source]);

  // Export current fires to CSV report
  const handleDownloadReport = () => {
    const recordsToExport = filteredFires.length > 0 ? filteredFires : fires;
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
    link.setAttribute("download", `ignis_report_${today}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f8fafc] flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-900 to-orange-900 p-4 border-b border-red-800/60 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                🔥 IGNIS
              </h1>
              <span className="bg-black/30 border border-white/20 text-white font-mono text-[11px] font-semibold px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                NTRO | SIH26162
              </span>
            </div>
            <p className="text-orange-100/80 text-xs md:text-sm mt-0.5">
              Intelligent Geospatial Network for Industrial fire Screening
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Data Freshness Indicator */}
            <div className="bg-black/40 border border-red-800/60 text-red-200 font-mono text-xs px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
              <span>{dataFreshness}</span>
            </div>

            {/* About Modal Trigger Button */}
            <button
              onClick={() => setIsAboutOpen(true)}
              className="bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold px-3.5 py-1.5 rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>ℹ️</span>
              <span>About</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full p-4 flex flex-col gap-4 flex-1">
        {/* Cached Fallback Warning Banner */}
        {ignisStatus === "cached_fallback" && (
          <div className="bg-amber-950/80 border border-amber-600 text-amber-200 px-4 py-2.5 rounded-xl text-xs flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2">
              <span>⚠️</span>
              <span>
                <strong>NASA FIRMS Offline / Cached Mode:</strong> Operating on cached surveillance repository and localized spatial baseline.
              </span>
            </div>
            <span className="font-mono text-[10px] bg-amber-900/60 px-2 py-0.5 rounded border border-amber-700 uppercase tracking-wider">
              CACHED_FALLBACK
            </span>
          </div>
        )}

        {/* Backend Connectivity Error Notification */}
        {error && (
          <div className="bg-red-950/70 border border-red-800 text-red-300 p-3.5 rounded-xl text-xs flex items-center justify-between shadow-md">
            <span>⚠️ {error}</span>
            <button
              onClick={fetchData}
              className="px-2.5 py-1 bg-red-700 hover:bg-red-600 text-white rounded font-medium transition"
            >
              Retry
            </button>
          </div>
        )}

        {/* FilterBar right below header */}
        <FilterBar
          days={days}
          category={category}
          source={source}
          onDaysChange={setDays}
          onCategoryChange={setCategory}
          onSourceChange={setSource}
          onRefresh={fetchData}
          onDownload={handleDownloadReport}
        />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column (2 Cols): FireMap */}
          <section className="lg:col-span-2 relative min-h-[600px] h-[600px] bg-[#1e293b] rounded-xl border border-slate-700/60 shadow-xl overflow-hidden">
            {/* Loading Overlay */}
            {loading && (
              <div className="absolute inset-0 z-[1000] bg-slate-950/75 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                <div className="w-9 h-9 border-3 border-red-500 border-t-transparent rounded-full animate-spin" />
                <span className="font-mono text-xs text-red-300 tracking-wider">
                  🛰️ IGNIS fetching satellite data...
                </span>
              </div>
            )}
            <FireMap fires={filteredFires} />
          </section>

          {/* Right Column (1 Col): StatsPanel + AlertPanel stacked */}
          <aside className="flex flex-col gap-4">
            <StatsPanel stats={stats} />
            <AlertPanel alerts={alerts} />
          </aside>
        </div>

        {/* Case Studies Component Below Main Grid */}
        <CaseStudies />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#0b1120] py-3 px-4 text-center text-xs text-slate-500 font-mono">
        Data: NASA FIRMS (VIIRS) | OpenStreetMap | IGNIS v1.0
      </footer>

      {/* About Modal */}
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </div>
  );
}
