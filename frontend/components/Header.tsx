"use client";

import { useState, useRef, useEffect } from "react";

export interface HeaderProps {
  currentMode: "LIVE" | "CACHED" | "DEMO";
  modeInfo?: {
    mode?: string;
    since?: string;
    reason?: string;
    data_source?: string;
    is_manual?: boolean;
  };
  onSelectMode: (mode: "LIVE" | "CACHED" | "DEMO" | "AUTO") => void;
  selectedScenarioId: string;
  onSelectScenario: (scenarioId: string) => void;
  isScenarioPlaying: boolean;
  onTogglePlayScenario: () => void;
  seqCounter: number;
  utcClock: string;
  latencyStr: string;
  onOpenAbout: () => void;
  onOpenEmergencyPanel?: () => void;
  onOpenDispatchHistory?: () => void;
}

export default function Header({
  currentMode,
  modeInfo,
  onSelectMode,
  selectedScenarioId,
  onSelectScenario,
  isScenarioPlaying,
  onTogglePlayScenario,
  seqCounter,
  utcClock,
  latencyStr,
  onOpenAbout,
  onOpenEmergencyPanel,
  onOpenDispatchHistory,
}: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleModePick = (target: "LIVE" | "CACHED" | "DEMO" | "AUTO") => {
    setIsDropdownOpen(false);
    onSelectMode(target);
  };

  const getPillLabel = () => {
    switch (currentMode) {
      case "LIVE":
        return "LIVE :: NASA FIRMS";
      case "CACHED":
        return "CACHED :: LOCAL DB";
      case "DEMO":
        return "DEMO :: SIMULATED";
      default:
        return "LIVE :: NASA FIRMS";
    }
  };

  return (
    <header className="border-b border-[#1f2933] bg-[#0f141b] px-3 py-2 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs tracking-wider uppercase font-mono relative z-40">
      {/* 1) Left: Node Identity & NTRO Mission Tag */}
      <div className="flex items-center gap-3">
        <div className="w-2.5 h-2.5 bg-[#00ff9c] status-dot-green flex-shrink-0" />
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-[#00ff9c] font-black text-sm tracking-widest">
              IGNIS-01
            </span>
            <span className="text-[#4a5563]">//</span>
            <span className="text-[#d0d8e0] font-bold">
              FIRE INTELLIGENCE GROUND STATION
            </span>
            <span className="text-[10px] text-[#00d4ff] border border-[#1f2933] px-1 py-0.2 bg-[#0a0e14]">
              v2.0
            </span>
            <span className="text-[10px] text-[#ffb800] border border-[#1f2933] px-1 py-0.2 bg-[#0a0e14] hidden sm:inline">
              NTRO // SIH26162
            </span>
          </div>
          <div className="text-[10px] text-[#6b7785] tracking-wider uppercase flex items-center gap-2">
            <span>DEFENSE THERMAL SURVEILLANCE NODE</span>
            <span className="text-[#4a5563]">::</span>
            <span className="text-[#00d4ff] lowercase">{modeInfo?.data_source || "Real-time Telemetry"}</span>
          </div>
        </div>
      </div>

      {/* 2) Center: Simulation Scenarios & Quick Emergency Launch */}
      <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
        {/* Scenarios Selector Dropdown */}
        <div className="flex items-center gap-1 border border-[#1f2933] bg-[#0a0e14] px-2 py-1 text-[10px]">
          <span className="text-[#6b7785] font-bold hidden sm:inline">SCENARIO:</span>
          <select
            value={selectedScenarioId}
            onChange={(e) => onSelectScenario(e.target.value)}
            className="bg-[#0f141b] border border-[#1f2933] text-[#00d4ff] px-1.5 py-0.5 font-mono text-[10px] cursor-pointer"
          >
            <option value="live">Live Data</option>
            <option value="surat_emergency">▶ Surat Emergency Response</option>
            <option value="punjab_stubble">▶ Punjab Stubble Peak</option>
            <option value="uttarakhand_forest">▶ Uttarakhand Forest Fire</option>
          </select>
          {selectedScenarioId !== "live" && (
            <button
              onClick={onTogglePlayScenario}
              className={`px-2 py-0.5 text-[9px] font-bold uppercase cursor-pointer border transition ${
                isScenarioPlaying
                  ? "border-[#ffb800] bg-[#ffb800]/20 text-[#ffb800]"
                  : "border-[#00ff9c] bg-[#00ff9c]/20 text-[#00ff9c] hover:bg-[#00ff9c]/30"
              }`}
            >
              {isScenarioPlaying ? "[ PAUSE ]" : "[ PLAY SCENARIO ]"}
            </button>
          )}
        </div>

        {onOpenEmergencyPanel && (
          <button
            onClick={onOpenEmergencyPanel}
            className="px-2 py-1 text-[10px] font-bold uppercase border border-[#ff3b3b]/60 bg-[#ff3b3b]/10 text-[#ff8080] hover:bg-[#ff3b3b]/25 cursor-pointer transition hidden md:inline-flex items-center gap-1"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff3b3b] animate-ping" />
            [ EMERGENCY PANEL ]
          </button>
        )}

        {onOpenDispatchHistory && (
          <button
            onClick={onOpenDispatchHistory}
            className="px-2 py-1 text-[10px] font-bold uppercase border border-[#00d4ff]/60 bg-[#00d4ff]/10 text-[#00d4ff] hover:bg-[#00d4ff]/25 cursor-pointer transition hidden lg:inline-flex items-center gap-1"
          >
            <span>📋</span>
            [ DISPATCH LOG ]
          </button>
        )}
      </div>

      {/* 3) Right: Operational Mode Dropdown Pill & Satellite Link Info */}
      <div className="flex items-center gap-2.5 text-[11px] font-mono">
        {/* Latency & Packets */}
        <div className="hidden xl:flex items-center gap-1.5 border border-[#1f2933] px-2 py-1 bg-[#0a0e14] text-[10px] text-[#6b7785]">
          <span className="text-[#00d4ff]">{latencyStr}</span>
          <span>::</span>
          <span>PKT #{seqCounter}</span>
        </div>

        {/* PROMINENT OPERATIONAL MODE PILL WITH DROPDOWN */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`flex items-center gap-2 border px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase transition cursor-pointer ${
              currentMode === "LIVE"
                ? "border-[#00ff9c] bg-[#00ff9c]/10 text-[#00ff9c] hover:bg-[#00ff9c]/20"
                : currentMode === "CACHED"
                ? "border-[#ffb800] bg-[#ffb800]/10 text-[#ffb800] hover:bg-[#ffb800]/20"
                : "border-[#a855f7] bg-[#a855f7]/15 text-[#c084fc] hover:bg-[#a855f7]/25"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                currentMode === "LIVE"
                  ? "bg-[#00ff9c] status-dot-green animate-pulse"
                  : currentMode === "CACHED"
                  ? "bg-[#ffb800] status-dot-amber"
                  : "bg-[#a855f7] shadow-[0_0_8px_#a855f7] animate-pulse"
              }`}
            />
            <span>{getPillLabel()}</span>
            <span className="text-[8px] text-[#6b7785]">▼</span>
          </button>

          {/* Mode Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-1 w-52 bg-[#0f141b] border border-[#2d3a4a] shadow-2xl p-1.5 space-y-1 z-50 text-[10px] font-mono">
              <div className="px-2 py-1 text-[9px] text-[#6b7785] border-b border-[#1f2933] font-bold">
                // SELECT OPERATIONAL MODE
              </div>

              <button
                type="button"
                onClick={() => handleModePick("AUTO")}
                className="w-full text-left px-2 py-1.5 text-[#d0d8e0] hover:bg-[#1f2933] flex items-center justify-between cursor-pointer"
              >
                <span>[ ○ AUTO DETECT ]</span>
                <span className="text-[9px] text-[#6b7785]">HEALTH PING</span>
              </button>

              <button
                type="button"
                onClick={() => handleModePick("LIVE")}
                className={`w-full text-left px-2 py-1.5 flex items-center justify-between cursor-pointer ${
                  currentMode === "LIVE"
                    ? "bg-[#00ff9c]/15 text-[#00ff9c] font-bold"
                    : "text-[#d0d8e0] hover:bg-[#1f2933]"
                }`}
              >
                <span>{currentMode === "LIVE" ? "[ ● FORCE LIVE ]" : "[ ○ FORCE LIVE ]"}</span>
                <span className="text-[9px] text-[#00ff9c]">NASA API</span>
              </button>

              <button
                type="button"
                onClick={() => handleModePick("CACHED")}
                className={`w-full text-left px-2 py-1.5 flex items-center justify-between cursor-pointer ${
                  currentMode === "CACHED"
                    ? "bg-[#ffb800]/15 text-[#ffb800] font-bold"
                    : "text-[#d0d8e0] hover:bg-[#1f2933]"
                }`}
              >
                <span>{currentMode === "CACHED" ? "[ ● FORCE CACHED ]" : "[ ○ FORCE CACHED ]"}</span>
                <span className="text-[9px] text-[#ffb800]">SQLITE</span>
              </button>

              <button
                type="button"
                onClick={() => handleModePick("DEMO")}
                className={`w-full text-left px-2 py-1.5 flex items-center justify-between cursor-pointer ${
                  currentMode === "DEMO"
                    ? "bg-[#a855f7]/20 text-[#c084fc] font-bold"
                    : "text-[#d0d8e0] hover:bg-[#1f2933]"
                }`}
              >
                <span>{currentMode === "DEMO" ? "[ ● FORCE DEMO ]" : "[ ○ FORCE DEMO ]"}</span>
                <span className="text-[9px] text-[#c084fc]">250 FIRES</span>
              </button>

              <div className="pt-1 border-t border-[#1f2933] px-2 text-[8px] text-[#6b7785] lowercase truncate">
                {modeInfo?.reason || "Operational status verified"}
              </div>
            </div>
          )}
        </div>

        {/* Live UTC Clock */}
        <div className="hidden lg:flex items-center gap-1.5 border border-[#1f2933] px-2 py-1 bg-[#0a0e14] text-[10px] text-[#d0d8e0] tabular-nums">
          <span className="text-[#6b7785]">UTC</span>
          <span>{utcClock || "SYNCING..."}</span>
        </div>

        {/* Info Modal Button */}
        <button
          onClick={onOpenAbout}
          className="border border-[#1f2933] bg-[#0a0e14] text-[#6b7785] hover:text-[#d0d8e0] hover:border-[#00d4ff] px-2 py-1 text-[10px] font-bold transition cursor-pointer"
        >
          [?]
        </button>
      </div>
    </header>
  );
}
