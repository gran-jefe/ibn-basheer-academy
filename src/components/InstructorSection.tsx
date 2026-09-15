'use client';

import React from 'react';
import { ACADEMY_INFO } from '@/lib/data/academyData';
import { Award, BookOpen, Mail, MessageCircle } from 'lucide-react';
import type { Lang } from '@/lib/usePreferences';

interface InstructorSectionProps {
  lang: Lang;
}

export const InstructorSection: React.FC<InstructorSectionProps> = ({ lang }) => {
  const isAr = lang === 'ar';
  const instructor = ACADEMY_INFO.leadInstructor;

  const credentials = [
    {
      icon: BookOpen,
      textAr: 'متخصص في علوم التجويد والفقه واللغة',
      textEn: 'Specialist in Tajwīd, Fiqh and Arabic',
    },
    {
      icon: Award,
      textAr: 'خبرة واسعة في إدارة الحلقات العلمية',
      textEn: 'Extensive experience leading virtual study circles',
    },
  ];

  return (
    <section id="instructor" className="py-16 sm:py-20 bg-paper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-surface ring-1 ring-line shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">

            {/* Portrait panel */}
            <div className="lg:col-span-4 bg-brand-900 text-white p-8 sm:p-10 flex flex-col items-center text-center justify-center">
              <div
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-brand-700 text-accent-300 font-display font-bold text-5xl flex items-center justify-center ring-2 ring-accent-500/40"
                aria-hidden="true"
              >
                {isAr ? 'أ' : 'A'}
              </div>
              <h3 className="mt-5 text-xl font-bold">
                {isAr ? instructor.nameAr : instructor.nameEn}
              </h3>
              <p className="mt-1.5 text-xs font-semibold uppercase tracking-wider text-accent-300">
                {isAr ? instructor.roleAr : instructor.roleEn}
              </p>
            </div>

            {/* Detail panel */}
            <div className="lg:col-span-8 p-8 sm:p-10 space-y-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-brand-ink">
                  {isAr ? 'الإشراف العلمي' : 'Academic leadership'}
                </p>
                <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-fg text-balance">
                  {isAr
                    ? 'القيادة والإشراف العلمي'
                    : 'Lead instructor & academy director'}
                </h2>
              </div>

              <p className="text-fg-muted leading-relaxed">
                {isAr ? instructor.bioAr : instructor.bioEn}
              </p>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {credentials.map((item) => (
                  <li
                    key={item.textEn}
                    className="flex items-center gap-3 rounded-xl bg-surface-2 ring-1 ring-line px-4 py-3"
                  >
                    <item.icon className="w-5 h-5 shrink-0 text-brand-ink" aria-hidden="true" />
                    <span className="text-sm font-medium text-fg">
                      {isAr ? item.textAr : item.textEn}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="pt-5 border-t border-line flex flex-wrap items-center gap-3">
                <a
                  href={ACADEMY_INFO.contact.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm transition-colors flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" aria-hidden="true" />
                  <span>{isAr ? 'تواصل عبر واتساب' : 'Message on WhatsApp'}</span>
                </a>

                <a
                  href={`mailto:${ACADEMY_INFO.contact.email}`}
                  className="px-5 py-2.5 rounded-xl text-brand-ink ring-1 ring-brand-ring hover:bg-brand-tint font-semibold text-sm transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" aria-hidden="true" />
                  <span className="truncate">{ACADEMY_INFO.contact.email}</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
