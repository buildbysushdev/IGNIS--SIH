"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import type { Fire } from "./FireMap";
import NarrationOverlay from "./NarrationOverlay";
import { playTacticalAlertSound } from "./EmergencyPanel";

import suratScen from "@/data/scenarios/surat_emergency.json";
import bhilaiScen from "@/data/scenarios/bhilai_persistent.json";
import punjabScen from "@/data/scenarios/punjab_stubble.json";
import bonfireScen from "@/data/scenarios/domestic_bonfire.json";
import uttarakhandScen from "@/data/scenarios/uttarakhand_forest.json";
import keralaFloodScen from "@/data/scenarios/kerala_flood.json";
import odishaCycloneScen from "@/data/scenarios/odisha_cyclone.json";

export interface ScenarioStep {
  time: number;
  action: string;
  narration: string;
  fire?: any;
  count?: number;
  region?: string;
  bounds?: [number, number, number, number];
  category?: string;
  protocol?: any;
  station?: any;
  equipment?: string[];
  warning?: string;
  radius_km?: number;
  affected_population?: number;
  center?: [number, number];
  wind_direction?: string;
  wind_speed?: number;
  cone?: [number, number][];
  villages_at_risk?: string[];
  stats?: any;
  delhi_aqi?: number;
  // Flood specific
  flood_level?: "WARNING" | "CRITICAL" | "SEVERE";
  // Cyclone specific
  eye_radius_km?: number;
  surge_radius_km?: number;
  cyclone_category?: number;
}

export interface ScenarioDefinition {
  id: string;
  name: string;
  duration_seconds: number;
  description: string;
  location: {
    lat: number;
    lon: number;
    zoom: number;
  };
  timeline: ScenarioStep[];
}

const LOCAL_SCENARIOS: Record<string, ScenarioDefinition> = {
  surat_emergency: suratScen as ScenarioDefinition,
  bhilai_persistent: bhilaiScen as ScenarioDefinition,
  punjab_stubble: punjabScen as ScenarioDefinition,
  domestic_bonfire: bonfireScen as ScenarioDefinition,
  uttarakhand_forest: uttarakhandScen as ScenarioDefinition,
  kerala_flood: keralaFloodScen as ScenarioDefinition,
  odisha_cyclone: odishaCycloneScen as ScenarioDefinition,
};

export interface ScenarioPlayerProps {
  selectedScenarioId: string;
  isPlaying: boolean;
  onPlayStateChange: (playing: boolean) => void;
  onScenarioSelect: (scenId: string) => void;
  onUpdateFires: (fires: Fire[]) => void;
  onUpdateStats?: (stats: any) => void;
  onUpdateTargetCoords: (coords: [number, number], zoom?: number) => void;
  onTriggerEmergencyPanel?: (fire: Fire) => void;
  onTriggerDispatch?: (fire: Fire, station?: any) => void;
  onUpdateOverlay: (overlay: {
    evacuationCircle?: { center: [number, number]; radius_km: number } | null;
    windCone?: [number, number][] | null;
    stationMarker?: { name: string; lat: number; lon: number; distance_km?: number } | null;
    pulseMarker?: [number, number] | null;
    floodCircles?: { center: [number, number]; radius_km: number; flood_level?: "WARNING" | "CRITICAL" | "SEVERE" }[] | null;
    cycloneOverlay?: { center: [number, number]; eye_radius_km: number; surge_radius_km: number; wind_speed?: number; category?: number } | null;
    disasterType?: "FIRE" | "FLOOD" | "CYCLONE" | null;
  } | null) => void;
  onCompleteReturnToLive: () => void;
}

