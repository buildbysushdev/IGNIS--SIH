"use client";

import { useEffect, useState } from "react";

export interface ScenarioStepItem {
  time: number;
  action: string;
  narration: string;
}

export interface NarrationOverlayProps {
  narration: string | null;
  scenarioName?: string;
  progressPct: number;
  elapsedSec: number;
  totalDurationSec: number;
  currentAction?: string;
  equipment?: string[];
  warning?: string;
  steps?: ScenarioStepItem[];
  currentStepIndex?: number;
  onSeekStep?: (index: number) => void;
  isPaused?: boolean;
  onTogglePause?: () => void;
  onPrevStep?: () => void;
  onNextStep?: () => void;
  onTriggerDispatch?: () => void;
  onSkip: () => void;
  onStop?: () => void;
}

function formatActionTitle(action?: string): string {
  if (!action) return "TELEMETRY SCAN";
  switch (action) {
    case "SHOW_MAP":
      return "Cartography Centered";
    case "ADD_FIRE":
      return "Thermal Anomaly Spike";
    case "BATCH_ADD_FIRES":
      return "Cluster Telemetry Ingest";
    case "CLASSIFY":
    case "CLASSIFY_ALL":
      return "ML Classifier Verdict";
    case "SHOW_PROTOCOL":
      return "Response Protocol Active";
    case "FIND_STATION":
      return "Nearest Fire Station Identified";
    case "DISPATCH":
      return "Tactical Dispatch Transmitted";
    case "SHOW_EQUIPMENT":
      return "Suppression Equipment Directive";
    case "SHOW_EVACUATION":
      return "Evacuation Perimeter Computed";
    case "PREDICT_SPREAD":
      return "Wind Vector Spread Cone";
    case "SHOW_STATS":
      return "Suppression Analytics Audit";
    case "COMPLETE":
      return "Mission Simulation Complete";
    default:
      return action.replace(/_/g, " ");
  }
}

