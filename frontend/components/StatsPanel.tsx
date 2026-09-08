"use client";

import React from "react";
import { useI18n } from "@/context/I18nContext";

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
      label: t("categories.EMERGENCY_INDUSTRIAL", "Emergency Industrial"),
      val: emergency,
      color: "bg-red-500",
      textColor: "text-red-400",
      dot: "#EF4444",
    },
    {
      key: "PERSISTENT_INDUSTRIAL",
      label: t("categories.PERSISTENT_INDUSTRIAL", "Persistent Industrial"),
      val: persistent,
      color: "bg-purple-500",
      textColor: "text-purple-400",
      dot: "#A855F7",
    },
    {
      key: "AGRICULTURAL_BURNING",
      label: t("categories.AGRICULTURAL_BURNING", "Agricultural Burning"),
      val: agricultural,
      color: "bg-amber-500",
      textColor: "text-amber-400",
      dot: "#F59E0B",
    },
    {
      key: "FOREST_FIRE",
      label: t("categories.FOREST_FIRE", "Forest Biomass"),
      val: forest,
      color: "bg-emerald-500",
      textColor: "text-emerald-400",
      dot: "#22C55E",
    },
    {
      key: "UNKNOWN",
      label: t("categories.UNKNOWN", "Unclassified Anomaly"),
      val: unknown,
      color: "bg-gray-400",
      textColor: "text-gray-400",
      dot: "#9CA3AF",
    },
  ];

  return (
    <div className="space-y-3 font-sans text-xs">
      {/* BLOCK 1: OVERVIEW STATS */}
      <div className="bg-[#111827] border border-[#1F2937] rounded-xl p-3.5 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#1F2937] pb-2.5 mb-2.5">
          <span className="font-semibold text-xs text-[#9CA3AF] uppercase tracking-wider">
            Overview Stats
          </span>
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
            <span className="text-[11px] text-[#9CA3AF] block">Total Active Hotspots</span>
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
              <button
                key={it.key}
                type="button"
                onClick={() => onSelectCategory && onSelectCategory(it.key)}
                className={`w-full flex items-center justify-between p-2 rounded-lg transition text-left cursor-pointer ${
                  isSelected
                    ? "bg-[#1F2937] border border-gray-600 text-white font-semibold"
                    : "bg-[#0B1220]/50 hover:bg-[#0B1220] border border-transparent text-[#E5E7EB]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: it.dot }}
                  />
                  <span className="truncate">{it.label}</span>
                </div>
                <span className={`font-mono font-bold text-xs ${it.textColor}`}>
                  {formatNumber(it.val)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* BLOCK 2: DISTRIBUTION MINI CHART */}
      <div className="bg-[#111827] border border-[#1F2937] rounded-xl p-3.5 shadow-sm space-y-2">
        <span className="font-semibold text-xs text-[#9CA3AF] uppercase tracking-wider block">
          Distribution Breakdown
        </span>

        {/* Stacked Proportional Bar */}
        <div className="w-full h-3 rounded-full bg-[#0B1220] overflow-hidden flex border border-[#1F2937]">
          {total > 0 ? (
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
          ) : (
            <div className="w-full h-full bg-gray-700" />
          )}
        </div>

        {/* Mini Percentage Badges */}
        <div className="grid grid-cols-2 gap-1 text-[11px] text-[#9CA3AF] pt-1">
          {items.slice(0, 4).map((it) => {
            const pct = total > 0 ? ((it.val / total) * 100).toFixed(0) : "0";
            return (
              <div key={it.key} className="flex items-center justify-between pr-1">
                <span className="flex items-center gap-1.5 truncate">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: it.dot }}
                  />
                  <span className="truncate text-gray-300">{it.label.split(" ")[0]}</span>
                </span>
                <span className="font-mono text-white">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* BLOCK 3: QUICK ACTIONS */}
      <div className="bg-[#111827] border border-[#1F2937] rounded-xl p-3.5 shadow-sm space-y-2">
        <span className="font-semibold text-xs text-[#9CA3AF] uppercase tracking-wider block">
          Quick Actions
        </span>

        <div className="space-y-1.5">
          {onOpenProtocol && (
            <button
              onClick={onOpenProtocol}
              className="w-full flex items-center gap-2.5 p-2.5 bg-[#0B1220] hover:bg-[#1F2937] border border-[#1F2937] hover:border-gray-600 rounded-lg text-xs text-[#E5E7EB] font-medium transition text-left"
            >
              <span className="text-base">🛡️</span>
              <div>
                <div className="font-semibold">View Response Protocols</div>
                <div className="text-[10px] text-[#9CA3AF]">IS 2190 & chemical standards</div>
              </div>
            </button>
          )}

          {onOpenDispatch && (
            <button
              onClick={onOpenDispatch}
              className="w-full flex items-center gap-2.5 p-2.5 bg-[#0B1220] hover:bg-[#1F2937] border border-[#1F2937] hover:border-red-500/40 rounded-lg text-xs text-[#E5E7EB] font-medium transition text-left"
            >
              <span className="text-base">🚨</span>
              <div>
                <div className="font-semibold text-red-400">Simulate Dispatch</div>
                <div className="text-[10px] text-[#9CA3AF]">Route to nearest fire tender</div>
              </div>
            </button>
          )}

          {onOpenChatbot && (
            <button
              onClick={onOpenChatbot}
              className="w-full flex items-center gap-2.5 p-2.5 bg-[#0B1220] hover:bg-[#1F2937] border border-[#1F2937] hover:border-amber-500/40 rounded-lg text-xs text-[#E5E7EB] font-medium transition text-left"
            >
              <span className="text-base">🤖</span>
              <div>
                <div className="font-semibold text-amber-400">Ask AGNI-AI</div>
                <div className="text-[10px] text-[#9CA3AF]">Tactical firefighting chatbot</div>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
