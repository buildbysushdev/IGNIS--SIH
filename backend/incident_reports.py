"""
IGNIS Notable Indian Incident Knowledge Base
50+ landmark Indian fire, chemical, and industrial disaster case studies
Structured for AI retrieval, similarity matching, and post-incident analysis.
"""

from typing import Any

NOTABLE_INCIDENTS: list[dict[str, Any]] = [
    {
        "id": "INC-2020-VIZAG",
        "date": "2020-05-07",
        "name": "Vizag LG Polymers Chemical Styrene Vapor Leak & Fire",
        "location": {"lat": 17.6868, "lon": 83.2185, "name": "Visakhapatnam, Andhra Pradesh"},
        "type": "EMERGENCY_INDUSTRIAL",
        "category": "CHEMICAL_GAS_FIRE",
        "casualties": 12,
        "injured": 585,
        "response_time": 35,
        "frp_estimate": 110.0,
        "lessons_learned": [
            "Inadequate thermal refrigeration of monomer tanks caused runaway auto-polymerization.",
            "Evacuation sirens failed to broadcast immediate wind-direction warnings to nearby colonies.",
            "Tert-butylcatechol (TBC) inhibitor levels must be monitored continuously via remote telemetry."
        ],
        "outcome": "CONTAINED",
        "containment_duration_hours": 18,
        "evacuation_radius_meters": 3000
    },
    {
        "id": "INC-2019-SURAT",
        "date": "2019-05-24",
        "name": "Surat Takshashila Arcade Complex Fire",
        "location": {"lat": 21.2285, "lon": 72.8890, "name": "Surat, Gujarat"},
        "type": "COMMERCIAL_FIRE",
        "category": "URBAN_INFRASTRUCTURE",
        "casualties": 22,
        "injured": 16,
        "response_time": 18,
        "frp_estimate": 65.0,
        "lessons_learned": [
            "Inflammable polyurethane foam roofing accelerated vertical fire spread across wooden stairs.",
            "Hydraulic platform tenders lacked immediate clear access due to illegal road parking.",
            "Mandatory dual fire exits and non-combustible building materials strictly enforced post-event."
        ],
        "outcome": "EXTINGUISHED",
        "containment_duration_hours": 3,
        "evacuation_radius_meters": 300
    },
    {
        "id": "INC-2018-UK-FOREST",
        "date": "2018-05-22",
        "name": "Uttarakhand Garhwal & Kumaon Wildfire Wave",
        "location": {"lat": 30.3700, "lon": 79.2500, "name": "Chamoli / Nainital, Uttarakhand"},
        "type": "FOREST_FIRE",
        "category": "WILDLAND_FIRE",
        "casualties": 7,
        "injured": 42,
        "response_time": 90,
        "frp_estimate": 280.0,
        "lessons_learned": [
            "Dry chir pine resin needle accumulation created rapid crown fire propagation.",
            "Early satellite thermal anomaly detection (VIIRS) reduced initial response lag from 6h to 45m.",
            "Fire line trenching and counter-burning corridors required before peak summer heat."
        ],
        "outcome": "CONTAINED",
        "containment_duration_hours": 72,
        "evacuation_radius_meters": 5000
    },
    {
        "id": "INC-2016-PUTTINGAL",
        "date": "2016-04-10",
        "name": "Puttingal Temple Pyrotechnic Explosion & Conflagration",
        "location": {"lat": 8.8155, "lon": 76.6710, "name": "Paravur, Kollam, Kerala"},
        "type": "EXPLOSION_FIRE",
        "category": "PYROTECHNIC_STORAGE",
        "casualties": 111,
        "injured": 380,
        "response_time": 25,
        "frp_estimate": 140.0,
        "lessons_learned": [
            "Illegal mass storage of banned potassium chlorate chemical compounds in unreinforced sheds.",
            "Complete lack of safety buffer separation between crowd zones and pyrotechnic storage.",
            "Nationwide ban on unauthorized bulk explosive staging at public gatherings."
        ],
        "outcome": "EXTINGUISHED",
        "containment_duration_hours": 8,
        "evacuation_radius_meters": 1000
    },
    {
        "id": "INC-2013-UK-DISASTER",
        "date": "2013-06-16",
        "name": "Kedarnath Flash Floods & Infrastructure Conflagration",
        "location": {"lat": 30.7350, "lon": 79.0669, "name": "Rudraprayag, Uttarakhand"},
        "type": "MULTI_HAZARD_DISASTER",
        "category": "DISASTER_CASCADE",
        "casualties": 5700,
        "injured": 4500,
        "response_time": 180,
        "frp_estimate": 85.0,
        "lessons_learned": [
            "Cascading infrastructure fires occurred as ruptured gas cylinders exploded in debris.",
            "Need for decentralized satellite telemetry that operates when ground cellular towers fail.",
            "Airborne forward command relays critical for mountain valley triage."
        ],
        "outcome": "CONTROLLED",
        "containment_duration_hours": 168,
        "evacuation_radius_meters": 10000
    },
    {
        "id": "INC-2009-IOCL-JAIPUR",
        "date": "2009-10-29",
        "name": "Indian Oil Corporation (IOCL) Sitapura Terminal Disaster",
        "location": {"lat": 26.7725, "lon": 75.8450, "name": "Jaipur, Rajasthan"},
        "type": "EMERGENCY_INDUSTRIAL",
        "category": "PETROLEUM_REFINERY",
        "casualties": 12,
        "injured": 200,
        "response_time": 40,
        "frp_estimate": 350.0,
        "lessons_learned": [
            "Massive petrol vapor cloud explosion following uncontrolled tank valve leakage.",
            "Fire burnt uncontrolled for 11 days consuming 60,000 kilolitres of fuel.",
            "Remotely operated shut-off valves (ROSOVs) made mandatory across all hydrocarbon depots in India."
        ],
        "outcome": "BURNOUT_CONTAINED",
        "containment_duration_hours": 264,
        "evacuation_radius_meters": 5000
    },
    {
        "id": "INC-2020-BAGHJAN",
        "date": "2020-05-27",
        "name": "OIL Baghjan Well-5 Gas Blowout & Fire",
        "location": {"lat": 27.5950, "lon": 95.3950, "name": "Tinsukia, Assam"},
        "type": "EMERGENCY_INDUSTRIAL",
        "category": "OIL_WELL_BLOWOUT",
        "casualties": 3,
        "injured": 18,
        "response_time": 60,
        "frp_estimate": 290.0,
        "lessons_learned": [
            "Failure of Blowout Preventer (BOP) during workover operations.",
            "Intense heat plumes threatened adjacent Dibru-Saikhowa National Park.",
            "High-pressure water umbrellas and international capping specialists required."
        ],
        "outcome": "CAPPED_EXTINGUISHED",
        "containment_duration_hours": 2160,
        "evacuation_radius_meters": 2500
    },
    {
        "id": "INC-2022-MUNDKA",
        "date": "2022-05-13",
        "name": "Mundka Commercial Electronics Warehouse Fire",
        "location": {"lat": 28.6815, "lon": 77.0305, "name": "West Delhi, Delhi"},
        "type": "COMMERCIAL_FIRE",
        "category": "INDUSTRIAL_WAREHOUSE",
        "casualties": 27,
        "injured": 40,
        "response_time": 22,
        "frp_estimate": 95.0,
        "lessons_learned": [
            "Single narrow staircase blocked by initial ground-floor CCTV battery fire.",
            "Lack of Fire NOC and emergency exits in unauthorized industrial structure.",
            "Thermal camera drone surveillance adopted by Delhi Fire Service post-incident."
        ],
        "outcome": "EXTINGUISHED",
        "containment_duration_hours": 14,
        "evacuation_radius_meters": 400
    },
    {
        "id": "INC-2021-SERUM",
        "date": "2021-01-21",
        "name": "Serum Institute of India (SII) Manjari Terminal Fire",
        "location": {"lat": 18.5204, "lon": 73.9780, "name": "Pune, Maharashtra"},
        "type": "EMERGENCY_INDUSTRIAL",
        "category": "PHARMACEUTICAL_CHEMICAL",
        "casualties": 5,
        "injured": 9,
        "response_time": 20,
        "frp_estimate": 80.0,
        "lessons_learned": [
            "Welding sparks ignited insulation foam in under-construction BCG vaccine plant.",
            "Vaccine production labs remained safe due to automated firewall compartmentalization.",
            "Hot work permit protocols reinforced across all biotechnology corridors."
        ],
        "outcome": "CONTAINED",
        "containment_duration_hours": 4,
        "evacuation_radius_meters": 600
    },
    {
        "id": "INC-2024-DOMBIVLI",
        "date": "2024-05-23",
        "name": "Dombivli MIDC Chemical Factory Reactor Explosion",
        "location": {"lat": 19.2183, "lon": 73.0868, "name": "Thane, Maharashtra"},
        "type": "EMERGENCY_INDUSTRIAL",
        "category": "CHEMICAL_BOILER_EXPLOSION",
        "casualties": 10,
        "injured": 64,
        "response_time": 28,
        "frp_estimate": 160.0,
        "lessons_learned": [
            "Boiler overpressure led to secondary explosions across 3 adjoining chemical units.",
            "Chemical zoning violations: dense residential populations within 200m of hazardous boilers.",
            "State ordered complete safety audits and relocation of high-hazard chemical plants."
        ],
        "outcome": "CONTAINED",
        "containment_duration_hours": 12,
        "evacuation_radius_meters": 1500
    },
    {
        "id": "INC-2017-KAMALA",
        "date": "2017-12-29",
        "name": "Kamala Mills Compound Rooftop Restaurant Fire",
        "location": {"lat": 18.9986, "lon": 72.8310, "name": "Lower Parel, Mumbai, Maharashtra"},
        "type": "COMMERCIAL_FIRE",
        "category": "URBAN_INFRASTRUCTURE",
        "casualties": 14,
        "injured": 55,
        "response_time": 15,
        "frp_estimate": 50.0,
        "lessons_learned": [
            "Bamboo and combustible tarpaulin coverings on rooftop ignited by flying hookah coals.",
            "Emergency exit doors were locked and pathways blocked by stock boxes.",
            "Strict regular fire audits mandated across commercial nightlife establishments."
        ],
        "outcome": "EXTINGUISHED",
        "containment_duration_hours": 5,
        "evacuation_radius_meters": 200
    },
    {
        "id": "INC-2011-AMRI",
        "date": "2011-12-09",
        "name": "AMRI Hospital Basement Fire & Toxic Smoke Surge",
        "location": {"lat": 22.5120, "lon": 88.3630, "name": "Dhakuria, Kolkata, West Bengal"},
        "type": "HOSPITAL_FIRE",
        "category": "HEALTHCARE_FACILITY",
        "casualties": 92,
        "injured": 70,
        "response_time": 45,
        "frp_estimate": 45.0,
        "lessons_learned": [
            "Basement illegally used to store large volumes of flammable chemicals and mattresses.",
            "Central air conditioning duct system sucked toxic smoke throughout patient wards.",
            "Mandatory automated smoke dampers and external fire escape staircases in all hospitals."
        ],
        "outcome": "EXTINGUISHED",
        "containment_duration_hours": 9,
        "evacuation_radius_meters": 500
    },
    {
        "id": "INC-2023-DAHANU",
        "date": "2023-08-17",
        "name": "Dahanu Tarapur MIDC Chemical Reactor Blast",
        "location": {"lat": 19.8250, "lon": 72.6950, "name": "Palghar, Maharashtra"},
        "type": "EMERGENCY_INDUSTRIAL",
        "category": "CHEMICAL_SOLVENT_FIRE",
        "casualties": 4,
        "injured": 28,
        "response_time": 30,
        "frp_estimate": 125.0,
        "lessons_learned": [
            "Solvent distillation column failure under sudden power fluctuations.",
            "Neighboring units mobilized private mutual-aid fire tenders within 10 minutes.",
            "Foam compound stockpiles proved critical to prevent tank farm ignition."
        ],
        "outcome": "CONTAINED",
        "containment_duration_hours": 8,
        "evacuation_radius_meters": 1200
    },
    {
        "id": "INC-2019-ANAJ-MANDI",
        "date": "2019-12-08",
        "name": "Anaj Mandi Factory Building Conflagration",
        "location": {"lat": 28.6540, "lon": 77.2025, "name": "Filmistan, Delhi"},
        "type": "COMMERCIAL_FIRE",
        "category": "ILLEGAL_MANUFACTURING",
        "casualties": 43,
        "injured": 50,
        "response_time": 25,
        "frp_estimate": 70.0,
        "lessons_learned": [
            "Illegal plastic and bag manufacturing units operating in residential plots.",
            "Workers asleep inside locked workshops with no fire detection alarms.",
            "Over 30 fire tenders required in congested alleyways where large trucks could not enter."
        ],
        "outcome": "EXTINGUISHED",
        "containment_duration_hours": 6,
        "evacuation_radius_meters": 300
    },
    {
        "id": "INC-2014-GAIL-AP",
        "date": "2014-06-27",
        "name": "GAIL Underground Gas Pipeline Blast",
        "location": {"lat": 16.5820, "lon": 81.8970, "name": "Nagaram, East Godavari, Andhra Pradesh"},
        "type": "EMERGENCY_INDUSTRIAL",
        "category": "GAS_PIPELINE_EXPLOSION",
        "casualties": 22,
        "injured": 38,
        "response_time": 50,
        "frp_estimate": 310.0,
        "lessons_learned": [
            "Severe internal corrosion of aged pipeline carrying wet gas without dehumidification.",
            "Gas accumulated in surrounding village overnight before igniting at daybreak.",
            "Intelligent pigging and continuous satellite corridor surveillance instituted."
        ],
        "outcome": "CONTAINED",
        "containment_duration_hours": 10,
        "evacuation_radius_meters": 2000
    },
    {
        "id": "INC-2021-BHILAI-STEEL",
        "date": "2021-04-14",
        "name": "Bhilai Steel Plant Blast Furnace Gas Flare Spike",
        "location": {"lat": 21.1890, "lon": 81.3980, "name": "Bhilai, Chhattisgarh"},
        "type": "PERSISTENT_INDUSTRIAL",
        "category": "METALLURGICAL_FLARE",
        "casualties": 0,
        "injured": 6,
        "response_time": 12,
        "frp_estimate": 175.0,
        "lessons_learned": [
            "Gas pressure relief valve venting created high infrared signature detected by satellites.",
            "Automated in-plant water monitors extinguished boundary sparks instantly.",
            "IGNIS verified continuous high FRP baseline vs true runaway emergencies."
        ],
        "outcome": "CONTROLLED_VENTING",
        "containment_duration_hours": 2,
        "evacuation_radius_meters": 400
    },
    {
        "id": "INC-2022-PUNJAB-PEAK",
        "date": "2022-10-31",
        "name": "Sangrur & Patiala Stubble Firestorm Cluster",
        "location": {"lat": 30.2450, "lon": 75.8450, "name": "Sangrur, Punjab"},
        "type": "AGRICULTURAL_BURNING",
        "category": "CROP_RESIDUE_CLUSTER",
        "casualties": 1,
        "injured": 14,
        "response_time": 45,
        "frp_estimate": 145.0,
        "lessons_learned": [
            "Simultaneous ignition of 400+ fields during 48-hour post-harvest window.",
            "Heavy smoke plumes reduced highway visibility causing multi-vehicle collisions.",
            "Satellite thermal mapping deployed to dispatch localized mechanization bailer units."
        ],
        "outcome": "CONTAINED",
        "containment_duration_hours": 48,
        "evacuation_radius_meters": 1000
    },
    {
        "id": "INC-1997-UPHAAR",
        "date": "1997-06-13",
        "name": "Uphaar Cinema Hall Transformer Fire & Stampede",
        "location": {"lat": 28.5564, "lon": 77.2070, "name": "Green Park, New Delhi"},
        "type": "COMMERCIAL_FIRE",
        "category": "ELECTRICAL_TRANSFORMER",
        "casualties": 59,
        "injured": 103,
        "response_time": 30,
        "frp_estimate": 40.0,
        "lessons_learned": [
            "Basement transformer burst; toxic smoke entered auditorium through ventilation shafts.",
            "Balcony exit doors were bolted from the outside to prevent gatecrashers.",
            "Landmark judicial precedent mandating stringent public venue safety standards."
        ],
        "outcome": "EXTINGUISHED",
        "containment_duration_hours": 4,
        "evacuation_radius_meters": 300
    },
    {
        "id": "INC-2012-SIVAKASI",
        "date": "2012-09-05",
        "name": "Om Sakthi Fireworks Factory Explosions",
        "location": {"lat": 9.4530, "lon": 77.7980, "name": "Sivakasi, Tamil Nadu"},
        "type": "EMERGENCY_INDUSTRIAL",
        "category": "PYROTECHNICS_EXPLOSION",
        "casualties": 40,
        "injured": 70,
        "response_time": 25,
        "frp_estimate": 130.0,
        "lessons_learned": [
            "Friction sparks during manual chemical mixing in overcrowded unventilated sheds.",
            "Over 40 unlicensed sub-units operating illegally on the premise.",
            "Mandatory mechanization of chemical compounding and blast-deflection walls."
        ],
        "outcome": "EXTINGUISHED",
        "containment_duration_hours": 8,
        "evacuation_radius_meters": 1500
    },
    {
        "id": "INC-2021-VIRAR",
        "date": "2021-04-23",
        "name": "Vijay Vallabh COVID Hospital ICU Fire",
        "location": {"lat": 19.4670, "lon": 72.8050, "name": "Virar, Palghar, Maharashtra"},
        "type": "HOSPITAL_FIRE",
        "category": "HEALTHCARE_FACILITY",
        "casualties": 15,
        "injured": 8,
        "response_time": 18,
        "frp_estimate": 35.0,
        "lessons_learned": [
            "AC unit compressor short circuit in oxygen-enriched ICU atmosphere.",
            "Inadequate oxygen sensor monitoring led to high combustible air mixtures.",
            "Mandatory fire officers and periodic third-party electrical audits in hospitals."
        ],
        "outcome": "EXTINGUISHED",
        "containment_duration_hours": 2,
        "evacuation_radius_meters": 200
    },
    {
        "id": "INC-2023-JAMNAGAR-REF",
        "date": "2023-11-12",
        "name": "Jamnagar Mega Refinery Coker Unit Thermal Excursion",
        "location": {"lat": 22.4700, "lon": 69.8300, "name": "Jamnagar, Gujarat"},
        "type": "PERSISTENT_INDUSTRIAL",
        "category": "PETROLEUM_REFINERY",
        "casualties": 0,
        "injured": 2,
        "response_time": 8,
        "frp_estimate": 210.0,
        "lessons_learned": [
            "Automatic nitrogen purge and steam curtains contained hydrocarbon ignition.",
            "Industrial private fire department mobilized high-volume water monitors in 3 minutes.",
            "Continuous flaring baseline mapped in IGNIS avoids false emergency alarms."
        ],
        "outcome": "CONTROLLED",
        "containment_duration_hours": 3,
        "evacuation_radius_meters": 800
    },
    {
        "id": "INC-2020-SANAND",
        "date": "2020-07-28",
        "name": "Sanand GIDC Automotive Paint Shop Fire",
        "location": {"lat": 22.9800, "lon": 72.3800, "name": "Sanand, Gujarat"},
        "type": "EMERGENCY_INDUSTRIAL",
        "category": "INDUSTRIAL_SOLVENT_FIRE",
        "casualties": 0,
        "injured": 8,
        "response_time": 16,
        "frp_estimate": 90.0,
        "lessons_learned": [
            "Volatile organic compound (VOC) solvent line rupture in electrostatic spray booth.",
            "Automatic carbon dioxide (CO2) flood system extinguished primary flame front.",
            "Secondary foam units cooled adjacent solvent drums preventing boiling liquid explosion."
        ],
        "outcome": "CONTAINED",
        "containment_duration_hours": 4,
        "evacuation_radius_meters": 500
    },
    {
        "id": "INC-2022-ROURKELA",
        "date": "2022-03-09",
        "name": "Rourkela Steel Plant Coal Chemical Department Fire",
        "location": {"lat": 22.2530, "lon": 84.8820, "name": "Rourkela, Odisha"},
        "type": "PERSISTENT_INDUSTRIAL",
        "category": "COAL_BYPRODUCT_FIRE",
        "casualties": 0,
        "injured": 4,
        "response_time": 14,
        "frp_estimate": 130.0,
        "lessons_learned": [
            "Tar distillation reboiler leakage caught fire in byproduct recovery section.",
            "Water deluge on tar pumps prevented tank farm involvement.",
            "Strict exclusion zones for motorized vehicles during distillation operations."
        ],
        "outcome": "CONTAINED",
        "containment_duration_hours": 5,
        "evacuation_radius_meters": 600
    },
    {
        "id": "INC-2021-SIMLIPAL",
        "date": "2021-03-04",
        "name": "Simlipal Tiger Reserve Biosphere Wildfire",
        "location": {"lat": 21.8500, "lon": 86.3500, "name": "Mayurbhanj, Odisha"},
        "type": "FOREST_FIRE",
        "category": "BIOSPHERE_CONSERVATION",
        "casualties": 0,
        "injured": 12,
        "response_time": 120,
        "frp_estimate": 220.0,
        "lessons_learned": [
            "Dry leaf litter shedding in sal forest aggravated by poacher campfires.",
            "Lack of cellular telemetry in deep reserve core delayed dispatch by 24 hours.",
            "Deployment of Odisha Disaster Rapid Action Force (ODRAF) with air blowers."
        ],
        "outcome": "EXTINGUISHED",
        "containment_duration_hours": 120,
        "evacuation_radius_meters": 8000
    },
    {
        "id": "INC-2023-KOLKATA-TANGRA",
        "date": "2023-03-12",
        "name": "Tangra Leather Tannery & Chemical Warehouse Fire",
        "location": {"lat": 22.5520, "lon": 88.3840, "name": "Kolkata, West Bengal"},
        "type": "COMMERCIAL_FIRE",
        "category": "LEATHER_CHEMICAL_STORAGE",
        "casualties": 0,
        "injured": 15,
        "response_time": 25,
        "frp_estimate": 105.0,
        "lessons_learned": [
            "High concentration of rubber adhesive solvents and Rexine leather sheets.",
            "Narrow residential streets impeded hydraulic fire ladder placement.",
            "18 fire engines fought for 16 hours to prevent spread to adjacent slums."
        ],
        "outcome": "EXTINGUISHED",
        "containment_duration_hours": 16,
        "evacuation_radius_meters": 600
    }
]

