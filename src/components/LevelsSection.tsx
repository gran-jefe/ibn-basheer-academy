'use client';

import React from 'react';
import { ACADEMIC_LEVELS, MAJOR_COURSES } from '@/lib/data/academyData';
import { ArrowRight, Clock, Layers, CheckCircle2, Award, BookOpen, GraduationCap } from 'lucide-react';
import type { Lang } from '@/lib/usePreferences';

interface LevelsSectionProps {
  lang: Lang;
  onSelectLevel: (levelId: string) => void;
}

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
    <section id="levels" className="py-16 sm:py-24 bg-paper relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <header className="max-w-3xl mb-12">
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-ink">
            <Layers className="w-4 h-4" aria-hidden="true" />
            {isAr ? 'المسار الدراسي والترقي العلمي' : 'Academic Steps & Progression Roadmap'}
          </p>
          <h2 className="mt-3 text-2xl sm:text-4xl font-extrabold tracking-tight text-fg text-balance">
            {isAr ? 'المستويات الدراسية ومسارات التأهيل' : 'Graded Academic Levels & Tracks'}
          </h2>
          <p className="mt-3 text-fg-muted text-base leading-relaxed">
            {isAr
              ? 'منهج علمي متدرّج ينقل الطالب من التأسيس الأولي وحتى التخصص والرسوخ في العلوم الشرعية واللغة العربية، وفق مسار منهجي منظم.'
              : 'A step-by-step academic journey moving from foundational literacy to analytical jurisprudence and Quranic recitation mastery.'}
          </p>
        </header>

        {/* Visual Sequential Progression Stepper (Top-tier Seminary standard) */}
        <div className="mb-14 p-6 sm:p-8 rounded-3xl bg-surface ring-1 ring-line shadow-sm overflow-x-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-fg-subtle flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-brand-ink" />
              {isAr ? 'خارطة التدرج العلمي في الأكاديمية' : 'Curriculum Progression Pipeline'}
            </h3>
            <span className="text-xs text-brand-ink font-semibold">
              {isAr ? '٥ محطات منهجية' : '5 Sequential Milestones'}
            </span>
          </div>

          <div className="min-w-[650px] grid grid-cols-5 gap-3 relative">
            {ACADEMIC_LEVELS.map((lvl, idx) => {
              const isSpecial = lvl.id === 'tejweed-class';

              return (
                <div
                  key={lvl.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    isSpecial 
                      ? 'bg-accent-50/50 border-accent-300 ring-1 ring-accent-400/30' 
                      : 'bg-surface-2 border-line hover:border-brand-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <span className="w-6 h-6 rounded-full bg-brand-ink text-white text-[11px] font-bold flex items-center justify-center">
                        {lvl.stage}
                      </span>
                      <span className="text-[11px] font-bold text-fg-subtle">
                        {isAr ? lvl.durationAr : lvl.durationEn}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-fg leading-tight">
                      {isAr ? lvl.titleAr : lvl.titleEn}
                    </h4>
                  </div>

                  <div className="mt-3 pt-2 border-t border-line/50 text-[11px] text-fg-muted font-medium">
                    {isAr ? lvl.stageNameAr : lvl.stageNameEn}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Level Cards Grid */}
        <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ACADEMIC_LEVELS.map((level) => {
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
                      className={`tabular px-3 py-1 rounded-full text-[11px] font-extrabold ${level.badgeColor}`}
                    >
                      {isAr ? level.stageNameAr : level.stageNameEn}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-fg-muted">
                      <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                      {isAr ? level.durationAr : level.durationEn}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-fg leading-snug">
                    {isAr ? level.titleAr : level.titleEn}
                  </h3>

                  <p className="mt-2.5 text-sm text-fg-muted leading-relaxed">
                    {isAr ? level.descriptionAr : level.descriptionEn}
                  </p>

                  {/* Prerequisites info */}
                  <div className="mt-4 p-2.5 rounded-xl bg-surface-2 ring-1 ring-line/60 text-xs">
                    <span className="font-bold text-fg-subtle uppercase tracking-wider block text-[10px] mb-0.5">
                      {isAr ? 'المتطلب السابق' : 'Prerequisite'}
                    </span>
                    <span className="text-fg-muted font-medium">
                      {isAr ? level.prerequisiteAr : level.prerequisiteEn}
                    </span>
                  </div>

                  {/* Learning Outcomes */}
                  {level.learningOutcomesEn && (
                    <div className="mt-4 pt-4 border-t border-line">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-fg-subtle mb-2 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-accent-500" />
                        {isAr ? 'مخرجات التعلم المستهدفة' : 'Key Learning Outcomes'}
                      </p>
                      <ul className="space-y-1.5 text-xs text-fg-muted">
                        {(isAr ? level.learningOutcomesAr : level.learningOutcomesEn).map((outcome, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-accent-500 shrink-0" />
                            <span>{outcome}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Featured subjects list */}
                  <div className="mt-5 pt-4 border-t border-line">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-fg-subtle mb-2.5 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-brand-ink" />
                      {isAr ? 'أبرز المواد المشمولة' : 'Featured Core Subjects'}
                    </p>
                    <ul className="flex flex-wrap gap-1.5">
                      {level.featuredCourseIds.map((courseId) => (
                        <li
                          key={courseId}
                          className="px-2.5 py-1 rounded-lg bg-surface-3 text-xs font-medium text-fg-muted"
                        >
                          {courseTitle(courseId, isAr)}
                        </li>
                      ))}
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
                      {isAr ? 'سجّل في هذا المستوى' : 'Enroll in this Level'}
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
