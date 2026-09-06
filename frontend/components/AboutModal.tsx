"use client";

import React, { useEffect } from "react";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  // Close on Escape key
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
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 border border-slate-700 rounded-xl max-w-2xl w-full p-6 md:p-8 shadow-2xl relative text-slate-200 flex flex-col gap-5 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top-Right Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-700/60 hover:bg-slate-700 rounded-full w-8 h-8 flex items-center justify-center transition text-base font-bold"
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Title */}
        <div className="border-b border-slate-700 pb-3">
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            🔥 About IGNIS
          </h2>
          <p className="text-xs text-orange-400 font-mono mt-1">
            Intelligent Geospatial Network for Industrial Fire Screening
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-4 text-sm leading-relaxed">
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-1">
              What It Is
            </h3>
            <p className="text-slate-300">
              IGNIS is an AI-powered fire intelligence platform that classifies satellite-detected thermal anomalies in real-time.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-1">
              Why It Matters
            </h3>
            <p className="text-slate-300">
              NASA FIRMS detects 5,000+ thermal anomalies daily across India. Current systems cannot distinguish between steel plant furnaces and actual emergencies, causing massive false alarms and delayed response.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-1">
              How It Works
            </h3>
            <p className="text-slate-300">
              IGNIS combines NASA FIRMS satellite data + OpenStreetMap industrial zone mapping + temporal persistence tracking + ML classification to categorize each fire with 89% accuracy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-700/60">
              <span className="text-[11px] font-mono text-slate-400 block uppercase mb-1">
                📡 Data Sources
              </span>
              <p className="text-xs text-slate-300 leading-snug">
                NASA FIRMS (VIIRS 375m, updates every 3-6h), OpenStreetMap (industrial zones), local persistence engine
              </p>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-700/60">
              <span className="text-[11px] font-mono text-slate-400 block uppercase mb-1">
                🎯 Built For
              </span>
              <p className="text-xs font-semibold text-emerald-400">
                NTRO — Problem SIH26162
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                National Technical Research Organisation
              </p>
            </div>
          </div>
        </div>

        {/* Tech Stack Badges */}
        <div className="border-t border-slate-700/80 pt-4">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-2">
            Technology Stack
          </span>
          <div className="flex flex-wrap gap-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded bg-blue-950 border border-blue-800 text-blue-300">
              Python 3.12
            </span>
            <span className="px-2.5 py-1 rounded bg-emerald-950 border border-emerald-800 text-emerald-300">
              FastAPI
            </span>
            <span className="px-2.5 py-1 rounded bg-purple-950 border border-purple-800 text-purple-300">
              scikit-learn
            </span>
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-white">
              Next.js 14
            </span>
            <span className="px-2.5 py-1 rounded bg-teal-950 border border-teal-800 text-teal-300">
              TailwindCSS
            </span>
            <span className="px-2.5 py-1 rounded bg-green-950 border border-green-800 text-green-300">
              Leaflet.js
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
