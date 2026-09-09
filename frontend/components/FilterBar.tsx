"use client";

import React, { useState, useRef, useEffect } from "react";
import { useI18n } from "@/context/I18nContext";
import InfoTooltip from "@/components/InfoTooltip";

interface FilterBarProps {
  days: number;
  category: string;
  source: string;
  isRefreshing?: boolean;
  onDaysChange: (days: number) => void;
  onCategoryChange: (category: string) => void;
  onSourceChange: (source: string) => void;
  onRefresh: () => void;
  onDownload?: () => void;
  onOpenScenarios?: () => void;
  onOpenEmergency?: () => void;
  criticalAlertCount?: number;
  onOpenDispatchHistory?: () => void;
  onTrainModel?: () => void;
  onToggleHistoricalHeatmap?: () => void;
  showHistoricalHeatmap?: boolean;
  onOpenSystemLogs?: () => void;
}

const SOURCES = [
  { value: "all", label: "Merged Sensors (SNPP + NOAA20)" },
  { value: "VIIRS_SNPP_NRT", label: "VIIRS-SNPP (375m)" },
  { value: "VIIRS_NOAA20_NRT", label: "VIIRS-NOAA20 (375m)" },
];

const DAY_OPTIONS = [
  { value: 1, label: "Last 24 Hours (1D)" },
  { value: 3, label: "Last 3 Days (3D)" },
  { value: 7, label: "Last 7 Days (7D)" },
  { value: 10, label: "Last 10 Days (10D)" },
];

