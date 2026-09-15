import type { Metadata, Viewport } from "next";
import { Amiri, Tajawal } from "next/font/google";
import "./globals.css";

/* Tajawal carries both Arabic and Latin, so the UI keeps one voice in either
   language. Amiri is reserved for display / Qur'anic lines. */
const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700", "800"],
  variable: "--font-tajawal",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-amiri",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "أكاديمية ابن بشير للدراسات العربية والإسلامية | Ibn Basheer Academy",
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

/* Runs before paint so a returning student never sees a light flash
   before their saved theme/language is applied. */
const bootstrapPreferences = `
(function () {
  try {
    var t = localStorage.getItem('ib-theme');
    if (!t) t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', t);

    var l = localStorage.getItem('ib-lang') || 'ar';
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
      lang="ar"
      dir="rtl"
      data-theme="light"
      className={`${tajawal.variable} ${amiri.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootstrapPreferences }} />
      </head>
      <body className="min-h-full flex flex-col bg-paper text-fg font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-3 focus:start-3 focus:rounded-lg focus:bg-brand-700 focus:px-4 focus:py-2 focus:text-white focus:font-bold"
        >
          تخطَّ إلى المحتوى / Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
