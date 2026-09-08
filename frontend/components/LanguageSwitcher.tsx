"use client";

import { useState, useRef, useEffect } from "react";
import { useI18n, AVAILABLE_LOCALES, Locale } from "@/context/I18nContext";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentOption = AVAILABLE_LOCALES.find((l) => l.code === locale) || AVAILABLE_LOCALES[0];

  return (
    <div className="relative font-mono text-xs" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 border border-[#1f2933] bg-[#0a0e14] hover:bg-[#15202c] hover:border-[#00d4ff]/50 px-2 py-1 text-[10px] font-bold tracking-wider uppercase text-[#d0d8e0] cursor-pointer transition select-none"
        title="Switch Interface Language (English / हिन्दी / मराठी / தமிழ் / বাংলা)"
      >
        <span className="text-xs">{currentOption.flag}</span>
        <span className="text-[#00d4ff] font-bold">{currentOption.nativeLabel}</span>
        <span className="text-[#6b7785] text-[8px]">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-44 bg-[#0a0e14]/95 backdrop-blur-md border border-[#1f2933] shadow-[0_8px_25px_rgba(0,0,0,0.8)] z-50 py-1 font-mono text-[11px] animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2.5 py-1 text-[9px] text-[#6b7785] border-b border-[#1f2933] font-bold uppercase tracking-widest flex items-center justify-between">
            <span>SELECT LANGUAGE</span>
            <span className="text-[#00d4ff]">LANG // i18n</span>
          </div>

          <div className="py-0.5">
            {AVAILABLE_LOCALES.map((option) => {
              const isSelected = option.code === locale;
              return (
                <button
                  key={option.code}
                  type="button"
                  onClick={() => {
                    setLocale(option.code);
                    setIsOpen(false);
                  }}
                  className={`w-full px-2.5 py-1.5 flex items-center justify-between hover:bg-[#15202c] cursor-pointer transition text-left ${
                    isSelected ? "text-[#00ff9c] font-bold bg-[#00ff9c]/10" : "text-[#d0d8e0]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{option.flag}</span>
                    <div>
                      <span className="font-bold">{option.nativeLabel}</span>
                      {option.code !== "en" && (
                        <span className="text-[9px] text-[#6b7785] ml-1.5 font-normal">
                          ({option.label})
                        </span>
                      )}
                    </div>
                  </div>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00ff9c] animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
