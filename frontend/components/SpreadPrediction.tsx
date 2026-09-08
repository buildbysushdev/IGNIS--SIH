"use client";

import { useState } from "react";
import type { Fire } from "./FireMap";

export interface SpreadPredictionStep {
  hour: number;
  spread_direction: string;
  spread_azimuth_deg: number;
  spread_distance_km: number;
  affected_area_km2: number;
  rate_of_spread_kmh: number;
  confidence: number;
}

export interface AtRiskLocation {
  name: string;
  type: string;
  distance_km: number;
  eta_hours: number;
  coordinates?: [number, number];
  risk_severity: "CRITICAL" | "HIGH" | "MODERATE";
}

export interface SpreadPredictionData {
  status: string;
  fire_id: string;
  origin: { latitude: number; longitude: number };
  frp: number;
  category: string;
  weather: {
    source?: string;
    temperature: number;
    wind_speed: number;
    wind_direction: number;
    wind_compass: string;
    humidity: number;
  };
  spread_azimuth_deg: number;
  spread_direction: string;
  rate_of_spread_kmh: number;
  predictions: SpreadPredictionStep[];
  spread_cone_coordinates: [number, number][];
  cones_by_hour: Record<string, [number, number][]>;
  at_risk_locations: AtRiskLocation[];
  recommendations: string[];
  fire_break?: {
    latitude: number;
    longitude: number;
    distance_km: number;
    spread_axis: string;
  };
}

interface SpreadPredictionProps {
  fire: Fire | null;
  prediction: SpreadPredictionData | null;
  loading: boolean;
  activeHour: 1 | 3 | 6;
  onSelectHour: (hour: 1 | 3 | 6) => void;
  onClose: () => void;
}

