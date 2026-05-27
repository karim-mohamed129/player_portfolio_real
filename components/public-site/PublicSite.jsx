"use client";

import Header from "./Header";
import Footer from "./Footer";
import HeroSection from "./sections/HeroSection";
import OverviewSection from "./sections/OverviewSection";
import StatsSection from "./sections/StatsSection";
import SkillsSection from "./sections/SkillsSection";
import CareerSection from "./sections/CareerSection";
import AchievementsSection from "./sections/AchievementsSection";
import MediaSection from "./sections/MediaSection";
import ContactSection from "./sections/ContactSection";
import ContactFormSection from "./sections/ContactFormSection";
import SiteFavicon from "./SiteFavicon";
import { useTranslation } from "@/components/i18n/LanguageProvider";
import { getLocalizedContent } from "@/lib/i18nContent";

export default function PublicSite({ initialContent }) {
  const { locale } = useTranslation();
  const content = getLocalizedContent(initialContent || {}, locale);

  return (
    <main className="min-h-screen text-white">
      <SiteFavicon href={content.site?.faviconUrl} />
      <Header site={content.site} nav={content.nav} />
      <HeroSection hero={content.hero} />
      <OverviewSection overview={content.overview} />
      <StatsSection stats={content.stats} />
      <SkillsSection skills={content.skills} />
      <CareerSection career={content.career} />
      <AchievementsSection achievements={content.achievements} />
      <MediaSection media={content.media} />
      <ContactSection contact={content.contact} />
      <ContactFormSection contact={content.contact} />
      <Footer site={content.site} />
    </main>
  );
}
