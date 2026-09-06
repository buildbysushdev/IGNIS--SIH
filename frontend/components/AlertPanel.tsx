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
  alerts: AlertItem[];
}

export default function AlertPanel({ alerts }: AlertPanelProps) {
  const count = alerts.length;

  return (
    <div className="bg-[#1e293b] border border-slate-700/60 rounded-xl p-6 shadow-xl flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-700 pb-3">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          🚨 Active Alerts
        </h2>
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold ${
            count > 0
              ? "bg-red-950 text-red-400 border border-red-800"
              : "bg-emerald-950 text-emerald-400 border border-emerald-800"
          }`}
        >
          {count} {count === 1 ? "Alert" : "Alerts"}
        </span>
      </div>

      {/* Content */}
      {count === 0 ? (
        <div className="py-8 text-center text-emerald-400 font-medium text-sm flex flex-col items-center justify-center gap-1">
          <span>✅ No emergency alerts</span>
          <span className="text-xs text-slate-400">
            Surveillance perimeter currently stable
          </span>
        </div>
      ) : (
        <div className="max-h-[250px] overflow-y-auto space-y-2.5 pr-1">
          {alerts.map((alert, idx) => {
            const isCritical = alert.severity === "CRITICAL";
            const timeStr = alert.timestamp || alert.created_at;
            const formattedTime = timeStr
              ? new Date(timeStr).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })
              : "LIVE";

            const hasCoords = alert.latitude != null && alert.longitude != null;

            return (
              <div
                key={alert.id ?? idx}
                className="border-l-4 border-red-600 bg-slate-900/80 p-3 rounded-r-lg border border-l-0 border-slate-800 flex flex-col gap-1.5 transition hover:bg-slate-900"
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

                <p className="text-xs text-slate-200 leading-relaxed font-sans">
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
