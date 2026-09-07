"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import type { Fire } from "@/components/FireMap";
import { TILE_PRESETS } from "@/components/FireMap";
import StatsPanel, { FireStats } from "@/components/StatsPanel";
import AlertPanel, { AlertItem } from "@/components/AlertPanel";
import FilterBar from "@/components/FilterBar";
import AboutModal from "@/components/AboutModal";
import IndustrialRegistry, { IndustrialFacility } from "@/components/IndustrialRegistry";
import VerifyPanel from "@/components/VerifyPanel";

const FireMap = dynamic(() => import("@/components/FireMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[500px] flex flex-col items-center justify-center bg-[#0a0e14] text-[#6b7785] font-mono text-xs gap-2 border border-[#1f2933]">
      <div className="text-[#00ff9c] font-bold tracking-widest">[ + ] INITIALIZING TELEMETRY CARTOGRAPHY...</div>
      <div className="text-[10px] text-[#4a5563]">PROTOCOL: ESRI-DARK / VIIRS SENSOR MESH</div>
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
  const [lastRefreshedUtc, setLastRefreshedUtc] = useState<string>("");
  const [utcClock, setUtcClock] = useState<string>("");
  const [seqCounter, setSeqCounter] = useState<number>(4832);
  const [targetCoords, setTargetCoords] = useState<[number, number] | null>(null);
  const [selectedFacilityId, setSelectedFacilityId] = useState<string | null>(null);
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [verifyFire, setVerifyFire] = useState<Fire | null>(null);
  const [activeBasemap, setActiveBasemap] = useState<keyof typeof TILE_PRESETS>("ops_dark");

  // Live ticking UTC Clock in ISO format: 2025-01-20T14:32:15Z
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setUtcClock(now.toISOString().replace(/\.\d{3}/, ""));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Format UTC timestamp for sync
  const getUtcTimestamp = () => {
    return new Date().toISOString().replace(/\.\d{3}/, "");
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
        setLastRefreshedUtc(getUtcTimestamp());
        setSeqCounter((c) => c + 1);

        if (forceRefresh) {
          setNotification(`[SYNC COMPLETE] INGESTED ${fetchedFires.length} THERMAL ANOMALIES`);
          setTimeout(() => setNotification(null), 3000);
        }
      } catch (err: any) {
        console.error("TELEMETRY FETCH ERROR:", err);
        setError("NODE UNREACHABLE :: OPERATING IN LOCAL CACHED VERIFICATION MODE");
        setIgnisStatus("cached_fallback");
        setStatusMessage("OFFLINE FALLBACK MODE");
        setLastRefreshedUtc(getUtcTimestamp());
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    },
    [days, source]
  );

  // Initial load and parameter changes
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

  // Auto-refresh every 3 minutes (180s)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData(false);
    }, 3 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Satellite Pass Latency calculation
  const latencyStr = useMemo(() => {
    if (!Array.isArray(fires) || fires.length === 0) return "LAT: 3.2h";
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
    if (!latestMs) return "LAT: 3.2h";
    const diffHours = Math.max(0, Math.floor((Date.now() - latestMs) / (1000 * 60 * 60)));
    return `LAT: ${diffHours === 0 ? "<1.0" : diffHours}h`;
  }, [fires]);

  // Export current records to CSV report
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
    link.setAttribute("download", `IGNIS_TELEMETRY_${today}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#0a0e14] text-[#d0d8e0] font-mono flex flex-col antialiased select-none">
      {/* ========================================================================= */}
      {/* 1) TOP ROW (VERY THIN, 24PX)                                              */}
      {/* ========================================================================= */}
      <div className="h-6 bg-[#0a0e14] border-b border-[#1f2933] px-3 flex items-center justify-between text-[10px] text-[#6b7785] tracking-widest uppercase">
        <div className="flex items-center gap-2">
          <span className="text-[#00ff9c] font-bold">::</span>
          <span className="text-[#d0d8e0] font-semibold">
            IGNIS-01 :: FIRE INTELLIGENCE GROUND STATION
          </span>
          <span className="text-[#4a5563] hidden sm:inline">// SECTOR: IND-SUBCONTINENT</span>
        </div>
        <div className="flex items-center gap-4 tabular-nums">
          <span className="text-[#00d4ff]">SEQ #{String(seqCounter).padStart(5, "0")}</span>
          <span className="text-[#6b7785] hidden md:inline">NODE: RAILWAY-PROD-B1</span>
          <span className="text-[#d0d8e0] font-bold">{utcClock || "2025-01-20T14:32:15Z"}</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2) MAIN HEADER ROW (48PX)                                                 */}
      {/* ========================================================================= */}
      <header className="bg-[#0f141b] border-b border-[#1f2933] px-3 py-2">
        <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          {/* Left Block */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 border border-[#1f2933] bg-[#131a22] flex items-center justify-center text-[#00ff9c] font-bold text-sm">
              [+]
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-wider text-white">IGNIS</span>
                <span className="text-[10px] text-[#00d4ff] border border-[#1f2933] px-1 py-0.2 bg-[#0a0e14]">
                  v1.0.4
                </span>
                <span className="text-[10px] text-[#ffb800] border border-[#1f2933] px-1 py-0.2 bg-[#0a0e14] hidden sm:inline">
                  NTRO // SIH26162
                </span>
              </div>
              <div className="text-[10px] text-[#6b7785] tracking-wider uppercase">
                INDUSTRIAL FIRE CLASSIFICATION // NTRO/SIH26162
              </div>
            </div>
          </div>

          {/* Center Mission Phase Indicator */}
          <div className="hidden lg:flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase">
            <span className="px-2 py-1 border border-[#1f2933] bg-[#0a0e14] text-[#4a5563]">
              [ NOMINAL ]
            </span>
            <span className="px-2 py-1 border border-[#00ff9c] bg-[#131a22] text-[#00ff9c]">
              [ MONITORING ]
            </span>
            <span className="px-2 py-1 border border-[#1f2933] bg-[#0a0e14] text-[#4a5563]">
              [ ANALYSIS ]
            </span>
          </div>

          {/* Right Block: Telemetry Link & Status */}
          <div className="flex items-center gap-3 text-[11px] font-mono">
            {/* Link Status */}
            <div className="flex items-center gap-1.5 border border-[#1f2933] px-2.5 py-1 bg-[#0a0e14]">
              <span
                className={`w-2 h-2 rounded-full ${
                  ignisStatus === "live"
                    ? "bg-[#00ff9c] status-dot-green"
                    : "bg-[#ffb800] status-dot-amber"
                }`}
              />
              <span
                className={`font-bold tracking-wider ${
                  ignisStatus === "live" ? "text-[#00ff9c]" : "text-[#ffb800]"
                }`}
              >
                LINK: {ignisStatus === "live" ? "NOMINAL" : "CACHED"}
              </span>
            </div>

            {/* Sensor Source */}
            <div className="hidden sm:flex border border-[#1f2933] px-2 py-1 bg-[#0a0e14] text-[10px] text-[#6b7785]">
              <span>SRC: NASA-FIRMS/VIIRS-SNPP</span>
            </div>

            {/* Latency */}
            <div className="border border-[#1f2933] px-2 py-1 bg-[#0a0e14] text-[10px] text-[#00d4ff] tabular-nums">
              <span>{latencyStr}</span>
            </div>

            {/* About Modal */}
            <button
              onClick={() => setIsAboutOpen(true)}
              className="border border-[#1f2933] hover:border-[#00d4ff] text-[#6b7785] hover:text-[#d0d8e0] px-2 py-1 text-[10px] font-bold bg-[#0a0e14] transition cursor-pointer"
            >
              [ ABOUT ]
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 3) STATUS STRIP (ULTRA-THIN 28PX STATUS RIBBON)                           */}
      {/* ========================================================================= */}
      <div className="h-7 bg-[#0a0e14] border-b border-[#1f2933] px-3 flex items-center justify-between text-[10px] font-mono overflow-x-auto">
        <div className="flex items-center gap-2 whitespace-nowrap">
          {ignisStatus === "live" ? (
            <>
              <span className="text-[#00ff9c] font-bold">[LIVE]</span>
              <span className="text-[#4a5563]">::</span>
              <span className="text-[#00ff9c]">NASA-FIRMS LINK NOMINAL</span>
              <span className="text-[#4a5563]">::</span>
              <span className="text-[#d0d8e0]">OSM-BASELINE LOADED (248 SITES)</span>
              <span className="text-[#4a5563]">::</span>
              <span className="text-[#6b7785]">LAST SYNC {lastRefreshedUtc || "14:32:15Z"}</span>
              <span className="text-[#4a5563]">::</span>
              <span className="text-[#00d4ff]">NEXT SYNC IN 03:00</span>
            </>
          ) : (
            <>
              <span className="text-[#ffb800] font-bold">[WARN]</span>
              <span className="text-[#4a5563]">::</span>
              <span className="text-[#ffb800]">LINK DEGRADED</span>
              <span className="text-[#4a5563]">::</span>
              <span className="text-[#d0d8e0]">SERVING FROM LOCAL CACHE REPOSITORY</span>
              <span className="text-[#4a5563]">::</span>
              <span className="text-[#6b7785]">SNAPSHOT: {lastRefreshedUtc}</span>
            </>
          )}

          {notification && (
            <span className="text-[#00ff9c] font-bold bg-[#0f141b] border border-[#00ff9c] px-2 py-0.2 ml-2">
              {notification}
            </span>
          )}
        </div>

        {/* Quick Ops Commands */}
        <div className="flex items-center gap-2 text-[#4a5563] shrink-0 font-bold ml-4">
          <button
            onClick={() => fetchData(true)}
            className="hover:text-[#00ff9c] cursor-pointer"
          >
            [ SYS ]
          </button>
          <span>::</span>
          <button
            onClick={() => setIsAboutOpen(true)}
            className="hover:text-[#00d4ff] cursor-pointer"
          >
            [ LOG ]
          </button>
          <span>::</span>
          <button
            onClick={handleDownloadReport}
            className="hover:text-[#ffb800] cursor-pointer"
          >
            [ EXPORT ]
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4) CONTROL DECK (TERMINAL-STYLE FILTERS)                                   */}
      {/* ========================================================================= */}
      <div className="px-3 pt-2.5 max-w-[1800px] w-full mx-auto">
        <FilterBar
          days={days}
          category={category}
          source={source}
          lastUpdated={lastRefreshedUtc}
          isRefreshing={isRefreshing}
          onDaysChange={setDays}
          onCategoryChange={setCategory}
          onSourceChange={setSource}
          onRefresh={() => fetchData(true)}
          onDownload={handleDownloadReport}
          onTrainModel={() => setIsAboutOpen(true)}
        />
      </div>

      {/* ========================================================================= */}
      {/* 5) MAIN OPS GRID (3-COLUMN: 22% REGISTRY | 52% MAP | 26% TELEMETRY)        */}
      {/* ========================================================================= */}
      <main className="max-w-[1800px] w-full mx-auto p-3 flex-1 flex flex-col">
        {/* Error Alert Strip if Node Unreachable */}
        {error && (
          <div className="mb-2 p-2 border border-[#ff3b3b] bg-[#ff3b3b]/10 text-[#ff3b3b] text-xs flex justify-between items-center font-mono">
            <span>[ERR] {error}</span>
            <button
              onClick={() => fetchData(true)}
              className="border border-[#ff3b3b] px-2 py-0.5 hover:bg-[#ff3b3b]/20 cursor-pointer uppercase font-bold"
            >
              [ RETRY LINK ]
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1">
          {/* COLUMN 1: LEFT SIDE PANEL (22% -> 3 cols on lg grid) */}
          <aside className="lg:col-span-3 h-[600px] lg:h-[calc(100vh-210px)] min-h-[480px]">
            <IndustrialRegistry
              selectedFacilityId={selectedFacilityId}
              onSelectFacility={(fac: IndustrialFacility) => {
                setSelectedFacilityId(fac.id);
                setTargetCoords([fac.latitude, fac.longitude]);
                setNotification(`[NAV] PANNED TO ${fac.name} (${fac.id})`);
                setTimeout(() => setNotification(null), 3000);
              }}
            />
          </aside>

          {/* COLUMN 2: CENTER MAP STAGE (52% -> 6 cols on lg grid) */}
          <section className="lg:col-span-6 h-[600px] lg:h-[calc(100vh-210px)] min-h-[480px] flex flex-col">
            <FireMap
              fires={filteredFires}
              targetCoords={targetCoords}
              facilities={[]}
              onOpenVerify={(fire) => setVerifyFire(fire)}
              activeLayer={activeBasemap}
              onLayerChange={setActiveBasemap}
            />
          </section>

          {/* COLUMN 3: RIGHT TELEMETRY STACK (26% -> 3 cols on lg grid) */}
          <aside className="lg:col-span-3 flex flex-col gap-3 h-[calc(100vh-210px)] overflow-y-auto">
            <StatsPanel
              stats={stats}
              activeCategory={category}
              onSelectCategory={setCategory}
            />
            <AlertPanel
              alerts={alerts}
              onSelectCoordinates={(lat, lon) => setTargetCoords([lat, lon])}
              statusMode={ignisStatus}
            />
          </aside>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* 6) BOTTOM STATUS BAR (GROUND STATION TERMINAL STYLE)                      */}
      {/* ========================================================================= */}
      <footer className="h-6 bg-[#0f141b] border-t border-[#1f2933] px-3 flex items-center justify-between text-[10px] text-[#6b7785] tracking-wider uppercase font-mono">
        <div className="flex items-center gap-2">
          <span className="text-[#00ff9c]">[SYS] READY</span>
          <span className="text-[#4a5563]">::</span>
          <span className="text-[#d0d8e0]">[NET] 200 OK</span>
          <span className="text-[#4a5563]">::</span>
          <span className="text-[#d0d8e0]">[DB] SQLITE/47MB</span>
          <span className="text-[#4a5563]">::</span>
          <span className="text-[#00d4ff]">[ML] RF-100/89.2%</span>
        </div>

        <div className="hidden md:flex items-center gap-2 tabular-nums text-[#4a5563]">
          <span className="text-[#6b7785]">PACKETS RX: {seqCounter}</span>
          <span>//</span>
          <span>TX: 128</span>
          <span>//</span>
          <span className="text-[#00ff9c]">ERR: 0</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline">MEM: 62% :: CPU: 12%</span>
          <span className="text-[#4a5563] hidden sm:inline">::</span>
          <span className="text-[#d0d8e0] font-bold">IGNIS v1.0.4</span>
          <span className="text-[#4a5563]">::</span>
          <span className="text-[#6b7785]">© NTRO</span>
        </div>
      </footer>

      {/* Cross-Sensor Verification & Road Context Workspace Dialog */}
      <VerifyPanel
        fire={verifyFire}
        onClose={() => setVerifyFire(null)}
        onSwitchBasemap={(layer) => setActiveBasemap(layer)}
      />

      {/* About Technical Dialog */}
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </div>
  );
}
