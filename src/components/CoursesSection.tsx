'use client';

import React, { useState } from 'react';
import { MAJOR_COURSES } from '@/lib/data/academyData';
import {
  BookOpen, Calculator, Check, CheckCheck, Compass, Heart, History,
  Languages, Mic, Scale, ScrollText, User,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Lang } from '@/lib/usePreferences';

interface CoursesSectionProps {
  lang: Lang;
  onSelectCourse: (courseId: string) => void;
}

/* One icon treatment for every subject. The previous ten-colour icon set made
   decoration compete with the status colours used elsewhere in the LMS. */
const ICONS: Record<string, LucideIcon> = {
  BookOpen, Mic, Languages, Compass, Scale, ScrollText,
  CheckCheck, History, Calculator, Heart,
};

const FILTERS = [
  { id: 'all', labelAr: 'جميع المواد', labelEn: 'All subjects' },
  { id: 'tamheediy', labelAr: 'التمهيدي', labelEn: 'Preparatory' },
  { id: 'ibtidaiyya', labelAr: 'الابتدائية', labelEn: 'Primary' },
  { id: 'idadiyya', labelAr: 'الإعدادية', labelEn: 'Junior sec.' },
  { id: 'thanawiyya', labelAr: 'الثانوية', labelEn: 'Senior sec.' },
  { id: 'tejweed-class', labelAr: 'دورة التجويد', labelEn: 'Tejweed' },
];

export const CoursesSection: React.FC<CoursesSectionProps> = ({
  lang,
  onSelectCourse,
}) => {
  const isAr = lang === 'ar';
  const [filter, setFilter] = useState('all');

  const courses =
    filter === 'all'
      ? MAJOR_COURSES
      : MAJOR_COURSES.filter((c) => c.levelIds.includes(filter));

  return (
    <section id="courses" className="py-16 sm:py-20 bg-motif-soft border-y border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <header className="max-w-2xl mb-10">
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-ink">
            <BookOpen className="w-4 h-4" aria-hidden="true" />
            {isAr ? 'المنهج الدراسي' : 'Curriculum'}
          </p>
          <h2 className="mt-3 text-2xl sm:text-4xl font-extrabold tracking-tight text-fg text-balance">
            {isAr ? 'المواد العشر الرئيسية' : 'The ten core subjects'}
          </h2>
          <p className="mt-3 text-fg-muted leading-relaxed">
            {isAr
              ? 'منهج علمي رصين يشمل أصول العلوم الشرعية واللغة العربية، مع تطبيقات عملية واختبارات دورية.'
              : 'A rigorous curriculum spanning the Islamic sciences and Arabic linguistics, with practical work and periodic assessment.'}
          </p>
        </header>

        {/* Filters */}
        <div
          role="group"
          aria-label={isAr ? 'تصفية المواد حسب المستوى' : 'Filter subjects by level'}
          className="flex flex-wrap gap-2 mb-8"
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
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${
                  active
                    ? 'bg-brand-700 text-white'
                    : 'bg-surface text-fg-muted ring-1 ring-line hover:text-fg hover:ring-brand-ring'
                }`}
              >
                <span>{isAr ? tab.labelAr : tab.labelEn}</span>
                <span
                  className={`tabular text-[11px] font-bold ${
                    active ? 'text-brand-200' : 'text-fg-subtle'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((course) => {
            const Icon = ICONS[course.iconName] ?? BookOpen;

            return (
              <li
                key={course.id}
                className="group flex flex-col rounded-2xl bg-surface p-6 ring-1 ring-line hover:ring-brand-ring shadow-sm hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-brand-tint text-brand-ink ring-1 ring-brand-ring flex items-center justify-center group-hover:bg-brand-700 group-hover:text-white group-hover:ring-brand-700 transition-colors">
                    <Icon className="w-[22px] h-[22px]" aria-hidden="true" />
                  </div>
                  <span className="tabular text-xs font-extrabold text-fg-subtle">
                    {String(course.number).padStart(2, '0')}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-fg leading-snug">
                  {isAr ? course.titleAr : course.titleEn}
                </h3>
                <p className="text-xs font-semibold text-brand-ink mt-1">
                  {isAr ? course.titleEn : course.titleAr}
                </p>

                <p className="mt-3 text-sm text-fg-muted leading-relaxed clamp-3 flex-1">
                  {isAr ? course.descriptionAr : course.descriptionEn}
                </p>

                <div className="mt-5 pt-4 border-t border-line flex items-center justify-between gap-3">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-fg-muted min-w-0">
                    <User className="w-3.5 h-3.5 shrink-0 text-fg-subtle" aria-hidden="true" />
                    <span className="truncate">{course.instructor}</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => onSelectCourse(course.id)}
                    className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold text-brand-ink ring-1 ring-brand-ring hover:bg-brand-700 hover:text-white hover:ring-brand-700 transition-colors flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{isAr ? 'سجّل' : 'Enroll'}</span>
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        {courses.length === 0 && (
          <p className="text-center text-fg-muted py-12">
            {isAr ? 'لا توجد مواد في هذا المستوى.' : 'No subjects in this level.'}
          </p>
        )}
      </div>
    </section>
  );
};
