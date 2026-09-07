"use client";

import { useState, useEffect } from "react";
import type { Fire } from "./FireMap";
import type { FireStation } from "@/data/fireStations";
import { getResponseProtocol } from "@/data/fireResponse";

interface DispatchSimulatorProps {
  fire: Fire | null;
  station: FireStation | null;
  isOpen: boolean;
  onClose: () => void;
  onDispatchComplete?: (record: any) => void;
}

export default function DispatchSimulator({
  fire,
  station,
  isOpen,
  onClose,
  onDispatchComplete,
}: DispatchSimulatorProps) {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [dispatchId, setDispatchId] = useState<string>("");
  const [completed, setCompleted] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const protocol = getResponseProtocol(fire?.category || "UNKNOWN");
  const stationName = station?.name || "Local Municipal Fire Brigade";
  const stationDist = (fire as any)?.station_distance_km ?? 2.4;
  const stationEta = (fire as any)?.station_eta_minutes ?? 6;

  const STEPS = [
    { title: "LOCATING NEAREST FIRE STATION", detail: `Querying 589 spatial nodes across India catalog...` },
    { title: `FIRE STATION IDENTIFIED: ${stationName.toUpperCase()}`, detail: `Proximity: ${stationDist} km | Node Lat/Lon: ${station?.lat?.toFixed(3) || "21.192"}°N, ${station?.lon?.toFixed(3) || "72.825"}°E` },
    { title: "CALCULATING OPTIMAL ROUTE", detail: `Traffic corridor analysis via State Disaster Management grid...` },
    { title: `ETA CALCULATED: ${stationEta} MINUTES`, detail: `Priority green-wave corridor requested. Speed: 45 km/h target.` },
    { title: "PREPARING DISPATCH ALERT PAYLOAD", detail: `Equipment: ${protocol.equipment.join(", ")} | Perimeter: ${protocol.safety_distance_m}m` },
    { title: `ALERT TRANSMITTED TO: ${stationName.toUpperCase()}`, detail: `Channel: Encrypted SMS / CAP Protocol / Voice dispatch line: ${station?.phone || "+91-101"}` },
    { title: "ALERT SENT TO DISTRICT COLLECTOR & NDMA", detail: `Recipient: Collectorate Disaster Desk, State Emergency Operations Center (SEOC)` },
    { title: "DISPATCH COMPLETE :: PROTOCOL ACTIVE", detail: `Emergency response unit mobilized. Live telemetry stream locked.` },
  ];

  useEffect(() => {
    if (!isOpen || !fire) {
      setCurrentStep(0);
      setCompleted(false);
      return;
    }

    const newId = `DISPATCH-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    setDispatchId(newId);
    setCurrentStep(0);
    setCompleted(false);

    // Step-by-step progress timer (advances through all 8 steps)
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setCompleted(true);
          if (onDispatchComplete) {
            onDispatchComplete({
              dispatch_id: newId,
              fire,
              station,
              timestamp: new Date().toISOString(),
              status: "DISPATCHED",
            });
          }
          return prev;
        }
      });
    }, 750);

    return () => clearInterval(interval);
  }, [isOpen, fire]);

  if (!isOpen || !fire) return null;

  const progressPercent = Math.round(((currentStep + 1) / STEPS.length) * 100);

  const handleCopyId = () => {
    if (dispatchId) {
      navigator.clipboard.writeText(dispatchId);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[3000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0a0e14] border border-[#00d4ff] max-w-2xl w-full p-4 font-mono text-[#d0d8e0] shadow-[0_0_50px_rgba(0,212,255,0.15)] flex flex-col gap-3">
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-[#1f2933] pb-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ff3b3b] animate-ping" />
            <span className="text-[#ff3b3b] font-bold tracking-widest uppercase">
              :: EMERGENCY DISPATCH SIMULATOR
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-[#00d4ff] border border-[#1f2933] px-2 py-0.5 bg-[#0f141b]">
              ID: {dispatchId}
            </span>
            <button
              onClick={onClose}
              className="text-[#6b7785] hover:text-[#ff3b3b] font-bold text-sm cursor-pointer"
            >
              [X]
            </button>
          </div>
        </div>

        {/* Disclaimer Banner */}
        <div className="p-2 border border-[#ffb800]/40 bg-[#ffb800]/10 text-[#ffb800] text-[11px] flex items-center gap-2">
          <span className="text-base font-bold">⚠️</span>
          <span>
            <strong>SIMULATION MODE:</strong> In live production deployment, this triggers real-time automated SMS via Twilio / C-DoT CAP gateway to the municipal fire station and emergency email to District Collectorate.
          </span>
        </div>

        {/* Incident Summary Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] bg-[#0f141b] border border-[#1f2933] p-2 tabular-nums">
          <div>
            <div className="text-[#6b7785]">COORDINATES</div>
            <div className="text-[#00d4ff] font-bold">
              {fire.latitude.toFixed(4)}°N, {fire.longitude.toFixed(4)}°E
            </div>
          </div>
          <div>
            <div className="text-[#6b7785]">CLASSIFICATION</div>
            <div className="text-[#ff3b3b] font-bold uppercase truncate">
              {fire.category}
            </div>
          </div>
          <div>
            <div className="text-[#6b7785]">FIRE INTENSITY</div>
            <div className="text-[#ffb800] font-bold">
              {Number(fire.frp || 0).toFixed(1)} MW
            </div>
          </div>
          <div>
            <div className="text-[#6b7785]">STATION ETA</div>
            <div className="text-[#00ff9c] font-bold">
              {stationEta} MINUTES ({stationDist}km)
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-[#6b7785]">
            <span>DISPATCH SEQUENCE PROGRESS: STEP {currentStep + 1} OF {STEPS.length}</span>
            <span className="text-[#00d4ff] font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#131a22] border border-[#1f2933] overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                completed ? "bg-[#00ff9c]" : "bg-[#00d4ff]"
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Step-by-Step Workflow Log */}
        <div className="border border-[#1f2933] bg-[#070a0e] p-3 space-y-2 max-h-[220px] overflow-y-auto text-xs">
          {STEPS.map((step, idx) => {
            const isDone = idx < currentStep;
            const isCurrent = idx === currentStep;
            return (
              <div
                key={idx}
                className={`flex items-start gap-2 text-[11px] transition-opacity ${
                  isDone
                    ? "text-[#6b7785] opacity-75"
                    : isCurrent
                    ? "text-[#d0d8e0] font-bold"
                    : "text-[#323d4d] opacity-40"
                }`}
              >
                <span className="shrink-0 mt-0.5">
                  {isDone ? (
                    <span className="text-[#00ff9c] font-bold">[✓]</span>
                  ) : isCurrent ? (
                    <span className="text-[#00d4ff] font-bold animate-pulse">[&gt;]</span>
                  ) : (
                    <span className="text-[#4a5563]">[ ]</span>
                  )}
                </span>
                <div className="flex-1">
                  <div className={isCurrent ? "text-[#00d4ff]" : ""}>{step.title}</div>
                  {(isCurrent || isDone) && (
                    <div className="text-[10px] text-[#6b7785]">{step.detail}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Tactical Footer Actions */}
        <div className="flex items-center justify-between border-t border-[#1f2933] pt-2">
          <div className="text-[10px] text-[#6b7785]">
            STATUS:{" "}
            <span
              className={`font-bold ${
                completed ? "text-[#00ff9c]" : "text-[#00d4ff] animate-pulse"
              }`}
            >
              {completed ? "DISPATCH PACKET CONFIRMED" : "TRANSMITTING TELEMETRY..."}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyId}
              className="border border-[#1f2933] hover:border-[#00d4ff] px-2.5 py-1 text-[10px] text-[#d0d8e0] hover:text-[#00d4ff] transition cursor-pointer"
            >
              {isCopied ? "[ COPIED! ]" : "[ COPY ID ]"}
            </button>
            <button
              onClick={onClose}
              className="border border-[#00d4ff] bg-[#00d4ff]/10 hover:bg-[#00d4ff]/20 px-3 py-1 text-[10px] text-[#00d4ff] font-bold cursor-pointer uppercase transition"
            >
              [ CLOSE MONITOR ]
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
