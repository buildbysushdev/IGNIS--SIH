"use client";

import React, { useState } from "react";
import type { Fire } from "@/components/FireMap";
import { findLocalNearestStation } from "@/components/FireMap";
import InfoTooltip from "@/components/InfoTooltip";

interface FireDetailDrawerProps {
  fire: Fire | null;
  onClose: () => void;
  onOpenDispatch?: (fire: Fire) => void;
  onOpenHistory?: (fire: Fire) => void;
  onOpenVerify?: (fire: Fire) => void;
  onOpenSpreadPrediction?: (fire: Fire) => void;
  onAskAgni?: (fire: Fire) => void;
  initialProtocolOpen?: boolean;
}

const CATEGORY_STYLES: Record<
  string,
  { label: string; badge: string; border: string; text: string }
> = {
  EMERGENCY_INDUSTRIAL: {
    label: "Emergency Industrial Fire",
    badge: "bg-red-950/80 text-red-300 border-red-500",
    border: "border-red-500",
    text: "text-red-400",
  },
  PERSISTENT_INDUSTRIAL: {
    label: "Persistent Industrial Source",
    badge: "bg-purple-950/80 text-purple-300 border-purple-500",
    border: "border-purple-500",
    text: "text-purple-400",
  },
  AGRICULTURAL_BURNING: {
    label: "Agricultural Burning / Stubble",
    badge: "bg-amber-950/80 text-amber-300 border-amber-500",
    border: "border-amber-500",
    text: "text-amber-400",
  },
  FOREST_FIRE: {
    label: "Forest / Wildland Fire",
    badge: "bg-emerald-950/80 text-emerald-300 border-emerald-500",
    border: "border-emerald-500",
    text: "text-emerald-400",
  },
  UNKNOWN: {
    label: "Unclassified / Small Burn",
    badge: "bg-gray-800 text-gray-300 border-gray-600",
    border: "border-gray-500",
    text: "text-gray-400",
  },
};

