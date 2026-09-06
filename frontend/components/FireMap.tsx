"use client";

import { useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";

export interface Fire {
  latitude: number;
  longitude: number;
  brightness: number;
  frp: number;
  confidence: string | number;
  acq_date: string;
  acq_time: string;
  category: string;
  risk_level: string;
  color?: string;
  reason: string;
  action: string;
}

// Military-intel color palette
export const CATEGORY_COLORS: Record<string, string> = {
  EMERGENCY_INDUSTRIAL: "#ff2d2d", // Vivid Ember Red
  PERSISTENT_INDUSTRIAL: "#f5b301", // Industrial Gold
  AGRICULTURAL_BURNING: "#f97316", // Agri Orange
  FOREST_FIRE: "#10b981", // Wildland Green
  UNKNOWN: "#64748b", // Muted Slate
};

export const COLOR_MAP: Record<string, string> = {
  red: "#ff2d2d",
  yellow: "#f5b301",
  orange: "#f97316",
  green: "#10b981",
  gray: "#64748b",
};

export function getFireColor(fire: Fire): string {
  if (fire.category && CATEGORY_COLORS[fire.category]) {
    return CATEGORY_COLORS[fire.category];
  }
  if (fire.color && COLOR_MAP[fire.color]) {
    return COLOR_MAP[fire.color];
  }
  return "#64748b";
}

// 3 Segmented Basemaps - All verified free tiles with guaranteed subdomains
const TILE_PRESETS = {
  tactical_dark: {
    id: "tactical_dark",
    name: "Tactical Dark",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>, &copy; OpenStreetMap',
    subdomains: "abcd",
  },
  streets: {
    id: "streets",
    name: "Streets",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: "abc",
  },
  midnight: {
    id: "midnight",
    name: "Midnight",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    attribution: "&copy; Esri, HERE, Garmin, &copy; OpenStreetMap",
    subdomains: "abc",
  },
};

const LEGEND_ITEMS = [
  { label: "Emergency Anomaly", color: "#ff2d2d", pulse: true, code: "EMERGENCY" },
  { label: "Industrial Facility", color: "#f5b301", code: "PERSISTENT" },
  { label: "Agricultural Burning", color: "#f97316", code: "CROP" },
  { label: "Forest / Wildland", color: "#10b981", code: "BIOMASS" },
  { label: "Unclassified / Low FRP", color: "#64748b", code: "UNCLASSIFIED" },
];

export default function FireMap({ fires = [] }: { fires?: Fire[] }) {
  const safeFires = Array.isArray(fires) ? fires : [];
  // Default to Carto Dark Matter as requested
  const [activeLayer, setActiveLayer] = useState<keyof typeof TILE_PRESETS>("tactical_dark");
  const isCapped = safeFires.length > 1000;
  const renderedFires = isCapped ? safeFires.slice(0, 1000) : safeFires;

  const currentTile = TILE_PRESETS[activeLayer] || TILE_PRESETS.tactical_dark;

  return (
    <div className="relative w-full h-full min-h-[560px] overflow-hidden rounded-2xl md:rounded-3xl border border-white/10 shadow-2xl shadow-red-950/20 bg-[#020617] group">
      {/* Subtle Vignette & Screen Line Accent */}
      <div className="absolute inset-0 pointer-events-none z-[400] shadow-[inset_0_0_80px_rgba(0,0,0,0.85)]" />

      {/* Corner Badge: Top-Left GEO VIEW */}
      <div className="absolute top-3.5 left-3.5 z-[1000] flex items-center gap-2 pointer-events-none">
        <div className="glass-card px-3 py-1.5 rounded-xl border border-white/10 shadow-xl flex items-center gap-2 pointer-events-auto">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
          </span>
          <span className="font-mono text-[10px] font-extrabold tracking-[0.2em] text-cyan-300 uppercase">
            GEO VIEW
          </span>
          <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
            • 20.59°N, 78.96°E
          </span>
        </div>

        {isCapped && (
          <div className="glass-card px-2.5 py-1 rounded-xl border border-amber-500/40 text-amber-300 text-[10px] font-mono shadow-xl hidden md:flex items-center gap-1.5">
            <span>⚠️</span>
            <span>Displaying top 1,000 for 60fps</span>
          </div>
        )}
      </div>

      {/* Top-Right: Tracked Hotspots Chip & Basemap Switcher */}
      <div className="absolute top-3.5 right-3.5 z-[1000] flex items-center gap-2 pointer-events-auto flex-wrap justify-end">
        {/* Hotspot Count Chip */}
        <div className="glass-card px-3 py-1.5 rounded-xl border border-white/10 text-[10px] font-mono font-bold tracking-wider text-slate-200 flex items-center gap-1.5 shadow-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-white font-black">{safeFires.length}</span>
          <span className="text-slate-400 uppercase tracking-widest text-[9px]">TRACKED</span>
        </div>

        {/* Segmented Basemap Switcher: [ Tactical Dark | Streets | Midnight ] */}
        <div className="glass-card p-0.5 rounded-xl border border-white/10 flex items-center gap-0.5 shadow-xl">
          {(Object.keys(TILE_PRESETS) as Array<keyof typeof TILE_PRESETS>).map((key) => {
            const isActive = activeLayer === key;
            return (
              <button
                key={key}
                onClick={() => setActiveLayer(key)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold shadow-md shadow-red-600/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5 font-medium"
                }`}
              >
                {TILE_PRESETS[key].name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Leaflet Map Viewport */}
      <MapContainer
        center={[22.5, 78.9]}
        zoom={5}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          key={activeLayer}
          url={currentTile.url}
          attribution={currentTile.attribution}
          subdomains={currentTile.subdomains || "abcd"}
        />

        {renderedFires.map((fire, idx) => {
          const markerColor = getFireColor(fire);
          const isCritical = fire.risk_level === "CRITICAL" || fire.category === "EMERGENCY_INDUSTRIAL";
          
          // Radius scaling: Emergency & High FRP get prominent footprint
          let radius = 4.5;
          if (isCritical) {
            radius = fire.frp > 50 ? 11 : 9;
          } else if (fire.frp > 100) {
            radius = 8.5;
          } else if (fire.frp > 50) {
            radius = 7;
          } else if (fire.frp > 20) {
            radius = 5.5;
          }

          return (
            <CircleMarker
              key={`${fire.latitude}-${fire.longitude}-${idx}`}
              center={[fire.latitude, fire.longitude]}
              radius={radius}
              fillColor={markerColor}
              fillOpacity={isCritical ? 0.95 : 0.85}
              color={isCritical ? "#ffffff" : markerColor}
              weight={isCritical ? 2 : 1}
              className={isCritical ? "pulse-emergency" : undefined}
            >
              <Popup>
                <div className="p-1 min-w-[260px] font-sans text-xs space-y-2.5">
                  {/* Category Header Chip & Severity */}
                  <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
                    <span
                      className="font-bold text-xs tracking-wide flex items-center gap-1.5 uppercase font-mono"
                      style={{ color: markerColor }}
                    >
                      {isCritical && "🚨"} {String(fire.category || "UNKNOWN").replace(/_/g, " ")}
                    </span>
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wider ${
                        isCritical
                          ? "bg-red-950 text-red-300 border border-red-700 animate-pulse"
                          : "bg-slate-800 text-slate-300 border border-slate-700"
                      }`}
                    >
                      {fire.risk_level || "MODERATE"}
                    </span>
                  </div>

                  {/* Operational Reason */}
                  <p className="text-slate-300 text-xs leading-relaxed font-normal">
                    {fire.reason || "Satellite thermal anomaly detected via VIIRS sensor suite."}
                  </p>

                  {/* 2x2 Metric Grid */}
                  <div className="grid grid-cols-2 gap-2 py-1.5 px-2 rounded-lg bg-black/40 border border-white/5 font-mono text-[11px]">
                    <div>
                      <span className="text-slate-400 text-[10px] block uppercase tracking-wider">FRP Power</span>
                      <span className="font-bold text-amber-400">
                        {Number(fire.frp || 0).toFixed(1)} MW
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block uppercase tracking-wider">Brightness</span>
                      <span className="font-bold text-slate-100">
                        {Number(fire.brightness || 0).toFixed(1)} K
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block uppercase tracking-wider">Detection</span>
                      <span className="text-slate-300">
                        {fire.acq_date || "N/A"} {fire.acq_time ? `• ${fire.acq_time}z` : ""}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block uppercase tracking-wider">Confidence</span>
                      <span className="text-cyan-300 font-semibold capitalize">
                        {String(fire.confidence ?? "Nominal")}
                      </span>
                    </div>
                  </div>

                  {/* Monospace Precise Coordinates */}
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 px-1">
                    <span>COORDINATES</span>
                    <span className="text-slate-300 font-semibold">
                      {fire.latitude?.toFixed(4)}°N, {fire.longitude?.toFixed(4)}°E
                    </span>
                  </div>

                  {/* Action Highlight Box */}
                  <div className="pt-2 border-t border-white/10">
                    <span className="text-slate-400 block text-[9px] uppercase font-mono tracking-widest mb-1">
                      OPERATIONAL ACTION:
                    </span>
                    <div
                      className={`p-2 rounded-lg text-xs leading-snug font-medium ${
                        isCritical
                          ? "bg-red-950/80 text-red-200 border border-red-800/80"
                          : "bg-white/5 text-slate-200 border border-white/10"
                      }`}
                    >
                      {fire.action || "Continue continuous satellite surveillance tracking."}
                    </div>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* Floating Glass Legend (Bottom-Right) */}
      <div className="absolute bottom-3.5 right-3.5 z-[1000] glass-card rounded-2xl p-3 shadow-2xl border border-white/10 pointer-events-auto max-w-[220px] backdrop-blur-xl">
        <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.15em] border-b border-white/10 pb-1.5 mb-2 flex items-center justify-between gap-2">
          <span>SURVEILLANCE LEGEND</span>
          <span className="text-emerald-400 text-[8px] bg-emerald-950/80 px-1.5 py-0.5 rounded-full border border-emerald-700/60 font-mono">
            ACTIVE
          </span>
        </div>
        <div className="space-y-1.5">
          {LEGEND_ITEMS.map((item) => (
            <div key={item.label} className="flex items-center justify-between gap-2 text-[11px]">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full inline-block shrink-0 shadow-sm ${
                    item.pulse ? "animate-pulse ring-2 ring-red-500/50" : ""
                  }`}
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-slate-200 font-medium text-[11px] leading-none">
                  {item.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
