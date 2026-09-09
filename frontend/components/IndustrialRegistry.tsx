"use client";

import { useState, useEffect, useMemo } from "react";
import axios from "axios";

export interface IndustrialFacility {
  id: string;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  dist?: string;
  sector?: string;
  zone_type?: string;
}

// ─────────────────────────────────────────────────────────
// STATIC FALLBACK (used only if /api/industries is down)
// ─────────────────────────────────────────────────────────
const STATIC_FALLBACK: IndustrialFacility[] = [
  { id: "A001", name: "BHILAI STEEL PLANT", type: "WORKS", latitude: 21.2000, longitude: 81.3800, sector: "CT-01" },
  { id: "A002", name: "BOKARO STEEL PLANT", type: "WORKS", latitude: 23.7900, longitude: 86.1400, sector: "JH-02" },
  { id: "A003", name: "JAMSHEDPUR TATA STEEL", type: "WORKS", latitude: 22.8000, longitude: 86.2000, sector: "JH-01" },
  { id: "A004", name: "ROURKELA STEEL PLANT", type: "WORKS", latitude: 22.2500, longitude: 84.8500, sector: "OR-03" },
  { id: "A005", name: "DURGAPUR STEEL PLANT", type: "WORKS", latitude: 23.5500, longitude: 87.2900, sector: "WB-01" },
  { id: "A006", name: "ANGUL JINDAL/NALCO", type: "SMELTER", latitude: 20.9500, longitude: 85.1500, sector: "OR-02" },
  { id: "A007", name: "KALINGANAGAR STEEL HUB", type: "WORKS", latitude: 20.9600, longitude: 85.8300, sector: "OR-01" },
  { id: "A008", name: "RAIGARH JSPL COMPLEX", type: "WORKS", latitude: 21.9000, longitude: 83.4000, sector: "CT-02" },
  { id: "A009", name: "KORBA POWER & ALUM", type: "POWER", latitude: 22.3500, longitude: 82.6800, sector: "CT-03" },
  { id: "A010", name: "JAMNAGAR REFINERY", type: "REFINERY", latitude: 22.3800, longitude: 69.8300, sector: "GJ-01" },
  { id: "A011", name: "MANGALORE REFINERY MRPL", type: "REFINERY", latitude: 12.9800, longitude: 74.8300, sector: "KA-02" },
  { id: "A012", name: "KOCHI REFINERY BPCL", type: "REFINERY", latitude: 9.9600, longitude: 76.3600, sector: "KL-01" },
  { id: "A013", name: "PARADIP IOCL REFINERY", type: "REFINERY", latitude: 20.2700, longitude: 86.6700, sector: "OR-04" },
  { id: "A014", name: "DAHEJ PETROCHEM SEZ", type: "CHEM", latitude: 21.7100, longitude: 72.5800, sector: "GJ-03" },
  { id: "A015", name: "HAZIRA L&T / ONGC HUB", type: "WORKS", latitude: 21.1400, longitude: 72.6500, sector: "GJ-04" },
];

// Haversine helper for nearest facility lookup
export function findNearestFacility(
  lat: number,
  lon: number,
  facilities: IndustrialFacility[] = STATIC_FALLBACK
): { facility: IndustrialFacility; distanceKm: number } {
  let nearest = facilities[0];
  let minDistance = Infinity;

  for (const fac of facilities) {
    const dLat = (fac.latitude - lat) * (Math.PI / 180);
    const dLon = (fac.longitude - lon) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat * (Math.PI / 180)) *
        Math.cos(fac.latitude * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const dist = 6371 * c;
    if (dist < minDistance) {
      minDistance = dist;
      nearest = fac;
    }
  }

  return { facility: nearest, distanceKm: minDistance };
}

// Export the live-fetched facilities list for other components
export let ALL_FACILITIES: IndustrialFacility[] = [...STATIC_FALLBACK];

interface IndustrialRegistryProps {
  onSelectFacility?: (facility: IndustrialFacility) => void;
  selectedFacilityId?: string | null;
}

