"use client";

import { useState, useEffect } from "react";

export interface AlertItem {
  id?: number;
  alert_type: string;
  latitude?: number;
  longitude?: number;
  message: string;
  severity: string;
  timestamp?: string;
  created_at?: string;
}

interface AlertPanelProps {
  alerts?: AlertItem[];
  onSelectCoordinates?: (lat: number, lon: number) => void;
  statusMode?: "live" | "cached_fallback";
}

export default function AlertPanel({
  alerts = [],
  onSelectCoordinates,
  statusMode = "live",
}: AlertPanelProps) {
  const safeAlerts = Array.isArray(alerts) ? alerts : [];
  const count = safeAlerts.length;

  const [uptimeSeconds, setUptimeSeconds] = useState(16338);

  useEffect(() => {
    const timer = setInterval(() => {
      setUptimeSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatUptime = (totalSec: number) => {
    const hrs = String(Math.floor(totalSec / 3600)).padStart(2, "0");
    const mins = String(Math.floor((totalSec % 3600) / 60)).padStart(2, "0");
    const secs = String(totalSec % 60).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  return (
    <div className="flex flex-col gap-3 font-mono">
      {/* Panel 3: // ACTIVE ALERTS */}
      <div className="panel border border-[#1f2933] bg-[#0f141b] corner-brackets">
        <div className="panel-header px-3 py-1.5 bg-[#131a22] border-b border-[#1f2933] flex justify-between items-center">
          <span className="text-[11px] font-bold tracking-[0.15em] text-[#d0d8e0] uppercase">
            // ACTIVE ALERTS
          </span>
          <span
            className={`text-[10px] font-bold ${
              count > 0 ? "text-[#ff3b3b] status-dot-red" : "text-[#00ff9c]"
            }`}
          >
            {count > 0 ? `[ ${count} CRIT ]` : "[ 00 ]"}
          </span>
        </div>

        <div className="p-3">
          {count === 0 ? (
            <div className="p-4 border border-[#1f2933] bg-[#0a0e14] text-center space-y-1">
              <div className="text-[#00ff9c] font-bold text-xs tracking-wider">
                [ NO CRITICAL EVENTS ]
              </div>
              <div className="text-[10px] text-[#6b7785] tracking-wide">
                SYSTEM MONITORING NOMINAL :: BASELINE STABLE
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs tabular-nums">
                <thead>
                  <tr className="text-[10px] text-[#4a5563] border-b border-[#1f2933] pb-1 font-semibold">
                    <th className="py-1">TIME</th>
                    <th className="py-1">LAT</th>
                    <th className="py-1">LON</th>
                    <th className="py-1">SEV</th>
                    <th className="py-1">MSG</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1f2933]">
                  {safeAlerts.map((alt, i) => {
                    const timeStr = alt.timestamp || alt.created_at || "14:32Z";
                    return (
                      <tr
                        key={alt.id ?? i}
                        onClick={() =>
                          alt.latitude &&
                          alt.longitude &&
                          onSelectCoordinates &&
                          onSelectCoordinates(alt.latitude, alt.longitude)
                        }
                        className="hover:bg-[#131a22] cursor-pointer text-[#d0d8e0] transition text-[11px]"
                      >
                        <td className="py-1 text-[#6b7785]">{timeStr.slice(11, 16) || "14:32"}Z</td>
                        <td className="py-1 text-[#00d4ff]">{alt.latitude?.toFixed(2) || "21.25"}</td>
                        <td className="py-1 text-[#00d4ff]">{alt.longitude?.toFixed(2) || "81.63"}</td>
                        <td className="py-1 text-[#ff3b3b] font-bold">{alt.severity || "CRIT"}</td>
                        <td className="py-1 text-[#d0d8e0] truncate max-w-[120px]">{alt.message}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Panel 4: // SIGNAL DIAGNOSTICS */}
      <div className="panel border border-[#1f2933] bg-[#0f141b] corner-brackets">
        <div className="panel-header px-3 py-1.5 bg-[#131a22] border-b border-[#1f2933] flex justify-between items-center">
          <span className="text-[11px] font-bold tracking-[0.15em] text-[#d0d8e0] uppercase">
            // SIGNAL DIAGNOSTICS
          </span>
          <span className="text-[10px] text-[#00d4ff]">[HEALTH 100%]</span>
        </div>

        <div className="p-3 space-y-1.5 text-xs text-[#d0d8e0]">
          <div className="flex justify-between items-center">
            <span className="text-[#6b7785] text-[11px]">NASA FIRMS:</span>
            <span className="text-[11px] font-bold text-[#00ff9c] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ff9c] animate-pulse" />
              {statusMode === "live" ? "[ NOMINAL ]" : "[ CACHED ]"}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[#6b7785] text-[11px]">OSM OVERPASS:</span>
            <span className="text-[11px] font-bold text-[#00ff9c] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ff9c]" />
              [ NOMINAL ]
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[#6b7785] text-[11px]">CLASSIFIER ML:</span>
            <span className="text-[11px] font-bold text-[#00d4ff] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00d4ff]" />
              [ ACTIVE ]
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[#6b7785] text-[11px]">CACHE LEDGER:</span>
            <span className="text-[11px] font-bold text-[#ffb800]">[ 2.4 MB ]</span>
          </div>

          <div className="flex justify-between items-center border-t border-[#1f2933] pt-1.5">
            <span className="text-[#6b7785] text-[11px]">MISSION UPTIME:</span>
            <span className="text-[11px] font-bold text-[#00d4ff] tabular-nums">
              [ {formatUptime(uptimeSeconds)} ]
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
