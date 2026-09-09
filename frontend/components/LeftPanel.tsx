"use client";

import React, { useState, useMemo } from "react";
import { ALL_FACILITIES, IndustrialFacility } from "@/components/IndustrialRegistry";
import type { AlertItem } from "@/components/AlertPanel";
import InfoTooltip from "@/components/InfoTooltip";

interface LeftPanelProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  selectedFacilityId: string | null;
  onSelectFacility: (fac: IndustrialFacility) => void;
  alerts: AlertItem[];
  onSelectCoordinates: (lat: number, lon: number) => void;
  onOpenDispatchModal?: (fireCoords?: [number, number]) => void;
  onOpenEmergencyPanel?: () => void;
}

export default function LeftPanel({
  isCollapsed,
  onToggleCollapse,
  selectedFacilityId,
  onSelectFacility,
  alerts = [],
  onSelectCoordinates,
  onOpenDispatchModal,
  onOpenEmergencyPanel,
}: LeftPanelProps) {
  const [activeTab, setActiveTab] = useState<"industries" | "alerts">("industries");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFacilities = useMemo(() => {
    if (!searchQuery.trim()) return ALL_FACILITIES;
    const q = searchQuery.toLowerCase();
    return ALL_FACILITIES.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.type.toLowerCase().includes(q) ||
        (f.sector && f.sector.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const criticalAlerts = useMemo(() => {
    return alerts.filter(
      (a) =>
        a.severity === "CRITICAL" ||
        a.severity === "HIGH" ||
        a.alert_type?.includes("EMERGENCY") ||
        a.message?.toLowerCase().includes("critical")
    );
  }, [alerts]);

  if (isCollapsed) {
    return (
      <div className="hidden lg:flex flex-col items-center justify-start py-4 w-10 bg-[#111827] border-r border-[#1F2937] h-full z-20">
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg bg-[#0B1220] hover:bg-[#1F2937] text-[#22D3EE] border border-[#1F2937] text-xs font-bold transition"
          title="Expand Left Panel"
        >
          ▶
        </button>
        <span className="[writing-mode:vertical-lr] rotate-180 text-[11px] text-[#9CA3AF] mt-6 tracking-widest uppercase font-semibold">
          Industries & Alerts
        </span>
      </div>
    );
  }

  return (
    <aside className="w-full lg:w-[280px] flex flex-col bg-[#111827] border-b lg:border-b-0 lg:border-r border-[#1F2937] h-full z-20 font-sans text-xs select-none">
      {/* Tab Switcher & Collapse Toggle */}
      <div className="flex items-center justify-between p-2.5 border-b border-[#1F2937] bg-[#0B1220]">
        <div className="flex items-center gap-1 bg-[#111827] p-1 rounded-lg border border-[#1F2937]">
          <button
            onClick={() => setActiveTab("industries")}
            className={`px-3 py-1 rounded-md font-semibold text-xs transition ${
              activeTab === "industries"
                ? "bg-[#1F2937] text-[#22D3EE] shadow-sm"
                : "text-[#9CA3AF] hover:text-white"
            }`}
          >
            Industries
          </button>
          <button
            onClick={() => setActiveTab("alerts")}
            className={`px-3 py-1 rounded-md font-semibold text-xs transition flex items-center gap-1.5 ${
              activeTab === "alerts"
                ? "bg-[#1F2937] text-red-400 shadow-sm"
                : "text-[#9CA3AF] hover:text-white"
            }`}
          >
            <span>Alerts</span>
            {criticalAlerts.length > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            )}
          </button>
        </div>

        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex p-1.5 rounded-lg hover:bg-[#1F2937] text-[#9CA3AF] hover:text-white transition text-xs font-bold"
          title="Collapse Panel"
        >
          ◀
        </button>
      </div>

      {/* TAB 1: INDUSTRIES */}
      {activeTab === "industries" && (
        <div className="flex-1 flex flex-col overflow-hidden p-3 space-y-2.5">
          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search plant, refinery, steel..."
              className="w-full bg-[#0B1220] border border-[#1F2937] rounded-lg px-3 py-2 text-xs text-[#E5E7EB] placeholder-[#9CA3AF] focus:outline-none focus:border-[#22D3EE]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2 text-[#9CA3AF] hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#9CA3AF] px-1 font-medium">
            <div className="flex items-center gap-1.5">
              <span>High-Risk Facilities</span>
              <InfoTooltip
                title="Industrial Registry"
                text="Geospatial registry of 500+ refineries, chemical corridors, and metallurgical facilities monitored across India."
                position="right"
              />
            </div>
            <span className="font-mono">{filteredFacilities.length} sites</span>
          </div>

          {/* Clean Facility List */}
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
            {filteredFacilities.map((fac) => {
              const isSelected = selectedFacilityId === fac.id;
              return (
                <button
                  key={fac.id}
                  onClick={() => onSelectFacility(fac)}
                  className={`w-full text-left p-2 rounded-lg border transition flex flex-col gap-1 ${
                    isSelected
                      ? "bg-[#1F2937] border-[#22D3EE] text-white shadow-sm"
                      : "bg-[#0B1220]/60 border-transparent hover:border-[#1F2937] hover:bg-[#0B1220] text-[#E5E7EB]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="font-semibold text-xs truncate">
                      {fac.name}
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${
                        fac.type === "REFINERY"
                          ? "bg-red-950 text-red-300 border border-red-500/40"
                          : fac.type === "CHEM"
                          ? "bg-amber-950 text-amber-300 border border-amber-500/40"
                          : "bg-blue-950 text-blue-300 border border-blue-500/40"
                      }`}
                    >
                      {fac.type}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-[#9CA3AF] font-mono">
                    <span>Sector {fac.sector || "IND"}</span>
                    <span>
                      {fac.latitude.toFixed(2)}°N, {fac.longitude.toFixed(2)}°E
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: CRITICAL ALERTS */}
      {activeTab === "alerts" && (
        <div className="flex-1 flex flex-col overflow-hidden p-3 space-y-2.5">
          <div className="flex items-center justify-between text-[11px] text-[#9CA3AF] px-1 font-medium">
            <div className="flex items-center gap-1.5">
              <span>Critical Threat Queue</span>
              <InfoTooltip
                title="Tactical Alerts"
                text="Real-time alert stream raised when thermal anomalies breach industrial safety buffers or exhibit rapid growth."
                position="right"
              />
            </div>
            <span className="font-mono text-red-400 font-bold">
              {criticalAlerts.length} Active
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {criticalAlerts.length === 0 ? (
              <div className="p-6 text-center text-[#9CA3AF] bg-[#0B1220]/40 rounded-xl border border-[#1F2937] space-y-1">
                <span className="text-xl block">✓</span>
                <span className="font-semibold text-white text-xs block">
                  No Critical Threats
                </span>
                <span className="text-[11px]">All sectors nominal</span>
              </div>
            ) : (
              criticalAlerts.map((alt, i) => (
                <div
                  key={alt.id ?? i}
                  className="bg-[#0B1220] border border-red-500/30 p-2.5 rounded-lg space-y-2 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold bg-red-950 text-red-400 px-1.5 py-0.5 rounded border border-red-500/50">
                      {alt.severity || "CRITICAL"}
                    </span>
                    <span className="text-[10px] text-[#9CA3AF] font-mono">
                      {alt.timestamp ? alt.timestamp.slice(11, 16) : "Just Now"}
                    </span>
                  </div>

                  <p className="text-xs text-[#E5E7EB] font-medium line-clamp-2">
                    {alt.message}
                  </p>

                  <div className="flex items-center justify-between gap-1.5 pt-1 border-t border-[#1F2937]">
                    <button
                      onClick={() =>
                        alt.latitude &&
                        alt.longitude &&
                        onSelectCoordinates(alt.latitude, alt.longitude)
                      }
                      className="text-[11px] text-[#22D3EE] hover:underline font-medium"
                    >
                      📍 Focus Map
                    </button>
                    {onOpenDispatchModal && (
                      <button
                        onClick={() =>
                          onOpenDispatchModal(
                            alt.latitude && alt.longitude
                              ? [alt.latitude, alt.longitude]
                              : undefined
                          )
                        }
                        className="px-2 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-[10px] font-bold transition shadow-sm"
                      >
                        🚨 Dispatch
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {onOpenEmergencyPanel && (
            <button
              onClick={onOpenEmergencyPanel}
              className="w-full py-2 bg-red-950/60 hover:bg-red-900/60 border border-red-500/50 text-red-300 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>Full Emergency Console</span>
            </button>
          )}
        </div>
      )}
    </aside>
  );
}
