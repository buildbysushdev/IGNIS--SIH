"use client";

import React, { useEffect } from "react";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 z-[3000] flex items-center justify-center p-4 font-mono select-none"
      onClick={onClose}
    >
      <div
        className="panel border border-[#2d3a4a] bg-[#0f141b] max-w-2xl w-full p-5 shadow-2xl relative text-[#d0d8e0] flex flex-col gap-4 max-h-[90vh] overflow-y-auto corner-brackets"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1f2933] pb-2.5 bg-[#131a22] -mx-5 -mt-5 px-5 py-2.5">
          <div className="flex items-center gap-2">
            <span className="text-[#00ff9c] font-bold">[ + ]</span>
            <span className="text-xs font-bold tracking-[0.15em] text-[#d0d8e0] uppercase">
              IGNIS MISSION SYSTEM SPECIFICATION // NTRO-SIH26162
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-[#6b7785] hover:text-[#ff3b3b] border border-[#1f2933] px-2 py-0.5 text-xs font-bold cursor-pointer"
          >
            [ ESC / X ]
          </button>
        </div>

        {/* Technical Data Content */}
        <div className="space-y-3 text-xs leading-relaxed">
          <div>
            <div className="text-[10px] text-[#4a5563] uppercase tracking-widest font-bold mb-0.5">
              // 01. OPERATIONAL MANDATE
            </div>
            <p className="text-[#d0d8e0]">
              IGNIS is a high-reliability ground-station telemetry and classification pipeline developed for the National Technical Research Organisation (NTRO) under problem statement SIH26162. Its core mandate is real-time discrimination of persistent industrial emissions (blast furnaces, flaring stacks, smelting operations) from true catastrophic fire anomalies.
            </p>
          </div>

          <div>
            <div className="text-[10px] text-[#4a5563] uppercase tracking-widest font-bold mb-0.5">
              // 02. SATELLITE INGESTION PIPELINE
            </div>
            <p className="text-[#d0d8e0]">
              Ingests active fire detections from NASA FIRMS (VIIRS 375m sensor suite aboard Suomi NPP and NOAA-20 platforms). Thermal channels I4 (3.9 μm) and I5 (11.4 μm) provide high spatial resolution for sub-pixel thermal anomaly screening across the Indian subcontinent.
            </p>
          </div>

          <div>
            <div className="text-[10px] text-[#4a5563] uppercase tracking-widest font-bold mb-0.5">
              // 03. SPATIAL BASELINE & PERSISTENCE
            </div>
            <p className="text-[#d0d8e0]">
              Cross-referenced against 248 verified industrial facilities and OpenStreetMap industrial land-use polygons. Multi-temporal pass tracking suppresses repeated stationary heat signatures while flagging novel, unverified thermal bursts.
            </p>
          </div>

          {/* Subsystem Metrics Grid */}
          <div className="grid grid-cols-2 gap-2 border-t border-[#1f2933] pt-3 text-[11px] tabular-nums">
            <div className="border border-[#1f2933] p-2 bg-[#0a0e14]">
              <span className="text-[#4a5563] text-[9px] block uppercase">CLASSIFIER MODEL</span>
              <span className="text-[#00d4ff] font-bold">RANDOM FOREST (100 TREES)</span>
              <div className="text-[#6b7785] text-[10px] mt-0.5">Accuracy: 89.2% on benchmark</div>
            </div>
            <div className="border border-[#1f2933] p-2 bg-[#0a0e14]">
              <span className="text-[#4a5563] text-[9px] block uppercase">NOMINAL REFRESH CYCLE</span>
              <span className="text-[#00ff9c] font-bold">180 SECONDS (AUTOMATED)</span>
              <div className="text-[#6b7785] text-[10px] mt-0.5">Fallback: Local Cache Ledger</div>
            </div>
          </div>
        </div>

        {/* Subsystem Footer */}
        <div className="border-t border-[#1f2933] pt-2 flex items-center justify-between text-[10px] text-[#6b7785]">
          <span>RELEASE: v1.0.4 // PRODUCTION NODE</span>
          <button
            onClick={onClose}
            className="border border-[#00d4ff] text-[#00d4ff] px-3 py-1 text-[10px] font-bold hover:bg-[#00d4ff]/10 uppercase cursor-pointer"
          >
            [ CLOSE SPECIFICATION ]
          </button>
        </div>
      </div>
    </div>
  );
}
