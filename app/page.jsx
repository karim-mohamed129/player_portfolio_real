import { cookies } from "next/headers";
import PublicSite from "@/components/PublicSite";
import { getPublicContent } from "@/lib/content";
import { getLocalizedContent } from "@/lib/i18nContent";
import { LANGUAGE_COOKIE, normalizeLocale } from "@/lib/i18n";

export const dynamic = "force-dynamic";

async function getRequestLocale() {
  const cookieStore = await cookies();
  return normalizeLocale(cookieStore.get(LANGUAGE_COOKIE)?.value);
}

export async function generateMetadata() {
  const [content, locale] = await Promise.all([getPublicContent(), getRequestLocale()]);
  const localizedContent = getLocalizedContent(content, locale);
  const faviconUrl = localizedContent?.site?.faviconUrl || "/favicon.svg";
  return {
    title: localizedContent?.site?.title || "Football Player Portfolio",
    description: localizedContent?.site?.description || "Professional player portfolio",
    icons: {
      icon: faviconUrl,
      shortcut: faviconUrl,
      apple: faviconUrl
    }
  };
}

export default async function HomePage() {
  const content = await getPublicContent();
  return <PublicSite initialContent={content} />;
}
