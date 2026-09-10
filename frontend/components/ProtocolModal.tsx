"use client";

import { useState } from "react";
import { getResponseProtocol, FireResponseProtocol } from "@/data/fireResponse";
import type { Fire } from "./FireMap";

export interface ProtocolModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
  fire?: Fire | null;
}

export default function ProtocolModal({
  isOpen,
  onClose,
  category,
  fire,
}: ProtocolModalProps) {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const protocol: FireResponseProtocol = getResponseProtocol(category);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const summary = `[IGNIS FIRE RESPONSE DIRECTIVE]
CATEGORY: ${category}
CLASS: ${protocol.fire_class}
MATERIALS: ${protocol.typical_materials.join(", ")}
PRIMARY AGENTS: ${protocol.use_agents.primary.join(", ")}
AVOID: ${protocol.avoid.join(", ")}
SAFETY PERIMETER: ${protocol.safety_distance_m}m
EVACUATION RADIUS: ${protocol.evacuation_radius_m}m
PERSONNEL: ${protocol.personnel_required} responders
TARGET RESPONSE: <=${protocol.response_time_target_min} min
COORDINATION: ${protocol.coordination.join(", ")}
NOTES: ${protocol.special_notes}
${fire ? `LOCATION: ${fire.latitude.toFixed(4)}N, ${fire.longitude.toFixed(4)}E | FRP: ${fire.frp}MW` : ""}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(summary).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#0c1017] border border-[#1f2933] w-full max-w-3xl max-h-[92vh] flex flex-col font-mono text-xs text-[#d0d8e0] shadow-[0_0_40px_rgba(0,0,0,0.8)] relative print:max-w-none print:max-h-none print:bg-white print:text-black">
        {/* Top Operational Header */}
        <div className="px-4 py-3 bg-[#131a22] border-b border-[#1f2933] flex items-center justify-between shrink-0 print:border-black">
          <div className="flex items-center gap-2">
            <span className="text-[#00ff9c] font-black tracking-widest text-sm">::</span>
            <div>
              <div className="font-bold tracking-widest text-white uppercase text-xs sm:text-sm">
                TACTICAL FIRE RESPONSE PROTOCOL DIRECTIVE
              </div>
              <div className="text-[10px] text-[#6b7785] tracking-wider uppercase">
                CATEGORY: <span className="text-[#00d4ff] font-bold">{category}</span> // SECTOR DIRECTIVE
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-2.5 py-1 border border-[#1f2933] bg-[#0a0e14] hover:bg-[#1a2332] text-[#d0d8e0] hover:text-[#00d4ff] text-[10px] font-bold uppercase transition cursor-pointer print:hidden"
            >
              [ 🖨 PRINT ]
            </button>
            <button
              onClick={handleShare}
              className="px-2.5 py-1 border border-[#00d4ff]/40 bg-[#00d4ff]/10 hover:bg-[#00d4ff]/20 text-[#00d4ff] text-[10px] font-bold uppercase transition cursor-pointer print:hidden"
            >
              {copied ? "[ COPIED! ]" : "[ 🔗 SHARE ]"}
            </button>
            <button
              onClick={onClose}
              className="px-2 py-1 border border-[#ff3b3b]/50 bg-[#ff3b3b]/10 text-[#ff8080] hover:bg-[#ff3b3b]/25 hover:text-white text-[11px] font-bold transition cursor-pointer print:hidden"
            >
              [ ✕ ]
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* Header Summary Banner */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-[#101721] border border-[#1f2933]">
            <div>
              <div className="text-[10px] text-[#6b7785] uppercase">CLASSIFICATION CLASS</div>
              <div className="text-base font-bold text-[#ffb800]">{protocol.fire_class}</div>
            </div>
            {fire && (
              <div className="text-right">
                <div className="text-[10px] text-[#6b7785] uppercase">HOTSPOT TELEMETRY</div>
                <div className="text-xs text-[#00ff9c] font-bold">
                  {fire.latitude.toFixed(4)}°N, {fire.longitude.toFixed(4)}°E // {fire.frp} MW
                </div>
              </div>
            )}
          </div>

          {/* Typical Materials Substrate */}
          <div>
            <div className="text-[10px] text-[#6b7785] uppercase tracking-wider mb-1.5 font-bold">
              // TYPICAL COMBUSTIBLE MATERIALS
            </div>
            <div className="flex flex-wrap gap-1.5">
              {protocol.typical_materials.map((mat, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 border border-[#1f2933] bg-[#101721] text-[#00d4ff] text-[11px]"
                >
                  {mat}
                </span>
              ))}
            </div>
          </div>

          {/* Operational Agents Comparison (Use vs Avoid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Recommended Agents (Green) */}
            <div className="border border-[#00ff9c]/40 bg-[#00ff9c]/5 p-3 space-y-2">
              <div className="flex items-center gap-1.5 text-[#00ff9c] font-bold text-xs">
                <span>✅</span>
                <span>RECOMMENDED AGENTS // USE</span>
              </div>
              <div>
                <div className="text-[10px] text-[#6b7785] uppercase font-bold">PRIMARY:</div>
                <ul className="space-y-1 text-white text-xs mt-0.5">
                  {protocol.use_agents.primary.map((item, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="text-[#00ff9c]">&bull;</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {protocol.use_agents.secondary.length > 0 && (
                <div className="pt-1.5 border-t border-[#00ff9c]/20">
                  <div className="text-[10px] text-[#6b7785] uppercase font-bold">SECONDARY:</div>
                  <ul className="space-y-1 text-[#d0d8e0] text-[11px] mt-0.5">
                    {protocol.use_agents.secondary.map((item, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="text-[#00d4ff]">&bull;</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Prohibited Agents (Red) */}
            <div className="border border-[#ff3b3b]/40 bg-[#ff3b3b]/5 p-3 space-y-2">
              <div className="flex items-center gap-1.5 text-[#ff3b3b] font-bold text-xs">
                <span>❌</span>
                <span>STRICTLY PROHIBITED // AVOID</span>
              </div>
              <ul className="space-y-1.5 text-[#ff8080] text-xs">
                {protocol.avoid.map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-[#ff3b3b] font-bold">[!]</span>
                    <span className="leading-tight">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Key Operational Thresholds Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
            <div className="p-2 border border-[#1f2933] bg-[#101721]">
              <div className="text-[#6b7785] uppercase">👥 PERSONNEL</div>
              <div className="text-sm font-bold text-white mt-0.5">
                {protocol.personnel_required} Responders
              </div>
            </div>
            <div className="p-2 border border-[#1f2933] bg-[#101721]">
              <div className="text-[#6b7785] uppercase">📏 SAFETY DISTANCE</div>
              <div className="text-sm font-bold text-[#00ff9c] mt-0.5">
                {protocol.safety_distance_m} Meters
              </div>
            </div>
            <div className="p-2 border border-[#1f2933] bg-[#101721]">
              <div className="text-[#6b7785] uppercase">⏱ TARGET RESPONSE</div>
              <div className="text-sm font-bold text-[#ffb800] mt-0.5">
                &le; {protocol.response_time_target_min} Minutes
              </div>
            </div>
            <div className="p-2 border border-[#1f2933] bg-[#101721]">
              <div className="text-[#6b7785] uppercase">🚨 EVACUATION ZONE</div>
              <div className="text-sm font-bold text-[#ff3b3b] mt-0.5">
                {protocol.evacuation_radius_m > 0
                  ? `${protocol.evacuation_radius_m} Meters`
                  : "Not Required"}
              </div>
            </div>
          </div>

          {/* Equipment Required Checklist */}
          <div className="border border-[#1f2933] bg-[#101721] p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[#00d4ff] font-bold text-xs uppercase flex items-center gap-1.5">
                <span>🚒</span>
                <span>MANDATORY RESPONSE EQUIPMENT</span>
              </span>
              <span className="text-[10px] text-[#6b7785]">
                TOTAL UNITS: {protocol.equipment_required.length}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {protocol.equipment_required.map((eq, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 p-1.5 border border-[#1f2933] bg-[#0c1017] text-white text-[11px]"
                >
                  <span className="text-[#00ff9c] font-bold">[✓]</span>
                  <span>{eq}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Inter-Agency Coordination & Health Facilities */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="border border-[#1f2933] bg-[#101721] p-3 space-y-1.5">
              <div className="text-[#00d4ff] font-bold text-xs uppercase flex items-center gap-1.5">
                <span>📞</span>
                <span>COORDINATION NETWORK</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {protocol.coordination.map((agency, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-[#0a0e14] border border-[#1f2933] text-[#d0d8e0] text-[10px]"
                  >
                    {agency}
                  </span>
                ))}
              </div>
            </div>

            <div className="border border-[#1f2933] bg-[#101721] p-3 space-y-1.5">
              <div className="text-[#00d4ff] font-bold text-xs uppercase flex items-center gap-1.5">
                <span>🏥</span>
                <span>FACILITIES & SPECIAL PROTOCOLS</span>
              </div>
              <div className="text-xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[#6b7785]">Hospital Notification:</span>
                  <span
                    className={`font-bold px-1.5 py-0.2 text-[10px] ${
                      protocol.hospital_notification
                        ? "text-[#ff3b3b] bg-[#ff3b3b]/10 border border-[#ff3b3b]"
                        : "text-[#6b7785] bg-[#1f2933]"
                    }`}
                  >
                    {protocol.hospital_notification ? "MANDATORY" : "NOT REQUIRED"}
                  </span>
                </div>
                {protocol.aerial_support && (
                  <div className="text-[10px] text-[#00ff9c]">
                    🚁 Aerial: {protocol.aerial_support}
                  </div>
                )}
                {protocol.aqi_alert && (
                  <div className="text-[10px] text-[#ffb800]">
                    🌫 AQI Impact: Urban corridor alert triggered
                  </div>
                )}
                {protocol.wildlife_protocol && (
                  <div className="text-[10px] text-[#00ff9c]">
                    🐾 Wildlife: Active corridor conservation protocol
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Special Tactical Notes */}
          <div className="border border-[#ffb800]/40 bg-[#ffb800]/5 p-3">
            <div className="text-[#ffb800] font-bold text-[10px] uppercase flex items-center gap-1.5 mb-1">
              <span>⚠️</span>
              <span>TACTICAL ADVISORY & SAFETY NOTES</span>
            </div>
            <p className="text-white text-xs leading-relaxed">
              {protocol.special_notes}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2 bg-[#0a0e14] border-t border-[#1f2933] flex items-center justify-between text-[10px] text-[#6b7785]">
          <span>IGNIS-01 // HAZMAT TACTICAL DIRECTIVE ENGINE</span>
          <button
            onClick={onClose}
            className="px-3 py-1 border border-[#1f2933] text-[#d0d8e0] hover:text-white hover:border-[#00d4ff] uppercase font-bold"
          >
            [ CLOSE DIRECTIVE ]
          </button>
        </div>
      </div>
    </div>
  );
}
