import { connectDB } from "@/lib/db";
import Content from "@/models/Content";
import { defaultContent } from "@/lib/defaultContent";
import { defaultEnglishContent } from "@/lib/i18nContent";
import { isSafeCloudinaryPdfUrl, sanitizeText, sanitizeUrl } from "@/lib/security";

function toPlain(doc) {
  return JSON.parse(JSON.stringify(doc));
}

function sanitizePercent(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.min(Math.max(Math.round(number), 0), 100);
}


function isLocalizedText(value) {
  return Boolean(
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    (Object.prototype.hasOwnProperty.call(value, "ar") || Object.prototype.hasOwnProperty.call(value, "en"))
  );
}

function sanitizeLocalizedText(value, maxLength = 500, fallbackAr = "", fallbackEn = "") {
  const fallbackArabic = sanitizeText(fallbackAr, maxLength);
  const fallbackEnglish = sanitizeText(fallbackEn, maxLength);

  if (isLocalizedText(value)) {
    const ar = sanitizeText(value.ar, maxLength);
    const en = sanitizeText(value.en, maxLength) || (ar && ar === fallbackArabic ? fallbackEnglish : "");
    return { ar, en };
  }

  const ar = sanitizeText(value, maxLength);
  const en = ar && ar === fallbackArabic ? fallbackEnglish : "";
  return { ar, en };
}

function sanitizePlainText(value, maxLength = 500) {
  return sanitizeText(value, maxLength);
}

function sanitizeLocalizedItem(item = {}, fallbackItem = {}, fallbackEnItem = {}, maxLength = 500, fields = []) {
  const output = {};
  for (const field of fields) {
    output[field] = sanitizeLocalizedText(item?.[field], maxLength, fallbackItem?.[field] || "", fallbackEnItem?.[field] || "");
  }
  return output;
}

function sanitizeItemArray(items, sanitizeOne, maxItems = 30) {
  if (!Array.isArray(items)) return [];
  return items.slice(0, maxItems).map((item, index) => sanitizeOne(item || {}, index));
}

function fallbackAt(array, index) {
  return Array.isArray(array) ? array[index] || array[0] || {} : {};
}

