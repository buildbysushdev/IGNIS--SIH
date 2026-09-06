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
  activeCategory?: string;
  onSelectCategory?: (category: string) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  Emergency: "#ff2d2d",
  Industrial: "#f5b301",
  Agricultural: "#f97316",
  Forest: "#10b981",
  Unknown: "#64748b",
};

export default function StatsPanel({
  stats,
  activeCategory = "all",
  onSelectCategory,
}: StatsPanelProps) {
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
  const unknown =
    rawUnknown > 0
      ? rawUnknown
      : Math.max(0, total - (emergency + persistent + agricultural + forest));

  const classifiedCount = emergency + persistent + agricultural + forest;
  const classifiedPercent = total > 0 ? ((classifiedCount / total) * 100).toFixed(0) : "0";

  const chartData = [
    { name: "Emergency", value: emergency, color: "#ff2d2d" },
    { name: "Industrial", value: persistent, color: "#f5b301" },
    { name: "Agricultural", value: agricultural, color: "#f97316" },
    { name: "Forest", value: forest, color: "#10b981" },
    { name: "Unknown", value: unknown, color: "#64748b" },
  ].filter((d) => d.value > 0);

  const handleCardClick = (cat: string) => {
    if (!onSelectCategory) return;
    if (activeCategory === cat) {
      onSelectCategory("all");
    } else {
      onSelectCategory(cat);
    }
  };

  return (
    <div className="glass rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-2xl flex flex-col gap-4 border border-white/10">
      {/* Title & Total Count Header */}
      <div className="flex items-start justify-between border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <h2 className="text-base font-extrabold text-white tracking-tight uppercase font-mono">
              Fire Intelligence Telemetry
            </h2>
          </div>
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.2em] mt-0.5 block">
            TOTAL ACTIVE HOTSPOTS
          </span>
        </div>
        <div
          onClick={() => onSelectCategory && onSelectCategory("all")}
          className="text-right cursor-pointer group"
          title="Click to show all active targets"
        >
          <span className="text-3xl md:text-4xl font-black font-mono text-white tracking-tight group-hover:text-cyan-300 transition">
            {total.toLocaleString()}
          </span>
          <span className="text-[10px] font-mono text-cyan-400 block tracking-widest uppercase group-hover:underline">
            TARGETS {activeCategory !== "all" && "(FILTERED)"}
          </span>
        </div>
      </div>

      {/* 2x2 Grid of Tactical Cards with Left Color Beams & Instant Filter Toggle */}
      <div className="grid grid-cols-2 gap-3">
        {/* Emergency Card */}
        <div
          onClick={() => handleCardClick("EMERGENCY_INDUSTRIAL")}
          className={`relative overflow-hidden rounded-xl p-3 border transition-all duration-300 cursor-pointer hover:-translate-y-0.5 ${
            activeCategory === "EMERGENCY_INDUSTRIAL"
              ? "bg-red-950/60 border-red-500 ring-2 ring-red-500/80 glow-red shadow-lg"
              : emergency > 0
              ? "bg-red-950/30 border-red-500/40 glow-red"
              : "bg-white/[0.03] border-white/10 hover:border-red-500/40"
          }`}
        >
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-red-500 to-rose-600" />
          <div className="flex items-center justify-between text-xs pl-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-300 font-bold">
              Emergency
            </span>
            <span className={emergency > 0 ? "animate-pulse" : ""}>🚨</span>
          </div>
          <div className="text-2xl font-black font-mono text-white mt-1 pl-1">
            {emergency}
          </div>
          <div className="text-[10px] text-red-400 font-medium truncate mt-0.5 pl-1 flex items-center justify-between">
            <span>{emergency > 0 ? "Immediate dispatch" : "Standby nominal"}</span>
            {activeCategory === "EMERGENCY_INDUSTRIAL" && (
              <span className="text-[9px] text-red-300 font-mono font-bold bg-red-900/80 px-1 rounded">
                ACTIVE
              </span>
            )}
          </div>
        </div>

        {/* Industrial Card */}
        <div
          onClick={() => handleCardClick("PERSISTENT_INDUSTRIAL")}
          className={`relative overflow-hidden rounded-xl p-3 border transition-all duration-300 cursor-pointer hover:-translate-y-0.5 ${
            activeCategory === "PERSISTENT_INDUSTRIAL"
              ? "bg-amber-950/60 border-amber-500 ring-2 ring-amber-500/80 glow-amber shadow-lg"
              : "bg-white/[0.03] border-white/10 hover:border-amber-500/40"
          }`}
        >
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-amber-400 to-yellow-500" />
          <div className="flex items-center justify-between text-xs pl-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-300 font-bold">
              Industrial
            </span>
            <span>🏭</span>
          </div>
          <div className="text-2xl font-black font-mono text-white mt-1 pl-1">
            {persistent}
          </div>
          <div className="text-[10px] text-amber-400 font-medium truncate mt-0.5 pl-1 flex items-center justify-between">
            <span>Continuous flare stacks</span>
            {activeCategory === "PERSISTENT_INDUSTRIAL" && (
              <span className="text-[9px] text-amber-300 font-mono font-bold bg-amber-900/80 px-1 rounded">
                ACTIVE
              </span>
            )}
          </div>
        </div>

        {/* Agricultural Card */}
        <div
          onClick={() => handleCardClick("AGRICULTURAL_BURNING")}
          className={`relative overflow-hidden rounded-xl p-3 border transition-all duration-300 cursor-pointer hover:-translate-y-0.5 ${
            activeCategory === "AGRICULTURAL_BURNING"
              ? "bg-orange-950/60 border-orange-500 ring-2 ring-orange-500/80 shadow-lg"
              : "bg-white/[0.03] border-white/10 hover:border-orange-500/40"
          }`}
        >
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-orange-400 to-amber-600" />
          <div className="flex items-center justify-between text-xs pl-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-300 font-bold">
              Agricultural
            </span>
            <span>🌾</span>
          </div>
          <div className="text-2xl font-black font-mono text-white mt-1 pl-1">
            {agricultural}
          </div>
          <div className="text-[10px] text-orange-400 font-medium truncate mt-0.5 pl-1 flex items-center justify-between">
            <span>Seasonal crop residue</span>
            {activeCategory === "AGRICULTURAL_BURNING" && (
              <span className="text-[9px] text-orange-300 font-mono font-bold bg-orange-900/80 px-1 rounded">
                ACTIVE
              </span>
            )}
          </div>
        </div>

        {/* Forest Card */}
        <div
          onClick={() => handleCardClick("FOREST_FIRE")}
          className={`relative overflow-hidden rounded-xl p-3 border transition-all duration-300 cursor-pointer hover:-translate-y-0.5 ${
            activeCategory === "FOREST_FIRE"
              ? "bg-emerald-950/60 border-emerald-500 ring-2 ring-emerald-500/80 glow-emerald shadow-lg"
              : "bg-white/[0.03] border-white/10 hover:border-emerald-500/40"
          }`}
        >
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-emerald-400 to-teal-500" />
          <div className="flex items-center justify-between text-xs pl-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-300 font-bold">
              Forest
            </span>
            <span>🌲</span>
          </div>
          <div className="text-2xl font-black font-mono text-white mt-1 pl-1">
            {forest}
          </div>
          <div className="text-[10px] text-emerald-400 font-medium truncate mt-0.5 pl-1 flex items-center justify-between">
            <span>Wildland biomass burn</span>
            {activeCategory === "FOREST_FIRE" && (
              <span className="text-[9px] text-emerald-300 font-mono font-bold bg-emerald-900/80 px-1 rounded">
                ACTIVE
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Unknown Row: Slim Bar Under Cards (Clickable) */}
      <div
        onClick={() => handleCardClick("UNKNOWN")}
        className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-mono transition cursor-pointer ${
          activeCategory === "UNKNOWN"
            ? "bg-slate-800 border-slate-400 ring-1 ring-slate-400 text-white"
            : "bg-white/[0.02] border-white/5 text-slate-400 hover:border-white/20 hover:text-slate-200"
        }`}
      >
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-slate-500 inline-block" />
          <span className="text-[11px] uppercase tracking-wider">Unclassified / Low-signal:</span>
        </span>
        <span className="font-bold text-slate-200 text-sm">{unknown}</span>
      </div>

      {/* Donut Chart with Center Label & Mini Chips */}
      <div className="border-t border-white/10 pt-4 flex flex-col gap-2">
        <div className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.2em] flex items-center justify-between">
          <span>CATEGORICAL DISTRIBUTION</span>
          <span className="text-cyan-400 font-semibold">{classifiedPercent}% CLASSIFIED</span>
        </div>

        <div className="relative h-[180px] w-full flex items-center justify-center">
          {!mounted || chartData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-slate-500 font-mono">
              Awaiting satellite pass telemetry...
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={46}
                    outerRadius={76}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="rgba(0,0,0,0.6)"
                    strokeWidth={3}
                  >
                    {chartData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={CATEGORY_COLORS[entry.name] || "#64748b"}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#020617",
                      borderColor: "rgba(255,255,255,0.15)",
                      borderRadius: "12px",
                      color: "#f8fafc",
                      fontSize: "11px",
                      fontFamily: "ui-monospace, monospace",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.8)",
                    }}
                    formatter={(value: any, name: any) => [
                      `${value} (${((Number(value) / (total || 1)) * 100).toFixed(1)}%)`,
                      name,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Centered Donut Stat */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-black font-mono text-white leading-none">
                  {total}
                </span>
                <span className="text-[9px] font-mono text-slate-400 tracking-widest uppercase mt-0.5">
                  TOTAL
                </span>
              </div>
            </>
          )}
        </div>

        {/* Legend Mini Chips under Chart */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          {chartData.map((item) => {
            const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : "0";
            return (
              <div
                key={item.name}
                className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-white/[0.03] border border-white/5 text-[10px] font-mono"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-slate-300 font-medium">{item.name}</span>
                <span className="text-slate-500 font-bold">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trust Line */}
      <div className="mt-1 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
        <span className="flex items-center gap-1.5 text-cyan-300/80">
          <span>⚡</span>
          <span>Fusion Engine</span>
        </span>
        <span className="text-slate-500">spatial + temporal + spectral</span>
      </div>
    </div>
  );
}
