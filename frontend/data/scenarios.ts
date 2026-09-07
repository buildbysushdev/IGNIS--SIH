// Scripted Scenarios with 30-second Animated Telemetry Playback
export interface ScenarioStep {
  time_sec: number;
  narration: string;
  alert_level: string;
  trigger_siren?: boolean;
  trigger_panel?: boolean;
  station_identified?: {
    name: string;
    distance_km: number;
    eta_minutes: number;
    phone: string;
  };
  protocol_active?: string;
  dispatch_complete?: boolean;
  active_fires?: any[];
}

export interface SimulationScenario {
  id: string;
  title: string;
  target_center: [number, number];
  target_zoom: number;
  description: string;
  total_duration_sec: number;
  steps: ScenarioStep[];
}

export const SIMULATION_SCENARIOS: SimulationScenario[] = [
  {
    "id": "surat_emergency",
    "title": "Scenario 1: Surat Factory Fire Emergency",
    "target_center": [
      21.1925,
      72.8258
    ],
    "target_zoom": 13,
    "description": "Rapid chemical tank farm failure at Surat GIDC with hazardous vapor release.",
    "total_duration_sec": 30,
    "steps": [
      {
        "time_sec": 0,
        "narration": "[T+00s] SYSTEM MONITORING NOMINAL. Surat industrial corridor thermal baseline within standard parameters.",
        "alert_level": "NOMINAL",
        "active_fires": [
          {
            "id": "SURAT-BASE-01",
            "latitude": 21.185,
            "longitude": 72.841,
            "frp": 14.2,
            "brightness": 342.1,
            "category": "PERSISTENT_INDUSTRIAL",
            "risk_level": "MEDIUM",
            "acq_date": "2026-09-07",
            "acq_time": "1000",
            "reason": "Surat Textile Dyeing Boiler operational thermal baseline.",
            "action": "Routine monitoring.",
            "nearest_facility": "Surat Textile Works",
            "facility_dist": 0.8
          }
        ]
      },
      {
        "time_sec": 10,
        "narration": "[T+10s] \ud83d\udea8 CRITICAL ANOMALY DETECTED! Massive FRP surge (48.6MW) at Surat Chemical Cluster GIDC.",
        "alert_level": "CRITICAL",
        "trigger_siren": true,
        "trigger_panel": true,
        "active_fires": [
          {
            "id": "SURAT-EM-01",
            "latitude": 21.1925,
            "longitude": 72.8258,
            "frp": 48.6,
            "brightness": 382.4,
            "category": "EMERGENCY_INDUSTRIAL",
            "risk_level": "CRITICAL",
            "acq_date": "2026-09-07",
            "acq_time": "1010",
            "reason": "Major chemical tank farm rupture with volatile solvent combustion (48.6MW). Multi-tender hazmat containment required.",
            "action": "DISPATCH Class B/C Foam units + hazmat suppression team. Evacuate 500m radius.",
            "nearest_facility": "Surat Chemical Cluster GIDC",
            "facility_dist": 0.25,
            "facility_name": "Surat Chemical Works Tank Farm"
          },
          {
            "id": "SURAT-BASE-01",
            "latitude": 21.185,
            "longitude": 72.841,
            "frp": 14.2,
            "brightness": 342.1,
            "category": "PERSISTENT_INDUSTRIAL",
            "risk_level": "MEDIUM",
            "acq_date": "2026-09-07",
            "acq_time": "1000",
            "reason": "Surat Textile Dyeing Boiler operational baseline.",
            "action": "Routine monitoring.",
            "nearest_facility": "Surat Textile Works",
            "facility_dist": 0.8
          }
        ]
      },
      {
        "time_sec": 15,
        "narration": "[T+15s] \u26a0\ufe0f SATELLITE PLUME CONFIRMATION. Alert panel armed. Optical smoke dispersion vector detected heading SE.",
        "alert_level": "CRITICAL",
        "trigger_siren": true,
        "trigger_panel": true
      },
      {
        "time_sec": 20,
        "narration": "[T+20s] \ud83d\ude92 NEAREST FIRE STATION IDENTIFIED: Surat Central Fire Station (2.3 km, ETA: 6 mins). Route cleared via Ring Road.",
        "alert_level": "CRITICAL",
        "station_identified": {
          "name": "Surat Central Fire Station",
          "distance_km": 2.3,
          "eta_minutes": 6,
          "phone": "+91-261-2422222"
        }
      },
      {
        "time_sec": 25,
        "narration": "[T+25s] \ud83d\udccb HAZMAT PROTOCOL ENGAGED: Class B/C chemical fire. USE: Alcohol-resistant foam, CO2, dry powder. STRICTLY AVOID DIRECT WATER.",
        "alert_level": "CRITICAL",
        "protocol_active": "EMERGENCY_INDUSTRIAL"
      },
      {
        "time_sec": 30,
        "narration": "[T+30s] \ud83d\udfe2 DISPATCH SIMULATION COMPLETE. Encrypted alert transmitted to Fire Department, District Collector & NDMA.",
        "alert_level": "DISPATCHED",
        "dispatch_complete": true
      }
    ]
  },
  {
    "id": "punjab_stubble",
    "title": "Scenario 2: Punjab Stubble Burning Peak",
    "target_center": [
      30.45,
      75.85
    ],
    "target_zoom": 10,
    "description": "Widespread post-harvest residue burns across Sangrur and Patiala farmlands.",
    "total_duration_sec": 30,
    "steps": [
      {
        "time_sec": 0,
        "narration": "[T+00s] MONITORING PUNJAB HARVEST BELT. 4 baseline crop residue fires recorded.",
        "alert_level": "NOMINAL",
        "active_fires": [
          {
            "id": "PUN-AG-01",
            "latitude": 30.245,
            "longitude": 75.842,
            "frp": 6.2,
            "brightness": 324.0,
            "category": "AGRICULTURAL_BURNING",
            "risk_level": "LOW",
            "acq_date": "2026-09-07",
            "acq_time": "0900",
            "reason": "Crop burn.",
            "action": "Log for audit."
          }
        ]
      },
      {
        "time_sec": 10,
        "narration": "[T+10s] \ud83c\udf3e SIMULTANEOUS IGNITION DETECTED. 18 new agricultural hotspots observed along Sangrur-Patiala corridor.",
        "alert_level": "WARNING",
        "active_fires": [
          {
            "id": "PUN-AG-00",
            "latitude": 30.2,
            "longitude": 75.6,
            "frp": 8.5,
            "brightness": 328.0,
            "category": "AGRICULTURAL_BURNING",
            "risk_level": "LOW",
            "acq_date": "2026-09-07",
            "acq_time": "1010",
            "reason": "Post-paddy residue burning.",
            "action": "Deploy agricultural inspection patrol."
          },
          {
            "id": "PUN-AG-01",
            "latitude": 30.24,
            "longitude": 75.63,
            "frp": 9.5,
            "brightness": 328.0,
            "category": "AGRICULTURAL_BURNING",
            "risk_level": "LOW",
            "acq_date": "2026-09-07",
            "acq_time": "1010",
            "reason": "Post-paddy residue burning.",
            "action": "Deploy agricultural inspection patrol."
          },
          {
            "id": "PUN-AG-02",
            "latitude": 30.279999999999998,
            "longitude": 75.66,
            "frp": 10.5,
            "brightness": 328.0,
            "category": "AGRICULTURAL_BURNING",
            "risk_level": "LOW",
            "acq_date": "2026-09-07",
            "acq_time": "1010",
            "reason": "Post-paddy residue burning.",
            "action": "Deploy agricultural inspection patrol."
          },
          {
            "id": "PUN-AG-03",
            "latitude": 30.32,
            "longitude": 75.69,
            "frp": 11.5,
            "brightness": 328.0,
            "category": "AGRICULTURAL_BURNING",
            "risk_level": "LOW",
            "acq_date": "2026-09-07",
            "acq_time": "1010",
            "reason": "Post-paddy residue burning.",
            "action": "Deploy agricultural inspection patrol."
          },
          {
            "id": "PUN-AG-04",
            "latitude": 30.36,
            "longitude": 75.72,
            "frp": 12.5,
            "brightness": 328.0,
            "category": "AGRICULTURAL_BURNING",
            "risk_level": "LOW",
            "acq_date": "2026-09-07",
            "acq_time": "1010",
            "reason": "Post-paddy residue burning.",
            "action": "Deploy agricultural inspection patrol."
          },
          {
            "id": "PUN-AG-05",
            "latitude": 30.4,
            "longitude": 75.75,
            "frp": 8.5,
            "brightness": 328.0,
            "category": "AGRICULTURAL_BURNING",
            "risk_level": "LOW",
            "acq_date": "2026-09-07",
            "acq_time": "1010",
            "reason": "Post-paddy residue burning.",
            "action": "Deploy agricultural inspection patrol."
          },
          {
            "id": "PUN-AG-06",
            "latitude": 30.439999999999998,
            "longitude": 75.78,
            "frp": 9.5,
            "brightness": 328.0,
            "category": "AGRICULTURAL_BURNING",
            "risk_level": "LOW",
            "acq_date": "2026-09-07",
            "acq_time": "1010",
            "reason": "Post-paddy residue burning.",
            "action": "Deploy agricultural inspection patrol."
          },
          {
            "id": "PUN-AG-07",
            "latitude": 30.48,
            "longitude": 75.80999999999999,
            "frp": 10.5,
            "brightness": 328.0,
            "category": "AGRICULTURAL_BURNING",
            "risk_level": "LOW",
            "acq_date": "2026-09-07",
            "acq_time": "1010",
            "reason": "Post-paddy residue burning.",
            "action": "Deploy agricultural inspection patrol."
          },
          {
            "id": "PUN-AG-08",
            "latitude": 30.52,
            "longitude": 75.83999999999999,
            "frp": 11.5,
            "brightness": 328.0,
            "category": "AGRICULTURAL_BURNING",
            "risk_level": "LOW",
            "acq_date": "2026-09-07",
            "acq_time": "1010",
            "reason": "Post-paddy residue burning.",
            "action": "Deploy agricultural inspection patrol."
          },
          {
            "id": "PUN-AG-09",
            "latitude": 30.56,
            "longitude": 75.86999999999999,
            "frp": 12.5,
            "brightness": 328.0,
            "category": "AGRICULTURAL_BURNING",
            "risk_level": "LOW",
            "acq_date": "2026-09-07",
            "acq_time": "1010",
            "reason": "Post-paddy residue burning.",
            "action": "Deploy agricultural inspection patrol."
          },
          {
            "id": "PUN-AG-10",
            "latitude": 30.599999999999998,
            "longitude": 75.89999999999999,
            "frp": 8.5,
            "brightness": 328.0,
            "category": "AGRICULTURAL_BURNING",
            "risk_level": "LOW",
            "acq_date": "2026-09-07",
            "acq_time": "1010",
            "reason": "Post-paddy residue burning.",
            "action": "Deploy agricultural inspection patrol."
          },
          {
            "id": "PUN-AG-11",
            "latitude": 30.64,
            "longitude": 75.92999999999999,
            "frp": 9.5,
            "brightness": 328.0,
            "category": "AGRICULTURAL_BURNING",
            "risk_level": "LOW",
            "acq_date": "2026-09-07",
            "acq_time": "1010",
            "reason": "Post-paddy residue burning.",
            "action": "Deploy agricultural inspection patrol."
          },
          {
            "id": "PUN-AG-12",
            "latitude": 30.68,
            "longitude": 75.96,
            "frp": 10.5,
            "brightness": 328.0,
            "category": "AGRICULTURAL_BURNING",
            "risk_level": "LOW",
            "acq_date": "2026-09-07",
            "acq_time": "1010",
            "reason": "Post-paddy residue burning.",
            "action": "Deploy agricultural inspection patrol."
          },
          {
            "id": "PUN-AG-13",
            "latitude": 30.72,
            "longitude": 75.99,
            "frp": 11.5,
            "brightness": 328.0,
            "category": "AGRICULTURAL_BURNING",
            "risk_level": "LOW",
            "acq_date": "2026-09-07",
            "acq_time": "1010",
            "reason": "Post-paddy residue burning.",
            "action": "Deploy agricultural inspection patrol."
          },
          {
            "id": "PUN-AG-14",
            "latitude": 30.759999999999998,
            "longitude": 76.02,
            "frp": 12.5,
            "brightness": 328.0,
            "category": "AGRICULTURAL_BURNING",
            "risk_level": "LOW",
            "acq_date": "2026-09-07",
            "acq_time": "1010",
            "reason": "Post-paddy residue burning.",
            "action": "Deploy agricultural inspection patrol."
          },
          {
            "id": "PUN-AG-15",
            "latitude": 30.8,
            "longitude": 76.05,
            "frp": 8.5,
            "brightness": 328.0,
            "category": "AGRICULTURAL_BURNING",
            "risk_level": "LOW",
            "acq_date": "2026-09-07",
            "acq_time": "1010",
            "reason": "Post-paddy residue burning.",
            "action": "Deploy agricultural inspection patrol."
          },
          {
            "id": "PUN-AG-16",
            "latitude": 30.84,
            "longitude": 76.08,
            "frp": 9.5,
            "brightness": 328.0,
            "category": "AGRICULTURAL_BURNING",
            "risk_level": "LOW",
            "acq_date": "2026-09-07",
            "acq_time": "1010",
            "reason": "Post-paddy residue burning.",
            "action": "Deploy agricultural inspection patrol."
          },
          {
            "id": "PUN-AG-17",
            "latitude": 30.88,
            "longitude": 76.11,
            "frp": 10.5,
            "brightness": 328.0,
            "category": "AGRICULTURAL_BURNING",
            "risk_level": "LOW",
            "acq_date": "2026-09-07",
            "acq_time": "1010",
            "reason": "Post-paddy residue burning.",
            "action": "Deploy agricultural inspection patrol."
          }
        ]
      },
      {
        "time_sec": 15,
        "narration": "[T+15s] \u26a0\ufe0f AIR QUALITY ADVISORY: Downwind particulate plume detected moving towards National Capital Region.",
        "alert_level": "WARNING"
      },
      {
        "time_sec": 20,
        "narration": "[T+20s] \ud83d\ude9c REGIONAL OUTPOST MOBILIZED: Sangrur District Agricultural Outpost dispatched with containment tractors.",
        "alert_level": "WARNING",
        "station_identified": {
          "name": "Sangrur District Fire Station",
          "distance_km": 6.8,
          "eta_minutes": 14,
          "phone": "+91-1672-231101"
        }
      },
      {
        "time_sec": 25,
        "narration": "[T+25s] \ud83d\udccb RESPONSE PROTOCOL: Class A fire. Water bowsers and tractor plows for perimeter fire-breaks. Chemicals prohibited.",
        "alert_level": "WARNING",
        "protocol_active": "AGRICULTURAL_BURNING"
      },
      {
        "time_sec": 30,
        "narration": "[T+30s] \ud83d\udfe2 CONTAINMENT COORDINATION COMPLETE. Satellite cluster log forwarded to State Pollution Control Board.",
        "alert_level": "DISPATCHED",
        "dispatch_complete": true
      }
    ]
  },
  {
    "id": "uttarakhand_forest",
    "title": "Scenario 3: Uttarakhand Forest Fire",
    "target_center": [
      30.4042,
      79.3308
    ],
    "target_zoom": 11,
    "description": "High-intensity wildfire in dense pine canopy across steep Himalayan terrain in Chamoli.",
    "total_duration_sec": 30,
    "steps": [
      {
        "time_sec": 0,
        "narration": "[T+00s] CLEAR CANOPY OVERVIEW. Garhwal Himalayan forest reserves baseline stable.",
        "alert_level": "NOMINAL",
        "active_fires": []
      },
      {
        "time_sec": 10,
        "narration": "[T+10s] \ud83d\udd25 CANOPY INFERNO DETECTED! High-intensity thermal plume (FRP 36.8MW) in Chamoli pine forest.",
        "alert_level": "CRITICAL",
        "trigger_siren": true,
        "trigger_panel": true,
        "active_fires": [
          {
            "id": "UK-FOR-01",
            "latitude": 30.4042,
            "longitude": 79.3308,
            "frp": 36.8,
            "brightness": 361.2,
            "category": "FOREST_FIRE",
            "risk_level": "HIGH",
            "acq_date": "2026-09-07",
            "acq_time": "1010",
            "reason": "Fast-moving crown fire in Chir Pine forest. Wind spread vector active.",
            "action": "Mobilize SDRF / Forest fire crews. Establish aerial suppression.",
            "facility_name": "Nanda Devi Biosphere Buffer",
            "nearest_facility": "Forest Outpost Gopeshwar",
            "facility_dist": 18.5
          },
          {
            "id": "UK-FOR-02",
            "latitude": 30.421,
            "longitude": 79.345,
            "frp": 24.5,
            "brightness": 348.0,
            "category": "FOREST_FIRE",
            "risk_level": "HIGH",
            "acq_date": "2026-09-07",
            "acq_time": "1010",
            "reason": "Secondary spotting fire across ridgeline.",
            "action": "Create counter-fire break.",
            "facility_name": "Chamoli Ridge Reserve",
            "nearest_facility": "Forest Outpost Gopeshwar",
            "facility_dist": 20.1
          }
        ]
      },
      {
        "time_sec": 15,
        "narration": "[T+15s] \u26a0\ufe0f HIGH WIND VECTOR DETECTED: 24 km/h NW wind driving fire front toward inhabited village valley.",
        "alert_level": "CRITICAL",
        "trigger_siren": true,
        "trigger_panel": true
      },
      {
        "time_sec": 20,
        "narration": "[T+20s] \ud83d\ude92 RAPID RESPONSE POST NOTIFIED: Chamoli Rapid Wildfire Response Post (7.4km, ETA 16m) alerted.",
        "alert_level": "CRITICAL",
        "station_identified": {
          "name": "Chamoli Rapid Wildfire Response Post",
          "distance_km": 7.4,
          "eta_minutes": 16,
          "phone": "+91-1372-252101"
        }
      },
      {
        "time_sec": 25,
        "narration": "[T+25s] \ud83d\udccb FOREST PROTOCOL: Class A wildfire. USE: Water tankers, fire lines, helicopter bambi bucket. AVOID driving in.",
        "alert_level": "CRITICAL",
        "protocol_active": "FOREST_FIRE"
      },
      {
        "time_sec": 30,
        "narration": "[T+30s] \ud83d\udfe2 EMERGENCY DISPATCH RECORDED. Aerial support requisition transmitted to Indian Air Force / NDRF.",
        "alert_level": "DISPATCHED",
        "dispatch_complete": true
      }
    ]
  }
];
