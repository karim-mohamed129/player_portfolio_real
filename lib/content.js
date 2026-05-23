import { connectDB } from "@/lib/db";
import Content from "@/models/Content";
import { defaultContent } from "@/lib/defaultContent";
import { isSafeCloudinaryPdfUrl, sanitizeText, sanitizeUrl } from "@/lib/security";

function toPlain(doc) {
  return JSON.parse(JSON.stringify(doc));
}

function sanitizePercent(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.min(Math.max(Math.round(number), 0), 100);
}

function sanitizeItem(item, template = {}) {
  const output = {};
  for (const key of Object.keys(template)) {
    const value = item?.[key];
    if (typeof template[key] === "number") output[key] = key === "percent" ? sanitizePercent(value) : Number(value) || 0;
    else if (key.toLowerCase().includes("url") || key.toLowerCase().includes("image") || key === "src") output[key] = sanitizeUrl(value, template[key] || "");
    else if (typeof template[key] === "boolean") output[key] = Boolean(value);
    else output[key] = sanitizeText(value, 1000);
  }
  return output;
}

function sanitizeItemArray(items, templateItem, maxItems = 30) {
  if (!Array.isArray(items)) return [];
  return items.slice(0, maxItems).map((item) => sanitizeItem(item, templateItem));
}

export function sanitizeContentForStorage(input = {}) {
  const source = typeof input === "object" && input ? input : {};
  const safe = toPlain(defaultContent);

  if (source.site) {
    safe.site = {
      ...safe.site,
      title: sanitizeText(source.site.title, 180),
      description: sanitizeText(source.site.description, 300),
      faviconUrl: sanitizeUrl(source.site.faviconUrl, safe.site.faviconUrl),
      logoText: sanitizeText(source.site.logoText, 40),
      logoImage: sanitizeUrl(source.site.logoImage, safe.site.logoImage),
      logoIcon: sanitizeText(source.site.logoIcon, 40),
      footerText: sanitizeText(source.site.footerText, 200),
      direction: ["rtl", "ltr"].includes(source.site.direction) ? source.site.direction : safe.site.direction,
      language: sanitizeText(source.site.language, 10)
    };
  }

  if (Array.isArray(source.nav)) {
    const hrefMap = new Map((defaultContent.nav || []).map((item) => [item.label, item.href]));
    safe.nav = source.nav.slice(0, 12).map((item, index) => ({
      label: sanitizeText(item?.label, 80),
      href: hrefMap.get(item?.label) || defaultContent.nav?.[index]?.href || "#",
      hidden: Boolean(item?.hidden)
    }));
  }

  if (source.hero) {
    safe.hero = {
      ...safe.hero,
      tag: sanitizeText(source.hero.tag, 140),
      name: sanitizeText(source.hero.name, 100),
      position: sanitizeText(source.hero.position, 140),
      summary: sanitizeText(source.hero.summary, 900),
      primaryButtonText: sanitizeText(source.hero.primaryButtonText, 80),
      primaryButtonUrl: isSafeCloudinaryPdfUrl(source.hero.primaryButtonUrl) ? sanitizeUrl(source.hero.primaryButtonUrl, "") : "",
      secondaryButtonText: sanitizeText(source.hero.secondaryButtonText, 80),
      secondaryButtonUrl: sanitizeUrl(source.hero.secondaryButtonUrl, "#contact"),
      backgroundImage: sanitizeUrl(source.hero.backgroundImage, safe.hero.backgroundImage),
      playerImage: sanitizeUrl(source.hero.playerImage, safe.hero.playerImage),
      statusTitle: sanitizeText(source.hero.statusTitle, 80),
      statusSubtitle: sanitizeText(source.hero.statusSubtitle, 80),
      quickInfo: sanitizeItemArray(source.hero.quickInfo, defaultContent.hero.quickInfo[0], 12)
    };
  }

  if (source.overview) {
    safe.overview = {
      ...safe.overview,
      label: sanitizeText(source.overview.label, 80),
      title: sanitizeText(source.overview.title, 220),
      summary: sanitizeText(source.overview.summary, 900),
      image: sanitizeUrl(source.overview.image, safe.overview.image),
      rows: sanitizeItemArray(source.overview.rows, defaultContent.overview.rows[0], 20)
    };
  }

  if (source.stats) {
    safe.stats = {
      ...safe.stats,
      label: sanitizeText(source.stats.label, 80),
      title: sanitizeText(source.stats.title, 220),
      items: sanitizeItemArray(source.stats.items, defaultContent.stats.items[0], 20)
    };
  }

  if (source.skills) {
    safe.skills = {
      ...safe.skills,
      label: sanitizeText(source.skills.label, 80),
      title: sanitizeText(source.skills.title, 220),
      image: sanitizeUrl(source.skills.image, safe.skills.image),
      items: sanitizeItemArray(source.skills.items, defaultContent.skills.items[0], 20)
    };
  }

  if (source.career) {
    safe.career = {
      ...safe.career,
      label: sanitizeText(source.career.label, 80),
      title: sanitizeText(source.career.title, 220),
      items: sanitizeItemArray(source.career.items, defaultContent.career.items[0], 30)
    };
  }

  if (source.achievements) {
    safe.achievements = {
      ...safe.achievements,
      label: sanitizeText(source.achievements.label, 80),
      title: sanitizeText(source.achievements.title, 220),
      items: sanitizeItemArray(source.achievements.items, defaultContent.achievements.items[0], 30)
    };
  }

  if (source.media) {
    safe.media = {
      ...safe.media,
      label: sanitizeText(source.media.label, 80),
      title: sanitizeText(source.media.title, 220),
      summary: sanitizeText(source.media.summary, 600),
      items: sanitizeItemArray(source.media.items, defaultContent.media.items[0], 50)
    };
  }

  if (source.contact) {
    safe.contact = {
      ...safe.contact,
      label: sanitizeText(source.contact.label, 80),
      title: sanitizeText(source.contact.title, 220),
      summary: sanitizeText(source.contact.summary, 700),
      image: sanitizeUrl(source.contact.image, safe.contact.image),
      email: sanitizeText(source.contact.email, 120),
      phone: sanitizeText(source.contact.phone, 40),
      messageLabel: sanitizeText(source.contact.messageLabel, 80),
      messageTitle: sanitizeText(source.contact.messageTitle, 220),
      messageSummary: sanitizeText(source.contact.messageSummary, 700),
      messageImage: sanitizeUrl(source.contact.messageImage, safe.contact.messageImage)
    };
  }

  return safe;
}

export async function getContentDocument({ createIfMissing = true } = {}) {
  await connectDB();
  let content = await Content.findOne({ key: "main" }).lean();

  if (!content && createIfMissing) {
    content = await Content.create({ key: "main", data: defaultContent, updatedBy: "seed" });
    content = content.toObject();
  }

  return toPlain(content);
}

export async function getPublicContent() {
  try {
    const doc = await getContentDocument({ createIfMissing: true });
    return doc?.data || defaultContent;
  } catch (error) {
    console.warn("Using default content because database is not ready:", error.message);
    return defaultContent;
  }
}

export async function updateContent(data, updatedBy = "admin") {
  await connectDB();
  const safeData = sanitizeContentForStorage(data);
  const content = await Content.findOneAndUpdate(
    { key: "main" },
    { data: safeData, updatedBy: sanitizeText(updatedBy, 180) },
    { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
  ).lean();
  return toPlain(content);
}
