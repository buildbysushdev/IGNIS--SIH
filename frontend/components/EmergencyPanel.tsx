"use client";

import { useState, useEffect } from "react";
import type { Fire } from "./FireMap";
import { getResponseProtocol } from "@/data/fireResponse";
import ResponseProtocol from "./ResponseProtocol";

export interface EmergencyNotification {
  id: string;
  fire: Fire;
  status: "ACTIVE" | "ACKNOWLEDGED" | "DISPATCHED" | "ESCALATED" | "FALSE_ALARM";
  timestamp: string;
  nearestStation?: {
    name: string;
    distance_km: number;
    eta_minutes: number;
    phone: string;
  };
}

interface EmergencyPanelProps {
  isOpen: boolean;
  onClose: () => void;
  activeFire: Fire | null;
  onOpenDispatch: (fire: Fire) => void;
  onPanToFire?: (coords: [number, number]) => void;
}

// Web Audio API Synthesizer: Tactical Two-Tone Radar Beep (Zero external MP3 dependencies)
export function playTacticalAlertSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = "sine";
    osc2.type = "triangle";

    // Two-tone military ground station warble: 880Hz -> 1760Hz
    const now = ctx.currentTime;
    osc1.frequency.setValueAtTime(880, now);
    osc1.frequency.exponentialRampToValueAtTime(1760, now + 0.12);
    osc1.frequency.setValueAtTime(880, now + 0.16);
    osc1.frequency.exponentialRampToValueAtTime(1760, now + 0.28);

    osc2.frequency.setValueAtTime(440, now);
    osc2.frequency.exponentialRampToValueAtTime(880, now + 0.28);

    gainNode.gain.setValueAtTime(0.18, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.38);
    osc2.stop(now + 0.38);
  } catch (err) {
    // Graceful silent fallback if user has not interacted with DOM yet
  }
}

