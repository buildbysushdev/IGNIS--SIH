"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Rectangle, Popup, Circle, Polygon, useMapEvents } from "react-leaflet";
import ResponseProtocol from "./ResponseProtocol";
import ProtocolModal from "./ProtocolModal";
import WeatherWidget from "./WeatherWidget";
import type { SpreadPredictionData } from "./SpreadPrediction";
import { FIRE_STATIONS } from "@/data/fireStations";
import { useI18n } from "@/context/I18nContext";
import InfoTooltip from "@/components/InfoTooltip";


export interface Fire {
  id?: string;
  latitude: number;
  longitude: number;
  brightness: number;
  frp: number;
  confidence: string | number;
  acq_date: string;
  acq_time: string;
  satellite?: string;
  category: string;
  risk_level: string;
  color?: string;
  reason: string;
  action: string;
  facility_name?: string;
  nearest_facility?: string;
  facility_type?: string;
  facility_dist?: number;
  distance_km?: number;
  station_name?: string;
  station_distance_km?: number;
  station_eta_minutes?: number;
}

export interface FacilityMarker {
  id: string;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
}

export interface ScenarioOverlayState {
  evacuationCircle?: { center: [number, number]; radius_km: number } | null;
  windCone?: [number, number][] | null;
  stationMarker?: { name: string; lat: number; lon: number; distance_km?: number } | null;
  pulseMarker?: [number, number] | null;
}

// Strict Ground Station Color Coding (High Contrast, Phosphor & Modern Mission Accents)
export const TERMINAL_COLORS: Record<string, string> = {
  EMERGENCY_INDUSTRIAL: "#EF4444", // Crimson Red
  PERSISTENT_INDUSTRIAL: "#F59E0B", // Gold / Amber
  AGRICULTURAL_BURNING: "#F97316", // Warm Orange
  FOREST_FIRE: "#22C55E", // Emerald Green
  UNKNOWN: "#9CA3AF", // Slate Gray
};

export function getMarkerColor(category: string): string {
  return TERMINAL_COLORS[category] || "#9CA3AF";
}

export const TILE_PRESETS = {
  ops_dark: {
    id: "ops_dark",
    name: "OPS DARK",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    subdomains: "abc",
  },
  satellite: {
    id: "satellite",
    name: "SATELLITE",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    subdomains: "abc",
  },
  hybrid: {
    id: "hybrid",
    name: "HYBRID",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    subdomains: "abc",
  },
};

// Map telemetry listener & pan controller
function MapTelemetryController({
  targetCoords,
  targetZoom = 10,
  onCoordsChange,
}: {
  targetCoords?: [number, number] | null;
  targetZoom?: number;
  onCoordsChange: (lat: number, lon: number, zoom: number) => void;
}) {
  const map = useMapEvents({
    move: () => {
      const center = map.getCenter();
      onCoordsChange(center.lat, center.lng, map.getZoom());
    },
    zoomend: () => {
      const center = map.getCenter();
      onCoordsChange(center.lat, center.lng, map.getZoom());
    },
  });

  useEffect(() => {
    if (targetCoords) {
      map.flyTo(targetCoords, targetZoom || 10, { duration: 1.4 });
    }
  }, [targetCoords, targetZoom, map]);

  return null;
}

export function findLocalNearestStation(lat: number, lon: number) {
  let nearest = FIRE_STATIONS[0];
  let minD = 999999;
  for (let i = 0; i < FIRE_STATIONS.length; i++) {
    const s = FIRE_STATIONS[i];
    const d = Math.hypot(s.lat - lat, (s.lon - lon) * Math.cos((lat * Math.PI) / 180)) * 111;
    if (d < minD) {
      minD = d;
      nearest = s;
    }
  }
  const distKm = Math.round(minD * 10) / 10;
  const eta = Math.max(3, Math.round(2 + (distKm / 45) * 60));
  return { ...nearest, distance_km: distKm, eta_minutes: eta };
}

interface FireMapProps {
  fires?: Fire[];
  targetCoords?: [number, number] | null;
  targetZoom?: number;
  facilities?: FacilityMarker[];
  onSelectFire?: (fire: Fire) => void;
  onOpenVerify?: (fire: Fire) => void;
  onOpenDispatch?: (fire: Fire) => void;
  onOpenHistory?: (fire: Fire) => void;
  onOpenSpreadPrediction?: (fire: Fire) => void;
  spreadPredictionData?: SpreadPredictionData | null;
  selectedSpreadHour?: 1 | 3 | 6;
  showHistoricalHeatmap?: boolean;
  onToggleHistoricalHeatmap?: () => void;
  activeLayer?: keyof typeof TILE_PRESETS;
  onLayerChange?: (layer: keyof typeof TILE_PRESETS) => void;
  scenarioOverlay?: ScenarioOverlayState | null;
  onTryLast3Days?: () => void;
  onRetryLive?: () => void;
  onSwitchToDemo?: () => void;
}

