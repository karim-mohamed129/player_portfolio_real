"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  DEFAULT_LOCALE,
  LANGUAGE_COOKIE,
  LANGUAGE_STORAGE_KEY,
  getDirection,
  getHtmlLang,
  getNestedTranslation,
  getNextLocale,
  normalizeLocale,
  translations
} from "@/lib/i18n";

const LanguageContext = createContext(null);
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

function persistLocale(locale) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = getHtmlLang(locale);
  document.documentElement.dir = getDirection(locale);
  document.cookie = `${LANGUAGE_COOKIE}=${locale}; path=/; max-age=${ONE_YEAR_SECONDS}; SameSite=Lax`;

  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, locale);
  } catch {
    // Local storage can be unavailable in private or restricted browsers.
  }
}

export default function LanguageProvider({ initialLocale = DEFAULT_LOCALE, children }) {
  const [locale, setLocaleState] = useState(() => normalizeLocale(initialLocale));

  useEffect(() => {
    try {
      const storedValue = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (!storedValue) return;
      const savedLocale = normalizeLocale(storedValue);
      if (savedLocale !== locale) setLocaleState(savedLocale);
    } catch {
      // Keep the server-selected language when local storage is unavailable.
    }
    // Run once on mount only; the next effect persists any resulting state change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    persistLocale(locale);
  }, [locale]);

  const setLocale = useCallback((nextLocale) => {
    setLocaleState(normalizeLocale(nextLocale));
  }, []);

  const toggleLocale = useCallback(() => {
    setLocaleState((currentLocale) => getNextLocale(currentLocale));
  }, []);

  const value = useMemo(() => {
    const normalizedLocale = normalizeLocale(locale);
    const fallbackDictionary = translations[DEFAULT_LOCALE];
    const activeDictionary = translations[normalizedLocale] || fallbackDictionary;

    return {
      locale: normalizedLocale,
      direction: getDirection(normalizedLocale),
      isRtl: getDirection(normalizedLocale) === "rtl",
      setLocale,
      toggleLocale,
      t(key, fallback = "") {
        const translated = getNestedTranslation(activeDictionary, key);
        if (translated !== undefined) return translated;
        const fallbackTranslated = getNestedTranslation(fallbackDictionary, key);
        return fallbackTranslated !== undefined ? fallbackTranslated : fallback;
      }
    };
  }, [locale, setLocale, toggleLocale]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used inside LanguageProvider");
  }
  return context;
}
