"use client";

import { Sparkles, AlertCircle, ShieldAlert, CheckCircle2 } from "lucide-react";

interface InsightsPanelProps {
  onFilterState?: (state: string) => void;
}

export default function InsightsPanel({ onFilterState }: InsightsPanelProps) {
  const insights = [
    {
      id: "ins-1",
      severity: "CRITICAL",
      title: "Chemical Cluster Risk Escalation in Gujarat",
      description: "Surat & Ankleshwar GIDC corridors exhibit 14% month-over-month thermal density increase. Level-3 emergency industrial risk is concentrated near bulk solvent & petrochemical storage.",
      recommendation: "Ensure 10,000L Class-B AR-AFFF foam stockpiles at Hazira port and Ankleshwar DPMC depots.",
      badgeColor: "bg-[#ff3b3b]/15 border-[#ff3b3b] text-[#ff3b3b]",
      state: "Gujarat",
    },
    {
      id: "ins-2",
      severity: "HIGH",
      title: "Punjab Harvest Stubble Burning Season Peak",
      description: "Agricultural fires in Ludhiana, Sangrur, and Patiala show sharp seasonal acceleration (+28%). Peak satellite detections consistently concentrate between 13:00 and 16:30 daily.",
      recommendation: "Deploy UAV patrols and activate village-level CRM (Crop Residue Management) monitoring committees.",
      badgeColor: "bg-[#ff9500]/15 border-[#ff9500] text-[#ff9500]",
      state: "Punjab",
    },
    {
      id: "ins-3",
      severity: "STABLE",
      title: "Bhilai Metallurgy Signature Within Operational Baseline",
      description: "Persistent industrial thermal signatures at Bhilai Steel Plant (FRP 90–160 MW) remain within regular metallurgical blast furnace operating parameters. Zero unconfined spread risk.",
      recommendation: "Continue standard automated 6-hour satellite persistence verification.",
      badgeColor: "bg-[#00ff9c]/15 border-[#00ff9c] text-[#00ff9c]",
      state: "Chhattisgarh",
    },
    {
      id: "ins-4",
      severity: "ELEVATED",
      title: "Uttarakhand Pre-Monsoon Dry Biomass Advisory",
      description: "Garhwal pine forest zones reflect declining humidity indices. Early April historical precedents suggest high wildfire susceptibility along un-cleared ridgeline firebreaks.",
      recommendation: "Pre-position Indian Air Force Bambi Bucket air assets at Bareilly air base and inspect 5m firelines.",
      badgeColor: "bg-[#ffb800]/15 border-[#ffb800] text-[#ffb800]",
      state: "Uttarakhand",
    },
  ];

  return (
    <div className="bg-[#0f141b] border border-[#1f2933] p-3 font-mono corner-brackets">
      <div className="flex items-center justify-between border-b border-[#1f2933] pb-2 mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#00d4ff] animate-pulse" />
          <span className="text-xs font-bold tracking-wider text-[#d0d8e0] uppercase">
            // AI-GENERATED STRATEGIC THREAT INSIGHTS
          </span>
          <span className="text-[10px] text-[#00ff9c] hidden sm:inline">[REAL-TIME PATTERN SYNTHESIS]</span>
        </div>
        <span className="text-[10px] text-[#6b7785]">SOURCE: IGNIS ML & FIRMS 5Y ARCHIVE</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {insights.map((item) => (
          <div
            key={item.id}
            className="bg-[#0a0e14] border border-[#1f2933] hover:border-[#00d4ff]/60 p-2.5 flex flex-col justify-between transition text-xs"
          >
            <div>
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span className={`text-[9px] px-1.5 py-0.5 border font-bold uppercase ${item.badgeColor}`}>
                  [{item.severity}]
                </span>
                {onFilterState && (
                  <button
                    onClick={() => onFilterState(item.state)}
                    className="text-[9px] text-[#00d4ff] hover:underline cursor-pointer"
                  >
                    FOCUS {item.state} ↗
                  </button>
                )}
              </div>

              <div className="font-bold text-white text-[11px] mb-1 leading-snug">
                {item.title}
              </div>

              <p className="text-[10px] text-[#6b7785] leading-relaxed mb-2">
                {item.description}
              </p>
            </div>

            <div className="pt-2 border-t border-[#1f2933] text-[9px] text-[#ffb800]">
              <span className="text-[#d0d8e0] font-bold">DIRECTIVE: </span>
              {item.recommendation}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
