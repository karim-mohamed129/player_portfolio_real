"use client";

import FaIcon from "@/components/icons/FaIcon";
import { localeMeta } from "@/lib/i18n";
import { useTranslation } from "./LanguageProvider";

export default function LanguageSwitcher({ compact = false }) {
  const { locale, toggleLocale, t } = useTranslation();
  const nextLocale = locale === "ar" ? "en" : "ar";

  return (
    <button
      type="button"
      onClick={toggleLocale}
      className="theme-toggle inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm font-black shadow-glass transition"
      aria-label={t("language.switchAria")}
      title={t("language.switchAria")}
    >
      <FaIcon name="globe" className="h-4 w-4" />
      <span>{compact ? localeMeta[nextLocale].shortLabel : t("language.switchTo")}</span>
    </button>
  );
}
