import FaIcon from "../../icons/FaIcon";
import { ButtonLink, SectionBadge } from "../ui";
import { safeArray } from "../utils";

export default function HeroSection({ hero }) {
  return (
    <section id="home" className="relative flex min-h-[calc(100vh-76px)] items-center overflow-hidden bg-black">
      {hero?.backgroundImage && <img src={hero.backgroundImage} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-45" />}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/20" />
      <div className="pointer-events-none absolute inset-x-[-10%] bottom-[-20%] h-80 bg-gradient-to-b from-transparent to-pitch" />
      <div className="relative mx-auto grid w-[min(1140px,calc(100%-32px))] items-center gap-12 py-16 lg:grid-cols-[1.05fr_.95fr]">
        <div className="text-center lg:text-start">
          <SectionBadge icon="location">{hero?.tag}</SectionBadge>
          <h1 className="mb-6 text-5xl font-black leading-tight md:text-7xl lg:text-8xl">
            {hero?.name}
            <span className="mt-3 block text-3xl text-gold md:text-5xl">{hero?.position}</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg leading-9 text-white/80 lg:mx-0">{hero?.summary}</p>
          <div className="mb-8 flex flex-wrap justify-center gap-4 lg:justify-start">
            {hero?.primaryButtonUrl && <ButtonLink href="/api/download/cv" download>{hero?.primaryButtonText || "تحميل الـ CV"}</ButtonLink>}
            <ButtonLink href={hero?.secondaryButtonUrl || "#contact"} variant="secondary">{hero?.secondaryButtonText || "تواصل مباشر"}</ButtonLink>
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
          <div className="relative overflow-hidden rounded-[2.25rem] border border-white/15 bg-black shadow-glass lg:-rotate-1">
            {hero?.playerImage && <img src={hero.playerImage} alt={hero?.name || "player"} className="h-[430px] w-full object-cover md:h-[580px]" />}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/85" />
            <div className="absolute bottom-6 left-6 right-6 flex items-center gap-3 rounded-3xl border border-white/15 bg-pitch/80 p-4 backdrop-blur-xl">
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
