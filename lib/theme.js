export const SUPPORTED_THEMES = ["dark", "light"];
export const DEFAULT_THEME = "dark";
export const THEME_COOKIE = "preferred-theme";
export const THEME_STORAGE_KEY = "preferred-theme";

export const themeMeta = {
  dark: {
    label: "Dark",
    shortLabel: "Dark",
    htmlValue: "dark"
  },
  light: {
    label: "Light",
    shortLabel: "Light",
    htmlValue: "light"
  }
};

export function normalizeTheme(value) {
  const theme = String(value || "").toLowerCase();
  return SUPPORTED_THEMES.includes(theme) ? theme : DEFAULT_THEME;
}

export function getNextTheme(theme) {
  return normalizeTheme(theme) === "dark" ? "light" : "dark";
}
