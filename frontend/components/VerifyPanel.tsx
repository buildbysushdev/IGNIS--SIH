"use client";

import React, { useState } from "react";
import type { Fire } from "./FireMap";

interface VerifyPanelProps {
  fire: Fire | null;
  onClose: () => void;
  onSwitchBasemap?: (layer: "ops_dark" | "satellite" | "hybrid") => void;
}

export default function VerifyPanel({
  fire,
  onClose,
  onSwitchBasemap,
}: VerifyPanelProps) {
  const [copied, setCopied] = useState(false);
  const [opticalConfirmed, setOpticalConfirmed] = useState(false);

  if (!fire) return null;

  const lat = fire.latitude;
  const lon = fire.longitude;
  const acqDate = fire.acq_date || new Date().toISOString().slice(0, 10);
  const acqTime = fire.acq_time || "0000";

  // Build target external URLs
  const worldviewUrl = `https://worldview.earthdata.nasa.gov/?v=${lon - 1.5},${lat - 1.5},${lon + 1.5},${lat + 1.5}&t=${acqDate}`;
  const gmapsUrl = `https://www.google.com/maps/@${lat},${lon},15z/data=!3m1!1e3`;
  const osmUrl = `https://www.openstreetmap.org/#map=16/${lat}/${lon}`;
  const copernicusUrl = `https://browser.dataspace.copernicus.eu/?zoom=14&lat=${lat}&lng=${lon}`;

  const coordsText = `${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E`;

  const handleCopyCoords = () => {
    navigator.clipboard.writeText(`${lat.toFixed(6)}, ${lon.toFixed(6)}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Strip emojis from text fields to preserve strict ground-station aesthetic
  const cleanReason = (fire.reason || "Satellite thermal anomaly detected.")
    .replace(/[^\x20-\x7E]/g, "")
    .trim();
  const cleanAction = (fire.action || "Active continuous tracking.")
    .replace(/[^\x20-\x7E]/g, "")
    .trim();

  return (
    <div
      className="fixed inset-0 bg-black/85 z-[3500] flex items-center justify-center p-3 sm:p-5 font-mono select-none"
      onClick={onClose}
    >
      <div
        className="panel border border-[#2d3a4a] bg-[#0f141b] max-w-3xl w-full p-4 sm:p-6 shadow-2xl relative text-[#d0d8e0] flex flex-col gap-4 max-h-[92vh] overflow-y-auto corner-brackets"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Workspace Top Header */}
        <div className="flex items-center justify-between border-b border-[#1f2933] pb-3 bg-[#131a22] -mx-4 -mt-4 sm:-mx-6 sm:-mt-6 px-4 py-3 sm:px-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[#00ff9c] font-bold">[ + ]</span>
              <span className="text-xs sm:text-sm font-bold tracking-[0.15em] text-white uppercase">
                // CROSS-SENSOR VERIFICATION WORKSPACE
              </span>
              <span className="text-[10px] text-[#00d4ff] border border-[#1f2933] px-1.5 py-0.2 bg-[#0a0e14]">
                ANOM-{lat.toFixed(2)}-{lon.toFixed(2)}
              </span>
            </div>
            <div className="text-[10px] text-[#6b7785] tracking-wider uppercase mt-0.5">
              NEAR REAL-TIME THERMAL + RECENT OPTICAL VERIFICATION
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#6b7785] hover:text-[#ff3b3b] border border-[#1f2933] hover:border-[#ff3b3b] px-2.5 py-1 text-xs font-bold transition cursor-pointer"
          >
            [ ESC / X ]
          </button>
        </div>

        {/* ========================================================================= */}
        {/* 1) THERMAL EVENT TELEMETRY                                                */}
        {/* ========================================================================= */}
        <div className="border border-[#1f2933] bg-[#0a0e14] p-3 space-y-2">
          <div className="text-[10px] font-bold text-[#4a5563] uppercase tracking-widest flex items-center justify-between border-b border-[#1f2933] pb-1">
            <span>// 01. THERMAL EVENT TELEMETRY</span>
            <span className="text-[#ffb800]">[FIRMS VIIRS-375M]</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs tabular-nums">
            <div>
              <span className="text-[10px] text-[#6b7785] block uppercase">COORDINATES</span>
              <span className="text-[#00d4ff] font-bold">{coordsText}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#6b7785] block uppercase">ACQUISITION</span>
              <span className="text-[#d0d8e0]">{acqDate}T{acqTime}Z</span>
            </div>
            <div>
              <span className="text-[10px] text-[#6b7785] block uppercase">FIRE POWER (FRP)</span>
              <span className="text-[#ffb800] font-bold">{Number(fire.frp || 0).toFixed(1)} MW</span>
            </div>
            <div>
              <span className="text-[10px] text-[#6b7785] block uppercase">BRIGHTNESS TEMP</span>
              <span className="text-[#d0d8e0]">{Number(fire.brightness || 0).toFixed(1)} K</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-[#1f2933] text-xs">
            <div>
              <span className="text-[10px] text-[#6b7785] block uppercase">CLASSIFICATION</span>
              <span className="text-[#00ff9c] font-bold uppercase">{fire.category || "UNKNOWN"}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#6b7785] block uppercase">RISK LEVEL</span>
              <span
                className={`font-bold uppercase ${
                  fire.risk_level === "CRITICAL" ? "text-[#ff3b3b]" : "text-[#ffb800]"
                }`}
              >
                [{fire.risk_level || "NOMINAL"}]
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#6b7785] block uppercase">SENSOR CONFIDENCE</span>
              <span className="text-[#00d4ff] uppercase">{String(fire.confidence || "NOMINAL")}</span>
            </div>
          </div>

          <div className="text-[11px] text-[#6b7785] leading-snug pt-1 border-t border-[#1f2933]">
            <span className="text-[#d0d8e0] font-semibold">DIAGNOSIS: </span>
            {cleanReason}
          </div>
          <div className="text-[11px] text-[#ffb800] leading-snug">
            <span className="text-[#d0d8e0] font-semibold">ACTION VECTOR: </span>
            {cleanAction}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2) VISUAL VERIFICATION TOOLS                                              */}
        {/* ========================================================================= */}
        <div className="border border-[#1f2933] bg-[#0a0e14] p-3 space-y-2.5">
          <div className="text-[10px] font-bold text-[#4a5563] uppercase tracking-widest flex items-center justify-between border-b border-[#1f2933] pb-1">
            <span>// 02. VISUAL VERIFICATION (CROSS-PLATFORM SATELLITE LINKS)</span>
            <span className="text-[#00d4ff]">[OPTICAL CONTEXT]</span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1 text-xs">
            <a
              href={worldviewUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 border border-[#00d4ff] bg-[#0f141b] text-[#00d4ff] hover:bg-[#00d4ff]/10 font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5"
            >
              <span>[ NASA WORLDVIEW ↗ ]</span>
            </a>

            <a
              href={gmapsUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 border border-[#1f2933] hover:border-[#00d4ff] bg-[#0f141b] text-[#d0d8e0] hover:text-[#00d4ff] font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5"
            >
              <span>[ GOOGLE MAPS SATELLITE ↗ ]</span>
            </a>

            <a
              href={osmUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 border border-[#1f2933] hover:border-[#00d4ff] bg-[#0f141b] text-[#d0d8e0] hover:text-[#00d4ff] font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5"
            >
              <span>[ OPENSTREETMAP ROADS ↗ ]</span>
            </a>

            <a
              href={copernicusUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 border border-[#1f2933] hover:border-[#00d4ff] bg-[#0f141b] text-[#d0d8e0] hover:text-[#00d4ff] font-bold uppercase tracking-wider transition cursor-pointer hidden md:flex items-center gap-1.5"
            >
              <span>[ COPERNICUS BROWSER ↗ ]</span>
            </a>

            <button
              onClick={handleCopyCoords}
              className="px-3 py-1.5 border border-[#1f2933] hover:border-[#00ff9c] bg-[#0f141b] text-[#6b7785] hover:text-[#00ff9c] font-bold uppercase tracking-wider transition cursor-pointer"
            >
              {copied ? "[ COPIED TO CLIPBOARD! ]" : "[ COPY COORDS ]"}
            </button>
          </div>

          {onSwitchBasemap && (
            <div className="pt-2 border-t border-[#1f2933] flex items-center justify-between text-xs">
              <span className="text-[10px] text-[#6b7785]">DIRECT TERMINAL BASEMAP OVERRIDE:</span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => {
                    onSwitchBasemap("satellite");
                    onClose();
                  }}
                  className="px-2.5 py-1 border border-[#ffb800] text-[#ffb800] hover:bg-[#ffb800]/10 text-[10px] font-bold uppercase cursor-pointer"
                >
                  [ SWITCH MAP TO SATELLITE ▷ ]
                </button>
                <button
                  onClick={() => {
                    onSwitchBasemap("hybrid");
                    onClose();
                  }}
                  className="px-2.5 py-1 border border-[#1f2933] text-[#d0d8e0] hover:border-[#00d4ff] text-[10px] font-bold uppercase cursor-pointer"
                >
                  [ HYBRID ▷ ]
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 3) AREA & ROAD ACCESS CONTEXT                                             */}
        {/* ========================================================================= */}
        <div className="border border-[#1f2933] bg-[#0a0e14] p-3 space-y-2">
          <div className="text-[10px] font-bold text-[#4a5563] uppercase tracking-widest flex items-center justify-between border-b border-[#1f2933] pb-1">
            <span>// 03. AREA / ROAD CONTEXT & ACCESS VECTORS</span>
            <span className="text-[#00ff9c]">[ACCESS ROUTES]</span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between border-b border-[#1f2933] pb-1 text-[11px]">
              <span className="text-[#6b7785]">WITHIN 5KM INDUSTRIAL PERIMETER:</span>
              <span
                className={`font-bold uppercase ${
                  fire.category === "PERSISTENT_INDUSTRIAL" || fire.category === "EMERGENCY_INDUSTRIAL"
                    ? "text-[#ffb800]"
                    : "text-[#6b7785]"
                }`}
              >
                {fire.category === "PERSISTENT_INDUSTRIAL" || fire.category === "EMERGENCY_INDUSTRIAL"
                  ? "[ YES — KNOWN FACILITY CORRIDOR ]"
                  : "[ NO — REMOTE/AGRICULTURAL/WILDLAND ]"}
              </span>
            </div>

            <div className="text-[11px] text-[#6b7785] space-y-1 pt-1">
              <div>-- Use SATELLITE basemap to inspect terrain topology, smoke dispersal, and burn scar footprint.</div>
              <div>-- Use OSM / Google Maps to inspect ground approach vectors, bridge crossings, and road access constraints.</div>
              <div>-- Note: Optical satellite revisit latency is typically hours to days depending on sensor swath and cloud cover.</div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4) MULTI-SENSOR CONFIDENCE FUSION CHECKLIST                               */}
        {/* ========================================================================= */}
        <div className="border border-[#1f2933] bg-[#0a0e14] p-3 space-y-2">
          <div className="text-[10px] font-bold text-[#4a5563] uppercase tracking-widest flex items-center justify-between border-b border-[#1f2933] pb-1">
            <span>// 04. MULTI-SENSOR CONFIDENCE FUSION</span>
            <span className="text-[#00ff9c]">[VERIFICATION PROTOCOL]</span>
          </div>

          <div className="space-y-1.5 text-xs text-[#d0d8e0]">
            <div className="flex items-center gap-2">
              <span className="text-[#00ff9c] font-bold">[X]</span>
              <span>Thermal anomaly detected (NASA FIRMS VIIRS 375m)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#00ff9c] font-bold">[X]</span>
              <span>Classification assigned (IGNIS Multi-spectral Rules Engine)</span>
            </div>
            <div
              onClick={() => setOpticalConfirmed(!opticalConfirmed)}
              className="flex items-center gap-2 cursor-pointer hover:text-[#00d4ff] transition select-none"
            >
              <span
                className={`font-bold ${
                  opticalConfirmed ? "text-[#00ff9c]" : "text-[#ffb800]"
                }`}
              >
                {opticalConfirmed ? "[X]" : "[ ]"}
              </span>
              <span>
                Optical confirmation (Operator manual verification via Worldview/Satellite){" "}
                <span className="text-[10px] text-[#4a5563] font-bold">
                  {opticalConfirmed ? "[CONFIRMED]" : "[CLICK TO CONFIRM]"}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#00ff9c] font-bold">[X]</span>
              <span>Infrastructure context linked (OpenStreetMap / National Registry)</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#1f2933] pt-2 flex items-center justify-between text-[10px] text-[#6b7785]">
          <span>IGNIS MISSION VERIFICATION PROTOCOL // NTRO SIH26162</span>
          <button
            onClick={onClose}
            className="border border-[#1f2933] hover:border-[#00d4ff] text-[#d0d8e0] px-3 py-1 uppercase font-bold cursor-pointer"
          >
            [ CLOSE WORKSPACE ]
          </button>
        </div>
      </div>
    </div>
  );
}
