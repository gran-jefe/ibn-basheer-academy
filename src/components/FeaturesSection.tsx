'use client';

import React from 'react';
import { FileCheck2, MonitorPlay, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Lang } from '@/lib/usePreferences';

interface FeaturesSectionProps {
  lang: Lang;
}

const FEATURES: {
  icon: LucideIcon;
  titleAr: string;
  titleEn: string;
  bodyAr: string;
  bodyEn: string;
}[] = [
  {
    icon: FileCheck2,
    titleAr: 'تقييمات واختبارات دورية',
    titleEn: 'Periodic assessments',
    bodyAr: 'اختبارات في نهاية كل شريحة دراسية لمتابعة التحصيل، مع ملاحظات فردية لكل طالب.',
    bodyEn: 'Written and oral evaluations at the end of each unit, with individual feedback for every student.',
  },
  {
    icon: Users,
    titleAr: 'بيئة ناطقة بالعربية',
    titleEn: 'Arabic-speaking community',
    bodyAr: 'حلقات نقاش تفاعلية بالعربية الفصحى تعزّز مهارات التحدث والتواصل بين الطلاب والمعلمين.',
    bodyEn: 'Interactive discussion circles in classical Arabic that build fluency through regular use.',
  },
  {
    icon: MonitorPlay,
    titleAr: 'فصول مباشرة وأرشيف دائم',
    titleEn: 'Live classes & permanent archive',
    bodyAr: 'محاضرات مباشرة عبر Google Meet، مع وصول دائم إلى التسجيلات والمذكرات في أي وقت.',
    bodyEn: 'Live lectures over Google Meet, backed by permanent access to recordings and PDF notes.',
  },
];

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ lang }) => {
  const isAr = lang === 'ar';

  return (
    <section id="features" className="py-16 sm:py-20 bg-paper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <header className="max-w-2xl mb-12">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-ink">
            {isAr ? 'لماذا نحن' : 'Why us'}
          </p>
          <h2 className="mt-3 text-2xl sm:text-4xl font-extrabold tracking-tight text-fg text-balance">
            {isAr
              ? 'لماذا تتعلّم في أكاديمية ابن بشير؟'
              : 'Why study at Ibn Basheer Academy?'}
          </h2>
          <p className="mt-3 text-fg-muted leading-relaxed">
            {isAr
              ? 'تجربة تعليمية تجمع بين الأصالة العلمية ومرونة الأدوات الحديثة.'
              : 'A learning experience that pairs classical scholarship with modern, flexible tooling.'}
          </p>
        </header>

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map((feature) => (
            <li
              key={feature.titleEn}
              className="rounded-2xl bg-surface p-7 ring-1 ring-line shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-700 text-accent-300 flex items-center justify-center mb-5">
                <feature.icon className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-fg mb-2">
                {isAr ? feature.titleAr : feature.titleEn}
              </h3>
              <p className="text-sm text-fg-muted leading-relaxed">
                {isAr ? feature.bodyAr : feature.bodyEn}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
