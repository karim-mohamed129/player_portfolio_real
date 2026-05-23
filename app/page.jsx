import PublicSite from "@/components/PublicSite";
import { getPublicContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const content = await getPublicContent();
  return {
    title: content?.site?.title || "Football Player Portfolio",
    description: content?.site?.description || "Professional player portfolio"
  };
}

export default async function HomePage() {
  const content = await getPublicContent();
  return <PublicSite initialContent={content} />;
}
