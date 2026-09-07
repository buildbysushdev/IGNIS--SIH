"use client";

import { useState, useEffect, useRef } from "react";
import type { Fire } from "./FireMap";
import { getResponseProtocol } from "@/data/fireResponse";
import axios from "axios";

interface DispatchSimulatorProps {
  fire: Fire | null;
  station?: any | null;
  isOpen: boolean;
  onClose: () => void;
  onDispatchComplete?: (record: any) => void;
  onOpenHistory?: () => void;
}

export default function DispatchSimulator({
  fire,
  station: initialStation,
  isOpen,
  onClose,
  onDispatchComplete,
  onOpenHistory,
}: DispatchSimulatorProps) {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [typedSms, setTypedSms] = useState<string>("");
  const [stationInfo, setStationInfo] = useState<any>(null);
  const [hospitalInfo, setHospitalInfo] = useState<any>(null);
  const [dispatchResult, setDispatchResult] = useState<any>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const clockTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef<boolean>(false);

  const lat = fire?.latitude ?? 21.1702;
  const lon = fire?.longitude ?? 72.8311;
  const category = fire?.category ?? "EMERGENCY_INDUSTRIAL";
  const protocol = getResponseProtocol(category);

  const fullSmsText = `URGENT: Fire alert at ${lat.toFixed(2)},${lon.toFixed(2)}. ${protocol.fire_class || "Class B/C"} fire. Foam units required. ETA target 6 min. Reply DEPLOYED to confirm.`;

  // Fetch nearest fire station and hospital data on open
  useEffect(() => {
    if (!isOpen || !fire) return;

    let isMounted = true;

    // Fetch station
    axios
      .get(`/api/fire-stations/nearest?lat=${lat}&lon=${lon}`)
      .then((res) => {
        if (isMounted) setStationInfo(res.data);
      })
      .catch(() => {
        if (isMounted) {
          setStationInfo({
            name: (fire as any).station_name || "Surat Central Fire Station HQ",
            distance_km: (fire as any).station_distance_km || 2.54,
            eta_minutes: (fire as any).station_eta_minutes || 6,
            contact: {
              phone: "+91-261-2422222 (simulated)",
              email: "control@surat-fire.gov.in (simulated)",
              radio: "CHANNEL-14",
            },
            capabilities: ["Water tender", "Foam unit", "Rescue"],
          });
        }
      });

    // Fetch hospital
    axios
      .get(`/api/hospitals/nearest?lat=${lat}&lon=${lon}`)
      .then((res) => {
        if (isMounted) setHospitalInfo(res.data);
      })
      .catch(() => {
        if (isMounted) {
          setHospitalInfo({
            name: "New Civil Hospital & Trauma Center Surat",
            distance_km: 1.91,
            eta_minutes: 5,
            trauma_center: true,
            capacity: { total_beds: 1250, burn_unit_beds: 50, icu_beds: 110 },
            readiness: "CRITICAL_STANDBY",
          });
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, fire, lat, lon]);

  // Step Progression Timer (10 Steps, ~1.15s each = ~11.5s total)
  useEffect(() => {
    if (!isOpen || !fire) {
      setCurrentStep(0);
      setTypedSms("");
      setDispatchResult(null);
      setElapsedSeconds(0);
      return;
    }

    setCurrentStep(1);
    setTypedSms("");
    setDispatchResult(null);
    setElapsedSeconds(0);

    clockTimerRef.current = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);

    const stepIntervals = [
      1100, // Step 1 -> 2
      1200, // Step 2 -> 3
      1100, // Step 3 -> 4
      1000, // Step 4 -> 5
      1600, // Step 5 (SMS typing) -> 6
      1200, // Step 6 -> 7
      1000, // Step 7 -> 8
      1100, // Step 8 -> 9
      1200, // Step 9 -> 10 (Dispatch complete)
    ];

    let current = 1;

    const executeNextStep = () => {
      if (current < 10) {
        current += 1;
        setCurrentStep(current);

        // At step 9, trigger backend simulation API call
        if (current === 9) {
          axios
            .post("/api/dispatch/simulate", {
              latitude: lat,
              longitude: lon,
              category,
              frp: fire.frp,
              facility_name: fire.facility_name || fire.nearest_facility,
            })
            .then((res) => {
              setDispatchResult(res.data);
              if (onDispatchComplete) onDispatchComplete(res.data);
            })
            .catch((err) => {
              console.warn("[IGNIS] Dispatch API call fallback:", err);
              const fallbackId = `DSP-${new Date().toISOString().slice(0, 10)}-${Math.floor(100 + Math.random() * 900)}`;
              const rec = {
                dispatch_id: fallbackId,
                status: "DISPATCHED",
                estimated_response: { first_responder_eta_min: 6, full_deployment_eta_min: 13 },
              };
              setDispatchResult(rec);
              if (onDispatchComplete) onDispatchComplete(rec);
            });
        }

        if (current < 10) {
          timerRef.current = setTimeout(executeNextStep, stepIntervals[current - 1] || 1100);
        }
      }
    };

    timerRef.current = setTimeout(executeNextStep, stepIntervals[0]);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (clockTimerRef.current) clearInterval(clockTimerRef.current);
    };
  }, [isOpen, fire, lat, lon, category, onDispatchComplete]);

  // Typing effect during Step 5 (Sending SMS)
  useEffect(() => {
    if (currentStep >= 5 && typedSms.length < fullSmsText.length && !isTypingRef.current) {
      isTypingRef.current = true;
      let charIdx = 0;
      const typeInterval = setInterval(() => {
        charIdx += 3;
        if (charIdx >= fullSmsText.length) {
          setTypedSms(fullSmsText);
          clearInterval(typeInterval);
          isTypingRef.current = false;
        } else {
          setTypedSms(fullSmsText.slice(0, charIdx));
        }
      }, 30);
      return () => clearInterval(typeInterval);
    }
  }, [currentStep, typedSms, fullSmsText]);

  if (!isOpen || !fire) return null;

  const resolvedStation =
    stationInfo ||
    initialStation || {
      name: "Surat Central Fire Station HQ",
      distance_km: 2.54,
      eta_minutes: 6,
      phone: "+91-261-2422222",
      radio: "CHANNEL-14",
    };

  const resolvedHospital =
    hospitalInfo || {
      name: "New Civil Hospital & Trauma Center Surat",
      distance_km: 1.91,
      eta_minutes: 5,
      phone: "+91-261-2244175",
    };

  const currentDispatchId = dispatchResult?.dispatch_id || "DSP-2026-09-07-337";
  const progressPercent = Math.min(100, Math.round((currentStep / 10) * 100));

  const handleCopy = () => {
    navigator.clipboard.writeText(currentDispatchId);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[3000] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 font-mono text-[#d0d8e0] select-none">
      <div className="bg-[#0a0e14] border-2 border-[#ff3b3b] max-w-2xl w-full p-4 shadow-[0_0_60px_rgba(255,59,59,0.25)] flex flex-col gap-3 relative">
        {/* Prominent Mandatory Simulation Disclaimer */}
        <div className="p-2 bg-[#ff3b3b]/15 border border-[#ff3b3b] text-[#ff8080] text-[10px] font-bold text-center leading-tight">
          ⚠️ SIMULATION MODE - In production deployment, this would send real notifications via Twilio SMS, SendGrid Email, and government communication systems.
        </div>

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#1f2933] pb-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff3b3b] animate-ping" />
            <span className="text-[#ff3b3b] font-black tracking-widest uppercase">
              :: AUTOMATED DISPATCH PROTOCOL
            </span>
          </div>
          <div className="flex items-center gap-3 text-[10px]">
            <span className="text-[#00d4ff] font-bold">
              STEP {currentStep}/10 ({progressPercent}%)
            </span>
            <span className="text-[#6b7785] tabular-nums">
              ELAPSED: {elapsedSeconds}s
            </span>
            <button
              onClick={onClose}
              className="text-[#6b7785] hover:text-[#ff3b3b] font-black px-1 text-sm cursor-pointer transition"
            >
              [✕]
            </button>
          </div>
        </div>

        {/* Tactical Progress Bar */}
        <div className="w-full bg-[#131a22] h-1.5 border border-[#1f2933]">
          <div
            className="bg-gradient-to-r from-[#ff3b3b] via-[#ffb800] to-[#00ff9c] h-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Workflow Stream Steps Box */}
        <div className="border border-[#1f2933] bg-[#070a0e] p-3 space-y-2.5 min-h-[310px] max-h-[50vh] overflow-y-auto text-xs">
          {/* STEP 1: Locating Fire */}
          <div
            className={`p-2 border transition-all duration-300 ${
              currentStep >= 1
                ? "border-[#00d4ff]/40 bg-[#00d4ff]/5 text-white"
                : "border-[#1f2933] opacity-30 text-[#6b7785]"
            }`}
          >
            <div className="flex items-center justify-between font-bold">
              <span className="text-[#00d4ff]">🎯 STEP 1: Locating fire...</span>
              {currentStep > 1 && <span className="text-[#00ff9c] text-[10px]">✓ VERIFIED</span>}
            </div>
            {currentStep >= 1 && (
              <div className="mt-1 text-[11px] text-[#a0aec0] flex flex-wrap justify-between gap-2">
                <span>
                  COORDS: <strong className="text-[#00d4ff]">{lat.toFixed(4)}°N, {lon.toFixed(4)}°E</strong>
                </span>
                <span>
                  CATEGORY: <strong className="text-[#ff3b3b]">{category}</strong>
                </span>
                <span>
                  FRP: <strong className="text-[#ff8000]">{Number(fire.frp || 145).toFixed(1)} MW</strong>
                </span>
              </div>
            )}
          </div>

          {/* STEP 2: Finding Nearest Fire Station */}
          <div
            className={`p-2 border transition-all duration-300 ${
              currentStep >= 2
                ? "border-[#00ff9c]/40 bg-[#00ff9c]/5 text-white"
                : "border-[#1f2933] opacity-30 text-[#6b7785]"
            }`}
          >
            <div className="flex items-center justify-between font-bold">
              <span className="text-[#00ff9c]">📍 STEP 2: Finding nearest fire station...</span>
              {currentStep > 2 && <span className="text-[#00ff9c] text-[10px]">✓ LOCATED</span>}
            </div>
            {currentStep >= 2 && (
              <div className="mt-1 text-[11px] text-[#a0aec0] flex justify-between items-center">
                <div>
                  PRIMARY: <strong className="text-white">{resolvedStation.name}</strong>,{" "}
                  <span className="text-[#00d4ff] font-bold">{resolvedStation.distance_km}km away</span>
                </div>
                <div className="text-[10px] text-[#ffb800] font-bold">
                  EST. ETA: {resolvedStation.eta_minutes} MIN (@ 40 km/h)
                </div>
              </div>
            )}
          </div>

          {/* STEP 3: Finding Nearest Hospital */}
          <div
            className={`p-2 border transition-all duration-300 ${
              currentStep >= 3
                ? "border-[#ff00ea]/40 bg-[#ff00ea]/5 text-white"
                : "border-[#1f2933] opacity-30 text-[#6b7785]"
            }`}
          >
            <div className="flex items-center justify-between font-bold">
              <span className="text-[#ff00ea]">🏥 STEP 3: Finding nearest hospital...</span>
              {currentStep > 3 && <span className="text-[#00ff9c] text-[10px]">✓ DESIGNATED</span>}
            </div>
            {currentStep >= 3 && (
              <div className="mt-1 text-[11px] text-[#a0aec0] flex justify-between items-center">
                <div>
                  MEDICAL: <strong className="text-white">{resolvedHospital.name}</strong>,{" "}
                  <span className="text-[#00d4ff] font-bold">{resolvedHospital.distance_km}km away</span>
                </div>
                <div className="text-[10px] text-[#ff00ea] font-bold">
                  TRAUMA CENTER: READY
                </div>
              </div>
            )}
          </div>

          {/* STEP 4: Preparing Notifications (4 Channels) */}
          <div
            className={`p-2 border transition-all duration-300 ${
              currentStep >= 4
                ? "border-[#ffb800]/40 bg-[#ffb800]/5 text-white"
                : "border-[#1f2933] opacity-30 text-[#6b7785]"
            }`}
          >
            <div className="flex items-center justify-between font-bold">
              <span className="text-[#ffb800]">📡 STEP 4: Preparing notifications...</span>
              {currentStep > 4 && <span className="text-[#00ff9c] text-[10px]">✓ 4 CHANNELS READY</span>}
            </div>
            {currentStep >= 4 && (
              <div className="mt-1.5 grid grid-cols-4 gap-1 text-[10px] text-center font-bold">
                <span className="p-1 border border-[#00d4ff]/40 bg-[#00d4ff]/10 text-[#00d4ff]">📱 SMS</span>
                <span className="p-1 border border-[#00ff9c]/40 bg-[#00ff9c]/10 text-[#00ff9c]">📧 EMAIL</span>
                <span className="p-1 border border-[#ff00ea]/40 bg-[#ff00ea]/10 text-[#ff00ea]">📻 RADIO</span>
                <span className="p-1 border border-[#25d366]/40 bg-[#25d366]/10 text-[#25d366]">💬 WHATSAPP</span>
              </div>
            )}
          </div>

          {/* STEP 5: Sending SMS with Typewriter effect */}
          {currentStep >= 5 && (
            <div className="p-2 border border-[#00d4ff] bg-[#0c1520] space-y-1 animate-fade-in">
              <div className="flex items-center justify-between font-bold text-[#00d4ff]">
                <span>📱 STEP 5: Sending SMS...</span>
                {currentStep > 5 ? (
                  <span className="text-[#00ff9c] text-[10px]">✓ SENT</span>
                ) : (
                  <span className="text-[#ffb800] text-[10px] animate-pulse">TRANSMITTING...</span>
                )}
              </div>
              <div className="p-2 bg-[#05090f] border border-[#1f2933] font-mono text-[11px] text-[#00ff9c] leading-relaxed">
                &gt; {typedSms}
                {currentStep === 5 && <span className="animate-ping font-bold">|</span>}
              </div>
              <div className="space-y-0.5 text-[10px] text-[#a0aec0] pt-1">
                <div className="flex items-center gap-1.5 text-[#00ff9c]">
                  <span>✓ Sent to {resolvedStation.contact?.phone || "+91-9876543210"} ({resolvedStation.name})</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#00ff9c]">
                  <span>✓ Sent to +91-9876543211 (District Collector)</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: Sending Emails */}
          {currentStep >= 6 && (
            <div className="p-2 border border-[#00ff9c]/60 bg-[#071710] space-y-1 animate-fade-in">
              <div className="flex items-center justify-between font-bold text-[#00ff9c]">
                <span>📧 STEP 6: Sending emails...</span>
                <span className="text-[#00ff9c] text-[10px]">✓ DELIVERED</span>
              </div>
              <div className="space-y-0.5 text-[10px] text-[#d0d8e0]">
                <div>✓ Sent to <span className="text-[#00d4ff]">control@surat-fire.gov.in</span></div>
                <div>✓ Sent to <span className="text-[#00d4ff]">dc@surat.gov.in</span></div>
                <div>✓ Sent to <span className="text-[#00d4ff]">ops@ndma.gov.in</span></div>
              </div>
            </div>
          )}

          {/* STEP 7: Radio Broadcast */}
          {currentStep >= 7 && (
            <div className="p-2 border border-[#ff00ea]/60 bg-[#160613] space-y-1 animate-fade-in">
              <div className="flex items-center justify-between font-bold text-[#ff00ea]">
                <span>📻 STEP 7: Broadcasting on radio...</span>
                <span className="text-[#00ff9c] text-[10px]">✓ BROADCAST LOCKED</span>
              </div>
              <div className="text-[10px] text-[#d0d8e0] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ff00ea] animate-pulse" />
                <span>✓ Channel-14: Alert transmitted on VHF 154.280 MHz</span>
              </div>
            </div>
          )}

          {/* STEP 8: Notifying Medical */}
          {currentStep >= 8 && (
            <div className="p-2 border border-[#ff3b3b]/60 bg-[#170709] space-y-1 animate-fade-in">
              <div className="flex items-center justify-between font-bold text-[#ff8080]">
                <span>🚑 STEP 8: Notifying medical...</span>
                <span className="text-[#00ff9c] text-[10px]">✓ HOSPITAL STANDBY</span>
              </div>
              <div className="space-y-0.5 text-[10px] text-[#d0d8e0]">
                <div>✓ {resolvedHospital.name}: Standby mode</div>
                <div className="text-[#00ff9c]">✓ Trauma &amp; Burn team on alert (50 beds reserved)</div>
              </div>
            </div>
          )}

          {/* STEP 9: Generating Dispatch Report */}
          {currentStep >= 9 && (
            <div className="p-2 border border-[#00d4ff]/60 bg-[#07131a] space-y-1 animate-fade-in">
              <div className="flex items-center justify-between font-bold text-[#00d4ff]">
                <span>📊 STEP 9: Generating dispatch report...</span>
                <span className="text-[#00ff9c] text-[10px]">✓ RECORD CREATED</span>
              </div>
              <div className="text-[11px] text-white flex items-center gap-2">
                <span>DISPATCH REF:</span>
                <span className="font-bold text-[#00ff9c] bg-black/40 px-1.5 py-0.5 border border-[#00ff9c]">
                  {currentDispatchId}
                </span>
              </div>
            </div>
          )}

          {/* STEP 10: DISPATCH COMPLETE */}
          {currentStep === 10 && (
            <div className="p-3 border-2 border-[#00ff9c] bg-[#051a0f] space-y-2 animate-fade-in text-center">
              <div className="text-base font-black text-[#00ff9c] tracking-widest uppercase flex items-center justify-center gap-2">
                <span>✅ DISPATCH COMPLETE</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-[#d0d8e0] pt-1 text-left">
                <div className="p-1.5 border border-[#1f2933] bg-[#0a0e14]">
                  <span className="text-[#6b7785] block text-[9px]">TOTAL TIME</span>
                  <strong className="text-white">12 SECONDS</strong>
                </div>
                <div className="p-1.5 border border-[#1f2933] bg-[#0a0e14]">
                  <span className="text-[#6b7785] block text-[9px]">FIRST RESPONDER ETA</span>
                  <strong className="text-[#00ff9c]">8 MINUTES TARGET</strong>
                </div>
              </div>
              <div className="text-[10px] text-[#a0aec0] italic pt-1">
                In production: This would trigger real SMS / email / radio / dispatch.
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#1f2933] pt-2 text-xs">
          <div className="flex items-center gap-2">
            {currentStep === 10 && (
              <>
                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1 border border-[#00d4ff] bg-[#00d4ff]/10 text-[#00d4ff] hover:bg-[#00d4ff]/20 font-bold cursor-pointer transition text-[10px]"
                >
                  {isCopied ? "[ ✓ COPIED ]" : "[ 📋 COPY DISPATCH ID ]"}
                </button>
                {onOpenHistory && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenHistory();
                    }}
                    className="px-2.5 py-1 border border-[#ffb800] bg-[#ffb800]/10 text-[#ffb800] hover:bg-[#ffb800]/20 font-bold cursor-pointer transition text-[10px]"
                  >
                    [ 📁 VIEW DISPATCH LOG ]
                  </button>
                )}
              </>
            )}
          </div>

          <button
            onClick={onClose}
            className={`px-4 py-1.5 font-bold transition text-xs cursor-pointer ${
              currentStep === 10
                ? "bg-[#00ff9c] text-black font-black hover:bg-[#00ff9c]/80"
                : "border border-[#1f2933] text-[#6b7785] hover:text-white"
            }`}
          >
            {currentStep === 10 ? "[ CLOSE ]" : "[ ABORT SIMULATION ]"}
          </button>
        </div>
      </div>
    </div>
  );
}
