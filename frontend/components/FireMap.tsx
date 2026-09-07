"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Rectangle, Popup, useMapEvents } from "react-leaflet";
import ResponseProtocol from "./ResponseProtocol";
import { FIRE_STATIONS } from "@/data/fireStations";

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

// Strict Ground Station Color Coding (High Contrast, Phosphor & Terminal Accents)
export const TERMINAL_COLORS: Record<string, string> = {
  EMERGENCY_INDUSTRIAL: "#ff3b3b", // Crimson
  PERSISTENT_INDUSTRIAL: "#ffb800", // Gold / Amber
  AGRICULTURAL_BURNING: "#ff9500", // Orange
  FOREST_FIRE: "#00ff9c", // Phosphor Green
  UNKNOWN: "#4a5563", // Terminal Slate
};

export function getMarkerColor(category: string): string {
  return TERMINAL_COLORS[category] || "#4a5563";
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
  onCoordsChange,
}: {
  targetCoords?: [number, number] | null;
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
      map.flyTo(targetCoords, 10, { duration: 1.2 });
    }
  }, [targetCoords, map]);

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
  facilities?: FacilityMarker[];
  onOpenVerify?: (fire: Fire) => void;
  onOpenDispatch?: (fire: Fire) => void;
  activeLayer?: keyof typeof TILE_PRESETS;
  onLayerChange?: (layer: keyof typeof TILE_PRESETS) => void;
}

export default function FireMap({
  fires = [],
  targetCoords,
  facilities = [],
  onOpenVerify,
  onOpenDispatch,
  activeLayer: externalActiveLayer,
  onLayerChange,
}: FireMapProps) {
  const safeFires = Array.isArray(fires) ? fires : [];
  const [internalLayer, setInternalLayer] = useState<keyof typeof TILE_PRESETS>("ops_dark");
  const activeLayer = externalActiveLayer || internalLayer;

  const handleSelectLayer = (key: keyof typeof TILE_PRESETS) => {
    setInternalLayer(key);
    if (onLayerChange) onLayerChange(key);
  };

  const [currentCenter, setCurrentCenter] = useState<{ lat: number; lon: number; zoom: number }>({
    lat: 22.5432,
    lon: 78.9012,
    zoom: 5,
  });

  const isCapped = safeFires.length > 1000;
  const renderedFires = isCapped ? safeFires.slice(0, 1000) : safeFires;
  const currentTile = TILE_PRESETS[activeLayer] || TILE_PRESETS.ops_dark;

  return (
    <div className="panel flex flex-col h-full w-full overflow-hidden border border-[#1f2933] bg-[#0a0e14] corner-brackets relative">
      {/* Panel Header */}
      <div className="panel-header flex items-center justify-between border-b border-[#1f2933] px-3 py-2 bg-[#131a22]">
        <div className="flex items-center gap-2">
          <span className="text-[#00ff9c] font-mono text-xs">::</span>
          <span className="font-mono text-[11px] font-bold tracking-[0.15em] text-[#d0d8e0] uppercase">
            // GEO SURVEILLANCE // INDIA SECTOR
          </span>
          <span className="text-[10px] font-mono text-[#6b7785] hidden md:inline">
            [VIIRS 375M SENSOR GRID]
          </span>
        </div>

        {/* Top-Right Basemap / Sensor Layer Chips: [ OPS DARK ] [ SATELLITE ] [ HYBRID ] */}
        <div className="flex items-center gap-1 font-mono text-[10px]">
          {(Object.keys(TILE_PRESETS) as Array<keyof typeof TILE_PRESETS>).map((key) => {
            const isActive = activeLayer === key;
            return (
              <button
                key={key}
                onClick={() => handleSelectLayer(key)}
                className={`px-2 py-0.5 border uppercase font-bold tracking-wider transition cursor-pointer ${
                  isActive
                    ? "bg-[#131a22] border-[#00d4ff] text-[#00d4ff]"
                    : "bg-[#0f141b] border-[#1f2933] text-[#6b7785] hover:text-[#d0d8e0] hover:border-[#2d3a4a]"
                }`}
              >
                [ {TILE_PRESETS[key].name} ]
              </button>
            );
          })}
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

          {/* Render Fire Hotspots */}
          {renderedFires.map((fire, idx) => {
            const markerColor = getMarkerColor(fire.category);
            const isCritical = fire.risk_level === "CRITICAL" || fire.category === "EMERGENCY_INDUSTRIAL";
            const radius = isCritical ? (fire.frp > 50 ? 9 : 7) : fire.frp > 80 ? 6.5 : fire.frp > 30 ? 5 : 4;
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
                fillOpacity={0.9}
                color={isCritical ? "#ffffff" : "#1f2933"}
                weight={1}
                className={isCritical ? "status-dot-red" : undefined}
                eventHandlers={{
                  click: () => {
                    if (onOpenVerify) onOpenVerify(fire);
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

                    {/* Material Response Protocol */}
                    <ResponseProtocol category={fire.category} compact={true} />

                    {/* Actions & Dispatch */}
                    <div className="border-t border-[#1f2933] pt-1.5 space-y-1.5">
                      {/* Dispatch Simulation Button */}
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
                        className="w-full text-[10px] border border-[#ff3b3b] bg-[#ff3b3b]/15 hover:bg-[#ff3b3b]/25 text-[#ff8080] hover:text-white py-1 uppercase font-bold text-center cursor-pointer tracking-wider transition flex items-center justify-center gap-1"
                      >
                        <span>[ 🚒 DISPATCH SIMULATION &gt;&gt; ]</span>
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
                        [ VERIFY SCENE & ROAD CONTEXT &gt;&gt; ]
                      </button>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>

        {/* Bottom-Left Live Telemetry Overlay */}
        <div className="absolute bottom-2 left-2 z-[1000] pointer-events-none">
          <div className="border border-[#1f2933] bg-[#0a0e14]/90 px-2.5 py-1 text-[10px] font-mono text-[#00d4ff] tabular-nums flex items-center gap-2">
            <span>
              COORDS: {currentCenter.lat.toFixed(4)}°N, {currentCenter.lon.toFixed(4)}°E
            </span>
            <span className="text-[#4a5563]">::</span>
            <span>ZOOM: {currentCenter.zoom}</span>
          </div>
        </div>

        {/* Bottom-Right Legend & Crosshair */}
        <div className="absolute bottom-2 right-2 z-[1000] pointer-events-auto">
          <div className="border border-[#1f2933] bg-[#0a0e14]/95 p-2 text-[10px] font-mono space-y-1">
            <div className="text-[9px] text-[#6b7785] font-bold border-b border-[#1f2933] pb-0.5 flex justify-between">
              <span>// SURVEILLANCE LEGEND</span>
              <span className="text-[#00ff9c]">[OK]</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ff3b3b]" />
              <span className="text-[#d0d8e0]">EMERGENCY (CRIT)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#ffb800]" />
              <span className="text-[#d0d8e0]">PERSISTENT (WORKS)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ff9500]" />
              <span className="text-[#d0d8e0]">AGRICULTURAL (CROP)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00ff9c]" />
              <span className="text-[#d0d8e0]">FOREST (WILDLAND)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#4a5563]" />
              <span className="text-[#6b7785]">UNCLASSIFIED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
