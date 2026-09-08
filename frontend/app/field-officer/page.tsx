"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import FieldReportForm from "@/components/FieldReportForm";
import AccuracyDashboard from "@/components/AccuracyDashboard";

interface FireIncident {
  id: number | string;
  latitude: number;
  longitude: number;
  classification?: string;
  category?: string;
  frp?: number;
  confidence?: string;
  acq_time?: string;
  acq_date?: string;
}

const PRESET_OFFICERS = [
  {
    name: "Insp. Vikram Rathore",
    id: "MH-SDRF-402",
    agency: "Maharashtra SDRF (Surat / Hazira Sector)",
  },
  {
    name: "Capt. Anita Sharma",
    id: "PB-FIRE-108",
    agency: "Punjab State Fire Service (Ludhiana Command)",
  },
  {
    name: "Sub-Officer Rajesh Kumar",
    id: "TN-FRS-301",
    agency: "Tamil Nadu Fire & Rescue (SIPCOT Industrial Zone)",
  },
];

const DEFAULT_DEMO_FIRES: FireIncident[] = [
  {
    id: 1,
    latitude: 21.1702,
    longitude: 72.8311,
    classification: "EMERGENCY_INDUSTRIAL",
    category: "EMERGENCY_INDUSTRIAL",
    frp: 85.4,
    confidence: "nominal",
    acq_date: "2026-09-08",
    acq_time: "07:30",
  },
  {
    id: 2,
    latitude: 30.9010,
    longitude: 75.8573,
    classification: "AGRICULTURAL_BURNING",
    category: "AGRICULTURAL_BURNING",
    frp: 38.2,
    confidence: "high",
    acq_date: "2026-09-08",
    acq_time: "08:15",
  },
  {
    id: 3,
    latitude: 22.4707,
    longitude: 70.0577,
    classification: "PERSISTENT_INDUSTRIAL",
    category: "PERSISTENT_INDUSTRIAL",
    frp: 120.0,
    confidence: "high",
    acq_date: "2026-09-08",
    acq_time: "09:00",
  },
  {
    id: 4,
    latitude: 31.6340,
    longitude: 74.8723,
    classification: "AGRICULTURAL_BURNING",
    category: "AGRICULTURAL_BURNING",
    frp: 45.0,
    confidence: "nominal",
    acq_date: "2026-09-08",
    acq_time: "09:45",
  },
];

