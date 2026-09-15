import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Ibn Basheer Academy for Arabic & Islamic Studies | أكاديمية ابن بشير",
    template: "%s | Ibn Basheer Academy",
  },
  description:
    "Virtual Islamic Institute offering structured online classes in Quran, Tajweed, Arabic Language, Fiqh, Hadith, Mustalah, Sirah, Faraid, and Akhlaq under Ustaz Abu Abdullah Al-Mubaarak.",
  keywords: [
    "Ibn Basheer Academy",
    "Islamic Studies",
    "Tajweed Class",
    "Arabic Language",
    "Quran Studies",
    "Virtual Islamic Institute",
  ],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f6f2" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1614" },
  ],
};

/* Runs before paint so returning students receive their saved preferences
   immediately without flash. Defaults to English ('en') and LTR. */
const bootstrapPreferences = `
(function () {
  try {
    var t = localStorage.getItem('ib-theme');
    if (!t) t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', t);

    var l = localStorage.getItem('ib-lang') || 'en';
    document.documentElement.lang = l;
    document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      dir="ltr"
      data-theme="light"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400;1,700&family=Tajawal:wght@300;400;500;700;800&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: bootstrapPreferences }} />
      </head>
      <body className="min-h-full flex flex-col bg-paper text-fg font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-3 focus:start-3 focus:rounded-lg focus:bg-brand-700 focus:px-4 focus:py-2 focus:text-white focus:font-bold"
        >
          Skip to content / تخطَّ إلى المحتوى
        </a>
        {children}
      </body>
    </html>
  );
}
