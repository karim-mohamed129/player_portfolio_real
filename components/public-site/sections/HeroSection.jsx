"use client";

import { useTranslation } from "@/components/i18n/LanguageProvider";
import FaIcon from "../../icons/FaIcon";
import { ButtonLink, SectionBadge } from "../ui";
import { safeArray } from "../utils";

const PLAYER_IMAGE_FALLBACK = "/assets/player/profile.webp";

export default function HeroSection({ hero }) {
  const { t } = useTranslation();
  const playerAlt = [hero?.name, hero?.position].filter(Boolean).join(" - ") || t("hero.playerAlt");
  const playerImage = hero?.playerImage || PLAYER_IMAGE_FALLBACK;

  function handlePlayerImageError(event) {
    const image = event.currentTarget;
    if (image.dataset.fallbackApplied === "true") return;
    image.dataset.fallbackApplied = "true";
    image.src = PLAYER_IMAGE_FALLBACK;
  }

  return (
    <section id="home" className="hero-section relative flex min-h-[calc(100vh-76px)] items-center overflow-hidden">
      {hero?.backgroundImage && <img src={hero.backgroundImage} alt="" aria-hidden="true" className="site-image-cover absolute inset-0 h-full w-full opacity-45" />}
      <div className="hero-overlay absolute inset-0" />
      <div className="hero-fade pointer-events-none absolute inset-x-[-10%] bottom-[-20%] h-80" />
      <div className="relative mx-auto grid w-[min(1140px,calc(100%-32px))] items-center gap-12 py-16 lg:grid-cols-[1.05fr_.95fr]">
        <div className="text-center lg:text-start">
          <SectionBadge icon="location">{hero?.tag}</SectionBadge>
          <h1 className="mb-6 text-5xl font-black leading-tight md:text-7xl lg:text-8xl">
            {hero?.name}
            <span className="mt-3 block text-3xl text-gold md:text-5xl">{hero?.position}</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg leading-9 text-white/80 lg:mx-0">{hero?.summary}</p>
          <div className="mb-8 flex flex-wrap justify-center gap-4 lg:justify-start">
            {hero?.primaryButtonUrl && <ButtonLink href="/api/download/cv" download>{hero?.primaryButtonText || t("hero.downloadCv")}</ButtonLink>}
            <ButtonLink href={hero?.secondaryButtonUrl || "#contact"} variant="secondary">{hero?.secondaryButtonText || t("hero.contact")}</ButtonLink>
          </div>
          <div className="mx-auto grid max-w-2xl gap-3 md:grid-cols-3 lg:mx-0">
            {safeArray(hero?.quickInfo).map((item, index) => (
              <div key={index} className="glass-card rounded-3xl p-4">
                <div className="mb-3 inline-grid h-11 w-11 place-items-center rounded-2xl bg-gold/10 text-2xl text-gold">
                  <FaIcon name={item.icon || "circle"} className="h-6 w-6" />
                </div>
                <span className="block text-sm text-white/60">{item.label}</span>
                <strong className="block text-lg text-white">{item.value}</strong>
              </div>
            ))}
          </div>
        </div>
        <aside>
          <div className="hero-photo-card relative overflow-hidden rounded-[2.25rem] border shadow-glass">
            <div className="flex h-[430px] items-center justify-center bg-black/20 md:h-[580px]">
              <img
                key={playerImage}
                src={playerImage}
                alt={playerAlt}
                className="h-full w-full object-cover object-center"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                onError={handlePlayerImageError}
              />
            </div>
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-black/85" />
            <div className="hero-status-card absolute bottom-6 start-6 end-6 flex items-center gap-3 rounded-3xl border p-4 backdrop-blur-xl">
              <span className="h-4 w-4 rounded-full bg-grass shadow-[0_0_0_10px_rgba(17,155,89,.16)]" />
              <div>
                <strong className="block">{hero?.statusTitle}</strong>
                <small className="text-white/60">{hero?.statusSubtitle}</small>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}    