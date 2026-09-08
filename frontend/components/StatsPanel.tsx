"use client";

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
}

function makeAsciiBar(percentage: number, length: number = 14): string {
  const filled = Math.min(length, Math.max(0, Math.round((percentage / 100) * length)));
  return "█".repeat(filled) + "░".repeat(length - filled);
}

export default function StatsPanel({
  stats,
  activeCategory = "all",
  onSelectCategory,
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

  const classified = emergency + persistent + agricultural + forest;
  const classifiedRate = total > 0 ? ((classified / total) * 100).toFixed(1) : "0.0";

  const rows = [
    { label: t("stats.hotspots_analyzed", "TOTAL ANOMALIES"), value: formatNumber(total), key: "all", color: "#00d4ff" },
    { label: t("categories.EMERGENCY_INDUSTRIAL", "CRITICAL EVENTS"), value: formatNumber(emergency), key: "EMERGENCY_INDUSTRIAL", color: "#ff3b3b" },
    { label: t("categories.PERSISTENT_INDUSTRIAL", "PERSISTENT SOURCES"), value: formatNumber(persistent), key: "PERSISTENT_INDUSTRIAL", color: "#ffb800" },
    { label: t("categories.AGRICULTURAL_BURNING", "AGRI BURNING EVENTS"), value: formatNumber(agricultural), key: "AGRICULTURAL_BURNING", color: "#ff9500" },
    { label: t("categories.FOREST_FIRE", "FOREST BIOMASS BURNS"), value: formatNumber(forest), key: "FOREST_FIRE", color: "#00ff9c" },
    { label: t("categories.UNKNOWN", "UNCLASSIFIED SIGNALS"), value: formatNumber(unknown), key: "UNKNOWN", color: "#6b7785" },
    { label: "CLASSIFICATION RATE", value: `${classifiedRate}%`, key: "rate", color: "#00ff9c" },
  ];

  const distribution = [
    { name: t("categories.PERSISTENT_INDUSTRIAL", "PERSISTENT"), val: persistent, code: "PERSISTENT_INDUSTRIAL", color: "#ffb800" },
    { name: t("categories.FOREST_FIRE", "FOREST"), val: forest, code: "FOREST_FIRE", color: "#00ff9c" },
    { name: t("categories.AGRICULTURAL_BURNING", "AGRI"), val: agricultural, code: "AGRICULTURAL_BURNING", color: "#ff9500" },
    { name: t("categories.EMERGENCY_INDUSTRIAL", "EMERGENCY"), val: emergency, code: "EMERGENCY_INDUSTRIAL", color: "#ff3b3b" },
    { name: t("categories.UNKNOWN", "UNKNOWN"), val: unknown, code: "UNKNOWN", color: "#6b7785" },
  ];


  const handleRowClick = (key: string) => {
    if (!onSelectCategory) return;
    if (key === "rate") return;
    if (activeCategory === key) {
      onSelectCategory("all");
    } else {
      onSelectCategory(key);
    }
  };

  return (
    <div className="flex flex-col gap-3 font-mono">
      {/* Panel 1: // SYSTEM TELEMETRY */}
      <div className="panel border border-[#1f2933] bg-[#0f141b] corner-brackets">
        <div className="panel-header px-3 py-1.5 bg-[#131a22] border-b border-[#1f2933] flex justify-between items-center">
          <span className="text-[11px] font-bold tracking-[0.15em] text-[#d0d8e0] uppercase">
            // SYSTEM TELEMETRY
          </span>
          <span className="text-[10px] text-[#00ff9c] font-semibold">[ACTIVE]</span>
        </div>

        <div className="p-3 space-y-1.5 text-xs">
          {rows.map((r) => {
            const isSelected = activeCategory === r.key && r.key !== "all" && r.key !== "rate";
            return (
              <div
                key={r.label}
                onClick={() => handleRowClick(r.key)}
                className={`flex items-baseline justify-between transition cursor-pointer px-1.5 py-0.5 rounded-sm ${
                  isSelected
                    ? "bg-[#131a22] text-[#00d4ff] border-l-2 border-[#00d4ff]"
                    : "hover:bg-[#131a22] text-[#d0d8e0]"
                }`}
              >
                <span className="text-[#6b7785] text-[11px] tracking-wider select-none">
                  {r.label}
                </span>
                <span className="text-[#2d3a4a] tracking-widest text-[10px] px-1 select-none flex-1 truncate text-center">
                  ................................
                </span>
                <span
                  className="font-bold tabular-nums text-xs tracking-wider"
                  style={{ color: isSelected ? "#00d4ff" : r.color }}
                >
                  {r.value}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Panel 2: // DISTRIBUTION MATRIX */}
      <div className="panel border border-[#1f2933] bg-[#0f141b] corner-brackets">
        <div className="panel-header px-3 py-1.5 bg-[#131a22] border-b border-[#1f2933] flex justify-between items-center">
          <span className="text-[11px] font-bold tracking-[0.15em] text-[#d0d8e0] uppercase">
            // DISTRIBUTION MATRIX
          </span>
          <span className="text-[10px] text-[#6b7785]">ASCII-HISTO</span>
        </div>

        <div className="p-3 space-y-2 text-xs">
          {distribution.map((d) => {
            const pct = total > 0 ? (d.val / total) * 100 : 0;
            const bar = makeAsciiBar(pct, 12);
            const isSelected = activeCategory === d.code;

            return (
              <div
                key={d.name}
                onClick={() => handleRowClick(d.code)}
                className={`flex items-center justify-between text-[11px] font-mono px-1.5 py-0.5 transition cursor-pointer rounded-sm ${
                  isSelected
                    ? "bg-[#131a22] text-[#00d4ff] border-l-2 border-[#00d4ff]"
                    : "hover:bg-[#131a22] text-[#d0d8e0]"
                }`}
              >
                <span className="text-[#6b7785] font-semibold w-20">{d.name}</span>
                <span className="text-xs font-mono tracking-tighter" style={{ color: d.color }}>
                  [{bar}]
                </span>
                <span className="text-right tabular-nums w-24 text-[10px] text-[#d0d8e0]">
                  {d.val} ({pct.toFixed(1)}%)
                </span>
              </div>
            );
          })}

          <div className="border-t border-[#1f2933] pt-2 text-[10px] text-[#4a5563] flex justify-between">
            <span>FUSION: SPATIAL + TEMPORAL + SPECTRAL</span>
            <span className="text-[#00ff9c]">[89.2% ACC]</span>
          </div>
        </div>
      </div>
    </div>
  );
}
