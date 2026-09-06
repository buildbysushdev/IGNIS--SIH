"use client";

interface FilterBarProps {
  days: number;
  category: string;
  source: string;
  onDaysChange: (days: number) => void;
  onCategoryChange: (category: string) => void;
  onSourceChange: (source: string) => void;
  onRefresh: () => void;
  onDownload?: () => void;
}

const CATEGORIES = [
  { value: "all", label: "All Categories" },
  { value: "EMERGENCY_INDUSTRIAL", label: "Emergency Industrial" },
  { value: "PERSISTENT_INDUSTRIAL", label: "Persistent Industrial" },
  { value: "AGRICULTURAL_BURNING", label: "Agricultural Burning" },
  { value: "FOREST_FIRE", label: "Forest Fire" },
  { value: "UNKNOWN", label: "Unknown" },
];

const SOURCES = [
  { value: "all", label: "All Satellites (Merged)" },
  { value: "VIIRS_SNPP_NRT", label: "Suomi NPP (VIIRS)" },
  { value: "VIIRS_NOAA20_NRT", label: "NOAA-20 (VIIRS)" },
];

const DAY_OPTIONS = [1, 3, 7, 10];

export default function FilterBar({
  days,
  category,
  source,
  onDaysChange,
  onCategoryChange,
  onSourceChange,
  onRefresh,
  onDownload,
}: FilterBarProps) {
  return (
    <div className="bg-[#1e293b] border border-slate-700/70 rounded-xl p-3.5 shadow-lg flex flex-wrap items-center justify-between gap-4">
      {/* Filters Group */}
      <div className="flex flex-wrap items-center gap-4 text-xs">
        {/* Days Select */}
        <div className="flex items-center gap-2">
          <label className="font-mono text-slate-400 uppercase tracking-wider text-[11px]">
            Days:
          </label>
          <select
            value={days}
            onChange={(e) => onDaysChange(Number(e.target.value))}
            className="bg-[#1e293b] text-white border border-slate-700 rounded-lg px-3 py-1.5 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition cursor-pointer font-sans"
          >
            {DAY_OPTIONS.map((d) => (
              <option key={d} value={d} className="bg-slate-900 text-white">
                {d} {d === 1 ? "Day" : "Days"}
              </option>
            ))}
          </select>
        </div>

        {/* Category Select */}
        <div className="flex items-center gap-2">
          <label className="font-mono text-slate-400 uppercase tracking-wider text-[11px]">
            Category:
          </label>
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="bg-[#1e293b] text-white border border-slate-700 rounded-lg px-3 py-1.5 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition cursor-pointer font-sans"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value} className="bg-slate-900 text-white">
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Source Select */}
        <div className="flex items-center gap-2">
          <label className="font-mono text-slate-400 uppercase tracking-wider text-[11px]">
            Source:
          </label>
          <select
            value={source}
            onChange={(e) => onSourceChange(e.target.value)}
            className="bg-[#1e293b] text-white border border-slate-700 rounded-lg px-3 py-1.5 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition cursor-pointer font-sans"
          >
            {SOURCES.map((src) => (
              <option key={src.value} value={src.value} className="bg-slate-900 text-white">
                {src.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2.5 ml-auto">
        {onDownload && (
          <button
            onClick={onDownload}
            className="bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-600 text-slate-200 text-xs font-semibold px-3.5 py-2 rounded-lg shadow-sm transition flex items-center gap-1.5 tracking-wide cursor-pointer"
            title="Download classified detection records in CSV format"
          >
            <span>📥</span>
            <span>Download Report</span>
          </button>
        )}

        <button
          onClick={onRefresh}
          className="bg-[#dc2626] hover:bg-red-700 active:bg-red-800 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-md transition flex items-center gap-1.5 tracking-wide cursor-pointer"
        >
          <span>🔥</span>
          <span>Refresh</span>
        </button>
      </div>
    </div>
  );
}
