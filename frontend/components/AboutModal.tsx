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
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-[3000] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="glass-card bg-[#0b1220]/95 border border-white/15 rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl relative text-slate-200 flex flex-col gap-5 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top-Right Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full w-8 h-8 flex items-center justify-center transition text-sm font-bold border border-white/10 cursor-pointer"
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Title */}
        <div className="border-b border-white/10 pb-3.5">
          <div className="flex items-center gap-3">
            <span className="text-2xl drop-shadow-[0_0_12px_rgba(255,45,45,0.6)]">🔥</span>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-white tracking-wide font-mono">
                IGNIS COMMAND BRIEFING
              </h2>
              <p className="text-xs text-cyan-400 font-mono tracking-wider mt-0.5">
                Intelligent Geospatial Network for Industrial Fire Screening
              </p>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-4 text-xs md:text-sm leading-relaxed">
          <div>
            <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400 font-bold mb-1">
              MISSION BRIEF
            </h3>
            <p className="text-slate-300">
              IGNIS is a real-time satellite fire intelligence and classification engine built for intelligence and disaster mitigation commands. It ingests high-resolution thermal anomaly streams from NASA FIRMS sensors and discriminates industrial thermal operations from actual catastrophic emergencies.
            </p>
          </div>

          <div>
            <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400 font-bold mb-1">
              PROBLEM STATEMENT (SIH26162)
            </h3>
            <p className="text-slate-300">
              India records thousands of thermal detections daily. Raw satellite feeds flag blast furnaces, continuous refinery flare stacks, and routine crop burning indiscriminately. IGNIS establishes persistent industrial baselines to suppress false-positive alarms while isolating genuine high-risk anomalies for rapid dispatch.
            </p>
          </div>

          <div>
            <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400 font-bold mb-1">
              SURVEILLANCE ARCHITECTURE
            </h3>
            <p className="text-slate-300">
              Real-time ingestion of NASA VIIRS 375m active fire data crossed with OpenStreetMap industrial zoning, spatiotemporal persistence weighting, and multi-spectral anomaly scoring.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <div className="glass-card p-3 rounded-2xl border border-white/10 bg-white/[0.02]">
              <span className="text-[10px] font-mono text-slate-400 block uppercase tracking-wider mb-1">
                📡 SENSOR STACK
              </span>
              <p className="text-xs text-slate-300 leading-snug">
                NASA FIRMS (Suomi NPP & NOAA-20 VIIRS 375m), OpenStreetMap Overpass industrial polygons, automated persistence ledger.
              </p>
            </div>

            <div className="glass-card p-3 rounded-2xl border border-white/10 bg-white/[0.02]">
              <span className="text-[10px] font-mono text-slate-400 block uppercase tracking-wider mb-1">
                🎯 OPERATIONAL SPONSOR
              </span>
              <p className="text-xs font-bold text-cyan-400">
                NTRO — Problem SIH26162
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                National Technical Research Organisation
              </p>
            </div>
          </div>
        </div>

        {/* Tech Stack Badges */}
        <div className="border-t border-white/10 pt-4">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400 block mb-2 font-bold">
            COMMAND TELEMETRY STACK
          </span>
          <div className="flex flex-wrap gap-2 text-[11px] font-mono">
            <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300">
              Python 3.12
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300">
              FastAPI
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300">
              NASA FIRMS API
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-cyan-950/60 border border-cyan-800 text-cyan-300">
              Next.js 14
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300">
              TailwindCSS
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-amber-950/60 border border-amber-800 text-amber-300">
              Leaflet Tactical Engine
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
