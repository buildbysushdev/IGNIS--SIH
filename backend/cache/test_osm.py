import requests
q = """
[out:json][timeout:15];
(
  node["industrial"](20.0,72.0,23.0,74.0);
  node["amenity"="hospital"](20.0,72.0,23.0,74.0);
);
out center 40;
"""
try:
    headers = {"User-Agent": "IGNIS-FireIntelligenceGroundStation/2.0 (contact: admin@ignis.sih)"}
    r = requests.post("https://overpass-api.de/api/interpreter", data={"data": q}, headers=headers, timeout=20)
    print("Status:", r.status_code)
    data = r.json()
    elements = data.get("elements", [])
    print("Returned elements:", len(elements))
    if elements:
        print("Sample:", elements[0].get("tags", {}).get("name"), elements[0].get("lat"), elements[0].get("lon"))
except Exception as e:
    print("Error:", e)
