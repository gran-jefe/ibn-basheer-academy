'use client';

import React from 'react';
import { ACADEMY_INFO } from '@/lib/data/academyData';
import { ArrowUp, BookOpen, Mail, MessageCircle } from 'lucide-react';
import type { Lang } from '@/lib/usePreferences';

interface FooterProps {
  lang: Lang;
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  const isAr = lang === 'ar';

  const sections = [
    { href: '#levels', labelAr: 'المستويات الدراسية', labelEn: 'Academic levels' },
    { href: '#courses', labelAr: 'المواد الرئيسية', labelEn: 'Core subjects' },
    { href: '#features', labelAr: 'مميزات الأكاديمية', labelEn: 'Why study here' },
    { href: '#instructor', labelAr: 'المدرس الرئيسي', labelEn: 'Lead instructor' },
  ];

  return (
    <footer className="bg-brand-950 text-brand-100 mt-auto">
      <div className="h-px rule-brass" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent-400 text-brand-950 flex items-center justify-center">
                <BookOpen className="w-5 h-5" aria-hidden="true" />
              </div>
              <p className="font-bold text-white leading-tight">
                {isAr ? 'أكاديمية ابن بشير' : 'Ibn Basheer Academy'}
              </p>
            </div>

            <p className="text-sm leading-relaxed max-w-sm">
              {isAr
                ? 'أكاديمية إسلامية افتراضية تهدف إلى نشر العلوم الشرعية واللغة العربية وفق منهج علمي متدرّج.'
                : 'A virtual Islamic institute teaching the Islamic sciences and Arabic through a graded, structured curriculum.'}
            </p>

            <p className="font-display text-accent-300">
              {isAr ? ACADEMY_INFO.taglineAr : ACADEMY_INFO.taglineEn}
            </p>
          </div>

          <nav aria-label={isAr ? 'روابط الموقع' : 'Site links'} className="md:col-span-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-accent-300 mb-4">
              {isAr ? 'تصفّح' : 'Explore'}
            </h2>
            <ul className="space-y-2.5 text-sm">
              {sections.map((s) => (
                <li key={s.href}>
                  <a href={s.href} className="hover:text-white transition-colors">
                    {isAr ? s.labelAr : s.labelEn}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-accent-300 mb-4">
              {isAr ? 'للتواصل والقبول' : 'Admissions & contact'}
            </h2>

            <div className="space-y-3">
              <a
                href={ACADEMY_INFO.contact.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-600 text-white font-bold text-sm transition-colors"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                <span className="tabular" dir="ltr">{ACADEMY_INFO.contact.whatsappNumber}</span>
              </a>

              <a
                href={`mailto:${ACADEMY_INFO.contact.email}`}
                className="flex items-center gap-2 text-sm hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 shrink-0 text-accent-400" aria-hidden="true" />
                <span className="truncate">{ACADEMY_INFO.contact.email}</span>
              </a>
            </div>
          </div>

        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-200">
          <p className="tabular text-center sm:text-start">
            © {new Date().getFullYear()}{' '}
            {isAr ? ACADEMY_INFO.nameAr : ACADEMY_INFO.nameEn}
          </p>

          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="p-2.5 rounded-xl ring-1 ring-white/15 hover:bg-white/10 transition-colors"
            aria-label={isAr ? 'العودة إلى الأعلى' : 'Back to top'}
          >
            <ArrowUp className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
};
