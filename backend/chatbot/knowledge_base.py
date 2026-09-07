"""
AGNI-AI :: Tactical Knowledge Base & RAG Retrieval Engine
Preloads and indexes authoritative Indian fire safety codes, NDMA guidelines,
material safety data sheets (MSDS), station directories, and disaster precedents.
"""

import math
import re
from typing import Any, Optional
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# ==============================================================================
# 1) PRELOADED AUTHORITATIVE DOMAIN DOCUMENTS
# ==============================================================================

KNOWLEDGE_DOCUMENTS: list[dict[str, Any]] = [
    # --------------------------------------------------------------------------
    # NDMA Fire Response Guidelines & SOPs
    # --------------------------------------------------------------------------
    {
        "id": "NDMA-SOP-CHEM-2020",
        "title": "NDMA Standard Operating Procedure for Chemical & Hazardous Fires",
        "category": "NDMA_GUIDELINES",
        "source": "NDMA Guidelines on Chemical Disaster Management (Govt of India)",
        "content": (
            "NDMA Chemical Emergency SOP: In the event of a chemical fire or toxic release at an "
            "industrial facility or refinery, the Incident Commander (IC) must immediately establish "
            "an Initial Isolation Zone of at least 800 meters in all directions and a Downwind Protective "
            "Action Zone of at least 1.6 kilometers. First responding units must approach strictly from "
            "UPWIND and UP-SLOPE positions. Never apply direct solid stream water onto bulk pools of "
            "flammable solvents or molten materials to prevent violent boil-overs and steam explosions. "
            "Deploy Aqueous Film-Forming Foam (AFFF) or Alcohol-Resistant AFFF (AR-AFFF) using gentle "
            "bank-in or roll-on techniques. Continuous cooling water spray (deluge monitors) must be applied "
            "to exposed adjacent pressure vessels at a rate not less than 10.2 Litres/min/m² of vessel surface."
        ),
        "tags": ["chemical", "sop", "foam", "afff", "evacuation", "isolation", "industrial"],
    },
    {
        "id": "NDMA-ICS-STRUCTURE",
        "title": "NDMA Incident Command System (ICS) for Disaster Operations",
        "category": "NDMA_GUIDELINES",
        "source": "NDMA Incident Response System (IRS) Guidelines",
        "content": (
            "NDMA Incident Response System (IRS): The IRS establishes a unified command hierarchy for major fires. "
            "The Responsible Officer (District Collector / Magistrate) activates the Incident Commander (IC), "
            "Operations Section Chief, Planning Section Chief, and Logistics Section Chief. In Level-2 (District) "
            "and Level-3 (State/National) disasters, Emergency Operation Centers (EOC) operate 24/7. First responder "
            "dispatch must occur within 3 minutes of satellite or sensor alert. Civilian evacuation corridors "
            "must be manned by local police while Fire & Emergency Services and NDRF manage the hot zone."
        ),
        "tags": ["ics", "irs", "incident command", "district collector", "ndrf", "eoc"],
    },
    {
        "id": "NDMA-FOREST-FIRE-2022",
        "title": "NDMA National Action Plan on Forest Fires",
        "category": "NDMA_GUIDELINES",
        "source": "NDMA National Guidelines on Forest Fire Prevention and Control",
        "content": (
            "NDMA Forest Fire Tactical Guidelines: Forest fires in India occur predominantly between February and June, "
            "peaking in March and April across Uttarakhand, Himachal Pradesh, Odisha, and Central India. Tactical containment "
            "relies on counter-firing from established fuel-breaks, clearing fire lines (minimum 3 to 5 meters wide), "
            "and employing portable backpack pumps with Class A wetting agents. When flame fronts exceed 3 meters in height, "
            "direct ground assault is prohibited; aerial water dropping via Bambi buckets (Indian Air Force Mi-17 helicopters) "
            "must be requested through the State Disaster Management Authority (SDMA)."
        ),
        "tags": ["forest", "wildfire", "bambi bucket", "fireline", "iaf", "uttarakhand", "counter-fire"],
    },

    # --------------------------------------------------------------------------
    # Bureau of Indian Standards (IS Codes) for Fire Protection
    # --------------------------------------------------------------------------
    {
        "id": "IS-2190-2010",
        "title": "IS 2190: 2010 Selection, Installation and Maintenance of First-Aid Fire Extinguishers",
        "category": "IS_CODES",
        "source": "Bureau of Indian Standards (BIS) IS 2190:2010",
        "content": (
            "IS 2190 Code of Practice: Classifies fires into 5 distinct categories under Indian law: "
            "Class A (Ordinary carbonaceous combustibles like wood, paper, textiles; extinguish with water or ABC dry powder); "
            "Class B (Flammable liquids like petrol, diesel, paints, solvents; extinguish with AFFF foam, dry chemical powder, or CO2); "
            "Class C (Flammable gases under pressure such as LPG, CNG, methane; shut off gas supply first, use dry powder); "
            "Class D (Combustible reactive metals like magnesium, titanium, zirconium, sodium; MUST use specialized TEC or ternary eutectic chloride dry powder, NEVER use water); "
            "Class F / K (Commercial cooking oils and vegetable fats; extinguish with wet chemical saponification agents). "
            "Extinguishers must be mounted so the handle is not more than 1.5 meters above finished floor level."
        ),
        "tags": ["is 2190", "extinguishers", "class a", "class b", "class c", "class d", "bis"],
    },
    {
        "id": "IS-3844-1989",
        "title": "IS 3844: 1989 Internal Fire Hydrants and Hose Reels in Premises",
        "category": "IS_CODES",
        "source": "Bureau of Indian Standards (BIS) IS 3844",
        "content": (
            "IS 3844 Installation Requirements: All industrial buildings, warehouses, and commercial complexes exceeding "
            "15 meters in height must be equipped with internal wet riser systems and first-aid hose reels. Water pressure "
            "at the hydraulically most remote hydrant outlet must not fall below 3.5 kgf/cm² (0.35 MPa) with two 63mm landing "
            "valves flowing simultaneously. Hose reel tubing must be 19mm internal diameter reinforced synthetic rubber with "
            "a minimum continuous jet discharge rate of 24 Litres/minute."
        ),
        "tags": ["is 3844", "hydrant", "hose reel", "water pressure", "riser"],
    },
    {
        "id": "IS-14435-1997",
        "title": "IS 14435: 1997 Fire Safety in Storage of Flammable Liquids & Gases",
        "category": "IS_CODES",
        "source": "Bureau of Indian Standards (BIS) IS 14435",
        "content": (
            "IS 14435 Industrial Hydrocarbon Storage: Petroleum refineries, chemical plants, and tank farms must have "
            "dedicated earthen or RCC retention dyke walls capable of holding 110% of the maximum single tank volume. "
            "Fixed medium-expansion foam pourers and rim-seal protection systems are mandatory on all floating-roof tanks. "
            "Fixed water deluge systems must deliver minimum cooling water coverage of 3 Litres/min/m² on tank roofs and "
            "10 Litres/min/m² on shell surfaces exposed to radiant thermal flux from adjacent fires."
        ),
        "tags": ["is 14435", "tank farm", "refinery", "deluge", "dyke wall", "foam pourer"],
    },
    {
        "id": "IS-13039-2014",
        "title": "IS 13039: 2014 External Hydrant Systems - Provision and Maintenance",
        "category": "IS_CODES",
        "source": "Bureau of Indian Standards (BIS) IS 13039",
        "content": (
            "IS 13039 External Hydrants: External ring main piping in industrial areas must be laid in a closed loop (grid) "
            "circuit to prevent dead ends and maintain equalized dynamic pressure. Hydrant pillars must be spaced at intervals "
            "no greater than 30 meters in high-hazard industrial zones and 45 meters in moderate-hazard zones. Dedicated fire "
            "water storage tanks must have minimum reserve capacity capable of supplying the full installed pumping capacity "
            "for at least 4 continuous hours of firefighting operations."
        ),
        "tags": ["is 13039", "ring main", "external hydrant", "water reserve", "storage"],
    },

    # --------------------------------------------------------------------------
    # Material Safety Data Sheets (MSDS) Summaries
    # --------------------------------------------------------------------------
    {
        "id": "MSDS-STYRENE",
        "title": "MSDS: Styrene Monomer (C8H8) - Hazards & Fire Protocols",
        "category": "MSDS_HAZMAT",
        "source": "National Institute of Occupational Safety and Health (NIOSH) / CPCB",
        "content": (
            "Styrene Monomer (CAS #100-42-5): Flammable Class 3 liquid. Flash point: 31°C. Autoignition: 490°C. "
            "Catastrophic hazard: Rapid exothermic polymerization when heated above 52°C, causing vessel overpressurization "
            "and rupture (as observed in Vizag 2020 disaster). Vapors are heavier than air (density 3.6) and travel along "
            "the ground to distant ignition sources. Extinguishing agents: AR-AFFF foam, carbon dioxide, or dry chemical powder. "
            "Do NOT use direct water jet into open tanks. Continuous water fog cooling on exterior shell is critical. "
            "Personnel must wear positive-pressure self-contained breathing apparatus (SCBA) and Level-A chemical suits."
        ),
        "tags": ["styrene", "polymerization", "vizag", "monomer", "hazmat", "chemical"],
    },
    {
        "id": "MSDS-BENZENE",
        "title": "MSDS: Benzene (C6H6) - Flammable Hydrocarbon Safety",
        "category": "MSDS_HAZMAT",
        "source": "Petroleum & Explosives Safety Organization (PESO) MSDS",
        "content": (
            "Benzene (CAS #71-43-2): Highly flammable Class 3 aromatic hydrocarbon and Group-1 human carcinogen. "
            "Flash point: -11°C (extremely flammable at ambient room temperature). Flammability limits: 1.2% to 7.8% in air. "
            "Extinguish using dry chemical powder, alcohol-resistant foam, or CO2. Water spray may be ineffective due to low flash point "
            "and density lighter than water (floats on water, spreading the fire). Evacuate radius: 800m initial, 2.5km downwind for vapor releases."
        ),
        "tags": ["benzene", "flash point", "carcinogen", "hydrocarbon", "petrochemical"],
    },
    {
        "id": "MSDS-LPG",
        "title": "MSDS: Liquefied Petroleum Gas (LPG - Propane/Butane Mixture)",
        "category": "MSDS_HAZMAT",
        "source": "Oil Industry Safety Directorate (OISD) Standard 144",
        "content": (
            "LPG (Propane / Butane mixture): Extremely flammable pressurized liquefied gas. Boiling point: -42°C. "
            "Extreme hazard: Boiling Liquid Expanding Vapor Explosion (BLEVE). If LPG storage bullets or tankers are impinged "
            "by fire, BLEVE can occur within 10 to 15 minutes of direct flame contact on the vapor space. "
            "CRITICAL PROTOCOL: Do NOT attempt to extinguish the fire unless the upstream fuel shutoff valve can be closed immediately. "
            "Apply massive water deluge (minimum 10.2 L/min/m²) from unmanned monitors to cool the upper shell. "
            "If tank begins to emit a high-pitched siren sound or relief valves lift violently, EVACUATE ALL PERSONNEL at least 1.6 km."
        ),
        "tags": ["lpg", "propane", "butane", "bleve", "gas leak", "refinery", "explosion"],
    },
    {
        "id": "MSDS-CHLORINE",
        "title": "MSDS: Chlorine Gas (Cl2) - Toxic Industrial Oxidizer",
        "category": "MSDS_HAZMAT",
        "source": "Central Pollution Control Board (CPCB) Hazardous Chemical Protocols",
        "content": (
            "Chlorine (CAS #7782-50-5): Toxic, corrosive, non-flammable gas but powerful oxidizer that vigorously supports combustion. "
            "Vapor density 2.5 (sinks into depressions, basements, and sewer lines). Highly irritating to respiratory tract; lethal at 430 ppm. "
            "TACTICAL WARNING: NEVER spray water directly onto a liquid chlorine leak or chlorine container rupture! Chlorine reacts violently "
            "with water to form highly corrosive Hydrochloric and Hypochlorous acids, dramatically accelerating container destruction and vapor generation. "
            "Use wide-angle water curtains ONLY downwind to absorb and disperse the traveling gas plume. Apply specialized chlorine emergency "
            "capping kits (Kit-A for cylinders, Kit-B for tonners) with caustic soda scrubbers."
        ),
        "tags": ["chlorine", "toxic gas", "caustic soda", "water reaction", "oxidizer"],
    },
    {
        "id": "MSDS-AMMONIA",
        "title": "MSDS: Anhydrous Ammonia (NH3) - Fertilizer & Cold Storage Hazard",
        "category": "MSDS_HAZMAT",
        "source": "Fertilizer Association of India / CPCB Guidelines",
        "content": (
            "Anhydrous Ammonia (CAS #7664-41-7): Toxic, corrosive gas with flammable limits between 15% and 28%. "
            "Extremely soluble in water (1 volume of water dissolves nearly 700 volumes of ammonia gas). "
            "Firefighting protocol: Use wide water fog sprays and high-volume deluge curtains to scrub and knock down ammonia vapor clouds. "
            "Contain contaminated runoff in neutralization holding ponds (treat with dilute acid before discharge). "
            "Responders must wear Level-A encapsulated gas-tight hazmat suits with positive-pressure SCBA."
        ),
        "tags": ["ammonia", "fertilizer", "cold storage", "water soluble", "vapor cloud"],
    },

    # --------------------------------------------------------------------------
    # Fire Station Directory & Operational Hubs
    # --------------------------------------------------------------------------
    {
        "id": "STATION-DIRECTORY-WEST",
        "title": "Western India Industrial Fire Hubs (Gujarat & Maharashtra)",
        "category": "STATION_DIRECTORY",
        "source": "State Fire Services & GIDC Emergency Network",
        "content": (
            "Major Emergency Response Hubs in Gujarat & Maharashtra: "
            "1. Surat Fire Station HQ (Lat 21.1702, Lon 72.8311): 18 appliances, hydraulic platforms (54m), high-capacity foam tenders. Phone: 0261-2423777. "
            "2. Hazira Industrial Fire Brigade (Lat 21.1150, Lon 72.6520): Specializes in petrochemicals, LNG, and deep port industrial hazards. Phone: 0261-2860101. "
            "3. Ankleshwar GIDC Disaster Prevention Management Centre (Lat 21.6260, Lon 73.0030): Central hazardous chemical emergency squad with hazmat response vehicles. Phone: 02646-221379. "
            "4. Vapi GIDC Fire Service (Lat 20.3720, Lon 72.9100): 8 chemical tenders, foam monitors, decontamination trailers. Phone: 0260-2430333. "
            "5. Mumbai Chembur Industrial Fire Station (Lat 19.0530, Lon 72.8980): Refineries and heavy petrochemical complex coverage. Phone: 022-25224333."
        ),
        "tags": ["surat", "hazira", "ankleshwar", "vapi", "mumbai", "gidc", "fire station", "phone"],
    },
    {
        "id": "STATION-DIRECTORY-EAST-SOUTH",
        "title": "Eastern, Central & Southern India Industrial Fire Hubs",
        "category": "STATION_DIRECTORY",
        "source": "State Disaster Management Authorities (AP, CG, UK)",
        "content": (
            "Major Emergency Response Hubs across India: "
            "1. Visakhapatnam Port Trust Fire Service (Lat 17.6868, Lon 83.2185): Petroleum berths, heavy chemical zone coverage. Phone: 0891-2873101. "
            "2. Bhilai Steel Plant Fire Brigade (Lat 21.1890, Lon 81.3980): Blast furnace, coke oven gas, and molten slag emergency units. Phone: 0788-2852222. "
            "3. Dehradun Forest Fire Control Division (Lat 30.3165, Lon 78.0322): Quick response forest wildfire beat units, radio relay base. Phone: 0135-2744000. "
            "4. Mundka Delhi Fire Service Station (Lat 28.6815, Lon 77.0305): West Delhi commercial and warehouse zone. Phone: 011-28341010."
        ),
        "tags": ["visakhapatnam", "vizag", "bhilai", "dehradun", "mundka", "fire station"],
    },

    # --------------------------------------------------------------------------
    # Landmark Historical Incident Case Studies & Lessons Learned
    # --------------------------------------------------------------------------
    {
        "id": "HIST-VIZAG-2020",
        "title": "Case Study: 2020 Vizag LG Polymers Styrene Monomer Gas Leak",
        "category": "CASE_STUDY",
        "source": "NGT High Level Committee Report & CPCB Inquiry",
        "content": (
            "Vizag LG Polymers Disaster (7 May 2020, RR Venkatapuram, Visakhapatnam): 12 casualties, 585 hospitalized, 3000 evacuated. "
            "Cause: Uncontrolled auto-polymerization of 1800 tonnes of styrene monomer in an un-refrigerated tank (M6) during COVID lockdown restart. "
            "Tank temperature rose past 154°C, releasing massive boiling styrene vapors. "
            "Key Lessons Learned: Temperature sensors must have dual independent telemetry. Continuous inhibitor (Tertiary Butyl Catechol / TBC) "
            "replenishment is required. Emergency response requires wide water curtains (neutralization spray) rather than direct stream flooding. "
            "Immediate reverse-evacuation notice saved thousands."
        ),
        "tags": ["vizag", "styrene", "lg polymers", "gas leak", "lessons learned", "case study"],
    },
    {
        "id": "HIST-SURAT-2019",
        "title": "Case Study: 2019 Surat Takshashila Coaching Center Fire",
        "category": "CASE_STUDY",
        "source": "Gujarat State Fire Prevention & Life Safety Inspection Report",
        "content": (
            "Surat Takshashila Fire (24 May 2019, Sarthana, Surat): 22 student casualties. "
            "Cause: Electrical short-circuit behind a flex banner on the ground floor; flames climbed an illegal wooden staircase "
            "and engulfed a makeshift fourth-floor dome constructed of inflammable tyre and flex materials. "
            "Key Lessons Learned: Strict enforcement of IS 2190 and National Building Code (NBC Part IV). Hydraulic platforms and jump air cushions "
            "must be deployed immediately for multi-story buildings. Fire escape staircases must be enclosed, non-combustible, and pressurized."
        ),
        "tags": ["surat", "takshashila", "coaching", "evacuation", "building code", "case study"],
    },
    {
        "id": "HIST-IOCL-JAIPUR-2009",
        "title": "Case Study: 2009 IOCL Jaipur Terminal Oil Depot Disaster",
        "category": "CASE_STUDY",
        "source": "M.B. Lal Committee Investigation Report",
        "content": (
            "IOCL Jaipur Terminal Fire (29 October 2009, Sitapura Industrial Area, Jaipur): 12 dead, 300 injured, complete destruction of 11 storage tanks. "
            "Cause: Major motor spirit (gasoline) leakage from an open valve during inter-tank transfer, forming a massive unconfined vapor cloud "
            "that ignited. Fire burned unabated for 11 days. "
            "Key Lessons Learned: Remote Operated Shut-Off Valves (ROSOVs) are mandatory at bottom of all hydrocarbon storage tanks. "
            "Fixed foam piping must be blast-resistant. Minimum safety distance between storage tanks and boundary walls must be maintained."
        ),
        "tags": ["jaipur", "iocl", "refinery", "oil depot", "gasoline", "rosov", "case study"],
    },

    # --------------------------------------------------------------------------
    # Emergency Contact Directory
    # --------------------------------------------------------------------------
    {
        "id": "EMERGENCY-CONTACTS-NATIONAL",
        "title": "National Emergency Contacts & Crisis Helpdesks",
        "category": "EMERGENCY_CONTACTS",
        "source": "National Disaster Management Authority (NDMA)",
        "content": (
            "Official Emergency Helplines (India): "
            "• National Emergency Unified Helpline: 112 (Police, Fire, Ambulance) "
            "• Fire Brigade Control Room: 101 "
            "• Ambulance / Emergency Medical Trauma: 108 / 102 "
            "• NDMA 24/7 Control Room (New Delhi): 011-26701728 / 011-1078 "
            "• NDRF HQ 24x7 Control Room: 011-24363260, Mobile: +91-9711077372 "
            "• State Disaster Management Authority Helpline: 1070 "
            "• District Disaster Management Authority (Collectorate EOC): 1077 "
            "• Forest Fire Reporting Toll Free: 1800-180-4141"
        ),
        "tags": ["emergency contacts", "112", "101", "108", "ndma", "ndrf", "helpline", "phone"],
    },
]


