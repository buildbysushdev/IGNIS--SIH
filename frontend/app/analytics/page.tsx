"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api";
import ExecutiveSummary from "@/components/analytics/ExecutiveSummary";
import InsightsPanel from "@/components/analytics/InsightsPanel";
import ChartGrid from "@/components/analytics/ChartGrid";
import StateBreakdown from "@/components/analytics/StateBreakdown";
import ReportGenerator from "@/components/analytics/ReportGenerator";

export default function AnalyticsPage() {
  const [days, setDays] = useState<number>(30);
  const [region, setRegion] = useState<string>("India");
  const [loading, setLoading] = useState<boolean>(true);
  const [analyticsData, setAnalyticsData] = useState<any | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<string>("");

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/api/analytics/regional?region=${encodeURIComponent(region)}&days=${days}`);
      setAnalyticsData(res.data);
      setLastRefreshed(new Date().toLocaleTimeString());
    } catch (err) {
      console.warn("[ANALYTICS] Fetch failure:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [days, region]);

  return (
    <div className="min-h-screen bg-[#070a0e] text-[#d0d8e0] flex flex-col font-mono selection:bg-[#00d4ff] selection:text-black">
      {/* 1) Top Header & View Switcher */}
      <header className="border-b border-[#1f2933] bg-[#0f141b] px-4 py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs tracking-wider uppercase">
        {/* Left branding */}
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 bg-[#ffb800] status-dot-amber flex-shrink-0" />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-[#ffb800] font-black text-sm tracking-widest">IGNIS</span>
              <span className="text-[#4a5563]">//</span>
              <span className="text-[#d0d8e0] font-bold">AUTHORITY ANALYTICS DASHBOARD</span>
              <span className="text-[10px] text-[#00d4ff] border border-[#1f2933] px-1 py-0.2 bg-[#0a0e14]">
                EXECUTIVE VIEW
              </span>
            </div>
            <div className="text-[10px] text-[#6b7785] tracking-wider uppercase flex items-center gap-2">
              <span>NDMA &amp; COLLECTORATE STRATEGIC BRIEFING</span>
              <span className="text-[#4a5563]">::</span>
              <span className="text-[#00ff9c]">REFRESHED {lastRefreshed || "JUST NOW"}</span>
            </div>
          </div>
        </div>

        {/* Center: 3-Way Navigation View Switcher */}
        <div className="flex items-center gap-1 border border-[#1f2933] bg-[#0a0e14] p-1 text-[11px]">
          <Link
            href="/"
            className="px-2.5 py-1 text-[#6b7785] hover:text-[#00d4ff] uppercase font-bold transition"
          >
            [ OPERATIONS ]
          </Link>
          <div className="px-2.5 py-1 bg-[#15202c] border border-[#ffb800] text-[#ffb800] font-bold uppercase">
            [ ANALYTICS ]
          </div>
          <span className="px-2.5 py-1 text-[#4a5563] uppercase font-bold cursor-not-allowed">
            [ FIELD OFFICER ]
          </span>
        </div>

        {/* Right metadata */}
        <div className="flex items-center gap-2 text-[10px] text-[#6b7785]">
          <span className="text-[#00ff9c] font-bold">[SYS] ENCRYPTED</span>
          <span>::</span>
          <span className="text-[#d0d8e0]">NTRO // SIH26162</span>
        </div>
      </header>

      {/* 2) Parameter Bar: Time Horizon & Sector Selector */}
      <div className="border-b border-[#1f2933] bg-[#0c1017] px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#6b7785] font-bold uppercase">[ TIME HORIZON ]:</span>
          {[7, 30, 90, 365].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-2.5 py-1 border text-[10px] font-bold transition cursor-pointer ${
                days === d
                  ? "border-[#ffb800] bg-[#ffb800]/20 text-[#ffb800]"
                  : "border-[#1f2933] text-[#6b7785] hover:text-[#d0d8e0] hover:border-[#2d3a4a]"
              }`}
            >
              {d === 365 ? "1 YEAR" : `${d} DAYS`}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#6b7785] font-bold uppercase">[ SECTOR MASK ]:</span>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="bg-[#0a0e14] border border-[#1f2933] border-b-2 border-b-[#ffb800] text-[#d0d8e0] px-2 py-1 text-xs font-mono cursor-pointer rounded-none"
          >
            <option value="India">All India National Sector</option>
            <option value="Western">Western Industrial Belt (GJ/MH)</option>
            <option value="Northern">Northern Biomass Belt (PB/HR)</option>
            <option value="Himalayan">Himalayan Forest Zone (UK/HP)</option>
          </select>

          <button
            onClick={fetchAnalytics}
            disabled={loading}
            className="px-3 py-1 bg-[#131a22] border border-[#1f2933] hover:border-[#00d4ff] text-[#00d4ff] text-xs font-bold uppercase transition cursor-pointer"
          >
            {loading ? "[ SYNCING... ]" : "[ REFRESH ▷ ]"}
          </button>
        </div>
      </div>

      {/* 3) Main Dashboard Container */}
      <main className="flex-1 max-w-[1800px] w-full mx-auto p-3 space-y-3">
        {/* KPI Summary Cards */}
        <ExecutiveSummary
          summary={analyticsData?.summary}
          trends={analyticsData?.trends}
        />

        {/* AI Threat Insights Panel */}
        <InsightsPanel />

        {/* 6 Recharts Visualizations Grid */}
        <ChartGrid
          eventsOverTime={analyticsData?.events_over_time}
          byCategory={analyticsData?.by_category}
          byState={analyticsData?.by_state}
          byMonth={analyticsData?.by_month}
          responseTimeTrend={analyticsData?.response_time_trend}
          hourlyHeatmap={analyticsData?.hourly_heatmap}
        />

        {/* State Breakdown Sortable Audit Table & District Drilldown */}
        <StateBreakdown states={analyticsData?.by_state} />

        {/* Report Generator with jsPDF Export */}
        <ReportGenerator />
      </main>

      {/* 4) Bottom Status Strip */}
      <footer className="h-6 bg-[#0f141b] border-t border-[#1f2933] px-3 flex items-center justify-between text-[10px] text-[#6b7785] tracking-wider uppercase">
        <div className="flex items-center gap-2">
          <span className="text-[#00ff9c]">[STATUS] SECURE REPOSITORY</span>
          <span className="text-[#4a5563]">::</span>
          <span className="text-[#d0d8e0]">GOVERNMENT OF INDIA // DISASTER AUDIT</span>
        </div>
        <div className="flex items-center gap-2">
          <span>DATA ACCREDITATION: NASA FIRMS / ISRO BHUVAN</span>
          <span className="text-[#4a5563]">::</span>
          <span className="text-[#ffb800] font-bold">IGNIS v2.0</span>
        </div>
      </footer>
    </div>
  );
}
