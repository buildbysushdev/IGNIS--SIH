import { FIRE_STATIONS } from "@/data/fireStations";

export interface Fire {
  id?: string;
  latitude: number;
  longitude: number;
  brightness: number;
  frp: number;
  confidence: string | number;
  acq_date: string;
  acq_time: string;
  satellite?: string;
  category: string;
  risk_level: string;
  color?: string;
  reason: string;
  action: string;
  facility_name?: string;
  nearest_facility?: string;
  facility_type?: string;
  facility_dist?: number;
  distance_km?: number;
  station_name?: string;
  station_distance_km?: number;
  station_eta_minutes?: number;
}

export interface FacilityMarker {
  id: string;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
}

export interface ScenarioOverlayState {
  evacuationCircle?: { center: [number, number]; radius_km: number } | null;
  windCone?: [number, number][] | null;
  stationMarker?: { name: string; lat: number; lon: number; distance_km?: number } | null;
  pulseMarker?: [number, number] | null;
  // Flood overlays – animated concentric water-rise rings
  floodCircles?: {
    center: [number, number];
    radius_km: number;
    flood_level?: "WARNING" | "CRITICAL" | "SEVERE";
  }[] | null;
  // Cyclone overlay – spiral approach track + storm surge circle
  cycloneOverlay?: {
    center: [number, number];
    eye_radius_km: number;
    surge_radius_km: number;
    wind_speed?: number;
    category?: number;
  } | null;
  // Disaster type for conditional rendering
  disasterType?: "FIRE" | "FLOOD" | "CYCLONE" | null;
}

// Strict Ground Station Color Coding (High Contrast, Phosphor & Modern Mission Accents)
export const TERMINAL_COLORS: Record<string, string> = {
  // 🔴 Critical Emergency (Hospital / Petrol Pump / Factory Fire)
  EMERGENCY_INDUSTRIAL: "#EF4444",
  HOSPITAL_FIRE: "#EF4444",
  FUEL_STATION_FIRE: "#EF4444",
  SCHOOL_FIRE: "#EF4444",
  SLUM_DENSE_URBAN_FIRE: "#EF4444",

  // 🟠 High Risk (Restaurant / Market / Residential Structure)
  RESTAURANT_KITCHEN_FIRE: "#F97316",
  COMMERCIAL_MARKET_FIRE: "#F97316",
  RESIDENTIAL_STRUCTURE_FIRE: "#F97316",

  // 🟡 Persistent Industrial (Steel Plant / Refinery - Routine)
  PERSISTENT_INDUSTRIAL: "#F59E0B",

  // 🟢 Forest / Wildland
  FOREST_FIRE: "#22C55E",

  // 🔵 Agricultural Burning (Stubble)
  AGRICULTURAL_BURNING: "#3B82F6",

  // ⚪ Low-Intensity Domestic (Garbage / Bonfire - Suppressed)
  DOMESTIC_LOW_INTENSITY_BURN: "#94A3B8",
  UNKNOWN: "#9CA3AF",

  // 🌊 Flood categories
  FLOOD_HOTSPOT: "#0EA5E9",
  FLOOD_MONITORING: "#06B6D4",
  FLOOD_WARNING: "#0EA5E9",
  FLOOD_CRITICAL: "#2563EB",
  FLOOD_SEVERE: "#1D4ED8",
  FLOOD_EVACUATION: "#6366F1",
  FLOOD_ASSESSMENT: "#818CF8",

  // 🌀 Cyclone categories
  CYCLONE_HOTSPOT: "#A855F7",
  CYCLONE_WARNING: "#A855F7",
  CYCLONE_CRITICAL: "#7C3AED",
  CYCLONE_APPROACH: "#9333EA",
  CYCLONE_LANDFALL: "#6D28D9",
  CYCLONE_RAIN_BAND: "#8B5CF6",
};

export function getMarkerColor(category: string): string {
  if (!category) return "#9CA3AF";
  if (TERMINAL_COLORS[category]) return TERMINAL_COLORS[category];
  const catUpper = category.toUpperCase();
  if (catUpper.includes("FLOOD")) return "#0EA5E9";
  if (catUpper.includes("CYCLONE")) return "#A855F7";
  if (catUpper.includes("FOREST")) return "#22C55E";
  if (catUpper.includes("AGRICULTURAL") || catUpper.includes("STUBBLE")) return "#3B82F6";
  if (catUpper.includes("EMERGENCY") || catUpper.includes("CRITICAL") || catUpper.includes("HOSPITAL") || catUpper.includes("FUEL")) return "#EF4444";
  return "#9CA3AF";
}

export const TILE_PRESETS = {
  ops_dark: {
    id: "ops_dark",
    name: "OPS DARK",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    subdomains: "abc",
  },
  satellite: {
    id: "satellite",
    name: "SATELLITE",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    subdomains: "abc",
  },
  hybrid: {
    id: "hybrid",
    name: "HYBRID",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    subdomains: "abc",
  },
};

export function findLocalNearestStation(lat: number, lon: number) {
  let nearest = FIRE_STATIONS[0];
  let minD = 999999;
  for (let i = 0; i < FIRE_STATIONS.length; i++) {
    const s = FIRE_STATIONS[i];
    const d = Math.hypot(s.lat - lat, (s.lon - lon) * Math.cos((lat * Math.PI) / 180)) * 111;
    if (d < minD) {
      minD = d;
      nearest = s;
    }
  }
  const distKm = Math.round(minD * 10) / 10;
  const eta = Math.max(3, Math.round(2 + (distKm / 45) * 60));
  return { ...nearest, distance_km: distKm, eta_minutes: eta };
}
