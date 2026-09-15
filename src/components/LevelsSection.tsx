'use client';

import React from 'react';
import { ACADEMIC_LEVELS, MAJOR_COURSES } from '@/lib/data/academyData';
import { ArrowRight, Clock, Layers } from 'lucide-react';
import type { Lang } from '@/lib/usePreferences';

interface LevelsSectionProps {
  lang: Lang;
  onSelectLevel: (levelId: string) => void;
}

/** Resolve featured course ids to real titles — the cards used to print raw
 *  slugs like "quran" / "tejweed-class" to students. */
const courseTitle = (id: string, isAr: boolean) => {
  const course = MAJOR_COURSES.find((c) => c.id === id);
  if (!course) return id.replace(/-/g, ' ');
  return isAr ? course.titleAr : course.titleEn;
};

export const LevelsSection: React.FC<LevelsSectionProps> = ({
  lang,
  onSelectLevel,
}) => {
  const isAr = lang === 'ar';

  return (
    <section id="levels" className="py-16 sm:py-20 bg-paper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <header className="max-w-2xl mb-12">
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-ink">
            <Layers className="w-4 h-4" aria-hidden="true" />
            {isAr ? 'المسار الدراسي' : 'Academic pathway'}
          </p>
          <h2 className="mt-3 text-2xl sm:text-4xl font-extrabold tracking-tight text-fg text-balance">
            {isAr ? 'المستويات الدراسية في الأكاديمية' : 'Levels and program tracks'}
          </h2>
          <p className="mt-3 text-fg-muted leading-relaxed">
            {isAr
              ? 'مسار متدرّج يبدأ من التأسيس وينتهي بالتخصص. اختر المستوى الذي يناسبك، أو تواصل معنا لتحديد مستواك.'
              : 'A graded pathway running from foundations through to specialisation. Pick the level that fits, or contact us for placement.'}
          </p>
        </header>

        <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ACADEMIC_LEVELS.map((level, index) => {
            const isTrack = level.id === 'tejweed-class';

            return (
              <li
                key={level.id}
                className="group flex flex-col rounded-2xl bg-surface ring-1 ring-line hover:ring-brand-ring shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden"
              >
                <div className="p-6 flex-1 flex flex-col">
                  {/* Step marker + duration */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span
                      className={`tabular px-2.5 py-1 rounded-full text-[11px] font-extrabold ${level.badgeColor}`}
                    >
                      {isTrack
                        ? (isAr ? 'مسار متخصص' : 'Specialised track')
                        : (isAr ? `المستوى ${index + 1}` : `Level ${index + 1}`)}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-fg-muted">
                      <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                      {isAr ? level.durationAr : level.durationEn}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-fg leading-snug">
                    {isAr ? level.titleAr : level.titleEn}
                  </h3>

                  <p className="mt-3 text-sm text-fg-muted leading-relaxed clamp-3">
                    {isAr ? level.descriptionAr : level.descriptionEn}
                  </p>

                  <div className="mt-5 pt-5 border-t border-line">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-fg-subtle mb-2.5">
                      {isAr ? 'أبرز المواد' : 'Featured subjects'}
                    </p>
                    <ul className="flex flex-wrap gap-1.5">
                      {level.featuredCourseIds.slice(0, 4).map((courseId) => (
                        <li
                          key={courseId}
                          className="px-2.5 py-1 rounded-lg bg-surface-3 text-xs font-medium text-fg-muted"
                        >
                          {courseTitle(courseId, isAr)}
                        </li>
                      ))}
                      {level.featuredCourseIds.length > 4 && (
                        <li className="tabular px-2.5 py-1 rounded-lg bg-surface-3 text-xs font-medium text-fg-subtle" dir="ltr">
                          +{level.featuredCourseIds.length - 4}
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="px-6 pb-6">
                  <button
                    type="button"
                    onClick={() => onSelectLevel(level.id)}
                    className="w-full py-2.5 rounded-xl text-sm font-bold text-brand-ink ring-1 ring-brand-ring bg-brand-tint hover:bg-brand-700 hover:text-white hover:ring-brand-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <span>
                      {isAr ? 'سجّل في هذا المستوى' : 'Enroll in this level'}
                    </span>
                    <ArrowRight className="w-4 h-4 rtl:rotate-180" aria-hidden="true" />
                  </button>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
};
