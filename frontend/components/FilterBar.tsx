"use client";

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
}

const CATEGORIES = [
  { value: "all", label: "All Categories" },
  { value: "EMERGENCY_INDUSTRIAL", label: "🚨 Emergency Industrial" },
  { value: "PERSISTENT_INDUSTRIAL", label: "🏭 Persistent Industrial" },
  { value: "AGRICULTURAL_BURNING", label: "🌾 Agricultural Burning" },
  { value: "FOREST_FIRE", label: "🌲 Forest Fire" },
  { value: "UNKNOWN", label: "🔘 Unclassified" },
];

const SOURCES = [
  { value: "all", label: "Merged Satellites (SNPP + NOAA)" },
  { value: "VIIRS_SNPP_NRT", label: "Suomi NPP (VIIRS 375m)" },
  { value: "VIIRS_NOAA20_NRT", label: "NOAA-20 (VIIRS 375m)" },
];

const DAY_OPTIONS = [1, 3, 7, 10];

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
}: FilterBarProps) {
  return (
    <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-3.5 shadow-xl flex flex-wrap items-center justify-between gap-3">
      {/* Select Filters */}
      <div className="flex flex-wrap items-center gap-3 text-xs">
        {/* Days Select */}
        <div className="flex items-center gap-1.5">
          <label className="font-mono text-slate-400 uppercase tracking-wider text-[11px] font-semibold">
            Days:
          </label>
          <select
            value={days}
            onChange={(e) => onDaysChange(Number(e.target.value))}
            className="bg-slate-800 text-white border border-slate-700 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition cursor-pointer font-sans"
          >
            {DAY_OPTIONS.map((d) => (
              <option key={d} value={d} className="bg-slate-900 text-white">
                {d} {d === 1 ? "Day" : "Days"}
              </option>
            ))}
          </select>
        </div>

        {/* Category Select */}
        <div className="flex items-center gap-1.5">
          <label className="font-mono text-slate-400 uppercase tracking-wider text-[11px] font-semibold">
            Category:
          </label>
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="bg-slate-800 text-white border border-slate-700 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition cursor-pointer font-sans"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value} className="bg-slate-900 text-white">
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Source Select */}
        <div className="flex items-center gap-1.5">
          <label className="font-mono text-slate-400 uppercase tracking-wider text-[11px] font-semibold">
            Source:
          </label>
          <select
            value={source}
            onChange={(e) => onSourceChange(e.target.value)}
            className="bg-slate-800 text-white border border-slate-700 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition cursor-pointer font-sans"
          >
            {SOURCES.map((src) => (
              <option key={src.value} value={src.value} className="bg-slate-900 text-white">
                {src.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Action Controls + Timestamp */}
      <div className="flex items-center gap-2.5 ml-auto flex-wrap">
        {/* Last Updated Label */}
        {lastUpdated && (
          <span className="font-mono text-[11px] text-slate-400 hidden sm:inline">
            Last updated: <span className="text-slate-200 font-semibold">{lastUpdated}</span>
          </span>
        )}

        {/* Outline Download Report Button */}
        {onDownload && (
          <button
            onClick={onDownload}
            className="border border-slate-700 hover:border-slate-500 bg-slate-800/60 hover:bg-slate-800 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer"
            title="Download full surveillance report as CSV"
          >
            <span>📥</span>
            <span>Download Report</span>
          </button>
        )}

        {/* Solid Red Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="bg-red-600 hover:bg-red-500 active:bg-red-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
        >
          <span className={isRefreshing ? "animate-spin" : ""}>🔥</span>
          <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
        </button>
      </div>
    </div>
  );
}
