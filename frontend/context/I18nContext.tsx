"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from "react";
import { NextIntlClientProvider, useTranslations } from "next-intl";

import en from "@/messages/en.json";
import hi from "@/messages/hi.json";
import mr from "@/messages/mr.json";
import ta from "@/messages/ta.json";
import bn from "@/messages/bn.json";

export type Locale = "en" | "hi" | "mr" | "ta" | "bn";

export interface LocaleOption {
  code: Locale;
  label: string;
  nativeLabel: string;
  flag: string;
}

export const AVAILABLE_LOCALES: LocaleOption[] = [
  { code: "en", label: "English", nativeLabel: "English", flag: "🇬🇧" },
  { code: "hi", label: "Hindi", nativeLabel: "हिन्दी", flag: "🇮🇳" },
  { code: "mr", label: "Marathi", nativeLabel: "मराठी", flag: "🇮🇳" },
  { code: "ta", label: "Tamil", nativeLabel: "தமிழ்", flag: "🇮🇳" },
  { code: "bn", label: "Bengali", nativeLabel: "বাংলা", flag: "🇮🇳" },
];

const MESSAGES_MAP: Record<Locale, any> = {
  en,
  hi,
  mr,
  ta,
  bn,
};

interface I18nContextType {
  locale: Locale;
  setLocale: (loc: Locale) => void;
  t: (path: string, fallback?: string) => string;
  formatNumber: (num: number) => string;
  formatDate: (date: Date | string) => string;
  formatTime: (date: Date | string) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

function getNestedValue(obj: any, path: string): string | undefined {
  const parts = path.split(".");
  let curr = obj;
  for (const part of parts) {
    if (curr == null || typeof curr !== "object") return undefined;
    curr = curr[part];
  }
  return typeof curr === "string" ? curr : undefined;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // Load persisted language from localStorage on client mount
  useEffect(() => {
    setIsMounted(true);
    try {
      const saved = localStorage.getItem("ignis_locale") as Locale;
      if (saved && (saved === "en" || saved === "hi" || saved === "mr" || saved === "ta" || saved === "bn")) {
        setLocaleState(saved);
      }
    } catch (e) {
      // Ignore localStorage errors
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem("ignis_locale", newLocale);
      document.documentElement.lang = newLocale;
    } catch (e) {
      // Ignore localStorage errors
    }
  };

  const messages = MESSAGES_MAP[locale] || en;

  const t = (path: string, fallback?: string): string => {
    const val = getNestedValue(messages, path) || getNestedValue(en, path);
    return val !== undefined ? val : (fallback || path);
  };

  const formatNumber = (num: number): string => {
    try {
      const intlLocale = locale === "en" ? "en-IN" : `${locale}-IN`;
      return new Intl.NumberFormat(intlLocale).format(num);
    } catch {
      return String(num);
    }
  };

  const formatDate = (dateInput: Date | string): string => {
    try {
      const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
      const intlLocale = locale === "en" ? "en-IN" : `${locale}-IN`;
      return new Intl.DateTimeFormat(intlLocale, {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(d);
    } catch {
      return String(dateInput);
    }
  };

  const formatTime = (dateInput: Date | string): string => {
    try {
      const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
      const intlLocale = locale === "en" ? "en-IN" : `${locale}-IN`;
      return new Intl.DateTimeFormat(intlLocale, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(d);
    } catch {
      return String(dateInput);
    }
  };

  const contextValue = useMemo(
    () => ({
      locale,
      setLocale,
      t,
      formatNumber,
      formatDate,
      formatTime,
    }),
    [locale]
  );

  return (
    <I18nContext.Provider value={contextValue}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    // Fallback if rendered outside provider
    return {
      locale: "en" as Locale,
      setLocale: () => {},
      t: (path: string, fallback?: string) => fallback || path,
      formatNumber: (num: number) => String(num),
      formatDate: (d: Date | string) => String(d),
      formatTime: (d: Date | string) => String(d),
    };
  }
  return context;
}

export { useTranslations };
