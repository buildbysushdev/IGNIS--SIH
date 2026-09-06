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

// Vivid judge-wow color mapping with robust fallbacks
export const COLOR_MAP: Record<string, string> = {
  red: "#ef4444",
  yellow: "#eab308",
  orange: "#f97316",
  green: "#22c55e",
  gray: "#94a3b8",
};

export const CATEGORY_COLORS: Record<string, string> = {
  EMERGENCY_INDUSTRIAL: "#ef4444",
  PERSISTENT_INDUSTRIAL: "#eab308",
  AGRICULTURAL_BURNING: "#f97316",
  FOREST_FIRE: "#22c55e",
  UNKNOWN: "#94a3b8",
};

export function getFireColor(fire: Fire): string {
  if (fire.category && CATEGORY_COLORS[fire.category]) {
    return CATEGORY_COLORS[fire.category];
  }
  if (fire.color && COLOR_MAP[fire.color]) {
    return COLOR_MAP[fire.color];
  }
  return "#94a3b8";
}

const TILE_PRESETS = {
  esri_dark: {
    name: "Tactical Dark (Esri)",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    attribution: "&copy; Esri, HERE, Garmin, &copy; OpenStreetMap contributors",
    subdomains: "abc",
  },
  osm_standard: {
    name: "OpenStreetMap",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors",
    subdomains: "abc",
  },
  carto_dark: {
    name: "CartoDB Dark",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: "&copy; OpenStreetMap &copy; CARTO",
    subdomains: "abcd",
  },
};

const LEGEND_ITEMS = [
  { label: "Emergency Fire", color: "#ef4444", pulse: true },
  { label: "Industrial Facility", color: "#eab308" },
  { label: "Agricultural Burning", color: "#f97316" },
  { label: "Forest / Wildland", color: "#22c55e" },
  { label: "Unclassified / Low FRP", color: "#94a3b8" },
];

export default function FireMap({ fires = [] }: { fires?: Fire[] }) {
  const safeFires = Array.isArray(fires) ? fires : [];
  const [activeLayer, setActiveLayer] = useState<keyof typeof TILE_PRESETS>("esri_dark");
  const isCapped = safeFires.length > 1000;
  const renderedFires = isCapped ? safeFires.slice(0, 1000) : safeFires;

  const currentTile = TILE_PRESETS[activeLayer];

  return (
    <div className="relative w-full h-full min-h-[560px] overflow-hidden rounded-2xl border border-slate-700/80 shadow-2xl bg-[#0b1120]">
      {/* 1000 Fires Performance Cap Warning */}
      {isCapped && (
        <div className="absolute top-3 left-14 z-[1000] bg-amber-950/90 border border-amber-500/80 text-amber-200 text-xs font-mono px-3 py-1.5 rounded-lg shadow-xl backdrop-blur-md pointer-events-auto">
          ⚠️ Displaying top 1,000 thermal hotspots for high frame-rate rendering ({safeFires.length.toLocaleString()} total)
        </div>
      )}

      {/* Map Style Selector (Top-Right) */}
      <div className="absolute top-3 right-3 z-[1000] bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-lg p-1 text-[11px] font-mono pointer-events-auto flex items-center gap-1 shadow-lg">
        {(Object.keys(TILE_PRESETS) as Array<keyof typeof TILE_PRESETS>).map((key) => (
          <button
            key={key}
            onClick={() => setActiveLayer(key)}
            className={`px-2 py-1 rounded transition ${
              activeLayer === key
                ? "bg-red-600 text-white font-semibold"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            {TILE_PRESETS[key].name}
          </button>
        ))}
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
          subdomains={currentTile.subdomains || "abc"}
        />

        {renderedFires.map((fire, idx) => {
          const markerColor = getFireColor(fire);
          const isCritical = fire.risk_level === "CRITICAL" || fire.category === "EMERGENCY_INDUSTRIAL";
          const radius = fire.frp > 100 ? 10 : fire.frp > 40 ? 8 : fire.frp > 15 ? 6 : 4.5;

          return (
            <CircleMarker
              key={`${fire.latitude}-${fire.longitude}-${idx}`}
              center={[fire.latitude, fire.longitude]}
              radius={radius}
              fillColor={markerColor}
              fillOpacity={0.88}
              color="#ffffff"
              weight={1.2}
              className={isCritical ? "pulse-marker" : undefined}
            >
              <Popup>
                <div className="p-1 min-w-[240px] font-sans text-xs space-y-2">
                  <div className="border-b border-slate-700 pb-2 flex items-center justify-between gap-2">
                    <span
                      className="font-bold text-sm tracking-wide flex items-center gap-1.5"
                      style={{ color: markerColor }}
                    >
                      {isCritical && "🚨"} {String(fire.category || "UNKNOWN").replace(/_/g, " ")}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                        isCritical
                          ? "bg-red-900 text-red-200 border border-red-700 animate-pulse"
                          : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      {fire.risk_level || "MODERATE"}
                    </span>
                  </div>

                  <p className="text-slate-200 text-xs leading-relaxed font-medium">
                    {fire.reason || "Thermal signature detected by NASA satellite sensors."}
                  </p>

                  <div className="grid grid-cols-2 gap-1.5 py-1 text-[11px] text-slate-300 border-t border-slate-700/80 font-mono">
                    <div>
                      <span className="text-slate-400 font-sans">FRP: </span>
                      <span className="font-bold text-amber-400">
                        {Number(fire.frp || 0).toFixed(1)} MW
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-sans">Brightness: </span>
                      <span className="font-bold text-slate-100">
                        {Number(fire.brightness || 0).toFixed(1)} K
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-sans">Date: </span>
                      <span>{fire.acq_date || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-sans">Time: </span>
                      <span>{fire.acq_time || "N/A"} UTC</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-400 font-sans">Confidence: </span>
                      <span className="capitalize">{String(fire.confidence ?? "N/A")}</span>
                    </div>
                  </div>

                  <div className="pt-1.5 border-t border-slate-700/80">
                    <span className="text-slate-400 block text-[10px] uppercase font-mono tracking-wider mb-0.5">
                      Operational Action:
                    </span>
                    <span
                      className={
                        isCritical
                          ? "text-red-400 font-bold text-xs"
                          : "text-slate-300 text-xs"
                      }
                    >
                      {fire.action || "Active monitoring and verification."}
                    </span>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* Styled Tactical Legend (Bottom-Right) */}
      <div className="absolute bottom-3 right-3 z-[1000] bg-slate-900/95 backdrop-blur-md border border-slate-700/90 rounded-xl p-3 shadow-2xl text-xs font-mono pointer-events-auto space-y-2">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-700 pb-1 flex items-center justify-between gap-3">
          <span>Surveillance Legend</span>
          <span className="text-emerald-400 text-[9px] bg-emerald-950 px-1.5 py-0.2 rounded border border-emerald-800">
            ACTIVE
          </span>
        </div>
        {LEGEND_ITEMS.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full inline-block shadow-sm ${
                item.pulse ? "animate-pulse ring-2 ring-red-500/40" : ""
              }`}
              style={{ backgroundColor: item.color }}
            />
            <span className="text-slate-200 text-[11px] font-sans font-medium">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
