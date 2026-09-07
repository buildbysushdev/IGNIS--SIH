"use client";

import { useEffect, useState } from "react";

export interface NarrationOverlayProps {
  narration: string | null;
  scenarioName?: string;
  progressPct: number;
  elapsedSec: number;
  totalDurationSec: number;
  currentAction?: string;
  equipment?: string[];
  warning?: string;
  onSkip: () => void;
  onStop?: () => void;
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
  onSkip,
  onStop,
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
    }, 150);
    return () => clearTimeout(timeout);
  }, [narration]);

  if (!narration && progressPct === 0) return null;

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[92%] max-w-2xl z-50 pointer-events-auto font-mono text-xs animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-[#0c1017]/95 border border-[#00ff9c]/60 shadow-[0_0_30px_rgba(0,255,156,0.18)] backdrop-blur-md rounded-xs overflow-hidden relative">
        {/* Top Meta Bar */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-[#131a22] border-b border-[#1f2933] text-[10px] text-[#6b7785] tracking-wider uppercase">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00ff9c] animate-pulse" />
            <span className="text-[#00ff9c] font-black tracking-widest">
              SCENARIO PLAYBACK
            </span>
            <span className="text-[#4a5563]">::</span>
            <span className="text-[#d0d8e0] font-bold truncate max-w-[200px] sm:max-w-none">
              {scenarioName.toUpperCase()}
            </span>
            {currentAction && (
              <span className="hidden sm:inline-block px-1.5 py-0.2 bg-[#00d4ff]/10 border border-[#00d4ff]/40 text-[#00d4ff] text-[9px]">
                [{currentAction}]
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[#00d4ff] font-bold tabular-nums">
              T+{elapsedSec}s / {totalDurationSec}s
            </span>
            <button
              onClick={onSkip}
              className="px-2 py-0.5 border border-[#ff3b3b]/60 bg-[#ff3b3b]/10 text-[#ff8080] hover:bg-[#ff3b3b]/25 hover:text-white font-bold text-[9px] uppercase transition cursor-pointer"
            >
              [ SKIP ]
            </button>
          </div>
        </div>

        {/* Narration Body */}
        <div className="p-3.5 min-h-[58px] flex flex-col justify-center gap-2">
          <p
            className={`text-white text-xs sm:text-sm font-medium tracking-wide leading-relaxed transition-opacity duration-200 ${
              isFading ? "opacity-20" : "opacity-100"
            }`}
          >
            <span className="text-[#00ff9c] font-bold mr-2">&gt;&gt;</span>
            {displayedText || narration}
          </p>

          {/* Warning Banner */}
          {warning && (
            <div className="bg-[#ff3b3b]/15 border border-[#ff3b3b]/60 px-2 py-1 text-[#ff8080] text-[11px] font-bold flex items-center gap-2">
              <span className="animate-pulse">[!]</span>
              <span>{warning}</span>
            </div>
          )}

          {/* Equipment Pills */}
          {equipment && equipment.length > 0 && (
            <div className="flex flex-wrap items-center gap-1 pt-1 border-t border-[#1f2933]">
              <span className="text-[#6b7785] text-[10px] font-bold mr-1">EQUIPMENT:</span>
              {equipment.map((eq, i) => (
                <span
                  key={i}
                  className="px-1.5 py-0.5 bg-[#00d4ff]/10 border border-[#00d4ff]/30 text-[#00d4ff] text-[10px]"
                >
                  {eq}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Progress Bar (Hairline line across bottom) */}
        <div className="w-full h-1 bg-[#1f2933] relative overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#00ff9c] via-[#00d4ff] to-[#c084fc] transition-all duration-300 ease-linear shadow-[0_0_8px_#00ff9c]"
            style={{ width: `${Math.min(100, Math.max(0, progressPct))}%` }}
          />
        </div>
      </div>
    </div>
  );
}
