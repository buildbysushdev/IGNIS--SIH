"use client";

import React, { useState, useRef, useEffect } from "react";

interface FireAnomaly {
  id: number | string;
  latitude: number;
  longitude: number;
  classification?: string;
  category?: string;
  frp?: number;
}

interface FieldReportFormProps {
  selectedFire?: FireAnomaly | null;
  officerName: string;
  officerId: string;
  onSuccess?: (report: any) => void;
  onCancel?: () => void;
}

const SAMPLE_FIELD_PHOTOS = [
  {
    name: "Surat Chemical Fire",
    url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='250' viewBox='0 0 400 250'><rect fill='%231a0b00' width='400' height='250'/><circle cx='200' cy='140' r='60' fill='%23ff3b30' opacity='0.8'/><circle cx='200' cy='120' r='40' fill='%23ff9500' opacity='0.9'/><path d='M150 180 Q200 40 250 180 Z' fill='%23ffcc00' opacity='0.7'/><text x='20' y='230' fill='%23ffffff' font-family='monospace' font-size='12'>[FIELD RECON] CHEMICAL PLANT UNIT-4</text></svg>",
  },
  {
    name: "Punjab Crop Residue",
    url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='250' viewBox='0 0 400 250'><rect fill='%23191600' width='400' height='250'/><rect x='0' y='180' width='400' height='70' fill='%233a3000'/><path d='M40 180 L80 120 L120 180 M160 180 L200 110 L240 180 M280 180 L320 130 L360 180' stroke='%23ff9500' stroke-width='4' fill='none'/><text x='20' y='230' fill='%23ffffff' font-family='monospace' font-size='12'>[FIELD RECON] AGRI FIELD TRACTOR TRACE</text></svg>",
  },
  {
    name: "Refinery Flare Stack",
    url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='250' viewBox='0 0 400 250'><rect fill='%2305101a' width='400' height='250'/><rect x='190' y='100' width='20' height='150' fill='%23666666'/><ellipse cx='200' cy='85' rx='30' ry='45' fill='%2300d4ff' opacity='0.8'/><ellipse cx='200' cy='75' rx='15' ry='25' fill='%23ffffff' opacity='0.9'/><text x='20' y='230' fill='%23ffffff' font-family='monospace' font-size='12'>[FIELD RECON] ELEVATED INDUSTRIAL FLARE</text></svg>",
  },
];

const AVAILABLE_RESOURCES = [
  "Foam Units (High Expansion)",
  "Water Bowsers (10,000L)",
  "Hazmat Class D Dry Powder",
  "Level A Chemical Suits",
  "Thermal Imaging Drone Recon",
  "Emergency Medical Evac / Ambulance",
  "Heavy Earthmovers / Firebreak Cutters",
];

const CATEGORIES = [
  { id: "EMERGENCY_INDUSTRIAL", label: "Emergency Industrial Fire" },
  { id: "PERSISTENT_INDUSTRIAL", label: "Persistent Industrial Source" },
  { id: "AGRICULTURAL_BURNING", label: "Agricultural Burning / Stubble" },
  { id: "FOREST_FIRE", label: "Forest / Wildland Fire" },
  { id: "UNKNOWN", label: "Unknown / False Alarm" },
];

