"use client";

import { useTranslation } from "@/components/i18n/LanguageProvider";
import FaIcon from "../icons/FaIcon";

export default function Footer({ site }) {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-white/10 py-8">
      <div className="mx-auto flex w-[min(1140px,calc(100%-32px))] flex-col items-center justify-between gap-4 text-center text-sm text-white/55 md:flex-row">
        <p>{site?.footerText || "© 2026 Portfolio"}</p>
        <a href="#home" className="inline-flex items-center gap-2 font-black text-gold">
          {t("footer.backToTop")} <FaIcon name="arrow-up" className="h-4 w-4" />
        </a>
      </div>
    </footer>
  );
}