export default function FireMap({
  fires = [],
  targetCoords,
  targetZoom,
  facilities = [],
  onSelectFire,
  onOpenVerify,
  onOpenDispatch,
  onOpenHistory,
  onOpenSpreadPrediction,
  spreadPredictionData,
  selectedSpreadHour = 6,
  showHistoricalHeatmap: externalShowHeatmap,
  onToggleHistoricalHeatmap,
  activeLayer: externalActiveLayer,
  onLayerChange,
  scenarioOverlay,
  onTryLast3Days,
  onRetryLive,
  onSwitchToDemo,
}: FireMapProps) {
  const { t } = useI18n();
  const safeFires = Array.isArray(fires) ? fires : [];
  const [internalLayer, setInternalLayer] = useState<keyof typeof TILE_PRESETS>("ops_dark");
  const activeLayer = externalActiveLayer || internalLayer;

  const handleSelectLayer = (key: keyof typeof TILE_PRESETS) => {
    setInternalLayer(key);
    if (onLayerChange) onLayerChange(key);
  };

  const [internalShowHeatmap, setInternalShowHeatmap] = useState<boolean>(false);
  const isHeatmapActive = externalShowHeatmap !== undefined ? externalShowHeatmap : internalShowHeatmap;

  const handleToggleHeatmap = () => {
    if (onToggleHistoricalHeatmap) {
      onToggleHistoricalHeatmap();
    } else {
      setInternalShowHeatmap((prev) => !prev);
    }
  };

  const [historicalDensity, setHistoricalDensity] = useState<any[]>([]);
  const [loadingDensity, setLoadingDensity] = useState<boolean>(false);

  useEffect(() => {
    if (!isHeatmapActive || historicalDensity.length > 0) return;
    let isMounted = true;
    setLoadingDensity(true);
    fetch("/api/history/density?limit=400")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && Array.isArray(data)) {
          setHistoricalDensity(data);
        }
      })
      .catch((err) => {
        console.warn("[IGNIS] Failed to load historical density layer:", err);
      })
      .finally(() => {
        if (isMounted) setLoadingDensity(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isHeatmapActive, historicalDensity.length]);

  const [currentCenter, setCurrentCenter] = useState<{ lat: number; lon: number; zoom: number }>({
    lat: 22.5432,
    lon: 78.9012,
    zoom: 5,
  });

  const [expandedProtocolFireId, setExpandedProtocolFireId] = useState<string | null>(null);
  const [modalProtocolFire, setModalProtocolFire] = useState<Fire | null>(null);

  const isCapped = safeFires.length > 1000;
  const renderedFires = isCapped ? safeFires.slice(0, 1000) : safeFires;
  const currentTile = TILE_PRESETS[activeLayer] || TILE_PRESETS.ops_dark;

  return (
    <div className="flex flex-col h-full w-full overflow-hidden border border-[#1F2937] bg-[#0B1220] rounded-xl shadow-lg relative font-sans">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-[#1F2937] px-3.5 py-2.5 bg-[#111827] text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-white">
            India Thermal Surveillance Map • <span className="text-[#22D3EE] font-mono">{renderedFires.length}</span> Active Hotspots
          </span>
        </div>

        {/* Top-Right Basemap Switcher & 5-Yr Heatmap */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#0B1220] p-0.5 rounded-lg border border-[#1F2937]">
            {(Object.keys(TILE_PRESETS) as Array<keyof typeof TILE_PRESETS>).map((key) => {
              const isActive = activeLayer === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleSelectLayer(key)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition ${
                    isActive
                      ? "bg-[#1F2937] text-[#22D3EE] font-semibold shadow-sm"
                      : "text-[#9CA3AF] hover:text-white"
                  }`}
                >
                  {key === "ops_dark" ? "Dark" : key === "satellite" ? "Satellite" : "Hybrid"}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleToggleHeatmap}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition flex items-center gap-1 ${
              isHeatmapActive
                ? "bg-amber-950/40 border-amber-500 text-amber-300 font-semibold"
                : "bg-[#0B1220] border-[#1F2937] text-[#9CA3AF] hover:text-white"
            }`}
            title="Toggle 5-Year Historical Fire Density Heatmap Layer"
          >
            <span>{isHeatmapActive ? "🔥" : "◒"}</span>
            <span>{isHeatmapActive ? "5Y Heatmap: ON" : "5Y Heatmap"}</span>
            {loadingDensity && <span className="animate-spin text-[9px]">◌</span>}
          </button>
        </div>
      </div>

      {/* Map Viewport Stage */}
      <div className="relative flex-1 w-full min-h-[480px]">
        {/* Leaflet Container */}
        <MapContainer
          center={[22.5, 78.9]}
          zoom={5}
          style={{ height: "100%", width: "100%", background: "#0a0e14" }}
          scrollWheelZoom={true}
        >
          <MapTelemetryController
            targetCoords={targetCoords}
            targetZoom={targetZoom}
            onCoordsChange={(lat, lon, zoom) => setCurrentCenter({ lat, lon, zoom })}
          />

          <TileLayer
            key={activeLayer}
            url={currentTile.url}
            attribution="&copy; NASA FIRMS &copy; Esri &copy; OpenStreetMap"
            subdomains={currentTile.subdomains || "abc"}
          />

          {/* Render Small Squares for Industrial Facilities */}
          {facilities.slice(0, 40).map((fac) => {
            const delta = 0.08;
            return (
              <Rectangle
                key={`fac-${fac.id}`}
                bounds={[
                  [fac.latitude - delta, fac.longitude - delta],
                  [fac.latitude + delta, fac.longitude + delta],
                ]}
                pathOptions={{
                  color: "#ffb800",
                  weight: 1,
                  fillColor: "#ffb800",
                  fillOpacity: 0.6,
                }}
              >
                <Popup>
                  <div className="font-mono text-xs text-[#d0d8e0] p-1 space-y-1.5 min-w-[200px]">
                    <div className="text-[10px] text-[#ffb800] border-b border-[#1f2933] pb-1 font-bold">
                      // INDUSTRIAL REGISTRY NODE :: {fac.id}
                    </div>
                    <div className="font-bold text-[#d0d8e0]">{fac.name}</div>
                    <div className="text-[10px] text-[#6b7785]">
                      TYPE : {fac.type}
                      <br />
                      POS  : {fac.latitude.toFixed(4)}°N, {fac.longitude.toFixed(4)}°E
                    </div>
                  </div>
                </Popup>
              </Rectangle>
            );
          })}

          {/* 5-Year Historical Fire Density Heatmap Layer (2021-2025) */}
          {isHeatmapActive &&
            historicalDensity.map((pt, idx) => {
              const intensity = Number(pt.intensity ?? 0.6);
              const color =
                intensity >= 0.85
                  ? "#ff3b3b"
                  : intensity >= 0.65
                  ? "#ff9500"
                  : intensity >= 0.45
                  ? "#ffb800"
                  : "#00d4ff";
              const markerRadius = Math.max(6, Math.min(14, Math.round(intensity * 12)));

              return (
                <CircleMarker
                  key={`hist-density-${pt.lat}-${pt.lon}-${idx}`}
                  center={[pt.lat, pt.lon]}
                  radius={markerRadius}
                  fillColor={color}
                  fillOpacity={0.22}
                  color={color}
                  weight={0.5}
                  opacity={0.4}
                >
                  <Popup>
                    <div className="font-mono text-xs text-[#d0d8e0] p-1.5 space-y-1.5 min-w-[230px]">
                      <div className="text-[10px] text-[#ffb800] border-b border-[#1f2933] pb-1 font-bold flex justify-between">
                        <span>// 5-YR HISTORIC DENSITY CELL</span>
                        <span className="text-[#00d4ff]">{pt.year || "2021-2025"}</span>
                      </div>
                      <div className="space-y-0.5 text-[10px] tabular-nums">
                        <div className="flex justify-between">
                          <span className="text-[#6b7785]">CELL COORDS:</span>
                          <span className="text-[#00d4ff]">
                            {Number(pt.lat).toFixed(4)}°N, {Number(pt.lon).toFixed(4)}°E
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#6b7785]">HISTORIC FRP:</span>
                          <span className="text-[#ffb800] font-bold">
                            {Number(pt.frp || 0).toFixed(1)} MW
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#6b7785]">RECURRENCE WEIGHT:</span>
                          <span className="text-[#00ff9c] font-bold">
                            {Math.round(intensity * 100)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#6b7785]">PREDOMINANT TYPE:</span>
                          <span className="text-[#d0d8e0] uppercase">
                            {String(pt.category || "INDUSTRIAL").replace(/_/g, " ")}
                          </span>
                        </div>
                      </div>

                      {onOpenHistory && (
                        <button
                          type="button"
                          onClick={() => {
                            onOpenHistory({
                              latitude: pt.lat,
                              longitude: pt.lon,
                              brightness: 345,
                              frp: pt.frp || 110,
                              confidence: "HISTORICAL",
                              acq_date: `${pt.year || 2024}-04-15`,
                              acq_time: "1130",
                              category: pt.category || "PERSISTENT_INDUSTRIAL",
                              risk_level: intensity >= 0.8 ? "CRITICAL" : "HIGH",
                              reason: "Historical multi-year cluster hotspot",
                              action: "Recurrence frequency audit",
                            });
                          }}
                          className="w-full mt-1 py-1 px-2 border border-[#00d4ff] bg-[#00d4ff]/15 hover:bg-[#00d4ff]/30 text-[#00d4ff] hover:text-white text-[10px] font-bold uppercase tracking-wider text-center cursor-pointer transition"
                        >
                          [ 📊 LAUNCH CELL HISTORY ]
                        </button>
                      )}
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}

          {/* Render Live Fire Hotspots (Rendered AFTER heatmap so markers are always visible on top) */}
          {renderedFires.map((fire, idx) => {
            const markerColor = getMarkerColor(fire.category);
            const isCritical = fire.risk_level === "CRITICAL" || fire.category === "EMERGENCY_INDUSTRIAL";
            const frpVal = Number(fire.frp || 0);
            let radius = 6;
            if (frpVal > 50) {
              radius = 12;
            } else if (frpVal >= 10) {
              radius = 9;
            } else {
              radius = 6;
            }
            if (isCritical) {
              radius = Math.max(radius + 2, 11);
            }
            const seqId = `ANOM-${String(idx + 1).padStart(4, "0")}`;

            // Clean reason and action to ensure strict ASCII
            const cleanReason = (fire.reason || "Satellite active thermal detection.")
              .replace(/[^\x20-\x7E]/g, "")
              .trim();
            const cleanAction = (fire.action || "Active continuous tracking.")
              .replace(/[^\x20-\x7E]/g, "")
              .trim();

            return (
              <CircleMarker
                key={`${fire.latitude}-${fire.longitude}-${idx}`}
                center={[fire.latitude, fire.longitude]}
                radius={radius}
                fillColor={markerColor}
                fillOpacity={0.92}
                color={isCritical ? "#ffffff" : "#0B1220"}
                weight={isCritical ? 2 : 1}
                className={isCritical ? "status-dot-red animate-pulse" : undefined}
                eventHandlers={{
                  click: () => {
                    if (onSelectFire) {
                      onSelectFire(fire);
                    } else if (onOpenVerify) {
                      onOpenVerify(fire);
                    }
                  },
                }}
              >
                <Popup>
                  <div className="font-mono text-xs text-[#d0d8e0] p-1.5 space-y-2 min-w-[260px]">
                    {/* Header */}
                    <div className="border-b border-[#1f2933] pb-1.5 flex items-center justify-between">
                      <span className="font-bold text-[11px] text-[#00d4ff]">
                        // THERMAL ANOMALY :: {seqId}
                      </span>
                      <span
                        className={`text-[9px] px-1 py-0.5 border font-bold uppercase ${
                          isCritical
                            ? "bg-[#ff3b3b]/20 border-[#ff3b3b] text-[#ff3b3b]"
                            : "bg-[#131a22] border-[#1f2933] text-[#6b7785]"
                        }`}
                      >
                        [{fire.risk_level || "NOMINAL"}]
                      </span>
                    </div>

                    {/* Telemetry Data Table */}
                    <div className="space-y-0.5 text-[11px] tabular-nums">
                      <div className="flex justify-between">
                        <span className="text-[#6b7785]">LAT      :</span>
                        <span className="text-[#00d4ff] font-semibold">{fire.latitude.toFixed(4)}°N</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#6b7785]">LON      :</span>
                        <span className="text-[#00d4ff] font-semibold">{fire.longitude.toFixed(4)}°E</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#6b7785]">FRP      :</span>
                        <span className="text-[#ffb800] font-bold">{Number(fire.frp || 0).toFixed(1)} MW</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#6b7785]">BRIGHT   :</span>
                        <span className="text-[#d0d8e0]">{Number(fire.brightness || 0).toFixed(1)} K</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#6b7785]">CONF     :</span>
                        <span className="text-[#00ff9c] uppercase">{String(fire.confidence || "NOMINAL")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#6b7785]">SAT      :</span>
                        <span className="text-[#d0d8e0]">VIIRS-SNPP</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#6b7785]">ACQ      :</span>
                        <span className="text-[#d0d8e0]">{fire.acq_date}T{fire.acq_time || "0000"}Z</span>
                      </div>
                    </div>

                    {/* Classification Section */}
                    <div className="border-t border-[#1f2933] pt-1.5">
                      <div className="text-[9px] uppercase tracking-wider text-[#6b7785] font-bold">
                        // CLASSIFICATION
                      </div>
                      <div className="flex justify-between text-[11px] mt-0.5">
                        <span className="text-[#6b7785]">CATEGORY :</span>
                        <span className="font-bold" style={{ color: markerColor }}>
                          {fire.category || "UNKNOWN"}
                        </span>
                      </div>
                      <div className="text-[10px] text-[#6b7785] mt-1 leading-snug">
                        {cleanReason}
                      </div>
                    </div>

                    {/* Nearest Fire Station Card */}
                    {(() => {
                      const nearestSt = findLocalNearestStation(fire.latitude, fire.longitude);
                      return (
                        <div className="border border-[#1f2933] bg-[#0c1017] p-1.5 text-[10px] space-y-0.5">
                          <div className="text-[#00d4ff] font-bold text-[9px] flex justify-between">
                            <span>// NEAREST RESPONSE UNIT</span>
                            <span className="text-[#00ff9c] font-bold">ETA: {nearestSt.eta_minutes} MIN</span>
                          </div>
                          <div className="text-white font-bold text-[10px] truncate">
                            {nearestSt.name}
                          </div>
                          <div className="flex justify-between text-[#6b7785] text-[9px] tabular-nums">
                            <span>DIST: {nearestSt.distance_km} KM</span>
                            <span>TEL: {nearestSt.phone}</span>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Collapsible Material Response Protocol Section */}
                    {(() => {
                      const fKey = `${fire.latitude}_${fire.longitude}`;
                      const isExpanded = expandedProtocolFireId === fKey;
                      return (
                        <div className="border border-[#1f2933] bg-[#0c1017] overflow-hidden">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedProtocolFireId(isExpanded ? null : fKey);
                            }}
                            className="w-full px-2 py-1 flex items-center justify-between text-[10px] font-bold text-[#00d4ff] bg-[#101721] hover:bg-[#15202c] cursor-pointer transition border-b border-[#1f2933]"
                          >
                            <span className="flex items-center gap-1.5">
                              <span>{isExpanded ? "▲" : "▼"}</span>
                              <span>RESPONSE PROTOCOL</span>
                            </span>
                            <span className="text-[9px] text-[#ffb800]">
                              {isExpanded ? "[COLLAPSE]" : "[EXPAND]"}
                            </span>
                          </button>

                          {isExpanded && (
                            <div className="p-1.5 space-y-1.5">
                              <ResponseProtocol
                                category={fire.category}
                                compact={true}
                                onViewFull={() => setModalProtocolFire(fire)}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {/* Actions & Dispatch */}
                    <div className="border-t border-[#1f2933] pt-1.5 space-y-1.5">
                      {/* Prominent Dispatch Simulation Button */}
                      <button
                        onClick={() => {
                          const nearestSt = findLocalNearestStation(fire.latitude, fire.longitude);
                          const fireWithStation = {
                            ...fire,
                            station_name: nearestSt.name,
                            station_distance_km: nearestSt.distance_km,
                            station_eta_minutes: nearestSt.eta_minutes,
                          };
                          if (onOpenDispatch) onOpenDispatch(fireWithStation);
                        }}
                        className={`w-full text-[10px] border py-1.5 uppercase font-bold text-center cursor-pointer tracking-wider transition flex items-center justify-center gap-1.5 ${
                          fire.risk_level === "CRITICAL" || fire.category === "EMERGENCY_INDUSTRIAL"
                            ? "border-[#ff3b3b] bg-[#ff3b3b] text-black font-black hover:bg-[#ff5252] shadow-[0_0_12px_rgba(255,59,59,0.4)]"
                            : "border-[#ff3b3b] bg-[#ff3b3b]/15 hover:bg-[#ff3b3b]/25 text-[#ff8080] hover:text-white"
                        }`}
                      >
                        <span>{t("actions.simulate_dispatch", "🚒 SIMULATE DISPATCH")}</span>
                      </button>

                      {/* Prominent Historical Analysis Trigger Button */}
                      <button
                        type="button"
                        onClick={() => {
                          if (onOpenHistory) onOpenHistory(fire);
                        }}
                        className="w-full text-[10px] border border-[#ffb800] bg-[#ffb800]/15 hover:bg-[#ffb800]/25 text-[#ffb800] hover:text-white py-1.5 uppercase font-bold text-center cursor-pointer tracking-wider transition flex items-center justify-center gap-1.5"
                      >
                        <span>{t("actions.view_history", "📊 VIEW HISTORY")}</span>
                      </button>

                      {/* Prominent Fire Spread Prediction Trigger Button */}
                      <button
                        type="button"
                        onClick={() => {
                          if (onOpenSpreadPrediction) onOpenSpreadPrediction(fire);
                        }}
                        className="w-full text-[10px] border border-[#ff9500] bg-[#ff9500]/15 hover:bg-[#ff9500]/30 text-[#ff9500] hover:text-white py-1.5 uppercase font-bold text-center cursor-pointer tracking-wider transition flex items-center justify-center gap-1.5 shadow-[0_0_8px_rgba(255,149,0,0.2)]"
                      >
                        <span>{t("actions.predict_spread", "💨 PREDICT SPREAD")}</span>
                      </button>


                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-[#6b7785] uppercase truncate max-w-[140px]">
                          ACT: {cleanAction.slice(0, 18)}
                        </span>
                        <a
                          href={`https://www.google.com/maps?q=${fire.latitude},${fire.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[9px] border border-[#1f2933] text-[#00d4ff] px-1.5 py-0.5 hover:bg-[#00d4ff]/10 uppercase font-bold"
                        >
                          [ GMAPS ↗ ]
                        </a>
                      </div>

                      <button
                        onClick={() => onOpenVerify && onOpenVerify(fire)}
                        className="w-full text-[10px] border border-[#00d4ff] bg-[#00d4ff]/10 text-[#00d4ff] hover:bg-[#00d4ff]/20 py-1 uppercase font-bold text-center cursor-pointer tracking-wider transition"
                      >
                        [ {t("actions.verify", "VERIFY SCENE & ROAD CONTEXT >>")} ]
                      </button>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}

          {/* Scenario Simulation Overlays */}
          {scenarioOverlay?.evacuationCircle && (
            <Circle
              center={scenarioOverlay.evacuationCircle.center}
              radius={scenarioOverlay.evacuationCircle.radius_km * 1000}
              pathOptions={{
                color: "#ff3b3b",
                fillColor: "#ff3b3b",
                fillOpacity: 0.18,
                dashArray: "6 6",
                weight: 2,
              }}
            >
              <Popup>
                <div className="font-mono text-xs text-[#d0d8e0] p-1">
                  <div className="text-[#ff3b3b] font-bold">[!] EVACUATION ZONE</div>
                  <div>Radius: {scenarioOverlay.evacuationCircle.radius_km * 1000}m</div>
                  <div className="text-[10px] text-[#6b7785]">Mandatory civilian clearance perimeter</div>
                </div>
              </Popup>
            </Circle>
          )}

          {scenarioOverlay?.windCone && (
            <Polygon
              positions={scenarioOverlay.windCone}
              pathOptions={{
                color: "#00d4ff",
                fillColor: "#00d4ff",
                fillOpacity: 0.22,
                dashArray: "4 4",
                weight: 1.5,
              }}
            >
              <Popup>
                <div className="font-mono text-xs text-[#d0d8e0] p-1">
                  <div className="text-[#00d4ff] font-bold">[~] WIND SPREAD CONE PROJECTION</div>
                  <div>Vector: NE corridor @ 15 km/h</div>
                  <div className="text-[10px] text-[#6b7785]">Predicted 4-hour forward spread boundary</div>
                </div>
              </Popup>
            </Polygon>
          )}

          {scenarioOverlay?.stationMarker && (
            <CircleMarker
              center={[scenarioOverlay.stationMarker.lat, scenarioOverlay.stationMarker.lon]}
              radius={10}
              pathOptions={{
                color: "#00ff9c",
                fillColor: "#0f141b",
                fillOpacity: 0.95,
                weight: 2.5,
              }}
            >
              <Popup>
                <div className="font-mono text-xs text-[#d0d8e0] p-1">
                  <div className="text-[#00ff9c] font-bold">[ 🚒 RESPONSE STATION ]</div>
                  <div className="text-white font-bold">{scenarioOverlay.stationMarker.name}</div>
                  <div className="text-[10px] text-[#6b7785]">
                    PROXIMITY: {scenarioOverlay.stationMarker.distance_km || 3.2} KM
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          )}

          {scenarioOverlay?.pulseMarker && (
            <CircleMarker
              center={scenarioOverlay.pulseMarker}
              radius={16}
              pathOptions={{
                color: "#ff3b3b",
                fillColor: "#ff3b3b",
                fillOpacity: 0.25,
                weight: 2,
              }}
              className="status-dot-red animate-ping"
            />
          )}

          {/* Dynamic Rothermel Fire Spread Prediction Cone & At-Risk Overlay */}
          {spreadPredictionData && spreadPredictionData.cones_by_hour && (
            (() => {
              const hourKey = String(selectedSpreadHour || 6);
              const positions =
                spreadPredictionData.cones_by_hour[hourKey] ||
                spreadPredictionData.spread_cone_coordinates;
              const stepInfo = spreadPredictionData.predictions?.find(
                (p) => p.hour === (selectedSpreadHour || 6)
              );
              const coneColor =
                getMarkerColor(spreadPredictionData.category) || "#ff9500";

              return (
                <>
                  {positions && positions.length > 0 && (
                    <Polygon
                      positions={positions}
                      pathOptions={{
                        color: coneColor,
                        fillColor: coneColor,
                        fillOpacity: 0.28,
                        dashArray: "6 4",
                        weight: 2,
                      }}
                    >
                      <Popup>
                        <div className="font-mono text-xs text-[#d0d8e0] p-1 space-y-1">
                          <div className="text-[#ff9500] font-bold">
                            // {selectedSpreadHour || 6}-HOUR SPREAD PROJECTION CONE
                          </div>
                          <div className="text-[10px] text-[#00d4ff]">
                            PROPAGATION: {spreadPredictionData.spread_direction} ({spreadPredictionData.spread_azimuth_deg}°)
                          </div>
                          <div className="text-[10px] text-[#d0d8e0]">
                            FORWARD DISTANCE: <span className="text-[#ff3b3b] font-bold">{stepInfo?.spread_distance_km || 0} KM</span>
                          </div>
                          <div className="text-[10px] text-[#d0d8e0]">
                            PROJECTED AREA: <span className="text-[#ffb800] font-bold">{stepInfo?.affected_area_km2 || 0} KM²</span>
                          </div>
                          <div className="text-[9px] text-[#6b7785]">
                            MODEL: Rothermel-v2 | Rate: {spreadPredictionData.rate_of_spread_kmh} km/h
                          </div>
                        </div>
                      </Popup>
                    </Polygon>
                  )}

                  {/* Render At-Risk Infrastructure & Settlement Waypoint Pins */}
                  {spreadPredictionData.at_risk_locations?.map((loc, idx) => {
                    if (!loc.coordinates) return null;
                    const isCrit = loc.risk_severity === "CRITICAL";
                    return (
                      <CircleMarker
                        key={`spread-at-risk-${idx}`}
                        center={loc.coordinates}
                        radius={6}
                        pathOptions={{
                          color: isCrit ? "#ff3b3b" : "#ffb800",
                          fillColor: isCrit ? "#ff3b3b" : "#15202c",
                          fillOpacity: 0.9,
                          weight: 1.5,
                        }}
                      >
                        <Popup>
                          <div className="font-mono text-xs text-[#d0d8e0] p-1 space-y-0.5">
                            <div className="font-bold text-[#ff3b3b] flex items-center gap-1">
                              <span>⚠️ AT-RISK ASSET:</span>
                              <span>{loc.name}</span>
                            </div>
                            <div className="text-[10px] text-[#00d4ff]">
                              ARRIVAL ETA: <span className="font-bold text-white">{loc.eta_hours} HOURS</span>
                            </div>
                            <div className="text-[9px] text-[#6b7785]">
                              DIST FROM GROUND ZERO: {loc.distance_km} KM
                            </div>
                          </div>
                        </Popup>
                      </CircleMarker>
                    );
                  })}

                  {/* Tactical Fire Break Recommended Cut Line Marker */}
                  {spreadPredictionData.fire_break && (
                    <CircleMarker
                      center={[
                        spreadPredictionData.fire_break.latitude,
                        spreadPredictionData.fire_break.longitude,
                      ]}
                      radius={7}
                      pathOptions={{
                        color: "#00ff9c",
                        fillColor: "#0a0e14",
                        fillOpacity: 0.95,
                        weight: 2,
                        dashArray: "2 2",
                      }}
                    >
                      <Popup>
                        <div className="font-mono text-xs text-[#d0d8e0] p-1">
                          <div className="text-[#00ff9c] font-bold">[ ⛏️ TACTICAL FIRE BREAK ]</div>
                          <div className="text-[10px] text-[#d0d8e0]">
                            Recommended cut line barrier @ {spreadPredictionData.fire_break.distance_km} km advance
                          </div>
                        </div>
                      </Popup>
                    </CircleMarker>
                  )}
                </>
              );
            })()
          )}
        </MapContainer>

        {/* Live Weather & Atmospheric Telemetry Widget */}
        <WeatherWidget lat={currentCenter.lat} lon={currentCenter.lon} />

        {/* Bottom-Left Compact Legend */}
        <div className="absolute bottom-3 left-3 z-[1000] pointer-events-auto bg-[#111827]/90 backdrop-blur-sm border border-[#1F2937] rounded-xl p-2.5 shadow-lg text-xs space-y-1.5 max-w-[210px]">
          <div className="flex items-center justify-between border-b border-[#1F2937] pb-1">
            <span className="text-[10px] text-[#9CA3AF] font-semibold uppercase tracking-wider">
              Map Legend
            </span>
            <InfoTooltip
              title="Tactical Map Legend"
              text="Color-coded thermal anomaly categories based on IGNIS spatial reasoning engine: Red (Emergency), Yellow (Persistent), Orange (Agri), Green (Forest), Gray (Unclassified)."
              position="top"
            />
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-[#EF4444] flex-shrink-0" />
            <span className="text-[#E5E7EB]">Emergency Industrial</span>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-[#A855F7] flex-shrink-0" />
            <span className="text-[#E5E7EB]">Persistent Industrial</span>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B] flex-shrink-0" />
            <span className="text-[#E5E7EB]">Agricultural Burning</span>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] flex-shrink-0" />
            <span className="text-[#E5E7EB]">Forest Biomass</span>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-[#9CA3AF] flex-shrink-0" />
            <span className="text-[#9CA3AF]">Unclassified</span>
          </div>
        </div>

        {/* Empty-State Card Overlay when 0 Hotspots */}
        {renderedFires.length === 0 && (
          <div className="absolute inset-0 z-[1001] flex items-center justify-center pointer-events-none p-4">
            <div className="bg-[#111827]/95 border border-[#1F2937] text-white p-6 rounded-2xl shadow-2xl backdrop-blur-md max-w-sm text-center pointer-events-auto space-y-3.5 animate-in fade-in zoom-in-95">
              <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-2xl">
                🛰️
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-wide">No Hotspots In Selected Window</h3>
                <p className="text-xs text-[#9CA3AF] mt-1 leading-relaxed">
                  Satellite orbit telemetry returned 0 thermal detections for the selected filter criteria.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                {onRetryLive && (
                  <button
                    type="button"
                    onClick={onRetryLive}
                    className="px-3.5 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500 text-emerald-400 text-xs font-semibold rounded-lg transition cursor-pointer"
                  >
                    Retry Live
                  </button>
                )}
                {onTryLast3Days && (
                  <button
                    type="button"
                    onClick={onTryLast3Days}
                    className="px-3.5 py-1.5 bg-[#22D3EE]/20 hover:bg-[#22D3EE]/30 border border-[#22D3EE] text-[#22D3EE] text-xs font-semibold rounded-lg transition cursor-pointer"
                  >
                    Try Last 3 Days
                  </button>
                )}
                <button
                  type="button"
                  onClick={onSwitchToDemo}
                  className="px-3.5 py-1.5 bg-[#EF4444]/20 hover:bg-[#EF4444]/30 border border-[#EF4444] text-[#EF4444] text-xs font-semibold rounded-lg transition cursor-pointer"
                >
                  Use Demo Mode
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Material-Based Fire Response Protocol Directive Modal */}
      <ProtocolModal
        isOpen={modalProtocolFire !== null}
        onClose={() => setModalProtocolFire(null)}
        category={modalProtocolFire?.category || "UNKNOWN"}
        fire={modalProtocolFire}
      />
    </div>
  );
}
