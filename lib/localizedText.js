export const CONTENT_LOCALES = ["ar", "en"];
export const DEFAULT_TEXT_LOCALE = "en";

export function isLocalizedText(value) {
  return Boolean(
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    (Object.prototype.hasOwnProperty.call(value, "ar") || Object.prototype.hasOwnProperty.call(value, "en"))
  );
}

export function normalizeTextLocale(locale) {
  const value = String(locale || DEFAULT_TEXT_LOCALE).toLowerCase().split("-")[0];
  return CONTENT_LOCALES.includes(value) ? value : DEFAULT_TEXT_LOCALE;
}

export function getLocalizedText(value, locale = DEFAULT_TEXT_LOCALE, fallback = "") {
  const lang = normalizeTextLocale(locale);
  const otherLang = lang === "ar" ? "en" : "ar";

  if (isLocalizedText(value)) {
    const selected = String(value[lang] ?? "").trim();
    if (selected) return selected;

    const other = String(value[otherLang] ?? "").trim();
    if (other) return other;

    return getLocalizedText(fallback, locale, "");
  }

  if (value === undefined || value === null) return getLocalizedText(fallback, locale, "");
  if (typeof value === "string" || typeof value === "number") return String(value);

  return getLocalizedText(fallback, locale, "");
}

export function getLocalizedInputValue(value, locale) {
  const lang = normalizeTextLocale(locale);
  if (isLocalizedText(value)) return String(value[lang] ?? "");
  return lang === "ar" ? String(value ?? "") : "";
}

export function setLocalizedInputValue(currentValue, locale, nextValue) {
  const lang = normalizeTextLocale(locale);
  const base = isLocalizedText(currentValue)
    ? { ar: String(currentValue.ar ?? ""), en: String(currentValue.en ?? "") }
    : { ar: String(currentValue ?? ""), en: "" };

  base[lang] = nextValue;
  return base;
}

export function makeLocalizedText(ar = "", en = "") {
  return { ar: String(ar ?? ""), en: String(en ?? "") };
}
