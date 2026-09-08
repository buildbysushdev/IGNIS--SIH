"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useI18n } from "@/context/I18nContext";

interface HeaderProps {
  onSelectMode: (mode: "LIVE" | "CACHED" | "DEMO" | "AUTO") => void;
  currentMode: "LIVE" | "CACHED" | "DEMO";
  modeInfo?: {
    mode?: string;
    since?: string;
    reason?: string;
    data_source?: string;
    is_manual?: boolean;
  };
  onOpenHelp?: () => void;
}

export default function Header({
  onSelectMode,
  currentMode = "LIVE",
  modeInfo,
  onOpenHelp,
}: HeaderProps) {
  const { t } = useI18n();
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleModePick = (target: "LIVE" | "CACHED" | "DEMO" | "AUTO") => {
    setIsDropdownOpen(false);
    onSelectMode(target);
  };

  const isOperationsActive = pathname === "/";
  const isAnalyticsActive = pathname.startsWith("/analytics");
  const isFieldOfficerActive = pathname.startsWith("/field-officer");

  return (
    <header className="h-16 bg-[#0B1220] border-b border-[#1F2937] px-4 sm:px-6 flex items-center justify-between z-40 relative">
      {/* 1) LEFT: IGNIS Logo, Subtitle & NTRO SIH26162 Badge */}
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
            🔥
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-black tracking-wider text-white">
                IGNIS
              </span>
              <span className="text-[10px] font-semibold bg-[#111827] text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full tracking-normal">
                NTRO SIH26162
              </span>
            </div>
            <p className="text-[11px] text-[#9CA3AF] -mt-0.5 hidden sm:block">
              {t("header.subtitle", "Fire Intelligence Platform")}
            </p>
          </div>
        </Link>
      </div>

      {/* 2) CENTER: Single Clean Navigation Tabs (Only one active at a time) */}
      <nav className="hidden md:flex items-center gap-1.5 bg-[#111827] p-1 rounded-xl border border-[#1F2937]">
        <Link
          href="/"
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            isOperationsActive
              ? "bg-[#1F2937] text-white shadow-sm"
              : "text-[#9CA3AF] hover:text-white"
          }`}
        >
          {t("header.operations", "Operations")}
        </Link>

        <Link
          href="/analytics"
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            isAnalyticsActive
              ? "bg-[#1F2937] text-white shadow-sm"
              : "text-[#9CA3AF] hover:text-white"
          }`}
        >
          {t("header.analytics", "Analytics")}
        </Link>

        <Link
          href="/field-officer"
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            isFieldOfficerActive
              ? "bg-[#1F2937] text-white shadow-sm"
              : "text-[#9CA3AF] hover:text-white"
          }`}
        >
          {t("header.field_officer", "Field Officer")}
        </Link>
      </nav>

      {/* 3) RIGHT: Mode Pill, Language Switcher & Help (?) */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Compact Mode Pill */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              currentMode === "LIVE"
                ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-400 hover:bg-emerald-950/60"
                : currentMode === "DEMO"
                ? "bg-purple-950/40 border-purple-500/50 text-purple-300 hover:bg-purple-950/60"
                : "bg-amber-950/40 border-amber-500/50 text-amber-400 hover:bg-amber-950/60"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                currentMode === "LIVE"
                  ? "bg-emerald-400 animate-pulse"
                  : currentMode === "DEMO"
                  ? "bg-purple-400"
                  : "bg-amber-400"
              }`}
            />
            <span>{currentMode === "LIVE" ? "LIVE" : currentMode === "DEMO" ? "DEMO" : "CACHED"}</span>
            <span className="text-[10px] text-[#9CA3AF]">▼</span>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#111827] border border-[#1F2937] rounded-xl shadow-2xl p-1.5 z-50 text-xs">
              <button
                type="button"
                onClick={() => handleModePick("LIVE")}
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between ${
                  currentMode === "LIVE"
                    ? "bg-[#1F2937] text-emerald-400 font-semibold"
                    : "text-[#E5E7EB] hover:bg-[#1F2937]/60"
                }`}
              >
                <span>Live Feed (NASA)</span>
                <span className="text-[10px] text-emerald-500">●</span>
              </button>
              <button
                type="button"
                onClick={() => handleModePick("DEMO")}
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between ${
                  currentMode === "DEMO"
                    ? "bg-[#1F2937] text-purple-300 font-semibold"
                    : "text-[#E5E7EB] hover:bg-[#1F2937]/60"
                }`}
              >
                <span>Demo Simulation</span>
                <span className="text-[10px] text-purple-400">●</span>
              </button>
              <button
                type="button"
                onClick={() => handleModePick("CACHED")}
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between ${
                  currentMode === "CACHED"
                    ? "bg-[#1F2937] text-amber-300 font-semibold"
                    : "text-[#E5E7EB] hover:bg-[#1F2937]/60"
                }`}
              >
                <span>Offline Cached DB</span>
                <span className="text-[10px] text-amber-500">●</span>
              </button>
            </div>
          )}
        </div>

        {/* Multi-Language Dropdown */}
        <LanguageSwitcher />

        {/* Help (?) Button */}
        {onOpenHelp && (
          <button
            onClick={onOpenHelp}
            className="w-8 h-8 rounded-lg bg-[#111827] hover:bg-[#1F2937] border border-[#1F2937] text-[#9CA3AF] hover:text-white flex items-center justify-center text-xs font-bold transition"
            title="Help & System Info"
          >
            ?
          </button>
        )}
      </div>
    </header>
  );
}
