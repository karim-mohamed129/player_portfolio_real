import { defaultContent } from "@/lib/defaultContent";
import { DEFAULT_LOCALE, normalizeLocale } from "@/lib/i18n";

export const defaultEnglishContent = {
  site: {
    title: "Mohamed Hossam | Football Player Portfolio",
    description: "A professional football player portfolio showcasing statistics, career history, achievements, media, and a downloadable PDF CV.",
    faviconUrl: "/favicon.svg",
    logoText: "MH10",
    logoImage: "/logo-mark.svg",
    logoIcon: "football",
    footerText: "© 2026 Mohamed Hossam Portfolio",
    direction: "ltr",
    language: "en"
  },
  nav: [
    { label: "Overview", href: "#overview", hidden: false },
    { label: "Stats", href: "#stats", hidden: false },
    { label: "Career", href: "#career", hidden: false },
    { label: "Media", href: "#media", hidden: false },
    { label: "Contact", href: "#contact", hidden: false },
    { label: "Send Message", href: "#message", hidden: false }
  ],
  hero: {
    tag: "Egyptian Football Player | Cairo",
    name: "Mohamed Hossam",
    position: "Attacking Right Winger",
    summary: "A professional portfolio built for clubs and player agents, presenting technical data, statistics, career highlights, strengths, and sports media in a fast responsive page.",
    primaryButtonText: "Download CV",
    primaryButtonUrl: "/assets/cv/player-cv.pdf",
    secondaryButtonText: "Contact now",
    secondaryButtonUrl: "#contact",
    backgroundImage: "https://images.unsplash.com/photo-1518604666860-9ed391f76460?auto=format&fit=crop&w=1800&q=90",
    playerImage: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1000&q=90",
    statusTitle: "Available for Trials",
    statusSubtitle: "Season 2026",
    quickInfo: [
      { icon: "shirt", label: "Shirt number", value: "10" },
      { icon: "running", label: "Position", value: "RW / ST" },
      { icon: "flag", label: "Nationality", value: "Egyptian" }
    ]
  },
  overview: {
    label: "Player profile",
    title: "A strong professional presentation for clubs and scouts",
    summary: "The page is designed to communicate the player's identity, technical value, and readiness level, with an excellent mobile experience because first reviews by clubs or agents often happen on phones.",
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=900&q=90",
    rows: [
      { label: "Age", value: "23 years" },
      { label: "Height", value: "178 cm" },
      { label: "Weight", value: "73 kg" },
      { label: "Preferred foot", value: "Right" },
      { label: "Status", value: "Ready to sign" }
    ]
  },
  stats: {
    label: "Season numbers",
    title: "Fast, readable performance statistics",
    items: [
      { icon: "calendar", value: "34", label: "Matches" },
      { icon: "target", value: "19", label: "Goals" },
      { icon: "handshake", value: "12", label: "Assists" },
      { icon: "clock", value: "2960", label: "Minutes played" }
    ]
  },
  skills: {
    label: "Strengths",
    title: "A fast transition player with strong final-third impact",
    image: "https://images.unsplash.com/photo-1556056504-5c7696c4c28d?auto=format&fit=crop&w=1000&q=90",
    items: [
      { label: "Speed and acceleration", percent: 93 },
      { label: "1v1 dribbling", percent: 88 },
      { label: "Finishing", percent: 84 },
      { label: "Pressing and ball recovery", percent: 79 }
    ]
  },
  career: {
    label: "Career",
    title: "The player's football journey",
    items: [
      { year: "2018", title: "Youth development stage", description: "Early technical development in a local academy with focus on individual skills and speed.", image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=700&q=90" },
      { year: "2021", title: "First competitive season", description: "Regular team appearances with meaningful goal contributions across several competitions.", image: "https://images.unsplash.com/photo-1486286701208-1d58e9338013?auto=format&fit=crop&w=700&q=90" },
      { year: "2024", title: "Promotion to first team", description: "More playing minutes and appearances in official and friendly matches against stronger levels.", image: "https://images.unsplash.com/photo-1504305754058-2f08ccd89a0a?auto=format&fit=crop&w=700&q=90" },
      { year: "2026", title: "Ready for evaluation", description: "A complete professional file for clubs including CV, statistics, photos, and video material.", image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=700&q=90" }
    ]
  },
  achievements: {
    label: "Achievements",
    title: "Key player achievements",
    items: [
      { icon: "trophy", title: "Player of the Month", description: "Recognized for clear attacking impact and a high contribution rate.", image: "https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?auto=format&fit=crop&w=900&q=90" },
      { icon: "medal", title: "Team top scorer", description: "The highest number of direct goal contributions during the season.", image: "https://images.unsplash.com/photo-1519766304817-4f37bda74a26?auto=format&fit=crop&w=900&q=90" },
      { icon: "star", title: "Strong commitment record", description: "Consistent training attendance and high physical readiness.", image: "https://images.unsplash.com/photo-1510051640316-cee39563ddab?auto=format&fit=crop&w=900&q=90" }
    ]
  },
  media: {
    label: "Media",
    title: "Real photo gallery",
    summary: "A selected media gallery that highlights the player's presence on and off the pitch.",
    items: [
      { image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=1000&q=90", alt: "" },
      { image: "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=1000&q=90", alt: "" },
      { image: "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=1000&q=90", alt: "" }
    ]
  },
  contact: {
    label: "Contact and negotiations",
    title: "Available for technical evaluation, trials, and negotiations",
    summary: "Add the player or agent phone number, official email, and video analysis links here.",
    image: "https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&w=900&q=90",
    email: "agent@example.com",
    phone: "+20 100 000 0000",
    messageLabel: "Direct message",
    messageTitle: "Quick contact form",
    messageSummary: "Write your message clearly and we will get back to you as soon as possible.",
    messageImage: "https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?auto=format&fit=crop&w=900&q=90"
  }
};


function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function isLocalizedText(value) {
  return Boolean(
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    (Object.prototype.hasOwnProperty.call(value, "ar") || Object.prototype.hasOwnProperty.call(value, "en"))
  );
}

function hasText(value) {
  return String(value ?? "").trim() !== "";
}

function resolveLocalizedText(value, locale, fallbackValue = "", defaultArabicValue = "") {
  const lang = normalizeLocale(locale);
  const otherLang = lang === "ar" ? "en" : "ar";

  if (isLocalizedText(value)) {
    if (hasText(value[lang])) return String(value[lang]);
    if (hasText(value[otherLang])) return String(value[otherLang]);
    if (hasText(fallbackValue)) return String(fallbackValue);
    return "";
  }

  if (value === undefined || value === null || value === "") {
    return fallbackValue ?? "";
  }

  if (typeof value === "string" || typeof value === "number") {
    const raw = String(value);
    if (lang === "en" && typeof defaultArabicValue === "string" && raw === defaultArabicValue && hasText(fallbackValue)) {
      return String(fallbackValue);
    }
    return raw;
  }

  return fallbackValue ?? "";
}

function localizeTree(sourceValue, fallbackValue, defaultArabicValue, locale) {
  if (isLocalizedText(sourceValue)) {
    return resolveLocalizedText(sourceValue, locale, fallbackValue, defaultArabicValue);
  }

  if (Array.isArray(sourceValue) || Array.isArray(fallbackValue) || Array.isArray(defaultArabicValue)) {
    const sourceArray = Array.isArray(sourceValue) ? sourceValue : [];
    const fallbackArray = Array.isArray(fallbackValue) ? fallbackValue : [];
    const defaultArray = Array.isArray(defaultArabicValue) ? defaultArabicValue : [];
    const length = Math.max(sourceArray.length, fallbackArray.length, defaultArray.length);

    return Array.from({ length }, (_, index) => localizeTree(
      sourceArray[index],
      fallbackArray[index],
      defaultArray[index],
      locale
    )).filter((item) => item !== undefined && item !== null);
  }

  const sourceIsObject = sourceValue && typeof sourceValue === "object";
  const fallbackIsObject = fallbackValue && typeof fallbackValue === "object";
  const defaultIsObject = defaultArabicValue && typeof defaultArabicValue === "object";

  if (sourceIsObject || fallbackIsObject || defaultIsObject) {
    const keys = new Set([
      ...Object.keys(defaultIsObject ? defaultArabicValue : {}),
      ...Object.keys(fallbackIsObject ? fallbackValue : {}),
      ...Object.keys(sourceIsObject ? sourceValue : {})
    ]);

    const output = {};
    keys.forEach((key) => {
      output[key] = localizeTree(
        sourceIsObject ? sourceValue[key] : undefined,
        fallbackIsObject ? fallbackValue[key] : undefined,
        defaultIsObject ? defaultArabicValue[key] : undefined,
        locale
      );
    });
    return output;
  }

  if (typeof fallbackValue === "string" || typeof fallbackValue === "number" || typeof defaultArabicValue === "string" || typeof defaultArabicValue === "number") {
    return resolveLocalizedText(sourceValue, locale, fallbackValue, defaultArabicValue);
  }

  return sourceValue ?? fallbackValue ?? defaultArabicValue;
}

export function getLocalizedContent(content, locale = DEFAULT_LOCALE) {
  const normalizedLocale = normalizeLocale(locale);
  const source = content || defaultContent;
  const fallback = normalizedLocale === "ar" ? defaultContent : defaultEnglishContent;
  return localizeTree(source, fallback, defaultContent, normalizedLocale);
}