export default function IndustrialRegistry({
  onSelectFacility,
  selectedFacilityId,
}: IndustrialRegistryProps) {
  const [facilities, setFacilities] = useState<IndustrialFacility[]>(STATIC_FALLBACK);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const pageSize = 25;

  // Fetch from live API on mount
  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        setLoading(true);
        const apiBase =
          process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
        const res = await axios.get(`${apiBase}/api/industries`, {
          params: { limit: 500 },
          timeout: 8000,
        });
        const data = res.data;
        const raw: any[] = data.industries || [];
        if (raw.length > 0) {
          const mapped: IndustrialFacility[] = raw.map((z: any, i: number) => ({
            id: z.id || `Z${String(i + 1).padStart(3, "0")}`,
            name: z.name || z.display_name || "Unknown Facility",
            type: (z.zone_type || z.type || "INDUSTRIAL").toUpperCase().replace(/_/g, " "),
            latitude: parseFloat(z.latitude || z.lat || 0),
            longitude: parseFloat(z.longitude || z.lon || 0),
            sector: z.sector || z.state || "IN",
            dist: z.dist || undefined,
            zone_type: z.zone_type || z.type || "industrial",
          }));
          setFacilities(mapped);
          ALL_FACILITIES = mapped; // update shared export
          setIsLive(true);
        } else {
          // API returned empty - keep fallback
          setIsLive(false);
        }
      } catch {
        // Silently fall back to static list
        setIsLive(false);
      } finally {
        setLoading(false);
      }
    };

    fetchFacilities();
  }, []);

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return facilities;
    const term = searchTerm.toLowerCase();
    return facilities.filter(
      (f) =>
        f.name.toLowerCase().includes(term) ||
        f.type.toLowerCase().includes(term) ||
        f.id.toLowerCase().includes(term) ||
        f.sector?.toLowerCase().includes(term)
    );
  }, [searchTerm, facilities]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = useMemo(() => {
    const start = page * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  const handleRowClick = (facility: IndustrialFacility) => {
    if (onSelectFacility) {
      onSelectFacility(facility);
    }
  };

  return (
    <div className="panel flex flex-col h-full overflow-hidden border border-[#1f2933] bg-[#0f141b] corner-brackets">
      {/* Panel Header */}
      <div className="panel-header flex items-center justify-between border-b border-[#1f2933] px-3 py-2 bg-[#131a22]">
        <span className="font-mono text-[11px] font-bold tracking-[0.15em] text-[#6b7785] uppercase">
          // INDUSTRIAL REGISTRY ::{" "}
          {loading ? "LOADING..." : `${facilities.length} SITES`}
        </span>
        <span
          className={`text-[10px] font-mono uppercase font-semibold ${
            isLive ? "text-[#00ff9c]" : "text-[#ffb800]"
          }`}
        >
          {loading ? "[SYNCING]" : isLive ? "[LIVE-OSM]" : "[FALLBACK]"}
        </span>
      </div>

      {/* Terminal Search Input */}
      <div className="p-2 border-b border-[#1f2933] bg-[#0a0e14]">
        <div className="relative flex items-center">
          <span className="absolute left-2.5 text-[#4a5563] font-mono text-xs select-none">&gt;</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(0);
            }}
            placeholder="SEARCH BY NAME / TYPE / ID..."
            className="w-full bg-[#0f141b] border border-[#1f2933] text-[#d0d8e0] font-mono text-xs pl-6 pr-2 py-1.5 focus:outline-none focus:border-[#00d4ff] placeholder-[#4a5563] transition uppercase"
          />
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-12 gap-1 px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-[#4a5563] bg-[#131a22] border-b border-[#1f2933] font-semibold">
        <span className="col-span-2">ID</span>
        <span className="col-span-6">FACILITY NAME</span>
        <span className="col-span-2">TYPE</span>
        <span className="col-span-2 text-right">SECTOR</span>
      </div>

      {/* Table Body */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#1f2933] font-mono text-xs">
        {loading ? (
          <div className="p-4 text-center text-[#4a5563] text-xs font-mono animate-pulse">
            // QUERYING OSM INDUSTRIAL DATABASE...
          </div>
        ) : paginated.length === 0 ? (
          <div className="p-4 text-center text-[#4a5563] text-xs font-mono">
            // NO MATCHING SITES FOUND IN REGISTRY
          </div>
        ) : (
          paginated.map((fac) => {
            const isSelected = selectedFacilityId === fac.id;
            return (
              <div
                key={fac.id}
                onClick={() => handleRowClick(fac)}
                className={`grid grid-cols-12 gap-1 px-3 py-1.5 items-center cursor-pointer transition select-none ${
                  isSelected
                    ? "bg-[#131a22] border-l-2 border-[#00d4ff] text-[#00d4ff]"
                    : "hover:bg-[#131a22] hover:text-[#00d4ff] text-[#d0d8e0]"
                }`}
                title={`Coords: ${fac.latitude}°N, ${fac.longitude}°E (${fac.sector})`}
              >
                <span className="col-span-2 text-[#6b7785] font-semibold">{fac.id}</span>
                <span className="col-span-6 truncate font-medium">{fac.name}</span>
                <span className="col-span-2 text-[10px] text-[#ffb800] uppercase">{fac.type}</span>
                <span className="col-span-2 text-right text-[11px] tabular-nums text-[#6b7785]">
                  {fac.sector || "—"}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between px-3 py-1.5 border-t border-[#1f2933] bg-[#131a22] text-[10px] font-mono text-[#6b7785]">
        <span>
          SHOWING {filtered.length === 0 ? 0 : page * pageSize + 1}-
          {Math.min((page + 1) * pageSize, filtered.length)} OF {filtered.length}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-2 py-0.5 border border-[#1f2933] bg-[#0f141b] text-[#d0d8e0] disabled:opacity-30 hover:border-[#00d4ff] cursor-pointer"
          >
            &lt;&lt;
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="px-2 py-0.5 border border-[#1f2933] bg-[#0f141b] text-[#d0d8e0] disabled:opacity-30 hover:border-[#00d4ff] cursor-pointer"
          >
            &gt;&gt;
          </button>
        </div>
      </div>
    </div>
  );
}
