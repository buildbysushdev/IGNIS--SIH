export interface FireResponseProtocol {
  typical_materials: string[];
  fire_class: string;
  USE: string[];
  AVOID: string[];
  equipment: string[];
  safety_distance_m: number;
  response_time_target_min: number;
  special_notes: string;
}

export const FIRE_RESPONSE_PROTOCOLS: Record<string, FireResponseProtocol> = {
  PERSISTENT_INDUSTRIAL: {
    typical_materials: ["steel", "coal", "coke"],
    fire_class: "A/B mixed",
    USE: ["water spray", "foam"],
    AVOID: ["direct water on molten metal"],
    equipment: ["fire tenders", "foam units"],
    safety_distance_m: 200,
    response_time_target_min: 10,
    special_notes: "Coordinate with plant safety officer",
  },
  EMERGENCY_INDUSTRIAL: {
    typical_materials: ["chemicals", "petroleum", "gases"],
    fire_class: "B/C likely",
    USE: ["foam", "CO2", "dry chemical"],
    AVOID: ["water on petroleum/electrical"],
    equipment: ["foam tenders", "hazmat suits", "CO2 units"],
    safety_distance_m: 500,
    response_time_target_min: 5,
    special_notes: "Evacuate 500m radius. Check for toxic release.",
  },
  AGRICULTURAL_BURNING: {
    typical_materials: ["crop residue", "biomass"],
    fire_class: "A",
    USE: ["water", "controlled containment"],
    AVOID: ["chemicals"],
    equipment: ["water bowsers", "tractors with plows"],
    safety_distance_m: 100,
    response_time_target_min: 30,
    special_notes: "Often planned. Monitor spread to non-farm areas.",
  },
  FOREST_FIRE: {
    typical_materials: ["vegetation", "trees"],
    fire_class: "A",
    USE: ["water", "fire breaks", "aerial suppression"],
    AVOID: ["driving into fire zone"],
    equipment: ["fire crews", "water tankers", "helicopters"],
    safety_distance_m: 1000,
    response_time_target_min: 60,
    special_notes: "Wind direction critical. Establish fire breaks.",
  },
  UNKNOWN: {
    typical_materials: ["unidentified substrate"],
    fire_class: "Unclassified",
    USE: ["reconnaissance drone", "multi-purpose dry chemical"],
    AVOID: ["unplanned direct intervention"],
    equipment: ["thermal scout drone", "rapid intervention vehicle"],
    safety_distance_m: 250,
    response_time_target_min: 15,
    special_notes: "Perform optical verification prior to full tender deployment.",
  },
};

export function getResponseProtocol(category: string): FireResponseProtocol {
  return FIRE_RESPONSE_PROTOCOLS[category] || FIRE_RESPONSE_PROTOCOLS.UNKNOWN;
}
