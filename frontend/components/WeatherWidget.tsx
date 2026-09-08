"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export interface WeatherTelemetry {
  source?: string;
  temperature: number;
  wind_speed: number;
  wind_direction: number;
  wind_compass: string;
  humidity: number;
  timestamp?: string;
  is_cached?: boolean;
}

interface WeatherWidgetProps {
  lat?: number;
  lon?: number;
  onWeatherLoaded?: (weather: WeatherTelemetry) => void;
}

export default function WeatherWidget({
  lat = 21.1702,
  lon = 72.8311,
  onWeatherLoaded,
}: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherTelemetry | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const fetchWeather = async (targetLat: number, targetLon: number) => {
    try {
      setLoading(true);
      const res = await axios.get("/api/weather", {
        params: { lat: targetLat, lon: targetLon },
        timeout: 6000,
      });
      if (res.data) {
        setWeather(res.data);
        if (onWeatherLoaded) onWeatherLoaded(res.data);
        const now = new Date();
        setLastUpdated(`${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")} IST`);
      }
    } catch (err) {
      // Fallback
      const fallback: WeatherTelemetry = {
        source: "Climatology Baseline",
        temperature: 32.0,
        wind_speed: 12.0,
        wind_direction: 255.0,
        wind_compass: "WSW",
        humidity: 54.0,
      };
      setWeather(fallback);
      if (onWeatherLoaded) onWeatherLoaded(fallback);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and 30-minute interval refresh
  useEffect(() => {
    fetchWeather(lat, lon);
    const interval = setInterval(() => {
      fetchWeather(lat, lon);
    }, 30 * 60 * 1000); // 30 mins
    return () => clearInterval(interval);
  }, [lat, lon]);

  if (!weather) return null;

  // Wind direction is direction wind blows FROM. Arrow points towards downwind (wind_direction + 180)
  const arrowRotation = (weather.wind_direction + 180) % 360;

  return (
    <div className="absolute top-3 right-14 z-[400] font-mono text-xs select-none">
      <div className="bg-[#0a0e14]/90 backdrop-blur-md border border-[#1f2933] shadow-[0_4px_20px_rgba(0,0,0,0.6)] p-2 rounded-none transition-all duration-200 min-w-[200px]">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 border-b border-[#1f2933] pb-1.5 mb-1.5">
          <div className="flex items-center gap-1.5 text-[10px] tracking-wider text-[#00d4ff] font-bold uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ff9c] animate-pulse" />
            <span>ATMOSPHERIC TELEMETRY</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => fetchWeather(lat, lon)}
              title="Refresh meteorological telemetry"
              className="text-[#6b7785] hover:text-[#00d4ff] text-[10px] p-0.5 cursor-pointer transition"
            >
              ⟳
            </button>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-[#6b7785] hover:text-[#d0d8e0] text-[10px] px-1 py-0.5 cursor-pointer"
            >
              {isCollapsed ? "▼" : "▲"}
            </button>
          </div>
        </div>

        {/* Collapsed view */}
        {isCollapsed ? (
          <div className="flex items-center justify-between text-[10px] text-[#d0d8e0]">
            <span className="text-[#ffb800] font-bold">{weather.temperature}°C</span>
            <span className="text-[#4a5563]">|</span>
            <span className="text-[#00d4ff]">{weather.wind_speed} km/h {weather.wind_compass}</span>
            <span className="text-[#4a5563]">|</span>
            <span className="text-[#00ff9c]">{weather.humidity}% RH</span>
          </div>
        ) : (
          /* Expanded tactical HUD view */
          <div className="space-y-1.5">
            {/* Primary Grid: Temp & Wind */}
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              {/* Temperature */}
              <div className="bg-[#0f141b] border border-[#1f2933] p-1.5">
                <div className="text-[9px] text-[#6b7785] uppercase">AMBIENT TEMP</div>
                <div className="text-sm font-bold text-[#ffb800] tabular-nums mt-0.5">
                  {weather.temperature}
                  <span className="text-[10px] text-[#ffb800]/80 ml-0.5">°C</span>
                </div>
              </div>

              {/* Relative Humidity */}
              <div className="bg-[#0f141b] border border-[#1f2933] p-1.5">
                <div className="text-[9px] text-[#6b7785] uppercase">HUMIDITY</div>
                <div className="text-sm font-bold text-[#00ff9c] tabular-nums mt-0.5">
                  {weather.humidity}
                  <span className="text-[10px] text-[#00ff9c]/80 ml-0.5">% RH</span>
                </div>
              </div>
            </div>

            {/* Wind Vector Banner */}
            <div className="bg-[#0f141b] border border-[#1f2933] p-1.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Tactical Compass Arrow */}
                <div className="relative w-6 h-6 rounded-full border border-[#1f2933] bg-[#0a0e14] flex items-center justify-center">
                  <div
                    className="text-[#00d4ff] text-xs font-bold transition-transform duration-500"
                    style={{ transform: `rotate(${arrowRotation}deg)` }}
                    title={`Wind direction: ${weather.wind_direction}° (${weather.wind_compass})`}
                  >
                    ➤
                  </div>
                </div>
                <div>
                  <div className="text-[9px] text-[#6b7785] uppercase">WIND VECTOR</div>
                  <div className="text-[11px] font-bold text-[#00d4ff] tabular-nums">
                    {weather.wind_speed} <span className="text-[9px] font-normal text-[#6b7785]">km/h</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[11px] font-bold text-[#d0d8e0]">
                  {weather.wind_compass}
                </div>
                <div className="text-[9px] text-[#4a5563] tabular-nums">
                  {weather.wind_direction}° FROM
                </div>
              </div>
            </div>

            {/* Sub-footer metadata */}
            <div className="flex items-center justify-between text-[8px] text-[#4a5563] pt-0.5">
              <span>SRC: {weather.source?.split(" ")[0] || "OPEN-METEO"}</span>
              <span>{lastUpdated ? `SYNC: ${lastUpdated}` : "LIVE SYNC"}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
