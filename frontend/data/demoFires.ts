// 250 Realistic Demo Hotspots with Full Tactical Classifications
export const DEMO_TELEMETRY_DATA = {
  "fires": [
    {
      "id": "IGNIS-EM-0002",
      "latitude": 28.5672,
      "longitude": 77.21,
      "brightness": 345.2,
      "frp": 18.5,
      "confidence": 96,
      "confidence_score": 0.96,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1230",
      "daynight": "D",
      "category": "HOSPITAL_FIRE",
      "location_type": "HOSPITAL",
      "risk_level": "CRITICAL",
      "color": "red",
      "facility_name": "AIIMS New Delhi Area",
      "reason": "CRITICAL: Active thermal anomaly inside/adjacent to Hospital facility (AIIMS New Delhi Area). High patient casualty risk.",
      "action": "\ud83d\udea8 IMMEDIATE DISPATCH! Notify ICU Triage, Medical Evacuation, and District Collector.",
      "classification": "HOSPITAL_FIRE",
      "response_protocol": {
        "fire_class": "Class A/C Life-Critical",
        "typical_materials": [
          "Medical Equipment",
          "Linens",
          "Oxygen Pipelines",
          "Plastics"
        ],
        "use_agents": {
          "primary": [
            "Water Spray (non-electrical)",
            "CO2",
            "Wet Chemical"
          ],
          "secondary": [
            "Clean Agent FE-36"
          ]
        },
        "avoid": [
          "Cutting main power without ICU backup generator check",
          "Direct water jets on energized diagnostic equipment"
        ],
        "equipment_required": [
          "Fire Tenders (3+)",
          "Ambulances (5+)",
          "ICU Stretchers",
          "Smoke Ejectors",
          "Portable Oxygen Resuscitators"
        ],
        "safety_distance_m": 200,
        "response_time_target_min": 3,
        "personnel_required": 16,
        "coordination": [
          "Hospital Medical Superintendent",
          "District Collector",
          "Chief Medical Officer",
          "Disaster Management Cell"
        ],
        "special_notes": "Coordinate with Hospital Administrator for ICU patient triage and oxygen manifold shutoff. Prioritize non-ambulatory patient evacuation.",
        "evacuation_radius_m": 200,
        "hospital_notification": true
      }
    },
    {
      "id": "IGNIS-EM-0003",
      "latitude": 22.47,
      "longitude": 70.05,
      "brightness": 365.8,
      "frp": 24.2,
      "confidence": 95,
      "confidence_score": 0.95,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1230",
      "daynight": "D",
      "category": "FUEL_STATION_FIRE",
      "location_type": "PETROL_PUMP",
      "risk_level": "CRITICAL",
      "color": "red",
      "facility_name": "Jamnagar Fuel Station & Depot",
      "reason": "CRITICAL: Fire near fuel storage / petrol pump (Jamnagar Fuel Station & Depot). BLEVE & Explosion hazard.",
      "action": "\ud83d\udea8 FOAM TENDERS ONLY! DO NOT USE WATER. Evacuate 500m perimeter immediately.",
      "classification": "FUEL_STATION_FIRE",
      "response_protocol": {
        "fire_class": "Class B Flammable Liquid / BLEVE Hazard",
        "typical_materials": [
          "Motor Spirit (Petrol)",
          "High Speed Diesel",
          "LPG/CNG Dispenser Lines"
        ],
        "use_agents": {
          "primary": [
            "AFFF Foam",
            "Dry Chemical Powder (DCP)",
            "CO2"
          ],
          "secondary": [
            "Alcohol-Resistant Foam"
          ]
        },
        "avoid": [
          "DIRECT WATER STREAMS (Spreads fuel and causes steam explosion)",
          "Approaching downwind of fuel storage"
        ],
        "equipment_required": [
          "Foam Tenders (3+)",
          "DCP Extinguishers (50kg trolleys)",
          "Hazmat Protective Gear",
          "Water Bowser for boundary cooling"
        ],
        "safety_distance_m": 500,
        "response_time_target_min": 3,
        "personnel_required": 14,
        "coordination": [
          "Oil Marketing Company Safety Cell (IOCL/HPCL/BPCL)",
          "District Emergency Operations Centre",
          "Police Traffic Control"
        ],
        "special_notes": "STRICT 500m Evacuation. Cool underground/overhead fuel storage tanks with water mist from distance. Activate emergency shut-off valves.",
        "evacuation_radius_m": 500,
        "hospital_notification": true
      }
    },
    {
      "id": "IGNIS-EM-0004",
      "latitude": 28.5665,
      "longitude": 77.178,
      "brightness": 338.4,
      "frp": 16.4,
      "confidence": 93,
      "confidence_score": 0.93,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1230",
      "daynight": "D",
      "category": "SCHOOL_FIRE",
      "location_type": "SCHOOL",
      "risk_level": "CRITICAL",
      "color": "red",
      "facility_name": "Delhi Public School RK Puram",
      "reason": "CRITICAL: Thermal anomaly at educational institution (Delhi Public School RK Puram) during operational/occupancy window.",
      "action": "\ud83d\udea8 DISPATCH FIRE TENDERS & AMBULANCES. Coordinate student assembly point evacuation.",
      "classification": "SCHOOL_FIRE",
      "response_protocol": {
        "fire_class": "Class A/C Life-Safety Critical",
        "typical_materials": [
          "Desks",
          "Paper",
          "Lab Chemicals",
          "Electrical Wiring"
        ],
        "use_agents": {
          "primary": [
            "Water Mist",
            "CO2",
            "Dry Chemical Powder"
          ],
          "secondary": [
            "Foam"
          ]
        },
        "avoid": [
          "Re-entry into building prior to all-clear",
          "Blocking emergency school stairwells"
        ],
        "equipment_required": [
          "Fire Tenders (2+)",
          "Ambulances (3+)",
          "Hydraulic Rescue Platform",
          "Breathing Apparatus"
        ],
        "safety_distance_m": 200,
        "response_time_target_min": 4,
        "personnel_required": 12,
        "coordination": [
          "School Administration & Principal",
          "City Police & Traffic Division",
          "District Education Officer"
        ],
        "special_notes": "Immediate roll-call at external open assembly grounds. Verify student counts class-by-class. Restrict parent vehicle congestion.",
        "evacuation_radius_m": 200,
        "hospital_notification": true
      }
    },
    {
      "id": "IGNIS-EM-0005",
      "latitude": 19.0434,
      "longitude": 72.8562,
      "brightness": 352.0,
      "frp": 28.5,
      "confidence": 94,
      "confidence_score": 0.94,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1230",
      "daynight": "D",
      "category": "SLUM_DENSE_URBAN_FIRE",
      "location_type": "SLUM",
      "risk_level": "CRITICAL",
      "color": "red",
      "facility_name": "Dharavi Dense Urban Settlement Mumbai",
      "reason": "CRITICAL: High-density urban settlement fire (Dharavi Dense Urban Settlement Mumbai). Extreme risk of rapid lateral spread.",
      "action": "\ud83d\udea8 MASS DISPATCH! Narrow-lane access units required. Broadcast SMS evacuation alert.",
      "classification": "SLUM_DENSE_URBAN_FIRE",
      "response_protocol": {
        "fire_class": "Class A Rapid Lateral Conflagration",
        "typical_materials": [
          "Timber",
          "Plastic Tarpaulins",
          "Tin Sheds",
          "Domestic LPG Cylinders"
        ],
        "use_agents": {
          "primary": [
            "High-Volume Water Sprays",
            "Foam Blanket",
            "Fire Breaks"
          ],
          "secondary": [
            "DCP for cylinder clusters"
          ]
        },
        "avoid": [
          "Large engine entry in lanes < 2.5m wide",
          "Delaying power grid disconnection"
        ],
        "equipment_required": [
          "Narrow-Lane Quick Response Vehicles (QRV)",
          "Long-distance Hose Lays (500m+)",
          "Portable High-Pressure Pumps",
          "Ambulances (4+)"
        ],
        "safety_distance_m": 300,
        "response_time_target_min": 4,
        "personnel_required": 20,
        "coordination": [
          "Disaster Management Authority",
          "Municipal Ward Officer",
          "Community Volunteers / Civil Defence",
          "Electricity Distribution Board"
        ],
        "special_notes": "Extreme risk of rapid lateral spread and cylinder BLEVEs. Immediate electric power grid cut-off for the sector. Broadcast SMS alert.",
        "evacuation_radius_m": 300,
        "hospital_notification": true
      }
    },
    {
      "id": "IGNIS-EM-0001",
      "latitude": 21.17,
      "longitude": 72.83,
      "brightness": 384.5,
      "frp": 48.6,
      "confidence": 92,
      "confidence_score": 0.92,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1230",
      "daynight": "D",
      "category": "EMERGENCY_INDUSTRIAL",
      "location_type": "INDUSTRIAL",
      "risk_level": "CRITICAL",
      "color": "red",
      "facility_name": "Surat Chemical Cluster GIDC",
      "reason": "Unscheduled thermal surge (48.6MW) within 2.5km of Surat Chemical Cluster GIDC with no historical baseline. High emergency risk.",
      "action": "\ud83d\udea8 DISPATCH FIRE SERVICES IMMEDIATELY! Coordinate with facility safety officer.",
      "classification": "EMERGENCY_INDUSTRIAL",
      "response_protocol": {
        "fire_class": "Class B/C likely",
        "typical_materials": [
          "Chemicals",
          "Petroleum",
          "Solvents",
          "Gases",
          "Plastics"
        ],
        "use_agents": {
          "primary": [
            "Foam (AFFF)",
            "CO2",
            "Dry chemical"
          ],
          "secondary": [
            "Halon (if available)"
          ]
        },
        "avoid": [
          "Water on petroleum/electrical fires",
          "Water on chemical fires (can spread/react)"
        ],
        "equipment_required": [
          "Foam tenders (3+)",
          "Hazmat suits (Level A)",
          "CO2 units",
          "SCBA breathing apparatus",
          "Chemical detection kits",
          "Decontamination trailer"
        ],
        "safety_distance_m": 500,
        "response_time_target_min": 5,
        "personnel_required": 15,
        "coordination": [
          "NDRF",
          "District Collector",
          "Pollution Control Board",
          "Nearest Hospital"
        ],
        "special_notes": "IDENTIFY CHEMICAL BEFORE APPROACH. Check MSDS. Evacuate downwind areas. Monitor for toxic release.",
        "evacuation_radius_m": 1000,
        "hospital_notification": true,
        "aerial_support": "Consider helicopter if fire >500m"
      }
    },
    {
      "id": "IGNIS-EM-0006",
      "latitude": 20.37,
      "longitude": 72.9,
      "brightness": 388.0,
      "frp": 142.8,
      "confidence": 92,
      "confidence_score": 0.92,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1230",
      "daynight": "D",
      "category": "EMERGENCY_INDUSTRIAL",
      "location_type": "INDUSTRIAL",
      "risk_level": "CRITICAL",
      "color": "red",
      "facility_name": "Vapi Chemical Estate Complex",
      "reason": "Unscheduled thermal surge (142.8MW) within 1.3km of Vapi Chemical Estate Complex with no historical baseline. High emergency risk.",
      "action": "\ud83d\udea8 DISPATCH FIRE SERVICES IMMEDIATELY! Coordinate with facility safety officer.",
      "classification": "EMERGENCY_INDUSTRIAL",
      "response_protocol": {
        "fire_class": "Class B/C likely",
        "typical_materials": [
          "Chemicals",
          "Petroleum",
          "Solvents",
          "Gases",
          "Plastics"
        ],
        "use_agents": {
          "primary": [
            "Foam (AFFF)",
            "CO2",
            "Dry chemical"
          ],
          "secondary": [
            "Halon (if available)"
          ]
        },
        "avoid": [
          "Water on petroleum/electrical fires",
          "Water on chemical fires (can spread/react)"
        ],
        "equipment_required": [
          "Foam tenders (3+)",
          "Hazmat suits (Level A)",
          "CO2 units",
          "SCBA breathing apparatus",
          "Chemical detection kits",
          "Decontamination trailer"
        ],
        "safety_distance_m": 500,
        "response_time_target_min": 5,
        "personnel_required": 15,
        "coordination": [
          "NDRF",
          "District Collector",
          "Pollution Control Board",
          "Nearest Hospital"
        ],
        "special_notes": "IDENTIFY CHEMICAL BEFORE APPROACH. Check MSDS. Evacuate downwind areas. Monitor for toxic release.",
        "evacuation_radius_m": 1000,
        "hospital_notification": true,
        "aerial_support": "Consider helicopter if fire >500m"
      }
    },
    {
      "id": "IGNIS-EM-0007",
      "latitude": 21.63,
      "longitude": 73.0,
      "brightness": 395.2,
      "frp": 188.2,
      "confidence": 92,
      "confidence_score": 0.92,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1230",
      "daynight": "D",
      "category": "EMERGENCY_INDUSTRIAL",
      "location_type": "INDUSTRIAL",
      "risk_level": "CRITICAL",
      "color": "red",
      "facility_name": "Ankleshwar Petrochemical Complex",
      "reason": "Unscheduled thermal surge (188.2MW) within 0.5km of Ankleshwar Petrochemical Complex with no historical baseline. High emergency risk.",
      "action": "\ud83d\udea8 DISPATCH FIRE SERVICES IMMEDIATELY! Coordinate with facility safety officer.",
      "classification": "EMERGENCY_INDUSTRIAL",
      "response_protocol": {
        "fire_class": "Class B/C likely",
        "typical_materials": [
          "Chemicals",
          "Petroleum",
          "Solvents",
          "Gases",
          "Plastics"
        ],
        "use_agents": {
          "primary": [
            "Foam (AFFF)",
            "CO2",
            "Dry chemical"
          ],
          "secondary": [
            "Halon (if available)"
          ]
        },
        "avoid": [
          "Water on petroleum/electrical fires",
          "Water on chemical fires (can spread/react)"
        ],
        "equipment_required": [
          "Foam tenders (3+)",
          "Hazmat suits (Level A)",
          "CO2 units",
          "SCBA breathing apparatus",
          "Chemical detection kits",
          "Decontamination trailer"
        ],
        "safety_distance_m": 500,
        "response_time_target_min": 5,
        "personnel_required": 15,
        "coordination": [
          "NDRF",
          "District Collector",
          "Pollution Control Board",
          "Nearest Hospital"
        ],
        "special_notes": "IDENTIFY CHEMICAL BEFORE APPROACH. Check MSDS. Evacuate downwind areas. Monitor for toxic release.",
        "evacuation_radius_m": 1000,
        "hospital_notification": true,
        "aerial_support": "Consider helicopter if fire >500m"
      }
    },
    {
      "id": "IGNIS-HR-0001",
      "latitude": 12.975,
      "longitude": 77.605,
      "brightness": 335.4,
      "frp": 14.8,
      "confidence": 90,
      "confidence_score": 0.9,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1345",
      "daynight": "D",
      "category": "RESTAURANT_KITCHEN_FIRE",
      "location_type": "RESTAURANT",
      "risk_level": "HIGH",
      "color": "orange",
      "facility_name": "MG Road Restaurant & Kitchen Hub Bangalore",
      "reason": "HIGH RISK: Commercial kitchen fire (MG Road Restaurant & Kitchen Hub Bangalore). High probability of LPG cylinder involvement.",
      "action": "DISPATCH FOAM & CO2 UNITS. Isolate commercial LPG valves immediately.",
      "classification": "RESTAURANT_KITCHEN_FIRE",
      "response_protocol": {
        "fire_class": "Class F / Class B (Cooking Oils & Commercial Gas)",
        "typical_materials": [
          "Cooking Oils",
          "Animal Fats",
          "Commercial LPG",
          "Ductwork Grease"
        ],
        "use_agents": {
          "primary": [
            "Wet Chemical (Class F)",
            "CO2",
            "Fire Blankets"
          ],
          "secondary": [
            "AFFF Foam"
          ]
        },
        "avoid": [
          "Water on hot cooking oil (causes explosive oil flare)",
          "Using ventilation fans before fire suppression"
        ],
        "equipment_required": [
          "CO2 Extinguishers",
          "Wet Chemical Extinguishers",
          "Foam Units",
          "Gas Detector & Thermal Camera"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 5,
        "personnel_required": 6,
        "coordination": [
          "Commercial Complex Safety Officer",
          "Local Fire Station",
          "Gas Pipeline Authority"
        ],
        "special_notes": "Isolate commercial LPG manifold supply immediately. Evacuate adjacent commercial units. Check exhaust ducting for hidden spread.",
        "evacuation_radius_m": 100,
        "hospital_notification": false
      }
    },
    {
      "id": "IGNIS-HR-0002",
      "latitude": 28.6505,
      "longitude": 77.2303,
      "brightness": 348.0,
      "frp": 21.4,
      "confidence": 94,
      "confidence_score": 0.94,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1345",
      "daynight": "D",
      "category": "SLUM_DENSE_URBAN_FIRE",
      "location_type": "MARKET",
      "risk_level": "CRITICAL",
      "color": "red",
      "facility_name": "Chandni Chowk Wholesale Market Delhi",
      "reason": "CRITICAL: High-density urban settlement fire (Chandni Chowk Wholesale Market Delhi). Extreme risk of rapid lateral spread.",
      "action": "\ud83d\udea8 MASS DISPATCH! Narrow-lane access units required. Broadcast SMS evacuation alert.",
      "classification": "SLUM_DENSE_URBAN_FIRE",
      "response_protocol": {
        "fire_class": "Class A Rapid Lateral Conflagration",
        "typical_materials": [
          "Timber",
          "Plastic Tarpaulins",
          "Tin Sheds",
          "Domestic LPG Cylinders"
        ],
        "use_agents": {
          "primary": [
            "High-Volume Water Sprays",
            "Foam Blanket",
            "Fire Breaks"
          ],
          "secondary": [
            "DCP for cylinder clusters"
          ]
        },
        "avoid": [
          "Large engine entry in lanes < 2.5m wide",
          "Delaying power grid disconnection"
        ],
        "equipment_required": [
          "Narrow-Lane Quick Response Vehicles (QRV)",
          "Long-distance Hose Lays (500m+)",
          "Portable High-Pressure Pumps",
          "Ambulances (4+)"
        ],
        "safety_distance_m": 300,
        "response_time_target_min": 4,
        "personnel_required": 20,
        "coordination": [
          "Disaster Management Authority",
          "Municipal Ward Officer",
          "Community Volunteers / Civil Defence",
          "Electricity Distribution Board"
        ],
        "special_notes": "Extreme risk of rapid lateral spread and cylinder BLEVEs. Immediate electric power grid cut-off for the sector. Broadcast SMS alert.",
        "evacuation_radius_m": 300,
        "hospital_notification": true
      }
    },
    {
      "id": "IGNIS-HR-0003",
      "latitude": 18.5074,
      "longitude": 73.8077,
      "brightness": 342.1,
      "frp": 19.2,
      "confidence": 89,
      "confidence_score": 0.89,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1345",
      "daynight": "D",
      "category": "RESIDENTIAL_STRUCTURE_FIRE",
      "location_type": "RESIDENTIAL",
      "risk_level": "HIGH",
      "color": "orange",
      "facility_name": "Kothrud Residential Township Pune",
      "reason": "HIGH RISK: Expanding structure fire in residential building/apartments (Kothrud Residential Township Pune).",
      "action": "DISPATCH FIRE SERVICES. Search & rescue team for smoke inhalation.",
      "classification": "RESIDENTIAL_STRUCTURE_FIRE",
      "response_protocol": {
        "fire_class": "Class A/C Multi-Story Structure",
        "typical_materials": [
          "Furniture",
          "Electronics",
          "Domestic LPG",
          "Curtains"
        ],
        "use_agents": {
          "primary": [
            "Water Fog & Spray",
            "CO2 for electrical panels",
            "Foam"
          ],
          "secondary": [
            "Thermal Imaging Camera Search"
          ]
        },
        "avoid": [
          "Using elevators during structural fire",
          "Ventilation before charged line placement"
        ],
        "equipment_required": [
          "Fire Tenders (2+)",
          "Aerial Ladder Platform",
          "Thermal Imaging Cameras",
          "SCBA Breathing Sets",
          "Ambulances (2+)"
        ],
        "safety_distance_m": 150,
        "response_time_target_min": 5,
        "personnel_required": 10,
        "coordination": [
          "Resident Welfare Association (RWA)",
          "Local Police",
          "Gas and Power Utilities"
        ],
        "special_notes": "Immediate search and rescue on fire floor and floor above for smoke inhalation. Check stairwells for occupant evacuation.",
        "evacuation_radius_m": 150,
        "hospital_notification": true
      }
    },
    {
      "id": "IGNIS-PI-0001",
      "latitude": 21.2,
      "longitude": 81.38,
      "brightness": 358.4,
      "frp": 110.0,
      "confidence": 92,
      "confidence_score": 0.92,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "0915",
      "daynight": "D",
      "category": "EMERGENCY_INDUSTRIAL",
      "location_type": "INDUSTRIAL",
      "risk_level": "CRITICAL",
      "color": "red",
      "facility_name": "Bhilai Steel Plant",
      "reason": "Unscheduled thermal surge (110.0MW) within 0.0km of Bhilai Steel Plant with no historical baseline. High emergency risk.",
      "action": "\ud83d\udea8 DISPATCH FIRE SERVICES IMMEDIATELY! Coordinate with facility safety officer.",
      "classification": "EMERGENCY_INDUSTRIAL",
      "response_protocol": {
        "fire_class": "Class B/C likely",
        "typical_materials": [
          "Chemicals",
          "Petroleum",
          "Solvents",
          "Gases",
          "Plastics"
        ],
        "use_agents": {
          "primary": [
            "Foam (AFFF)",
            "CO2",
            "Dry chemical"
          ],
          "secondary": [
            "Halon (if available)"
          ]
        },
        "avoid": [
          "Water on petroleum/electrical fires",
          "Water on chemical fires (can spread/react)"
        ],
        "equipment_required": [
          "Foam tenders (3+)",
          "Hazmat suits (Level A)",
          "CO2 units",
          "SCBA breathing apparatus",
          "Chemical detection kits",
          "Decontamination trailer"
        ],
        "safety_distance_m": 500,
        "response_time_target_min": 5,
        "personnel_required": 15,
        "coordination": [
          "NDRF",
          "District Collector",
          "Pollution Control Board",
          "Nearest Hospital"
        ],
        "special_notes": "IDENTIFY CHEMICAL BEFORE APPROACH. Check MSDS. Evacuate downwind areas. Monitor for toxic release.",
        "evacuation_radius_m": 1000,
        "hospital_notification": true,
        "aerial_support": "Consider helicopter if fire >500m"
      }
    },
    {
      "latitude": 21.1525,
      "longitude": 81.3575,
      "brightness": 340.0,
      "frp": 243.6,
      "confidence": 55,
      "confidence_score": 0.55,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "2147",
      "daynight": "N",
      "category": "UNKNOWN",
      "location_type": "INDUSTRIAL",
      "risk_level": "MODERATE",
      "color": "gray",
      "reason": "Uncorrelated thermal anomaly (243.6MW). Proximity to industry: 5.8km. Persistence: 0%.",
      "action": "Manual verification recommended. Cross-check with local authorities.",
      "classification": "UNKNOWN",
      "response_protocol": {
        "fire_class": "Unknown - requires verification",
        "typical_materials": [
          "Unknown"
        ],
        "use_agents": {
          "primary": [
            "Verify before action"
          ],
          "secondary": []
        },
        "avoid": [
          "Approach without verification"
        ],
        "equipment_required": [
          "Reconnaissance drone",
          "Fire officer for assessment"
        ],
        "safety_distance_m": 500,
        "response_time_target_min": 20,
        "personnel_required": 3,
        "coordination": [
          "Local authorities for ground truth"
        ],
        "special_notes": "Send ground team for visual confirmation before dispatching resources. Use satellite imagery cross-reference.",
        "evacuation_radius_m": 500,
        "hospital_notification": false
      }
    },
    {
      "latitude": 21.153,
      "longitude": 81.3519,
      "brightness": 352.7,
      "frp": 105.2,
      "confidence": 55,
      "confidence_score": 0.55,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "0645",
      "daynight": "D",
      "category": "UNKNOWN",
      "location_type": "INDUSTRIAL",
      "risk_level": "MODERATE",
      "color": "gray",
      "reason": "Uncorrelated thermal anomaly (105.2MW). Proximity to industry: 6.0km. Persistence: 0%.",
      "action": "Manual verification recommended. Cross-check with local authorities.",
      "classification": "UNKNOWN",
      "response_protocol": {
        "fire_class": "Unknown - requires verification",
        "typical_materials": [
          "Unknown"
        ],
        "use_agents": {
          "primary": [
            "Verify before action"
          ],
          "secondary": []
        },
        "avoid": [
          "Approach without verification"
        ],
        "equipment_required": [
          "Reconnaissance drone",
          "Fire officer for assessment"
        ],
        "safety_distance_m": 500,
        "response_time_target_min": 20,
        "personnel_required": 3,
        "coordination": [
          "Local authorities for ground truth"
        ],
        "special_notes": "Send ground team for visual confirmation before dispatching resources. Use satellite imagery cross-reference.",
        "evacuation_radius_m": 500,
        "hospital_notification": false
      }
    },
    {
      "latitude": 22.7778,
      "longitude": 86.2369,
      "brightness": 364.1,
      "frp": 131.1,
      "confidence": 55,
      "confidence_score": 0.55,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1321",
      "daynight": "D",
      "category": "UNKNOWN",
      "location_type": "INDUSTRIAL",
      "risk_level": "MODERATE",
      "color": "gray",
      "reason": "Uncorrelated thermal anomaly (131.1MW). Proximity to industry: 4.5km. Persistence: 0%.",
      "action": "Manual verification recommended. Cross-check with local authorities.",
      "classification": "UNKNOWN",
      "response_protocol": {
        "fire_class": "Unknown - requires verification",
        "typical_materials": [
          "Unknown"
        ],
        "use_agents": {
          "primary": [
            "Verify before action"
          ],
          "secondary": []
        },
        "avoid": [
          "Approach without verification"
        ],
        "equipment_required": [
          "Reconnaissance drone",
          "Fire officer for assessment"
        ],
        "safety_distance_m": 500,
        "response_time_target_min": 20,
        "personnel_required": 3,
        "coordination": [
          "Local authorities for ground truth"
        ],
        "special_notes": "Send ground team for visual confirmation before dispatching resources. Use satellite imagery cross-reference.",
        "evacuation_radius_m": 500,
        "hospital_notification": false
      }
    },
    {
      "latitude": 22.2102,
      "longitude": 84.838,
      "brightness": 346.2,
      "frp": 167.1,
      "confidence": 55,
      "confidence_score": 0.55,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "0851",
      "daynight": "D",
      "category": "UNKNOWN",
      "location_type": "INDUSTRIAL",
      "risk_level": "MODERATE",
      "color": "gray",
      "reason": "Uncorrelated thermal anomaly (167.1MW). Proximity to industry: 4.6km. Persistence: 0%.",
      "action": "Manual verification recommended. Cross-check with local authorities.",
      "classification": "UNKNOWN",
      "response_protocol": {
        "fire_class": "Unknown - requires verification",
        "typical_materials": [
          "Unknown"
        ],
        "use_agents": {
          "primary": [
            "Verify before action"
          ],
          "secondary": []
        },
        "avoid": [
          "Approach without verification"
        ],
        "equipment_required": [
          "Reconnaissance drone",
          "Fire officer for assessment"
        ],
        "safety_distance_m": 500,
        "response_time_target_min": 20,
        "personnel_required": 3,
        "coordination": [
          "Local authorities for ground truth"
        ],
        "special_notes": "Send ground team for visual confirmation before dispatching resources. Use satellite imagery cross-reference.",
        "evacuation_radius_m": 500,
        "hospital_notification": false
      }
    },
    {
      "latitude": 22.7625,
      "longitude": 86.2422,
      "brightness": 333.5,
      "frp": 157.2,
      "confidence": 55,
      "confidence_score": 0.55,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "2039",
      "daynight": "N",
      "category": "UNKNOWN",
      "location_type": "INDUSTRIAL",
      "risk_level": "MODERATE",
      "color": "gray",
      "reason": "Uncorrelated thermal anomaly (157.2MW). Proximity to industry: 6.0km. Persistence: 0%.",
      "action": "Manual verification recommended. Cross-check with local authorities.",
      "classification": "UNKNOWN",
      "response_protocol": {
        "fire_class": "Unknown - requires verification",
        "typical_materials": [
          "Unknown"
        ],
        "use_agents": {
          "primary": [
            "Verify before action"
          ],
          "secondary": []
        },
        "avoid": [
          "Approach without verification"
        ],
        "equipment_required": [
          "Reconnaissance drone",
          "Fire officer for assessment"
        ],
        "safety_distance_m": 500,
        "response_time_target_min": 20,
        "personnel_required": 3,
        "coordination": [
          "Local authorities for ground truth"
        ],
        "special_notes": "Send ground team for visual confirmation before dispatching resources. Use satellite imagery cross-reference.",
        "evacuation_radius_m": 500,
        "hospital_notification": false
      }
    },
    {
      "latitude": 21.1546,
      "longitude": 81.3528,
      "brightness": 343.0,
      "frp": 115.6,
      "confidence": 55,
      "confidence_score": 0.55,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "0755",
      "daynight": "D",
      "category": "UNKNOWN",
      "location_type": "INDUSTRIAL",
      "risk_level": "MODERATE",
      "color": "gray",
      "reason": "Uncorrelated thermal anomaly (115.6MW). Proximity to industry: 5.8km. Persistence: 0%.",
      "action": "Manual verification recommended. Cross-check with local authorities.",
      "classification": "UNKNOWN",
      "response_protocol": {
        "fire_class": "Unknown - requires verification",
        "typical_materials": [
          "Unknown"
        ],
        "use_agents": {
          "primary": [
            "Verify before action"
          ],
          "secondary": []
        },
        "avoid": [
          "Approach without verification"
        ],
        "equipment_required": [
          "Reconnaissance drone",
          "Fire officer for assessment"
        ],
        "safety_distance_m": 500,
        "response_time_target_min": 20,
        "personnel_required": 3,
        "coordination": [
          "Local authorities for ground truth"
        ],
        "special_notes": "Send ground team for visual confirmation before dispatching resources. Use satellite imagery cross-reference.",
        "evacuation_radius_m": 500,
        "hospital_notification": false
      }
    },
    {
      "latitude": 22.3636,
      "longitude": 69.0565,
      "brightness": 346.7,
      "frp": 140.9,
      "confidence": 95,
      "confidence_score": 0.95,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "0844",
      "daynight": "D",
      "category": "FUEL_STATION_FIRE",
      "location_type": "INDUSTRIAL",
      "risk_level": "CRITICAL",
      "color": "red",
      "reason": "CRITICAL: Fire near fuel storage / petrol pump (Reliance Jamnagar Refinery). BLEVE & Explosion hazard.",
      "action": "\ud83d\udea8 FOAM TENDERS ONLY! DO NOT USE WATER. Evacuate 500m perimeter immediately.",
      "classification": "FUEL_STATION_FIRE",
      "response_protocol": {
        "fire_class": "Class B Flammable Liquid / BLEVE Hazard",
        "typical_materials": [
          "Motor Spirit (Petrol)",
          "High Speed Diesel",
          "LPG/CNG Dispenser Lines"
        ],
        "use_agents": {
          "primary": [
            "AFFF Foam",
            "Dry Chemical Powder (DCP)",
            "CO2"
          ],
          "secondary": [
            "Alcohol-Resistant Foam"
          ]
        },
        "avoid": [
          "DIRECT WATER STREAMS (Spreads fuel and causes steam explosion)",
          "Approaching downwind of fuel storage"
        ],
        "equipment_required": [
          "Foam Tenders (3+)",
          "DCP Extinguishers (50kg trolleys)",
          "Hazmat Protective Gear",
          "Water Bowser for boundary cooling"
        ],
        "safety_distance_m": 500,
        "response_time_target_min": 3,
        "personnel_required": 14,
        "coordination": [
          "Oil Marketing Company Safety Cell (IOCL/HPCL/BPCL)",
          "District Emergency Operations Centre",
          "Police Traffic Control"
        ],
        "special_notes": "STRICT 500m Evacuation. Cool underground/overhead fuel storage tanks with water mist from distance. Activate emergency shut-off valves.",
        "evacuation_radius_m": 500,
        "hospital_notification": true
      }
    },
    {
      "latitude": 23.7934,
      "longitude": 86.1145,
      "brightness": 350.8,
      "frp": 152.6,
      "confidence": 92,
      "confidence_score": 0.92,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "2044",
      "daynight": "N",
      "category": "EMERGENCY_INDUSTRIAL",
      "location_type": "INDUSTRIAL",
      "risk_level": "CRITICAL",
      "color": "red",
      "reason": "Unscheduled thermal surge (152.6MW) within 2.6km of Bokaro Steel Plant with no historical baseline. High emergency risk.",
      "action": "\ud83d\udea8 DISPATCH FIRE SERVICES IMMEDIATELY! Coordinate with facility safety officer.",
      "classification": "EMERGENCY_INDUSTRIAL",
      "response_protocol": {
        "fire_class": "Class B/C likely",
        "typical_materials": [
          "Chemicals",
          "Petroleum",
          "Solvents",
          "Gases",
          "Plastics"
        ],
        "use_agents": {
          "primary": [
            "Foam (AFFF)",
            "CO2",
            "Dry chemical"
          ],
          "secondary": [
            "Halon (if available)"
          ]
        },
        "avoid": [
          "Water on petroleum/electrical fires",
          "Water on chemical fires (can spread/react)"
        ],
        "equipment_required": [
          "Foam tenders (3+)",
          "Hazmat suits (Level A)",
          "CO2 units",
          "SCBA breathing apparatus",
          "Chemical detection kits",
          "Decontamination trailer"
        ],
        "safety_distance_m": 500,
        "response_time_target_min": 5,
        "personnel_required": 15,
        "coordination": [
          "NDRF",
          "District Collector",
          "Pollution Control Board",
          "Nearest Hospital"
        ],
        "special_notes": "IDENTIFY CHEMICAL BEFORE APPROACH. Check MSDS. Evacuate downwind areas. Monitor for toxic release.",
        "evacuation_radius_m": 1000,
        "hospital_notification": true,
        "aerial_support": "Consider helicopter if fire >500m"
      }
    },
    {
      "latitude": 21.1729,
      "longitude": 81.3332,
      "brightness": 344.2,
      "frp": 152.2,
      "confidence": 55,
      "confidence_score": 0.55,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "0658",
      "daynight": "D",
      "category": "UNKNOWN",
      "location_type": "INDUSTRIAL",
      "risk_level": "MODERATE",
      "color": "gray",
      "reason": "Uncorrelated thermal anomaly (152.2MW). Proximity to industry: 5.7km. Persistence: 0%.",
      "action": "Manual verification recommended. Cross-check with local authorities.",
      "classification": "UNKNOWN",
      "response_protocol": {
        "fire_class": "Unknown - requires verification",
        "typical_materials": [
          "Unknown"
        ],
        "use_agents": {
          "primary": [
            "Verify before action"
          ],
          "secondary": []
        },
        "avoid": [
          "Approach without verification"
        ],
        "equipment_required": [
          "Reconnaissance drone",
          "Fire officer for assessment"
        ],
        "safety_distance_m": 500,
        "response_time_target_min": 20,
        "personnel_required": 3,
        "coordination": [
          "Local authorities for ground truth"
        ],
        "special_notes": "Send ground team for visual confirmation before dispatching resources. Use satellite imagery cross-reference.",
        "evacuation_radius_m": 500,
        "hospital_notification": false
      }
    },
    {
      "latitude": 22.3396,
      "longitude": 69.1115,
      "brightness": 350.6,
      "frp": 151.7,
      "confidence": 55,
      "confidence_score": 0.55,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "0747",
      "daynight": "D",
      "category": "UNKNOWN",
      "location_type": "INDUSTRIAL",
      "risk_level": "MODERATE",
      "color": "gray",
      "reason": "Uncorrelated thermal anomaly (151.7MW). Proximity to industry: 4.4km. Persistence: 0%.",
      "action": "Manual verification recommended. Cross-check with local authorities.",
      "classification": "UNKNOWN",
      "response_protocol": {
        "fire_class": "Unknown - requires verification",
        "typical_materials": [
          "Unknown"
        ],
        "use_agents": {
          "primary": [
            "Verify before action"
          ],
          "secondary": []
        },
        "avoid": [
          "Approach without verification"
        ],
        "equipment_required": [
          "Reconnaissance drone",
          "Fire officer for assessment"
        ],
        "safety_distance_m": 500,
        "response_time_target_min": 20,
        "personnel_required": 3,
        "coordination": [
          "Local authorities for ground truth"
        ],
        "special_notes": "Send ground team for visual confirmation before dispatching resources. Use satellite imagery cross-reference.",
        "evacuation_radius_m": 500,
        "hospital_notification": false
      }
    },
    {
      "latitude": 22.3898,
      "longitude": 69.0599,
      "brightness": 339.9,
      "frp": 294.5,
      "confidence": 55,
      "confidence_score": 0.55,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1631",
      "daynight": "D",
      "category": "UNKNOWN",
      "location_type": "INDUSTRIAL",
      "risk_level": "MODERATE",
      "color": "gray",
      "reason": "Uncorrelated thermal anomaly (294.5MW). Proximity to industry: 4.5km. Persistence: 0%.",
      "action": "Manual verification recommended. Cross-check with local authorities.",
      "classification": "UNKNOWN",
      "response_protocol": {
        "fire_class": "Unknown - requires verification",
        "typical_materials": [
          "Unknown"
        ],
        "use_agents": {
          "primary": [
            "Verify before action"
          ],
          "secondary": []
        },
        "avoid": [
          "Approach without verification"
        ],
        "equipment_required": [
          "Reconnaissance drone",
          "Fire officer for assessment"
        ],
        "safety_distance_m": 500,
        "response_time_target_min": 20,
        "personnel_required": 3,
        "coordination": [
          "Local authorities for ground truth"
        ],
        "special_notes": "Send ground team for visual confirmation before dispatching resources. Use satellite imagery cross-reference.",
        "evacuation_radius_m": 500,
        "hospital_notification": false
      }
    },
    {
      "latitude": 21.1653,
      "longitude": 81.346,
      "brightness": 360.6,
      "frp": 216.3,
      "confidence": 55,
      "confidence_score": 0.55,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1224",
      "daynight": "D",
      "category": "UNKNOWN",
      "location_type": "INDUSTRIAL",
      "risk_level": "MODERATE",
      "color": "gray",
      "reason": "Uncorrelated thermal anomaly (216.3MW). Proximity to industry: 5.2km. Persistence: 0%.",
      "action": "Manual verification recommended. Cross-check with local authorities.",
      "classification": "UNKNOWN",
      "response_protocol": {
        "fire_class": "Unknown - requires verification",
        "typical_materials": [
          "Unknown"
        ],
        "use_agents": {
          "primary": [
            "Verify before action"
          ],
          "secondary": []
        },
        "avoid": [
          "Approach without verification"
        ],
        "equipment_required": [
          "Reconnaissance drone",
          "Fire officer for assessment"
        ],
        "safety_distance_m": 500,
        "response_time_target_min": 20,
        "personnel_required": 3,
        "coordination": [
          "Local authorities for ground truth"
        ],
        "special_notes": "Send ground team for visual confirmation before dispatching resources. Use satellite imagery cross-reference.",
        "evacuation_radius_m": 500,
        "hospital_notification": false
      }
    },
    {
      "latitude": 22.8361,
      "longitude": 86.1511,
      "brightness": 362.4,
      "frp": 232.9,
      "confidence": 55,
      "confidence_score": 0.55,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1748",
      "daynight": "D",
      "category": "UNKNOWN",
      "location_type": "INDUSTRIAL",
      "risk_level": "MODERATE",
      "color": "gray",
      "reason": "Uncorrelated thermal anomaly (232.9MW). Proximity to industry: 6.4km. Persistence: 0%.",
      "action": "Manual verification recommended. Cross-check with local authorities.",
      "classification": "UNKNOWN",
      "response_protocol": {
        "fire_class": "Unknown - requires verification",
        "typical_materials": [
          "Unknown"
        ],
        "use_agents": {
          "primary": [
            "Verify before action"
          ],
          "secondary": []
        },
        "avoid": [
          "Approach without verification"
        ],
        "equipment_required": [
          "Reconnaissance drone",
          "Fire officer for assessment"
        ],
        "safety_distance_m": 500,
        "response_time_target_min": 20,
        "personnel_required": 3,
        "coordination": [
          "Local authorities for ground truth"
        ],
        "special_notes": "Send ground team for visual confirmation before dispatching resources. Use satellite imagery cross-reference.",
        "evacuation_radius_m": 500,
        "hospital_notification": false
      }
    },
    {
      "latitude": 22.2112,
      "longitude": 84.8435,
      "brightness": 350.4,
      "frp": 286.0,
      "confidence": 55,
      "confidence_score": 0.55,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "2316",
      "daynight": "N",
      "category": "UNKNOWN",
      "location_type": "INDUSTRIAL",
      "risk_level": "MODERATE",
      "color": "gray",
      "reason": "Uncorrelated thermal anomaly (286.0MW). Proximity to industry: 4.3km. Persistence: 0%.",
      "action": "Manual verification recommended. Cross-check with local authorities.",
      "classification": "UNKNOWN",
      "response_protocol": {
        "fire_class": "Unknown - requires verification",
        "typical_materials": [
          "Unknown"
        ],
        "use_agents": {
          "primary": [
            "Verify before action"
          ],
          "secondary": []
        },
        "avoid": [
          "Approach without verification"
        ],
        "equipment_required": [
          "Reconnaissance drone",
          "Fire officer for assessment"
        ],
        "safety_distance_m": 500,
        "response_time_target_min": 20,
        "personnel_required": 3,
        "coordination": [
          "Local authorities for ground truth"
        ],
        "special_notes": "Send ground team for visual confirmation before dispatching resources. Use satellite imagery cross-reference.",
        "evacuation_radius_m": 500,
        "hospital_notification": false
      }
    },
    {
      "latitude": 21.2371,
      "longitude": 81.3598,
      "brightness": 358.8,
      "frp": 218.7,
      "confidence": 55,
      "confidence_score": 0.55,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "0423",
      "daynight": "N",
      "category": "UNKNOWN",
      "location_type": "INDUSTRIAL",
      "risk_level": "MODERATE",
      "color": "gray",
      "reason": "Uncorrelated thermal anomaly (218.7MW). Proximity to industry: 4.6km. Persistence: 0%.",
      "action": "Manual verification recommended. Cross-check with local authorities.",
      "classification": "UNKNOWN",
      "response_protocol": {
        "fire_class": "Unknown - requires verification",
        "typical_materials": [
          "Unknown"
        ],
        "use_agents": {
          "primary": [
            "Verify before action"
          ],
          "secondary": []
        },
        "avoid": [
          "Approach without verification"
        ],
        "equipment_required": [
          "Reconnaissance drone",
          "Fire officer for assessment"
        ],
        "safety_distance_m": 500,
        "response_time_target_min": 20,
        "personnel_required": 3,
        "coordination": [
          "Local authorities for ground truth"
        ],
        "special_notes": "Send ground team for visual confirmation before dispatching resources. Use satellite imagery cross-reference.",
        "evacuation_radius_m": 500,
        "hospital_notification": false
      }
    },
    {
      "latitude": 22.8418,
      "longitude": 86.2099,
      "brightness": 352.0,
      "frp": 121.8,
      "confidence": 55,
      "confidence_score": 0.55,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1156",
      "daynight": "D",
      "category": "UNKNOWN",
      "location_type": "INDUSTRIAL",
      "risk_level": "MODERATE",
      "color": "gray",
      "reason": "Uncorrelated thermal anomaly (121.8MW). Proximity to industry: 4.7km. Persistence: 0%.",
      "action": "Manual verification recommended. Cross-check with local authorities.",
      "classification": "UNKNOWN",
      "response_protocol": {
        "fire_class": "Unknown - requires verification",
        "typical_materials": [
          "Unknown"
        ],
        "use_agents": {
          "primary": [
            "Verify before action"
          ],
          "secondary": []
        },
        "avoid": [
          "Approach without verification"
        ],
        "equipment_required": [
          "Reconnaissance drone",
          "Fire officer for assessment"
        ],
        "safety_distance_m": 500,
        "response_time_target_min": 20,
        "personnel_required": 3,
        "coordination": [
          "Local authorities for ground truth"
        ],
        "special_notes": "Send ground team for visual confirmation before dispatching resources. Use satellite imagery cross-reference.",
        "evacuation_radius_m": 500,
        "hospital_notification": false
      }
    },
    {
      "latitude": 23.8278,
      "longitude": 86.1847,
      "brightness": 333.9,
      "frp": 194.8,
      "confidence": 55,
      "confidence_score": 0.55,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "0248",
      "daynight": "N",
      "category": "UNKNOWN",
      "location_type": "INDUSTRIAL",
      "risk_level": "MODERATE",
      "color": "gray",
      "reason": "Uncorrelated thermal anomaly (194.8MW). Proximity to industry: 6.2km. Persistence: 0%.",
      "action": "Manual verification recommended. Cross-check with local authorities.",
      "classification": "UNKNOWN",
      "response_protocol": {
        "fire_class": "Unknown - requires verification",
        "typical_materials": [
          "Unknown"
        ],
        "use_agents": {
          "primary": [
            "Verify before action"
          ],
          "secondary": []
        },
        "avoid": [
          "Approach without verification"
        ],
        "equipment_required": [
          "Reconnaissance drone",
          "Fire officer for assessment"
        ],
        "safety_distance_m": 500,
        "response_time_target_min": 20,
        "personnel_required": 3,
        "coordination": [
          "Local authorities for ground truth"
        ],
        "special_notes": "Send ground team for visual confirmation before dispatching resources. Use satellite imagery cross-reference.",
        "evacuation_radius_m": 500,
        "hospital_notification": false
      }
    },
    {
      "latitude": 22.3947,
      "longitude": 69.0365,
      "brightness": 353.7,
      "frp": 218.3,
      "confidence": 55,
      "confidence_score": 0.55,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "0659",
      "daynight": "D",
      "category": "UNKNOWN",
      "location_type": "INDUSTRIAL",
      "risk_level": "MODERATE",
      "color": "gray",
      "reason": "Uncorrelated thermal anomaly (218.3MW). Proximity to industry: 6.0km. Persistence: 0%.",
      "action": "Manual verification recommended. Cross-check with local authorities.",
      "classification": "UNKNOWN",
      "response_protocol": {
        "fire_class": "Unknown - requires verification",
        "typical_materials": [
          "Unknown"
        ],
        "use_agents": {
          "primary": [
            "Verify before action"
          ],
          "secondary": []
        },
        "avoid": [
          "Approach without verification"
        ],
        "equipment_required": [
          "Reconnaissance drone",
          "Fire officer for assessment"
        ],
        "safety_distance_m": 500,
        "response_time_target_min": 20,
        "personnel_required": 3,
        "coordination": [
          "Local authorities for ground truth"
        ],
        "special_notes": "Send ground team for visual confirmation before dispatching resources. Use satellite imagery cross-reference.",
        "evacuation_radius_m": 500,
        "hospital_notification": false
      }
    },
    {
      "latitude": 22.3995,
      "longitude": 69.085,
      "brightness": 349.7,
      "frp": 200.9,
      "confidence": 55,
      "confidence_score": 0.55,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "0315",
      "daynight": "N",
      "category": "UNKNOWN",
      "location_type": "INDUSTRIAL",
      "risk_level": "MODERATE",
      "color": "gray",
      "reason": "Uncorrelated thermal anomaly (200.9MW). Proximity to industry: 5.7km. Persistence: 0%.",
      "action": "Manual verification recommended. Cross-check with local authorities.",
      "classification": "UNKNOWN",
      "response_protocol": {
        "fire_class": "Unknown - requires verification",
        "typical_materials": [
          "Unknown"
        ],
        "use_agents": {
          "primary": [
            "Verify before action"
          ],
          "secondary": []
        },
        "avoid": [
          "Approach without verification"
        ],
        "equipment_required": [
          "Reconnaissance drone",
          "Fire officer for assessment"
        ],
        "safety_distance_m": 500,
        "response_time_target_min": 20,
        "personnel_required": 3,
        "coordination": [
          "Local authorities for ground truth"
        ],
        "special_notes": "Send ground team for visual confirmation before dispatching resources. Use satellite imagery cross-reference.",
        "evacuation_radius_m": 500,
        "hospital_notification": false
      }
    },
    {
      "latitude": 21.2088,
      "longitude": 81.353,
      "brightness": 339.9,
      "frp": 113.8,
      "confidence": 92,
      "confidence_score": 0.92,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "2003",
      "daynight": "N",
      "category": "EMERGENCY_INDUSTRIAL",
      "location_type": "INDUSTRIAL",
      "risk_level": "CRITICAL",
      "color": "red",
      "reason": "Unscheduled thermal surge (113.8MW) within 3.0km of Bhilai Steel Plant with no historical baseline. High emergency risk.",
      "action": "\ud83d\udea8 DISPATCH FIRE SERVICES IMMEDIATELY! Coordinate with facility safety officer.",
      "classification": "EMERGENCY_INDUSTRIAL",
      "response_protocol": {
        "fire_class": "Class B/C likely",
        "typical_materials": [
          "Chemicals",
          "Petroleum",
          "Solvents",
          "Gases",
          "Plastics"
        ],
        "use_agents": {
          "primary": [
            "Foam (AFFF)",
            "CO2",
            "Dry chemical"
          ],
          "secondary": [
            "Halon (if available)"
          ]
        },
        "avoid": [
          "Water on petroleum/electrical fires",
          "Water on chemical fires (can spread/react)"
        ],
        "equipment_required": [
          "Foam tenders (3+)",
          "Hazmat suits (Level A)",
          "CO2 units",
          "SCBA breathing apparatus",
          "Chemical detection kits",
          "Decontamination trailer"
        ],
        "safety_distance_m": 500,
        "response_time_target_min": 5,
        "personnel_required": 15,
        "coordination": [
          "NDRF",
          "District Collector",
          "Pollution Control Board",
          "Nearest Hospital"
        ],
        "special_notes": "IDENTIFY CHEMICAL BEFORE APPROACH. Check MSDS. Evacuate downwind areas. Monitor for toxic release.",
        "evacuation_radius_m": 1000,
        "hospital_notification": true,
        "aerial_support": "Consider helicopter if fire >500m"
      }
    },
    {
      "latitude": 21.236,
      "longitude": 81.3371,
      "brightness": 340.7,
      "frp": 230.5,
      "confidence": 55,
      "confidence_score": 0.55,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "0634",
      "daynight": "D",
      "category": "UNKNOWN",
      "location_type": "INDUSTRIAL",
      "risk_level": "MODERATE",
      "color": "gray",
      "reason": "Uncorrelated thermal anomaly (230.5MW). Proximity to industry: 6.0km. Persistence: 0%.",
      "action": "Manual verification recommended. Cross-check with local authorities.",
      "classification": "UNKNOWN",
      "response_protocol": {
        "fire_class": "Unknown - requires verification",
        "typical_materials": [
          "Unknown"
        ],
        "use_agents": {
          "primary": [
            "Verify before action"
          ],
          "secondary": []
        },
        "avoid": [
          "Approach without verification"
        ],
        "equipment_required": [
          "Reconnaissance drone",
          "Fire officer for assessment"
        ],
        "safety_distance_m": 500,
        "response_time_target_min": 20,
        "personnel_required": 3,
        "coordination": [
          "Local authorities for ground truth"
        ],
        "special_notes": "Send ground team for visual confirmation before dispatching resources. Use satellite imagery cross-reference.",
        "evacuation_radius_m": 500,
        "hospital_notification": false
      }
    },
    {
      "latitude": 22.8076,
      "longitude": 86.1743,
      "brightness": 351.3,
      "frp": 179.4,
      "confidence": 92,
      "confidence_score": 0.92,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "0306",
      "daynight": "N",
      "category": "EMERGENCY_INDUSTRIAL",
      "location_type": "INDUSTRIAL",
      "risk_level": "CRITICAL",
      "color": "red",
      "reason": "Unscheduled thermal surge (179.4MW) within 2.8km of Jamshedpur (Tata Steel) with no historical baseline. High emergency risk.",
      "action": "\ud83d\udea8 DISPATCH FIRE SERVICES IMMEDIATELY! Coordinate with facility safety officer.",
      "classification": "EMERGENCY_INDUSTRIAL",
      "response_protocol": {
        "fire_class": "Class B/C likely",
        "typical_materials": [
          "Chemicals",
          "Petroleum",
          "Solvents",
          "Gases",
          "Plastics"
        ],
        "use_agents": {
          "primary": [
            "Foam (AFFF)",
            "CO2",
            "Dry chemical"
          ],
          "secondary": [
            "Halon (if available)"
          ]
        },
        "avoid": [
          "Water on petroleum/electrical fires",
          "Water on chemical fires (can spread/react)"
        ],
        "equipment_required": [
          "Foam tenders (3+)",
          "Hazmat suits (Level A)",
          "CO2 units",
          "SCBA breathing apparatus",
          "Chemical detection kits",
          "Decontamination trailer"
        ],
        "safety_distance_m": 500,
        "response_time_target_min": 5,
        "personnel_required": 15,
        "coordination": [
          "NDRF",
          "District Collector",
          "Pollution Control Board",
          "Nearest Hospital"
        ],
        "special_notes": "IDENTIFY CHEMICAL BEFORE APPROACH. Check MSDS. Evacuate downwind areas. Monitor for toxic release.",
        "evacuation_radius_m": 1000,
        "hospital_notification": true,
        "aerial_support": "Consider helicopter if fire >500m"
      }
    },
    {
      "latitude": 22.3467,
      "longitude": 69.0929,
      "brightness": 360.3,
      "frp": 291.9,
      "confidence": 95,
      "confidence_score": 0.95,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "0303",
      "daynight": "N",
      "category": "FUEL_STATION_FIRE",
      "location_type": "INDUSTRIAL",
      "risk_level": "CRITICAL",
      "color": "red",
      "reason": "CRITICAL: Fire near fuel storage / petrol pump (Reliance Jamnagar Refinery). BLEVE & Explosion hazard.",
      "action": "\ud83d\udea8 FOAM TENDERS ONLY! DO NOT USE WATER. Evacuate 500m perimeter immediately.",
      "classification": "FUEL_STATION_FIRE",
      "response_protocol": {
        "fire_class": "Class B Flammable Liquid / BLEVE Hazard",
        "typical_materials": [
          "Motor Spirit (Petrol)",
          "High Speed Diesel",
          "LPG/CNG Dispenser Lines"
        ],
        "use_agents": {
          "primary": [
            "AFFF Foam",
            "Dry Chemical Powder (DCP)",
            "CO2"
          ],
          "secondary": [
            "Alcohol-Resistant Foam"
          ]
        },
        "avoid": [
          "DIRECT WATER STREAMS (Spreads fuel and causes steam explosion)",
          "Approaching downwind of fuel storage"
        ],
        "equipment_required": [
          "Foam Tenders (3+)",
          "DCP Extinguishers (50kg trolleys)",
          "Hazmat Protective Gear",
          "Water Bowser for boundary cooling"
        ],
        "safety_distance_m": 500,
        "response_time_target_min": 3,
        "personnel_required": 14,
        "coordination": [
          "Oil Marketing Company Safety Cell (IOCL/HPCL/BPCL)",
          "District Emergency Operations Centre",
          "Police Traffic Control"
        ],
        "special_notes": "STRICT 500m Evacuation. Cool underground/overhead fuel storage tanks with water mist from distance. Activate emergency shut-off valves.",
        "evacuation_radius_m": 500,
        "hospital_notification": true
      }
    },
    {
      "latitude": 21.1749,
      "longitude": 81.349,
      "brightness": 350.2,
      "frp": 182.3,
      "confidence": 55,
      "confidence_score": 0.55,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "0829",
      "daynight": "D",
      "category": "UNKNOWN",
      "location_type": "INDUSTRIAL",
      "risk_level": "MODERATE",
      "color": "gray",
      "reason": "Uncorrelated thermal anomaly (182.3MW). Proximity to industry: 4.2km. Persistence: 0%.",
      "action": "Manual verification recommended. Cross-check with local authorities.",
      "classification": "UNKNOWN",
      "response_protocol": {
        "fire_class": "Unknown - requires verification",
        "typical_materials": [
          "Unknown"
        ],
        "use_agents": {
          "primary": [
            "Verify before action"
          ],
          "secondary": []
        },
        "avoid": [
          "Approach without verification"
        ],
        "equipment_required": [
          "Reconnaissance drone",
          "Fire officer for assessment"
        ],
        "safety_distance_m": 500,
        "response_time_target_min": 20,
        "personnel_required": 3,
        "coordination": [
          "Local authorities for ground truth"
        ],
        "special_notes": "Send ground team for visual confirmation before dispatching resources. Use satellite imagery cross-reference.",
        "evacuation_radius_m": 500,
        "hospital_notification": false
      }
    },
    {
      "latitude": 21.1943,
      "longitude": 81.4161,
      "brightness": 354.8,
      "frp": 109.9,
      "confidence": 55,
      "confidence_score": 0.55,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1753",
      "daynight": "D",
      "category": "UNKNOWN",
      "location_type": "INDUSTRIAL",
      "risk_level": "MODERATE",
      "color": "gray",
      "reason": "Uncorrelated thermal anomaly (109.9MW). Proximity to industry: 3.8km. Persistence: 0%.",
      "action": "Manual verification recommended. Cross-check with local authorities.",
      "classification": "UNKNOWN",
      "response_protocol": {
        "fire_class": "Unknown - requires verification",
        "typical_materials": [
          "Unknown"
        ],
        "use_agents": {
          "primary": [
            "Verify before action"
          ],
          "secondary": []
        },
        "avoid": [
          "Approach without verification"
        ],
        "equipment_required": [
          "Reconnaissance drone",
          "Fire officer for assessment"
        ],
        "safety_distance_m": 500,
        "response_time_target_min": 20,
        "personnel_required": 3,
        "coordination": [
          "Local authorities for ground truth"
        ],
        "special_notes": "Send ground team for visual confirmation before dispatching resources. Use satellite imagery cross-reference.",
        "evacuation_radius_m": 500,
        "hospital_notification": false
      }
    },
    {
      "latitude": 23.7566,
      "longitude": 86.1386,
      "brightness": 339.6,
      "frp": 178.2,
      "confidence": 55,
      "confidence_score": 0.55,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "0110",
      "daynight": "N",
      "category": "UNKNOWN",
      "location_type": "INDUSTRIAL",
      "risk_level": "MODERATE",
      "color": "gray",
      "reason": "Uncorrelated thermal anomaly (178.2MW). Proximity to industry: 3.7km. Persistence: 0%.",
      "action": "Manual verification recommended. Cross-check with local authorities.",
      "classification": "UNKNOWN",
      "response_protocol": {
        "fire_class": "Unknown - requires verification",
        "typical_materials": [
          "Unknown"
        ],
        "use_agents": {
          "primary": [
            "Verify before action"
          ],
          "secondary": []
        },
        "avoid": [
          "Approach without verification"
        ],
        "equipment_required": [
          "Reconnaissance drone",
          "Fire officer for assessment"
        ],
        "safety_distance_m": 500,
        "response_time_target_min": 20,
        "personnel_required": 3,
        "coordination": [
          "Local authorities for ground truth"
        ],
        "special_notes": "Send ground team for visual confirmation before dispatching resources. Use satellite imagery cross-reference.",
        "evacuation_radius_m": 500,
        "hospital_notification": false
      }
    },
    {
      "latitude": 22.3265,
      "longitude": 69.0984,
      "brightness": 350.5,
      "frp": 182.5,
      "confidence": 55,
      "confidence_score": 0.55,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "2350",
      "daynight": "N",
      "category": "UNKNOWN",
      "location_type": "INDUSTRIAL",
      "risk_level": "MODERATE",
      "color": "gray",
      "reason": "Uncorrelated thermal anomaly (182.5MW). Proximity to industry: 3.9km. Persistence: 0%.",
      "action": "Manual verification recommended. Cross-check with local authorities.",
      "classification": "UNKNOWN",
      "response_protocol": {
        "fire_class": "Unknown - requires verification",
        "typical_materials": [
          "Unknown"
        ],
        "use_agents": {
          "primary": [
            "Verify before action"
          ],
          "secondary": []
        },
        "avoid": [
          "Approach without verification"
        ],
        "equipment_required": [
          "Reconnaissance drone",
          "Fire officer for assessment"
        ],
        "safety_distance_m": 500,
        "response_time_target_min": 20,
        "personnel_required": 3,
        "coordination": [
          "Local authorities for ground truth"
        ],
        "special_notes": "Send ground team for visual confirmation before dispatching resources. Use satellite imagery cross-reference.",
        "evacuation_radius_m": 500,
        "hospital_notification": false
      }
    },
    {
      "latitude": 22.2218,
      "longitude": 84.8058,
      "brightness": 363.1,
      "frp": 111.9,
      "confidence": 55,
      "confidence_score": 0.55,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1003",
      "daynight": "D",
      "category": "UNKNOWN",
      "location_type": "INDUSTRIAL",
      "risk_level": "MODERATE",
      "color": "gray",
      "reason": "Uncorrelated thermal anomaly (111.9MW). Proximity to industry: 5.5km. Persistence: 0%.",
      "action": "Manual verification recommended. Cross-check with local authorities.",
      "classification": "UNKNOWN",
      "response_protocol": {
        "fire_class": "Unknown - requires verification",
        "typical_materials": [
          "Unknown"
        ],
        "use_agents": {
          "primary": [
            "Verify before action"
          ],
          "secondary": []
        },
        "avoid": [
          "Approach without verification"
        ],
        "equipment_required": [
          "Reconnaissance drone",
          "Fire officer for assessment"
        ],
        "safety_distance_m": 500,
        "response_time_target_min": 20,
        "personnel_required": 3,
        "coordination": [
          "Local authorities for ground truth"
        ],
        "special_notes": "Send ground team for visual confirmation before dispatching resources. Use satellite imagery cross-reference.",
        "evacuation_radius_m": 500,
        "hospital_notification": false
      }
    },
    {
      "latitude": 22.8419,
      "longitude": 86.2031,
      "brightness": 332.6,
      "frp": 199.0,
      "confidence": 55,
      "confidence_score": 0.55,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "0504",
      "daynight": "N",
      "category": "UNKNOWN",
      "location_type": "INDUSTRIAL",
      "risk_level": "MODERATE",
      "color": "gray",
      "reason": "Uncorrelated thermal anomaly (199.0MW). Proximity to industry: 4.7km. Persistence: 0%.",
      "action": "Manual verification recommended. Cross-check with local authorities.",
      "classification": "UNKNOWN",
      "response_protocol": {
        "fire_class": "Unknown - requires verification",
        "typical_materials": [
          "Unknown"
        ],
        "use_agents": {
          "primary": [
            "Verify before action"
          ],
          "secondary": []
        },
        "avoid": [
          "Approach without verification"
        ],
        "equipment_required": [
          "Reconnaissance drone",
          "Fire officer for assessment"
        ],
        "safety_distance_m": 500,
        "response_time_target_min": 20,
        "personnel_required": 3,
        "coordination": [
          "Local authorities for ground truth"
        ],
        "special_notes": "Send ground team for visual confirmation before dispatching resources. Use satellite imagery cross-reference.",
        "evacuation_radius_m": 500,
        "hospital_notification": false
      }
    },
    {
      "latitude": 23.7804,
      "longitude": 86.1842,
      "brightness": 355.6,
      "frp": 212.9,
      "confidence": 55,
      "confidence_score": 0.55,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "0139",
      "daynight": "N",
      "category": "UNKNOWN",
      "location_type": "INDUSTRIAL",
      "risk_level": "MODERATE",
      "color": "gray",
      "reason": "Uncorrelated thermal anomaly (212.9MW). Proximity to industry: 4.6km. Persistence: 0%.",
      "action": "Manual verification recommended. Cross-check with local authorities.",
      "classification": "UNKNOWN",
      "response_protocol": {
        "fire_class": "Unknown - requires verification",
        "typical_materials": [
          "Unknown"
        ],
        "use_agents": {
          "primary": [
            "Verify before action"
          ],
          "secondary": []
        },
        "avoid": [
          "Approach without verification"
        ],
        "equipment_required": [
          "Reconnaissance drone",
          "Fire officer for assessment"
        ],
        "safety_distance_m": 500,
        "response_time_target_min": 20,
        "personnel_required": 3,
        "coordination": [
          "Local authorities for ground truth"
        ],
        "special_notes": "Send ground team for visual confirmation before dispatching resources. Use satellite imagery cross-reference.",
        "evacuation_radius_m": 500,
        "hospital_notification": false
      }
    },
    {
      "latitude": 22.8065,
      "longitude": 86.1816,
      "brightness": 341.7,
      "frp": 230.6,
      "confidence": 92,
      "confidence_score": 0.92,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1015",
      "daynight": "D",
      "category": "EMERGENCY_INDUSTRIAL",
      "location_type": "INDUSTRIAL",
      "risk_level": "CRITICAL",
      "color": "red",
      "reason": "Unscheduled thermal surge (230.6MW) within 2.0km of Jamshedpur (Tata Steel) with no historical baseline. High emergency risk.",
      "action": "\ud83d\udea8 DISPATCH FIRE SERVICES IMMEDIATELY! Coordinate with facility safety officer.",
      "classification": "EMERGENCY_INDUSTRIAL",
      "response_protocol": {
        "fire_class": "Class B/C likely",
        "typical_materials": [
          "Chemicals",
          "Petroleum",
          "Solvents",
          "Gases",
          "Plastics"
        ],
        "use_agents": {
          "primary": [
            "Foam (AFFF)",
            "CO2",
            "Dry chemical"
          ],
          "secondary": [
            "Halon (if available)"
          ]
        },
        "avoid": [
          "Water on petroleum/electrical fires",
          "Water on chemical fires (can spread/react)"
        ],
        "equipment_required": [
          "Foam tenders (3+)",
          "Hazmat suits (Level A)",
          "CO2 units",
          "SCBA breathing apparatus",
          "Chemical detection kits",
          "Decontamination trailer"
        ],
        "safety_distance_m": 500,
        "response_time_target_min": 5,
        "personnel_required": 15,
        "coordination": [
          "NDRF",
          "District Collector",
          "Pollution Control Board",
          "Nearest Hospital"
        ],
        "special_notes": "IDENTIFY CHEMICAL BEFORE APPROACH. Check MSDS. Evacuate downwind areas. Monitor for toxic release.",
        "evacuation_radius_m": 1000,
        "hospital_notification": true,
        "aerial_support": "Consider helicopter if fire >500m"
      }
    },
    {
      "latitude": 22.2457,
      "longitude": 84.8929,
      "brightness": 372.1,
      "frp": 101.8,
      "confidence": 55,
      "confidence_score": 0.55,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1936",
      "daynight": "N",
      "category": "UNKNOWN",
      "location_type": "INDUSTRIAL",
      "risk_level": "MODERATE",
      "color": "gray",
      "reason": "Uncorrelated thermal anomaly (101.8MW). Proximity to industry: 4.5km. Persistence: 0%.",
      "action": "Manual verification recommended. Cross-check with local authorities.",
      "classification": "UNKNOWN",
      "response_protocol": {
        "fire_class": "Unknown - requires verification",
        "typical_materials": [
          "Unknown"
        ],
        "use_agents": {
          "primary": [
            "Verify before action"
          ],
          "secondary": []
        },
        "avoid": [
          "Approach without verification"
        ],
        "equipment_required": [
          "Reconnaissance drone",
          "Fire officer for assessment"
        ],
        "safety_distance_m": 500,
        "response_time_target_min": 20,
        "personnel_required": 3,
        "coordination": [
          "Local authorities for ground truth"
        ],
        "special_notes": "Send ground team for visual confirmation before dispatching resources. Use satellite imagery cross-reference.",
        "evacuation_radius_m": 500,
        "hospital_notification": false
      }
    },
    {
      "latitude": 23.7906,
      "longitude": 86.1032,
      "brightness": 345.7,
      "frp": 113.4,
      "confidence": 55,
      "confidence_score": 0.55,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "0723",
      "daynight": "D",
      "category": "UNKNOWN",
      "location_type": "INDUSTRIAL",
      "risk_level": "MODERATE",
      "color": "gray",
      "reason": "Uncorrelated thermal anomaly (113.4MW). Proximity to industry: 3.8km. Persistence: 0%.",
      "action": "Manual verification recommended. Cross-check with local authorities.",
      "classification": "UNKNOWN",
      "response_protocol": {
        "fire_class": "Unknown - requires verification",
        "typical_materials": [
          "Unknown"
        ],
        "use_agents": {
          "primary": [
            "Verify before action"
          ],
          "secondary": []
        },
        "avoid": [
          "Approach without verification"
        ],
        "equipment_required": [
          "Reconnaissance drone",
          "Fire officer for assessment"
        ],
        "safety_distance_m": 500,
        "response_time_target_min": 20,
        "personnel_required": 3,
        "coordination": [
          "Local authorities for ground truth"
        ],
        "special_notes": "Send ground team for visual confirmation before dispatching resources. Use satellite imagery cross-reference.",
        "evacuation_radius_m": 500,
        "hospital_notification": false
      }
    },
    {
      "latitude": 22.8204,
      "longitude": 86.2112,
      "brightness": 374.4,
      "frp": 227.5,
      "confidence": 92,
      "confidence_score": 0.92,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "0042",
      "daynight": "N",
      "category": "EMERGENCY_INDUSTRIAL",
      "location_type": "INDUSTRIAL",
      "risk_level": "CRITICAL",
      "color": "red",
      "reason": "Unscheduled thermal surge (227.5MW) within 2.5km of Jamshedpur (Tata Steel) with no historical baseline. High emergency risk.",
      "action": "\ud83d\udea8 DISPATCH FIRE SERVICES IMMEDIATELY! Coordinate with facility safety officer.",
      "classification": "EMERGENCY_INDUSTRIAL",
      "response_protocol": {
        "fire_class": "Class B/C likely",
        "typical_materials": [
          "Chemicals",
          "Petroleum",
          "Solvents",
          "Gases",
          "Plastics"
        ],
        "use_agents": {
          "primary": [
            "Foam (AFFF)",
            "CO2",
            "Dry chemical"
          ],
          "secondary": [
            "Halon (if available)"
          ]
        },
        "avoid": [
          "Water on petroleum/electrical fires",
          "Water on chemical fires (can spread/react)"
        ],
        "equipment_required": [
          "Foam tenders (3+)",
          "Hazmat suits (Level A)",
          "CO2 units",
          "SCBA breathing apparatus",
          "Chemical detection kits",
          "Decontamination trailer"
        ],
        "safety_distance_m": 500,
        "response_time_target_min": 5,
        "personnel_required": 15,
        "coordination": [
          "NDRF",
          "District Collector",
          "Pollution Control Board",
          "Nearest Hospital"
        ],
        "special_notes": "IDENTIFY CHEMICAL BEFORE APPROACH. Check MSDS. Evacuate downwind areas. Monitor for toxic release.",
        "evacuation_radius_m": 1000,
        "hospital_notification": true,
        "aerial_support": "Consider helicopter if fire >500m"
      }
    },
    {
      "latitude": 21.2439,
      "longitude": 81.3434,
      "brightness": 335.2,
      "frp": 120.9,
      "confidence": 55,
      "confidence_score": 0.55,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1709",
      "daynight": "D",
      "category": "UNKNOWN",
      "location_type": "INDUSTRIAL",
      "risk_level": "MODERATE",
      "color": "gray",
      "reason": "Uncorrelated thermal anomaly (120.9MW). Proximity to industry: 6.2km. Persistence: 0%.",
      "action": "Manual verification recommended. Cross-check with local authorities.",
      "classification": "UNKNOWN",
      "response_protocol": {
        "fire_class": "Unknown - requires verification",
        "typical_materials": [
          "Unknown"
        ],
        "use_agents": {
          "primary": [
            "Verify before action"
          ],
          "secondary": []
        },
        "avoid": [
          "Approach without verification"
        ],
        "equipment_required": [
          "Reconnaissance drone",
          "Fire officer for assessment"
        ],
        "safety_distance_m": 500,
        "response_time_target_min": 20,
        "personnel_required": 3,
        "coordination": [
          "Local authorities for ground truth"
        ],
        "special_notes": "Send ground team for visual confirmation before dispatching resources. Use satellite imagery cross-reference.",
        "evacuation_radius_m": 500,
        "hospital_notification": false
      }
    },
    {
      "latitude": 23.8118,
      "longitude": 86.1104,
      "brightness": 358.5,
      "frp": 151.5,
      "confidence": 55,
      "confidence_score": 0.55,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1516",
      "daynight": "D",
      "category": "UNKNOWN",
      "location_type": "INDUSTRIAL",
      "risk_level": "MODERATE",
      "color": "gray",
      "reason": "Uncorrelated thermal anomaly (151.5MW). Proximity to industry: 3.9km. Persistence: 0%.",
      "action": "Manual verification recommended. Cross-check with local authorities.",
      "classification": "UNKNOWN",
      "response_protocol": {
        "fire_class": "Unknown - requires verification",
        "typical_materials": [
          "Unknown"
        ],
        "use_agents": {
          "primary": [
            "Verify before action"
          ],
          "secondary": []
        },
        "avoid": [
          "Approach without verification"
        ],
        "equipment_required": [
          "Reconnaissance drone",
          "Fire officer for assessment"
        ],
        "safety_distance_m": 500,
        "response_time_target_min": 20,
        "personnel_required": 3,
        "coordination": [
          "Local authorities for ground truth"
        ],
        "special_notes": "Send ground team for visual confirmation before dispatching resources. Use satellite imagery cross-reference.",
        "evacuation_radius_m": 500,
        "hospital_notification": false
      }
    },
    {
      "latitude": 22.3829,
      "longitude": 69.0244,
      "brightness": 345.0,
      "frp": 125.5,
      "confidence": 55,
      "confidence_score": 0.55,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "0810",
      "daynight": "D",
      "category": "UNKNOWN",
      "location_type": "INDUSTRIAL",
      "risk_level": "MODERATE",
      "color": "gray",
      "reason": "Uncorrelated thermal anomaly (125.5MW). Proximity to industry: 5.9km. Persistence: 0%.",
      "action": "Manual verification recommended. Cross-check with local authorities.",
      "classification": "UNKNOWN",
      "response_protocol": {
        "fire_class": "Unknown - requires verification",
        "typical_materials": [
          "Unknown"
        ],
        "use_agents": {
          "primary": [
            "Verify before action"
          ],
          "secondary": []
        },
        "avoid": [
          "Approach without verification"
        ],
        "equipment_required": [
          "Reconnaissance drone",
          "Fire officer for assessment"
        ],
        "safety_distance_m": 500,
        "response_time_target_min": 20,
        "personnel_required": 3,
        "coordination": [
          "Local authorities for ground truth"
        ],
        "special_notes": "Send ground team for visual confirmation before dispatching resources. Use satellite imagery cross-reference.",
        "evacuation_radius_m": 500,
        "hospital_notification": false
      }
    },
    {
      "latitude": 22.3561,
      "longitude": 69.0312,
      "brightness": 372.5,
      "frp": 234.7,
      "confidence": 55,
      "confidence_score": 0.55,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "0434",
      "daynight": "N",
      "category": "UNKNOWN",
      "location_type": "INDUSTRIAL",
      "risk_level": "MODERATE",
      "color": "gray",
      "reason": "Uncorrelated thermal anomaly (234.7MW). Proximity to industry: 4.0km. Persistence: 0%.",
      "action": "Manual verification recommended. Cross-check with local authorities.",
      "classification": "UNKNOWN",
      "response_protocol": {
        "fire_class": "Unknown - requires verification",
        "typical_materials": [
          "Unknown"
        ],
        "use_agents": {
          "primary": [
            "Verify before action"
          ],
          "secondary": []
        },
        "avoid": [
          "Approach without verification"
        ],
        "equipment_required": [
          "Reconnaissance drone",
          "Fire officer for assessment"
        ],
        "safety_distance_m": 500,
        "response_time_target_min": 20,
        "personnel_required": 3,
        "coordination": [
          "Local authorities for ground truth"
        ],
        "special_notes": "Send ground team for visual confirmation before dispatching resources. Use satellite imagery cross-reference.",
        "evacuation_radius_m": 500,
        "hospital_notification": false
      }
    },
    {
      "latitude": 22.8053,
      "longitude": 86.193,
      "brightness": 331.9,
      "frp": 171.1,
      "confidence": 92,
      "confidence_score": 0.92,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "0157",
      "daynight": "N",
      "category": "EMERGENCY_INDUSTRIAL",
      "location_type": "INDUSTRIAL",
      "risk_level": "CRITICAL",
      "color": "red",
      "reason": "Unscheduled thermal surge (171.1MW) within 0.9km of Jamshedpur (Tata Steel) with no historical baseline. High emergency risk.",
      "action": "\ud83d\udea8 DISPATCH FIRE SERVICES IMMEDIATELY! Coordinate with facility safety officer.",
      "classification": "EMERGENCY_INDUSTRIAL",
      "response_protocol": {
        "fire_class": "Class B/C likely",
        "typical_materials": [
          "Chemicals",
          "Petroleum",
          "Solvents",
          "Gases",
          "Plastics"
        ],
        "use_agents": {
          "primary": [
            "Foam (AFFF)",
            "CO2",
            "Dry chemical"
          ],
          "secondary": [
            "Halon (if available)"
          ]
        },
        "avoid": [
          "Water on petroleum/electrical fires",
          "Water on chemical fires (can spread/react)"
        ],
        "equipment_required": [
          "Foam tenders (3+)",
          "Hazmat suits (Level A)",
          "CO2 units",
          "SCBA breathing apparatus",
          "Chemical detection kits",
          "Decontamination trailer"
        ],
        "safety_distance_m": 500,
        "response_time_target_min": 5,
        "personnel_required": 15,
        "coordination": [
          "NDRF",
          "District Collector",
          "Pollution Control Board",
          "Nearest Hospital"
        ],
        "special_notes": "IDENTIFY CHEMICAL BEFORE APPROACH. Check MSDS. Evacuate downwind areas. Monitor for toxic release.",
        "evacuation_radius_m": 1000,
        "hospital_notification": true,
        "aerial_support": "Consider helicopter if fire >500m"
      }
    },
    {
      "latitude": 30.2056,
      "longitude": 75.5602,
      "brightness": 331.5,
      "frp": 17.8,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1447",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 30.325,
      "longitude": 75.5998,
      "brightness": 310.3,
      "frp": 17.9,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1147",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 31.3398,
      "longitude": 75.4701,
      "brightness": 312.4,
      "frp": 11.8,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1506",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 28.4449,
      "longitude": 77.6332,
      "brightness": 318.8,
      "frp": 15.3,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1655",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 28.7969,
      "longitude": 76.5572,
      "brightness": 307.1,
      "frp": 26.6,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1241",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 28.6623,
      "longitude": 76.0552,
      "brightness": 331.3,
      "frp": 14.3,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1416",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 31.4571,
      "longitude": 74.6274,
      "brightness": 323.2,
      "frp": 20.3,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1357",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 28.0034,
      "longitude": 77.8512,
      "brightness": 321.2,
      "frp": 25.3,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1547",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 31.3285,
      "longitude": 74.6604,
      "brightness": 314.4,
      "frp": 28.4,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1557",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 28.6524,
      "longitude": 77.3944,
      "brightness": 321.6,
      "frp": 12.6,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1524",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 31.0959,
      "longitude": 74.0008,
      "brightness": 313.6,
      "frp": 18.3,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1438",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 30.4274,
      "longitude": 74.9464,
      "brightness": 332.0,
      "frp": 27.1,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1142",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 29.2385,
      "longitude": 76.1868,
      "brightness": 333.6,
      "frp": 13.6,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1214",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 31.9679,
      "longitude": 75.2225,
      "brightness": 328.1,
      "frp": 18.9,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1536",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 30.7993,
      "longitude": 74.2951,
      "brightness": 325.6,
      "frp": 29.4,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1649",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 31.6082,
      "longitude": 75.3918,
      "brightness": 318.9,
      "frp": 21.4,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1607",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 31.0623,
      "longitude": 75.1179,
      "brightness": 314.5,
      "frp": 26.1,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1339",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 31.7944,
      "longitude": 75.4873,
      "brightness": 319.2,
      "frp": 14.2,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1153",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 31.2535,
      "longitude": 74.5492,
      "brightness": 307.3,
      "frp": 14.9,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1221",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 30.3017,
      "longitude": 74.7661,
      "brightness": 309.6,
      "frp": 13.1,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1326",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 30.4137,
      "longitude": 74.8403,
      "brightness": 332.1,
      "frp": 22.0,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1501",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 28.5972,
      "longitude": 76.78,
      "brightness": 331.7,
      "frp": 28.1,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1447",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 30.9713,
      "longitude": 74.7777,
      "brightness": 325.1,
      "frp": 27.2,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1510",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 29.0682,
      "longitude": 77.8139,
      "brightness": 322.8,
      "frp": 23.9,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1041",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 30.1006,
      "longitude": 74.7582,
      "brightness": 311.3,
      "frp": 15.8,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1656",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 28.8431,
      "longitude": 77.6698,
      "brightness": 319.1,
      "frp": 26.0,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1022",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 29.3035,
      "longitude": 77.5085,
      "brightness": 333.5,
      "frp": 12.8,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1039",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 30.2288,
      "longitude": 75.8955,
      "brightness": 319.0,
      "frp": 14.1,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1210",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 30.6221,
      "longitude": 75.1574,
      "brightness": 332.9,
      "frp": 21.8,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1325",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 29.2545,
      "longitude": 76.2038,
      "brightness": 328.2,
      "frp": 28.4,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1451",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 30.0821,
      "longitude": 75.0655,
      "brightness": 324.8,
      "frp": 9.7,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1521",
      "daynight": "D",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "FARMLAND",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 28.2111,
      "longitude": 77.9216,
      "brightness": 324.1,
      "frp": 27.9,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1509",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 31.3009,
      "longitude": 75.2318,
      "brightness": 332.6,
      "frp": 26.6,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1327",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 31.8692,
      "longitude": 74.5579,
      "brightness": 318.5,
      "frp": 26.0,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1439",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 30.65,
      "longitude": 74.9751,
      "brightness": 315.6,
      "frp": 14.2,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1256",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 30.3821,
      "longitude": 74.4827,
      "brightness": 317.2,
      "frp": 21.3,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1144",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 31.5859,
      "longitude": 74.1861,
      "brightness": 311.6,
      "frp": 24.6,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1242",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 30.851,
      "longitude": 75.4919,
      "brightness": 314.9,
      "frp": 24.9,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1219",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 28.6311,
      "longitude": 77.4858,
      "brightness": 333.5,
      "frp": 24.6,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1113",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 31.5204,
      "longitude": 75.1936,
      "brightness": 334.4,
      "frp": 28.0,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1214",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 31.0683,
      "longitude": 74.5486,
      "brightness": 334.2,
      "frp": 21.3,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1508",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 30.5687,
      "longitude": 74.9574,
      "brightness": 315.2,
      "frp": 31.2,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1255",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 30.9835,
      "longitude": 75.154,
      "brightness": 325.6,
      "frp": 11.6,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1636",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 31.1161,
      "longitude": 74.8323,
      "brightness": 322.9,
      "frp": 22.8,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1633",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 31.7203,
      "longitude": 75.9801,
      "brightness": 314.2,
      "frp": 22.9,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1447",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 30.4221,
      "longitude": 75.3209,
      "brightness": 309.7,
      "frp": 12.2,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1010",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 28.9398,
      "longitude": 76.0653,
      "brightness": 313.6,
      "frp": 14.8,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1629",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 29.5757,
      "longitude": 77.2501,
      "brightness": 324.8,
      "frp": 30.4,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1307",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 29.6533,
      "longitude": 76.1428,
      "brightness": 310.0,
      "frp": 15.4,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1552",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 30.6082,
      "longitude": 74.805,
      "brightness": 313.2,
      "frp": 21.0,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1305",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 29.2074,
      "longitude": 76.0517,
      "brightness": 311.9,
      "frp": 24.2,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1636",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 28.539,
      "longitude": 76.0805,
      "brightness": 327.7,
      "frp": 19.3,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1528",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 31.2696,
      "longitude": 74.9835,
      "brightness": 307.7,
      "frp": 16.4,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1220",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 31.3873,
      "longitude": 74.5764,
      "brightness": 333.4,
      "frp": 27.5,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1402",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 30.2318,
      "longitude": 75.5451,
      "brightness": 330.9,
      "frp": 27.8,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1042",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 30.7236,
      "longitude": 75.5129,
      "brightness": 323.8,
      "frp": 26.2,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1117",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 31.3965,
      "longitude": 74.2429,
      "brightness": 334.2,
      "frp": 22.6,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1145",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 30.816,
      "longitude": 74.4494,
      "brightness": 330.2,
      "frp": 10.7,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1041",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 29.0177,
      "longitude": 76.5468,
      "brightness": 330.0,
      "frp": 31.5,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1129",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 29.0165,
      "longitude": 77.7587,
      "brightness": 330.9,
      "frp": 14.6,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1654",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 28.5343,
      "longitude": 76.0051,
      "brightness": 326.8,
      "frp": 28.1,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1442",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 30.9687,
      "longitude": 74.6649,
      "brightness": 327.9,
      "frp": 17.1,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1255",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 30.7659,
      "longitude": 75.712,
      "brightness": 317.3,
      "frp": 15.6,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1345",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 29.6415,
      "longitude": 77.9616,
      "brightness": 319.9,
      "frp": 8.9,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1437",
      "daynight": "D",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "FARMLAND",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 28.8806,
      "longitude": 77.0519,
      "brightness": 318.7,
      "frp": 25.3,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1355",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 28.53,
      "longitude": 77.2465,
      "brightness": 316.9,
      "frp": 9.9,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1254",
      "daynight": "D",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "FARMLAND",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 31.7749,
      "longitude": 74.9759,
      "brightness": 321.2,
      "frp": 22.8,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1140",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 28.8679,
      "longitude": 76.1969,
      "brightness": 324.0,
      "frp": 28.9,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1310",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 31.5923,
      "longitude": 74.5867,
      "brightness": 316.2,
      "frp": 11.5,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1426",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 31.7417,
      "longitude": 75.2394,
      "brightness": 312.2,
      "frp": 29.9,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1114",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 31.3337,
      "longitude": 75.7978,
      "brightness": 319.0,
      "frp": 14.9,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1410",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 31.1751,
      "longitude": 75.2779,
      "brightness": 317.7,
      "frp": 14.0,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1619",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 28.2133,
      "longitude": 76.7627,
      "brightness": 315.8,
      "frp": 15.1,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1518",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 28.549,
      "longitude": 77.1319,
      "brightness": 325.6,
      "frp": 25.9,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1058",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 29.5515,
      "longitude": 76.4602,
      "brightness": 329.1,
      "frp": 13.3,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1139",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 29.3184,
      "longitude": 77.6767,
      "brightness": 323.8,
      "frp": 29.7,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1502",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 30.7297,
      "longitude": 74.2628,
      "brightness": 332.3,
      "frp": 15.8,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1311",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 31.943,
      "longitude": 75.0617,
      "brightness": 332.4,
      "frp": 27.9,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1258",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 31.7408,
      "longitude": 75.6085,
      "brightness": 319.0,
      "frp": 9.8,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1614",
      "daynight": "D",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "FARMLAND",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 28.7316,
      "longitude": 77.5814,
      "brightness": 305.4,
      "frp": 20.9,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1323",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 29.8806,
      "longitude": 76.2167,
      "brightness": 312.0,
      "frp": 8.6,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1420",
      "daynight": "D",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "FARMLAND",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 30.9285,
      "longitude": 75.4022,
      "brightness": 324.5,
      "frp": 10.8,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1002",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 30.4696,
      "longitude": 75.0751,
      "brightness": 316.7,
      "frp": 16.9,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1544",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 29.7708,
      "longitude": 77.3098,
      "brightness": 330.0,
      "frp": 22.8,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1202",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 30.4722,
      "longitude": 74.7254,
      "brightness": 334.4,
      "frp": 16.8,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1522",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FARMLAND",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 30.3746,
      "longitude": 79.3592,
      "brightness": 348.8,
      "frp": 21.9,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1141",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FOREST",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 29.6405,
      "longitude": 78.8668,
      "brightness": 354.6,
      "frp": 66.4,
      "confidence": 55,
      "confidence_score": 0.55,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1104",
      "daynight": "D",
      "category": "UNKNOWN",
      "location_type": "FOREST",
      "risk_level": "MODERATE",
      "color": "gray",
      "reason": "Uncorrelated thermal anomaly (66.4MW). Proximity to industry: 186.8km. Persistence: 0%.",
      "action": "Manual verification recommended. Cross-check with local authorities.",
      "classification": "UNKNOWN",
      "response_protocol": {
        "fire_class": "Unknown - requires verification",
        "typical_materials": [
          "Unknown"
        ],
        "use_agents": {
          "primary": [
            "Verify before action"
          ],
          "secondary": []
        },
        "avoid": [
          "Approach without verification"
        ],
        "equipment_required": [
          "Reconnaissance drone",
          "Fire officer for assessment"
        ],
        "safety_distance_m": 500,
        "response_time_target_min": 20,
        "personnel_required": 3,
        "coordination": [
          "Local authorities for ground truth"
        ],
        "special_notes": "Send ground team for visual confirmation before dispatching resources. Use satellite imagery cross-reference.",
        "evacuation_radius_m": 500,
        "hospital_notification": false
      }
    },
    {
      "latitude": 20.2657,
      "longitude": 83.7728,
      "brightness": 350.4,
      "frp": 37.0,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1050",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FOREST",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 29.8218,
      "longitude": 79.3872,
      "brightness": 354.6,
      "frp": 50.6,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1007",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FOREST",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 29.7054,
      "longitude": 78.8866,
      "brightness": 347.6,
      "frp": 53.7,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "0811",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FOREST",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 30.1934,
      "longitude": 79.0209,
      "brightness": 346.1,
      "frp": 46.5,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1332",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FOREST",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 32.0031,
      "longitude": 77.3563,
      "brightness": 321.5,
      "frp": 66.1,
      "confidence": 55,
      "confidence_score": 0.55,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1833",
      "daynight": "D",
      "category": "UNKNOWN",
      "location_type": "FOREST",
      "risk_level": "MODERATE",
      "color": "gray",
      "reason": "Uncorrelated thermal anomaly (66.1MW). Proximity to industry: 291.1km. Persistence: 0%.",
      "action": "Manual verification recommended. Cross-check with local authorities.",
      "classification": "UNKNOWN",
      "response_protocol": {
        "fire_class": "Unknown - requires verification",
        "typical_materials": [
          "Unknown"
        ],
        "use_agents": {
          "primary": [
            "Verify before action"
          ],
          "secondary": []
        },
        "avoid": [
          "Approach without verification"
        ],
        "equipment_required": [
          "Reconnaissance drone",
          "Fire officer for assessment"
        ],
        "safety_distance_m": 500,
        "response_time_target_min": 20,
        "personnel_required": 3,
        "coordination": [
          "Local authorities for ground truth"
        ],
        "special_notes": "Send ground team for visual confirmation before dispatching resources. Use satellite imagery cross-reference.",
        "evacuation_radius_m": 500,
        "hospital_notification": false
      }
    },
    {
      "latitude": 20.8712,
      "longitude": 83.6487,
      "brightness": 336.8,
      "frp": 41.7,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1806",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FOREST",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 31.6588,
      "longitude": 76.6646,
      "brightness": 341.3,
      "frp": 20.2,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1239",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FOREST",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 20.6697,
      "longitude": 83.9047,
      "brightness": 340.9,
      "frp": 34.9,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1638",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FOREST",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 20.1915,
      "longitude": 84.1238,
      "brightness": 350.7,
      "frp": 51.3,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1127",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FOREST",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 29.9311,
      "longitude": 79.2619,
      "brightness": 334.0,
      "frp": 62.7,
      "confidence": 55,
      "confidence_score": 0.55,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1327",
      "daynight": "D",
      "category": "UNKNOWN",
      "location_type": "FOREST",
      "risk_level": "MODERATE",
      "color": "gray",
      "reason": "Uncorrelated thermal anomaly (62.7MW). Proximity to industry: 230.5km. Persistence: 0%.",
      "action": "Manual verification recommended. Cross-check with local authorities.",
      "classification": "UNKNOWN",
      "response_protocol": {
        "fire_class": "Unknown - requires verification",
        "typical_materials": [
          "Unknown"
        ],
        "use_agents": {
          "primary": [
            "Verify before action"
          ],
          "secondary": []
        },
        "avoid": [
          "Approach without verification"
        ],
        "equipment_required": [
          "Reconnaissance drone",
          "Fire officer for assessment"
        ],
        "safety_distance_m": 500,
        "response_time_target_min": 20,
        "personnel_required": 3,
        "coordination": [
          "Local authorities for ground truth"
        ],
        "special_notes": "Send ground team for visual confirmation before dispatching resources. Use satellite imagery cross-reference.",
        "evacuation_radius_m": 500,
        "hospital_notification": false
      }
    },
    {
      "latitude": 31.8994,
      "longitude": 76.7221,
      "brightness": 352.3,
      "frp": 20.3,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "0905",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FOREST",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 20.691,
      "longitude": 84.2494,
      "brightness": 339.5,
      "frp": 53.5,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1635",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FOREST",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 29.9286,
      "longitude": 79.2989,
      "brightness": 352.9,
      "frp": 43.1,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "0818",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FOREST",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 31.6829,
      "longitude": 77.0059,
      "brightness": 325.4,
      "frp": 46.9,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "0922",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FOREST",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 31.6919,
      "longitude": 76.8229,
      "brightness": 327.9,
      "frp": 43.5,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1649",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FOREST",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 20.64,
      "longitude": 84.0454,
      "brightness": 341.3,
      "frp": 58.1,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1201",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FOREST",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 20.7099,
      "longitude": 84.3372,
      "brightness": 332.3,
      "frp": 27.6,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1036",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FOREST",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 29.7135,
      "longitude": 79.1065,
      "brightness": 321.1,
      "frp": 63.8,
      "confidence": 55,
      "confidence_score": 0.55,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1124",
      "daynight": "D",
      "category": "UNKNOWN",
      "location_type": "FOREST",
      "risk_level": "MODERATE",
      "color": "gray",
      "reason": "Uncorrelated thermal anomaly (63.8MW). Proximity to industry: 210.9km. Persistence: 0%.",
      "action": "Manual verification recommended. Cross-check with local authorities.",
      "classification": "UNKNOWN",
      "response_protocol": {
        "fire_class": "Unknown - requires verification",
        "typical_materials": [
          "Unknown"
        ],
        "use_agents": {
          "primary": [
            "Verify before action"
          ],
          "secondary": []
        },
        "avoid": [
          "Approach without verification"
        ],
        "equipment_required": [
          "Reconnaissance drone",
          "Fire officer for assessment"
        ],
        "safety_distance_m": 500,
        "response_time_target_min": 20,
        "personnel_required": 3,
        "coordination": [
          "Local authorities for ground truth"
        ],
        "special_notes": "Send ground team for visual confirmation before dispatching resources. Use satellite imagery cross-reference.",
        "evacuation_radius_m": 500,
        "hospital_notification": false
      }
    },
    {
      "latitude": 31.7259,
      "longitude": 76.8493,
      "brightness": 331.4,
      "frp": 76.3,
      "confidence": 55,
      "confidence_score": 0.55,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1705",
      "daynight": "D",
      "category": "UNKNOWN",
      "location_type": "FOREST",
      "risk_level": "MODERATE",
      "color": "gray",
      "reason": "Uncorrelated thermal anomaly (76.3MW). Proximity to industry: 258.1km. Persistence: 0%.",
      "action": "Manual verification recommended. Cross-check with local authorities.",
      "classification": "UNKNOWN",
      "response_protocol": {
        "fire_class": "Unknown - requires verification",
        "typical_materials": [
          "Unknown"
        ],
        "use_agents": {
          "primary": [
            "Verify before action"
          ],
          "secondary": []
        },
        "avoid": [
          "Approach without verification"
        ],
        "equipment_required": [
          "Reconnaissance drone",
          "Fire officer for assessment"
        ],
        "safety_distance_m": 500,
        "response_time_target_min": 20,
        "personnel_required": 3,
        "coordination": [
          "Local authorities for ground truth"
        ],
        "special_notes": "Send ground team for visual confirmation before dispatching resources. Use satellite imagery cross-reference.",
        "evacuation_radius_m": 500,
        "hospital_notification": false
      }
    },
    {
      "latitude": 29.7259,
      "longitude": 79.0943,
      "brightness": 343.6,
      "frp": 33.4,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1827",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FOREST",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 31.9313,
      "longitude": 76.7725,
      "brightness": 337.9,
      "frp": 38.1,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "0918",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FOREST",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 20.4893,
      "longitude": 84.1337,
      "brightness": 321.6,
      "frp": 41.3,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1703",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FOREST",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "latitude": 32.3563,
      "longitude": 77.2139,
      "brightness": 346.7,
      "frp": 34.5,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "0900",
      "daynight": "D",
      "category": "AGRICULTURAL_BURNING",
      "location_type": "FOREST",
      "risk_level": "MODERATE",
      "color": "orange",
      "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
      "action": "Log in state pollution registry. Monitor for potential spread.",
      "classification": "AGRICULTURAL_BURNING",
      "response_protocol": {
        "fire_class": "Class A",
        "typical_materials": [
          "Crop residue",
          "Biomass",
          "Stubble"
        ],
        "use_agents": {
          "primary": [
            "Water",
            "Containment (fire breaks)"
          ],
          "secondary": [
            "Controlled backburn"
          ]
        },
        "avoid": [
          "Overreaction (often planned)",
          "Chemical suppressants (contaminates soil)"
        ],
        "equipment_required": [
          "Water bowsers",
          "Tractors with plows",
          "Basic firefighting gear"
        ],
        "safety_distance_m": 100,
        "response_time_target_min": 30,
        "personnel_required": 4,
        "coordination": [
          "Local Panchayat",
          "Agriculture Department",
          "Pollution Control Board"
        ],
        "special_notes": "Verify if planned burn. Monitor spread to non-agricultural areas. Track for AQI impact on nearby cities.",
        "evacuation_radius_m": 0,
        "hospital_notification": false,
        "aqi_alert": true
      }
    },
    {
      "id": "IGNIS-DM-0001",
      "latitude": 18.52,
      "longitude": 73.85,
      "brightness": 308.2,
      "frp": 6.5,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "2030",
      "daynight": "N",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "facility_name": "Residential Colony Deccan Pune",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 18.7518,
      "longitude": 74.6794,
      "brightness": 309.6,
      "frp": 5.3,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1753",
      "daynight": "D",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 17.375,
      "longitude": 78.1619,
      "brightness": 313.4,
      "frp": 6.4,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1458",
      "daynight": "D",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 16.6351,
      "longitude": 78.5807,
      "brightness": 307.3,
      "frp": 7.5,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "0907",
      "daynight": "D",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 28.3916,
      "longitude": 75.2344,
      "brightness": 317.1,
      "frp": 6.5,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "2258",
      "daynight": "N",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 18.8608,
      "longitude": 74.3762,
      "brightness": 307.8,
      "frp": 6.2,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "0225",
      "daynight": "N",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 24.4245,
      "longitude": 75.8804,
      "brightness": 314.0,
      "frp": 4.4,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "2007",
      "daynight": "N",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 14.4903,
      "longitude": 83.091,
      "brightness": 306.3,
      "frp": 9.3,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "2052",
      "daynight": "N",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 12.8505,
      "longitude": 76.3276,
      "brightness": 303.1,
      "frp": 4.8,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "2004",
      "daynight": "N",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 24.9113,
      "longitude": 79.4235,
      "brightness": 313.6,
      "frp": 8.2,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1443",
      "daynight": "D",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 21.1609,
      "longitude": 81.2589,
      "brightness": 311.2,
      "frp": 8.8,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "2020",
      "daynight": "N",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 12.2292,
      "longitude": 78.7487,
      "brightness": 305.5,
      "frp": 5.5,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "0122",
      "daynight": "N",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 16.5873,
      "longitude": 78.8749,
      "brightness": 301.0,
      "frp": 8.6,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "0241",
      "daynight": "N",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 26.3953,
      "longitude": 80.9951,
      "brightness": 309.1,
      "frp": 6.5,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1750",
      "daynight": "D",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 11.7384,
      "longitude": 84.8176,
      "brightness": 310.3,
      "frp": 5.0,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1930",
      "daynight": "N",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 28.239,
      "longitude": 78.8568,
      "brightness": 314.6,
      "frp": 8.6,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "2205",
      "daynight": "N",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 14.1061,
      "longitude": 76.2207,
      "brightness": 307.9,
      "frp": 6.4,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1639",
      "daynight": "D",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 17.7113,
      "longitude": 76.6776,
      "brightness": 307.4,
      "frp": 5.9,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1903",
      "daynight": "N",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 22.6515,
      "longitude": 73.8569,
      "brightness": 301.7,
      "frp": 7.7,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "0916",
      "daynight": "D",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 22.8182,
      "longitude": 84.7825,
      "brightness": 315.7,
      "frp": 5.8,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1842",
      "daynight": "N",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 17.2968,
      "longitude": 85.5801,
      "brightness": 312.6,
      "frp": 6.2,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1945",
      "daynight": "N",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 16.5725,
      "longitude": 77.8968,
      "brightness": 314.2,
      "frp": 8.5,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "2144",
      "daynight": "N",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 24.2979,
      "longitude": 81.9104,
      "brightness": 309.5,
      "frp": 7.6,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1332",
      "daynight": "D",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 17.5268,
      "longitude": 75.3434,
      "brightness": 303.9,
      "frp": 9.2,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1512",
      "daynight": "D",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 13.4762,
      "longitude": 74.0031,
      "brightness": 315.2,
      "frp": 4.6,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1753",
      "daynight": "D",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 20.4776,
      "longitude": 81.6051,
      "brightness": 315.8,
      "frp": 7.4,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1924",
      "daynight": "N",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 14.2552,
      "longitude": 82.007,
      "brightness": 311.2,
      "frp": 9.0,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "2328",
      "daynight": "N",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 17.5574,
      "longitude": 82.3546,
      "brightness": 317.5,
      "frp": 7.4,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "2350",
      "daynight": "N",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 20.6122,
      "longitude": 77.0231,
      "brightness": 314.6,
      "frp": 6.6,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "0623",
      "daynight": "D",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 21.2675,
      "longitude": 78.7278,
      "brightness": 313.8,
      "frp": 8.3,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1633",
      "daynight": "D",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 13.917,
      "longitude": 75.5961,
      "brightness": 310.9,
      "frp": 8.8,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "0141",
      "daynight": "N",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 17.6818,
      "longitude": 85.1458,
      "brightness": 312.8,
      "frp": 6.8,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "0318",
      "daynight": "N",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 13.8856,
      "longitude": 78.8411,
      "brightness": 309.2,
      "frp": 8.6,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "0258",
      "daynight": "N",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 19.1203,
      "longitude": 77.5446,
      "brightness": 300.5,
      "frp": 4.3,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1623",
      "daynight": "D",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 28.9015,
      "longitude": 77.8739,
      "brightness": 300.5,
      "frp": 9.1,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "2241",
      "daynight": "N",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 13.6289,
      "longitude": 73.4979,
      "brightness": 316.5,
      "frp": 6.6,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "0448",
      "daynight": "N",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 19.0748,
      "longitude": 73.0683,
      "brightness": 301.4,
      "frp": 5.4,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "0435",
      "daynight": "N",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 21.9598,
      "longitude": 78.5023,
      "brightness": 314.0,
      "frp": 5.3,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "0303",
      "daynight": "N",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 22.5011,
      "longitude": 81.0965,
      "brightness": 301.1,
      "frp": 8.6,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1538",
      "daynight": "D",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 22.3752,
      "longitude": 80.4756,
      "brightness": 312.9,
      "frp": 5.6,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "0039",
      "daynight": "N",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 21.2719,
      "longitude": 75.4351,
      "brightness": 312.0,
      "frp": 6.9,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1104",
      "daynight": "D",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 20.7935,
      "longitude": 83.2234,
      "brightness": 309.1,
      "frp": 4.1,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1502",
      "daynight": "D",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 28.6587,
      "longitude": 76.2975,
      "brightness": 300.3,
      "frp": 8.3,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1115",
      "daynight": "D",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 22.3086,
      "longitude": 83.0295,
      "brightness": 313.2,
      "frp": 5.8,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "0122",
      "daynight": "N",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 25.6432,
      "longitude": 75.2762,
      "brightness": 314.0,
      "frp": 6.6,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "2230",
      "daynight": "N",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 25.607,
      "longitude": 73.8203,
      "brightness": 314.0,
      "frp": 6.5,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "0912",
      "daynight": "D",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 14.5905,
      "longitude": 73.5448,
      "brightness": 316.8,
      "frp": 6.8,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1730",
      "daynight": "D",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 24.5592,
      "longitude": 75.4843,
      "brightness": 306.4,
      "frp": 8.3,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "2021",
      "daynight": "N",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 25.3882,
      "longitude": 78.6804,
      "brightness": 307.2,
      "frp": 6.4,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1221",
      "daynight": "D",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 19.9317,
      "longitude": 79.4678,
      "brightness": 316.6,
      "frp": 6.9,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "0246",
      "daynight": "N",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 18.7509,
      "longitude": 85.9363,
      "brightness": 303.2,
      "frp": 5.6,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "0305",
      "daynight": "N",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 16.3215,
      "longitude": 78.7969,
      "brightness": 312.9,
      "frp": 4.9,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1422",
      "daynight": "D",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 24.0827,
      "longitude": 84.8509,
      "brightness": 311.1,
      "frp": 6.4,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "2050",
      "daynight": "N",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 12.3507,
      "longitude": 81.2877,
      "brightness": 306.5,
      "frp": 8.4,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "2110",
      "daynight": "N",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 13.57,
      "longitude": 80.8984,
      "brightness": 314.1,
      "frp": 4.2,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "0215",
      "daynight": "N",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 17.5939,
      "longitude": 77.9771,
      "brightness": 310.2,
      "frp": 7.3,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "2128",
      "daynight": "N",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 17.6962,
      "longitude": 82.9201,
      "brightness": 310.3,
      "frp": 6.9,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1220",
      "daynight": "D",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 15.493,
      "longitude": 74.4748,
      "brightness": 313.2,
      "frp": 6.7,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1258",
      "daynight": "D",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 15.712,
      "longitude": 76.3838,
      "brightness": 308.0,
      "frp": 9.5,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "0944",
      "daynight": "D",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 19.8416,
      "longitude": 74.5943,
      "brightness": 315.4,
      "frp": 6.5,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "2228",
      "daynight": "N",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 25.5892,
      "longitude": 85.5783,
      "brightness": 317.8,
      "frp": 7.7,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "2204",
      "daynight": "N",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 16.2265,
      "longitude": 76.8994,
      "brightness": 302.8,
      "frp": 7.9,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "2240",
      "daynight": "N",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 17.5069,
      "longitude": 75.9151,
      "brightness": 317.7,
      "frp": 8.4,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "0750",
      "daynight": "D",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 17.4961,
      "longitude": 80.4396,
      "brightness": 308.4,
      "frp": 9.4,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "0439",
      "daynight": "N",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 12.1835,
      "longitude": 78.1761,
      "brightness": 312.9,
      "frp": 6.6,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1349",
      "daynight": "D",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 21.3482,
      "longitude": 74.6292,
      "brightness": 305.7,
      "frp": 4.4,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1443",
      "daynight": "D",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 13.31,
      "longitude": 83.7777,
      "brightness": 309.9,
      "frp": 7.2,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "0427",
      "daynight": "N",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 26.6278,
      "longitude": 83.8081,
      "brightness": 309.3,
      "frp": 5.7,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "0520",
      "daynight": "N",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 15.0585,
      "longitude": 85.3173,
      "brightness": 309.3,
      "frp": 5.6,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "0216",
      "daynight": "N",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 28.2143,
      "longitude": 76.5679,
      "brightness": 311.3,
      "frp": 7.4,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "0232",
      "daynight": "N",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 21.6526,
      "longitude": 80.5484,
      "brightness": 303.1,
      "frp": 7.4,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1921",
      "daynight": "N",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 21.1451,
      "longitude": 83.7281,
      "brightness": 300.5,
      "frp": 4.3,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "2049",
      "daynight": "N",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 22.7203,
      "longitude": 82.9705,
      "brightness": 307.5,
      "frp": 7.5,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1556",
      "daynight": "D",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 16.2141,
      "longitude": 85.4365,
      "brightness": 308.7,
      "frp": 8.4,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "2125",
      "daynight": "N",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 12.3135,
      "longitude": 73.7789,
      "brightness": 307.9,
      "frp": 6.7,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "0621",
      "daynight": "D",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 16.6265,
      "longitude": 82.3387,
      "brightness": 313.2,
      "frp": 8.7,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1208",
      "daynight": "D",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 20.2696,
      "longitude": 74.3804,
      "brightness": 304.4,
      "frp": 4.7,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1415",
      "daynight": "D",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 11.9109,
      "longitude": 85.29,
      "brightness": 315.6,
      "frp": 6.3,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "0552",
      "daynight": "N",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 21.3984,
      "longitude": 77.0653,
      "brightness": 313.7,
      "frp": 6.7,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1629",
      "daynight": "D",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 16.5537,
      "longitude": 73.3013,
      "brightness": 317.0,
      "frp": 6.8,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "0713",
      "daynight": "D",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 11.8758,
      "longitude": 76.6576,
      "brightness": 310.8,
      "frp": 8.6,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "2130",
      "daynight": "N",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 11.1472,
      "longitude": 74.3975,
      "brightness": 302.4,
      "frp": 5.5,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1148",
      "daynight": "D",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 11.8144,
      "longitude": 73.665,
      "brightness": 310.1,
      "frp": 6.0,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "0904",
      "daynight": "D",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 19.1064,
      "longitude": 80.1481,
      "brightness": 314.9,
      "frp": 7.4,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1907",
      "daynight": "N",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 12.7403,
      "longitude": 77.8516,
      "brightness": 317.8,
      "frp": 7.1,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1148",
      "daynight": "D",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 21.8443,
      "longitude": 78.218,
      "brightness": 300.7,
      "frp": 4.2,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "2221",
      "daynight": "N",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 20.348,
      "longitude": 74.9362,
      "brightness": 316.1,
      "frp": 4.8,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1920",
      "daynight": "N",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 28.8311,
      "longitude": 82.6112,
      "brightness": 305.4,
      "frp": 5.9,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1634",
      "daynight": "D",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 21.1326,
      "longitude": 79.1736,
      "brightness": 300.3,
      "frp": 5.8,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "0326",
      "daynight": "N",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    },
    {
      "latitude": 25.3416,
      "longitude": 82.4292,
      "brightness": 312.4,
      "frp": 4.1,
      "confidence": 88,
      "confidence_score": 0.88,
      "satellite": "VIIRS_SNPP_NRT",
      "acq_date": "2026-09-09",
      "acq_time": "1516",
      "daynight": "D",
      "category": "DOMESTIC_LOW_INTENSITY_BURN",
      "location_type": "RESIDENTIAL",
      "risk_level": "VERY_LOW",
      "color": "slate",
      "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
      "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
      "classification": "DOMESTIC_LOW_INTENSITY_BURN",
      "response_protocol": {
        "fire_class": "Low-Risk Controlled/Domestic Heat",
        "typical_materials": [
          "Yard Waste",
          "Domestic Biomass",
          "Garbage",
          "Cooking Fuel"
        ],
        "use_agents": {
          "primary": [
            "Local bucket water if necessary",
            "Natural burnout monitoring"
          ],
          "secondary": []
        },
        "avoid": [
          "Emergency Tender Dispatch (Unnecessary)",
          "Panic public broadcasting"
        ],
        "equipment_required": [
          "None - Automated Satellite Tracking"
        ],
        "safety_distance_m": 10,
        "response_time_target_min": 60,
        "personnel_required": 0,
        "coordination": [
          "Municipal Sanitation Inspector (routine logging)"
        ],
        "special_notes": "Low-intensity burn. Suppressed from emergency alert system to avoid false alarms. Monitored for anomalous thermal spread.",
        "evacuation_radius_m": 0,
        "hospital_notification": false
      }
    }
  ]
};
