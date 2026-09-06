"use client";

import { useState } from "react";

export default function CaseStudies() {
  const [expanded, setExpanded] = useState<boolean>(false);

  return (
    <div className="bg-[#1e293b] border border-slate-700/60 rounded-xl p-5 shadow-xl">
      {/* Header with toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            📚 Case Studies & Benchmark Patterns
          </h2>
          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
            (Ground Truth Validation)
          </span>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
        >
          <span>{expanded ? "Collapse" : "Expand"}</span>
          <span>{expanded ? "▲" : "▼"}</span>
        </button>
      </div>

      {/* Expanded Content: 3 Cards */}
      {expanded && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {/* Card 1: Bhilai Steel Plant (Yellow) */}
          <div className="border-l-4 border-yellow-500 bg-slate-900/80 p-4 rounded-r-xl border border-l-0 border-slate-800 flex flex-col justify-between gap-3 shadow-md">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-yellow-400 font-mono font-bold text-[10px] uppercase tracking-wider bg-yellow-950/60 border border-yellow-800 px-2 py-0.5 rounded">
                  PERSISTENT_INDUSTRIAL
                </span>
                <span className="text-slate-500 font-mono text-[11px]">
                  21.20°N, 81.38°E
                </span>
              </div>
              <h3 className="text-sm font-bold text-white mt-1">
                🏭 Bhilai Steel Plant
              </h3>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                Hot 28/30 days. FRP 120-180MW. Normal blast furnace operations. NOT an emergency.
              </p>
            </div>
            <div className="text-[11px] font-mono text-yellow-300/80 bg-yellow-950/30 p-1.5 rounded border border-yellow-900/40">
              System Action: Suppress alert; track baseline
            </div>
          </div>

          {/* Card 2: Punjab Stubble Burning (Orange) */}
          <div className="border-l-4 border-orange-500 bg-slate-900/80 p-4 rounded-r-xl border border-l-0 border-slate-800 flex flex-col justify-between gap-3 shadow-md">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-orange-400 font-mono font-bold text-[10px] uppercase tracking-wider bg-orange-950/60 border border-orange-800 px-2 py-0.5 rounded">
                  AGRICULTURAL_BURNING
                </span>
                <span className="text-slate-500 font-mono text-[11px]">
                  30.5°N, 75.5°E
                </span>
              </div>
              <h3 className="text-sm font-bold text-white mt-1">
                🌾 Punjab Stubble Burning
              </h3>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                Oct-Nov spike. Low FRP &lt; 30MW. Indo-Gangetic plain. Seasonal crop residue burning.
              </p>
            </div>
            <div className="text-[11px] font-mono text-orange-300/80 bg-orange-950/30 p-1.5 rounded border border-orange-900/40">
              System Action: Flag for state pollution registry
            </div>
          </div>

          {/* Card 3: Emergency Industrial Fire (Red) */}
          <div className="border-l-4 border-red-500 bg-slate-900/80 p-4 rounded-r-xl border border-l-0 border-slate-800 flex flex-col justify-between gap-3 shadow-md">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-red-400 font-mono font-bold text-[10px] uppercase tracking-wider bg-red-950/60 border border-red-800 px-2 py-0.5 rounded">
                  EMERGENCY_INDUSTRIAL
                </span>
                <span className="text-slate-500 font-mono text-[11px]">
                  Varies
                </span>
              </div>
              <h3 className="text-sm font-bold text-white mt-1">
                🚨 Emergency Industrial Fire (Example)
              </h3>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                Sudden thermal spike at previously cold location near industrial zone. High FRP. Immediate dispatch required.
              </p>
            </div>
            <div className="text-[11px] font-mono text-red-300/80 bg-red-950/30 p-1.5 rounded border border-red-900/40">
              System Action: Broadcast critical alarm to authorities
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
