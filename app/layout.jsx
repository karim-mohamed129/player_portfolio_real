import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import "./globals.css";

config.autoAddCss = false;

export const metadata = {
  title: "Football Player Portfolio",
  description: "Dynamic football player portfolio with admin dashboard.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
