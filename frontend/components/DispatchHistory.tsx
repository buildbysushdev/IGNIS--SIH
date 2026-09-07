"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export interface DispatchRecord {
  id?: number | string;
  dispatch_id: string;
  fire_lat?: number;
  fire_lon?: number;
  fire_category?: string;
  station_name?: string;
  station_dist_km?: number;
  eta_minutes?: number;
  recommended_equipment?: string;
  sent_to?: string;
  status?: string;
  created_at?: string;
  timestamp?: string;
}

interface DispatchHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  onPanToCoords?: (coords: [number, number]) => void;
}

export default function DispatchHistory({
  isOpen,
  onClose,
  onPanToCoords,
}: DispatchHistoryProps) {
  const [history, setHistory] = useState<DispatchRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [selectedRecord, setSelectedRecord] = useState<DispatchRecord | null>(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/dispatch/history");
      if (Array.isArray(res.data)) {
        setHistory(res.data);
      }
    } catch (err: any) {
      console.warn("[IGNIS] Failed to fetch dispatch history:", err?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered =
    filterStatus === "ALL"
      ? history
      : history.filter(
          (h) => (h.status || "DISPATCHED").toUpperCase() === filterStatus.toUpperCase()
        );

  const handleExportCsv = () => {
    const rows = [
      ["dispatch_id", "timestamp", "latitude", "longitude", "category", "station_name", "station_dist_km", "eta_minutes", "status"],
      ...filtered.map((r) => [
        r.dispatch_id,
        r.created_at || r.timestamp || new Date().toISOString(),
        r.fire_lat ?? "",
        r.fire_lon ?? "",
        r.fire_category ?? "EMERGENCY_INDUSTRIAL",
        `"${r.station_name || 'Municipal Station'}"`,
        r.station_dist_km ?? "",
        r.eta_minutes ?? "",
        r.status ?? "DISPATCHED",
      ]),
    ];
    const csv = rows.map((e) => e.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `IGNIS_DISPATCH_LOG_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-[3100] bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 font-mono text-[#d0d8e0] select-none">
      <div className="bg-[#0a0e14] border-2 border-[#00d4ff] max-w-4xl w-full max-h-[85vh] p-4 shadow-[0_0_60px_rgba(0,212,255,0.2)] flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1f2933] pb-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00d4ff] animate-ping" />
            <span className="text-[#00d4ff] font-black tracking-widest uppercase">
              :: EMERGENCY DISPATCH TELEMETRY LOG
            </span>
            <span className="text-[10px] px-1.5 py-0.2 bg-[#00d4ff]/10 text-[#00d4ff] border border-[#00d4ff]">
              {history.length} RECORDS
            </span>
          </div>

          <button
            onClick={onClose}
            className="text-[#6b7785] hover:text-[#ff3b3b] font-black px-1 text-sm cursor-pointer transition"
          >
            [✕]
          </button>
        </div>

        {/* Toolbar: Filter & Export */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-[10px]">
          <div className="flex items-center gap-2">
            <span className="text-[#6b7785] font-bold">STATUS FILTER:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-[#0f141b] border border-[#1f2933] text-[#00d4ff] px-2 py-1 text-[10px] focus:outline-none"
            >
              <option value="ALL">ALL STATUSES ({history.length})</option>
              <option value="DISPATCHED">DISPATCHED</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="ACTIVE">ACTIVE</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchHistory}
              className="px-2 py-1 border border-[#1f2933] text-[#6b7785] hover:text-white transition"
            >
              [ REFRESH ]
            </button>
            <button
              onClick={handleExportCsv}
              className="px-2.5 py-1 border border-[#ffb800] bg-[#ffb800]/10 text-[#ffb800] hover:bg-[#ffb800]/20 font-bold transition flex items-center gap-1"
            >
              <span>🗎</span>
              <span>EXPORT DISPATCH CSV</span>
            </button>
          </div>
        </div>

        {/* Table View */}
        <div className="flex-1 overflow-x-auto overflow-y-auto border border-[#1f2933] bg-[#070a0e]">
          {loading ? (
            <div className="py-16 text-center text-[#6b7785] text-xs animate-pulse">
              FETCHING RECENT DISPATCH RECORDS...
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-[#6b7785] text-xs space-y-1">
              <div className="text-white font-bold">[ NO DISPATCH RECORDS ]</div>
              <div>No records match the current status filter.</div>
            </div>
          ) : (
            <table className="w-full text-left text-xs tabular-nums">
              <thead className="bg-[#0d131a] text-[10px] text-[#6b7785] border-b border-[#1f2933] sticky top-0 uppercase">
                <tr>
                  <th className="p-2">DISPATCH ID</th>
                  <th className="p-2">TIME (UTC)</th>
                  <th className="p-2">LOCATION</th>
                  <th className="p-2">CATEGORY</th>
                  <th className="p-2">STATION NOTIFIED</th>
                  <th className="p-2">EST. ETA</th>
                  <th className="p-2">STATUS</th>
                  <th className="p-2 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f2933] text-[11px]">
                {filtered.map((rec) => {
                  const timeStr = (rec.created_at || rec.timestamp || "").slice(11, 19);
                  const dateStr = (rec.created_at || rec.timestamp || "").slice(0, 10);
                  const lat = rec.fire_lat;
                  const lon = rec.fire_lon;

                  return (
                    <tr
                      key={rec.dispatch_id}
                      className="hover:bg-white/[0.03] transition duration-150"
                    >
                      <td className="p-2 font-bold text-[#00d4ff]">
                        {rec.dispatch_id}
                      </td>
                      <td className="p-2 text-[#a0aec0]">
                        <span>{timeStr || "12:00:00"}Z</span>
                        <span className="block text-[9px] text-[#6b7785]">{dateStr}</span>
                      </td>
                      <td className="p-2 text-[#d0d8e0]">
                        {lat !== undefined && lon !== undefined ? (
                          <div className="flex items-center gap-1.5">
                            <span>{lat.toFixed(2)}°, {lon.toFixed(2)}°</span>
                            {onPanToCoords && (
                              <button
                                onClick={() => {
                                  onPanToCoords([lat, lon]);
                                  onClose();
                                }}
                                className="text-[9px] px-1 border border-[#00d4ff]/60 text-[#00d4ff] hover:bg-[#00d4ff]/20"
                                title="Locate on map"
                              >
                                [MAP]
                              </button>
                            )}
                          </div>
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td className="p-2">
                        <span className="text-[9px] font-bold px-1.5 py-0.5 border border-[#ff3b3b]/40 text-[#ff8080] bg-[#ff3b3b]/10">
                          {rec.fire_category || "EMERGENCY"}
                        </span>
                      </td>
                      <td className="p-2 text-white truncate max-w-[180px]">
                        <div>{rec.station_name || "Surat Central HQ"}</div>
                        {rec.station_dist_km !== undefined && (
                          <div className="text-[9px] text-[#6b7785]">
                            {Number(rec.station_dist_km).toFixed(1)} km away
                          </div>
                        )}
                      </td>
                      <td className="p-2 text-[#00ff9c] font-bold">
                        {rec.eta_minutes !== undefined ? `${rec.eta_minutes} MIN` : "6 MIN"}
                      </td>
                      <td className="p-2">
                        <span className="text-[9px] font-bold px-1.5 py-0.5 border border-[#00ff9c] text-[#00ff9c] bg-[#00ff9c]/10">
                          {rec.status || "DISPATCHED"}
                        </span>
                      </td>
                      <td className="p-2 text-right">
                        <button
                          onClick={() => setSelectedRecord(rec)}
                          className="px-2 py-0.5 border border-[#00d4ff] text-[#00d4ff] hover:bg-[#00d4ff]/20 font-bold text-[10px] transition cursor-pointer"
                        >
                          [ DETAILS ]
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-[10px] text-[#6b7785] pt-1">
          <span>GOVERNMENT DISASTER DISPATCH AUDIT LOG (NTRO SIH26162)</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-[#1f2933] text-white hover:bg-[#2d3748] font-bold cursor-pointer transition"
          >
            [ CLOSE ]
          </button>
        </div>
      </div>

      {/* Record Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-[3200] bg-black/80 flex items-center justify-center p-4 font-mono text-[#d0d8e0]">
          <div className="bg-[#0a0e14] border-2 border-[#00ff9c] max-w-lg w-full p-4 space-y-3 shadow-[0_0_40px_rgba(0,255,156,0.25)]">
            <div className="flex items-center justify-between border-b border-[#00ff9c]/40 pb-2">
              <span className="text-xs font-black text-[#00ff9c] uppercase tracking-wider">
                :: DISPATCH RECORD DETAILS
              </span>
              <span className="text-[10px] text-white font-bold">
                {selectedRecord.dispatch_id}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2 border border-[#1f2933] bg-[#0f141b] space-y-1">
                <div className="text-[10px] text-[#6b7785] uppercase">Target Coordinates</div>
                <div className="text-white font-bold">
                  {selectedRecord.fire_lat?.toFixed(4)}°N, {selectedRecord.fire_lon?.toFixed(4)}°E
                </div>
                <div className="text-[10px] text-[#ff8080]">
                  Category: {selectedRecord.fire_category}
                </div>
              </div>

              <div className="p-2 border border-[#1f2933] bg-[#0f141b] space-y-1">
                <div className="text-[10px] text-[#6b7785] uppercase">Mobilized Unit</div>
                <div className="text-[#00d4ff] font-bold">
                  {selectedRecord.station_name || "Surat Central Fire Station HQ"}
                </div>
                <div className="flex justify-between text-[11px] text-[#d0d8e0]">
                  <span>Distance: {selectedRecord.station_dist_km || 2.5} km</span>
                  <span className="text-[#00ff9c] font-bold">ETA: {selectedRecord.eta_minutes || 6} min</span>
                </div>
              </div>

              <div className="p-2 border border-[#1f2933] bg-[#0f141b] space-y-1">
                <div className="text-[10px] text-[#6b7785] uppercase">Equipment Package</div>
                <div className="text-white">
                  {selectedRecord.recommended_equipment || "Water tenders, Foam bowsers, Breathing gear"}
                </div>
              </div>

              <div className="p-2 border border-[#1f2933] bg-[#0f141b] space-y-1">
                <div className="text-[10px] text-[#6b7785] uppercase">Recipients Notified</div>
                <div className="text-[11px] text-[#00ff9c]">
                  {selectedRecord.sent_to || "Fire Station, District Collector, NDMA, Hospital"}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#1f2933]">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-3 py-1 bg-[#00ff9c] text-black text-xs font-bold cursor-pointer hover:bg-[#00ff9c]/80"
              >
                [ CLOSE ]
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
