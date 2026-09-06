"use client";

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
  Emergency: "#dc2626",
  Industrial: "#eab308",
  Agricultural: "#f97316",
  Forest: "#22c55e",
  Unknown: "#6b7280",
};

export default function StatsPanel({ stats }: StatsPanelProps) {
  const total = stats?.total ?? 0;
  const emergency = stats?.emergency ?? 0;
  const persistent = stats?.persistent ?? 0;
  const agricultural = stats?.agricultural ?? 0;
  const forest = stats?.forest ?? 0;
  const unknown = stats?.unknown ?? 0;

  const chartData = [
    { name: "Emergency", value: emergency },
    { name: "Industrial", value: persistent },
    { name: "Agricultural", value: agricultural },
    { name: "Forest", value: forest },
    { name: "Unknown", value: unknown },
  ].filter((d) => d.value > 0);

  return (
    <div className="bg-[#1e293b] border border-slate-700/60 rounded-xl p-6 shadow-xl flex flex-col gap-5">
      {/* Title & Total Count */}
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          📊 Fire Statistics
        </h2>
        <div className="mt-2">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Total Hotspots Detected
          </span>
          <div className="text-4xl font-extrabold text-white font-mono mt-0.5">
            {total.toLocaleString()}
          </div>
        </div>
      </div>

      {/* 2x2 Grid of Stat Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Emergency */}
        <div className="bg-red-500/20 border border-red-700/40 rounded-lg p-3">
          <div className="text-xs text-red-300 font-semibold flex items-center gap-1.5">
            🚨 Emergency
          </div>
          <div className="text-2xl font-bold font-mono text-red-400 mt-1">
            {emergency}
          </div>
        </div>

        {/* Industrial */}
        <div className="bg-yellow-500/20 border border-yellow-700/40 rounded-lg p-3">
          <div className="text-xs text-yellow-300 font-semibold flex items-center gap-1.5">
            🏭 Industrial
          </div>
          <div className="text-2xl font-bold font-mono text-yellow-400 mt-1">
            {persistent}
          </div>
        </div>

        {/* Agricultural */}
        <div className="bg-orange-500/20 border border-orange-700/40 rounded-lg p-3">
          <div className="text-xs text-orange-300 font-semibold flex items-center gap-1.5">
            🌾 Agricultural
          </div>
          <div className="text-2xl font-bold font-mono text-orange-400 mt-1">
            {agricultural}
          </div>
        </div>

        {/* Forest */}
        <div className="bg-green-500/20 border border-green-700/40 rounded-lg p-3">
          <div className="text-xs text-green-300 font-semibold flex items-center gap-1.5">
            🌲 Forest
          </div>
          <div className="text-2xl font-bold font-mono text-green-400 mt-1">
            {forest}
          </div>
        </div>
      </div>

      {/* PieChart below (height 200) */}
      <div className="border-t border-slate-700/70 pt-4">
        <div className="text-xs text-slate-400 uppercase tracking-wider mb-2 font-mono">
          Distribution Share
        </div>
        <div className="h-[200px] w-full">
          {chartData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-slate-500 font-mono">
              No active distribution data
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={36}
                  outerRadius={68}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {chartData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={CATEGORY_COLORS[entry.name] || "#6b7280"}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "8px",
                    color: "#f8fafc",
                    fontSize: "12px",
                    fontFamily: "ui-monospace, monospace",
                  }}
                  formatter={(value: any, name: any) => [
                    `${value} fires (${((value / (total || 1)) * 100).toFixed(1)}%)`,
                    name,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
