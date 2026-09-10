"use client";

import React from "react";
import { useI18n } from "@/context/I18nContext";
import InfoTooltip from "@/components/InfoTooltip";

export interface FireStats {
  total: number;
  emergency: number;
  persistent: number;
  agricultural: number;
  forest: number;
  unknown: number;
}

interface StatsPanelProps {
  stats: FireStats | null | undefined;
  activeCategory?: string;
  onSelectCategory?: (category: string) => void;
  onOpenProtocol?: () => void;
  onOpenDispatch?: () => void;
  onOpenChatbot?: () => void;
}

export default function StatsPanel({
  stats,
  activeCategory = "all",
  onSelectCategory,
  onOpenProtocol,
  onOpenDispatch,
  onOpenChatbot,
}: StatsPanelProps) {
  const { t, formatNumber } = useI18n();

  const total = stats?.total ?? 0;
  const emergency = stats?.emergency ?? 0;
  const persistent = stats?.persistent ?? 0;
  const agricultural = stats?.agricultural ?? 0;
  const forest = stats?.forest ?? 0;
  const rawUnknown = stats?.unknown ?? 0;
  const unknown =
    rawUnknown > 0
      ? rawUnknown
      : Math.max(0, total - (emergency + persistent + agricultural + forest));

  const items = [
    {
      key: "EMERGENCY_INDUSTRIAL",
      label: "Emergency Fires",
      sublabel: "Hospitals / Fuel / Slums / Factories",
      val: emergency,
      color: "bg-red-500",
      textColor: "text-red-400",
      dot: "#EF4444",
      tooltipTitle: "Emergency Fires",
      tooltipText:
        "High-intensity fires near Hospitals, Fuel Stations, Slums, or Factories requiring emergency dispatch.",
    },
    {
      key: "PERSISTENT_INDUSTRIAL",
      label: "Persistent Sources",
      sublabel: "Steel Plants / Refineries / Kilns",
      val: persistent,
      color: "bg-amber-500",
      textColor: "text-amber-400",
      dot: "#F59E0B",
      tooltipTitle: "Persistent Sources",
      tooltipText:
        "Continuous manufacturing heat from plants like Bhilai/Bokaro monitored without false alarms.",
    },
    {
      key: "AGRICULTURAL_BURNING",
      label: "Agricultural Burning",
      sublabel: "Crop Stubble & Field Clearing",
      val: agricultural,
      color: "bg-blue-500",
      textColor: "text-blue-400",
      dot: "#3B82F6",
      tooltipTitle: "Agricultural Stubble",
      tooltipText:
        "Seasonal crop residue and stubble burns in farm belts. Tracked for air quality management and spread prevention.",
    },
    {
      key: "FOREST_FIRE",
      label: "Forest Wildland",
      sublabel: "Canopy & Wilderness Reserves",
      val: forest,
      color: "bg-emerald-500",
      textColor: "text-emerald-400",
      dot: "#22C55E",
      tooltipTitle: "Forest Wildland",
      tooltipText:
        "Active vegetation and canopy fires in forest reserves requiring state forest department coordination.",
    },
    {
      key: "UNKNOWN",
      label: "Low-Intensity Burns",
      sublabel: "Garbage / Bonfires (Suppressed)",
      val: unknown,
      color: "bg-slate-400",
      textColor: "text-slate-400",
      dot: "#94A3B8",
      tooltipTitle: "Low-Intensity Burns",
      tooltipText:
        "Small heat spots like backyard garbage or bonfires automatically filtered out to prevent false alarms.",
    },
  ];

  return (
    <div className="space-y-3 font-sans text-xs">
      {/* BLOCK 1: OVERVIEW STATS */}
      <div className="bg-[#111827] border border-[#1F2937] rounded-xl p-3.5 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#1F2937] pb-2.5 mb-2.5">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-xs text-[#9CA3AF] uppercase tracking-wider">
              Overview Stats
            </span>
            <InfoTooltip
              title="Overview Statistics"
              text="Real-time breakdown of thermal detections across India categorized by the IGNIS tactical engine."
              position="right"
            />
          </div>
          <button
            onClick={() => onSelectCategory && onSelectCategory("all")}
            className={`text-[11px] px-2 py-0.5 rounded font-medium transition ${
              activeCategory === "all"
                ? "bg-[#22D3EE]/20 text-[#22D3EE] font-semibold"
                : "text-[#9CA3AF] hover:text-white"
            }`}
          >
            Show All
          </button>
        </div>

        {/* Big Total Hotspots Card */}
        <div
          onClick={() => onSelectCategory && onSelectCategory("all")}
          className="bg-[#0B1220] border border-[#1F2937] rounded-lg p-3 mb-2.5 flex items-center justify-between cursor-pointer hover:border-gray-600 transition"
        >
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-[#9CA3AF]">Total Active Hotspots</span>
              <InfoTooltip
                title="Active Hotspots"
                text="Total satellite thermal anomalies captured by VIIRS and MODIS sensors over India in the active timeframe."
                position="top"
              />
            </div>
            <span className="text-2xl font-black text-white font-mono">
              {formatNumber(total)}
            </span>
          </div>
          <span className="text-xl">🛰️</span>
        </div>

        {/* 5 Category Metric Rows */}
        <div className="space-y-1.5">
          {items.map((it) => {
            const isSelected = activeCategory === it.key;
            return (
              <div
                key={it.key}
                className={`w-full flex items-center justify-between p-2 rounded-lg transition text-left cursor-pointer ${
                  isSelected
                    ? "bg-[#1F2937] border border-gray-600 text-white font-semibold"
                    : "bg-[#0B1220]/50 hover:bg-[#0B1220] border border-transparent text-[#E5E7EB]"
                }`}
                onClick={() => onSelectCategory && onSelectCategory(it.key)}
              >
                <div className="flex items-center gap-2 min-w-0 pr-1">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: it.dot }}
                  />
                  <span className="truncate">{it.label}</span>
                  <InfoTooltip
                    title={it.tooltipTitle}
                    text={it.tooltipText}
                    position="right"
                  />
                </div>
                <span className={`font-mono font-bold text-xs ${it.textColor} flex-shrink-0`}>
                  {formatNumber(it.val)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* BLOCK 2: DISTRIBUTION MINI CHART */}
      <div className="bg-[#111827] border border-[#1F2937] rounded-xl p-3.5 shadow-sm space-y-2">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-xs text-[#9CA3AF] uppercase tracking-wider block">
            Distribution Breakdown
          </span>
          <InfoTooltip
            title="Distribution Chart"
            text="Proportional ratio of active thermal detections across India."
            position="right"
          />
        </div>

        {/* Stacked Proportional Bar */}
        <div className="w-full h-3 rounded-full bg-[#0B1220] overflow-hidden flex border border-[#1F2937]">
          {total > 0 && items.some((it) => it.val > 0) ? (
            items.map((it) => {
              const pct = (it.val / total) * 100;
              if (pct <= 0) return null;
              return (
                <div
                  key={it.key}
                  className={`h-full ${it.color} transition-all duration-300`}
                  style={{ width: `${pct}%` }}
                  title={`${it.label}: ${pct.toFixed(1)}%`}
                />
              );
            })
          ) : total > 0 ? (
            <div className="w-full h-full bg-gradient-to-r from-[#22D3EE]/30 via-amber-500/30 to-[#22D3EE]/30 animate-pulse" />
          ) : (
            <div className="w-full h-full bg-gray-700" />
          )}
        </div>

        {/* Mini Percentage Badges */}
        {total > 0 && items.every((it) => it.val === 0) ? (
          <div className="text-[11px] text-amber-400/90 italic py-1 text-center animate-pulse">
            ⚡ Classifying active thermal telemetry...
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[10px] text-[#9CA3AF] pt-1">
            {items.map((it) => {
              const pct = total > 0 ? ((it.val / total) * 100).toFixed(0) : "0";
              return (
                <div key={it.key} className="flex items-center justify-between pr-1 bg-[#0B1220]/60 px-1.5 py-0.5 rounded border border-[#1F2937]/50">
                  <span className="flex items-center gap-1.5 truncate">
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: it.dot }}
                    />
                    <span className="truncate text-gray-300 font-medium">{it.label.split(" ")[0]}</span>
                  </span>
                  <span className="font-mono text-white font-bold ml-1">{pct}%</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* BLOCK 3: QUICK ACTIONS */}
      <div className="bg-[#111827] border border-[#1F2937] rounded-xl p-3.5 shadow-sm space-y-2">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-xs text-[#9CA3AF] uppercase tracking-wider block">
            Quick Actions
          </span>
          <InfoTooltip
            title="Tactical Actions"
            text="Immediate emergency dispatch, IS standard response protocols, and AI decision support."
            position="right"
          />
        </div>

        <div className="space-y-1.5">
          {onOpenProtocol && (
            <button
              onClick={onOpenProtocol}
              className="w-full flex items-center justify-between p-2.5 bg-[#0B1220] hover:bg-[#1F2937] border border-[#1F2937] hover:border-gray-600 rounded-lg text-xs text-[#E5E7EB] font-medium transition text-left"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">🛡️</span>
                <div>
                  <div className="font-semibold">Response Protocol</div>
                  <div className="text-[10px] text-[#9CA3AF]">IS 2190 & chemical standards</div>
                </div>
              </div>
              <InfoTooltip
                title="Response Protocols"
                text="Automated SOP guidance detailing recommended suppression agents (Class B Foam, Dry Chemical, Water) by facility type."
                position="left"
              />
            </button>
          )}

          {onOpenDispatch && (
            <button
              onClick={onOpenDispatch}
              className="w-full flex items-center justify-between p-2.5 bg-[#0B1220] hover:bg-[#1F2937] border border-[#1F2937] hover:border-red-500/40 rounded-lg text-xs text-[#E5E7EB] font-medium transition text-left"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">🚨</span>
                <div>
                  <div className="font-semibold text-red-400">Emergency Dispatch</div>
                  <div className="text-[10px] text-[#9CA3AF]">Route to nearest fire tender</div>
                </div>
              </div>
              <InfoTooltip
                title="Emergency Dispatch"
                text="Generates immediate mobilization alerts for NDRF, municipal fire brigades, and facility response coordinators."
                position="left"
              />
            </button>
          )}

          {onOpenChatbot && (
            <button
              onClick={onOpenChatbot}
              className="w-full flex items-center justify-between p-2.5 bg-[#0B1220] hover:bg-[#1F2937] border border-[#1F2937] hover:border-amber-500/40 rounded-lg text-xs text-[#E5E7EB] font-medium transition text-left"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">🤖</span>
                <div>
                  <div className="font-semibold text-amber-400">AGNI-AI Assistant</div>
                  <div className="text-[10px] text-[#9CA3AF]">Tactical firefighting AI</div>
                </div>
              </div>
              <InfoTooltip
                title="AGNI-AI"
                text="Natural-language assistant trained on hazardous materials, IS 2190 fire codes, and incident escalation procedures."
                position="left"
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
