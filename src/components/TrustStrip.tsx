'use client';

import React from 'react';
import { Award, Users, BookMarked, Video, ShieldCheck } from 'lucide-react';
import type { Lang } from '@/lib/usePreferences';
import { AnimatedCounter } from '@/components/motion/AnimatedCounter';
import { RevealOnScroll } from '@/components/motion/RevealOnScroll';

interface TrustStripProps {
  lang: Lang;
}

export const TrustStrip: React.FC<TrustStripProps> = ({ lang }) => {
  const isAr = lang === 'ar';

  const stats = [
    {
      icon: Users,
      numericValue: 450,
      suffix: '+',
      prefix: '',
      labelAr: 'طالب وطالبة مسجلين',
      labelEn: 'Enrolled Active Students',
      subAr: 'من ١٢ دولة حول العالم',
      subEn: 'Across 12+ Countries',
    },
    {
      icon: BookMarked,
      numericValue: 10,
      suffix: '+',
      prefix: '',
      labelAr: 'متون أصيلة مسندة',
      labelEn: 'Classical Texts Taught',
      subAr: 'تلقٍ متصل وإجازات معتمدة',
      subEn: 'Authentic Isnād & Licensure',
    },
    {
      icon: Award,
      numericValue: 12,
      suffix: '',
      prefix: '1 : ',
      labelAr: 'نسبة الحلقة النموذجية',
      labelEn: 'Max Halaqah Ratio',
      subAr: 'تسميع فردي ومتابعة دقيقة',
      subEn: 'Personal 1-on-1 recitation',
    },
    {
      icon: Video,
      numericValue: 100,
      suffix: '%',
      prefix: '',
      labelAr: 'فصول حية وتفاعلية',
      labelEn: 'Direct Live Instruction',
      subAr: 'تسجيلات دائمة وأرشيف مرئي',
      subEn: 'With 24/7 video archives',
    },
  ];

  return (
    <RevealOnScroll direction="up" delay={0.1} distance={20}>
      <section 
        aria-label={isAr ? 'إحصائيات ومؤشرات الأكاديمية' : 'Academy Credibility Metrics'}
        className="relative z-10 -mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="rounded-2xl bg-surface/95 backdrop-blur-md ring-1 ring-line shadow-2xl p-5 sm:p-6 lg:p-8 hover:shadow-brand-500/5 transition-all duration-300">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-y lg:divide-y-0 lg:divide-x lg:rtl:divide-x-reverse divide-line">
            {stats.map((stat, idx) => (
              <div 
                key={stat.labelEn}
                className={`flex items-center gap-4 group transition-transform duration-200 hover:-translate-y-0.5 ${idx > 1 ? 'pt-4 lg:pt-0' : ''} ${idx % 2 === 1 ? 'ps-2 lg:ps-6' : 'lg:ps-6 first:ps-0'}`}
              >
                <div className="w-12 h-12 rounded-xl bg-brand-tint text-brand-ink flex items-center justify-center shrink-0 ring-1 ring-brand-ring group-hover:scale-105 group-hover:bg-brand-ink group-hover:text-white transition-all duration-300">
                  <stat.icon className="w-6 h-6" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-fg">
                      <AnimatedCounter
                        to={stat.numericValue}
                        prefix={stat.prefix}
                        suffix={stat.suffix}
                        duration={1.8}
                      />
                    </span>
                    <ShieldCheck className="w-4 h-4 text-accent-600 dark:text-accent-400 shrink-0" aria-hidden="true" />
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-fg truncate">
                    {isAr ? stat.labelAr : stat.labelEn}
                  </p>
                  <p className="text-[11px] sm:text-xs text-fg-muted truncate">
                    {isAr ? stat.subAr : stat.subEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </RevealOnScroll>
  );
};