export default function FilterBar({
  days,
  category,
  source,
  isRefreshing = false,
  onDaysChange,
  onCategoryChange,
  onSourceChange,
  onRefresh,
  onDownload,
  onOpenScenarios,
  onOpenEmergency,
  criticalAlertCount = 0,
  onOpenDispatchHistory,
  onTrainModel,
  onToggleHistoricalHeatmap,
  showHistoricalHeatmap = false,
  onOpenSystemLogs,
}: FilterBarProps) {
  const { t } = useI18n();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const categories = [
    { value: "all", label: t("filters.all", "All Fire Categories") },
    {
      value: "EMERGENCY_INDUSTRIAL",
      label: t("categories.EMERGENCY_INDUSTRIAL", "Emergency Industrial"),
    },
    {
      value: "PERSISTENT_INDUSTRIAL",
      label: t("categories.PERSISTENT_INDUSTRIAL", "Persistent Industrial"),
    },
    {
      value: "AGRICULTURAL_BURNING",
      label: t("categories.AGRICULTURAL_BURNING", "Agricultural Burning"),
    },
    {
      value: "FOREST_FIRE",
      label: t("categories.FOREST_FIRE", "Forest Biomass"),
    },
    {
      value: "UNKNOWN",
      label: t("categories.UNKNOWN", "Unclassified / Small Burns"),
    },
  ];

  return (
    <div className="bg-[#0B1220] border-b border-[#1F2937] px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs font-sans">
      {/* Left Controls: Days, Category, Source */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {/* Days Filter */}
        <div className="flex items-center gap-1.5">
          <select
            value={days}
            onChange={(e) => onDaysChange(Number(e.target.value))}
            className="bg-[#111827] border border-[#1F2937] text-[#E5E7EB] hover:border-gray-600 px-3 py-1.5 rounded-lg text-xs font-medium focus:outline-none focus:border-[#22D3EE] cursor-pointer"
          >
            {DAY_OPTIONS.map((d) => (
              <option key={d.value} value={d.value} className="bg-[#111827]">
                {d.label}
              </option>
            ))}
          </select>
          <InfoTooltip
            title="Observation Window"
            text="Filter satellite thermal detections by age (from latest 24-hour pass up to 10 days)."
            position="bottom"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1.5">
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="bg-[#111827] border border-[#1F2937] text-[#22D3EE] hover:border-gray-600 px-3 py-1.5 rounded-lg text-xs font-semibold focus:outline-none focus:border-[#22D3EE] cursor-pointer max-w-[190px] truncate"
          >
            {categories.map((c) => (
              <option key={c.value} value={c.value} className="bg-[#111827] text-[#E5E7EB]">
                {c.label}
              </option>
            ))}
          </select>
          <InfoTooltip
            title="Classification Filter"
            text="Filter map display by fire risk tier (e.g. Critical Emergency, Forest, Agricultural, or All)."
            position="bottom"
          />
        </div>

        {/* Source Filter */}
        <div className="hidden md:flex items-center gap-1.5">
          <select
            value={source}
            onChange={(e) => onSourceChange(e.target.value)}
            className="bg-[#111827] border border-[#1F2937] text-[#9CA3AF] hover:border-gray-600 px-3 py-1.5 rounded-lg text-xs font-medium focus:outline-none focus:border-[#22D3EE] cursor-pointer max-w-[180px] truncate"
          >
            {SOURCES.map((s) => (
              <option key={s.value} value={s.value} className="bg-[#111827] text-[#E5E7EB]">
                {s.label}
              </option>
            ))}
          </select>
          <InfoTooltip
            title="Satellite Sensors"
            text="Toggle between high-resolution VIIRS Suomi-NPP (375m) and NOAA-20 thermal infrared instruments."
            position="bottom"
          />
        </div>
      </div>

      {/* Right Actions: Refresh, Download, Scenarios, Emergency, More */}
      <div className="flex items-center gap-2">
        {/* Refresh */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="px-3 py-1.5 bg-[#111827] hover:bg-[#1F2937] border border-[#1F2937] text-[#E5E7EB] rounded-lg text-xs font-medium transition flex items-center gap-1.5 disabled:opacity-50"
          title="Refresh satellite telemetry"
        >
          <span className={isRefreshing ? "animate-spin" : ""}>🔄</span>
          <span className="hidden sm:inline">
            {isRefreshing ? "Syncing..." : t("actions.refresh", "Refresh")}
          </span>
        </button>

        {/* Download CSV */}
        {onDownload && (
          <button
            onClick={onDownload}
            className="px-3 py-1.5 bg-[#111827] hover:bg-[#1F2937] border border-[#1F2937] text-[#E5E7EB] rounded-lg text-xs font-medium transition flex items-center gap-1.5"
            title="Download CSV report"
          >
            <span>📥</span>
            <span className="hidden sm:inline">{t("actions.download", "Export")}</span>
          </button>
        )}

        {/* Scenarios Button */}
        {onOpenScenarios && (
          <div className="flex items-center gap-1">
            <button
              onClick={onOpenScenarios}
              className="px-3 py-1.5 bg-[#111827] hover:bg-[#1F2937] border border-cyan-500/40 text-[#22D3EE] rounded-lg text-xs font-medium transition flex items-center gap-1.5"
            >
              <span>▶</span>
              <span>Scenarios</span>
            </button>
            <InfoTooltip
              title="Crisis Scenarios"
              text="Preset real-world crisis simulations (e.g. Punjab Stubble, Vizag Flare, Surat Tanker) for instant demonstration."
              position="bottom"
            />
          </div>
        )}

        {/* Emergency Trigger Button with Critical Badge */}
        {onOpenEmergency && (
          <div className="flex items-center gap-1">
            <button
              onClick={onOpenEmergency}
              className="px-3 py-1.5 bg-red-950/40 hover:bg-red-900/50 border border-red-500/50 text-red-300 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>Emergency</span>
              {criticalAlertCount > 0 && (
                <span className="bg-red-500 text-white px-1.5 py-0.2 text-[10px] font-bold rounded-full ml-0.5">
                  {criticalAlertCount}
                </span>
              )}
            </button>
            <InfoTooltip
              title="Critical Emergency Alerts"
              text="Active high-risk thermal anomalies requiring immediate response (chemical, petroleum, explosive corridors)."
              position="bottom"
            />
          </div>
        )}

        {/* More Dropdown */}
        <div className="relative" ref={moreRef}>
          <button
            onClick={() => setIsMoreOpen(!isMoreOpen)}
            className="px-3 py-1.5 bg-[#111827] hover:bg-[#1F2937] border border-[#1F2937] text-[#9CA3AF] hover:text-white rounded-lg text-xs font-medium transition flex items-center gap-1"
          >
            <span>More</span>
            <span className="text-[10px]">▼</span>
          </button>

          {isMoreOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-[#111827] border border-[#1F2937] rounded-xl shadow-2xl p-1.5 z-50 text-xs space-y-1">
              {onOpenDispatchHistory && (
                <button
                  onClick={() => {
                    setIsMoreOpen(false);
                    onOpenDispatchHistory();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-[#E5E7EB] hover:bg-[#1F2937] flex items-center gap-2 transition"
                >
                  <span>📋</span>
                  <span>Dispatch Audit Log</span>
                </button>
              )}

              {onToggleHistoricalHeatmap && (
                <button
                  onClick={() => {
                    setIsMoreOpen(false);
                    onToggleHistoricalHeatmap();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-[#E5E7EB] hover:bg-[#1F2937] flex items-center justify-between transition"
                >
                  <div className="flex items-center gap-2">
                    <span>🗺️</span>
                    <span>5-Yr Recurrence Heatmap</span>
                  </div>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                      showHistoricalHeatmap
                        ? "bg-emerald-950 text-emerald-400"
                        : "bg-gray-800 text-gray-400"
                    }`}
                  >
                    {showHistoricalHeatmap ? "ON" : "OFF"}
                  </span>
                </button>
              )}

              {onTrainModel && (
                <button
                  onClick={() => {
                    setIsMoreOpen(false);
                    onTrainModel();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-[#E5E7EB] hover:bg-[#1F2937] flex items-center gap-2 transition"
                >
                  <span>⚙️</span>
                  <span>Retrain ML Classifier</span>
                </button>
              )}

              {onOpenSystemLogs && (
                <button
                  onClick={() => {
                    setIsMoreOpen(false);
                    onOpenSystemLogs();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-[#E5E7EB] hover:bg-[#1F2937] flex items-center gap-2 transition"
                >
                  <span>📑</span>
                  <span>System Diagnostics & Logs</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