export default function FieldOfficerPage() {
  const [officerName, setOfficerName] = useState<string>("Insp. Vikram Rathore");
  const [officerId, setOfficerId] = useState<string>("MH-SDRF-402");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"report" | "accuracy" | "history">("report");
  const [fires, setFires] = useState<FireIncident[]>(DEFAULT_DEMO_FIRES);
  const [selectedFire, setSelectedFire] = useState<FireIncident | null>(DEFAULT_DEMO_FIRES[0]);
  const [myHistory, setMyHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(false);

  // Fetch live fires if available
  useEffect(() => {
    async function loadFires() {
      try {
        const res = await fetch("/api/fires?limit=15");
        if (res.ok) {
          const data = await res.json();
          const items = Array.isArray(data) ? data : data.fires || [];
          if (items.length > 0) {
            setFires(items);
            setSelectedFire(items[0]);
          }
        }
      } catch (err) {
        console.warn("Using fallback demo fires for field officer portal:", err);
      }
    }
    loadFires();
  }, []);

  // Fetch officer history
  const loadOfficerHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await fetch(`/api/field-report/officer/${encodeURIComponent(officerId)}`);
      if (res.ok) {
        const data = await res.json();
        setMyHistory(data.reports || []);
      }
    } catch (err) {
      console.warn("Failed to load officer history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (activeTab === "history") {
      loadOfficerHistory();
    }
  }, [activeTab, officerId]);

  const handleSelectOfficerPreset = (preset: typeof PRESET_OFFICERS[0]) => {
    setOfficerName(preset.name);
    setOfficerId(preset.id);
  };

  return (
    <div className="min-h-screen bg-[#070b10] text-gray-100 font-mono flex flex-col">
      {/* Top Mobile-Friendly Header */}
      <header className="bg-[#0a0e14] border-b border-[#1f293d] p-3 sm:p-4 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="bg-[#141b26] hover:bg-[#1f293d] border border-[#2b3952] text-[#ff9500] px-2.5 py-1.5 rounded text-xs font-bold transition-all"
            >
              ← GROUND STATION
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-[#00d4ff] font-bold tracking-widest uppercase">
                  MOBILE TACTICAL RESPONDER PORTAL
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-black text-white">
                IGNIS // FIELD OFFICER VERIFICATION
              </h1>
            </div>
          </div>

          {/* Quick Officer Identity Badge */}
          <div className="flex items-center gap-2 bg-[#111827] border border-[#1f293d] px-3 py-1.5 rounded-lg w-full sm:w-auto justify-between sm:justify-start">
            <div className="text-left">
              <span className="text-[10px] text-gray-400 block leading-tight">ACTIVE RESPONDER:</span>
              <span className="text-xs font-bold text-white block leading-tight">
                {officerName}
              </span>
              <span className="text-[10px] text-[#00d4ff]">{officerId}</span>
            </div>
            <button
              onClick={() => setIsLoggedIn(!isLoggedIn)}
              className="text-[10px] bg-[#1f293d] hover:bg-[#2b3952] text-gray-300 px-2 py-1 rounded border border-[#2b3952]"
            >
              {isLoggedIn ? "CHANGE ID" : "SAVE"}
            </button>
          </div>
        </div>

        {/* Change Officer ID Modal / Dropdown if toggled */}
        {!isLoggedIn && (
          <div className="max-w-6xl mx-auto mt-3 p-3 bg-[#111827] border border-[#00d4ff]/50 rounded-lg">
            <span className="text-xs text-[#00d4ff] font-bold block mb-2">
              SELECT DEMO OFFICER PROFILE OR ENTER CUSTOM ID:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
              {PRESET_OFFICERS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    handleSelectOfficerPreset(preset);
                    setIsLoggedIn(true);
                  }}
                  className={`p-2 rounded border text-left text-xs transition-all ${
                    officerId === preset.id
                      ? "bg-[#00d4ff]/20 border-[#00d4ff] text-white"
                      : "bg-[#0a0e14] border-[#1f293d] text-gray-300 hover:border-gray-500"
                  }`}
                >
                  <div className="font-bold">{preset.name}</div>
                  <div className="text-[10px] text-[#00d4ff]">{preset.id}</div>
                  <div className="text-[9px] text-gray-400 truncate">{preset.agency}</div>
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={officerName}
                onChange={(e) => setOfficerName(e.target.value)}
                placeholder="Officer Name"
                className="bg-[#0a0e14] border border-[#1f293d] px-2 py-1 text-xs rounded text-white flex-1"
              />
              <input
                type="text"
                value={officerId}
                onChange={(e) => setOfficerId(e.target.value)}
                placeholder="Badge / Officer ID"
                className="bg-[#0a0e14] border border-[#1f293d] px-2 py-1 text-xs rounded text-white w-32"
              />
              <button
                onClick={() => setIsLoggedIn(true)}
                className="bg-[#00d4ff] text-black font-bold text-xs px-3 py-1 rounded"
              >
                APPLY
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto w-full p-3 sm:p-6 flex-1 space-y-4">
        {/* Navigation Tabs (Big Touch-Friendly Buttons) */}
        <div className="grid grid-cols-3 gap-2 bg-[#0a0e14] p-1.5 rounded-lg border border-[#1f293d]">
          <button
            onClick={() => setActiveTab("report")}
            className={`py-3 px-2 rounded font-black text-xs sm:text-sm tracking-wide transition-all ${
              activeTab === "report"
                ? "bg-[#ff9500] text-black shadow-lg"
                : "text-gray-400 hover:text-white bg-[#111827]"
            }`}
          >
            📝 SUBMIT REPORT
          </button>
          <button
            onClick={() => setActiveTab("accuracy")}
            className={`py-3 px-2 rounded font-black text-xs sm:text-sm tracking-wide transition-all ${
              activeTab === "accuracy"
                ? "bg-[#00d4ff] text-black shadow-lg"
                : "text-gray-400 hover:text-white bg-[#111827]"
            }`}
          >
            📊 ACCURACY DASHBOARD
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`py-3 px-2 rounded font-black text-xs sm:text-sm tracking-wide transition-all ${
              activeTab === "history"
                ? "bg-emerald-500 text-black shadow-lg"
                : "text-gray-400 hover:text-white bg-[#111827]"
            }`}
          >
            📜 MY AUDIT LOG
          </button>
        </div>

        {/* TAB 1: SUBMIT REPORT */}
        {activeTab === "report" && (
          <div className="space-y-4">
            {/* Active Fire Incidents Selector */}
            <div className="bg-[#0a0e14] border border-[#1f293d] p-3 rounded-lg">
              <span className="text-xs text-[#00d4ff] font-bold block mb-2 uppercase tracking-wider">
                SELECT ASSIGNED INCIDENT TO VERIFY:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {fires.slice(0, 4).map((f) => {
                  const isSelected = selectedFire?.id === f.id;
                  const cat = f.classification || f.category || "UNKNOWN";
                  return (
                    <button
                      key={f.id}
                      onClick={() => setSelectedFire(f)}
                      className={`p-2.5 rounded border text-left transition-all ${
                        isSelected
                          ? "bg-[#ff9500]/15 border-[#ff9500] ring-1 ring-[#ff9500]"
                          : "bg-[#111827]/80 border-[#1f293d] hover:border-gray-500"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-bold text-white">
                          HOTSPOT #{f.id}
                        </span>
                        <span className="text-[10px] bg-[#1f293d] text-gray-300 px-1.5 py-0.5 rounded font-mono">
                          {f.frp ? `${f.frp.toFixed(1)} MW` : "HIGH FRP"}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#00d4ff] font-semibold truncate">
                        {cat.replace("_", " ")}
                      </div>
                      <div className="text-[10px] text-gray-400 font-mono mt-1">
                        {f.latitude.toFixed(3)}°N, {f.longitude.toFixed(3)}°E
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Field Report Form with Voice & Photo */}
            <FieldReportForm
              selectedFire={selectedFire}
              officerName={officerName}
              officerId={officerId}
              onSuccess={() => {
                // Optionally switch to history or refresh
              }}
            />
          </div>
        )}

        {/* TAB 2: SYSTEM ACCURACY DASHBOARD */}
        {activeTab === "accuracy" && <AccuracyDashboard />}

        {/* TAB 3: OFFICER AUDIT HISTORY */}
        {activeTab === "history" && (
          <div className="bg-[#0a0e14] border border-[#1f293d] rounded-lg p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1f293d] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#ff9500]">
                  VERIFICATION AUDIT LOG FOR {officerId}
                </h3>
                <span className="text-xs text-gray-400">
                  Officer: {officerName}
                </span>
              </div>
              <button
                onClick={loadOfficerHistory}
                className="bg-[#141b26] hover:bg-[#1f293d] border border-[#2b3952] text-xs px-3 py-1.5 rounded text-gray-300"
              >
                🔄 REFRESH
              </button>
            </div>

            {loadingHistory ? (
              <div className="py-8 text-center text-gray-400">
                <div className="animate-spin w-6 h-6 border-2 border-[#00d4ff] border-t-transparent rounded-full mx-auto mb-2" />
                Loading officer submission history...
              </div>
            ) : myHistory.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                No past reports found for {officerId}. Submit a report using the "SUBMIT REPORT" tab.
              </div>
            ) : (
              <div className="space-y-3">
                {myHistory.map((rep) => (
                  <div
                    key={rep.id}
                    className="bg-[#111827]/60 border border-[#1f293d] p-3.5 rounded-lg space-y-2 hover:border-[#00d4ff]/40 transition-all"
                  >
                    <div className="flex flex-wrap justify-between items-center gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">
                          REPORT #{rep.id} (FIRE #{rep.fire_id})
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            rep.status === "CONTAINED"
                              ? "bg-emerald-950 text-emerald-300 border border-emerald-500/50"
                              : rep.status === "SPREADING"
                              ? "bg-red-950 text-red-300 border border-red-500/50"
                              : "bg-cyan-950 text-cyan-300 border border-cyan-500/50"
                          }`}
                        >
                          {rep.status}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400 font-mono">
                        {rep.timestamp}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs bg-[#0a0e14] p-2.5 rounded border border-[#1f293d]">
                      <div>
                        <span className="text-gray-500 block text-[10px]">GROUND TRUTH CATEGORY:</span>
                        <span className="text-[#00d4ff] font-bold">
                          {rep.classification_actual || "EMERGENCY_INDUSTRIAL"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-[10px]">DAMAGE ASSESSMENT:</span>
                        <span className="text-amber-300 font-bold">
                          {rep.damage_assessment || "MODERATE"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-[10px]">RESOURCES DEPLOYED:</span>
                        <span className="text-gray-300 truncate block">
                          {rep.resources_needed || "Standard units"}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-300 italic bg-[#141b26]/50 p-2 rounded">
                      "{rep.ground_observation}"
                    </p>

                    {rep.photo_url && (
                      <div className="mt-2">
                        <span className="text-[10px] text-gray-500 block mb-1">FIELD PHOTO ATTACHED:</span>
                        <img
                          src={rep.photo_url}
                          alt="Field observation"
                          className="h-20 w-36 object-cover rounded border border-[#1f293d]"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#0a0e14] border-t border-[#1f293d] p-3 text-center text-xs text-gray-500">
        IGNIS :: INTELLIGENT GEOSPATIAL NETWORK FOR INDUSTRIAL FIRE SCREENING // NTRO SIH26162
      </footer>
    </div>
  );
}
