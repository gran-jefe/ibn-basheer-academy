'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MAJOR_COURSES } from '@/lib/data/academyData';
import {
  BookOpen, Calculator, Check, CheckCheck, Compass, Heart, History,
  Languages, Mic, Scale, ScrollText, User, BookmarkCheck, Sparkles
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Lang } from '@/lib/usePreferences';
import type { Course } from '@/lib/data/academyData';
import { RevealOnScroll } from '@/components/motion/RevealOnScroll';
import { TiltCard } from '@/components/motion/TiltCard';

interface CoursesSectionProps {
  lang: Lang;
  onSelectCourse: (courseId: string) => void;
  onViewDetails: (course: Course) => void;
}

const ICONS: Record<string, LucideIcon> = {
  BookOpen, Mic, Languages, Compass, Scale, ScrollText,
  CheckCheck, History, Calculator, Heart,
};

const FILTERS = [
  { id: 'all', labelAr: 'جميع المواد', labelEn: 'All Subjects' },
  { id: 'tamheediy', labelAr: 'التمهيدي', labelEn: 'Preparatory' },
  { id: 'ibtidaiyya', labelAr: 'الابتدائية', labelEn: 'Primary' },
  { id: 'idadiyya', labelAr: 'الإعدادية', labelEn: 'Junior Sec.' },
  { id: 'thanawiyya', labelAr: 'الثانوية', labelEn: 'Senior Sec.' },
  { id: 'tejweed-class', labelAr: 'دورة التجويد', labelEn: 'Tejweed Track' },
];

