"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import type { Fire, ScenarioOverlayState } from "@/components/FireMap";
import { TILE_PRESETS } from "@/components/FireMap";
import StatsPanel, { FireStats } from "@/components/StatsPanel";
import AlertPanel, { AlertItem } from "@/components/AlertPanel";
import FilterBar from "@/components/FilterBar";
import AboutModal from "@/components/AboutModal";
import IndustrialRegistry, { IndustrialFacility } from "@/components/IndustrialRegistry";
import VerifyPanel from "@/components/VerifyPanel";
import { FALLBACK_TELEMETRY_DATA, FALLBACK_ALERTS_DATA } from "@/data/fallbackFires";
import { DEMO_TELEMETRY_DATA } from "@/data/demoFires";
import { SIMULATION_SCENARIOS, SimulationScenario } from "@/data/scenarios";
import EmergencyPanel, { playTacticalAlertSound } from "@/components/EmergencyPanel";
import DispatchSimulator from "@/components/DispatchSimulator";
import DispatchHistory from "@/components/DispatchHistory";
import Header from "@/components/Header";
import ScenarioPlayer from "@/components/ScenarioPlayer";

const FireMap = dynamic(() => import("@/components/FireMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[500px] flex flex-col items-center justify-center bg-[#0a0e14] text-[#6b7785] font-mono text-xs gap-2 border border-[#1f2933]">
      <div className="text-[#00ff9c] font-bold tracking-widest">[ + ] INITIALIZING TELEMETRY CARTOGRAPHY...</div>
      <div className="text-[10px] text-[#4a5563]">PROTOCOL: ESRI-DARK / VIIRS SENSOR MESH</div>
    </div>
  ),
});

