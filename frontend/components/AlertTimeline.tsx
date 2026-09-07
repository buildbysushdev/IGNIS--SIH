"use client";

import { useState, useEffect, useMemo } from "react";
import axios from "axios";

export interface TimelineAlert {
  id: number | string;
  detection_id?: number;
  alert_type: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | string;
  message: string;
  created_at: string;
  status: "NEW" | "ACKNOWLEDGED" | "DISPATCHED" | "ESCALATED" | "RESOLVED" | "FALSE_ALARM" | string;
  acknowledged_at?: string | null;
  action_taken?: string | null;
  response_time_seconds?: number | null;
  latitude?: number;
  longitude?: number;
  frp?: number;
  classification?: string;
}

interface AlertTimelineProps {
  onPanToFire?: (coords: [number, number]) => void;
  onSelectAlert?: (alert: TimelineAlert) => void;
}

export default function AlertTimeline({ onPanToFire, onSelectAlert }: AlertTimelineProps) {
  const [timelineData, setTimelineData] = useState<TimelineAlert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [hoursWindow, setHoursWindow] = useState<number>(24);

  const fetchTimeline = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`/api/notifications/timeline?hours=${hoursWindow}`);
      if (Array.isArray(res.data)) {
        setTimelineData(res.data);
      }
    } catch (err: any) {
      console.warn("[IGNIS] Failed to fetch timeline:", err?.message);
      setError("Unable to sync timeline log");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeline();
    const timer = setInterval(fetchTimeline, 30000);
    return () => clearInterval(timer);
  }, [hoursWindow]);

  // Filter alerts by status
  const filteredAlerts = useMemo(() => {
    if (statusFilter === "ALL") return timelineData;
    return timelineData.filter(
      (a) => (a.status || "NEW").toUpperCase() === statusFilter.toUpperCase()
    );
  }, [timelineData, statusFilter]);

  // Group alerts by hour block
  const groupedByHour = useMemo(() => {
    const groups: { [key: string]: TimelineAlert[] } = {};
    const now = new Date();

    filteredAlerts.forEach((alert) => {
      try {
        const d = new Date(alert.created_at);
        if (isNaN(d.getTime())) {
          groups["RECENT"] = groups["RECENT"] || [];
          groups["RECENT"].push(alert);
          return;
        }
        const hourDiff = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60));
        const hourStr =
          hourDiff <= 0
            ? "CURRENT HOUR (T-0)"
            : hourDiff === 1
            ? "T-1 HOUR AGO"
            : `T-${hourDiff} HOURS AGO (${d.getUTCHours().toString().padStart(2, "0")}:00 UTC)`;

        if (!groups[hourStr]) {
          groups[hourStr] = [];
        }
        groups[hourStr].push(alert);
      } catch {
        groups["HISTORICAL"] = groups["HISTORICAL"] || [];
        groups["HISTORICAL"].push(alert);
      }
    });

    return groups;
  }, [filteredAlerts]);

  // Format relative timestamp
  const getRelativeTime = (isoString: string) => {
    try {
      const diffSec = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
      if (diffSec < 60) return `${Math.max(1, diffSec)}s ago`;
      const diffMin = Math.floor(diffSec / 60);
      if (diffMin < 60) return `${diffMin}m ago`;
      const diffHr = Math.floor(diffMin / 60);
      return `${diffHr}h ${diffMin % 60}m ago`;
    } catch {
      return "just now";
    }
  };

  // Trigger browser print dialog for PDF export
  const handleExportPDF = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const getStatusBadge = (status: string) => {
    const s = (status || "NEW").toUpperCase();
    switch (s) {
      case "NEW":
        return (
          <span className="text-[9px] font-bold px-1.5 py-0.5 border border-[#ff3b3b] text-[#ff3b3b] bg-[#ff3b3b]/10 animate-pulse">
            NEW
          </span>
        );
      case "ACKNOWLEDGED":
        return (
          <span className="text-[9px] font-bold px-1.5 py-0.5 border border-[#ffb800] text-[#ffb800] bg-[#ffb800]/10">
            ACKNOWLEDGED
          </span>
        );
      case "DISPATCHED":
        return (
          <span className="text-[9px] font-bold px-1.5 py-0.5 border border-[#00ff9c] text-[#00ff9c] bg-[#00ff9c]/10">
            DISPATCHED
          </span>
        );
      case "ESCALATED":
        return (
          <span className="text-[9px] font-bold px-1.5 py-0.5 border border-[#ff00ea] text-[#ff00ea] bg-[#ff00ea]/10">
            ESCALATED
          </span>
        );
      case "FALSE_ALARM":
        return (
          <span className="text-[9px] font-bold px-1.5 py-0.5 border border-[#6b7785] text-[#6b7785] bg-[#6b7785]/10">
            FALSE ALARM
          </span>
        );
      default:
        return (
          <span className="text-[9px] font-bold px-1.5 py-0.5 border border-[#00d4ff] text-[#00d4ff]">
            {s}
          </span>
        );
    }
  };

  const getCategoryChip = (cat?: string) => {
    const c = (cat || "UNKNOWN").toUpperCase();
    if (c.includes("EMERGENCY")) {
      return <span className="text-[9px] text-[#ff3b3b] bg-[#ff3b3b]/10 px-1 border border-[#ff3b3b]/40">EMERGENCY INDUSTRIAL</span>;
    }
    if (c.includes("PERSISTENT")) {
      return <span className="text-[9px] text-[#ff8000] bg-[#ff8000]/10 px-1 border border-[#ff8000]/40">PERSISTENT INDUSTRIAL</span>;
    }
    if (c.includes("FOREST")) {
      return <span className="text-[9px] text-[#00ff9c] bg-[#00ff9c]/10 px-1 border border-[#00ff9c]/40">FOREST FIRE</span>;
    }
    if (c.includes("AGRICULT")) {
      return <span className="text-[9px] text-[#ffb800] bg-[#ffb800]/10 px-1 border border-[#ffb800]/40">AGRICULTURAL</span>;
    }
    return <span className="text-[9px] text-[#00d4ff] bg-[#00d4ff]/10 px-1 border border-[#00d4ff]/40">{c}</span>;
  };

  return (
    <div className="flex flex-col h-full font-mono text-[#d0d8e0] select-none">
      {/* Printable Report Header (Active on print/PDF export) */}
      <div className="hidden print:block mb-4 p-4 border border-black text-black">
        <h1 className="text-xl font-black">IGNIS :: DISASTER INCIDENT COMMAND TIMELINE</h1>
        <p className="text-xs">NTRO SIH26162 — National Thermal Anomaly Early Warning Log</p>
        <p className="text-[10px] mt-1">Generated: {new Date().toISOString()} | Window: Last {hoursWindow} Hours</p>
      </div>

      {/* Control Bar: Filters & PDF Action */}
      <div className="p-2.5 bg-[#0a0e14] border-b border-[#1f2933] flex flex-wrap items-center justify-between gap-2 text-[10px] print:hidden">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[#6b7785] font-bold">STATUS:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#0f141b] border border-[#1f2933] text-[#00d4ff] px-2 py-1 text-[10px] focus:outline-none focus:border-[#00d4ff]"
          >
            <option value="ALL">ALL STATUSES ({timelineData.length})</option>
            <option value="NEW">NEW</option>
            <option value="ACKNOWLEDGED">ACKNOWLEDGED</option>
            <option value="DISPATCHED">DISPATCHED</option>
            <option value="ESCALATED">ESCALATED</option>
            <option value="FALSE_ALARM">FALSE ALARM</option>
          </select>

          <span className="text-[#6b7785] font-bold ml-1">WINDOW:</span>
          <select
            value={hoursWindow}
            onChange={(e) => setHoursWindow(Number(e.target.value))}
            className="bg-[#0f141b] border border-[#1f2933] text-[#00d4ff] px-2 py-1 text-[10px] focus:outline-none focus:border-[#00d4ff]"
          >
            <option value={12}>12H</option>
            <option value={24}>24H</option>
            <option value={48}>48H</option>
            <option value={72}>72H</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchTimeline}
            className="px-2 py-1 border border-[#1f2933] text-[#6b7785] hover:text-white hover:border-[#00d4ff] transition"
            title="Refresh Timeline"
          >
            [ REFRESH ]
          </button>
          <button
            onClick={handleExportPDF}
            className="px-2.5 py-1 bg-[#ffb800]/10 border border-[#ffb800] text-[#ffb800] hover:bg-[#ffb800]/20 font-bold transition flex items-center gap-1"
          >
            <span>🗎</span>
            <span>EXPORT PDF REPORT</span>
          </button>
        </div>
      </div>

      {/* Timeline Stream Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {loading && timelineData.length === 0 ? (
          <div className="py-12 text-center text-[#6b7785] text-xs animate-pulse">
            LOADING SURVEILLANCE TIMELINE...
          </div>
        ) : error && timelineData.length === 0 ? (
          <div className="py-8 text-center text-[#ff3b3b] text-xs">
            {error}
          </div>
        ) : Object.keys(groupedByHour).length === 0 ? (
          <div className="py-12 text-center text-[#6b7785] text-xs space-y-1">
            <div className="text-white font-bold">[ NO ALERTS IN TIMELINE ]</div>
            <div>No logged incidents match the &quot;{statusFilter}&quot; status filter</div>
          </div>
        ) : (
          Object.entries(groupedByHour).map(([hourGroup, alerts]) => (
            <div key={hourGroup} className="space-y-2">
              {/* Hourly Group Divider */}
              <div className="sticky top-0 z-10 bg-[#070a0e]/95 backdrop-blur-sm border-b border-[#1f2933] py-1 flex items-center justify-between">
                <span className="text-[10px] font-black text-[#00d4ff] tracking-wider uppercase flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#00d4ff] rounded-full inline-block" />
                  {hourGroup}
                </span>
                <span className="text-[9px] text-[#6b7785] font-bold">
                  {alerts.length} {alerts.length === 1 ? "EVENT" : "EVENTS"}
                </span>
              </div>

              {/* Vertical Chain Items */}
              <div className="relative pl-4 space-y-2.5 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-[#1f2933]">
                {alerts.map((alert) => {
                  const lat = alert.latitude;
                  const lon = alert.longitude;
                  const isAck = alert.status === "ACKNOWLEDGED" || alert.status === "DISPATCHED";

                  return (
                    <div
                      key={alert.id}
                      className={`relative p-2.5 border transition duration-200 cursor-pointer ${
                        alert.status === "NEW"
                          ? "border-[#ff3b3b]/60 bg-[#130708]/80 hover:border-[#ff3b3b]"
                          : isAck
                          ? "border-[#00ff9c]/40 bg-[#05110d]/70 hover:border-[#00ff9c]"
                          : alert.status === "ESCALATED"
                          ? "border-[#ff00ea]/50 bg-[#140612]/70 hover:border-[#ff00ea]"
                          : "border-[#1f2933] bg-[#0a0e14] hover:border-[#00d4ff]"
                      }`}
                      onClick={() => onSelectAlert && onSelectAlert(alert)}
                    >
                      {/* Timeline Node Point on Vertical Line */}
                      <span
                        className={`absolute -left-[14px] top-3.5 w-2 h-2 rounded-full border ${
                          alert.status === "NEW"
                            ? "bg-[#ff3b3b] border-white animate-ping"
                            : alert.status === "DISPATCHED"
                            ? "bg-[#00ff9c] border-black"
                            : alert.status === "ESCALATED"
                            ? "bg-[#ff00ea] border-white"
                            : "bg-[#6b7785] border-black"
                        }`}
                      />

                      {/* Header Line: ID + Status + Timestamp */}
                      <div className="flex items-center justify-between text-[10px] gap-2 mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-[#00d4ff]">#{alert.id}</span>
                          {getStatusBadge(alert.status)}
                        </div>
                        <div className="text-[10px] text-[#6b7785] tabular-nums text-right">
                          <span className="text-[#d0d8e0] font-bold">{getRelativeTime(alert.created_at)}</span>
                          <span className="ml-1 text-[9px] opacity-70">({alert.created_at.slice(11, 19)} UTC)</span>
                        </div>
                      </div>

                      {/* Category Chip & FRP */}
                      <div className="flex items-center justify-between text-[10px] gap-1 mb-1">
                        <div>{getCategoryChip(alert.classification)}</div>
                        {alert.frp !== undefined && (
                          <span className="text-[10px] text-[#ff8000] font-bold tabular-nums">
                            FRP: {Number(alert.frp).toFixed(1)} MW
                          </span>
                        )}
                      </div>

                      {/* Message Body */}
                      <div className="text-[11px] text-white leading-snug line-clamp-2">
                        {alert.message}
                      </div>

                      {/* Footnotes: Location Coords & Response Time Log */}
                      <div className="mt-2 pt-1.5 border-t border-[#1f2933]/60 flex items-center justify-between text-[9px] text-[#6b7785]">
                        <div className="flex items-center gap-2">
                          {lat !== undefined && lon !== undefined ? (
                            <span className="tabular-nums text-[#00d4ff]">
                              {lat.toFixed(4)}°N, {lon.toFixed(4)}°E
                            </span>
                          ) : (
                            <span>COORDS N/A</span>
                          )}
                          {lat !== undefined && lon !== undefined && onPanToFire && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onPanToFire([lat, lon]);
                              }}
                              className="px-1 border border-[#00d4ff]/60 text-[#00d4ff] hover:bg-[#00d4ff]/20 font-bold"
                            >
                              [MAP]
                            </button>
                          )}
                        </div>

                        {alert.response_time_seconds !== null && alert.response_time_seconds !== undefined && (
                          <span className="text-[#00ff9c] font-bold tabular-nums">
                            ⏱ RESP: {alert.response_time_seconds}s
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Status Counter */}
      <div className="p-2 border-t border-[#1f2933] bg-[#070a0e] text-[10px] text-[#6b7785] flex items-center justify-between">
        <span>LOGGED INCIDENTS: {filteredAlerts.length}</span>
        <span className="text-[#00ff9c]">DATABASE SYNCED</span>
      </div>
    </div>
  );
}
