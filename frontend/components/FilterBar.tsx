"use client";

import { useState, useEffect } from "react";

interface FilterBarProps {
  days: number;
  category: string;
  source: string;
  lastUpdated?: string;
  isRefreshing?: boolean;
  onDaysChange: (days: number) => void;
  onCategoryChange: (category: string) => void;
  onSourceChange: (source: string) => void;
  onRefresh: () => void;
  onDownload?: () => void;
  onTrainModel?: () => void;
}

const CATEGORIES = [
  { value: "all", label: "ALL CATEGORIES" },
  { value: "EMERGENCY_INDUSTRIAL", label: "EMERGENCY INDUSTRIAL" },
  { value: "PERSISTENT_INDUSTRIAL", label: "PERSISTENT INDUSTRIAL" },
  { value: "AGRICULTURAL_BURNING", label: "AGRICULTURAL BURNING" },
  { value: "FOREST_FIRE", label: "FOREST BIOMASS" },
  { value: "UNKNOWN", label: "UNCLASSIFIED" },
];

const SOURCES = [
  { value: "all", label: "MERGED (SNPP + NOAA20)" },
  { value: "VIIRS_SNPP_NRT", label: "VIIRS-SNPP (375M)" },
  { value: "VIIRS_NOAA20_NRT", label: "VIIRS-NOAA20 (375M)" },
];

const DAY_OPTIONS = [
  { value: 1, label: "1D" },
  { value: 3, label: "3D" },
  { value: 7, label: "7D" },
  { value: 10, label: "10D" },
];

export default function FilterBar({
  days,
  category,
  source,
  lastUpdated,
  isRefreshing = false,
  onDaysChange,
  onCategoryChange,
  onSourceChange,
  onRefresh,
  onDownload,
  onTrainModel,
}: FilterBarProps) {
  const [countdown, setCountdown] = useState(180);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((c) => (c <= 1 ? 180 : c - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (secs: number) => {
    const m = String(Math.floor(secs / 60)).padStart(2, "0");
    const s = String(secs % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="panel border border-[#1f2933] bg-[#0f141b] p-3 font-mono corner-brackets">
      {/* Top Deck: Grid of Parameter Selectors & Operational Triggers */}
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#1f2933] pb-3">
        {/* Controls Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {/* TIME WINDOW */}
          <div>
            <label className="block text-[10px] font-bold text-[#4a5563] uppercase tracking-[0.15em] mb-1 select-none">
              [ TIME WINDOW ]
            </label>
            <select
              value={days}
              onChange={(e) => onDaysChange(Number(e.target.value))}
              className="w-full bg-[#0a0e14] text-[#d0d8e0] border border-[#1f2933] border-b-2 border-b-[#00d4ff] px-2.5 py-1.5 focus:outline-none focus:border-[#00d4ff] font-mono text-xs cursor-pointer rounded-none"
            >
              {DAY_OPTIONS.map((d) => (
                <option key={d.value} value={d.value} className="bg-[#0f141b] text-[#d0d8e0]">
                  {d.label} ▾
                </option>
              ))}
            </select>
          </div>

          {/* CATEGORY FILTER */}
          <div>
            <label className="block text-[10px] font-bold text-[#4a5563] uppercase tracking-[0.15em] mb-1 select-none">
              [ CATEGORY FILTER ]
            </label>
            <select
              value={category}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full bg-[#0a0e14] text-[#d0d8e0] border border-[#1f2933] border-b-2 border-b-[#00d4ff] px-2.5 py-1.5 focus:outline-none focus:border-[#00d4ff] font-mono text-xs cursor-pointer rounded-none"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value} className="bg-[#0f141b] text-[#d0d8e0]">
                  {c.label} ▾
                </option>
              ))}
            </select>
          </div>

          {/* DATA SOURCE */}
          <div>
            <label className="block text-[10px] font-bold text-[#4a5563] uppercase tracking-[0.15em] mb-1 select-none">
              [ DATA SOURCE ]
            </label>
            <select
              value={source}
              onChange={(e) => onSourceChange(e.target.value)}
              className="w-full bg-[#0a0e14] text-[#d0d8e0] border border-[#1f2933] border-b-2 border-b-[#00d4ff] px-2.5 py-1.5 focus:outline-none focus:border-[#00d4ff] font-mono text-xs cursor-pointer rounded-none"
            >
              {SOURCES.map((s) => (
                <option key={s.value} value={s.value} className="bg-[#0f141b] text-[#d0d8e0]">
                  {s.label} ▾
                </option>
              ))}
            </select>
          </div>

          {/* REGION MASK */}
          <div>
            <label className="block text-[10px] font-bold text-[#4a5563] uppercase tracking-[0.15em] mb-1 select-none">
              [ REGION MASK ]
            </label>
            <select
              defaultValue="INDIA"
              className="w-full bg-[#0a0e14] text-[#d0d8e0] border border-[#1f2933] border-b-2 border-b-[#00d4ff] px-2.5 py-1.5 focus:outline-none focus:border-[#00d4ff] font-mono text-xs cursor-pointer rounded-none"
            >
              <option value="INDIA" className="bg-[#0f141b] text-[#d0d8e0]">INDIA ▾</option>
              <option value="NORTH" className="bg-[#0f141b] text-[#d0d8e0]">IND-NORTH ▾</option>
              <option value="EAST" className="bg-[#0f141b] text-[#d0d8e0]">IND-EAST ▾</option>
            </select>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          {/* REFRESH */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="px-3 py-1.5 border border-[#1f2933] bg-[#0f141b] hover:bg-[#131a22] active:border-[#00d4ff] text-[#d0d8e0] hover:text-[#00ff9c] text-xs font-mono font-bold tracking-wider uppercase transition cursor-pointer disabled:opacity-50"
          >
            {isRefreshing ? "[ SYNCING... ]" : "[ REFRESH ▷ ]"}
          </button>

          {/* EXPORT CSV */}
          {onDownload && (
            <button
              onClick={onDownload}
              className="px-3 py-1.5 border border-[#1f2933] bg-[#0f141b] hover:bg-[#131a22] active:border-[#00d4ff] text-[#d0d8e0] hover:text-[#00d4ff] text-xs font-mono font-bold tracking-wider uppercase transition cursor-pointer"
            >
              [ EXPORT CSV ↓ ]
            </button>
          )}

          {/* TRAIN MODEL */}
          <button
            onClick={onTrainModel}
            className="px-3 py-1.5 border border-[#1f2933] bg-[#0f141b] hover:bg-[#131a22] active:border-[#00d4ff] text-[#d0d8e0] hover:text-[#ffb800] text-xs font-mono font-bold tracking-wider uppercase transition cursor-pointer hidden md:inline-block"
          >
            [ TRAIN MODEL ⚙ ]
          </button>
        </div>
      </div>

      {/* Bottom of Deck: Synchronization Heartbeat */}
      <div className="flex items-center justify-between pt-2 text-[10px] font-mono text-[#6b7785] select-none">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00ff9c] status-dot-green" />
          <span>AUTO-SYNC: 180s :: NEXT REFRESH IN {formatCountdown(countdown)}</span>
        </div>
        <div>
          <span>PACKET PROTOCOL: HTTPS/REST :: FIRMS-MAP-KEY: VERIFIED</span>
        </div>
      </div>
    </div>
  );
}
