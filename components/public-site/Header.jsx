"use client";

import { useState } from "react";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";
import ThemeSwitcher from "@/components/theme/ThemeSwitcher";
import { useTranslation } from "@/components/i18n/LanguageProvider";
import FaIcon from "../icons/FaIcon";
import { IconCircle } from "./ui";
import { safeArray } from "./utils";

export default function Header({ site, nav }) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const visibleNav = safeArray(nav).filter((item) => !item.hidden);

  function goToSection(value) {
    if (!value) return;
    setOpen(false);
    window.location.href = value;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-pitch/75 backdrop-blur-xl">
      <nav className="relative mx-auto flex min-h-[76px] w-[min(1140px,calc(100%-32px))] items-center justify-between gap-4">
        <a href="#home" className="inline-flex min-w-0 items-center gap-3 text-xl font-black tracking-wide">
          {site?.logoImage ? (
            <span className="inline-grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-danger to-gold p-1 shadow-lg shadow-red-950/30">
              <img src={site.logoImage} alt={site?.logoText || "logo"} className="h-full w-full rounded-xl object-contain" />
            </span>
          ) : (
            <IconCircle icon={site?.logoIcon || "football"} className="h-11 w-11 shrink-0 text-lg" />
          )}
          <span className="truncate">{site?.logoText || "MH10"}</span>
        </a>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeSwitcher compact />
          <LanguageSwitcher compact />
          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.08] px-4 py-3 text-sm font-black text-white shadow-glass transition hover:bg-white/[.12]"
            aria-label={t("nav.menuAria")}
            aria-expanded={open}
          >
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-gold text-black">
              <FaIcon name="bars" className="h-4 w-4" />
            </span>
            <span className="hidden sm:inline">{t("nav.menu")}</span>
            <FaIcon name="chevron-down" className={`h-3 w-3 text-gold transition ${open ? "rotate-180" : ""}`} />
          </button>
        </div>

        {open && (
          <div className="absolute start-0 end-0 top-[calc(100%+10px)] z-50 overflow-hidden rounded-[1.7rem] border border-white/10 bg-[#07100c]/95 p-2 shadow-[0_24px_70px_rgba(0,0,0,.45)] backdrop-blur-2xl md:hidden">
            <div className="mb-2 rounded-[1.3rem] border border-white/10 bg-white/[.06] px-4 py-3 text-center text-xs font-black text-white/60">
              {t("nav.chooseSection")}
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {visibleNav.map((item, index) => (
                <button
                  key={`${item.href}-${index}`}
                  type="button"
                  onClick={() => goToSection(item.href || "#")}
                  className="rounded-[1.25rem] border border-white/10 bg-white/[.06] px-3 py-3 text-center text-sm font-black text-white/80 transition hover:border-gold/50 hover:bg-gold/15 hover:text-gold"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="hidden items-center gap-6 md:flex">
          <ul className="flex flex-row items-center gap-6">
            {visibleNav.map((item, index) => (
              <li key={`${item.href}-${index}`}>
                <a className="block rounded-2xl px-3 py-3 text-sm font-bold text-white/70 transition hover:bg-white/10 hover:text-white md:p-0 md:hover:bg-transparent" href={item.href || "#"}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <ThemeSwitcher />
          <LanguageSwitcher />
        </div>
      </nav>
    </header>
  );
}
