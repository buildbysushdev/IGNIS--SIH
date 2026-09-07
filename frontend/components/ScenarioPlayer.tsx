"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import type { Fire } from "./FireMap";
import NarrationOverlay from "./NarrationOverlay";
import { playTacticalAlertSound } from "./EmergencyPanel";

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
  const [currentStep, setCurrentStep] = useState<ScenarioStep | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const activeFiresRef = useRef<Fire[]>([]);
  const executedTimesRef = useRef<Set<number>>(new Set());

  // Load Scenario JSON when selectedScenarioId changes
  useEffect(() => {
    if (selectedScenarioId === "live" || !selectedScenarioId) {
      setScenarioData(null);
      setCurrentStep(null);
      setElapsedSec(0);
      onUpdateOverlay(null);
      executedTimesRef.current.clear();
      return;
    }

    setIsLoading(true);
    // Fetch scenario data from API proxy or fallback
    axios
      .get(`/api/scenarios/${selectedScenarioId}`)
      .then((res) => {
        if (res.data && res.data.timeline) {
          setScenarioData(res.data);
        }
      })
      .catch((err) => {
        console.warn("[SCENARIO] Could not load from API, trying fallback:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [selectedScenarioId, onUpdateOverlay]);

  // Execute a specific timeline step
  const executeStep = useCallback(
    (step: ScenarioStep, scen: ScenarioDefinition) => {
      setCurrentStep(step);

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
            };
            activeFiresRef.current = [newFire, ...activeFiresRef.current];
            onUpdateFires([...activeFiresRef.current]);
            onUpdateOverlay({
              pulseMarker: [newFire.latitude, newFire.longitude],
            });
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
          break;

        case "CLASSIFY":
        case "CLASSIFY_ALL":
          playTacticalAlertSound();
          if (activeFiresRef.current.length > 0 && onTriggerEmergencyPanel && step.category === "EMERGENCY_INDUSTRIAL") {
            onTriggerEmergencyPanel(activeFiresRef.current[0]);
          }
          break;

        case "SHOW_PROTOCOL":
        case "SHOW_EQUIPMENT":
          if (activeFiresRef.current.length > 0 && onTriggerEmergencyPanel) {
            onTriggerEmergencyPanel(activeFiresRef.current[0]);
          }
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
          if (activeFiresRef.current.length > 0 && onTriggerDispatch) {
            onTriggerDispatch(activeFiresRef.current[0], step.station);
          }
          break;

        case "SHOW_EVACUATION":
          const rad = step.radius_km || 0.5;
          const center = step.center || [scen.location.lat, scen.location.lon];
          onUpdateOverlay({
            evacuationCircle: { center, radius_km: rad },
          });
          break;

        case "PREDICT_SPREAD":
          const spreadCone = step.cone || [
            [scen.location.lat, scen.location.lon],
            [scen.location.lat + 0.12, scen.location.lon + 0.09],
            [scen.location.lat + 0.15, scen.location.lon + 0.03],
            [scen.location.lat, scen.location.lon],
          ];
          onUpdateOverlay({
            windCone: spreadCone,
          });
          break;

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
      onTriggerEmergencyPanel,
      onTriggerDispatch,
      onUpdateStats,
    ]
  );

  // Start / stop coordination on isPlaying prop toggle
  useEffect(() => {
    if (isPlaying && scenarioData) {
      if (elapsedSec === 0 && executedTimesRef.current.size === 0) {
        // Clear map fires
        activeFiresRef.current = [];
        onUpdateFires([]);
        // Zoom to scenario target
        onUpdateTargetCoords(
          [scenarioData.location.lat, scenarioData.location.lon],
          scenarioData.location.zoom
        );
        // Execute initial step (time 0)
        const initStep = scenarioData.timeline.find((s) => s.time === 0);
        if (initStep) {
          executedTimesRef.current.add(0);
          executeStep(initStep, scenarioData);
        }
      }
    }
  }, [isPlaying, scenarioData, elapsedSec, onUpdateFires, onUpdateTargetCoords, executeStep]);

  // Playback Timer Engine
  useEffect(() => {
    if (!isPlaying || !scenarioData) return;

    const totalSec = scenarioData.duration_seconds || 45;

    const timer = setInterval(() => {
      setElapsedSec((prev) => {
        const nextSec = prev + 1;

        if (nextSec >= totalSec) {
          // Playback reached completion
          // Allow 3.5s to read final narration, then return to live
          setTimeout(() => {
            handleSkipOrStop();
          }, 3500);
          return totalSec;
        }

        // Check if any timeline step matches nextSec
        const step = scenarioData.timeline.find((s) => s.time === nextSec);
        if (step && !executedTimesRef.current.has(step.time)) {
          executedTimesRef.current.add(step.time);
          executeStep(step, scenarioData);
        }

        return nextSec;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, scenarioData, executeStep]);

  // Stop / Skip Handler
  const handleSkipOrStop = useCallback(() => {
    onPlayStateChange(false);
    onUpdateOverlay(null);
    onScenarioSelect("live");
    onCompleteReturnToLive();
  }, [onPlayStateChange, onUpdateOverlay, onScenarioSelect, onCompleteReturnToLive]);

  const progressPct = scenarioData
    ? (elapsedSec / scenarioData.duration_seconds) * 100
    : 0;

  return (
    <>
      {/* Floating Bottom-Center Narration Overlay */}
      {isPlaying && currentStep && scenarioData && (
        <NarrationOverlay
          narration={currentStep.narration}
          scenarioName={scenarioData.name}
          progressPct={progressPct}
          elapsedSec={elapsedSec}
          totalDurationSec={scenarioData.duration_seconds}
          currentAction={currentStep.action}
          equipment={currentStep.equipment}
          warning={currentStep.warning}
          onSkip={handleSkipOrStop}
          onStop={handleSkipOrStop}
        />
      )}
    </>
  );
}