export default function SpreadPrediction({
  fire,
  prediction,
  loading,
  activeHour,
  onSelectHour,
  onClose,
}: SpreadPredictionProps) {
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);

  if (!fire && !prediction && !loading) return null;

  // Active step metrics
  const activeStep = prediction?.predictions.find((p) => p.hour === activeHour) || prediction?.predictions[0];

  // Wind and Spread Rotations
  // Wind direction is FROM angle
  const windFromDeg = prediction?.weather?.wind_direction ?? 255;
  // Spread is downwind
  const spreadAzimuth = prediction?.spread_azimuth_deg ?? (windFromDeg + 180) % 360;

  const handleCopyBrief = () => {
    if (!prediction) return;
    const briefText = `
=== IGNIS FIRE SPREAD PREDICTION BRIEF ===
INCIDENT ID: ${prediction.fire_id}
COORDINATES: ${prediction.origin.latitude.toFixed(4)}°N, ${prediction.origin.longitude.toFixed(4)}°E
FIRE CATEGORY: ${prediction.category} | FRP: ${prediction.frp} MW
ATMOSPHERE: ${prediction.weather.temperature}°C | Wind: ${prediction.weather.wind_speed} km/h from ${prediction.weather.wind_compass} (${prediction.weather.wind_direction}°) | Humidity: ${prediction.weather.humidity}% RH
PROPAGATION VECTOR: Advancing towards ${prediction.spread_direction} (${spreadAzimuth.toFixed(1)}°)
RATE OF ADVANCE: ${prediction.rate_of_spread_kmh} km/h
SELECTED PROJECTION: ${activeHour} Hours
- Advancing Distance: ${activeStep?.spread_distance_km} km
- Projected Burn Footprint: ${activeStep?.affected_area_km2} km²
- Model Confidence: ${Math.round((activeStep?.confidence || 0) * 100)}%

AT-RISK LOCATIONS:
${prediction.at_risk_locations.map((a) => `- [ETA: ${a.eta_hours}h] ${a.name} (${a.distance_km} km) [${a.risk_severity}]`).join("\n")}

RECOMMENDED DIRECTIVES:
${prediction.recommendations.map((r, i) => `${i + 1}. ${r}`).join("\n")}
==========================================
    `.trim();

    navigator.clipboard.writeText(briefText);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[460px] bg-[#0a0e14]/95 backdrop-blur-md border-l border-[#1f2933] shadow-[-8px_0_30px_rgba(0,0,0,0.8)] z-50 flex flex-col font-mono text-xs text-[#d0d8e0] animate-in slide-in-from-right duration-300">
      {/* Header Bar */}
      <div className="p-3 border-b border-[#1f2933] bg-[#0f141b] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff9500] animate-pulse" />
          <div>
            <div className="font-bold text-sm tracking-wider text-[#ff9500] uppercase flex items-center gap-2">
              <span>FIRE SPREAD PREDICTION</span>
              <span className="text-[10px] text-[#00d4ff] border border-[#1f2933] px-1 py-0.2 bg-[#0a0e14]">
                ROTHERMEL-v2
              </span>
            </div>
            <div className="text-[10px] text-[#6b7785] tracking-widest">
              TELEMETRY SPREAD VECTORS & RISK MODELING
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="px-2 py-1 border border-[#1f2933] bg-[#0a0e14] hover:bg-[#15202c] text-[#6b7785] hover:text-white uppercase font-bold text-[11px] cursor-pointer transition"
        >
          [ ✕ CLOSE ]
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-[#6b7785]">
            <div className="w-8 h-8 border-2 border-[#ff9500] border-t-transparent rounded-full animate-spin" />
            <div className="text-[11px] text-[#00d4ff] font-bold">
              [ COMPUTING ATMOSPHERIC & ROTHERMEL VECTORS... ]
            </div>
            <div className="text-[9px] text-[#4a5563]">
              QUERYING OPEN-METEO TELEMETRY & FUEL EXPANSION CONES
            </div>
          </div>
        ) : prediction ? (
          <>
            {/* Origin & Category Banner */}
            <div className="border border-[#1f2933] bg-[#0f141b] p-2.5 flex items-center justify-between">
              <div>
                <span className="text-[9px] text-[#6b7785] uppercase">INCIDENT ORIGIN</span>
                <div className="font-bold text-[11px] text-[#00d4ff]">
                  {prediction.origin.latitude.toFixed(4)}°N, {prediction.origin.longitude.toFixed(4)}°E
                </div>
                <div className="text-[10px] text-[#d0d8e0] mt-0.5">
                  FRP: <span className="text-[#ffb800] font-bold">{prediction.frp} MW</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[9px] text-[#6b7785] uppercase">FUEL CLASSIFICATION</span>
                <div className="font-bold text-[10px] text-[#ff3b3b] uppercase">
                  {prediction.category.replace(/_/g, " ")}
                </div>
                <div className="text-[9px] text-[#00ff9c]">
                  ACTIVE SATELLITE ANOMALY
                </div>
              </div>
            </div>

            {/* Tactical Wind & Propagation Compass Widget */}
            <div className="border border-[#1f2933] bg-[#0d1219] p-3">
              <div className="text-[10px] text-[#00d4ff] font-bold uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>// PROPAGATION VECTOR DYNAMICS</span>
                <span className="text-[#6b7785] text-[9px]">ATMOSPHERIC HUD</span>
              </div>

              <div className="flex items-center justify-around gap-4">
                {/* Visual Compass Graphic */}
                <div className="relative w-24 h-24 rounded-full border-2 border-[#1f2933] bg-[#080c10] flex items-center justify-center flex-shrink-0 shadow-[inset_0_0_15px_rgba(0,0,0,0.8)]">
                  {/* Compass Markers */}
                  <span className="absolute top-1 text-[8px] font-bold text-[#6b7785]">N</span>
                  <span className="absolute bottom-1 text-[8px] font-bold text-[#6b7785]">S</span>
                  <span className="absolute left-1.5 text-[8px] font-bold text-[#6b7785]">W</span>
                  <span className="absolute right-1.5 text-[8px] font-bold text-[#6b7785]">E</span>

                  {/* Concentric rings */}
                  <div className="w-16 h-16 rounded-full border border-[#1f2933]/60" />
                  <div className="w-8 h-8 rounded-full border border-[#1f2933]/40" />

                  {/* Wind Vector (Blue Arrow pointing in wind direction) */}
                  <div
                    className="absolute inset-0 flex items-center justify-center transition-transform duration-700 pointer-events-none"
                    style={{ transform: `rotate(${windFromDeg}deg)` }}
                    title={`Wind from: ${windFromDeg}°`}
                  >
                    <div className="w-0.5 h-10 bg-gradient-to-t from-transparent to-[#00d4ff]" />
                    <div className="absolute top-1 w-1.5 h-1.5 bg-[#00d4ff] rounded-full" />
                  </div>

                  {/* Downwind Fire Spread Vector (Orange/Red Flaming Arrow) */}
                  <div
                    className="absolute inset-0 flex items-center justify-center transition-transform duration-700 pointer-events-none"
                    style={{ transform: `rotate(${spreadAzimuth}deg)` }}
                    title={`Fire advancing towards: ${spreadAzimuth}° (${prediction.spread_direction})`}
                  >
                    <div className="w-1 h-11 bg-gradient-to-t from-transparent to-[#ff3b3b] shadow-[0_0_8px_#ff3b3b]" />
                    <div className="absolute top-0.5 text-[#ff3b3b] text-xs font-black">▲</div>
                  </div>

                  {/* Origin Dot */}
                  <div className="w-2 h-2 rounded-full bg-[#ffb800] z-10 border border-[#0a0e14]" />
                </div>

                {/* Weather Readings */}
                <div className="space-y-1.5 text-[10px] flex-1">
                  <div className="flex justify-between border-b border-[#1f2933] pb-1">
                    <span className="text-[#6b7785]">WIND:</span>
                    <span className="text-[#00d4ff] font-bold tabular-nums">
                      {prediction.weather.wind_speed} km/h ({prediction.weather.wind_compass})
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-[#1f2933] pb-1">
                    <span className="text-[#6b7785]">SPREAD TOWARD:</span>
                    <span className="text-[#ff9500] font-bold">
                      {prediction.spread_direction} ({spreadAzimuth.toFixed(0)}°)
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-[#1f2933] pb-1">
                    <span className="text-[#6b7785]">FORWARD RATE (RoS):</span>
                    <span className="text-[#00ff9c] font-bold tabular-nums">
                      {prediction.rate_of_spread_kmh} km/h
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6b7785]">TEMP / HUMIDITY:</span>
                    <span className="text-[#d0d8e0] tabular-nums">
                      {prediction.weather.temperature}°C / {prediction.weather.humidity}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline Horizon Selector Tabs */}
            <div className="space-y-1.5">
              <div className="text-[10px] text-[#6b7785] font-bold uppercase tracking-wider flex justify-between">
                <span>PROJECTED TIME HORIZON</span>
                <span className="text-[#00d4ff]">SELECT SPREAD CONE</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {([1, 3, 6] as const).map((h) => {
                  const step = prediction.predictions.find((p) => p.hour === h);
                  const isSelected = activeHour === h;
                  return (
                    <button
                      key={h}
                      onClick={() => onSelectHour(h)}
                      className={`p-2 border text-center transition cursor-pointer ${
                        isSelected
                          ? "border-[#ff9500] bg-[#ff9500]/20 text-white shadow-[0_0_12px_rgba(255,149,0,0.3)]"
                          : "border-[#1f2933] bg-[#0f141b] hover:bg-[#15202c] text-[#6b7785] hover:text-[#d0d8e0]"
                      }`}
                    >
                      <div className="font-bold text-xs uppercase">{h} HOUR{h > 1 ? "S" : ""}</div>
                      <div className="text-[10px] text-[#ffb800] tabular-nums mt-0.5">
                        +{step?.spread_distance_km || 0} KM
                      </div>
                      <div className="text-[8px] text-[#4a5563] tabular-nums">
                        {step?.affected_area_km2 || 0} km²
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Horizon Impact Card */}
            {activeStep && (
              <div className="border border-[#1f2933] bg-[#0c1017] p-2.5">
                <div className="text-[10px] text-[#ffb800] font-bold uppercase tracking-wider mb-2 flex items-center justify-between border-b border-[#1f2933] pb-1">
                  <span>{activeHour}-HOUR EXPANSION SUMMARY</span>
                  <span className="text-[#00ff9c]">CONFIDENCE: {Math.round(activeStep.confidence * 100)}%</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] tabular-nums">
                  <div className="bg-[#0f141b] p-1.5 border border-[#1f2933]">
                    <span className="text-[9px] text-[#6b7785] uppercase">MAX FORWARD ADVANCE</span>
                    <div className="text-sm font-bold text-[#ff3b3b] mt-0.5">
                      {activeStep.spread_distance_km} <span className="text-xs font-normal">KM</span>
                    </div>
                  </div>
                  <div className="bg-[#0f141b] p-1.5 border border-[#1f2933]">
                    <span className="text-[9px] text-[#6b7785] uppercase">BURNED FOOTPRINT</span>
                    <div className="text-sm font-bold text-[#ffb800] mt-0.5">
                      {activeStep.affected_area_km2} <span className="text-xs font-normal">KM²</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* At-Risk Settlements & Infrastructure List */}
            <div className="space-y-1.5">
              <div className="text-[10px] text-[#00d4ff] font-bold uppercase tracking-wider flex items-center justify-between">
                <span>// AT-RISK INFRASTRUCTURE & SETTLEMENTS</span>
                <span className="text-[#ff3b3b] text-[9px]">{prediction.at_risk_locations.length} IDENTIFIED</span>
              </div>

              <div className="space-y-1">
                {prediction.at_risk_locations.map((loc, idx) => {
                  const isCritical = loc.risk_severity === "CRITICAL";
                  return (
                    <div
                      key={idx}
                      className={`p-2 border flex items-center justify-between text-[10px] ${
                        isCritical
                          ? "border-[#ff3b3b]/60 bg-[#ff3b3b]/10 text-[#ff8080]"
                          : "border-[#1f2933] bg-[#0f141b] text-[#d0d8e0]"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs">
                          {loc.type === "HIGHWAY" ? "🛣️" : loc.type === "HOSPITAL" ? "🏥" : loc.type === "SETTLEMENT" ? "🏘️" : "🏭"}
                        </span>
                        <div>
                          <div className="font-bold text-[11px] text-[#d0d8e0]">{loc.name}</div>
                          <div className="text-[9px] text-[#6b7785]">
                            TYPE: {loc.type} | DIST: {loc.distance_km} KM
                          </div>
                        </div>
                      </div>

                      <div className="text-right tabular-nums">
                        <div
                          className={`font-black text-[11px] px-1.5 py-0.5 rounded-none border ${
                            isCritical
                              ? "bg-[#ff3b3b] text-black border-[#ff3b3b]"
                              : "bg-[#15202c] text-[#ffb800] border-[#1f2933]"
                          }`}
                        >
                          ETA {loc.eta_hours}H
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actionable Tactical Recommendations */}
            <div className="space-y-1.5">
              <div className="text-[10px] text-[#00ff9c] font-bold uppercase tracking-wider">
                // COMMAND CONTAINMENT RECOMMENDATIONS
              </div>
              <div className="space-y-1">
                {prediction.recommendations.map((rec, idx) => (
                  <div
                    key={idx}
                    className="p-2 border border-[#1f2933] bg-[#0d131a] flex items-start gap-2 text-[10px] leading-relaxed"
                  >
                    <span className="text-[#00ff9c] font-bold flex-shrink-0">
                      [0{idx + 1}]
                    </span>
                    <span className="text-[#d0d8e0]">{rec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tactical Fire Break Coordinates */}
            {prediction.fire_break && (
              <div className="border border-[#1f2933] bg-[#080c10] p-2 text-[10px] flex items-center justify-between">
                <div>
                  <span className="text-[8px] text-[#6b7785] uppercase">RECOMMENDED FIRE BREAK LINE</span>
                  <div className="font-bold text-[#00d4ff] tabular-nums">
                    {prediction.fire_break.latitude.toFixed(4)}°N, {prediction.fire_break.longitude.toFixed(4)}°E
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[8px] text-[#6b7785] uppercase">STAGING DISTANCE</span>
                  <div className="font-bold text-[#ffb800] tabular-nums">
                    {prediction.fire_break.distance_km} KM ADVANCE
                  </div>
                </div>
              </div>
            )}
          </>
        ) : null}
      </div>

      {/* Footer Actions */}
      <div className="p-3 border-t border-[#1f2933] bg-[#0f141b] flex items-center justify-between gap-2">
        <button
          onClick={handleCopyBrief}
          disabled={!prediction}
          className="flex-1 py-1.5 px-2 border border-[#00d4ff] bg-[#00d4ff]/15 hover:bg-[#00d4ff]/30 text-[#00d4ff] hover:text-white font-bold text-[10px] uppercase tracking-wider text-center cursor-pointer transition flex items-center justify-center gap-1.5"
        >
          <span>📋</span>
          <span>{copiedNotification ? "BRIEF COPIED TO CLIPBOARD!" : "EXPORT SPREAD BRIEF"}</span>
        </button>

        <button
          onClick={onClose}
          className="py-1.5 px-3 border border-[#1f2933] bg-[#0a0e14] hover:bg-[#15202c] text-[#6b7785] hover:text-white font-bold text-[10px] uppercase cursor-pointer transition"
        >
          DISMISS
        </button>
      </div>
    </div>
  );
}