export function sanitizeContentForStorage(input = {}) {
  const source = typeof input === "object" && input ? input : {};
  const safe = toPlain(defaultContent);

  if (source.site) {
    safe.site = {
      ...safe.site,
      title: sanitizeLocalizedText(source.site.title, 180, defaultContent.site.title, defaultEnglishContent.site.title),
      description: sanitizeLocalizedText(source.site.description, 300, defaultContent.site.description, defaultEnglishContent.site.description),
      faviconUrl: sanitizeUrl(source.site.faviconUrl, defaultContent.site.faviconUrl || ""),
      logoText: sanitizeLocalizedText(source.site.logoText, 40, defaultContent.site.logoText, defaultEnglishContent.site.logoText),
      logoImage: sanitizeUrl(source.site.logoImage, defaultContent.site.logoImage || ""),
      logoIcon: sanitizePlainText(source.site.logoIcon, 40) || safe.site.logoIcon,
      footerText: sanitizeLocalizedText(source.site.footerText, 200, defaultContent.site.footerText, defaultEnglishContent.site.footerText),
      direction: ["rtl", "ltr"].includes(source.site.direction) ? source.site.direction : safe.site.direction,
      language: sanitizePlainText(source.site.language, 10) || safe.site.language
    };
  }

  if (Array.isArray(source.nav)) {
    safe.nav = source.nav.slice(0, 12).map((item, index) => ({
      label: sanitizeLocalizedText(item?.label, 80, defaultContent.nav?.[index]?.label || "", defaultEnglishContent.nav?.[index]?.label || ""),
      href: defaultContent.nav?.[index]?.href || item?.href || "#",
      hidden: Boolean(item?.hidden)
    }));
  }

  if (source.hero) {
    safe.hero = {
      ...safe.hero,
      tag: sanitizeLocalizedText(source.hero.tag, 140, defaultContent.hero.tag, defaultEnglishContent.hero.tag),
      name: sanitizeLocalizedText(source.hero.name, 100, defaultContent.hero.name, defaultEnglishContent.hero.name),
      position: sanitizeLocalizedText(source.hero.position, 140, defaultContent.hero.position, defaultEnglishContent.hero.position),
      summary: sanitizeLocalizedText(source.hero.summary, 900, defaultContent.hero.summary, defaultEnglishContent.hero.summary),
      primaryButtonText: sanitizeLocalizedText(source.hero.primaryButtonText, 80, defaultContent.hero.primaryButtonText, defaultEnglishContent.hero.primaryButtonText),
      primaryButtonUrl: isSafeCloudinaryPdfUrl(source.hero.primaryButtonUrl) ? sanitizeUrl(source.hero.primaryButtonUrl, "") : "",
      secondaryButtonText: sanitizeLocalizedText(source.hero.secondaryButtonText, 80, defaultContent.hero.secondaryButtonText, defaultEnglishContent.hero.secondaryButtonText),
      secondaryButtonUrl: sanitizeUrl(source.hero.secondaryButtonUrl, defaultContent.hero.secondaryButtonUrl || "#contact"),
      backgroundImage: sanitizeUrl(source.hero.backgroundImage, ""),
      playerImage: sanitizeUrl(source.hero.playerImage, ""),
      statusTitle: sanitizeLocalizedText(source.hero.statusTitle, 80, defaultContent.hero.statusTitle, defaultEnglishContent.hero.statusTitle),
      statusSubtitle: sanitizeLocalizedText(source.hero.statusSubtitle, 80, defaultContent.hero.statusSubtitle, defaultEnglishContent.hero.statusSubtitle),
      quickInfo: sanitizeItemArray(source.hero.quickInfo, (item, index) => {
        const fallback = fallbackAt(defaultContent.hero.quickInfo, index);
        const fallbackEn = fallbackAt(defaultEnglishContent.hero.quickInfo, index);
        return {
          icon: sanitizePlainText(item.icon, 40) || fallback.icon || "football",
          ...sanitizeLocalizedItem(item, fallback, fallbackEn, 120, ["label", "value"])
        };
      }, 12)
    };
  }

  if (source.overview) {
    safe.overview = {
      ...safe.overview,
      label: sanitizeLocalizedText(source.overview.label, 80, defaultContent.overview.label, defaultEnglishContent.overview.label),
      title: sanitizeLocalizedText(source.overview.title, 220, defaultContent.overview.title, defaultEnglishContent.overview.title),
      summary: sanitizeLocalizedText(source.overview.summary, 900, defaultContent.overview.summary, defaultEnglishContent.overview.summary),
      image: sanitizeUrl(source.overview.image, ""),
      rows: sanitizeItemArray(source.overview.rows, (item, index) => {
        const fallback = fallbackAt(defaultContent.overview.rows, index);
        const fallbackEn = fallbackAt(defaultEnglishContent.overview.rows, index);
        return sanitizeLocalizedItem(item, fallback, fallbackEn, 120, ["label", "value"]);
      }, 20)
    };
  }

  if (source.stats) {
    safe.stats = {
      ...safe.stats,
      label: sanitizeLocalizedText(source.stats.label, 80, defaultContent.stats.label, defaultEnglishContent.stats.label),
      title: sanitizeLocalizedText(source.stats.title, 220, defaultContent.stats.title, defaultEnglishContent.stats.title),
      items: sanitizeItemArray(source.stats.items, (item, index) => {
        const fallback = fallbackAt(defaultContent.stats.items, index);
        const fallbackEn = fallbackAt(defaultEnglishContent.stats.items, index);
        return {
          icon: sanitizePlainText(item.icon, 40) || fallback.icon || "chart",
          value: sanitizePlainText(item.value, 40),
          ...sanitizeLocalizedItem(item, fallback, fallbackEn, 120, ["label"])
        };
      }, 20)
    };
  }

  if (source.skills) {
    safe.skills = {
      ...safe.skills,
      label: sanitizeLocalizedText(source.skills.label, 80, defaultContent.skills.label, defaultEnglishContent.skills.label),
      title: sanitizeLocalizedText(source.skills.title, 220, defaultContent.skills.title, defaultEnglishContent.skills.title),
      image: sanitizeUrl(source.skills.image, ""),
      items: sanitizeItemArray(source.skills.items, (item, index) => {
        const fallback = fallbackAt(defaultContent.skills.items, index);
        const fallbackEn = fallbackAt(defaultEnglishContent.skills.items, index);
        return {
          ...sanitizeLocalizedItem(item, fallback, fallbackEn, 120, ["label"]),
          percent: sanitizePercent(item.percent)
        };
      }, 20)
    };
  }

  if (source.career) {
    safe.career = {
      ...safe.career,
      label: sanitizeLocalizedText(source.career.label, 80, defaultContent.career.label, defaultEnglishContent.career.label),
      title: sanitizeLocalizedText(source.career.title, 220, defaultContent.career.title, defaultEnglishContent.career.title),
      items: sanitizeItemArray(source.career.items, (item, index) => {
        const fallback = fallbackAt(defaultContent.career.items, index);
        const fallbackEn = fallbackAt(defaultEnglishContent.career.items, index);
        return {
          year: sanitizePlainText(item.year, 30),
          ...sanitizeLocalizedItem(item, fallback, fallbackEn, 600, ["title", "description"]),
          image: sanitizeUrl(item.image, "")
        };
      }, 30)
    };
  }

  if (source.achievements) {
    safe.achievements = {
      ...safe.achievements,
      label: sanitizeLocalizedText(source.achievements.label, 80, defaultContent.achievements.label, defaultEnglishContent.achievements.label),
      title: sanitizeLocalizedText(source.achievements.title, 220, defaultContent.achievements.title, defaultEnglishContent.achievements.title),
      items: sanitizeItemArray(source.achievements.items, (item, index) => {
        const fallback = fallbackAt(defaultContent.achievements.items, index);
        const fallbackEn = fallbackAt(defaultEnglishContent.achievements.items, index);
        return {
          icon: sanitizePlainText(item.icon, 40) || fallback.icon || "trophy",
          ...sanitizeLocalizedItem(item, fallback, fallbackEn, 600, ["title", "description"]),
          image: sanitizeUrl(item.image, "")
        };
      }, 30)
    };
  }

  if (source.media) {
    safe.media = {
      ...safe.media,
      label: sanitizeLocalizedText(source.media.label, 80, defaultContent.media.label, defaultEnglishContent.media.label),
      title: sanitizeLocalizedText(source.media.title, 220, defaultContent.media.title, defaultEnglishContent.media.title),
      summary: sanitizeLocalizedText(source.media.summary, 600, defaultContent.media.summary, defaultEnglishContent.media.summary),
      items: sanitizeItemArray(source.media.items, (item, index) => {
        const fallback = fallbackAt(defaultContent.media.items, index);
        const fallbackEn = fallbackAt(defaultEnglishContent.media.items, index);
        return {
          image: sanitizeUrl(item.image, ""),
          alt: sanitizeLocalizedText(item.alt, 180, fallback.alt, fallbackEn.alt)
        };
      }, 50)
    };
  }

  if (source.contact) {
    safe.contact = {
      ...safe.contact,
      label: sanitizeLocalizedText(source.contact.label, 80, defaultContent.contact.label, defaultEnglishContent.contact.label),
      title: sanitizeLocalizedText(source.contact.title, 220, defaultContent.contact.title, defaultEnglishContent.contact.title),
      summary: sanitizeLocalizedText(source.contact.summary, 700, defaultContent.contact.summary, defaultEnglishContent.contact.summary),
      image: sanitizeUrl(source.contact.image, ""),
      email: sanitizePlainText(source.contact.email, 120),
      phone: sanitizePlainText(source.contact.phone, 40),
      messageLabel: sanitizeLocalizedText(source.contact.messageLabel, 80, defaultContent.contact.messageLabel, defaultEnglishContent.contact.messageLabel),
      messageTitle: sanitizeLocalizedText(source.contact.messageTitle, 220, defaultContent.contact.messageTitle, defaultEnglishContent.contact.messageTitle),
      messageSummary: sanitizeLocalizedText(source.contact.messageSummary, 700, defaultContent.contact.messageSummary, defaultEnglishContent.contact.messageSummary),
      messageImage: sanitizeUrl(source.contact.messageImage, "")
    };
  }

  return safe;
}

export async function getContentDocument({ createIfMissing = true } = {}) {
  await connectDB();
  let content = await Content.findOne({ key: "main" }).lean();

  if (!content && createIfMissing) {
    content = await Content.create({ key: "main", data: sanitizeContentForStorage(defaultContent), updatedBy: "seed" });
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
