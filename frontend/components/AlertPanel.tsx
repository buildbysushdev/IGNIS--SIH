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
  onSelectCoordinates?: (lat: number, lon: number) => void;
}

export default function AlertPanel({ alerts = [], onSelectCoordinates }: AlertPanelProps) {
  const safeAlerts = Array.isArray(alerts) ? alerts : [];
  const count = safeAlerts.length;

  return (
    <div className="glass-card rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-2xl flex flex-col gap-3.5 border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            {count > 0 ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
              </>
            ) : (
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            )}
          </span>
          <h2 className="text-base font-extrabold text-white tracking-tight uppercase font-mono">
            Surveillance Alerts
          </h2>
        </div>
        <span
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
            count > 0
              ? "bg-red-950/80 text-red-300 border border-red-700 animate-pulse glow-red"
              : "bg-emerald-950/80 text-emerald-300 border border-emerald-800"
          }`}
        >
          {count > 0 ? `${count} CRITICAL THREATS` : "GRID SECURE"}
        </span>
      </div>

      {/* Content */}
      {count === 0 ? (
        <div className="py-8 px-4 text-center rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 flex items-center justify-center text-xl text-emerald-400 shadow-inner">
            🛡️
          </div>
          <span className="text-emerald-300 font-bold text-sm tracking-tight mt-1">
            No critical industrial emergencies in this window
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            Persistent industrial sources filtered • Automated baseline active
          </span>
        </div>
      ) : (
        <div className="max-h-[260px] overflow-y-auto space-y-2.5 pr-1">
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
                className="relative overflow-hidden rounded-xl bg-red-950/20 border border-red-900/40 p-3 flex flex-col gap-1.5 transition hover:border-red-500/50 hover:bg-red-950/30"
              >
                {/* Left Red Neon Border */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 glow-red" />

                <div className="flex items-center justify-between text-xs pl-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-extrabold text-red-400 text-[10px] uppercase tracking-wider bg-red-950 px-2 py-0.5 rounded border border-red-800">
                      {alert.severity}
                    </span>
                    {hasCoords && (
                      <span
                        onClick={() =>
                          onSelectCoordinates &&
                          onSelectCoordinates(alert.latitude!, alert.longitude!)
                        }
                        className="text-slate-400 font-mono text-[10px] hover:text-cyan-300 cursor-pointer transition flex items-center gap-1"
                        title="Jump to location"
                      >
                        <span>📍</span>
                        <span>[{Number(alert.latitude).toFixed(2)}°, {Number(alert.longitude).toFixed(2)}°]</span>
                      </span>
                    )}
                  </div>
                  <span className="text-slate-500 font-mono text-[10px]">
                    {formattedTime}
                  </span>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed font-sans pl-1">
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
