"use client";

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
  color: string;
  reason: string;
  action: string;
}

export const COLOR_MAP: Record<string, string> = {
  red: "#dc2626",
  yellow: "#eab308",
  orange: "#f97316",
  green: "#22c55e",
  gray: "#6b7280",
};

const LEGEND_ITEMS = [
  { label: "Emergency Industrial", color: "#dc2626" },
  { label: "Persistent Industrial", color: "#eab308" },
  { label: "Agricultural Burning", color: "#f97316" },
  { label: "Forest Fire", color: "#22c55e" },
  { label: "Unknown / Other", color: "#6b7280" },
];

export default function FireMap({ fires }: { fires: Fire[] }) {
  const isCapped = fires.length > 1000;
  const renderedFires = isCapped ? fires.slice(0, 1000) : fires;

  return (
    <div className="relative w-full h-full min-h-[500px] overflow-hidden rounded-xl border border-slate-700/60 shadow-2xl">
      {/* 1000 Fires Performance Warning */}
      {isCapped && (
        <div className="absolute top-3 left-12 z-[1000] bg-amber-950/90 border border-amber-600/80 text-amber-200 text-xs font-mono px-3 py-1.5 rounded-lg shadow-lg backdrop-blur-sm pointer-events-auto">
          ⚠️ Displaying first 1000 fires for performance ({fires.length} total)
        </div>
      )}

      {/* Map Viewport */}
      <MapContainer
        center={[22.5, 78.9]}
        zoom={5}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution="&copy; OpenStreetMap contributors &copy; CARTO"
        />

        {renderedFires.map((fire, idx) => {
          const markerColor = COLOR_MAP[fire.color] || "#6b7280";
          const isCritical = fire.risk_level === "CRITICAL";

          return (
            <CircleMarker
              key={`${fire.latitude}-${fire.longitude}-${idx}`}
              center={[fire.latitude, fire.longitude]}
              radius={fire.frp > 50 ? 8 : 5}
              fillColor={markerColor}
              fillOpacity={0.85}
              color="white"
              weight={1}
              className={isCritical ? "pulse-marker" : undefined}
            >
              <Popup>
                <div className="p-1 min-w-[220px] font-sans text-xs space-y-2">
                  <div className="border-b border-slate-700 pb-1.5 flex items-center justify-between gap-2">
                    <span
                      className="font-bold text-sm tracking-wide"
                      style={{ color: markerColor }}
                    >
                      {fire.category}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded uppercase font-semibold ${
                        isCritical
                          ? "bg-red-900/60 text-red-300 border border-red-700"
                          : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      {fire.risk_level}
                    </span>
                  </div>

                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {fire.reason}
                  </p>

                  <div className="grid grid-cols-2 gap-1.5 py-1 text-[11px] text-slate-300 border-t border-slate-800">
                    <div>
                      <span className="text-slate-400">FRP: </span>
                      <span className="font-semibold text-amber-400">
                        {Number(fire.frp).toFixed(1)} MW
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400">Brightness: </span>
                      <span className="font-semibold">
                        {Number(fire.brightness).toFixed(1)} K
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400">Date: </span>
                      <span>{fire.acq_date}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Time: </span>
                      <span>{fire.acq_time} UTC</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-400">Confidence: </span>
                      <span>{fire.confidence}</span>
                    </div>
                  </div>

                  <div className="pt-1 border-t border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase tracking-wider mb-0.5">
                      Required Action:
                    </span>
                    <span
                      className={
                        isCritical
                          ? "text-red-400 font-bold text-xs"
                          : "text-slate-300 text-xs"
                      }
                    >
                      {fire.action}
                    </span>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* Legend inside map (bottom-right) */}
      <div className="absolute bottom-3 right-3 z-[1000] bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-3 shadow-2xl text-xs font-mono pointer-events-auto space-y-1.5">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-700/80 pb-1">
          Classification Legend
        </div>
        {LEGEND_ITEMS.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block shadow-sm"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-slate-200 text-[11px]">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
