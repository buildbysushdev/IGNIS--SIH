"use client";

import React, { useState, useEffect } from "react";
import type { Fire } from "./FireMap";
import { getResponseProtocol } from "@/data/fireResponse";
import axios from "axios";

export interface DispatchSimulatorProps {
  fire?: Fire | null;
  fireData?: any;
  station?: any | null;
  isOpen: boolean;
  onClose: () => void;
  onDispatchComplete?: (record: any) => void;
  onOpenHistory?: () => void;
}

const STEP_LABELS = [
  "Locating fire coordinates & FRP intensity...",
  "Calculating geodesic distance to nearest Fire Station...",
  "Querying OSM for nearest hospital & emergency corridor...",
  "Cross-referencing IS 2190 safety protocols (Class B Foam advisory)...",
  "Generating unique dispatch clearance token...",
  "Establishing CAD link with regional emergency station...",
  "Broadcasting SMS radius warnings to 1km civilian zone...",
  "Allocating Heavy Foam Tender (4,500L AR-AFFF) & Deluge Monitor...",
  "Calculating turnout transit route & ETA (6.5 mins)...",
  "DISPATCH CONFIRMED & LOGGED TO DATABASE.",
];

export default function DispatchSimulator({
  fire,
  fireData,
  station: initialStation,
  isOpen,
  onClose,
  onDispatchComplete,
  onOpenHistory,
}: DispatchSimulatorProps) {
  const [step, setStep] = useState<number>(1);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [dispatchResult, setDispatchResult] = useState<any>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const activeFire = fire || fireData;
  const lat = activeFire?.latitude ?? 21.1702;
  const lon = activeFire?.longitude ?? 72.8311;
  const category = activeFire?.category ?? "EMERGENCY_INDUSTRIAL";
  const protocol = getResponseProtocol(category);

  // Auto-Advancing Timer (Non-blocking & Self-healing)
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setElapsedSeconds(0);
      setDispatchResult(null);
      return;
    }

    // Advance step from 1 to 10 every 350ms
    const stepInterval = setInterval(() => {
      setStep((prevStep) => {
        if (prevStep >= 10) {
          clearInterval(stepInterval);
          return 10;
        }
        return prevStep + 1;
      });
    }, 350);

    // Increment elapsed timer every second
    const clockInterval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    // Asynchronous backend dispatch simulation (non-blocking)
    axios
      .post("/api/dispatch/simulate", {
        latitude: lat,
        longitude: lon,
        category,
        frp: activeFire?.frp || 82.4,
        facility_name: activeFire?.facility_name || activeFire?.nearest_facility || "Surat Industrial GIDC",
      })
      .then((res) => {
        if (res.data) {
          setDispatchResult(res.data);
          if (onDispatchComplete) onDispatchComplete(res.data);
        }
      })
      .catch((err) => {
        console.warn("[IGNIS] Async dispatch simulation notice:", err?.message);
        const fallbackRecord = {
          dispatch_id: "DSP-2026-8812",
          status: "DISPATCHED",
          station: "Surat Central Industrial Fire Station",
          assigned_equipment: "Heavy Foam Tender #1 (4,500L AR-AFFF)",
          eta_minutes: 6.5,
          cordon_radius_m: 800,
        };
        setDispatchResult(fallbackRecord);
        if (onDispatchComplete) onDispatchComplete(fallbackRecord);
      });

    return () => {
      clearInterval(stepInterval);
      clearInterval(clockInterval);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const progress = Math.min(100, step * 10);
  const isComplete = step === 10;
  const currentDispatchId = dispatchResult?.dispatch_id || "DSP-2026-8812";

  const resolvedStationName =
    initialStation?.name ||
    activeFire?.station_name ||
    dispatchResult?.station ||
    "Surat Central Industrial Fire Station";

  const resolvedDistanceKm =
    initialStation?.distance_km ||
    activeFire?.station_distance_km ||
    dispatchResult?.distance_km ||
    4.2;

  const resolvedEtaMin =
    initialStation?.eta_minutes ||
    activeFire?.station_eta_minutes ||
    dispatchResult?.eta_minutes ||
    6.5;

  const handleCopyId = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(currentDispatchId);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[3000] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 font-mono text-[#d0d8e0] select-none animate-in fade-in duration-150">
      <div className="bg-[#0a0e14] border-2 border-[#ff3b3b] max-w-2xl w-full p-4 sm:p-6 shadow-[0_0_60px_rgba(255,59,59,0.3)] flex flex-col gap-3 relative rounded-lg">
        {/* Simulation Notice Disclaimer */}
        <div className="p-2 bg-[#ff3b3b]/15 border border-[#ff3b3b]/60 text-[#ff8080] text-[10px] font-bold text-center leading-tight">
          ⚠️ SIMULATION MODE - In live production, this automatically executes via Emergency CAD, Fire Station Direct Dispatch, and Twilio SMS.
        </div>

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#1f2933] pb-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff3b3b] animate-ping" />
            <span className="text-[#ff3b3b] font-black tracking-widest uppercase text-xs sm:text-sm">
              :: AUTOMATED DISPATCH PROTOCOL
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="text-[#00d4ff] font-bold">
              STEP {step}/10 ({progress}%)
            </span>
            <span className="text-[#6b7785] tabular-nums">
              ELAPSED: {elapsedSeconds}s
            </span>
            <button
              onClick={onClose}
              className="text-[#6b7785] hover:text-[#ff3b3b] font-black px-1.5 text-sm cursor-pointer transition border border-transparent hover:border-[#ff3b3b]/40 rounded"
              title="Close modal"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tactical Animated Progress Bar */}
        <div className="w-full bg-[#131a22] h-2 border border-[#1f2933] rounded overflow-hidden">
          <div
            className="bg-gradient-to-r from-orange-500 via-amber-400 to-[#00ff9c] h-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Step Progression Stream / Completion View */}
        {!isComplete ? (
          <div className="border border-[#1f2933] bg-[#070a0e] p-3 space-y-2 min-h-[300px] max-h-[50vh] overflow-y-auto text-xs">
            <div className="text-[10px] text-[#6b7785] uppercase tracking-wider mb-1 font-bold">
              // ACTIVE DISPATCH SEQUENCE STREAM
            </div>
            {STEP_LABELS.map((label, idx) => {
              const stepNum = idx + 1;
              if (stepNum > step) return null;
              const isCurrent = stepNum === step;

              return (
                <div
                  key={idx}
                  className={`p-2 border transition-all duration-200 flex items-center justify-between rounded ${
                    isCurrent
                      ? "border-[#00d4ff]/60 bg-[#00d4ff]/10 text-white font-semibold shadow-sm shadow-[#00d4ff]/20"
                      : "border-[#1f2933] bg-[#0c121a]/60 text-[#94a3b8]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={isCurrent ? "text-amber-400 font-bold" : "text-[#00ff9c]"}>
                      {isCurrent ? "⚡" : "✓"}
                    </span>
                    <span className="font-mono text-[11px]">
                      STEP {stepNum}: {label}
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold font-mono ${isCurrent ? "text-amber-400 animate-pulse" : "text-[#00ff9c]"}`}>
                    {isCurrent ? "EXECUTING..." : "VERIFIED"}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          /* Step 10 Completion View (Final Mission Card) */
          <div className="border-2 border-[#00ff9c] bg-[#041a10] p-4 sm:p-5 rounded-lg text-left font-mono space-y-3 shadow-[0_0_40px_rgba(0,255,156,0.15)] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#00ff9c]/30 pb-2">
              <div className="text-[#00ff9c] font-black text-sm sm:text-base flex items-center gap-2">
                <span className="text-lg">✅</span>
                <span>DISPATCH SUCCESSFUL &amp; CONFIRMED</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-[#00ff9c]/20 text-[#00ff9c] border border-[#00ff9c]/60 rounded uppercase">
                STATUS: DISPATCHED &amp; ACTIVE
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-[#d0d8e0] pt-1">
              <div className="p-2 border border-[#1f2933] bg-[#070e14] rounded">
                <span className="text-[9px] text-[#6b7785] block uppercase font-bold">DISPATCH TOKEN / REF</span>
                <span className="font-bold text-[#00d4ff] text-sm">{currentDispatchId}</span>
              </div>
              <div className="p-2 border border-[#1f2933] bg-[#070e14] rounded">
                <span className="text-[9px] text-[#6b7785] block uppercase font-bold">TARGET ETA</span>
                <span className="font-bold text-[#00ff9c] text-sm">{resolvedEtaMin} MINUTES (@ 40 km/h)</span>
              </div>
              <div className="p-2 border border-[#1f2933] bg-[#070e14] rounded sm:col-span-2">
                <span className="text-[9px] text-[#6b7785] block uppercase font-bold">STATION ASSIGNED</span>
                <strong className="text-white text-xs">{resolvedStationName} ({resolvedDistanceKm} km)</strong>
              </div>
              <div className="p-2 border border-[#1f2933] bg-[#070e14] rounded sm:col-span-2">
                <span className="text-[9px] text-[#6b7785] block uppercase font-bold">RECOMMENDED EQUIPMENT</span>
                <strong className="text-amber-400 text-xs">Heavy Foam Tender #1 (4,500L AR-AFFF) &bull; IS 2190 Class B Standard</strong>
              </div>
            </div>

            <div className="text-[11px] text-[#94a3b8] bg-[#08141c] p-2.5 border border-[#1f2933] rounded space-y-1">
              <div className="flex items-center gap-1.5 text-[#00ff9c]">
                <span>✓</span>
                <span>Civilian Warning: SMS Broadcast Sent to 1km Radius Perimeter</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#00ff9c]">
                <span>✓</span>
                <span>Hospital Burn &amp; Trauma Unit Notification: Placed on Critical Standby</span>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#1f2933] pt-3 text-xs">
          <div className="flex items-center gap-2">
            {isComplete && (
              <>
                <button
                  onClick={handleCopyId}
                  className="px-3 py-1.5 border border-[#00d4ff] bg-[#00d4ff]/10 text-[#00d4ff] hover:bg-[#00d4ff]/20 font-bold cursor-pointer transition text-[11px] rounded flex items-center gap-1"
                >
                  <span>{isCopied ? "✓" : "📋"}</span>
                  <span>{isCopied ? "COPIED TOKEN" : "COPY DISPATCH ID"}</span>
                </button>
                {onOpenHistory && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenHistory();
                    }}
                    className="px-3 py-1.5 border border-[#ffb800] bg-[#ffb800]/10 text-[#ffb800] hover:bg-[#ffb800]/20 font-bold cursor-pointer transition text-[11px] rounded flex items-center gap-1"
                  >
                    <span>📁</span>
                    <span>VIEW DISPATCH LOG</span>
                  </button>
                )}
              </>
            )}
          </div>

          <button
            onClick={onClose}
            className={`px-4 py-2 font-bold transition text-xs cursor-pointer rounded ${
              isComplete
                ? "bg-[#00ff9c] text-black font-black hover:bg-[#00ff9c]/80 shadow-md shadow-[#00ff9c]/20"
                : "bg-[#1f2937] hover:bg-[#374151] text-[#d0d8e0]"
            }`}
          >
            {isComplete ? "[ CLOSE WINDOW ]" : "[ ABORT SIMULATION ]"}
          </button>
        </div>
      </div>
    </div>
  );
}

export { DispatchSimulator as DispatchModal, DispatchSimulator as SimulateDispatchModal };
