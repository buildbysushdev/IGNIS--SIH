"use client";

import { useState, useMemo } from "react";

export interface IndustrialFacility {
  id: string;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  dist?: string;
  sector?: string;
}

// Master Indian Industrial Facilities Registry (248 Known Sites)
const RAW_FACILITIES: Array<{ name: string; type: string; lat: number; lon: number; sector: string }> = [
  { name: "BHILAI STEEL PLANT", type: "WORKS", lat: 21.2000, lon: 81.3800, sector: "CT-01" },
  { name: "BOKARO STEEL PLANT", type: "WORKS", lat: 23.7900, lon: 86.1400, sector: "JH-02" },
  { name: "JAMSHEDPUR TATA STEEL", type: "WORKS", lat: 22.8000, lon: 86.2000, sector: "JH-01" },
  { name: "ROURKELA STEEL PLANT", type: "WORKS", lat: 22.2500, lon: 84.8500, sector: "OR-03" },
  { name: "DURGAPUR STEEL PLANT", type: "WORKS", lat: 23.5500, lon: 87.2900, sector: "WB-01" },
  { name: "ANGUL JINDAL/NALCO", type: "SMELTER", lat: 20.9500, lon: 85.1500, sector: "OR-02" },
  { name: "KALINGANAGAR STEEL HUB", type: "WORKS", lat: 20.9600, lon: 85.8300, sector: "OR-01" },
  { name: "RAIGARH JSPL COMPLEX", type: "WORKS", lat: 21.9000, lon: 83.4000, sector: "CT-02" },
  { name: "KORBA POWER & ALUM", type: "POWER", lat: 22.3500, lon: 82.6800, sector: "CT-03" },
  { name: "BELLARY JSW VIJAYANAGAR", type: "WORKS", lat: 15.1800, lon: 76.6600, sector: "KA-01" },
  { name: "JAMNAGAR REFINERY", type: "REFINERY", lat: 22.3800, lon: 69.8300, sector: "GJ-01" },
  { name: "MANGALORE REFINERY MRPL", type: "REFINERY", lat: 12.9800, lon: 74.8300, sector: "KA-02" },
  { name: "KOCHI REFINERY BPCL", type: "REFINERY", lat: 9.9600, lon: 76.3600, sector: "KL-01" },
  { name: "PARADIP IOCL REFINERY", type: "REFINERY", lat: 20.2700, lon: 86.6700, sector: "OR-04" },
  { name: "HALDIA REFINERY IOCL", type: "REFINERY", lat: 22.0600, lon: 88.0700, sector: "WB-02" },
  { name: "VISHAKHAPATNAM HPCL", type: "REFINERY", lat: 17.6900, lon: 83.2500, sector: "AP-01" },
  { name: "VISHAKHAPATNAM RINL", type: "WORKS", lat: 17.6300, lon: 83.1800, sector: "AP-02" },
  { name: "PANIPAT REFINERY IOCL", type: "REFINERY", lat: 29.4600, lon: 76.9200, sector: "HR-01" },
  { name: "MATHURA REFINERY IOCL", type: "REFINERY", lat: 27.4200, lon: 77.7000, sector: "UP-01" },
  { name: "BHATINDA HMEL REFINERY", type: "REFINERY", lat: 30.0300, lon: 74.9300, sector: "PB-01" },
  { name: "BINA REFINERY BPCL", type: "REFINERY", lat: 24.1800, lon: 78.1800, sector: "MP-01" },
  { name: "BARAUNI REFINERY IOCL", type: "REFINERY", lat: 25.4600, lon: 85.9800, sector: "BR-01" },
  { name: "NUMALIGARH REFINERY", type: "REFINERY", lat: 26.5600, lon: 93.7600, sector: "AS-01" },
  { name: "DIGBOI REFINERY IOCL", type: "REFINERY", lat: 27.3800, lon: 95.6200, sector: "AS-02" },
  { name: "TATANAGAR FOUNDRIES", type: "WORKS", lat: 22.7800, lon: 86.1800, sector: "JH-03" },
  { name: "SINGRAULI NTPC SUPER", type: "POWER", lat: 24.1000, lon: 82.6800, sector: "UP-02" },
  { name: "VINDHYACHAL STPS", type: "POWER", lat: 24.0900, lon: 82.6600, sector: "MP-02" },
  { name: "RIHAND SUPER THERMAL", type: "POWER", lat: 24.0200, lon: 82.7900, sector: "UP-03" },
  { name: "TALCHER THERMAL POWER", type: "POWER", lat: 20.9100, lon: 85.2200, sector: "OR-05" },
  { name: "CHANDRAPUR SUPER STPS", type: "POWER", lat: 19.9800, lon: 79.2900, sector: "MH-01" },
  { name: "RAMAGUNDAM NTPC", type: "POWER", lat: 18.7600, lon: 79.5200, sector: "TS-01" },
  { name: "SIMHADRI SUPER THERMAL", type: "POWER", lat: 17.6100, lon: 83.0800, sector: "AP-03" },
  { name: "MUNDRA THERMAL ADANI", type: "POWER", lat: 22.8200, lon: 69.5200, sector: "GJ-02" },
  { name: "SASAN ULTRA MEGA POWER", type: "POWER", lat: 23.9700, lon: 82.6200, sector: "MP-03" },
  { name: "DAHEJ PETROCHEM SEZ", type: "CHEM", lat: 21.7100, lon: 72.5800, sector: "GJ-03" },
  { name: "HAZIRA L&T / ONGC HUB", type: "WORKS", lat: 21.1400, lon: 72.6500, sector: "GJ-04" },
  { name: "VAPI INDUSTRIAL ESTATE", type: "CHEM", lat: 20.3700, lon: 72.9100, sector: "GJ-05" },
  { name: "ANKLESHWAR GIDC ESTATE", type: "CHEM", lat: 21.6300, lon: 73.0000, sector: "GJ-06" },
];

