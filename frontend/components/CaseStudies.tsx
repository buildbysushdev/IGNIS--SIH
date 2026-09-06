"use client";

import { useState } from "react";

export default function CaseStudies() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="glass-card rounded-2xl md:rounded-3xl p-4 md:p-5 shadow-2xl border border-white/10 transition-all">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="text-amber-400 text-sm">💡</span>
          <h3 className="text-xs md:text-sm font-extrabold text-white tracking-wide uppercase font-mono">
            Ground Truth & Intelligence Benchmarks
          </h3>
          <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
            • Validation Case Profiles
          </span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition flex items-center gap-1.5 cursor-pointer"
        >
          <span>{isOpen ? "MINIMIZE" : "EXPAND"}</span>
          <span>{isOpen ? "▲" : "▼"}</span>
        </button>
      </div>

      {/* 3 Compact Glass Insight Cards */}
      {isOpen && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-3.5 pt-3 border-t border-white/10">
          {/* Card 1: Bhilai Steel Plant */}
          <div className="glass-card rounded-xl p-3.5 border border-white/10 flex flex-col justify-between gap-2.5 hover:border-amber-500/30 transition-all">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-amber-400 font-mono font-bold text-[9px] uppercase tracking-widest bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded-full">
                  INDUSTRIAL PERSISTENCE
                </span>
                <span className="text-slate-500 font-mono text-[10px]">
                  21.2°N, 81.4°E
                </span>
              </div>
              <h4 className="text-xs font-bold text-white mt-1 flex items-center gap-1.5">
                <span>🏭</span> Bhilai Steel Complex
              </h4>
              <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                Active &gt;25 days/month with 120-180MW FRP. Classified as routine flare stacks.
              </p>
            </div>
            <div className="text-[10px] font-mono text-amber-300/90 bg-amber-950/30 px-2 py-1 rounded-lg border border-amber-900/40">
              <span className="text-slate-400 font-sans">Why this matters: </span>
              Prevents dispatch false-alarms at known steelworks.
            </div>
          </div>

          {/* Card 2: Agricultural Burning Belt */}
          <div className="glass-card rounded-xl p-3.5 border border-white/10 flex flex-col justify-between gap-2.5 hover:border-orange-500/30 transition-all">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-orange-400 font-mono font-bold text-[9px] uppercase tracking-widest bg-orange-950/60 border border-orange-800/60 px-2 py-0.5 rounded-full">
                  SEASONAL CROP BELT
                </span>
                <span className="text-slate-500 font-mono text-[10px]">
                  30.5°N, 75.5°E
                </span>
              </div>
              <h4 className="text-xs font-bold text-white mt-1 flex items-center gap-1.5">
                <span>🌾</span> Punjab Stubble Grid
              </h4>
              <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                High-density clustering in post-monsoon harvest window with low FRP (&lt;30MW).
              </p>
            </div>
            <div className="text-[10px] font-mono text-orange-300/90 bg-orange-950/30 px-2 py-1 rounded-lg border border-orange-900/40">
              <span className="text-slate-400 font-sans">Why this matters: </span>
              Feeds environmental air-quality compliance registries.
            </div>
          </div>

          {/* Card 3: Forest Anomaly Response */}
          <div className="glass-card rounded-xl p-3.5 border border-white/10 flex flex-col justify-between gap-2.5 hover:border-emerald-500/30 transition-all">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-emerald-400 font-mono font-bold text-[9px] uppercase tracking-widest bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                  WILDLAND BIOMASS
                </span>
                <span className="text-slate-500 font-mono text-[10px]">
                  Dynamic Canopy
                </span>
              </div>
              <h4 className="text-xs font-bold text-white mt-1 flex items-center gap-1.5">
                <span>🌲</span> Forest Anomaly Response
              </h4>
              <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                Spatiotemporal clustering in protected reserves outside industrial baselines.
              </p>
            </div>
            <div className="text-[10px] font-mono text-emerald-300/90 bg-emerald-950/30 px-2 py-1 rounded-lg border border-emerald-900/40">
              <span className="text-slate-400 font-sans">Why this matters: </span>
              Routes instant perimeter alerts to forest rangers.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
