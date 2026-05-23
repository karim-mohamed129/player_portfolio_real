import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import "./globals.css";

config.autoAddCss = false;

export const metadata = {
  title: "بورتفوليو لاعب كرة قدم",
  description: "بورتفوليو احترافي للاعب كرة قدم مع صفحة إدارة للمحتوى.",
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
