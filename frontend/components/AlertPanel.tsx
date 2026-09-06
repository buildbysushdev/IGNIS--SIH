"use client";

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
}

export default function AlertPanel({ alerts = [] }: AlertPanelProps) {
  const safeAlerts = Array.isArray(alerts) ? alerts : [];
  const count = safeAlerts.length;

  return (
    <div className="bg-[#0f172a] border border-slate-700/80 rounded-2xl p-5 shadow-2xl flex flex-col gap-3.5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 tracking-tight">
          🚨 Critical Threat Feed
        </h2>
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
            count > 0
              ? "bg-red-950/80 text-red-300 border border-red-700 animate-pulse"
              : "bg-emerald-950/80 text-emerald-300 border border-emerald-800"
          }`}
        >
          {count} {count === 1 ? "Active Alert" : "Active Alerts"}
        </span>
      </div>

      {/* Content */}
      {count === 0 ? (
        <div className="py-7 text-center rounded-xl bg-slate-900/40 border border-slate-800/80 flex flex-col items-center justify-center gap-1.5 px-4">
          <div className="w-9 h-9 rounded-full bg-emerald-950/70 border border-emerald-800 flex items-center justify-center text-emerald-400 text-base">
            ✓
          </div>
          <span className="text-emerald-300 font-semibold text-xs mt-1">
            No Critical Industrial Threats
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            Surveillance grid is calm and within operational baseline
          </span>
        </div>
      ) : (
        <div className="max-h-[240px] overflow-y-auto space-y-2 pr-1">
          {safeAlerts.map((alert, idx) => {
            const isCritical = alert.severity === "CRITICAL";
            const timeStr = alert.timestamp || alert.created_at;
            const formattedTime = (() => {
              if (!timeStr) return "LIVE";
              try {
                const d = new Date(timeStr);
                return isNaN(d.getTime())
                  ? timeStr
                  : d.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    });
              } catch {
                return String(timeStr);
              }
            })();

            const hasCoords = alert.latitude != null && alert.longitude != null;

            return (
              <div
                key={alert.id ?? idx}
                className="border-l-4 border-red-500 bg-slate-900/90 p-3 rounded-r-xl border border-l-0 border-slate-800 flex flex-col gap-1 shadow-sm transition hover:bg-slate-850"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {isCritical && (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                      </span>
                    )}
                    <span className="font-mono font-bold text-red-400 text-[11px] uppercase tracking-wider">
                      {alert.severity}
                    </span>
                    {hasCoords && (
                      <span className="text-slate-400 font-mono text-[11px]">
                        [{Number(alert.latitude).toFixed(2)}, {Number(alert.longitude).toFixed(2)}]
                      </span>
                    )}
                  </div>
                  <span className="text-slate-500 font-mono text-[11px]">
                    {formattedTime}
                  </span>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed font-sans mt-0.5">
                  {alert.message}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
