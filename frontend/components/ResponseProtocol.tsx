"use client";

import { getResponseProtocol } from "@/data/fireResponse";

interface ResponseProtocolProps {
  category: string;
  compact?: boolean;
}

export default function ResponseProtocol({
  category,
  compact = false,
}: ResponseProtocolProps) {
  const protocol = getResponseProtocol(category);

  if (compact) {
    return (
      <div className="border border-[#1f2933] bg-[#0c1017] p-2 font-mono text-[10px] space-y-1.5">
        <div className="flex items-center justify-between border-b border-[#1f2933] pb-1">
          <span className="text-[#00d4ff] font-bold tracking-wider">// RESPONSE PROTOCOL</span>
          <span className="px-1.5 py-0.5 border border-[#ffb800] text-[#ffb800] font-bold text-[9px]">
            [{protocol.fire_class}]
          </span>
        </div>

        <div className="grid grid-cols-2 gap-1.5 text-[10px]">
          <div>
            <div className="text-[#00ff9c] font-semibold text-[9px] flex items-center gap-1">
              <span>[✓]</span> USE:
            </div>
            <div className="text-[#d0d8e0] text-[9px] truncate">
              {protocol.USE.join(", ")}
            </div>
          </div>
          <div>
            <div className="text-[#ff3b3b] font-semibold text-[9px] flex items-center gap-1">
              <span>[✗]</span> AVOID:
            </div>
            <div className="text-[#ff3b3b] text-[9px] truncate font-medium">
              {protocol.AVOID.join(", ")}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-[9px] text-[#6b7785] pt-1 border-t border-[#1f2933]">
          <span>PERIMETER: {protocol.safety_distance_m}M</span>
          <span>ETA TARGET: &le;{protocol.response_time_target_min}MIN</span>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-[#1f2933] bg-[#0a0e14] p-3 font-mono text-xs space-y-2.5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1f2933] pb-1.5">
        <div className="flex items-center gap-2">
          <span className="text-[#00ff9c] font-bold">::</span>
          <span className="text-[#d0d8e0] font-bold tracking-wider">
            MATERIAL-BASED FIRE RESPONSE PROTOCOL
          </span>
        </div>
        <span className="px-2 py-0.5 border border-[#ffb800] bg-[#ffb800]/10 text-[#ffb800] font-bold text-[10px]">
          CLASS: {protocol.fire_class}
        </span>
      </div>

      {/* Materials & Class */}
      <div className="text-[11px] space-y-1">
        <div className="text-[#6b7785] flex justify-between">
          <span>TYPICAL MATERIALS:</span>
          <span className="text-[#d0d8e0] font-medium">
            {protocol.typical_materials.join(", ")}
          </span>
        </div>
      </div>

      {/* Agents Comparison Grid */}
      <div className="grid grid-cols-2 gap-2 text-[11px]">
        {/* Recommended Agents */}
        <div className="border border-[#00ff9c]/30 bg-[#00ff9c]/5 p-2">
          <div className="text-[#00ff9c] font-bold text-[10px] mb-1 flex items-center gap-1.5">
            <span>[✓]</span> RECOMMENDED AGENTS
          </div>
          <ul className="space-y-0.5 text-[#d0d8e0]">
            {protocol.USE.map((item, i) => (
              <li key={i} className="flex items-center gap-1">
                <span className="text-[#00ff9c] text-[9px]">&bull;</span>
                <span className="capitalize">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Prohibited / Dangerous Agents */}
        <div className="border border-[#ff3b3b]/30 bg-[#ff3b3b]/5 p-2">
          <div className="text-[#ff3b3b] font-bold text-[10px] mb-1 flex items-center gap-1.5">
            <span>[✗]</span> STRICTLY AVOID
          </div>
          <ul className="space-y-0.5 text-[#ff8080]">
            {protocol.AVOID.map((item, i) => (
              <li key={i} className="flex items-center gap-1">
                <span className="text-[#ff3b3b] text-[9px]">&bull;</span>
                <span className="capitalize">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Equipment Requirements */}
      <div className="border-t border-[#1f2933] pt-1.5 space-y-1 text-[11px]">
        <span className="text-[#6b7785] text-[10px] font-bold tracking-wider uppercase">
          // REQUIRED TACTICAL EQUIPMENT
        </span>
        <div className="flex flex-wrap gap-1.5 mt-1">
          {protocol.equipment.map((eq, i) => (
            <span
              key={i}
              className="px-1.5 py-0.5 border border-[#1f2933] bg-[#131a22] text-[#00d4ff] text-[10px]"
            >
              + {eq}
            </span>
          ))}
        </div>
      </div>

      {/* Safety Perimeter & Target Metrics */}
      <div className="border-t border-[#1f2933] pt-1.5 grid grid-cols-2 gap-2 text-[10px] tabular-nums">
        <div className="flex justify-between border-r border-[#1f2933] pr-2">
          <span className="text-[#6b7785]">SAFETY PERIMETER:</span>
          <span className="text-[#ffb800] font-bold">{protocol.safety_distance_m}m</span>
        </div>
        <div className="flex justify-between pl-1">
          <span className="text-[#6b7785]">TARGET ARRIVAL:</span>
          <span className="text-[#00ff9c] font-bold">&le;{protocol.response_time_target_min} min</span>
        </div>
      </div>

      {/* Special Operational Notes */}
      {protocol.special_notes && (
        <div className="border-t border-[#1f2933] pt-1.5 text-[10px] text-[#ffb800] bg-[#ffb800]/5 p-1.5 border-l-2 border-l-[#ffb800]">
          <span className="font-bold">NOTE: </span>
          <span>{protocol.special_notes}</span>
        </div>
      )}
    </div>
  );
}
