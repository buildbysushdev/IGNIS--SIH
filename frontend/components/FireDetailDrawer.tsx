"use client";

import React, { useState } from "react";
import type { Fire } from "@/components/FireMap";
import { findLocalNearestStation } from "@/components/FireMap";
import InfoTooltip from "@/components/InfoTooltip";
import { getResponseProtocol } from "@/data/fireResponse";

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
  HOSPITAL_FIRE: {
    label: "Hospital Life-Critical Fire",
    badge: "bg-red-950/90 text-red-200 border-red-500",
    border: "border-red-500",
    text: "text-red-400",
  },
  FUEL_STATION_FIRE: {
    label: "Petrol Pump / Fuel Depot Fire",
    badge: "bg-red-950/90 text-red-200 border-red-500",
    border: "border-red-500",
    text: "text-red-400",
  },
  SCHOOL_FIRE: {
    label: "School / College Campus Fire",
    badge: "bg-red-950/90 text-red-200 border-red-500",
    border: "border-red-500",
    text: "text-red-400",
  },
  SLUM_DENSE_URBAN_FIRE: {
    label: "Slum / High-Density Settlement Fire",
    badge: "bg-red-950/90 text-red-200 border-red-500",
    border: "border-red-500",
    text: "text-red-400",
  },
  EMERGENCY_INDUSTRIAL: {
    label: "Emergency Industrial Factory Fire",
    badge: "bg-red-950/80 text-red-300 border-red-500",
    border: "border-red-500",
    text: "text-red-400",
  },
  RESTAURANT_KITCHEN_FIRE: {
    label: "Restaurant / Commercial Kitchen Fire",
    badge: "bg-orange-950/80 text-orange-200 border-orange-500",
    border: "border-orange-500",
    text: "text-orange-400",
  },
  COMMERCIAL_MARKET_FIRE: {
    label: "Commercial Marketplace Fire",
    badge: "bg-orange-950/80 text-orange-200 border-orange-500",
    border: "border-orange-500",
    text: "text-orange-400",
  },
  RESIDENTIAL_STRUCTURE_FIRE: {
    label: "Residential Structure Fire",
    badge: "bg-orange-950/80 text-orange-200 border-orange-500",
    border: "border-orange-500",
    text: "text-orange-400",
  },
  PERSISTENT_INDUSTRIAL: {
    label: "Persistent Industrial Source (Routine)",
    badge: "bg-purple-950/80 text-purple-300 border-purple-500",
    border: "border-purple-500",
    text: "text-purple-400",
  },
  AGRICULTURAL_BURNING: {
    label: "Agricultural Stubble Burning",
    badge: "bg-amber-950/80 text-amber-300 border-amber-500",
    border: "border-amber-500",
    text: "text-amber-400",
  },
  FOREST_FIRE: {
    label: "Forest Reserve / Wildland Fire",
    badge: "bg-emerald-950/80 text-emerald-300 border-emerald-500",
    border: "border-emerald-500",
    text: "text-emerald-400",
  },
  DOMESTIC_LOW_INTENSITY_BURN: {
    label: "Low-Intensity Domestic Burn (Suppressed)",
    badge: "bg-slate-900/80 text-slate-300 border-slate-600",
    border: "border-slate-600",
    text: "text-slate-400",
  },
  UNKNOWN: {
    label: "Under Review / Unclassified",
    badge: "bg-gray-800/80 text-gray-300 border-gray-600",
    border: "border-gray-600",
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
    <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 md:left-8 md:right-8 lg:left-12 lg:right-12 z-[500] max-w-4xl mx-auto bg-[#111827]/95 backdrop-blur-md border border-[#1F2937] shadow-2xl rounded-xl p-4 text-[#E5E7EB] transition-all animate-in fade-in slide-in-from-bottom-6 duration-200 font-sans">
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

        {protocolOpen && (() => {
          const proto = (fire as any)?.response_protocol || getResponseProtocol(fire.category || "UNKNOWN");
          const agents = proto.use_agents?.primary?.join(", ") || (proto as any).USE?.join(", ") || "Water Spray, CO2";
          const avoidList = proto.avoid?.join("; ") || (proto as any).AVOID?.join("; ") || "Avoid unverified direct entry";
          const evacDist = proto.evacuation_radius_m !== undefined 
            ? (proto.evacuation_radius_m === 0 ? "0m (No evacuation needed - Suppressed)" : `${proto.evacuation_radius_m}m Cordon`)
            : ((proto as any).evacuation_radius || "200m Cordon");
          const equip = proto.equipment_required?.join(", ") || (proto as any).equipment?.join(", ") || "Standard Fire Tender Units";
          const specialNote = proto.special_notes || (proto as any).special_instruction || "";

          return (
            <div className="p-3 border-t border-[#1F2937] text-xs space-y-2.5 bg-[#0B1220]/90">
              <div className="flex items-center justify-between pb-1.5 border-b border-[#1F2937]/60">
                <span className="text-[11px] font-bold text-[#E5E7EB]">
                  Classification: <span className="text-[#22D3EE] font-mono">{proto.fire_class || "Standard Class"}</span>
                </span>
                {proto.response_time_target_min && proto.response_time_target_min !== "N/A" && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-red-950/60 border border-red-500/40 text-red-300 font-semibold font-mono">
                    Target Turnout: {proto.response_time_target_min} min
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <span className="text-[10px] text-[#9CA3AF] block font-semibold mb-0.5">
                    Primary Extinguishing Agents:
                  </span>
                  <span className="text-[#22D3EE] font-medium leading-tight block">
                    {agents}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#9CA3AF] block font-semibold mb-0.5">
                    Hazards & Prohibitions:
                  </span>
                  <span className={`font-medium leading-tight block ${avoidList.includes("DO NOT USE WATER") || avoidList.includes("water on hot cooking oil") ? "text-red-400 font-bold" : "text-amber-300"}`}>
                    {avoidList}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#9CA3AF] block font-semibold mb-0.5">
                    Containment Perimeter:
                  </span>
                  <span className="text-amber-400 font-medium leading-tight block">
                    {evacDist}
                  </span>
                </div>
              </div>

              {specialNote && (
                <div className="p-2 rounded bg-[#111827] border border-[#1F2937] text-[11px] text-[#E5E7EB] leading-relaxed">
                  <span className="text-cyan-400 font-semibold">Special Directives: </span>
                  {specialNote}
                </div>
              )}

              {equip && (
                <div className="text-[10px] text-[#9CA3AF] pt-0.5 flex flex-wrap items-center gap-1">
                  <span className="font-semibold text-[#D1D5DB]">Mandated Equipment:</span>
                  <span>{equip}</span>
                </div>
              )}
            </div>
          );
        })()}
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