// Resilient API base URL resolution:
// In browser environment, use relative same-origin path to route through Next.js proxy,
// preventing ISP DNS blocks on Railway and avoiding CORS preflight failures.
const getApiBaseUrl = () => {
  if (typeof window !== "undefined") {
    if (process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL.includes("localhost")) {
      return process.env.NEXT_PUBLIC_API_URL;
    }
    return "";
  }
  return process.env.NEXT_PUBLIC_API_URL || "https://web-production-b1e6a.up.railway.app";
};

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

  // Operational Mode State: "LIVE" | "CACHED" | "DEMO"
  const [mode, setMode] = useState<"LIVE" | "CACHED" | "DEMO">("LIVE");
  const [modeInfo, setModeInfo] = useState<{
    mode?: string;
    since?: string;
    reason?: string;
    data_source?: string;
    is_manual?: boolean;
  }>({
    mode: "LIVE",
    data_source: "NASA FIRMS Real-Time",
    reason: "System boot default",
  });

  // Simulation Scenarios State
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>("live");
  const [isScenarioPlaying, setIsScenarioPlaying] = useState<boolean>(false);
  const [scenarioOverlay, setScenarioOverlay] = useState<ScenarioOverlayState | null>(null);
  const [targetZoom, setTargetZoom] = useState<number>(5);

  // Emergency Panel & Dispatch Simulator State
  const [isEmergencyPanelOpen, setIsEmergencyPanelOpen] = useState<boolean>(false);
  const [emergencyActiveFire, setEmergencyActiveFire] = useState<Fire | null>(null);

  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState<boolean>(false);
  const [dispatchTargetFire, setDispatchTargetFire] = useState<Fire | null>(null);
  const [dispatchTargetStation, setDispatchTargetStation] = useState<any | null>(null);
  const [isDispatchHistoryOpen, setIsDispatchHistoryOpen] = useState<boolean>(false);

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

  // Fetch initial mode state on mount
  useEffect(() => {
    const baseUrl = getApiBaseUrl();
    axios
      .get(`${baseUrl}/api/mode`)
      .then((res) => {
        if (res.data?.mode) {
          const m = res.data.mode.toUpperCase() as "LIVE" | "CACHED" | "DEMO";
          setMode(m);
          setModeInfo(res.data);
        }
      })
      .catch((err) => {
        console.warn("[IGNIS] Could not fetch mode status:", err);
      });
  }, []);

  // Format UTC timestamp for sync
  const getUtcTimestamp = () => {
    return new Date().toISOString().replace(/\.\d{3}/, "");
  };

  // Fetch fires and active surveillance alerts with multi-tier failover
  const fetchData = useCallback(
    async (forceRefresh = false, modeOverride?: "LIVE" | "CACHED" | "DEMO") => {
      const activeQueryMode = modeOverride || mode;
      try {
        if (forceRefresh) {
          setIsRefreshing(true);
        } else {
          setLoading(true);
        }
        setError(null);

        // Immediate DEMO mode short-circuit
        if (activeQueryMode === "DEMO") {
          const demoFires = DEMO_TELEMETRY_DATA.fires as Fire[];
          setFires(demoFires);
          setStats(DEMO_TELEMETRY_DATA.summary);
          setIgnisStatus("live");
          setStatusMessage("DEMO SIMULATION ACTIVE (250 PRE-CLASSIFIED FIRES)");
          setLastRefreshedUtc(getUtcTimestamp());
          setLoading(false);
          setIsRefreshing(false);
          return;
        }

        const baseUrl = getApiBaseUrl();
        const firesUrl = `${baseUrl}/api/fires?days=${days}&source=${source}&mode=${activeQueryMode}${
          forceRefresh ? "&force=true" : ""
        }`;
        const alertsUrl = `${baseUrl}/api/alerts?hours=24`;

        let firesData: any = null;
        let alertsData: any = null;

        try {
          // Tier 1: Fetch via Next.js proxy route (bypasses ISP DNS and CORS)
          const [firesRes, alertsRes] = await Promise.all([
            axios.get(firesUrl, { timeout: 10000 }),
            axios.get(alertsUrl, { timeout: 8000 }).catch(() => ({ data: { alerts: [] } })),
          ]);
          firesData = firesRes.data;
          alertsData = alertsRes.data;
        } catch (proxyErr) {
          console.warn("[IGNIS] Primary proxy link unavailable, attempting direct node call...", proxyErr);
          // Tier 2: Direct Railway call fallback
          try {
            const directFiresUrl = `https://web-production-b1e6a.up.railway.app/api/fires?days=${days}&source=${source}&mode=${activeQueryMode}${
              forceRefresh ? "&force=true" : ""
            }`;
            const [directRes, directAlerts] = await Promise.all([
              axios.get(directFiresUrl, { timeout: 8000 }),
              axios.get("https://web-production-b1e6a.up.railway.app/api/alerts?hours=24", { timeout: 6000 }).catch(() => ({ data: { alerts: [] } })),
            ]);
            firesData = directRes.data;
            alertsData = directAlerts.data;
          } catch (directErr) {
            console.warn("[IGNIS] Direct node also unreachable. Engaging verified satellite telemetry cache:", directErr);
            // Tier 3: Immediate fallback to verified satellite cache
            firesData = FALLBACK_TELEMETRY_DATA;
            alertsData = FALLBACK_ALERTS_DATA;
            setError("NODE UNREACHABLE :: OPERATING IN LOCAL CACHED VERIFICATION MODE");
          }
        }

        const fetchedFires: Fire[] = Array.isArray(firesData?.fires)
          ? firesData.fires
          : (FALLBACK_TELEMETRY_DATA.fires as Fire[]);
        setFires(fetchedFires);
        setStats(firesData?.summary || FALLBACK_TELEMETRY_DATA.summary);

        const fetchedAlerts = Array.isArray(alertsData?.alerts)
          ? alertsData.alerts
          : [];
        setAlerts(fetchedAlerts);

        const backendStatus = firesData?.ignis_status === "live" ? "live" : "cached_fallback";
        setIgnisStatus(backendStatus);
        const resolvedMode = (firesData?.mode || (backendStatus === "live" ? "LIVE" : "CACHED")).toUpperCase() as "LIVE" | "CACHED" | "DEMO";
        setMode(resolvedMode);
        setStatusMessage(firesData?.message || (backendStatus === "live" ? "NASA-FIRMS LINK NOMINAL" : "SERVING LOCAL CACHE REPOSITORY"));
        setLastRefreshedUtc(getUtcTimestamp());
        setSeqCounter((c) => c + 1);

        if (forceRefresh) {
          setNotification(`[SYNC COMPLETE] INGESTED ${fetchedFires.length} THERMAL ANOMALIES`);
          setTimeout(() => setNotification(null), 3000);
        }
      } catch (err: any) {
        console.error("TELEMETRY FETCH ERROR:", err);
        setFires(FALLBACK_TELEMETRY_DATA.fires as Fire[]);
        setStats(FALLBACK_TELEMETRY_DATA.summary);
        setError("NODE UNREACHABLE :: OPERATING IN LOCAL CACHED VERIFICATION MODE");
        setIgnisStatus("cached_fallback");
        setMode("CACHED");
        setStatusMessage("OFFLINE FALLBACK MODE");
        setLastRefreshedUtc(getUtcTimestamp());
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    },
    [days, source, mode]
  );

  // Operational Mode Switcher: LIVE | CACHED | DEMO | AUTO
  const handleSelectMode = useCallback(
    async (targetMode: "LIVE" | "CACHED" | "DEMO" | "AUTO") => {
      try {
        const baseUrl = getApiBaseUrl();
        const res = await axios.post(`${baseUrl}/api/mode/set?mode=${targetMode}`, { mode: targetMode });
        const newMode = (res.data?.new_mode || (targetMode === "AUTO" ? "LIVE" : targetMode)).toUpperCase() as "LIVE" | "CACHED" | "DEMO";
        setMode(newMode);
        setNotification(`Mode switched to ${newMode}`);
        setTimeout(() => setNotification(null), 3500);

        axios
          .get(`${baseUrl}/api/mode`)
          .then((r) => setModeInfo(r.data))
          .catch(() => {});

        fetchData(true, newMode);
      } catch {
        const fallbackMode = (targetMode === "AUTO" ? "LIVE" : targetMode).toUpperCase() as "LIVE" | "CACHED" | "DEMO";
        setMode(fallbackMode);
        setNotification(`Mode switched to ${fallbackMode}`);
        setTimeout(() => setNotification(null), 3500);
        fetchData(true, fallbackMode);
      }
    },
    [fetchData]
  );

  // Scenario Selector & Animated Playback Control
  const handleSelectScenario = useCallback(
    (scenId: string) => {
      setSelectedScenarioId(scenId);
      if (scenId === "live") {
        setIsScenarioPlaying(false);
        setScenarioOverlay(null);
        setTargetCoords([22.5432, 78.9012]);
        setTargetZoom(5);
        handleSelectMode("LIVE");
        return;
      }

      setMode("DEMO");
      setIsScenarioPlaying(false);
      setScenarioOverlay(null);
    },
    [handleSelectMode]
  );

  const togglePlayScenario = useCallback(() => {
    if (selectedScenarioId === "live") return;
    setIsScenarioPlaying((prev) => !prev);
  }, [selectedScenarioId]);

  // Dispatch Trigger Helper
  const handleOpenDispatchModal = useCallback((fire: Fire) => {
    setDispatchTargetFire(fire);
    setDispatchTargetStation({
      name: (fire as any).station_name || "Surat Central Fire Station",
      distance_km: (fire as any).station_distance_km || 2.3,
      eta_minutes: (fire as any).station_eta_minutes || 6,
      phone: "+91-261-2422222",
    });
    setIsDispatchModalOpen(true);
  }, []);

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
    <div
      className={`min-h-screen text-[#d0d8e0] font-mono flex flex-col antialiased select-none transition-colors duration-500 ${
        mode === "LIVE" ? "mode-bg-live" : mode === "CACHED" ? "mode-bg-cached" : "mode-bg-demo"
      }`}
    >
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
      {/* 2) MAIN HEADER ROW WITH OPERATIONAL MODE PILL & DROPDOWN                  */}
      {/* ========================================================================= */}
      <Header
        currentMode={mode}
        modeInfo={modeInfo}
        onSelectMode={handleSelectMode}
        selectedScenarioId={selectedScenarioId}
        onSelectScenario={handleSelectScenario}
        isScenarioPlaying={isScenarioPlaying}
        onTogglePlayScenario={togglePlayScenario}
        seqCounter={seqCounter}
        utcClock={utcClock}
        latencyStr={latencyStr}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenEmergencyPanel={() => setIsEmergencyPanelOpen(true)}
        onOpenDispatchHistory={() => setIsDispatchHistoryOpen(true)}
      />

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
          {/* Quick Trigger Emergency Panel Button */}
          <button
            onClick={() => {
              const crit = filteredFires.find(
                (f) => f.risk_level === "CRITICAL" || f.category === "EMERGENCY_INDUSTRIAL"
              );
              if (crit) setEmergencyActiveFire(crit);
              setIsEmergencyPanelOpen((prev) => !prev);
            }}
            className="border border-[#ff3b3b] bg-[#ff3b3b]/15 px-2 py-0.5 text-[#ff8080] hover:bg-[#ff3b3b]/30 cursor-pointer text-[10px] font-bold flex items-center gap-1.5 transition"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff3b3b] animate-ping" />
            <span>[ 🚨 EMERGENCY PANEL ]</span>
          </button>
          <button
            onClick={() => setIsDispatchHistoryOpen(true)}
            className="border border-[#00d4ff]/60 bg-[#00d4ff]/10 px-2 py-0.5 text-[#00d4ff] hover:bg-[#00d4ff]/25 cursor-pointer text-[10px] font-bold flex items-center gap-1 transition"
          >
            <span>[ 📋 DISPATCH LOG ]</span>
          </button>
          <span>::</span>
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
              targetZoom={targetZoom}
              facilities={[]}
              onOpenVerify={(fire) => setVerifyFire(fire)}
              onOpenDispatch={(fire) => handleOpenDispatchModal(fire)}
              activeLayer={activeBasemap}
              onLayerChange={setActiveBasemap}
              scenarioOverlay={scenarioOverlay}
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
              onOpenEmergencyPanel={() => setIsEmergencyPanelOpen(true)}
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

      {/* Feature 4: Emergency Notification Panel (Slide-in right) */}
      <EmergencyPanel
        isOpen={isEmergencyPanelOpen}
        onClose={() => setIsEmergencyPanelOpen(false)}
        activeFire={emergencyActiveFire}
        onOpenDispatch={(fire) => handleOpenDispatchModal(fire)}
        onPanToFire={(coords) => setTargetCoords(coords)}
      />

      {/* Feature 5: Nearest Fire Station & Dispatch Simulation Modal */}
      <DispatchSimulator
        isOpen={isDispatchModalOpen}
        onClose={() => setIsDispatchModalOpen(false)}
        fire={dispatchTargetFire}
        station={dispatchTargetStation}
        onOpenHistory={() => setIsDispatchHistoryOpen(true)}
        onDispatchComplete={(rec) => {
          setNotification(`[DISPATCH RECORDED] REF #${rec.dispatch_id}`);
          setTimeout(() => setNotification(null), 4000);
        }}
      />

      {/* Feature 5B: Dispatch Telemetry History Modal */}
      <DispatchHistory
        isOpen={isDispatchHistoryOpen}
        onClose={() => setIsDispatchHistoryOpen(false)}
        onPanToCoords={(coords) => setTargetCoords(coords)}
      />

      {/* Feature 6: Simulation Scenario Playback Controller & Narration Overlay */}
      <ScenarioPlayer
        selectedScenarioId={selectedScenarioId}
        isPlaying={isScenarioPlaying}
        onPlayStateChange={setIsScenarioPlaying}
        onScenarioSelect={handleSelectScenario}
        onUpdateFires={(scenarioFires) => setFires(scenarioFires)}
        onUpdateStats={(scenarioStats) => setStats(scenarioStats)}
        onUpdateTargetCoords={(coords, zoom) => {
          setTargetCoords(coords);
          if (zoom) setTargetZoom(zoom);
        }}
        onTriggerEmergencyPanel={(fire) => {
          setEmergencyActiveFire(fire);
          setIsEmergencyPanelOpen(true);
        }}
        onTriggerDispatch={(fire, station) => {
          setDispatchTargetFire(fire);
          if (station) setDispatchTargetStation(station);
          setIsDispatchModalOpen(true);
        }}
        onUpdateOverlay={(overlay) => setScenarioOverlay(overlay)}
        onCompleteReturnToLive={() => {
          setSelectedScenarioId("live");
          setIsScenarioPlaying(false);
          setScenarioOverlay(null);
          setTargetCoords([22.5432, 78.9012]);
          setTargetZoom(5);
          handleSelectMode("LIVE");
        }}
      />

      {/* Demo Mode Watermark */}
      {mode === "DEMO" && (
        <div className="demo-watermark">
          DEMO MODE // SIMULATED TELEMETRY
        </div>
      )}
    </div>
  );
}
