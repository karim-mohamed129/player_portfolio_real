"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  DEFAULT_THEME,
  THEME_COOKIE,
  THEME_STORAGE_KEY,
  getNextTheme,
  normalizeTheme
} from "@/lib/theme";

const ThemeContext = createContext(null);
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

function persistTheme(theme) {
  if (typeof document === "undefined") return;

  const normalizedTheme = normalizeTheme(theme);
  document.documentElement.dataset.theme = normalizedTheme;
  document.documentElement.style.colorScheme = normalizedTheme;
  document.cookie = `${THEME_COOKIE}=${normalizedTheme}; path=/; max-age=${ONE_YEAR_SECONDS}; SameSite=Lax`;

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, normalizedTheme);
  } catch {
    // Local storage can be unavailable in private or restricted browsers.
  }
}

export default function ThemeProvider({ initialTheme = DEFAULT_THEME, children }) {
  const [theme, setThemeState] = useState(() => normalizeTheme(initialTheme));

  useEffect(() => {
    try {
      const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (!storedTheme) return;
      const savedTheme = normalizeTheme(storedTheme);
      if (savedTheme !== theme) setThemeState(savedTheme);
    } catch {
      // Keep the server-selected theme when local storage is unavailable.
    }
    // Run once on mount only; the next effect persists any resulting state change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    persistTheme(theme);
  }, [theme]);

  const setTheme = useCallback((nextTheme) => {
    setThemeState(normalizeTheme(nextTheme));
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((currentTheme) => getNextTheme(currentTheme));
  }, []);

  const value = useMemo(() => {
    const normalizedTheme = normalizeTheme(theme);
    return {
      theme: normalizedTheme,
      isLight: normalizedTheme === "light",
      isDark: normalizedTheme === "dark",
      setTheme,
      toggleTheme
    };
  }, [theme, setTheme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return context;
}
