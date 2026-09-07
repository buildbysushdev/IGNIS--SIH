"use client";

import { getResponseProtocol, FireResponseProtocol } from "@/data/fireResponse";

export interface ResponseProtocolProps {
  category: string;
  compact?: boolean;
  onViewFull?: () => void;
}

export default function ResponseProtocol({
  category,
  compact = false,
  onViewFull,
}: ResponseProtocolProps) {
  const protocol: FireResponseProtocol = getResponseProtocol(category);

  // Class badge color mapping
  const getClassBadgeColor = (cls: string) => {
    if (cls.includes("B") || cls.includes("C")) return "text-[#ff3b3b] border-[#ff3b3b] bg-[#ff3b3b]/10";
    if (cls.includes("A/B")) return "text-[#ffb800] border-[#ffb800] bg-[#ffb800]/10";
    if (cls.includes("A")) return "text-[#00ff9c] border-[#00ff9c] bg-[#00ff9c]/10";
    return "text-[#00d4ff] border-[#00d4ff] bg-[#00d4ff]/10";
  };

  if (compact) {
    return (
      <div className="border border-[#1f2933] bg-[#0c1017] p-2.5 font-mono text-[10px] space-y-2 select-none">
        {/* Header Ribbon */}
        <div className="flex items-center justify-between border-b border-[#1f2933] pb-1.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[#00d4ff] font-bold tracking-wider">// RESPONSE PROTOCOL</span>
          </div>
          <span className={`px-1.5 py-0.2 border text-[9px] font-bold ${getClassBadgeColor(protocol.fire_class)}`}>
            [{protocol.fire_class}]
          </span>
        </div>

        {/* Typical Materials Chips */}
        <div className="flex flex-wrap gap-1">
          {protocol.typical_materials.map((mat, i) => (
            <span
              key={i}
              className="px-1.5 py-0.2 bg-[#101721] border border-[#1f2933] text-[#00d4ff] text-[9px]"
            >
              {mat}
            </span>
          ))}
        </div>

        {/* USE vs AVOID summary */}
        <div className="grid grid-cols-2 gap-1.5 text-[10px]">
          <div className="border border-[#00ff9c]/30 bg-[#00ff9c]/5 p-1.5">
            <div className="text-[#00ff9c] font-bold text-[9px] flex items-center gap-1">
              <span>✅</span> USE:
            </div>
            <div className="text-white text-[9px] mt-0.5 leading-snug">
              {protocol.use_agents.primary.slice(0, 2).join(", ")}
            </div>
          </div>
          <div className="border border-[#ff3b3b]/30 bg-[#ff3b3b]/5 p-1.5">
            <div className="text-[#ff3b3b] font-bold text-[9px] flex items-center gap-1">
              <span>❌</span> AVOID:
            </div>
            <div className="text-[#ff8080] text-[9px] mt-0.5 leading-snug">
              {protocol.avoid[0] || "None"}
            </div>
          </div>
        </div>

        {/* Metrics Bar */}
        <div className="grid grid-cols-3 gap-1 text-[9px] text-[#6b7785] pt-1 border-t border-[#1f2933] tabular-nums">
          <div>
            <span>PERIMETER: </span>
            <span className="text-[#00ff9c] font-bold">{protocol.safety_distance_m}M</span>
          </div>
          <div>
            <span>TARGET: </span>
            <span className="text-[#ffb800] font-bold">&le;{protocol.response_time_target_min}M</span>
          </div>
          <div>
            <span>CREW: </span>
            <span className="text-white font-bold">{protocol.personnel_required}P</span>
          </div>
        </div>

        {/* View Full Protocol Button */}
        {onViewFull && (
          <button
            onClick={onViewFull}
            className="w-full text-center py-1 border border-[#00d4ff]/40 bg-[#00d4ff]/10 hover:bg-[#00d4ff]/25 text-[#00d4ff] text-[9px] font-bold uppercase transition cursor-pointer"
          >
            [ VIEW FULL PROTOCOL &gt;&gt; ]
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="border border-[#1f2933] bg-[#0a0e14] p-3.5 font-mono text-xs space-y-3 print:bg-white print:text-black">
      {/* 1) Top Header & Fire Class Badge */}
      <div className="flex items-center justify-between border-b border-[#1f2933] pb-2">
        <div className="flex items-center gap-2">
          <span className="text-[#00ff9c] font-bold text-sm">::</span>
          <span className="text-white font-bold tracking-wider uppercase text-xs sm:text-sm">
            MATERIAL-BASED FIRE RESPONSE PROTOCOL
          </span>
        </div>
        <span className={`px-2 py-0.5 border font-bold text-[10px] ${getClassBadgeColor(protocol.fire_class)}`}>
          CLASS: {protocol.fire_class}
        </span>
      </div>

      {/* 2) Typical Materials Chips */}
      <div>
        <div className="text-[10px] text-[#6b7785] uppercase tracking-wider mb-1 font-bold">
          // TYPICAL MATERIALS INVOLVED:
        </div>
        <div className="flex flex-wrap gap-1.5">
          {protocol.typical_materials.map((mat, i) => (
            <span
              key={i}
              className="px-2 py-0.5 bg-[#101721] border border-[#1f2933] text-[#00d4ff] text-[11px]"
            >
              {mat}
            </span>
          ))}
        </div>
      </div>

      {/* 3) USE vs AVOID Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {/* Recommended Agents (Green) */}
        <div className="border border-[#00ff9c]/40 bg-[#00ff9c]/5 p-2.5 space-y-1.5">
          <div className="flex items-center gap-1.5 text-[#00ff9c] font-bold text-xs">
            <span>✅</span>
            <span>RECOMMENDED AGENTS // USE</span>
          </div>
          <ul className="space-y-1 text-white text-xs">
            {protocol.use_agents.primary.map((item, i) => (
              <li key={i} className="flex items-center gap-1.5">
                <span className="text-[#00ff9c]">&bull;</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          {protocol.use_agents.secondary.length > 0 && (
            <div className="pt-1 border-t border-[#00ff9c]/20 text-[10px] text-[#6b7785]">
              <span>Secondary: </span>
              <span className="text-[#d0d8e0]">{protocol.use_agents.secondary.join(", ")}</span>
            </div>
          )}
        </div>

        {/* Prohibited Agents (Red) */}
        <div className="border border-[#ff3b3b]/40 bg-[#ff3b3b]/5 p-2.5 space-y-1.5">
          <div className="flex items-center gap-1.5 text-[#ff3b3b] font-bold text-xs">
            <span>❌</span>
            <span>STRICTLY PROHIBITED // AVOID</span>
          </div>
          <ul className="space-y-1 text-[#ff8080] text-xs">
            {protocol.avoid.map((item, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-[#ff3b3b] font-bold">[!]</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 4) Mandatory Equipment Required */}
      <div className="border border-[#1f2933] bg-[#101721] p-2.5 space-y-1.5">
        <div className="text-[#00d4ff] font-bold text-xs flex items-center gap-1.5">
          <span>🚒</span>
          <span>EQUIPMENT REQUIRED:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-[#d0d8e0]">
          {protocol.equipment_required.map((eq, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className="text-[#00ff9c] font-bold">&gt;</span>
              <span>{eq}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 5) Operational Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 text-[10px] text-center">
        <div className="p-1.5 border border-[#1f2933] bg-[#0c1017]">
          <div className="text-[#6b7785]">👥 PERSONNEL</div>
          <div className="text-white font-bold mt-0.5">{protocol.personnel_required} Responders</div>
        </div>
        <div className="p-1.5 border border-[#1f2933] bg-[#0c1017]">
          <div className="text-[#6b7785]">📏 SAFETY DIST.</div>
          <div className="text-[#00ff9c] font-bold mt-0.5">{protocol.safety_distance_m}m</div>
        </div>
        <div className="p-1.5 border border-[#1f2933] bg-[#0c1017]">
          <div className="text-[#6b7785]">⏱ TARGET RESP.</div>
          <div className="text-[#ffb800] font-bold mt-0.5">&le;{protocol.response_time_target_min} min</div>
        </div>
        <div className="p-1.5 border border-[#1f2933] bg-[#0c1017]">
          <div className="text-[#6b7785]">🚨 EVACUATION</div>
          <div className="text-[#ff3b3b] font-bold mt-0.5">
            {protocol.evacuation_radius_m > 0 ? `${protocol.evacuation_radius_m}m` : "None"}
          </div>
        </div>
        <div className="p-1.5 border border-[#1f2933] bg-[#0c1017] col-span-2 sm:col-span-1">
          <div className="text-[#6b7785]">🏥 HOSPITAL</div>
          <div className={`font-bold mt-0.5 ${protocol.hospital_notification ? "text-[#ff3b3b]" : "text-[#6b7785]"}`}>
            {protocol.hospital_notification ? "Notify Yes" : "Notify No"}
          </div>
        </div>
      </div>

      {/* 6) Inter-Agency Coordination */}
      <div className="border border-[#1f2933] bg-[#0c1017] p-2 text-xs flex flex-wrap items-center gap-1.5">
        <span className="text-[#6b7785] text-[10px] font-bold uppercase flex items-center gap-1">
          <span>📞</span> COORDINATE WITH:
        </span>
        {protocol.coordination.map((agency, i) => (
          <span
            key={i}
            className="px-1.5 py-0.2 border border-[#1f2933] bg-[#101721] text-[#00d4ff] text-[10px]"
          >
            {agency}
          </span>
        ))}
      </div>

      {/* 7) Special Notes Advisory */}
      <div className="border border-[#ffb800]/40 bg-[#ffb800]/5 p-2 text-xs text-white">
        <div className="text-[#ffb800] text-[10px] font-bold flex items-center gap-1 mb-0.5">
          <span>⚠️</span> SPECIAL NOTES:
        </div>
        <div className="leading-relaxed">{protocol.special_notes}</div>
      </div>

      {onViewFull && (
        <button
          onClick={onViewFull}
          className="w-full text-center py-1.5 border border-[#00d4ff] bg-[#00d4ff]/15 hover:bg-[#00d4ff]/25 text-[#00d4ff] text-xs font-bold uppercase transition cursor-pointer"
        >
          [ VIEW FULL PROTOCOL MODAL &gt;&gt; ]
        </button>
      )}
    </div>
  );
}
