'use client';

import React from 'react';
import { ACADEMIC_LEVELS, MAJOR_COURSES } from '@/lib/data/academyData';
import { ArrowRight, Clock, Layers, CheckCircle2, Award, BookOpen, GraduationCap, Sparkles } from 'lucide-react';
import type { Lang } from '@/lib/usePreferences';
import { RevealOnScroll } from '@/components/motion/RevealOnScroll';
import { TiltCard } from '@/components/motion/TiltCard';

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
    <section id="levels" className="py-16 sm:py-24 bg-paper relative overflow-hidden">
      {/* Ambient background glow */}
      <div 
        aria-hidden="true" 
        className="absolute top-1/4 start-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-brand-500/5 dark:bg-brand-500/10 rounded-full blur-3xl pointer-events-none" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <RevealOnScroll direction="up" delay={0.05}>
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
        </RevealOnScroll>

        {/* Visual Sequential Progression Stepper with Animated Traveling Beam */}
        <RevealOnScroll direction="up" delay={0.15}>
          <div className="mb-14 p-6 sm:p-8 rounded-3xl bg-surface/95 ring-1 ring-line shadow-sm overflow-x-auto backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-fg-subtle flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-brand-ink" />
                {isAr ? 'خارطة التدرج العلمي في الأكاديمية' : 'Curriculum Progression Pipeline'}
              </h3>
              <span className="text-xs text-brand-ink font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-accent-500 animate-pulse" />
                {isAr ? '٥ محطات منهجية متكاملة' : '5 Sequential Milestones'}
              </span>
            </div>

            {/* Glowing Pipeline Traveling Beam */}
            <div className="relative mb-4 h-1.5 w-full min-w-[650px] bg-line rounded-full overflow-hidden">
              <div 
                aria-hidden="true"
                className="absolute top-0 bottom-0 w-1/3 bg-gradient-to-r from-transparent via-brand-500 to-accent-400 rounded-full animate-beam" 
              />
            </div>

            <div className="min-w-[650px] grid grid-cols-5 gap-3 relative">
              {ACADEMIC_LEVELS.map((lvl) => {
                const isSpecial = lvl.id === 'tejweed-class';

                return (
                  <div
                    key={lvl.id}
                    className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 hover:shadow-md ${
                      isSpecial 
                        ? 'bg-accent-400/10 border-accent-400/40 ring-1 ring-accent-400/30' 
                        : 'bg-surface-2 border-line hover:border-brand-400 hover:bg-surface'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-2">
                        <span className="w-6 h-6 rounded-full bg-brand-ink text-white text-[11px] font-bold flex items-center justify-center group-hover:scale-110 transition-transform">
                          {lvl.stage}
                        </span>
                        <span className="text-[11px] font-bold text-fg-subtle">
                          {isAr ? lvl.durationAr : lvl.durationEn}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-fg leading-tight group-hover:text-brand-ink transition-colors">
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
        </RevealOnScroll>

        {/* Level Cards Grid with 3D Tilt */}
        <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 list-none p-0 m-0">
          {ACADEMIC_LEVELS.map((level, idx) => {
            return (
              <li key={level.id}>
                <RevealOnScroll direction="up" delay={idx * 0.08}>
                  <TiltCard
                    tiltMaxAngle={5}
                    scaleHover={1.015}
                    glow={true}
                    className="h-full rounded-2xl bg-surface ring-1 ring-line hover:ring-brand-ring shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
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
                        <ul className="flex flex-wrap gap-1.5 p-0 list-none">
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
                        className="w-full py-2.5 rounded-xl text-sm font-bold text-brand-ink ring-1 ring-brand-ring bg-brand-tint hover:bg-brand-700 hover:text-white hover:ring-brand-700 transition-all duration-200 flex items-center justify-center gap-2 group-hover:shadow-md cursor-pointer"
                      >
                        <span>
                          {isAr ? 'سجّل في هذا المستوى' : 'Enroll in this Level'}
                        </span>
                        <ArrowRight className="w-4 h-4 rtl:rotate-180 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" aria-hidden="true" />
                      </button>
                    </div>
                  </TiltCard>
                </RevealOnScroll>
              </li>
            );
          })}
        </ol>

      </div>
    </section>
  );
};