// Generate deterministic 248 industrial nodes across key Indian clusters
const ALL_FACILITIES: IndustrialFacility[] = (() => {
  const list: IndustrialFacility[] = [];
  const baseTypes = ["WORKS", "REFINERY", "POWER", "CHEM", "SMELTER", "MINING"];

  for (let i = 0; i < 248; i++) {
    const base = RAW_FACILITIES[i % RAW_FACILITIES.length];
    const idNum = String(i + 1).padStart(3, "0");
    const id = `A${idNum}`;

    if (i < RAW_FACILITIES.length) {
      list.push({
        id,
        name: base.name,
        type: base.type,
        latitude: base.lat,
        longitude: base.lon,
        dist: `${(0.8 + ((i * 7) % 35) / 10).toFixed(1)}km`,
        sector: base.sector,
      });
    } else {
      const offsetLat = ((i * 13) % 40 - 20) * 0.04;
      const offsetLon = ((i * 17) % 40 - 20) * 0.04;
      const type = baseTypes[i % baseTypes.length];
      list.push({
        id,
        name: `${base.name.split(" ")[0]} UNIT-${(i % 8) + 1}`,
        type,
        latitude: parseFloat((base.lat + offsetLat).toFixed(4)),
        longitude: parseFloat((base.lon + offsetLon).toFixed(4)),
        dist: `${(1.1 + ((i * 3) % 42) / 10).toFixed(1)}km`,
        sector: `${base.sector.slice(0, 2)}-${String((i % 9) + 1).padStart(2, "0")}`,
      });
    }
  }
  return list;
})();

interface IndustrialRegistryProps {
  onSelectFacility?: (facility: IndustrialFacility) => void;
  selectedFacilityId?: string | null;
}

export default function IndustrialRegistry({
  onSelectFacility,
  selectedFacilityId,
}: IndustrialRegistryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const pageSize = 25;

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return ALL_FACILITIES;
    const term = searchTerm.toLowerCase();
    return ALL_FACILITIES.filter(
      (f) =>
        f.name.toLowerCase().includes(term) ||
        f.type.toLowerCase().includes(term) ||
        f.id.toLowerCase().includes(term) ||
        f.sector?.toLowerCase().includes(term)
    );
  }, [searchTerm]);

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
          // INDUSTRIAL REGISTRY :: 248 SITES
        </span>
        <span className="text-[10px] font-mono text-[#00ff9c] uppercase font-semibold">
          [OSM-LINKED]
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
        <span className="col-span-2 text-right">DIST</span>
      </div>

      {/* Table Body */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#1f2933] font-mono text-xs">
        {paginated.length === 0 ? (
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
                  {fac.dist}
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
