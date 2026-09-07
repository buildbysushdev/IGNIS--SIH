export interface FireResponseProtocol {
  fire_class: string;
  typical_materials: string[];
  use_agents: {
    primary: string[];
    secondary: string[];
  };
  avoid: string[];
  equipment_required: string[];
  safety_distance_m: number;
  response_time_target_min: number;
  personnel_required: number;
  coordination: string[];
  special_notes: string;
  evacuation_radius_m: number;
  hospital_notification: boolean;
  aerial_support?: string;
  aqi_alert?: boolean;
  wildlife_protocol?: boolean;

  // Backwards compatibility aliases
  USE: string[];
  AVOID: string[];
  equipment: string[];
}

export const FIRE_RESPONSE_PROTOCOLS: Record<string, FireResponseProtocol> = {
  PERSISTENT_INDUSTRIAL: {
    fire_class: "Class A/B mixed",
    typical_materials: ["Steel", "Coal", "Coke", "Iron"],
    use_agents: {
      primary: ["Water spray (cooling)", "Foam"],
      secondary: ["Dry chemical powder"],
    },
    avoid: [
      "Direct water on molten metal (explosion risk)",
      "Class D materials without special powder",
    ],
    equipment_required: [
      "Fire tenders (2+)",
      "Foam units",
      "Heat-resistant suits",
      "Thermal imaging cameras",
    ],
    safety_distance_m: 200,
    response_time_target_min: 10,
    personnel_required: 8,
    coordination: ["Plant Safety Officer", "District Fire Officer"],
    special_notes:
      "Coordinate with plant safety officer for shutdown procedures. Check for pressurized systems.",
    evacuation_radius_m: 500,
    hospital_notification: true,
    USE: ["Water spray (cooling)", "Foam", "Dry chemical powder"],
    AVOID: [
      "Direct water on molten metal (explosion risk)",
      "Class D materials without special powder",
    ],
    equipment: ["Fire tenders (2+)", "Foam units", "Heat-resistant suits"],
  },
  EMERGENCY_INDUSTRIAL: {
    fire_class: "Class B/C likely",
    typical_materials: ["Chemicals", "Petroleum", "Solvents", "Gases", "Plastics"],
    use_agents: {
      primary: ["Foam (AFFF)", "CO2", "Dry chemical"],
      secondary: ["Halon (if available)"],
    },
    avoid: [
      "Water on petroleum/electrical fires",
      "Water on chemical fires (can spread/react)",
    ],
    equipment_required: [
      "Foam tenders (3+)",
      "Hazmat suits (Level A)",
      "CO2 units",
      "SCBA breathing apparatus",
      "Chemical detection kits",
      "Decontamination trailer",
    ],
    safety_distance_m: 500,
    response_time_target_min: 5,
    personnel_required: 15,
    coordination: [
      "NDRF",
      "District Collector",
      "Pollution Control Board",
      "Nearest Hospital",
    ],
    special_notes:
      "IDENTIFY CHEMICAL BEFORE APPROACH. Check MSDS. Evacuate downwind areas. Monitor for toxic release.",
    evacuation_radius_m: 1000,
    hospital_notification: true,
    aerial_support: "Consider helicopter if fire >500m",
    USE: ["Foam (AFFF)", "CO2", "Dry chemical"],
    AVOID: [
      "Water on petroleum/electrical fires",
      "Water on chemical fires (can spread/react)",
    ],
    equipment: ["Foam tenders (3+)", "Hazmat suits (Level A)", "CO2 units"],
  },
  AGRICULTURAL_BURNING: {
    fire_class: "Class A",
    typical_materials: ["Crop residue", "Biomass", "Stubble"],
    use_agents: {
      primary: ["Water", "Containment (fire breaks)"],
      secondary: ["Controlled backburn"],
    },
    avoid: [
      "Overreaction (often planned)",
      "Chemical suppressants (contaminates soil)",
    ],
    equipment_required: [
      "Water bowsers",
      "Tractors with plows",
      "Basic firefighting gear",
    ],
    safety_distance_m: 100,
    response_time_target_min: 30,
    personnel_required: 4,
    coordination: [
      "Local Panchayat",
      "Agriculture Department",
      "Pollution Control Board",
    ],
    special_notes:
      "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
    evacuation_radius_m: 0,
    hospital_notification: false,
    aqi_alert: true,
    USE: ["Water", "Containment (fire breaks)"],
    AVOID: [
      "Overreaction (often planned)",
      "Chemical suppressants (contaminates soil)",
    ],
    equipment: ["Water bowsers", "Tractors with plows"],
  },
  FOREST_FIRE: {
    fire_class: "Class A",
    typical_materials: ["Vegetation", "Trees", "Underbrush", "Dead leaves"],
    use_agents: {
      primary: ["Water (aerial)", "Fire breaks", "Backburning"],
      secondary: ["Foam retardant"],
    },
    avoid: ["Driving into fire zone", "Standing downwind of active fire"],
    equipment_required: [
      "Fire crews (10+)",
      "Water tankers",
      "Helicopters with water buckets",
      "Chainsaws",
      "Fire beaters",
      "GPS radios",
    ],
    safety_distance_m: 1000,
    response_time_target_min: 60,
    personnel_required: 20,
    coordination: [
      "Forest Department",
      "NDRF",
      "IAF (aerial support)",
      "Village councils in fire path",
    ],
    special_notes:
      "WIND DIRECTION IS CRITICAL. Establish fire breaks perpendicular to wind. Aerial suppression for large fires.",
    evacuation_radius_m: 3000,
    hospital_notification: true,
    aerial_support: "Mandatory for fires >2 hectares",
    wildlife_protocol: true,
    USE: ["Water (aerial)", "Fire breaks", "Backburning"],
    AVOID: ["Driving into fire zone", "Standing downwind of active fire"],
    equipment: ["Fire crews (10+)", "Water tankers", "Helicopters"],
  },
  UNKNOWN: {
    fire_class: "Unknown - requires verification",
    typical_materials: ["Unknown"],
    use_agents: {
      primary: ["Verify before action"],
      secondary: [],
    },
    avoid: ["Approach without verification"],
    equipment_required: [
      "Reconnaissance drone",
      "Fire officer for assessment",
    ],
    safety_distance_m: 500,
    response_time_target_min: 20,
    personnel_required: 3,
    coordination: ["Local authorities for ground truth"],
    special_notes:
      "Send ground team for visual confirmation before dispatching resources. Use satellite imagery cross-reference.",
    evacuation_radius_m: 500,
    hospital_notification: false,
    USE: ["Verify before action", "Reconnaissance drone"],
    AVOID: ["Approach without verification"],
    equipment: ["Reconnaissance drone", "Fire officer for assessment"],
  },
};

export function getResponseProtocol(category: string): FireResponseProtocol {
  const key = (category || "UNKNOWN").toUpperCase();
  return FIRE_RESPONSE_PROTOCOLS[key] || FIRE_RESPONSE_PROTOCOLS.UNKNOWN;
}