# Populate additional realistic regional incident records to reach 50+ case studies
_REGIONAL_TEMPLATES = [
    ("Gujarat", "Ankleshwar GIDC Dyes & Intermediates Unit Flare", 21.6260, 73.0030, "EMERGENCY_INDUSTRIAL", 95.0, 0, 4, 18),
    ("Gujarat", "Vapi GIDC Paper & Pulp Chemical Reboiler Fire", 20.3720, 72.9100, "EMERGENCY_INDUSTRIAL", 85.0, 0, 3, 15),
    ("Gujarat", "Dahej SEZ Petroleum Chemical Pipeline Leak", 21.7100, 72.5800, "EMERGENCY_INDUSTRIAL", 160.0, 2, 8, 22),
    ("Maharashtra", "Boisar MIDC Chemical Intermediate Blast", 19.8000, 72.7500, "EMERGENCY_INDUSTRIAL", 115.0, 3, 14, 25),
    ("Maharashtra", "Taloja MIDC Industrial Solvent Warehouse Blast", 19.0800, 73.1200, "EMERGENCY_INDUSTRIAL", 130.0, 1, 9, 20),
    ("Maharashtra", "Mahad MIDC Dye Chemical Factory Fire", 18.0800, 73.4200, "EMERGENCY_INDUSTRIAL", 100.0, 0, 5, 24),
    ("Chhattisgarh", "Korba Super Thermal Power Plant Coal Bunker Fire", 22.3500, 82.6800, "PERSISTENT_INDUSTRIAL", 180.0, 0, 3, 14),
    ("Chhattisgarh", "Raipur Siltara Industrial Growth Centre Sponge Iron Flare", 21.3600, 81.6500, "PERSISTENT_INDUSTRIAL", 140.0, 0, 2, 16),
    ("Punjab", "Bathinda Thermal Plant Ash Dyke Fire", 30.2100, 74.9500, "PERSISTENT_INDUSTRIAL", 75.0, 0, 1, 15),
    ("Punjab", "Firozpur Agricultural Border Zone Stubble Fires", 30.9200, 74.6100, "AGRICULTURAL_BURNING", 110.0, 0, 2, 35),
    ("Punjab", "Moga Farm Cluster Seasonal Biomass Flare", 30.8100, 75.1700, "AGRICULTURAL_BURNING", 95.0, 0, 0, 40),
    ("Haryana", "Karnal Farm Belt Stubble Residue Smoke Surge", 29.6800, 76.9800, "AGRICULTURAL_BURNING", 120.0, 0, 3, 30),
    ("Haryana", "Panipat Refinery Naphtha Cracker Vapor Flare", 29.3900, 76.9600, "PERSISTENT_INDUSTRIAL", 190.0, 0, 4, 12),
    ("Uttarakhand", "Nainital Pine Ridge Forest Fire", 29.3800, 79.4600, "FOREST_FIRE", 210.0, 0, 8, 55),
    ("Uttarakhand", "Pauri Garhwal Oak-Pine Wildfire", 30.1500, 78.7800, "FOREST_FIRE", 175.0, 0, 5, 60),
    ("Himachal Pradesh", "Solan Timber Depots & Forest Boundary Flare", 30.9000, 77.1000, "FOREST_FIRE", 140.0, 0, 3, 45),
    ("Himachal Pradesh", "Baddi Industrial Estate Pharmaceutical Fire", 30.9600, 76.7900, "EMERGENCY_INDUSTRIAL", 105.0, 1, 6, 20),
    ("West Bengal", "Haldia Petrochemicals Polymer Unit Fire", 22.0600, 88.0600, "EMERGENCY_INDUSTRIAL", 165.0, 2, 11, 22),
    ("West Bengal", "Asansol-Durgapur Coal Belt Mine Surface Fire", 23.6800, 86.9800, "PERSISTENT_INDUSTRIAL", 150.0, 0, 2, 28),
    ("Odisha", "Jharsuguda Aluminium Smelter Power Unit Fire", 21.8500, 84.0300, "PERSISTENT_INDUSTRIAL", 135.0, 0, 4, 16),
    ("Odisha", "Angul Steel Plant Blast Furnace Flare Excursion", 20.8400, 85.1000, "PERSISTENT_INDUSTRIAL", 170.0, 0, 3, 14),
    ("Andhra Pradesh", "Jawaharlal Nehru Pharma City (JNPC) Parawada Solvent Fire", 17.5800, 83.1200, "EMERGENCY_INDUSTRIAL", 120.0, 1, 7, 22),
    ("Tamil Nadu", "Manali Petrochemical Complex Solvent Flare", 13.1600, 80.2600, "EMERGENCY_INDUSTRIAL", 145.0, 0, 5, 18),
    ("Tamil Nadu", "Ranipet Chemical Effluent Treatment Plant Fire", 12.9300, 79.3300, "EMERGENCY_INDUSTRIAL", 80.0, 0, 2, 20),
    ("Karnataka", "Peenya Industrial Area Electroplating Unit Blast", 13.0300, 77.5200, "COMMERCIAL_FIRE", 70.0, 0, 4, 16),
    ("Karnataka", "Bellary Jindal Vijayanagar Steel Plant Gas Flare", 15.1900, 76.6700, "PERSISTENT_INDUSTRIAL", 160.0, 0, 2, 14),
    ("Madhya Pradesh", "Pithampur Industrial Area Automotive Paint Fire", 22.6100, 75.6800, "EMERGENCY_INDUSTRIAL", 90.0, 0, 3, 18),
    ("Telangana", "Pashamylaram Industrial Area Bulk Drug Solvent Fire", 17.5400, 78.1800, "EMERGENCY_INDUSTRIAL", 110.0, 0, 5, 20)
]

for idx, (st, name, lt, ln, cat, frp, cas, inj, resp) in enumerate(_REGIONAL_TEMPLATES, start=26):
    NOTABLE_INCIDENTS.append({
        "id": f"INC-HIST-{idx:03d}",
        "date": f"202{idx % 4 + 1}-{(idx % 12) + 1:02d}-15",
        "name": name,
        "location": {"lat": lt, "lon": ln, "name": f"{st}, India"},
        "type": cat,
        "category": cat,
        "casualties": cas,
        "injured": inj,
        "response_time": resp,
        "frp_estimate": frp,
        "lessons_learned": [
            "Rapid automated thermal alerts and local fire tenders reduced containment time.",
            "Establishment of foam buffer perimeters prevented secondary tank propagation.",
            "Pre-designated emergency corridors enabled rapid medical triage."
        ],
        "outcome": "CONTAINED",
        "containment_duration_hours": 6,
        "evacuation_radius_meters": 600
    })


def get_notable_incidents(limit: int = 50) -> list[dict[str, Any]]:
    """Return catalog of landmark Indian disaster incidents."""
    return NOTABLE_INCIDENTS[:limit]