export const CoursesSection: React.FC<CoursesSectionProps> = ({
  lang,
  onSelectCourse,
  onViewDetails,
}) => {
  const isAr = lang === 'ar';
  const [filter, setFilter] = useState('all');

  const courses =
    filter === 'all'
      ? MAJOR_COURSES
      : MAJOR_COURSES.filter((c) => c.levelIds.includes(filter));

  return (
    <section id="courses" className="py-16 sm:py-24 bg-motif-soft border-y border-line relative overflow-hidden">
      {/* Subtle radial ambient highlight */}
      <div 
        aria-hidden="true" 
        className="absolute bottom-0 end-0 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl pointer-events-none" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <RevealOnScroll direction="up" delay={0.05}>
          <header className="max-w-3xl mb-12">
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-ink">
              <BookOpen className="w-4 h-4" aria-hidden="true" />
              {isAr ? 'المنهج الدراسي والمتون المعتمدة' : 'Curriculum & Classical Texts'}
            </p>
            <h2 className="mt-3 text-2xl sm:text-4xl font-extrabold tracking-tight text-fg text-balance">
              {isAr ? 'المواد العشر الرئيسية' : 'The 10 Core Academic Subjects'}
            </h2>
            <p className="mt-3 text-fg-muted text-base leading-relaxed">
              {isAr
                ? 'منهج علمي رصين مبني على تدريس أمهات المتون الإسلامية واللغوية، مع شروحات تأصيلية وتطبيقات عملية واختبارات دورية.'
                : 'A rigorous seminary curriculum anchored in authoritative classical texts (Mutūn), detailed commentary, practical exercises, and periodic assessments.'}
            </p>
          </header>
        </RevealOnScroll>

        {/* Level Filters with animated indicator */}
        <RevealOnScroll direction="up" delay={0.1}>
          <div
            role="group"
            aria-label={isAr ? 'تصفية المواد حسب المستوى' : 'Filter subjects by level'}
            className="flex flex-wrap gap-2 mb-10"
          >
            {FILTERS.map((tab) => {
              const active = filter === tab.id;
              const count =
                tab.id === 'all'
                  ? MAJOR_COURSES.length
                  : MAJOR_COURSES.filter((c) => c.levelIds.includes(tab.id)).length;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilter(tab.id)}
                  aria-pressed={active}
                  className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                    active
                      ? 'bg-brand-700 text-white shadow-md shadow-brand-900/10'
                      : 'bg-surface text-fg-muted ring-1 ring-line hover:text-fg hover:ring-brand-ring hover:bg-surface-2'
                  }`}
                >
                  <span>{isAr ? tab.labelAr : tab.labelEn}</span>
                  <span
                    className={`tabular text-[11px] font-bold px-1.5 py-0.5 rounded-full ${
                      active ? 'bg-brand-800/80 text-brand-100' : 'bg-surface-3 text-fg-subtle'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </RevealOnScroll>

        {/* Courses Grid with Framer Motion AnimatePresence */}
        <motion.ul 
          layout 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 list-none p-0 m-0"
        >
          <AnimatePresence mode="popLayout">
            {courses.map((course) => {
              const Icon = ICONS[course.iconName] ?? BookOpen;

              return (
                <motion.li
                  key={course.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full"
                >
                  <TiltCard
                    tiltMaxAngle={4}
                    scaleHover={1.015}
                    glow={true}
                    className="h-full rounded-3xl bg-surface p-6 sm:p-7 ring-1 ring-line hover:ring-brand-ring shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Top Bar: Icon + Number */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-brand-tint text-brand-ink ring-1 ring-brand-ring flex items-center justify-center group-hover:bg-brand-700 group-hover:text-white group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
                          <Icon className="w-6 h-6" aria-hidden="true" />
                        </div>
                        <span className="tabular text-xs font-black text-fg-subtle bg-surface-2 px-2.5 py-1 rounded-full ring-1 ring-line">
                          #{String(course.number).padStart(2, '0')}
                        </span>
                      </div>

                      {/* Course Titles */}
                      <h3 className="text-xl font-bold text-fg leading-snug group-hover:text-brand-ink transition-colors">
                        {isAr ? course.titleAr : course.titleEn}
                      </h3>
                      <p className="text-xs font-semibold text-brand-ink mt-0.5">
                        {isAr ? course.titleEn : course.titleAr}
                      </p>

                      {/* Classical Text (Matn) Badge */}
                      {course.primaryTextEn && (
                        <div className="mt-3.5 p-3 rounded-2xl bg-accent-400/10 border border-accent-400/25 text-xs">
                          <div className="flex items-center gap-1.5 text-accent-700 dark:text-accent-300 font-bold uppercase tracking-wider text-[10px] mb-1">
                            <BookmarkCheck className="w-3.5 h-3.5" />
                            <span>{isAr ? 'المتن المعتمد للدراسة' : 'Authoritative Classical Text'}</span>
                          </div>
                          <p className="font-semibold text-fg text-xs">
                            {isAr ? course.primaryTextAr : course.primaryTextEn}
                          </p>
                        </div>
                      )}

                      {/* Course Description */}
                      <p className="mt-3.5 text-sm text-fg-muted leading-relaxed">
                        {isAr ? course.descriptionAr : course.descriptionEn}
                      </p>

                      {/* Core Topics Checklist */}
                      {course.keyTopicsEn && (
                        <div className="mt-4 pt-3 border-t border-line/60">
                          <ul className="space-y-1.5 text-xs text-fg-muted list-none p-0">
                            {(isAr ? course.keyTopicsAr : course.keyTopicsEn)?.slice(0, 3).map((topic, i) => (
                              <li key={i} className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-accent-500 shrink-0" />
                                <span className="truncate">{topic}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Footer Bar */}
                    <div className="mt-6 pt-4 border-t border-line flex flex-wrap items-center justify-between gap-2">
                      <span className="flex items-center gap-1.5 text-xs font-medium text-fg-muted min-w-0">
                        <User className="w-3.5 h-3.5 shrink-0 text-fg-subtle" aria-hidden="true" />
                        <span className="truncate max-w-[120px]">{course.instructor}</span>
                      </span>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => onViewDetails(course)}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold text-fg-muted bg-surface-2 hover:bg-surface-3 ring-1 ring-line hover:text-fg transition-colors cursor-pointer"
                        >
                          {isAr ? 'المنهج والمتن' : 'Syllabus'}
                        </button>
                        <button
                          type="button"
                          onClick={() => onSelectCourse(course.id)}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-brand-700 hover:bg-brand-800 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer group-hover:shadow-md"
                        >
                          <Check className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>{isAr ? 'سجّل' : 'Enroll'}</span>
                        </button>
                      </div>
                    </div>
                  </TiltCard>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </motion.ul>

        {courses.length === 0 && (
          <p className="text-center text-fg-muted py-12">
            {isAr ? 'لا توجد مواد مسجلة في هذا المستوى حالياً.' : 'No subjects currently listed under this level.'}
          </p>
        )}
      </div>
    </section>
  );
};
