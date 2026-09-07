"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

interface ChartGridProps {
  eventsOverTime?: any[];
  byCategory?: any[];
  byState?: any[];
  byMonth?: any[];
  responseTimeTrend?: any[];
  hourlyHeatmap?: any[];
}

// Custom Tooltip with terminal styling
const TacticalTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-[#0a0e14] border border-[#00d4ff] p-2 text-xs font-mono shadow-[0_0_15px_rgba(0,212,255,0.3)] z-50">
      <div className="text-[#00d4ff] font-bold border-b border-[#1f2933] pb-1 mb-1">
        // {label}
      </div>
      <div className="space-y-0.5">
        {payload.map((item: any, idx: number) => (
          <div key={idx} className="flex justify-between gap-3 text-[11px]">
            <span style={{ color: item.color || "#d0d8e0" }}>{item.name}:</span>
            <span className="font-bold text-white tabular-nums">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function ChartGrid({
  eventsOverTime = [],
  byCategory = [],
  byState = [],
  byMonth = [],
  responseTimeTrend = [],
  hourlyHeatmap = [],
}: ChartGridProps) {
  const PIE_COLORS = ["#ff3b3b", "#ffb800", "#ff9500", "#00ff9c", "#00d4ff"];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 font-mono">
      {/* -------------------------------------------------------------------- */}
      {/* Chart 1: Line Chart - Events Over Time (Last 30 Days)                */}
      {/* -------------------------------------------------------------------- */}
      <div className="bg-[#0f141b] border border-[#1f2933] p-3 corner-brackets flex flex-col">
        <div className="flex items-center justify-between border-b border-[#1f2933] pb-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-[#00d4ff] text-xs">::</span>
            <span className="text-xs font-bold text-[#d0d8e0] uppercase">
              CHART 01 // 30-DAY TEMPORAL EVENT TREND
            </span>
          </div>
          <span className="text-[10px] text-[#6b7785]">[VIIRS SATELLITE MERGED]</span>
        </div>

        <div className="w-full h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={eventsOverTime} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="#1f2933" strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke="#4a5563" tick={{ fontSize: 9, fill: "#6b7785" }} />
              <YAxis stroke="#4a5563" tick={{ fontSize: 9, fill: "#6b7785" }} />
              <Tooltip content={<TacticalTooltip />} />
              <Legend wrapperStyle={{ fontSize: "10px", paddingTop: "6px" }} />
              <Line
                type="monotone"
                dataKey="total"
                name="Total Hotspots"
                stroke="#00d4ff"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "#00d4ff" }}
              />
              <Line
                type="monotone"
                dataKey="industrial"
                name="Industrial"
                stroke="#ffb800"
                strokeWidth={1.5}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="agricultural"
                name="Agricultural"
                stroke="#ff9500"
                strokeWidth={1.5}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="critical"
                name="Critical Level-3"
                stroke="#ff3b3b"
                strokeWidth={2}
                dot={{ r: 3, fill: "#ff3b3b" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* Chart 2: Bar Chart - Events by State                                  */}
      {/* -------------------------------------------------------------------- */}
      <div className="bg-[#0f141b] border border-[#1f2933] p-3 corner-brackets flex flex-col">
        <div className="flex items-center justify-between border-b border-[#1f2933] pb-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-[#00ff9c] text-xs">::</span>
            <span className="text-xs font-bold text-[#d0d8e0] uppercase">
              CHART 02 // INCIDENT CONCENTRATION BY STATE
            </span>
          </div>
          <span className="text-[10px] text-[#6b7785]">[TOP 10 STATES]</span>
        </div>

        <div className="w-full h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byState} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="#1f2933" strokeDasharray="3 3" />
              <XAxis dataKey="state" stroke="#4a5563" tick={{ fontSize: 9, fill: "#6b7785" }} />
              <YAxis stroke="#4a5563" tick={{ fontSize: 9, fill: "#6b7785" }} />
              <Tooltip content={<TacticalTooltip />} />
              <Legend wrapperStyle={{ fontSize: "10px", paddingTop: "6px" }} />
              <Bar dataKey="industrial" name="Industrial" stackId="a" fill="#ffb800" />
              <Bar dataKey="agricultural" name="Agricultural" stackId="a" fill="#ff9500" />
              <Bar dataKey="forest" name="Forest" stackId="a" fill="#00ff9c" />
              <Bar dataKey="critical" name="Critical" fill="#ff3b3b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* Chart 3: Pie / Donut Chart - Category Distribution                    */}
      {/* -------------------------------------------------------------------- */}
      <div className="bg-[#0f141b] border border-[#1f2933] p-3 corner-brackets flex flex-col">
        <div className="flex items-center justify-between border-b border-[#1f2933] pb-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-[#ffb800] text-xs">::</span>
            <span className="text-xs font-bold text-[#d0d8e0] uppercase">
              CHART 03 // CLASSIFICATION RATIO DISTRIBUTION
            </span>
          </div>
          <span className="text-[10px] text-[#6b7785]">[AI RANDOM FOREST MODEL]</span>
        </div>

        <div className="w-full h-[260px] flex items-center">
          <div className="w-1/2 h-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={byCategory}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                >
                  {byCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<TacticalTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend Table */}
          <div className="w-1/2 space-y-1.5 pl-2 text-xs border-l border-[#1f2933]">
            {byCategory.map((cat, idx) => (
              <div key={idx} className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-1.5 truncate max-w-[130px]">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-[#d0d8e0] truncate">{cat.name}</span>
                </div>
                <div className="text-[#6b7785] font-bold tabular-nums">
                  {cat.percentage}% ({cat.count})
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* Chart 4: Heatmap Matrix - Fires by Hour and Day of Week               */}
      {/* -------------------------------------------------------------------- */}
      <div className="bg-[#0f141b] border border-[#1f2933] p-3 corner-brackets flex flex-col">
        <div className="flex items-center justify-between border-b border-[#1f2933] pb-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-[#ff3b3b] text-xs">::</span>
            <span className="text-xs font-bold text-[#d0d8e0] uppercase">
              CHART 04 // HOURLY THERMAL CONCENTRATION MATRIX
            </span>
          </div>
          <span className="text-[10px] text-[#ff9500]">[PEAK: 12:00 - 16:00 IST]</span>
        </div>

        <div className="w-full h-[260px] overflow-x-auto flex flex-col justify-between py-1">
          <div className="text-[9px] text-[#6b7785] flex justify-between px-10 mb-1">
            <span>00h</span>
            <span>04h</span>
            <span>08h</span>
            <span className="text-[#ffb800] font-bold">12h [PEAK]</span>
            <span className="text-[#ff9500] font-bold">16h</span>
            <span>20h</span>
            <span>23h</span>
          </div>

          {hourlyHeatmap.map((row, rIdx) => (
            <div key={rIdx} className="flex items-center gap-1 text-[10px]">
              <span className="w-8 text-[#6b7785] font-bold text-[9px]">{row.day}</span>
              <div className="flex-1 grid grid-cols-24 gap-0.5 h-6">
                {row.hours.map((val: number, hIdx: number) => {
                  const intensity = Math.min(1.0, val / 80.0);
                  const bg =
                    intensity > 0.7
                      ? "rgba(255, 59, 59, 0.85)"
                      : intensity > 0.45
                      ? "rgba(255, 149, 0, 0.75)"
                      : intensity > 0.2
                      ? "rgba(255, 184, 0, 0.45)"
                      : "rgba(19, 26, 34, 0.8)";
                  return (
                    <div
                      key={hIdx}
                      className="h-full rounded-none transition hover:scale-110 cursor-pointer"
                      style={{ backgroundColor: bg }}
                      title={`${row.day} ${hIdx}:00 - ${val} verified thermal hotspots`}
                    />
                  );
                })}
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between text-[9px] text-[#6b7785] pt-2 border-t border-[#1f2933]">
            <div className="flex items-center gap-2">
              <span>INTENSITY:</span>
              <span className="px-1 bg-[#131a22] text-[#6b7785]">LOW</span>
              <span className="px-1 bg-[#ffb800]/40 text-[#ffb800]">MED</span>
              <span className="px-1 bg-[#ff9500]/70 text-[#ff9500]">HIGH</span>
              <span className="px-1 bg-[#ff3b3b]/90 text-white font-bold">CRITICAL</span>
            </div>
            <span>DATA SOURCE: SATELLITE PASSES</span>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* Chart 5: Stacked Bar Chart - Category Distribution by Month          */}
      {/* -------------------------------------------------------------------- */}
      <div className="bg-[#0f141b] border border-[#1f2933] p-3 corner-brackets flex flex-col">
        <div className="flex items-center justify-between border-b border-[#1f2933] pb-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-[#00ff9c] text-xs">::</span>
            <span className="text-xs font-bold text-[#d0d8e0] uppercase">
              CHART 05 // ANNUAL SEASONAL CYCLE BREAKDOWN
            </span>
          </div>
          <span className="text-[10px] text-[#6b7785]">[12 MONTH PROGRESSION]</span>
        </div>

        <div className="w-full h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byMonth} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="#1f2933" strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke="#4a5563" tick={{ fontSize: 9, fill: "#6b7785" }} />
              <YAxis stroke="#4a5563" tick={{ fontSize: 9, fill: "#6b7785" }} />
              <Tooltip content={<TacticalTooltip />} />
              <Legend wrapperStyle={{ fontSize: "10px", paddingTop: "6px" }} />
              <Bar dataKey="industrial" name="Industrial" stackId="b" fill="#ffb800" />
              <Bar dataKey="forest" name="Forest" stackId="b" fill="#00ff9c" />
              <Bar dataKey="agricultural" name="Agricultural" stackId="b" fill="#ff9500" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* Chart 6: Area Chart - Response Time Trend & Efficiency               */}
      {/* -------------------------------------------------------------------- */}
      <div className="bg-[#0f141b] border border-[#1f2933] p-3 corner-brackets flex flex-col">
        <div className="flex items-center justify-between border-b border-[#1f2933] pb-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-[#00d4ff] text-xs">::</span>
            <span className="text-xs font-bold text-[#d0d8e0] uppercase">
              CHART 06 // RESPONSE TIME IMPROVEMENT CURVE
            </span>
          </div>
          <span className="text-[10px] text-[#00ff9c]">[TARGET: &lt;10 MIN]</span>
        </div>

        <div className="w-full h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={responseTimeTrend} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorResponse" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#00d4ff" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#1f2933" strokeDasharray="3 3" />
              <XAxis dataKey="week" stroke="#4a5563" tick={{ fontSize: 9, fill: "#6b7785" }} />
              <YAxis stroke="#4a5563" tick={{ fontSize: 9, fill: "#6b7785" }} domain={[6, 16]} />
              <Tooltip content={<TacticalTooltip />} />
              <Legend wrapperStyle={{ fontSize: "10px", paddingTop: "6px" }} />
              <Area
                type="monotone"
                dataKey="avg_response_min"
                name="Actual Response (Min)"
                stroke="#00d4ff"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorResponse)"
              />
              <Line
                type="monotone"
                dataKey="target_min"
                name="NDMA National Target (10m)"
                stroke="#ff3b3b"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