export default function EmergencyPanel({
  isOpen,
  onClose,
  activeFire,
  onOpenDispatch,
  onPanToFire,
}: EmergencyPanelProps) {
  const [timeline, setTimeline] = useState<EmergencyNotification[]>([]);
  const [currentIncidentStatus, setCurrentIncidentStatus] = useState<
    "ACTIVE" | "ACKNOWLEDGED" | "DISPATCHED" | "ESCALATED" | "FALSE_ALARM"
  >("ACTIVE");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [activeTab, setActiveTab] = useState<"ACTIVE" | "TIMELINE">("ACTIVE");

  // On new critical fire detected, play synthesized beep and push into local 24h timeline
  useEffect(() => {
    if (activeFire && (activeFire.risk_level === "CRITICAL" || activeFire.category === "EMERGENCY_INDUSTRIAL")) {
      playTacticalAlertSound();
      setCurrentIncidentStatus("ACTIVE");
      setActiveTab("ACTIVE");

      const incidentId = `ALERT-${Date.now().toString().slice(-6)}`;
      const newEntry: EmergencyNotification = {
        id: incidentId,
        fire: activeFire,
        status: "ACTIVE",
        timestamp: new Date().toISOString(),
        nearestStation: {
          name: (activeFire as any).station_name || "Surat Central Fire Station",
          distance_km: (activeFire as any).station_distance_km || 2.3,
          eta_minutes: (activeFire as any).station_eta_minutes || 6,
          phone: "+91-261-2422222",
        },
      };

      setTimeline((prev) => {
        const filtered = prev.filter(
          (item) => item.fire.latitude !== activeFire.latitude && item.fire.longitude !== activeFire.longitude
        );
        return [newEntry, ...filtered];
      });
    }
  }, [activeFire]);

  if (!isOpen) return null;

  const protocol = getResponseProtocol(activeFire?.category || "EMERGENCY_INDUSTRIAL");
  const nearestStationName = (activeFire as any)?.station_name || "Surat Central Fire Station";
  const stationDist = (activeFire as any)?.station_distance_km ?? 2.3;
  const stationEta = (activeFire as any)?.station_eta_minutes ?? 6;

  const handleAction = (status: "ACKNOWLEDGED" | "DISPATCHED" | "ESCALATED" | "FALSE_ALARM") => {
    setCurrentIncidentStatus(status);
    if (activeFire) {
      setTimeline((prev) =>
        prev.map((t) =>
          t.fire.latitude === activeFire.latitude && t.fire.longitude === activeFire.longitude
            ? { ...t, status }
            : t
        )
      );
    }
    if (status === "DISPATCHED" && activeFire) {
      onOpenDispatch(activeFire);
    }
  };

  const handleExportReport = () => {
    const rows = [
      ["alert_id", "timestamp", "latitude", "longitude", "category", "frp", "status", "nearest_station"],
      ...timeline.map((t) => [
        t.id,
        t.timestamp,
        t.fire.latitude,
        t.fire.longitude,
        t.fire.category,
        t.fire.frp,
        t.status,
        `"${t.nearestStation?.name || 'Local Unit'}"`
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `IGNIS_CRITICAL_TIMELINE_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredTimeline =
    filterStatus === "ALL"
      ? timeline
      : timeline.filter((t) => t.status === filterStatus);

  return (
    <div className="fixed top-0 right-0 h-full w-[440px] max-w-[95vw] bg-[#0a0e14] border-l-2 border-[#ff3b3b] z-[2500] font-mono text-[#d0d8e0] shadow-[-20px_0_40px_rgba(0,0,0,0.8)] flex flex-col transition-all duration-300">
      {/* 1) Top Alert Banner */}
      <div className="p-3 bg-[#130708] border-b border-[#ff3b3b]/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff3b3b] animate-ping" />
          <span className="text-xs font-black tracking-widest text-[#ff3b3b] uppercase">
            :: CRITICAL EMERGENCY PANEL
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] px-1.5 py-0.5 border border-[#ff3b3b] text-[#ff3b3b] font-bold">
            STATUS: {currentIncidentStatus}
          </span>
          <button
            onClick={onClose}
            className="text-[#6b7785] hover:text-[#ff3b3b] font-bold text-sm px-1 cursor-pointer"
          >
            [X]
          </button>
        </div>
      </div>

      {/* 2) Panel Tab Toggle */}
      <div className="flex border-b border-[#1f2933] bg-[#070a0e] text-[10px] uppercase font-bold">
        <button
          onClick={() => setActiveTab("ACTIVE")}
          className={`flex-1 py-2 text-center cursor-pointer transition ${
            activeTab === "ACTIVE"
              ? "text-[#ff3b3b] border-b-2 border-[#ff3b3b] bg-[#ff3b3b]/10"
              : "text-[#6b7785] hover:text-[#d0d8e0]"
          }`}
        >
          [ ACTIVE INCIDENT ]
        </button>
        <button
          onClick={() => setActiveTab("TIMELINE")}
          className={`flex-1 py-2 text-center cursor-pointer transition ${
            activeTab === "TIMELINE"
              ? "text-[#00d4ff] border-b-2 border-[#00d4ff] bg-[#00d4ff]/10"
              : "text-[#6b7785] hover:text-[#d0d8e0]"
          }`}
        >
          [ 24H TIMELINE ({timeline.length}) ]
        </button>
      </div>

      {/* 3) Tab Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {activeTab === "ACTIVE" ? (
          activeFire ? (
            <>
              {/* Incident Header Box */}
              <div className="border border-[#ff3b3b] bg-[#ff3b3b]/10 p-2.5 space-y-1">
                <div className="text-[10px] text-[#ff3b3b] font-bold tracking-widest flex justify-between">
                  <span>// CRITICAL THERMAL EVENT DETECTED</span>
                  <span>FRP: {Number(activeFire.frp || 0).toFixed(1)} MW</span>
                </div>
                <div className="text-sm font-black text-white">
                  {activeFire.facility_name || activeFire.nearest_facility || "High Risk Thermal Hotspot"}
                </div>
                <div className="text-[11px] text-[#d0d8e0] tabular-nums flex items-center justify-between">
                  <span>
                    LAT: {activeFire.latitude.toFixed(4)}°N, LON: {activeFire.longitude.toFixed(4)}°E
                  </span>
                  {onPanToFire && (
                    <button
                      onClick={() => onPanToFire([activeFire.latitude, activeFire.longitude])}
                      className="text-[9px] border border-[#00d4ff] text-[#00d4ff] px-1.5 py-0.5 hover:bg-[#00d4ff]/20 font-bold"
                    >
                      [ LOCATE MAP ]
                    </button>
                  )}
                </div>
              </div>

              {/* Nearest Fire Station Card */}
              <div className="border border-[#1f2933] bg-[#0f141b] p-2.5 space-y-1.5">
                <div className="text-[10px] text-[#00d4ff] font-bold tracking-wider flex justify-between">
                  <span>// NEAREST EMERGENCY RESPONSE UNIT</span>
                  <span className="text-[#00ff9c]">ETA: {stationEta} MIN</span>
                </div>
                <div className="text-xs font-bold text-white flex justify-between items-center">
                  <span>{nearestStationName}</span>
                  <span className="text-[10px] text-[#6b7785]">{stationDist} km</span>
                </div>
                <div className="text-[10px] text-[#6b7785] flex justify-between">
                  <span>DISPATCH PHONE:</span>
                  <span className="text-[#00d4ff] font-bold">+91-261-2422222</span>
                </div>
              </div>

              {/* Material Response Protocol */}
              <ResponseProtocol category={activeFire.category} compact={false} />

              {/* Tactical Action Triggers */}
              <div className="border-t border-[#1f2933] pt-2 space-y-2">
                <div className="text-[10px] text-[#6b7785] font-bold uppercase tracking-wider">
                  // INCIDENT COMMAND ACTIONS
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-bold uppercase">
                  <button
                    onClick={() => handleAction("ACKNOWLEDGED")}
                    className={`py-2 px-2 border cursor-pointer transition ${
                      currentIncidentStatus === "ACKNOWLEDGED"
                        ? "bg-[#00ff9c]/20 border-[#00ff9c] text-[#00ff9c]"
                        : "border-[#1f2933] text-[#d0d8e0] hover:border-[#00ff9c]"
                    }`}
                  >
                    [ ACKNOWLEDGE ]
                  </button>
                  <button
                    onClick={() => handleAction("DISPATCHED")}
                    className="py-2 px-2 border border-[#00d4ff] bg-[#00d4ff]/20 text-[#00d4ff] hover:bg-[#00d4ff]/30 cursor-pointer transition"
                  >
                    [ DISPATCH SIMULATION ]
                  </button>
                  <button
                    onClick={() => handleAction("ESCALATED")}
                    className={`py-2 px-2 border cursor-pointer transition ${
                      currentIncidentStatus === "ESCALATED"
                        ? "bg-[#ff3b3b]/20 border-[#ff3b3b] text-[#ff3b3b]"
                        : "border-[#1f2933] text-[#ff8080] hover:border-[#ff3b3b]"
                    }`}
                  >
                    [ ESCALATE (NDMA) ]
                  </button>
                  <button
                    onClick={() => handleAction("FALSE_ALARM")}
                    className={`py-2 px-2 border cursor-pointer transition ${
                      currentIncidentStatus === "FALSE_ALARM"
                        ? "bg-[#4a5563]/20 border-[#6b7785] text-[#6b7785]"
                        : "border-[#1f2933] text-[#6b7785] hover:border-[#d0d8e0]"
                    }`}
                  >
                    [ FALSE ALARM ]
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-[#6b7785] text-xs space-y-2">
              <div className="text-[#00ff9c] text-lg font-bold">[ OK ]</div>
              <div>NO CRITICAL ANOMALY SELECTED</div>
              <div className="text-[10px] text-[#4a5563]">
                Click any fire marker on map or run scenario playback
              </div>
            </div>
          )
        ) : (
          /* Timeline View */
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] border-b border-[#1f2933] pb-1.5">
              <div className="flex items-center gap-1">
                <span className="text-[#6b7785]">FILTER:</span>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-[#0f141b] border border-[#1f2933] text-[#00d4ff] px-1 py-0.5"
                >
                  <option value="ALL">ALL ({timeline.length})</option>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="DISPATCHED">DISPATCHED</option>
                  <option value="ACKNOWLEDGED">ACKNOWLEDGED</option>
                  <option value="ESCALATED">ESCALATED</option>
                </select>
              </div>
              <button
                onClick={handleExportReport}
                className="text-[9px] border border-[#ffb800] text-[#ffb800] px-1.5 py-0.5 hover:bg-[#ffb800]/10 font-bold"
              >
                [ EXPORT CSV ]
              </button>
            </div>

            {filteredTimeline.length === 0 ? (
              <div className="py-8 text-center text-[#6b7785] text-xs">
                No incidents in 24h log matching filter
              </div>
            ) : (
              <div className="space-y-2">
                {filteredTimeline.map((item) => (
                  <div
                    key={item.id}
                    className="border border-[#1f2933] bg-[#070a0e] p-2 text-[11px] space-y-1 hover:border-[#00d4ff] transition cursor-pointer"
                    onClick={() => {
                      if (onPanToFire) onPanToFire([item.fire.latitude, item.fire.longitude]);
                    }}
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-[#00d4ff] font-bold">{item.id}</span>
                      <span
                        className={`px-1 py-0.2 border text-[9px] font-bold ${
                          item.status === "ACTIVE"
                            ? "border-[#ff3b3b] text-[#ff3b3b]"
                            : item.status === "DISPATCHED"
                            ? "border-[#00ff9c] text-[#00ff9c]"
                            : "border-[#ffb800] text-[#ffb800]"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <div className="text-white font-bold text-xs truncate">
                      {item.fire.facility_name || item.fire.nearest_facility || item.fire.category}
                    </div>
                    <div className="flex justify-between text-[10px] text-[#6b7785] tabular-nums">
                      <span>FRP: {Number(item.fire.frp || 0).toFixed(1)} MW</span>
                      <span>{item.timestamp.slice(11, 19)} UTC</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4) Bottom Footer */}
      <div className="p-2 border-t border-[#1f2933] bg-[#070a0e] flex items-center justify-between text-[10px] text-[#6b7785]">
        <span>AUDIO ALERT: ENABLED</span>
        <button
          onClick={playTacticalAlertSound}
          className="text-[#00d4ff] hover:underline cursor-pointer"
        >
          [ TEST SOUND ]
        </button>
      </div>
    </div>
  );
}
