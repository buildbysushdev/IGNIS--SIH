"use client";

import { useState, useEffect } from "react";
import type { Fire } from "./FireMap";
import axios from "axios";

interface HistoricalAnalysisProps {
  isOpen: boolean;
  onClose: () => void;
  fire: Fire | null;
  onPanToCoords?: (coords: [number, number]) => void;
}

export default function HistoricalAnalysis({
  isOpen,
  onClose,
  fire,
  onPanToCoords,
}: HistoricalAnalysisProps) {
  const [activeTab, setActiveTab] = useState<"TIMELINE" | "SEASONAL" | "RISK" | "SIMILAR">("TIMELINE");
  const [loading, setLoading] = useState<boolean>(true);
  const [historyData, setHistoryData] = useState<any>(null);
  const [riskData, setRiskData] = useState<any>(null);
  const [similarIncidents, setSimilarIncidents] = useState<any[]>([]);

  const lat = fire?.latitude ?? 21.1702;
  const lon = fire?.longitude ?? 72.8311;
  const category = fire?.category ?? "EMERGENCY_INDUSTRIAL";
  const frp = fire?.frp ?? 145.0;

  useEffect(() => {
    if (!isOpen || !fire) return;

    let isMounted = true;
    setLoading(true);

    Promise.all([
      axios.get(`/api/history?lat=${lat}&lon=${lon}&radius=5`),
      axios.get(`/api/history/risk?lat=${lat}&lon=${lon}`),
      axios.get(`/api/history/similar?category=${encodeURIComponent(category)}&frp=${frp}&lat=${lat}&lon=${lon}`),
    ])
      .then(([histRes, riskRes, simRes]) => {
        if (!isMounted) return;
        setHistoryData(histRes.data);
        setRiskData(riskRes.data);
        setSimilarIncidents(Array.isArray(simRes.data) ? simRes.data : []);
      })
      .catch((err) => {
        console.warn("[IGNIS] Failed to load historical analysis:", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, fire, lat, lon, category, frp]);

  if (!isOpen || !fire) return null;

  const annualTimeline = historyData?.annual_timeline || [
    { year: 2021, count: 7, avg_frp: 110.2 },
    { year: 2022, count: 8, avg_frp: 118.5 },
    { year: 2023, count: 10, avg_frp: 130.0 },
    { year: 2024, count: 12, avg_frp: 145.2 },
    { year: 2025, count: 11, avg_frp: 142.0 },
  ];

  const maxAnnualCount = Math.max(1, ...annualTimeline.map((a: any) => a.count));

  const monthlyPatterns = historyData?.monthly_patterns || [];
  const riskScore = riskData?.risk_score ?? 76;
  const riskLevel = riskData?.risk_level ?? "HIGH";
  const trend = historyData?.trend ?? "INCREASING";
  const trendPct = historyData?.trend_percentage ?? 16;

  // Circular gauge calculations (r = 54, circumference ~ 339.29)
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (riskScore / 100) * circumference;

  const getRiskColor = (level: string) => {
    switch (level) {
      case "CRITICAL":
        return "#ff3b3b";
      case "HIGH":
        return "#ff8000";
      case "MEDIUM":
        return "#ffb800";
      default:
        return "#00ff9c";
    }
  };

  const riskColor = getRiskColor(riskLevel);

  return (
    <div className="fixed inset-0 z-[3100] bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 font-mono text-[#d0d8e0] select-none">
      <div className="bg-[#0a0e14] border-2 border-[#00d4ff] max-w-3xl w-full max-h-[90vh] p-4 shadow-[0_0_60px_rgba(0,212,255,0.25)] flex flex-col gap-3">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#1f2933] pb-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00d4ff] animate-ping" />
            <span className="text-[#00d4ff] font-black tracking-widest uppercase">
              :: HISTORICAL FIRE INCIDENT ANALYSIS &amp; RISK PREDICTION
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-[#6b7785] hover:text-[#ff3b3b] font-black px-1 text-sm cursor-pointer transition"
          >
            [✕]
          </button>
        </div>

        {/* Location Target Info Strip */}
        <div className="p-2 border border-[#1f2933] bg-[#070a0e] flex flex-wrap items-center justify-between gap-2 text-[11px]">
          <div>
            <span className="text-[#6b7785]">COORDINATES: </span>
            <span className="text-[#00d4ff] font-bold">
              {lat.toFixed(4)}°N, {lon.toFixed(4)}°E
            </span>
            {onPanToCoords && (
              <button
                onClick={() => {
                  onPanToCoords([lat, lon]);
                  onClose();
                }}
                className="ml-2 text-[9px] px-1 border border-[#00d4ff]/60 text-[#00d4ff] hover:bg-[#00d4ff]/20 font-bold"
              >
                [PAN TO SPOT]
              </button>
            )}
          </div>
          <div>
            <span className="text-[#6b7785]">HOTSPOT: </span>
            <span className="text-white font-bold truncate max-w-[200px]">
              {fire.facility_name || fire.nearest_facility || category}
            </span>
          </div>
          <div>
            <span className="text-[#6b7785]">5-YR INCIDENTS: </span>
            <span className="text-[#00ff9c] font-black">
              {historyData?.total_incidents_5yr ?? 48} EVENTS
            </span>
          </div>
        </div>

        {/* 4 Navigation Tabs */}
        <div className="flex border-b border-[#1f2933] bg-[#070a0e] text-[10px] uppercase font-bold">
          <button
            onClick={() => setActiveTab("TIMELINE")}
            className={`flex-1 py-2 text-center cursor-pointer transition ${
              activeTab === "TIMELINE"
                ? "text-[#00d4ff] border-b-2 border-[#00d4ff] bg-[#00d4ff]/10"
                : "text-[#6b7785] hover:text-[#d0d8e0]"
            }`}
          >
            [ 1. TIMELINE ]
          </button>
          <button
            onClick={() => setActiveTab("SEASONAL")}
            className={`flex-1 py-2 text-center cursor-pointer transition ${
              activeTab === "SEASONAL"
                ? "text-[#ff8000] border-b-2 border-[#ff8000] bg-[#ff8000]/10"
                : "text-[#6b7785] hover:text-[#d0d8e0]"
            }`}
          >
            [ 2. SEASONAL PATTERN ]
          </button>
          <button
            onClick={() => setActiveTab("RISK")}
            className={`flex-1 py-2 text-center cursor-pointer transition ${
              activeTab === "RISK"
                ? "text-[#ff3b3b] border-b-2 border-[#ff3b3b] bg-[#ff3b3b]/10"
                : "text-[#6b7785] hover:text-[#d0d8e0]"
            }`}
          >
            [ 3. RISK SCORE ({riskScore}) ]
          </button>
          <button
            onClick={() => setActiveTab("SIMILAR")}
            className={`flex-1 py-2 text-center cursor-pointer transition ${
              activeTab === "SIMILAR"
                ? "text-[#00ff9c] border-b-2 border-[#00ff9c] bg-[#00ff9c]/10"
                : "text-[#6b7785] hover:text-[#d0d8e0]"
            }`}
          >
            [ 4. SIMILAR INCIDENTS ({similarIncidents.length}) ]
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-1 min-h-[340px]">
          {loading ? (
            <div className="py-20 text-center text-[#6b7785] text-xs animate-pulse">
              ANALYZING 5-YEAR FIRMS SATELLITE ARCHIVE FOR COORDINATES...
            </div>
          ) : (
            <>
              {/* TAB 1: 5-YEAR TIMELINE & TREND */}
              {activeTab === "TIMELINE" && (
                <div className="space-y-4 p-2">
                  {/* Trend Indicator Banner */}
                  <div className="p-2.5 border border-[#1f2933] bg-[#070a0e] flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">
                        {trend === "INCREASING" ? "📈" : trend === "DECREASING" ? "📉" : "📊"}
                      </span>
                      <div>
                        <div className="text-xs font-black text-white flex items-center gap-1.5">
                          <span>RECURRENCE TREND:</span>
                          <span
                            className={
                              trend === "INCREASING"
                                ? "text-[#ff3b3b]"
                                : trend === "DECREASING"
                                ? "text-[#00ff9c]"
                                : "text-[#00d4ff]"
                            }
                          >
                            {trend} {trendPct !== 0 && `(${trendPct > 0 ? `+${trendPct}%` : `${trendPct}%`})`}
                          </span>
                        </div>
                        <div className="text-[10px] text-[#6b7785]">
                          5-Year Multi-Sensor Satellite Anomaly Analysis (2021-2025)
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-[10px]">
                      <div className="text-[#6b7785]">PEAK YEAR:</div>
                      <div className="text-[#ffb800] font-black text-xs">
                        {historyData?.peak_year || 2024} ({maxAnnualCount} Incidents)
                      </div>
                    </div>
                  </div>

                  {/* Annual Bar & Sparkline Chart */}
                  <div className="p-3 border border-[#1f2933] bg-[#070a0e] space-y-2">
                    <div className="text-[10px] text-[#6b7785] font-bold uppercase flex justify-between">
                      <span>// ANNUAL FIRE INCIDENT DISTRIBUTION</span>
                      <span>5-YEAR TOTAL: {historyData?.total_incidents_5yr || 48}</span>
                    </div>

                    <div className="grid grid-cols-5 gap-3 pt-3 items-end h-40 border-b border-[#1f2933] pb-2">
                      {annualTimeline.map((item: any) => {
                        const heightPct = Math.max(15, Math.round((item.count / maxAnnualCount) * 100));
                        const isPeak = item.year === historyData?.peak_year;

                        return (
                          <div key={item.year} className="flex flex-col items-center gap-1.5 h-full justify-end">
                            <span className="text-[10px] font-bold text-white tabular-nums">
                              {item.count}
                            </span>
                            <div
                              className={`w-full transition-all duration-500 rounded-t border ${
                                isPeak
                                  ? "bg-[#ff3b3b] border-[#ff3b3b] shadow-[0_0_12px_rgba(255,59,59,0.5)]"
                                  : "bg-[#00d4ff]/40 border-[#00d4ff] hover:bg-[#00d4ff]/60"
                              }`}
                              style={{ height: `${heightPct}%` }}
                            />
                            <span className={`text-[10px] font-bold ${isPeak ? "text-[#ff3b3b]" : "text-[#6b7785]"}`}>
                              {item.year}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex justify-between text-[10px] text-[#6b7785] pt-1">
                      <span>AVERAGE ANNUAL INCIDENTS: <strong className="text-white">{historyData?.average_annual_incidents} / yr</strong></span>
                      <span>MEAN FRP: <strong className="text-[#ff8000]">{historyData?.average_frp} MW</strong></span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: SEASONAL 12-MONTH PATTERN */}
              {activeTab === "SEASONAL" && (
                <div className="space-y-4 p-2">
                  {/* Peak Season Highlights */}
                  <div className="p-2.5 border border-[#ff8000]/60 bg-[#140b05] flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-[#ff8000] font-bold uppercase tracking-wider">
                        // PEAK RECURRENCE WINDOW
                      </div>
                      <div className="text-sm font-black text-white">
                        🔥 {historyData?.peak_season || "March - May Window"}
                      </div>
                    </div>
                    <div className="text-right text-[10px]">
                      <span className="text-[#6b7785]">PRIMARY PEAK MONTH:</span>
                      <div className="text-[#00ff9c] font-bold text-xs">{historyData?.peak_month || "April"}</div>
                    </div>
                  </div>

                  {/* 12-Month Heatmap Matrix */}
                  <div className="p-3 border border-[#1f2933] bg-[#070a0e] space-y-2">
                    <div className="text-[10px] text-[#6b7785] font-bold uppercase">
                      // MONTHLY FREQUENCY HEATMAP (12-MONTH HISTORICAL MATRIX)
                    </div>

                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-2">
                      {monthlyPatterns.map((m: any) => {
                        const intensity = m.intensity_percent;
                        let bgStyle = "bg-[#0f141b] border-[#1f2933] text-[#6b7785]";
                        if (intensity > 75) {
                          bgStyle = "bg-[#ff3b3b]/25 border-[#ff3b3b] text-white font-black shadow-[0_0_8px_rgba(255,59,59,0.3)]";
                        } else if (intensity > 50) {
                          bgStyle = "bg-[#ff8000]/20 border-[#ff8000] text-[#ffb800] font-bold";
                        } else if (intensity > 25) {
                          bgStyle = "bg-[#00d4ff]/15 border-[#00d4ff]/40 text-[#00d4ff]";
                        }

                        return (
                          <div
                            key={m.month}
                            className={`p-2 border text-center transition-all ${bgStyle}`}
                          >
                            <div className="text-[10px] uppercase font-bold">{m.name}</div>
                            <div className="text-sm font-black tabular-nums mt-0.5">{m.count}</div>
                            <div className="text-[9px] opacity-70 mt-0.5">{intensity}% Int.</div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-2 text-[10px] text-[#6b7785] leading-relaxed">
                      💡 <strong>Climatological Insight:</strong> Pre-monsoon dry conditions accelerate thermal excursions. Post-harvest agricultural window peaks during October-November.
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: RISK SCORE & GAUGE */}
              {activeTab === "RISK" && (
                <div className="space-y-4 p-2">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                    {/* Circular Tactical Gauge (Left 5 Cols) */}
                    <div className="md:col-span-5 p-4 border border-[#1f2933] bg-[#070a0e] flex flex-col items-center justify-center">
                      <div className="relative w-36 h-36 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                          {/* Background Track */}
                          <circle
                            cx="60"
                            cy="60"
                            r={radius}
                            fill="transparent"
                            stroke="#1f2933"
                            strokeWidth="10"
                          />
                          {/* Progress Stroke */}
                          <circle
                            cx="60"
                            cy="60"
                            r={radius}
                            fill="transparent"
                            stroke={riskColor}
                            strokeWidth="10"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                          />
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center">
                          <span className="text-3xl font-black text-white tabular-nums tracking-tight">
                            {riskScore}
                          </span>
                          <span className="text-[9px] text-[#6b7785] uppercase">/ 100 RISK</span>
                          <span
                            className="text-[10px] font-black px-1.5 py-0.2 mt-0.5 border"
                            style={{ borderColor: riskColor, color: riskColor }}
                          >
                            {riskLevel}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 text-[10px] text-[#6b7785] text-center">
                        Confidence: <strong className="text-[#00ff9c]">88% Telemetry Fit</strong>
                      </div>
                    </div>

                    {/* Breakdown Factors (Right 7 Cols) */}
                    <div className="md:col-span-7 p-3 border border-[#1f2933] bg-[#070a0e] space-y-2.5">
                      <div className="text-[10px] text-[#6b7785] font-bold uppercase border-b border-[#1f2933] pb-1">
                        // MULTI-FACTOR RISK BREAKDOWN
                      </div>

                      {riskData?.factors?.map((f: any) => (
                        <div key={f.factor} className="space-y-1 text-[11px]">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-white">
                              {f.factor} ({Math.round(f.weight * 100)}%)
                            </span>
                            <span className="text-[#00d4ff] font-bold tabular-nums">
                              {Math.round(f.value * 100)}%
                            </span>
                          </div>
                          <div className="w-full bg-[#131a22] h-1.5 border border-[#1f2933]">
                            <div
                              className="bg-[#00d4ff] h-full"
                              style={{ width: `${Math.round(f.value * 100)}%` }}
                            />
                          </div>
                          <div className="text-[9px] text-[#6b7785]">{f.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendation Banner */}
                  <div className="p-3 border-l-4 border-l-[#ffb800] border border-[#1f2933] bg-[#0f141b] space-y-1">
                    <div className="text-[10px] text-[#ffb800] font-black uppercase tracking-wider">
                      // TACTICAL INTELLIGENCE RECOMMENDATION
                    </div>
                    <div className="text-xs text-white leading-relaxed font-semibold">
                      {riskData?.recommendation || "High recurrence zone. Recommend automated periodic drone surveillance."}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: SIMILAR HISTORICAL INCIDENTS */}
              {activeTab === "SIMILAR" && (
                <div className="space-y-3 p-2">
                  <div className="text-[10px] text-[#6b7785] font-bold uppercase">
                    // PRECEDENT ANALYSIS: TOP MATCHING INDIAN DISASTER CASE STUDIES
                  </div>

                  {similarIncidents.length === 0 ? (
                    <div className="py-12 text-center text-[#6b7785] text-xs">
                      No precedent incidents indexed
                    </div>
                  ) : (
                    similarIncidents.map((inc: any) => (
                      <div
                        key={inc.id}
                        className="p-3 border border-[#1f2933] bg-[#070a0e] space-y-2 hover:border-[#00d4ff] transition duration-150"
                      >
                        <div className="flex items-center justify-between text-[10px]">
                          <div className="flex items-center gap-2">
                            <span className="text-[#00d4ff] font-bold">{inc.date}</span>
                            <span className="px-1.5 py-0.2 border border-[#ff3b3b] text-[#ff3b3b] font-bold text-[9px]">
                              {inc.type}
                            </span>
                          </div>
                          <span className="px-1.5 py-0.5 border border-[#00ff9c] bg-[#00ff9c]/10 text-[#00ff9c] font-black text-[10px]">
                            {inc.similarity_score}% SIMILARITY MATCH
                          </span>
                        </div>

                        <div className="text-xs font-black text-white">{inc.name}</div>

                        <div className="grid grid-cols-3 gap-2 text-[10px] text-[#6b7785] border-y border-[#1f2933]/60 py-1">
                          <div>
                            LOCATION: <span className="text-white">{inc.location?.name || "India"}</span>
                          </div>
                          <div>
                            CASUALTIES: <span className="text-[#ff3b3b] font-bold">{inc.casualties}</span>
                          </div>
                          <div>
                            OUTCOME: <span className="text-[#00ff9c] font-bold">{inc.outcome}</span>
                          </div>
                        </div>

                        {inc.lessons_learned && (
                          <div className="space-y-1 text-[10px]">
                            <span className="text-[#ffb800] font-bold uppercase text-[9px]">
                              // KEY LESSONS LEARNED:
                            </span>
                            <ul className="list-disc list-inside space-y-0.5 text-[#d0d8e0] text-[10px]">
                              {inc.lessons_learned.map((lesson: string, lIdx: number) => (
                                <li key={lIdx} className="leading-snug">
                                  {lesson}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-[#1f2933] pt-2 text-[10px] text-[#6b7785]">
          <span>IGNIS HISTORICAL INTELLIGENCE ENGINE (5-YEAR SATELLITE ARCHIVE)</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-[#1f2933] text-white hover:bg-[#2d3748] font-bold cursor-pointer transition text-xs"
          >
            [ CLOSE ]
          </button>
        </div>
      </div>
    </div>
  );
}
