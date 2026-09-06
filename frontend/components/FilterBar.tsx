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
  { value: "all", label: "All Categories (Unfiltered)" },
  { value: "EMERGENCY_INDUSTRIAL", label: "🚨 Emergency Industrial" },
  { value: "PERSISTENT_INDUSTRIAL", label: "🏭 Persistent Industrial" },
  { value: "AGRICULTURAL_BURNING", label: "🌾 Agricultural Burning" },
  { value: "FOREST_FIRE", label: "🌲 Forest Fire" },
  { value: "UNKNOWN", label: "🔘 Unclassified Anomaly" },
];

const SOURCES = [
  { value: "all", label: "VIIRS Merged (SNPP + NOAA-20)" },
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
    <div className="glass-card rounded-2xl p-3 md:px-5 md:py-3.5 shadow-2xl flex flex-wrap items-center justify-between gap-3.5 border border-white/10">
      {/* Floating Filter Selects */}
      <div className="flex flex-wrap items-center gap-3 text-xs">
        {/* Days Select */}
        <div className="flex items-center gap-2">
          <label className="font-mono text-slate-400 uppercase tracking-[0.2em] text-[10px] font-bold">
            WINDOW
          </label>
          <select
            value={days}
            onChange={(e) => onDaysChange(Number(e.target.value))}
            className="bg-[#0b1220] text-slate-200 border border-white/10 rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition cursor-pointer font-mono text-xs shadow-inner"
          >
            {DAY_OPTIONS.map((d) => (
              <option key={d} value={d} className="bg-[#020617] text-white">
                {d} {d === 1 ? "Day" : "Days"}
              </option>
            ))}
          </select>
        </div>

        {/* Category Select */}
        <div className="flex items-center gap-2">
          <label className="font-mono text-slate-400 uppercase tracking-[0.2em] text-[10px] font-bold">
            CATEGORY
          </label>
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="bg-[#0b1220] text-slate-200 border border-white/10 rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition cursor-pointer font-sans text-xs shadow-inner"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value} className="bg-[#020617] text-white">
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Source Select */}
        <div className="flex items-center gap-2">
          <label className="font-mono text-slate-400 uppercase tracking-[0.2em] text-[10px] font-bold">
            SENSOR
          </label>
          <select
            value={source}
            onChange={(e) => onSourceChange(e.target.value)}
            className="bg-[#0b1220] text-slate-200 border border-white/10 rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition cursor-pointer font-sans text-xs shadow-inner"
          >
            {SOURCES.map((src) => (
              <option key={src.value} value={src.value} className="bg-[#020617] text-white">
                {src.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Action Controls & Auto-refresh status */}
      <div className="flex items-center gap-3 ml-auto flex-wrap">
        {/* Tiny Auto-refresh Indicator */}
        <div className="hidden lg:flex items-center gap-1.5 text-[10px] font-mono text-slate-400 bg-white/[0.02] border border-white/5 px-2.5 py-1 rounded-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>Auto-refresh 3 min</span>
        </div>

        {/* Download Report Button */}
        {onDownload && (
          <button
            onClick={onDownload}
            className="glass-card hover:border-cyan-500/40 text-slate-300 hover:text-white text-xs font-semibold px-3.5 py-1.5 rounded-xl shadow-sm transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
            title="Download full surveillance telemetry as CSV"
          >
            <span className="text-cyan-400 text-sm">📥</span>
            <span>Download Report</span>
          </button>
        )}

        {/* Solid Molten-Red Refresh Button with Glow */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="relative group bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 active:scale-[0.98] text-white text-xs font-bold px-4 py-1.5 rounded-xl shadow-lg shadow-red-600/30 glow-red transition-all duration-200 flex items-center gap-2 cursor-pointer disabled:opacity-60"
        >
          <span className={`text-sm ${isRefreshing ? "animate-spin" : "group-hover:rotate-12 transition-transform"}`}>
            🔥
          </span>
          <span className="tracking-wide">{isRefreshing ? "Syncing..." : "Refresh Feed"}</span>
        </button>
      </div>
    </div>
  );
}
