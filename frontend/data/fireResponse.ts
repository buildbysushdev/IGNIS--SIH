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
  HOSPITAL_FIRE: {
    fire_class: "Class A/C Life-Critical",
    typical_materials: ["Medical Equipment", "Linens", "Oxygen Pipelines", "Plastics"],
    use_agents: {
      primary: ["Water Spray (non-electrical)", "CO2", "Wet Chemical"],
      secondary: ["Clean Agent FE-36"],
    },
    avoid: [
      "Cutting main power without ICU backup generator check",
      "Direct water jets on energized diagnostic equipment",
    ],
    equipment_required: [
      "Fire Tenders (3+)",
      "Ambulances (5+)",
      "ICU Stretchers",
      "Smoke Ejectors",
      "Portable Oxygen Resuscitators",
    ],
    safety_distance_m: 200,
    response_time_target_min: 3,
    personnel_required: 16,
    coordination: [
      "Hospital Medical Superintendent",
      "District Collector",
      "Chief Medical Officer",
      "Disaster Management Cell",
    ],
    special_notes:
      "Coordinate with Hospital Administrator for ICU patient triage and oxygen manifold shutoff. Prioritize non-ambulatory patient evacuation.",
    evacuation_radius_m: 200,
    hospital_notification: true,
    USE: ["Water Spray (non-electrical)", "CO2", "Wet Chemical"],
    AVOID: ["Cutting main power without ICU check", "Direct water on diagnostic tools"],
    equipment: ["Fire Tenders (3+)", "Ambulances (5+)", "ICU Stretchers", "Smoke Ejectors"],
  },
  FUEL_STATION_FIRE: {
    fire_class: "Class B Flammable Liquid / BLEVE Hazard",
    typical_materials: ["Motor Spirit (Petrol)", "High Speed Diesel", "LPG/CNG Dispenser Lines"],
    use_agents: {
      primary: ["AFFF Foam", "Dry Chemical Powder (DCP)", "CO2"],
      secondary: ["Alcohol-Resistant Foam"],
    },
    avoid: [
      "DO NOT USE WATER / DIRECT WATER STREAMS (Spreads fuel and causes steam explosion)",
      "Approaching downwind of fuel storage",
    ],
    equipment_required: [
      "Foam Tenders (3+)",
      "DCP Extinguishers (50kg trolleys)",
      "Hazmat Protective Gear",
      "Water Bowser for boundary cooling",
    ],
    safety_distance_m: 500,
    response_time_target_min: 3,
    personnel_required: 14,
    coordination: [
      "Oil Marketing Company Safety Cell (IOCL/HPCL/BPCL)",
      "District Emergency Operations Centre",
      "Police Traffic Control",
    ],
    special_notes:
      "STRICT 500m Evacuation. Cool underground/overhead fuel storage tanks with water mist from distance. Activate emergency shut-off valves.",
    evacuation_radius_m: 500,
    hospital_notification: true,
    USE: ["AFFF Foam", "Dry Chemical Powder (DCP)", "CO2"],
    AVOID: ["DIRECT WATER STREAMS (Causes steam explosion & fuel spread)"],
    equipment: ["Foam Tenders (3+)", "DCP Extinguishers (50kg)", "Hazmat Gear"],
  },
  RESTAURANT_KITCHEN_FIRE: {
    fire_class: "Class F / Class B (Cooking Oils & Commercial Gas)",
    typical_materials: ["Cooking Oils", "Animal Fats", "Commercial LPG", "Ductwork Grease"],
    use_agents: {
      primary: ["Wet Chemical (Class F)", "CO2", "Fire Blankets"],
      secondary: ["AFFF Foam"],
    },
    avoid: [
      "Water on hot cooking oil (causes explosive oil flare)",
      "Using ventilation fans before fire suppression",
    ],
    equipment_required: [
      "CO2 Extinguishers",
      "Wet Chemical Extinguishers",
      "Foam Units",
      "Gas Detector & Thermal Camera",
    ],
    safety_distance_m: 100,
    response_time_target_min: 5,
    personnel_required: 6,
    coordination: [
      "Commercial Complex Safety Officer",
      "Local Fire Station",
      "Gas Pipeline Authority",
    ],
    special_notes:
      "Isolate commercial LPG manifold supply immediately. Evacuate adjacent commercial units. Check exhaust ducting for hidden spread.",
    evacuation_radius_m: 100,
    hospital_notification: false,
    USE: ["Wet Chemical (Class F)", "CO2", "Fire Blankets"],
    AVOID: ["Water on hot cooking oil (causes violent fireball flare)"],
    equipment: ["CO2 Extinguishers", "Wet Chemical Units", "Gas Leak Detector"],
  },
  DOMESTIC_LOW_INTENSITY_BURN: {
    fire_class: "Low-Risk Controlled/Domestic Heat",
    typical_materials: ["Yard Waste", "Domestic Biomass", "Garbage", "Cooking Fuel"],
    use_agents: {
      primary: ["Local bucket water if necessary", "Natural burnout monitoring"],
      secondary: [],
    },
    avoid: [
      "Emergency Tender Dispatch (Unnecessary)",
      "Panic public broadcasting",
    ],
    equipment_required: ["None - Automated Satellite Tracking"],
    safety_distance_m: 10,
    response_time_target_min: 60,
    personnel_required: 0,
    coordination: ["Municipal Sanitation Inspector (routine logging)"],
    special_notes:
      "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
    evacuation_radius_m: 0,
    hospital_notification: false,
    USE: ["Local bucket water if needed", "Continuous satellite surveillance"],
    AVOID: ["Emergency tender dispatch (Alert Suppressed)"],
    equipment: ["Automated Satellite Telemetry Tracking"],
  },
  SCHOOL_FIRE: {
    fire_class: "Class A/C Life-Safety Critical",
    typical_materials: ["Desks", "Paper", "Lab Chemicals", "Electrical Wiring"],
    use_agents: {
      primary: ["Water Mist", "CO2", "Dry Chemical Powder"],
      secondary: ["Foam"],
    },
    avoid: [
      "Re-entry into building prior to all-clear",
      "Blocking emergency school stairwells",
    ],
    equipment_required: [
      "Fire Tenders (2+)",
      "Ambulances (3+)",
      "Hydraulic Rescue Platform",
      "Breathing Apparatus",
    ],
    safety_distance_m: 200,
    response_time_target_min: 4,
    personnel_required: 12,
    coordination: [
      "School Administration & Principal",
      "City Police & Traffic Division",
      "District Education Officer",
    ],
    special_notes:
      "Immediate roll-call at external open assembly grounds. Verify student counts class-by-class. Restrict parent vehicle congestion.",
    evacuation_radius_m: 200,
    hospital_notification: true,
    USE: ["Water Mist", "CO2", "Dry Chemical Powder"],
    AVOID: ["Re-entry prior to all-clear", "Elevator use"],
    equipment: ["Fire Tenders (2+)", "Ambulances (3+)", "Rescue Platform"],
  },
  SLUM_DENSE_URBAN_FIRE: {
    fire_class: "Class A Rapid Lateral Conflagration",
    typical_materials: ["Timber", "Plastic Tarpaulins", "Tin Sheds", "Domestic LPG Cylinders"],
    use_agents: {
      primary: ["High-Volume Water Sprays", "Foam Blanket", "Fire Breaks"],
      secondary: ["DCP for cylinder clusters"],
    },
    avoid: [
      "Large engine entry in lanes < 2.5m wide",
      "Delaying power grid disconnection",
    ],
    equipment_required: [
      "Narrow-Lane Quick Response Vehicles (QRV)",
      "Long-distance Hose Lays (500m+)",
      "Portable High-Pressure Pumps",
      "Ambulances (4+)",
    ],
    safety_distance_m: 300,
    response_time_target_min: 4,
    personnel_required: 20,
    coordination: [
      "Disaster Management Authority",
      "Municipal Ward Officer",
      "Community Volunteers / Civil Defence",
      "Electricity Distribution Board",
    ],
    special_notes:
      "Extreme risk of rapid lateral spread and cylinder BLEVEs. Immediate electric power grid cut-off for the sector. Broadcast SMS alert.",
    evacuation_radius_m: 300,
    hospital_notification: true,
    USE: ["High-Volume Water Sprays", "Foam Blanket", "Fire Breaks"],
    AVOID: ["Large engine entry in narrow alleys", "Live electric line contact"],
    equipment: ["Narrow-Lane QRV Units", "Portable High-Pressure Pumps", "Long Hose Lays"],
  },
  COMMERCIAL_MARKET_FIRE: {
    fire_class: "Class A/B Commercial Hazard",
    typical_materials: ["Textiles", "Plastics", "Cardboard Packaging", "Electrical Kiosks"],
    use_agents: {
      primary: ["Water Tenders", "AFFF Foam", "Dry Chemical Powder"],
      secondary: ["Water Mist"],
    },
    avoid: [
      "Operating without crowd control cordons",
      "Water on live sub-station transformers",
    ],
    equipment_required: [
      "Fire Tenders (4+)",
      "Water Bowsers (2+)",
      "Turntable Ladders / Snorkels",
      "Crowd Control Barricades",
    ],
    safety_distance_m: 250,
    response_time_target_min: 5,
    personnel_required: 18,
    coordination: [
      "Market Traders Association",
      "City Traffic Police",
      "Power Utility",
      "Municipal Corporation",
    ],
    special_notes:
      "High combustible fuel load. Establish perimeter to manage pedestrian crowds and store owner re-entry. Isolate local power grid sector.",
    evacuation_radius_m: 250,
    hospital_notification: true,
    USE: ["Water Tenders", "AFFF Foam", "Dry Chemical Powder"],
    AVOID: ["Operating without crowd cordons", "Water on live transformers"],
    equipment: ["Fire Tenders (4+)", "Water Bowsers (2+)", "Turntable Ladders"],
  },
  RESIDENTIAL_STRUCTURE_FIRE: {
    fire_class: "Class A/C Multi-Story Structure",
    typical_materials: ["Furniture", "Electronics", "Domestic LPG", "Curtains"],
    use_agents: {
      primary: ["Water Fog & Spray", "CO2 for electrical panels", "Foam"],
      secondary: ["Thermal Imaging Camera Search"],
    },
    avoid: [
      "Using elevators during structural fire",
      "Ventilation before charged line placement",
    ],
    equipment_required: [
      "Fire Tenders (2+)",
      "Aerial Ladder Platform",
      "Thermal Imaging Cameras",
      "SCBA Breathing Sets",
      "Ambulances (2+)",
    ],
    safety_distance_m: 150,
    response_time_target_min: 5,
    personnel_required: 10,
    coordination: [
      "Resident Welfare Association (RWA)",
      "Local Police",
      "Gas and Power Utilities",
    ],
    special_notes:
      "Immediate search and rescue on fire floor and floor above for smoke inhalation. Check stairwells for occupant evacuation.",
    evacuation_radius_m: 150,
    hospital_notification: true,
    USE: ["Water Fog & Spray", "CO2 for electrical panels", "Foam"],
    AVOID: ["Using elevators during fire", "Premature window ventilation"],
    equipment: ["Fire Tenders (2+)", "Aerial Ladder Platform", "SCBA Breathing Sets"],
  },
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
