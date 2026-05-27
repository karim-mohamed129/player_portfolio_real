import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import { cookies } from "next/headers";
import LanguageProvider from "@/components/i18n/LanguageProvider";
import ThemeProvider from "@/components/theme/ThemeProvider";
import { LANGUAGE_COOKIE, getDirection, getHtmlLang, normalizeLocale } from "@/lib/i18n";
import { THEME_COOKIE, normalizeTheme } from "@/lib/theme";
import "./globals.css";

config.autoAddCss = false;

export const metadata = {
  title: "Football Player Portfolio",
  description: "A professional football player portfolio with an admin dashboard for content management.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg"
  }
};

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const locale = normalizeLocale(cookieStore.get(LANGUAGE_COOKIE)?.value);
  const direction = getDirection(locale);
  const theme = normalizeTheme(cookieStore.get(THEME_COOKIE)?.value);

  return (
    <html lang={getHtmlLang(locale)} dir={direction} data-theme={theme} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider initialTheme={theme}>
          <LanguageProvider initialLocale={locale}>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