export default function FieldReportForm({
  selectedFire,
  officerName,
  officerId,
  onSuccess,
  onCancel,
}: FieldReportFormProps) {
  const [fireId, setFireId] = useState<string>(
    selectedFire ? String(selectedFire.id) : "1"
  );
  const [locationVerified, setLocationVerified] = useState<boolean>(true);
  const [classificationCorrect, setClassificationCorrect] = useState<boolean>(true);
  const [classificationActual, setClassificationActual] = useState<string>(
    selectedFire?.classification || selectedFire?.category || "EMERGENCY_INDUSTRIAL"
  );
  const [status, setStatus] = useState<string>("CONTAINED");
  const [groundObservation, setGroundObservation] = useState<string>("");
  const [photoUrl, setPhotoUrl] = useState<string>("");
  const [damageAssessment, setDamageAssessment] = useState<string>("MODERATE");
  const [selectedResources, setSelectedResources] = useState<string[]>([
    "Foam Units (High Expansion)",
    "Water Bowsers (10,000L)",
  ]);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Sync fireId and actual category if selectedFire changes
  useEffect(() => {
    if (selectedFire) {
      setFireId(String(selectedFire.id));
      const cat = selectedFire.classification || selectedFire.category || "EMERGENCY_INDUSTRIAL";
      setClassificationActual(cat);
    }
  }, [selectedFire]);

  // Voice recording logic via Web Speech API
  const toggleVoiceRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Fallback if browser doesn't have Web Speech API
      const simulatedNotes = [
        "Ground observation: Heavy black plume visible from 500m. Tanker valve leakage confirmed.",
        "Ground observation: Secondary perimeter secured. High-expansion foam active. Containment at 70%.",
        "Ground observation: Agricultural residue fire spreading with wind towards eastern canal.",
      ];
      const pick = simulatedNotes[Math.floor(Math.random() * simulatedNotes.length)];
      setGroundObservation((prev) => (prev ? `${prev} ${pick}` : pick));
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-IN";

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setGroundObservation((prev) => {
            const trimmed = prev.trim();
            return trimmed ? `${trimmed} ${transcript}` : transcript;
          });
        }
      };

      recognition.onerror = (err: any) => {
        console.warn("Speech recognition error:", err);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.warn("Speech recognition initialization failed:", e);
      setIsRecording(false);
    }
  };

  // Photo upload handling
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      if (typeof loadEvt.target?.result === "string") {
        setPhotoUrl(loadEvt.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const toggleResource = (item: string) => {
    setSelectedResources((prev) =>
      prev.includes(item) ? prev.filter((r) => r !== item) : [...prev, item]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitResult(null);

    const payload = {
      fire_id: parseInt(fireId, 10) || 1,
      officer_name: officerName,
      officer_id: officerId,
      timestamp: new Date().toISOString(),
      status,
      ground_observation: groundObservation || "Ground inspection verified by field commander.",
      photo_url: photoUrl,
      location_verified: locationVerified,
      classification_correct: classificationCorrect,
      classification_actual: classificationCorrect
        ? (selectedFire?.classification || selectedFire?.category || "EMERGENCY_INDUSTRIAL")
        : classificationActual,
      damage_assessment: damageAssessment,
      resources_needed: selectedResources.join(", "),
    };

    try {
      const res = await fetch("/api/field-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.status === "success") {
        setSubmitResult({
          success: true,
          message: `Report #${data.report_id || "NEW"} logged! Ground truth updated in database.`,
        });
        if (onSuccess) {
          onSuccess(data.report || payload);
        }
      } else {
        throw new Error(data.details || "Failed to submit report");
      }
    } catch (err: any) {
      setSubmitResult({
        success: false,
        message: err.message || "Failed to transmit field report. Please retry.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#0a0e14] border border-[#1f293d] rounded-lg p-4 font-mono text-white shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1f293d] pb-3 mb-4">
        <div>
          <div className="text-xs text-[#00d4ff] tracking-wider uppercase font-semibold">
            IGNIS // GROUND RECON INTELLIGENCE
          </div>
          <h2 className="text-base text-[#ff9500] font-bold">
            FIELD OFFICER INCIDENT AUDIT
          </h2>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-gray-400 block">OFFICER ON DUTY:</span>
          <span className="text-xs text-white bg-[#141b26] px-2 py-0.5 rounded border border-[#2b3952]">
            {officerName} [{officerId}]
          </span>
        </div>
      </div>

      {submitResult && (
        <div
          className={`p-3 rounded mb-4 text-xs font-semibold flex items-center justify-between ${
            submitResult.success
              ? "bg-emerald-950/80 border border-emerald-500 text-emerald-300"
              : "bg-red-950/80 border border-red-500 text-red-300"
          }`}
        >
          <span>{submitResult.message}</span>
          <button
            onClick={() => setSubmitResult(null)}
            className="text-gray-400 hover:text-white font-bold ml-3"
          >
            ✕
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Fire ID & Coordinates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#111827]/60 p-3 rounded border border-[#1f293d]">
          <div>
            <label className="text-[11px] text-gray-400 block mb-1">
              ASSIGNED FIRE HOTSPOT ID
            </label>
            <input
              type="number"
              value={fireId}
              onChange={(e) => setFireId(e.target.value)}
              required
              className="w-full bg-[#0a0e14] border border-[#2b3952] rounded px-3 py-2 text-sm text-[#00d4ff] font-bold focus:outline-none focus:border-[#00d4ff]"
            />
          </div>
          <div>
            <label className="text-[11px] text-gray-400 block mb-1">
              COORDINATES (LAT / LON)
            </label>
            <div className="text-xs text-gray-300 bg-[#0a0e14] border border-[#2b3952] rounded px-3 py-2.5">
              {selectedFire
                ? `${selectedFire.latitude.toFixed(4)}°N, ${selectedFire.longitude.toFixed(4)}°E`
                : "21.1702°N, 72.8311°E (Default Sector)"}
            </div>
          </div>
        </div>

        {/* Verification Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Location Verified */}
          <div className="bg-[#111827]/60 p-3 rounded border border-[#1f293d]">
            <label className="text-[11px] text-gray-400 block mb-2 font-semibold">
              LOCATION ACCURACY VERIFIED?
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setLocationVerified(true)}
                className={`py-2 text-xs font-bold rounded border transition-all ${
                  locationVerified
                    ? "bg-emerald-600/30 border-emerald-500 text-emerald-300"
                    : "bg-[#0a0e14] border-[#1f293d] text-gray-400 hover:text-white"
                }`}
              >
                ✓ YES (ON SITE)
              </button>
              <button
                type="button"
                onClick={() => setLocationVerified(false)}
                className={`py-2 text-xs font-bold rounded border transition-all ${
                  !locationVerified
                    ? "bg-red-600/30 border-red-500 text-red-300"
                    : "bg-[#0a0e14] border-[#1f293d] text-gray-400 hover:text-white"
                }`}
              >
                ✕ NO (OFFSET)
              </button>
            </div>
          </div>

          {/* Classification Correct */}
          <div className="bg-[#111827]/60 p-3 rounded border border-[#1f293d]">
            <label className="text-[11px] text-gray-400 block mb-2 font-semibold">
              AI CLASSIFICATION CORRECT?
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setClassificationCorrect(true)}
                className={`py-2 text-xs font-bold rounded border transition-all ${
                  classificationCorrect
                    ? "bg-emerald-600/30 border-emerald-500 text-emerald-300"
                    : "bg-[#0a0e14] border-[#1f293d] text-gray-400 hover:text-white"
                }`}
              >
                ✓ CORRECT
              </button>
              <button
                type="button"
                onClick={() => setClassificationCorrect(false)}
                className={`py-2 text-xs font-bold rounded border transition-all ${
                  !classificationCorrect
                    ? "bg-amber-600/30 border-amber-500 text-amber-300"
                    : "bg-[#0a0e14] border-[#1f293d] text-gray-400 hover:text-white"
                }`}
              >
                ⚠ DISPUTE (REVISE)
              </button>
            </div>
          </div>
        </div>

        {/* If Classification Incorrect: Dropdown */}
        {!classificationCorrect && (
          <div className="bg-amber-950/20 border border-amber-500/50 p-3 rounded">
            <label className="text-xs text-amber-300 font-bold block mb-1.5">
              GROUND TRUTH: WHAT IS THE ACTUAL FIRE SOURCE?
            </label>
            <select
              value={classificationActual}
              onChange={(e) => setClassificationActual(e.target.value)}
              className="w-full bg-[#0a0e14] border border-amber-500 rounded px-3 py-2 text-xs text-amber-200 focus:outline-none"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-[#0a0e14]">
                  {cat.label}
                </option>
              ))}
            </select>
            <span className="text-[10px] text-gray-400 mt-1 block">
              * This will immediately update the active fire database and retrain the ML feedback loop.
            </span>
          </div>
        )}

        {/* Current Tactical Status */}
        <div>
          <label className="text-[11px] text-gray-400 block mb-1.5 font-semibold">
            CURRENT GROUND STATUS
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: "CONTAINED", label: "CONTAINED", color: "emerald" },
              { id: "SPREADING", label: "SPREADING", color: "red" },
              { id: "EXTINGUISHED", label: "EXTINGUISHED", color: "blue" },
              { id: "DISMISSED", label: "DISMISSED", color: "gray" },
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setStatus(st.id)}
                className={`py-2 px-1 text-xs font-bold rounded border text-center transition-all ${
                  status === st.id
                    ? st.color === "emerald"
                      ? "bg-emerald-600/30 border-emerald-500 text-emerald-300"
                      : st.color === "red"
                      ? "bg-red-600/30 border-red-500 text-red-300"
                      : st.color === "blue"
                      ? "bg-cyan-600/30 border-cyan-500 text-cyan-300"
                      : "bg-gray-700/40 border-gray-400 text-gray-200"
                    : "bg-[#0a0e14] border-[#1f293d] text-gray-400 hover:text-white"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Damage Assessment */}
        <div>
          <label className="text-[11px] text-gray-400 block mb-1.5 font-semibold">
            STRUCTURAL / HAZARD DAMAGE ASSESSMENT
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: "MINOR", label: "MINOR (< ₹5L)" },
              { id: "MODERATE", label: "MODERATE" },
              { id: "SEVERE", label: "SEVERE (> ₹50L)" },
              { id: "CATASTROPHIC", label: "CATASTROPHIC" },
            ].map((dmg) => (
              <button
                key={dmg.id}
                type="button"
                onClick={() => setDamageAssessment(dmg.id)}
                className={`py-1.5 px-1 text-[11px] font-semibold rounded border transition-all ${
                  damageAssessment === dmg.id
                    ? "bg-[#ff9500]/20 border-[#ff9500] text-[#ff9500]"
                    : "bg-[#0a0e14] border-[#1f293d] text-gray-400 hover:text-white"
                }`}
              >
                {dmg.label}
              </button>
            ))}
          </div>
        </div>

        {/* Ground Observation & Voice Input */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] text-gray-400 font-semibold">
              TACTICAL OBSERVATION (TEXT / VOICE INPUT)
            </label>
            <button
              type="button"
              onClick={toggleVoiceRecording}
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded font-bold border transition-all ${
                isRecording
                  ? "bg-red-600 text-white border-red-500 animate-pulse"
                  : "bg-[#1f293d] text-[#00d4ff] border-[#2b3952] hover:bg-[#2b3952]"
              }`}
            >
              <span>{isRecording ? "🔴 RECORDING..." : "🎙️ VOICE INPUT"}</span>
            </button>
          </div>
          <textarea
            value={groundObservation}
            onChange={(e) => setGroundObservation(e.target.value)}
            rows={3}
            placeholder="Type ground notes or tap 'VOICE INPUT' to dictate field observation..."
            className="w-full bg-[#0a0e14] border border-[#2b3952] rounded p-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00d4ff]"
          />
        </div>

        {/* Photo Upload & Camera Integration */}
        <div>
          <label className="text-[11px] text-gray-400 block mb-1.5 font-semibold">
            FIELD RECON PHOTO (CAMERA INTEGRATION)
          </label>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <input
              type="file"
              accept="image/*"
              capture="environment"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-[#1f293d] hover:bg-[#2b3952] border border-[#00d4ff] text-[#00d4ff] px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5"
            >
              📷 CAPTURE / UPLOAD PHOTO
            </button>

            {/* Demo Sample Pickers */}
            <span className="text-[10px] text-gray-400">or pick sample:</span>
            {SAMPLE_FIELD_PHOTOS.map((sample, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPhotoUrl(sample.url)}
                className="bg-[#141b26] hover:bg-[#1f293d] border border-[#1f293d] text-gray-300 px-2 py-1 rounded text-[10px]"
              >
                {sample.name}
              </button>
            ))}
          </div>

          {/* Photo Preview */}
          {photoUrl && (
            <div className="relative border border-[#00d4ff]/50 rounded p-1 bg-[#05080e] max-w-xs">
              <img
                src={photoUrl}
                alt="Field preview"
                className="w-full h-32 object-cover rounded"
              />
              <button
                type="button"
                onClick={() => setPhotoUrl("")}
                className="absolute top-2 right-2 bg-black/80 text-red-400 hover:text-red-200 text-xs px-1.5 py-0.5 rounded"
              >
                ✕ REMOVE
              </button>
            </div>
          )}
        </div>

        {/* Resources Needed Checklist */}
        <div>
          <label className="text-[11px] text-gray-400 block mb-1.5 font-semibold">
            CRITICAL RESOURCES REQUESTED
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 bg-[#111827]/40 p-2.5 rounded border border-[#1f293d]">
            {AVAILABLE_RESOURCES.map((res) => {
              const checked = selectedResources.includes(res);
              return (
                <label
                  key={res}
                  className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer select-none hover:text-white"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleResource(res)}
                    className="accent-[#00d4ff]"
                  />
                  <span className={checked ? "text-[#00d4ff] font-semibold" : ""}>
                    {res}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1f293d]">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white bg-[#141b26] border border-[#1f293d] rounded"
            >
              CANCEL
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto bg-[#ff9500] hover:bg-[#ffaa22] text-black font-black text-xs px-6 py-2.5 rounded shadow-lg flex items-center justify-center gap-2 uppercase tracking-wider transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>TRANSMITTING AUDIT...</span>
            ) : (
              <span>🚀 SUBMIT FIELD VERIFICATION</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