export default function ScenarioPlayer({
  selectedScenarioId,
  isPlaying,
  onPlayStateChange,
  onScenarioSelect,
  onUpdateFires,
  onUpdateStats,
  onUpdateTargetCoords,
  onTriggerEmergencyPanel,
  onTriggerDispatch,
  onUpdateOverlay,
  onCompleteReturnToLive,
}: ScenarioPlayerProps) {
  const [scenarioData, setScenarioData] = useState<ScenarioDefinition | null>(null);
  const [elapsedSec, setElapsedSec] = useState<number>(0);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const activeFiresRef = useRef<Fire[]>([]);
  const executedTimesRef = useRef<Set<number>>(new Set());

  // Load Scenario JSON when selectedScenarioId changes
  useEffect(() => {
    if (selectedScenarioId === "live" || !selectedScenarioId) {
      setScenarioData(null);
      setCurrentStepIndex(0);
      setElapsedSec(0);
      setIsPaused(false);
      onUpdateOverlay(null);
      executedTimesRef.current.clear();
      return;
    }

    // Use instant local data as primary source
    const local = LOCAL_SCENARIOS[selectedScenarioId];
    if (local && local.timeline) {
      setScenarioData(local);
    }

    // Secondary remote fetch
    axios
      .get(`/api/scenarios/${selectedScenarioId}`)
      .then((res) => {
        if (res.data && res.data.timeline) {
          setScenarioData(res.data);
        }
      })
      .catch((err) => {
        console.warn("[SCENARIO] Using bundled scenario fallback:", err?.message);
      });
  }, [selectedScenarioId, onUpdateOverlay]);

  // Execute a specific timeline step
  const executeStep = useCallback(
    (step: ScenarioStep, scen: ScenarioDefinition) => {
      const idx = scen.timeline.findIndex((s) => s.time === step.time);
      if (idx >= 0) {
        setCurrentStepIndex(idx);
      }

      switch (step.action) {
        case "SHOW_MAP":
          onUpdateTargetCoords([scen.location.lat, scen.location.lon], scen.location.zoom);
          break;

        case "ADD_FIRE":
          if (step.fire) {
            const newFire: Fire = {
              latitude: step.fire.latitude,
              longitude: step.fire.longitude,
              brightness: step.fire.brightness || 380,
              frp: step.fire.frp || 145,
              confidence: step.fire.confidence || "high",
              acq_date: new Date().toISOString().slice(0, 10),
              acq_time: "1425",
              category: step.fire.category || "EMERGENCY_INDUSTRIAL",
              risk_level: step.fire.risk_level || "CRITICAL",
              reason: step.fire.reason || step.narration,
              action: step.fire.action || "IMMEDIATE DISPATCH REQUIRED",
              facility_name: step.fire.facility_name,
              nearest_facility: step.fire.nearest_facility,
            };
            activeFiresRef.current = [newFire, ...activeFiresRef.current];
            onUpdateFires([...activeFiresRef.current]);
            const scenDisaster = (scen as any).disasterType || (scen.id === "kerala_flood" ? "FLOOD" : scen.id === "odisha_cyclone" ? "CYCLONE" : "FIRE");
            onUpdateOverlay({
              pulseMarker: [newFire.latitude, newFire.longitude],
              disasterType: scenDisaster,
            });
            // Smoothly pan map to new fire
            onUpdateTargetCoords([newFire.latitude, newFire.longitude], scen.location.zoom || 13);
            playTacticalAlertSound();
          }
          break;

        case "BATCH_ADD_FIRES":
          const count = step.count || 50;
          const bounds = step.bounds || [29.5, 74.5, 31.5, 76.5];
          const generatedBatch: Fire[] = [];
          for (let i = 0; i < count; i++) {
            const lat = Number((bounds[0] + Math.random() * (bounds[2] - bounds[0])).toFixed(4));
            const lon = Number((bounds[1] + Math.random() * (bounds[3] - bounds[1])).toFixed(4));
            generatedBatch.push({
              latitude: lat,
              longitude: lon,
              brightness: 310 + Math.floor(Math.random() * 25),
              frp: 8 + Math.floor(Math.random() * 20),
              confidence: "nominal",
              acq_date: new Date().toISOString().slice(0, 10),
              acq_time: "1430",
              category: step.category || "AGRICULTURAL_BURNING",
              risk_level: "MEDIUM",
              reason: "Active stubble burning cluster",
              action: "Regional advisory",
            });
          }
          activeFiresRef.current = [...activeFiresRef.current, ...generatedBatch];
          onUpdateFires([...activeFiresRef.current]);
          onUpdateTargetCoords([scen.location.lat, scen.location.lon], scen.location.zoom || 7);
          break;

        case "CLASSIFY":
        case "CLASSIFY_ALL":
          playTacticalAlertSound();
          break;

        case "SHOW_PROTOCOL":
        case "SHOW_EQUIPMENT":
          break;

        case "FIND_STATION":
          if (step.station) {
            onUpdateOverlay({
              stationMarker: {
                name: step.station.name,
                lat: step.station.lat || scen.location.lat + 0.02,
                lon: step.station.lon || scen.location.lon - 0.01,
                distance_km: step.station.distance_km,
              },
            });
          }
          break;

        case "DISPATCH":
          playTacticalAlertSound();
          break;

        case "SHOW_EVACUATION": {
          const rad = step.radius_km || 0.5;
          const center = step.center || [scen.location.lat, scen.location.lon];
          const isFlood = (step as any).disaster_type === "FLOOD" || (scen as any).disasterType === "FLOOD" || scen.id === "kerala_flood";
          const isCyclone = (step as any).disaster_type === "CYCLONE" || (scen as any).disasterType === "CYCLONE" || scen.id === "odisha_cyclone";
          // For flood: show both evacuation circle + existing flood circles
          // For cyclone: show evacuation + cyclone overlay
          if (isFlood) {
            onUpdateOverlay({
              evacuationCircle: { center: center as [number, number], radius_km: rad },
              floodCircles: [
                { center: center as [number, number], radius_km: rad * 0.4, flood_level: "WARNING" },
                { center: center as [number, number], radius_km: rad * 0.7, flood_level: "CRITICAL" },
                { center: center as [number, number], radius_km: rad, flood_level: "SEVERE" },
              ],
              stationMarker: step.station ? {
                name: step.station.name,
                lat: step.station.lat || scen.location.lat + 0.02,
                lon: step.station.lon || scen.location.lon - 0.01,
                distance_km: step.station.distance_km,
              } : undefined,
              disasterType: "FLOOD",
            });
          } else if (isCyclone) {
            onUpdateOverlay({
              evacuationCircle: { center: center as [number, number], radius_km: rad },
              cycloneOverlay: {
                center: center as [number, number],
                eye_radius_km: 15,
                surge_radius_km: rad * 0.6,
                wind_speed: (step as any).wind_speed || 200,
                category: (step as any).cyclone_category || 5,
              },
              stationMarker: step.station ? {
                name: step.station.name,
                lat: step.station.lat || scen.location.lat + 0.02,
                lon: step.station.lon || scen.location.lon - 0.01,
                distance_km: step.station.distance_km,
              } : undefined,
              disasterType: "CYCLONE",
            });
          } else {
            onUpdateOverlay({
              evacuationCircle: { center: center as [number, number], radius_km: rad },
              disasterType: "FIRE",
            });
          }
          onUpdateTargetCoords(center as [number, number], isCyclone ? 9 : 13);
          break;
        }

        case "FLOOD_RISE":
        case "FLOOD_SPREAD": {
          const center: [number, number] = step.center || [scen.location.lat, scen.location.lon];
          const radiusKm = step.radius_km || 5;
          // Add flood fire marker if present
          if (step.fire) {
            const floodFire: Fire = {
              latitude: step.fire.latitude,
              longitude: step.fire.longitude,
              brightness: step.fire.brightness || 280,
              frp: 0,
              confidence: "satellite",
              acq_date: new Date().toISOString().slice(0, 10),
              acq_time: new Date().toTimeString().slice(0, 4).replace(":", ""),
              category: step.fire.category || "FLOOD_CRITICAL",
              risk_level: step.fire.risk_level || "CRITICAL",
              reason: step.fire.reason || step.narration,
              action: step.fire.action || "NDRF RESCUE DEPLOYED",
            };
            activeFiresRef.current = [floodFire, ...activeFiresRef.current];
            onUpdateFires([...activeFiresRef.current]);
          }
          // Show animated concentric flood rings
          onUpdateOverlay({
            floodCircles: [
              { center, radius_km: radiusKm * 0.3, flood_level: "WARNING" },
              { center, radius_km: radiusKm * 0.65, flood_level: "CRITICAL" },
              { center, radius_km: radiusKm, flood_level: "SEVERE" },
            ],
            pulseMarker: center,
            disasterType: "FLOOD",
          });
          onUpdateTargetCoords(center, scen.location.zoom || 10);
          if (step.action === "FLOOD_RISE") playTacticalAlertSound();
          break;
        }

        case "CYCLONE_APPROACH": {
          const center: [number, number] = step.center || [scen.location.lat, scen.location.lon];
          const radiusKm = step.radius_km || 80;
          const windSpeed = (step as any).wind_speed || 200;
          const cycCat = (step as any).cyclone_category || 5;
          // Add cyclone marker if this is a new approach
          if (step.fire) {
            const cycloneFire: Fire = {
              latitude: step.fire.latitude,
              longitude: step.fire.longitude,
              brightness: step.fire.brightness || 310,
              frp: 0,
              confidence: "satellite",
              acq_date: new Date().toISOString().slice(0, 10),
              acq_time: new Date().toTimeString().slice(0, 4).replace(":", ""),
              category: step.fire.category || "CYCLONE_WARNING",
              risk_level: step.fire.risk_level || "CRITICAL",
              reason: step.fire.reason || step.narration,
              action: step.fire.action || "MASS EVACUATION ORDERED",
            };
            activeFiresRef.current = [cycloneFire, ...activeFiresRef.current];
            onUpdateFires([...activeFiresRef.current]);
          }
          // Show cyclone overlay with spiral indicator
          onUpdateOverlay({
            cycloneOverlay: {
              center,
              eye_radius_km: Math.max(15, radiusKm * 0.15),
              surge_radius_km: Math.max(30, radiusKm * 0.4),
              wind_speed: windSpeed,
              category: cycCat,
            },
            evacuationCircle: { center, radius_km: radiusKm },
            pulseMarker: center,
            disasterType: "CYCLONE",
          });
          onUpdateTargetCoords(center, scen.location.zoom || 9);
          playTacticalAlertSound();
          break;
        }

        case "FLOOD_WAVE": {
          const floodCenter: [number, number] = step.center || [scen.location.lat, scen.location.lon];
          const floodR = step.radius_km || 2.0;
          const floodLevel = step.flood_level || "CRITICAL";
          // Build concentric rings: inner critical + outer warning
          onUpdateOverlay({
            disasterType: "FLOOD",
            floodCircles: [
              { center: floodCenter, radius_km: floodR * 0.4, flood_level: "SEVERE" },
              { center: floodCenter, radius_km: floodR * 0.7, flood_level: "CRITICAL" },
              { center: floodCenter, radius_km: floodR, flood_level: floodLevel as any },
            ],
          });
          onUpdateTargetCoords(floodCenter, scen.location.zoom || 11);
          break;
        }

        case "CYCLONE_EYE": {
          const eyeCenter: [number, number] = step.center || [scen.location.lat, scen.location.lon];
          onUpdateOverlay({
            disasterType: "CYCLONE",
            cycloneOverlay: {
              center: eyeCenter,
              eye_radius_km: step.radius_km || 25,
              surge_radius_km: (step.radius_km || 25) * 3.5,
              wind_speed: step.wind_speed,
              category: step.cyclone_category || 4,
            },
            pulseMarker: eyeCenter,
          });
          onUpdateTargetCoords(eyeCenter, scen.location.zoom || 9);
          playTacticalAlertSound();
          break;
        }

        case "CYCLONE_SPIRAL": {
          const spiralCenter: [number, number] = step.center || [scen.location.lat, scen.location.lon];
          onUpdateOverlay({
            disasterType: "CYCLONE",
            cycloneOverlay: {
              center: spiralCenter,
              eye_radius_km: step.eye_radius_km || 25,
              surge_radius_km: step.radius_km || 80,
              wind_speed: step.wind_speed,
              category: step.cyclone_category || 4,
            },
          });
          break;
        }

        case "PREDICT_SPREAD": {
          const spreadCone = step.cone || [
            [scen.location.lat, scen.location.lon],
            [scen.location.lat + 0.12, scen.location.lon + 0.09],
            [scen.location.lat + 0.15, scen.location.lon + 0.03],
            [scen.location.lat, scen.location.lon],
          ];
          const isCyclone = (step as any).disaster_type === "CYCLONE" || (scen as any).disasterType === "CYCLONE" || scen.id === "odisha_cyclone";
          const isFlood = (step as any).disaster_type === "FLOOD" || (scen as any).disasterType === "FLOOD" || scen.id === "kerala_flood";

          if (isCyclone) {
            onUpdateOverlay({
              windCone: spreadCone,
              cycloneOverlay: {
                center: [scen.location.lat, scen.location.lon] as [number, number],
                eye_radius_km: 20,
                surge_radius_km: 75,
                wind_speed: (step as any).wind_speed || 185,
                category: 4,
              },
              disasterType: "CYCLONE",
            });
          } else if (isFlood) {
            onUpdateOverlay({
              windCone: spreadCone,
              floodCircles: [
                { center: [scen.location.lat, scen.location.lon] as [number, number], radius_km: 2.5, flood_level: "WARNING" },
                { center: [scen.location.lat, scen.location.lon] as [number, number], radius_km: 5.5, flood_level: "CRITICAL" },
              ],
              disasterType: "FLOOD",
            });
          } else {
            onUpdateOverlay({ windCone: spreadCone, disasterType: "FIRE" });
          }
          break;
        }

        case "SHOW_STATS":
          if (step.stats && onUpdateStats) {
            onUpdateStats(step.stats);
          }
          break;

        case "COMPLETE":
          break;

        default:
          break;
      }
    },
    [
      onUpdateTargetCoords,
      onUpdateFires,
      onUpdateOverlay,
      onUpdateStats,
    ]
  );

  // Stop / Skip Handler
  const handleSkipOrStop = useCallback(() => {
    onPlayStateChange(false);
    setIsPaused(false);
    onUpdateOverlay(null);
    onScenarioSelect("live");
    onCompleteReturnToLive();
  }, [onPlayStateChange, onUpdateOverlay, onScenarioSelect, onCompleteReturnToLive]);

  // Jump / Seek directly to a step
  const seekToStep = useCallback(
    (stepIdx: number) => {
      if (!scenarioData || !scenarioData.timeline[stepIdx]) return;
      const targetStep = scenarioData.timeline[stepIdx];
      setElapsedSec(targetStep.time);
      setCurrentStepIndex(stepIdx);

      // Accumulate fires & markers up to this step
      const accumulatedFires: Fire[] = [];
      const activeOverlay: any = {};

      for (let i = 0; i <= stepIdx; i++) {
        const s = scenarioData.timeline[i];
        if (s.action === "ADD_FIRE" && s.fire) {
          accumulatedFires.push({
            latitude: s.fire.latitude,
            longitude: s.fire.longitude,
            brightness: s.fire.brightness || 380,
            frp: s.fire.frp || 145,
            confidence: s.fire.confidence || "high",
            acq_date: new Date().toISOString().slice(0, 10),
            acq_time: "1425",
            category: s.fire.category || "EMERGENCY_INDUSTRIAL",
            risk_level: s.fire.risk_level || "CRITICAL",
            reason: s.fire.reason || s.narration,
            action: s.fire.action || "IMMEDIATE DISPATCH REQUIRED",
            facility_name: s.fire.facility_name,
            nearest_facility: s.fire.nearest_facility,
          });
          activeOverlay.pulseMarker = [s.fire.latitude, s.fire.longitude];
        } else if (s.action === "FIND_STATION" && s.station) {
          activeOverlay.stationMarker = {
            name: s.station.name,
            lat: s.station.lat || scenarioData.location.lat + 0.02,
            lon: s.station.lon || scenarioData.location.lon - 0.01,
            distance_km: s.station.distance_km,
          };
        } else if (s.action === "SHOW_EVACUATION") {
          activeOverlay.evacuationCircle = {
            center: s.center || [scenarioData.location.lat, scenarioData.location.lon],
            radius_km: s.radius_km || 0.5,
          };
        } else if (s.action === "PREDICT_SPREAD") {
          activeOverlay.windCone = s.cone || [
            [scenarioData.location.lat, scenarioData.location.lon],
            [scenarioData.location.lat + 0.12, scenarioData.location.lon + 0.09],
            [scenarioData.location.lat + 0.15, scenarioData.location.lon + 0.03],
            [scenarioData.location.lat, scenarioData.location.lon],
          ];
        } else if (s.action === "FLOOD_WAVE") {
          const fc: [number, number] = s.center || [scenarioData.location.lat, scenarioData.location.lon];
          const fr = s.radius_km || 2.0;
          activeOverlay.disasterType = "FLOOD";
          activeOverlay.floodCircles = [
            { center: fc, radius_km: fr * 0.4, flood_level: "SEVERE" },
            { center: fc, radius_km: fr * 0.7, flood_level: "CRITICAL" },
            { center: fc, radius_km: fr, flood_level: s.flood_level || "CRITICAL" },
          ];
        } else if (s.action === "CYCLONE_EYE" || s.action === "CYCLONE_SPIRAL") {
          const cc: [number, number] = s.center || [scenarioData.location.lat, scenarioData.location.lon];
          activeOverlay.disasterType = "CYCLONE";
          activeOverlay.cycloneOverlay = {
            center: cc,
            eye_radius_km: s.radius_km || 25,
            surge_radius_km: s.action === "CYCLONE_SPIRAL" ? (s.radius_km || 80) : (s.radius_km || 25) * 3.5,
            wind_speed: s.wind_speed,
            category: s.cyclone_category || 4,
          };
        }
      }

      activeFiresRef.current = accumulatedFires;
      onUpdateFires(accumulatedFires);
      onUpdateOverlay(Object.keys(activeOverlay).length > 0 ? activeOverlay : null);

      // Re-mark executed times
      executedTimesRef.current = new Set(
        scenarioData.timeline.slice(0, stepIdx + 1).map((s) => s.time)
      );

      executeStep(targetStep, scenarioData);
    },
    [scenarioData, onUpdateFires, onUpdateOverlay, executeStep]
  );

  const stepPrev = useCallback(() => {
    if (currentStepIndex > 0) {
      seekToStep(currentStepIndex - 1);
    }
  }, [currentStepIndex, seekToStep]);

  const stepNext = useCallback(() => {
    if (scenarioData && currentStepIndex < scenarioData.timeline.length - 1) {
      seekToStep(currentStepIndex + 1);
    }
  }, [scenarioData, currentStepIndex, seekToStep]);

  // Initial step execution on start
  useEffect(() => {
    if (isPlaying && scenarioData) {
      if (elapsedSec === 0 && executedTimesRef.current.size === 0) {
        activeFiresRef.current = [];
        onUpdateFires([]);
        onUpdateTargetCoords(
          [scenarioData.location.lat, scenarioData.location.lon],
          scenarioData.location.zoom
        );
        const initStep = scenarioData.timeline.find((s) => s.time === 0) || scenarioData.timeline[0];
        if (initStep) {
          executedTimesRef.current.add(initStep.time);
          executeStep(initStep, scenarioData);
        }
      }
    }
  }, [isPlaying, scenarioData, elapsedSec, onUpdateFires, onUpdateTargetCoords, executeStep]);

  // Playback Timer Engine
  useEffect(() => {
    if (!isPlaying || !scenarioData || isPaused) return;

    const totalSec = scenarioData.duration_seconds || 45;

    const timer = setInterval(() => {
      setElapsedSec((prev) => {
        const nextSec = prev + 1;

        if (nextSec >= totalSec) {
          setTimeout(() => {
            handleSkipOrStop();
          }, 3500);
          return totalSec;
        }

        const step = scenarioData.timeline.find((s) => s.time === nextSec);
        if (step && !executedTimesRef.current.has(step.time)) {
          executedTimesRef.current.add(step.time);
          executeStep(step, scenarioData);
        }

        return nextSec;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, scenarioData, isPaused, executeStep, handleSkipOrStop]);

  const progressPct = scenarioData
    ? (elapsedSec / scenarioData.duration_seconds) * 100
    : 0;

  const currentStep =
    scenarioData && scenarioData.timeline[currentStepIndex]
      ? scenarioData.timeline[currentStepIndex]
      : null;

  return (
    <>
      {/* Floating Tactical Narration & Timeline Control Overlay */}
      {isPlaying && scenarioData && (
        <NarrationOverlay
          narration={currentStep?.narration || scenarioData.description}
          scenarioName={scenarioData.name}
          progressPct={progressPct}
          elapsedSec={elapsedSec}
          totalDurationSec={scenarioData.duration_seconds}
          currentAction={currentStep?.action}
          equipment={currentStep?.equipment}
          warning={currentStep?.warning}
          steps={scenarioData.timeline}
          currentStepIndex={currentStepIndex}
          onSeekStep={seekToStep}
          isPaused={isPaused}
          onTogglePause={() => setIsPaused((p) => !p)}
          onPrevStep={stepPrev}
          onNextStep={stepNext}
          onTriggerDispatch={
            onTriggerDispatch && activeFiresRef.current[0]
              ? () => onTriggerDispatch(activeFiresRef.current[0])
              : undefined
          }
          onSkip={handleSkipOrStop}
          onStop={handleSkipOrStop}
        />
      )}
    </>
  );
}
