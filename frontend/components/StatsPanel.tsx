"use client";

import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

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
}

const CATEGORY_COLORS: Record<string, string> = {
  Emergency: "#ef4444",
  Industrial: "#eab308",
  Agricultural: "#f97316",
  Forest: "#22c55e",
  Unknown: "#94a3b8",
};

export default function StatsPanel({ stats }: StatsPanelProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const total = stats?.total ?? 0;
  const emergency = stats?.emergency ?? 0;
  const persistent = stats?.persistent ?? 0;
  const agricultural = stats?.agricultural ?? 0;
  const forest = stats?.forest ?? 0;
  const rawUnknown = stats?.unknown ?? 0;
  const unknown = rawUnknown > 0 ? rawUnknown : Math.max(0, total - (emergency + persistent + agricultural + forest));

  const chartData = [
    { name: "Emergency", value: emergency },
    { name: "Industrial", value: persistent },
    { name: "Agricultural", value: agricultural },
    { name: "Forest", value: forest },
    { name: "Unknown", value: unknown },
  ].filter((d) => d.value > 0);

  const isPredominantlyUnknown = total > 0 && unknown / total >= 0.85;

  return (
    <div className="bg-[#0f172a] border border-slate-700/80 rounded-2xl p-5 shadow-2xl flex flex-col gap-4">
      {/* Title & Total Count Header */}
      <div className="flex items-start justify-between border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 tracking-tight">
            📊 Fire Intelligence Telemetry
          </h2>
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            Total Active Hotspots
          </span>
        </div>
        <div className="text-3xl md:text-4xl font-black font-mono text-white tracking-tight">
          {total.toLocaleString()}
        </div>
      </div>

      {/* 2x2 Grid of Tactical Stat Cards with Colored Left Borders */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Emergency */}
        <div
          className={`border-l-4 border-red-500 bg-slate-900/90 rounded-r-xl p-3 border-y border-r border-slate-800 transition ${
            emergency > 0
              ? "ring-1 ring-red-500/50 shadow-lg shadow-red-500/20 bg-red-950/40"
              : ""
          }`}
        >
          <div className="text-xs text-red-400 font-semibold flex items-center gap-1.5">
            <span className={emergency > 0 ? "animate-pulse" : ""}>🚨</span>
            <span>Emergency</span>
          </div>
          <div className="text-2xl font-bold font-mono text-red-400 mt-1">
            {emergency}
          </div>
        </div>

        {/* Industrial */}
        <div className="border-l-4 border-yellow-500 bg-slate-900/90 rounded-r-xl p-3 border-y border-r border-slate-800">
          <div className="text-xs text-yellow-400 font-semibold flex items-center gap-1.5">
            <span>🏭</span>
            <span>Industrial</span>
          </div>
          <div className="text-2xl font-bold font-mono text-yellow-400 mt-1">
            {persistent}
          </div>
        </div>

        {/* Agricultural */}
        <div className="border-l-4 border-orange-500 bg-slate-900/90 rounded-r-xl p-3 border-y border-r border-slate-800">
          <div className="text-xs text-orange-400 font-semibold flex items-center gap-1.5">
            <span>🌾</span>
            <span>Agricultural</span>
          </div>
          <div className="text-2xl font-bold font-mono text-orange-400 mt-1">
            {agricultural}
          </div>
        </div>

        {/* Forest */}
        <div className="border-l-4 border-emerald-500 bg-slate-900/90 rounded-r-xl p-3 border-y border-r border-slate-800">
          <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
            <span>🌲</span>
            <span>Forest</span>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            {forest}
          </div>
        </div>
      </div>

      {/* 5th Chip: Unknown / Unclassified Count */}
      <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/70 border border-slate-800 text-xs font-mono">
        <span className="text-slate-400 flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block" />
          <span>Unclassified / Low FRP Hotspots:</span>
        </span>
        <span className="font-bold text-slate-200">{unknown}</span>
      </div>

      {/* Recharts Responsive Donut Chart */}
      <div className="border-t border-slate-800/90 pt-3">
        <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
          <span>Categorical Distribution</span>
          <span className="text-slate-500 text-[10px]">
            {chartData.length} active classes
          </span>
        </div>
        <div className="h-[180px] w-full">
          {!mounted || chartData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-slate-500 font-mono">
              Awaiting satellite pass telemetry...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={42}
                  outerRadius={68}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {chartData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={CATEGORY_COLORS[entry.name] || "#94a3b8"}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#020617",
                    borderColor: "#334155",
                    borderRadius: "10px",
                    color: "#f8fafc",
                    fontSize: "12px",
                    fontFamily: "ui-monospace, monospace",
                  }}
                  formatter={(value: any, name: any) => [
                    `${value} (${((Number(value) / (total || 1)) * 100).toFixed(1)}%)`,
                    name,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Predominantly Unknown Context Helper */}
      {isPredominantlyUnknown && (
        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 leading-relaxed font-sans">
          ℹ️ <strong>Surveillance Note:</strong> Most points are currently classified as Unknown because industrial proximity and multi-day persistence signals are below the operational confirmation threshold for this window.
        </div>
      )}
    </div>
  );
}
