'use client';

import React, { useState } from 'react';
import { TESTIMONIALS, type Testimonial } from '@/lib/data/academyData';
import { Star, Quote, CheckCircle, MapPin, Users, GraduationCap, HeartHandshake } from 'lucide-react';
import type { Lang } from '@/lib/usePreferences';

interface TestimonialsSectionProps {
  lang: Lang;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ lang }) => {
  const isAr = lang === 'ar';
  const [filter, setFilter] = useState<'all' | 'parent' | 'student' | 'graduate'>('all');

  const filteredList = filter === 'all' 
    ? TESTIMONIALS 
    : TESTIMONIALS.filter((t) => t.category === filter);

  const filterTabs = [
    { key: 'all', labelAr: 'جميع الآراء', labelEn: 'All Reviews', icon: Star },
    { key: 'parent', labelAr: 'أولياء الأمور', labelEn: 'Parents of Youth', icon: HeartHandshake },
    { key: 'student', labelAr: 'طلاب ومهنيون', labelEn: 'Adult Seekers', icon: Users },
    { key: 'graduate', labelAr: 'الخريجون والمجازون', labelEn: 'Graduates & Ijāzah', icon: GraduationCap },
  ];

  return (
    <section id="testimonials" className="py-20 bg-surface scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-400/15 ring-1 ring-accent-500/30 text-accent-700 dark:text-accent-300 text-xs font-bold tracking-wide uppercase mb-3">
            <Star className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
            <span>{isAr ? 'تجارب طلابنا وأولياء الأمور' : 'Verified Social Proof'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-fg font-display tracking-tight">
            {isAr
              ? 'أصوات موثوقة من مجتمع الأكاديمية'
              : 'What Parents & Students Say About Us'}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-fg-muted leading-relaxed">
            {isAr
              ? 'شهادات حقيقية من أولياء أمور وطلاب علم خاضوا تجربة التلقي المباشر في فصولنا الافتراضية.'
              : 'Read first-hand accounts from parents, working professionals, and graduates enrolled in our circles.'}
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {filterTabs.map((tab) => {
            const isSelected = filter === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setFilter(tab.key as any)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  isSelected
                    ? 'bg-brand-700 text-white shadow-sm'
                    : 'bg-surface-2 text-fg-muted hover:bg-surface-3 hover:text-fg ring-1 ring-line'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{isAr ? tab.labelAr : tab.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {filteredList.map((t) => (
            <div
              key={t.id}
              className="rounded-3xl bg-paper ring-1 ring-line p-6 sm:p-8 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-line-strong transition-all"
            >
              <div className="absolute top-6 end-6 text-brand-ink/10 group-hover:text-brand-ink/20 transition-colors pointer-events-none">
                <Quote className="w-12 h-12" aria-hidden="true" />
              </div>

              <div>
                {/* Highlight Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-surface ring-1 ring-line text-xs font-bold text-brand-ink mb-4">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                  <span>{isAr ? t.highlightAr : t.highlightEn}</span>
                </div>

                {/* Star rating */}
                <div className="flex items-center gap-1 mb-4" aria-label={`Rating: ${t.rating} out of 5 stars`}>
                  {Array.from({ length: t.rating }).map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 text-amber-500 fill-amber-500" aria-hidden="true" />
                  ))}
                </div>

                {/* Quote Body */}
                <p className="text-fg text-sm sm:text-base leading-relaxed mb-6 italic">
                  &ldquo;{isAr ? t.quoteAr : t.quoteEn}&rdquo;
                </p>
              </div>

              {/* Author Footer */}
              <div className="pt-4 border-t border-line flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-fg">
                    {isAr ? t.authorNameAr : t.authorNameEn}
                  </h4>
                  <p className="text-xs text-fg-muted mt-0.5">
                    {isAr ? t.roleAr : t.roleEn}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-fg-subtle shrink-0">
                  <MapPin className="w-3.5 h-3.5 text-brand-ink" aria-hidden="true" />
                  <span>{isAr ? t.countryAr : t.countryEn}</span>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Bottom Callout */}
        <div className="mt-12 text-center">
          <p className="text-xs sm:text-sm text-fg-muted">
            {isAr
              ? 'هل ترغب في الانضمام لأحد هذه المسارات؟ '
              : 'Ready to experience our authentic curriculum? '}
            <a
              href="#admissions"
              className="text-brand-ink underline font-bold hover:opacity-80 transition-opacity"
            >
              {isAr ? 'اطّلع على خطط الرسوم وشروط القبول' : 'View admissions & tuition details'}
            </a>
          </p>
        </div>

      </div>
    </section>
  );
};