# ==============================================================================
# 2) DENSE TF-IDF & COSINE VECTOR RETRIEVAL ENGINE
# ==============================================================================

class KnowledgeBaseEngine:
    """
    In-memory RAG indexer that chunks preloaded domain documents,
    computes TF-IDF vector matrices, and performs semantic cosine matching.
    """

    def __init__(self, documents: list[dict[str, Any]]) -> None:
        self.raw_docs = documents
        self.chunks: list[dict[str, Any]] = []
        self.vectorizer: Optional[TfidfVectorizer] = None
        self.tfidf_matrix = None
        self._build_index()

    def _build_index(self) -> None:
        """Process documents into retrieval chunks and fit TF-IDF vectorizer."""
        self.chunks = []
        corpus_texts: list[str] = []

        for doc in self.raw_docs:
            content = doc["content"]
            # Split into semantic paragraph/sentence blocks of ~100 words
            sentences = [s.strip() for s in re.split(r"(?<=[.!?])\s+", content) if len(s.strip()) > 20]

            if not sentences:
                sentences = [content]

            # Create overlapping 2-sentence windows for rich context
            for i in range(0, len(sentences), 2):
                chunk_text = " ".join(sentences[i : i + 3])
                tags_text = " ".join(doc.get("tags", []))
                searchable_text = f"{doc['title']}. {chunk_text} {tags_text}"

                chunk_obj = {
                    "id": f"{doc['id']}_c{i//2}",
                    "doc_id": doc["id"],
                    "title": doc["title"],
                    "category": doc["category"],
                    "source": doc["source"],
                    "text": chunk_text,
                    "searchable_text": searchable_text,
                    "tags": doc.get("tags", []),
                }
                self.chunks.append(chunk_obj)
                corpus_texts.append(searchable_text)

        # Initialize TF-IDF with sublinear term-frequency scaling and n-grams
        self.vectorizer = TfidfVectorizer(
            ngram_range=(1, 2),
            sublinear_tf=True,
            stop_words="english",
            max_features=5000,
        )
        self.tfidf_matrix = self.vectorizer.fit_transform(corpus_texts)

    def search(self, query: str, top_k: int = 4) -> list[dict[str, Any]]:
        """
        Return top-K semantically relevant knowledge chunks with score.
        """
        if not self.vectorizer or self.tfidf_matrix is None or not query.strip():
            return []

        try:
            query_vec = self.vectorizer.transform([query])
            similarities = cosine_similarity(query_vec, self.tfidf_matrix).flatten()

            # Rank chunks by similarity
            ranked_indices = similarities.argsort()[::-1]

            results: list[dict[str, Any]] = []
            seen_doc_ids: set[str] = set()

            for idx in ranked_indices:
                score = float(similarities[idx])
                if score < 0.05 and len(results) >= 2:
                    break

                chunk = dict(self.chunks[idx])
                chunk["similarity_score"] = round(score, 3)

                # Prioritize diverse sources
                results.append(chunk)
                seen_doc_ids.add(chunk["doc_id"])

                if len(results) >= top_k:
                    break

            return results
        except Exception as err:
            print(f"[IGNIS-KNOWLEDGE-BASE] Search error: {err}")
            return []


# Global Singleton Knowledge Base
_knowledge_base_instance: Optional[KnowledgeBaseEngine] = None


def get_knowledge_base() -> KnowledgeBaseEngine:
    global _knowledge_base_instance
    if _knowledge_base_instance is None:
        _knowledge_base_instance = KnowledgeBaseEngine(KNOWLEDGE_DOCUMENTS)
    return _knowledge_base_instance


def search_knowledge_base(query: str, top_k: int = 4) -> list[dict[str, Any]]:
    """Helper function to query preloaded RAG index."""
    kb = get_knowledge_base()
    return kb.search(query, top_k=top_k)
