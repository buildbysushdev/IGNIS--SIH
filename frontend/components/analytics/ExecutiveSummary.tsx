"use client";

import { TrendingUp, AlertTriangle, ShieldCheck, Clock, MapPin, IndianRupee } from "lucide-react";

interface ExecutiveSummaryProps {
  summary?: {
    total_events: number;
    critical_events: number;
    false_alarms_prevented: number;
    response_time_avg_min: number;
    coverage_area_sq_km: number;
    cost_savings_inr_cr: number;
  };
  trends?: {
    vs_last_month?: string;
    vs_last_year?: string;
    critical_change?: string;
    response_improvement?: string;
  };
}

export default function ExecutiveSummary({ summary, trends }: ExecutiveSummaryProps) {
  const s = summary || {
    total_events: 4520,
    critical_events: 12,
    false_alarms_prevented: 3800,
    response_time_avg_min: 8.5,
    coverage_area_sq_km: 3287263,
    cost_savings_inr_cr: 42.8,
  };

  const t = trends || {
    vs_last_month: "+12%",
    vs_last_year: "-8%",
    critical_change: "-25%",
    response_improvement: "-40.1%",
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 font-mono">
      {/* Card 1: Total Events */}
      <div className="bg-[#0f141b] border border-[#1f2933] hover:border-[#00d4ff] p-3 transition corner-brackets">
        <div className="flex items-center justify-between text-[#6b7785] text-[10px] uppercase font-bold mb-1">
          <span>TOTAL EVENTS</span>
          <TrendingUp className="w-3.5 h-3.5 text-[#00d4ff]" />
        </div>
        <div className="text-2xl font-black text-white tabular-nums tracking-tight">
          {s.total_events.toLocaleString()}
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-[10px]">
          <span className="text-[#ff9500] font-bold">{t.vs_last_month}</span>
          <span className="text-[#6b7785]">vs last 30d</span>
        </div>
      </div>

      {/* Card 2: Critical Emergencies */}
      <div className="bg-[#0f141b] border border-[#1f2933] hover:border-[#ff3b3b] p-3 transition corner-brackets">
        <div className="flex items-center justify-between text-[#6b7785] text-[10px] uppercase font-bold mb-1">
          <span>CRITICAL HAZARDS</span>
          <AlertTriangle className="w-3.5 h-3.5 text-[#ff3b3b]" />
        </div>
        <div className="text-2xl font-black text-[#ff3b3b] tabular-nums tracking-tight flex items-center gap-2">
          <span>{s.critical_events}</span>
          <span className="text-[10px] font-bold px-1.5 py-0.2 bg-[#ff3b3b]/15 border border-[#ff3b3b] text-[#ff8080]">
            LVL-3
          </span>
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-[10px]">
          <span className="text-[#00ff9c] font-bold">{t.critical_change}</span>
          <span className="text-[#6b7785]">containment delta</span>
        </div>
      </div>

      {/* Card 3: False Alarms Prevented */}
      <div className="bg-[#0f141b] border border-[#1f2933] hover:border-[#00ff9c] p-3 transition corner-brackets">
        <div className="flex items-center justify-between text-[#6b7785] text-[10px] uppercase font-bold mb-1">
          <span>FALSE ALARMS SAVED</span>
          <ShieldCheck className="w-3.5 h-3.5 text-[#00ff9c]" />
        </div>
        <div className="text-2xl font-black text-[#00ff9c] tabular-nums tracking-tight">
          {s.false_alarms_prevented.toLocaleString()}
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-[10px]">
          <span className="text-[#00d4ff] font-bold">84%</span>
          <span className="text-[#6b7785]">ML filter efficiency</span>
        </div>
      </div>

      {/* Card 4: Avg Response Time */}
      <div className="bg-[#0f141b] border border-[#1f2933] hover:border-[#ffb800] p-3 transition corner-brackets">
        <div className="flex items-center justify-between text-[#6b7785] text-[10px] uppercase font-bold mb-1">
          <span>AVG RESPONSE ETA</span>
          <Clock className="w-3.5 h-3.5 text-[#ffb800]" />
        </div>
        <div className="text-2xl font-black text-[#ffb800] tabular-nums tracking-tight">
          {s.response_time_avg_min} <span className="text-xs font-normal text-[#6b7785]">MIN</span>
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-[10px]">
          <span className="text-[#00ff9c] font-bold">{t.response_improvement}</span>
          <span className="text-[#6b7785]">vs 15m target</span>
        </div>
      </div>

      {/* Card 5: Coverage Area */}
      <div className="bg-[#0f141b] border border-[#1f2933] hover:border-[#00d4ff] p-3 transition corner-brackets">
        <div className="flex items-center justify-between text-[#6b7785] text-[10px] uppercase font-bold mb-1">
          <span>SURVEILLANCE GRID</span>
          <MapPin className="w-3.5 h-3.5 text-[#00d4ff]" />
        </div>
        <div className="text-2xl font-black text-[#00d4ff] tabular-nums tracking-tight">
          3.28M <span className="text-xs font-normal text-[#6b7785]">KM²</span>
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-[10px]">
          <span className="text-[#d0d8e0] font-bold">100%</span>
          <span className="text-[#6b7785]">India Landmass</span>
        </div>
      </div>

      {/* Card 6: Cost Savings */}
      <div className="bg-[#0f141b] border border-[#1f2933] hover:border-[#00ff9c] p-3 transition corner-brackets">
        <div className="flex items-center justify-between text-[#6b7785] text-[10px] uppercase font-bold mb-1">
          <span>COST SAVED (EST)</span>
          <IndianRupee className="w-3.5 h-3.5 text-[#00ff9c]" />
        </div>
        <div className="text-2xl font-black text-white tabular-nums tracking-tight">
          ₹{s.cost_savings_inr_cr} <span className="text-xs font-normal text-[#00ff9c]">CR</span>
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-[10px]">
          <span className="text-[#00ff9c] font-bold">Averted Rollouts</span>
          <span className="text-[#6b7785]">public fleet</span>
        </div>
      </div>
    </div>
  );
}
