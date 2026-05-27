"use client";

import { useTranslation } from "@/components/i18n/LanguageProvider";
import { useTheme } from "./ThemeProvider";

function SunIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.75v2.1M12 19.15v2.1M21.25 12h-2.1M4.85 12h-2.1M18.54 5.46l-1.49 1.49M6.95 17.05l-1.49 1.49M18.54 18.54l-1.49-1.49M6.95 6.95 5.46 5.46" />
    </svg>
  );
}

function MoonIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M20.2 14.2A8.7 8.7 0 0 1 9.8 3.8a8.9 8.9 0 1 0 10.4 10.4Z" />
      <path d="M16.8 4.7h.01M19.35 7.25h.01" />
    </svg>
  );
}

export default function ThemeSwitcher() {
  const { theme, toggleTheme, isLight } = useTheme();
  const { t } = useTranslation();
  const ariaLabel = isLight ? t("theme.switchToDarkAria") : t("theme.switchToLightAria");

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="theme-toggle inline-grid h-11 w-11 place-items-center rounded-2xl border shadow-glass transition"
      aria-label={ariaLabel}
      title={ariaLabel}
      data-active-theme={theme}
    >
      <span className="theme-toggle__icon grid h-8 w-8 place-items-center rounded-xl transition">
        {isLight ? <MoonIcon className="h-[18px] w-[18px]" /> : <SunIcon className="h-[18px] w-[18px]" />}
      </span>
    </button>
  );
}