export default function NarrationOverlay({
  narration,
  scenarioName = "Scenario Playback",
  progressPct,
  elapsedSec,
  totalDurationSec,
  currentAction,
  equipment,
  warning,
  steps = [],
  currentStepIndex = 0,
  onSeekStep,
  isPaused = false,
  onTogglePause,
  onPrevStep,
  onNextStep,
  onTriggerDispatch,
  onSkip,
}: NarrationOverlayProps) {
  const [displayedText, setDisplayedText] = useState<string>("");
  const [isFading, setIsFading] = useState<boolean>(false);

  useEffect(() => {
    if (!narration) {
      setDisplayedText("");
      return;
    }
    setIsFading(true);
    const timeout = setTimeout(() => {
      setDisplayedText(narration);
      setIsFading(false);
    }, 120);
    return () => clearTimeout(timeout);
  }, [narration]);

  if (!narration && progressPct === 0 && steps.length === 0) return null;

  const showDispatchBtn =
    onTriggerDispatch &&
    (currentAction === "DISPATCH" ||
      elapsedSec >= 24 ||
      scenarioName.toLowerCase().includes("surat"));

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-3xl z-[1500] pointer-events-auto font-mono text-xs animate-in fade-in slide-in-from-bottom-4 duration-300 select-none shadow-[0_0_40px_rgba(0,0,0,0.8)]">
      <div className="bg-[#0a0f16]/95 border-2 border-[#00d4ff]/60 shadow-[0_0_30px_rgba(0,212,255,0.2)] backdrop-blur-md rounded-xl overflow-hidden relative">
        {/* Top Header & Interactive Navigation Bar */}
        <div className="flex items-center justify-between px-3 py-2 bg-[#0d141e] border-b border-[#1f2933] text-[10px] text-[#6b7785] tracking-wider uppercase flex-wrap gap-2">
          {/* Left: Indicator & Title */}
          <div className="flex items-center gap-2 min-w-0">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isPaused
                  ? "bg-amber-400 animate-none"
                  : "bg-[#00ff9c] animate-pulse"
              }`}
            />
            <span className="text-[#00ff9c] font-black tracking-widest hidden sm:inline">
              MISSION SCENARIO
            </span>
            <span className="text-[#4a5563] hidden sm:inline">::</span>
            <span className="text-white font-bold truncate max-w-[180px] sm:max-w-[280px]">
              {scenarioName.toUpperCase()}
            </span>
            {currentAction && (
              <span className="px-1.5 py-0.5 bg-[#00d4ff]/15 border border-[#00d4ff]/40 text-[#00d4ff] text-[9px] font-bold rounded">
                [{formatActionTitle(currentAction)}]
              </span>
            )}
          </div>

          {/* Right: Stepper Controls, Timer & Exit */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Prev Step Button */}
            {onPrevStep && (
              <button
                type="button"
                onClick={onPrevStep}
                disabled={currentStepIndex <= 0}
                className="px-2 py-1 bg-[#131a22] border border-[#1f2933] hover:border-cyan-500/60 text-[#d0d8e0] hover:text-white rounded text-[10px] font-bold transition disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                title="Scroll back to previous step"
              >
                ◀◀ PREV
              </button>
            )}

            {/* Play / Pause Button */}
            {onTogglePause && (
              <button
                type="button"
                onClick={onTogglePause}
                className={`px-2.5 py-1 rounded text-[10px] font-bold transition border cursor-pointer ${
                  isPaused
                    ? "bg-amber-950/80 border-amber-500 text-amber-300 hover:bg-amber-900"
                    : "bg-[#00d4ff]/15 border-[#00d4ff]/60 text-[#00d4ff] hover:bg-[#00d4ff]/30"
                }`}
                title={isPaused ? "Resume playback" : "Pause scenario"}
              >
                {isPaused ? "▶ RESUME" : "❚❚ PAUSE"}
              </button>
            )}

            {/* Next Step Button */}
            {onNextStep && (
              <button
                type="button"
                onClick={onNextStep}
                disabled={steps.length > 0 && currentStepIndex >= steps.length - 1}
                className="px-2 py-1 bg-[#131a22] border border-[#1f2933] hover:border-cyan-500/60 text-[#d0d8e0] hover:text-white rounded text-[10px] font-bold transition disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                title="Scroll forward to next step"
              >
                NEXT ▶▶
              </button>
            )}

            {/* Time readout */}
            <span className="text-[#00d4ff] font-bold tabular-nums bg-[#080d14] px-2 py-0.5 rounded border border-[#1f2933]">
              T+{elapsedSec}s / {totalDurationSec}s
            </span>

            {/* Skip / Exit Button */}
            <button
              type="button"
              onClick={onSkip}
              className="px-2.5 py-1 border border-red-500/60 bg-red-950/40 text-red-300 hover:bg-red-900 hover:text-white font-bold text-[10px] uppercase transition cursor-pointer rounded"
              title="Exit demo scenario and return to live telemetry"
            >
              [ ✕ EXIT DEMO ]
            </button>
          </div>
        </div>

        {/* Scrollable Timeline Stepper Strip */}
        {steps && steps.length > 0 && (
          <div className="px-3 py-1.5 bg-[#070b10] border-b border-[#1f2933] flex items-center gap-1.5 overflow-x-auto scrollbar-thin">
            <span className="text-[9px] text-[#6b7785] font-bold uppercase tracking-wider whitespace-nowrap mr-1">
              STEPS:
            </span>
            {steps.map((st, idx) => {
              const isCurr = idx === currentStepIndex;
              const isPast = elapsedSec >= st.time;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSeekStep?.(idx)}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] whitespace-nowrap transition cursor-pointer border ${
                    isCurr
                      ? "bg-[#00d4ff]/25 border-[#00d4ff] text-[#00d4ff] font-black shadow-[0_0_10px_rgba(0,212,255,0.5)] scale-105"
                      : isPast
                      ? "bg-[#00ff9c]/10 border-[#00ff9c]/40 text-[#00ff9c] font-medium hover:border-[#00ff9c]"
                      : "bg-[#111822] border-[#1f2933] text-[#6b7785] hover:text-[#d0d8e0] hover:border-gray-600"
                  }`}
                  title={`Click to scroll map & jump to T+${st.time}s (${st.action})`}
                >
                  <span className="tabular-nums font-bold">T+{st.time}s</span>
                  <span className="opacity-60">•</span>
                  <span>{formatActionTitle(st.action)}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Narration Body */}
        <div className="p-3.5 min-h-[64px] flex flex-col justify-center gap-2">
          <div className="flex items-start justify-between gap-3">
            <p
              className={`text-white text-xs sm:text-sm font-medium tracking-wide leading-relaxed transition-opacity duration-150 flex-1 ${
                isFading ? "opacity-30" : "opacity-100"
              }`}
            >
              <span className="text-[#00ff9c] font-bold mr-2">&gt;&gt;</span>
              {displayedText || narration}
            </p>

            {/* Optional Dispatch Launch Shortcut */}
            {showDispatchBtn && (
              <button
                type="button"
                onClick={onTriggerDispatch}
                className="px-3 py-1.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-[11px] rounded shadow-[0_0_15px_rgba(255,59,59,0.5)] flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap animate-pulse"
              >
                <span>🚒</span>
                <span>OPEN DISPATCH CAD</span>
              </button>
            )}
          </div>

          {/* Warning Banner */}
          {warning && (
            <div className="bg-red-950/40 border border-red-500/60 px-2.5 py-1 text-red-300 text-[11px] font-bold flex items-center gap-2 rounded">
              <span className="animate-pulse text-red-400 font-black">[!]</span>
              <span>{warning}</span>
            </div>
          )}

          {/* Equipment Pills */}
          {equipment && equipment.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1.5 border-t border-[#1f2933]">
              <span className="text-[#6b7785] text-[10px] font-bold mr-1">
                TACTICAL DIRECTIVE:
              </span>
              {equipment.map((eq, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 bg-[#00d4ff]/10 border border-[#00d4ff]/30 text-[#00d4ff] text-[10px] rounded"
                >
                  {eq}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Tactical Animated Progress Bar across bottom */}
        <div className="w-full h-1.5 bg-[#131a22] relative overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#00ff9c] via-[#00d4ff] to-purple-400 transition-all duration-300 ease-linear shadow-[0_0_8px_#00d4ff]"
            style={{ width: `${Math.min(100, Math.max(0, progressPct))}%` }}
          />
        </div>
      </div>
    </div>
  );
}