export default function FireDetailDrawer({
  fire,
  onClose,
  onOpenDispatch,
  onOpenHistory,
  onOpenVerify,
  onOpenSpreadPrediction,
  onAskAgni,
  initialProtocolOpen = false,
}: FireDetailDrawerProps) {
  const [protocolOpen, setProtocolOpen] = useState(
    initialProtocolOpen || fire?.category === "EMERGENCY_INDUSTRIAL"
  );

  if (!fire) return null;

  const catStyle =
    CATEGORY_STYLES[fire.category] || CATEGORY_STYLES.UNKNOWN;
  const station = findLocalNearestStation(fire.latitude, fire.longitude);

  return (
    <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 md:left-8 md:right-8 lg:left-12 lg:right-12 z-30 max-w-4xl mx-auto bg-[#111827]/95 backdrop-blur-md border border-[#1F2937] shadow-2xl rounded-xl p-4 text-[#E5E7EB] transition-all animate-in fade-in slide-in-from-bottom-6 duration-200 font-sans">
      {/* Top Bar / Header */}
      <div className="flex items-center justify-between border-b border-[#1F2937] pb-3 mb-3">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${catStyle.badge}`}
          >
            {catStyle.label}
          </span>
          <span className="text-xs text-[#9CA3AF] font-mono">
            {fire.latitude.toFixed(4)}°N, {fire.longitude.toFixed(4)}°E
          </span>
          <span className="text-xs text-[#22D3EE] font-mono bg-[#0B1220] px-2 py-0.5 rounded border border-[#1F2937]">
            FRP: {fire.frp ? `${fire.frp.toFixed(1)} MW` : "N/A"}
          </span>
          {fire.acq_date && (
            <span className="text-[11px] text-[#9CA3AF] font-mono hidden sm:inline">
              Acquired: {fire.acq_date} {fire.acq_time} UTC
            </span>
          )}
        </div>

        <button
          onClick={onClose}
          className="text-[#9CA3AF] hover:text-white p-1 rounded-lg hover:bg-[#1F2937] transition text-sm font-bold"
          title="Close details"
        >
          ✕
        </button>
      </div>

      {/* Main Grid: Telemetry & Nearest Infrastructure */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs mb-3">
        <div className="bg-[#0B1220]/70 p-2.5 rounded-lg border border-[#1F2937]/80">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-[11px] text-[#9CA3AF]">
              Severity Assessment
            </span>
            <InfoTooltip
              title="Threat Assessment"
              text="Computed emergency priority considering proximity to hazardous industrial infrastructure and radiant heat output."
              position="top"
            />
          </div>
          <span
            className={`font-semibold text-sm ${
              fire.risk_level === "CRITICAL"
                ? "text-red-400"
                : fire.risk_level === "HIGH"
                ? "text-amber-400"
                : "text-emerald-400"
            }`}
          >
            {fire.risk_level || "EVALUATED"}
          </span>
        </div>

        <div className="bg-[#0B1220]/70 p-2.5 rounded-lg border border-[#1F2937]/80">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-[11px] text-[#9CA3AF]">
              Nearest Fire Station
            </span>
            <InfoTooltip
              title="Turnout Station"
              text="Closest municipal / industrial fire tender base with computed road distance and response ETA."
              position="top"
            />
          </div>
          <span className="font-semibold text-white truncate block">
            {station.name}
          </span>
          <span className="text-[11px] text-[#22D3EE] font-mono">
            {station.distance_km} km (ETA ~{station.eta_minutes}m)
          </span>
        </div>

        <div className="bg-[#0B1220]/70 p-2.5 rounded-lg border border-[#1F2937]/80">
          <span className="text-[11px] text-[#9CA3AF] block mb-0.5">
            Confidence
          </span>
          <span className="font-semibold text-emerald-400 font-mono text-sm">
            {fire.confidence ? `${fire.confidence}` : "High (Nominal)"}
          </span>
        </div>

        <div className="bg-[#0B1220]/70 p-2.5 rounded-lg border border-[#1F2937]/80">
          <span className="text-[11px] text-[#9CA3AF] block mb-0.5">
            Thermal Anomaly Source
          </span>
          <span className="font-semibold text-[#E5E7EB] truncate block">
            {fire.satellite || "VIIRS 375m Sensor"}
          </span>
        </div>
      </div>

      {/* Collapsible Response Protocol Accordion */}
      <div className="mb-3 border border-[#1F2937] rounded-lg overflow-hidden bg-[#0B1220]/40">
        <button
          type="button"
          onClick={() => setProtocolOpen(!protocolOpen)}
          className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-[#E5E7EB] hover:bg-[#1F2937]/40 transition text-left"
        >
          <div className="flex items-center gap-2">
            <span>🛡️</span>
            <span>Recommended Fire Response Protocol</span>
            <span className="text-[10px] text-[#9CA3AF] font-normal hidden sm:inline">
              (IS 2190 & NDMA guidelines)
            </span>
            <InfoTooltip
              title="Standard Operating Protocol"
              text="Automated chemical suppression SOPs, extinguishing agents, and evacuation perimeters per IS 2190 codes."
              position="top"
            />
          </div>
          <span className="text-[#9CA3AF]">{protocolOpen ? "▲" : "▼"}</span>
        </button>

        {protocolOpen && (
          <div className="p-3 border-t border-[#1F2937] text-xs space-y-2 bg-[#0B1220]/80">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <span className="text-[10px] text-[#9CA3AF] block font-semibold">
                  Primary Extinguishing Agents:
                </span>
                <span className="text-[#22D3EE] font-medium">
                  {fire.category === "EMERGENCY_INDUSTRIAL"
                    ? "AFFF High-Expansion Foam, Class D Dry Chemical"
                    : fire.category === "FOREST_FIRE"
                    ? "Water Spray, Retardant Slurry, Soil Beaters"
                    : "Water Mist, CO2 for electrical hazards"}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#9CA3AF] block font-semibold">
                  Hazards & Prohibitions:
                </span>
                <span className="text-red-400 font-medium">
                  {fire.category === "EMERGENCY_INDUSTRIAL"
                    ? "Avoid direct water jets on molten metal or hydrocarbon tanks"
                    : "Beware of downwind toxic particulates and canopy flare-ups"}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#9CA3AF] block font-semibold">
                  Containment Perimeter:
                </span>
                <span className="text-amber-400 font-medium">
                  {fire.category === "EMERGENCY_INDUSTRIAL"
                    ? "500m Cordon + Hazmat Evacuation"
                    : "200m Cordon with Windward Access"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons Row */}
      <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
        {onOpenSpreadPrediction && (
          <button
            onClick={() => onOpenSpreadPrediction(fire)}
            className="px-3 py-1.5 bg-[#1F2937] hover:bg-[#283548] text-[#22D3EE] border border-[#22D3EE]/40 text-xs font-semibold rounded-lg transition flex items-center gap-1.5"
          >
            <span>💨</span>
            <span>Predict Spread</span>
          </button>
        )}

        {onOpenHistory && (
          <button
            onClick={() => onOpenHistory(fire)}
            className="px-3 py-1.5 bg-[#1F2937] hover:bg-[#283548] text-[#E5E7EB] border border-[#1F2937] text-xs font-semibold rounded-lg transition flex items-center gap-1.5"
          >
            <span>📊</span>
            <span>View History</span>
          </button>
        )}

        {onOpenVerify && (
          <button
            onClick={() => onOpenVerify(fire)}
            className="px-3 py-1.5 bg-[#1F2937] hover:bg-[#283548] text-[#E5E7EB] border border-[#1F2937] text-xs font-semibold rounded-lg transition flex items-center gap-1.5"
          >
            <span>🔍</span>
            <span>Verify Scene</span>
          </button>
        )}

        {onAskAgni && (
          <button
            onClick={() => onAskAgni(fire)}
            className="px-3 py-1.5 bg-[#1F2937] hover:bg-[#283548] text-[#F59E0B] border border-[#F59E0B]/40 text-xs font-semibold rounded-lg transition flex items-center gap-1.5"
          >
            <span>🤖</span>
            <span>Ask AGNI-AI</span>
          </button>
        )}

        {onOpenDispatch && (
          <button
            onClick={() => onOpenDispatch(fire)}
            className="px-4 py-1.5 bg-[#EF4444] hover:bg-red-600 text-white font-semibold text-xs rounded-lg transition shadow-md flex items-center gap-1.5"
          >
            <span>🚨</span>
            <span>Simulate Dispatch</span>
          </button>
        )}
      </div>
    </div>
  );
}
