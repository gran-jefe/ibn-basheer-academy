'use client';

import React from 'react';
import {
  BookOpen, CheckCircle, GraduationCap, Sparkles, User, Calendar,
  Clock, ArrowRight, ArrowLeft, Bookmark
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import type { Lang } from '@/lib/usePreferences';
import type { Course } from '@/lib/data/academyData';
import { ACADEMIC_LEVELS } from '@/lib/data/academyData';

interface CourseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
  lang: Lang;
  onEnroll: (courseId: string) => void;
}

export const CourseDetailModal: React.FC<CourseDetailModalProps> = ({
  isOpen,
  onClose,
  course,
  lang,
  onEnroll,
}) => {
  if (!course) return null;

  const isAr = lang === 'ar';
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  const assignedLevels = ACADEMIC_LEVELS.filter((l) => course.levelIds.includes(l.id));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isAr ? course.titleAr : course.titleEn}
      subtitle={
        isAr
          ? `المقرر رقم (${course.number}) ضمن المقررات العشرة الأساسية`
          : `Course #${course.number} of the 10 Major Academy Subjects`
      }
      size="lg"
    >
      <div className="space-y-6">
        
        {/* Header Summary Banner */}
        <div className="p-5 rounded-3xl bg-surface-2 ring-1 ring-line/80 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-tint text-brand-ink ring-1 ring-brand-ring">
              {isAr ? `المقرر ${course.number} من ١٠` : `Subject ${course.number} of 10`}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-fg-muted">
              <User className="w-3.5 h-3.5 text-accent-600" />
              <span>{isAr ? 'المدرس: الشيخ أبو عبد الله المبارك' : `Instructor: ${course.instructor}`}</span>
            </div>
          </div>
          <p className="text-sm text-fg leading-relaxed">
            {isAr ? course.descriptionAr : course.descriptionEn}
          </p>
        </div>

        {/* Authoritative Classical Set Text (Matn) */}
        {(course.primaryTextEn || course.primaryTextAr) && (
          <div className="p-5 rounded-3xl bg-brand-900 text-white shadow-md relative overflow-hidden">
            <div className="absolute top-0 end-0 p-6 opacity-10 pointer-events-none">
              <BookOpen className="w-28 h-28" />
            </div>

            <div className="relative space-y-2">
              <div className="flex items-center gap-2 text-accent-300 text-xs font-bold uppercase tracking-wider">
                <Bookmark className="w-4 h-4" />
                <span>{isAr ? 'المتن المعتمد في المقرر' : 'Prescribed Classical Text (Al-Matn)'}</span>
              </div>
              <h4 className="text-lg sm:text-xl font-bold font-display text-white">
                {isAr ? course.primaryTextAr : course.primaryTextEn}
              </h4>
              <p className="text-xs text-brand-200 leading-relaxed max-w-xl">
                {isAr
                  ? 'يُدرَّس هذا المتن حفظاً وشرحاً وتطبيقاً لترسيخ القواعد الأصيلة في ذهن الطالب وفق المنهج التأصيلي المتوارث عن سلف الأمة.'
                  : 'Studied with line-by-line memorization and grammatical/thematic commentary to ground students in authentic classical methodology.'}
              </p>
            </div>
          </div>
        )}

        {/* Key Syllabus Modules & Topics Covered */}
        {course.keyTopicsEn && course.keyTopicsEn.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-fg-subtle flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-accent-600" />
              <span>{isAr ? 'أهم المحاور والمفردات الدراسية' : 'Core Syllabus Modules'}</span>
            </h4>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {course.keyTopicsEn.map((topic, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-surface ring-1 ring-line flex items-center gap-2.5 text-xs text-fg font-medium"
                >
                  <CheckCircle className="w-4 h-4 text-accent-600 shrink-0" />
                  <span>{topic}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stages Teaching This Course */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-fg-subtle flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-brand-600" />
            <span>{isAr ? 'المراحل الدراسية المتضمنة لهذا المقرر' : 'Included in Academic Levels'}</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {assignedLevels.map((lvl) => (
              <span
                key={lvl.id}
                className="px-3 py-1.5 rounded-xl bg-surface-2 ring-1 ring-line text-xs font-bold text-fg flex items-center gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-accent-500" />
                <span>{isAr ? lvl.titleAr : lvl.titleEn}</span>
                <span className="text-[10px] text-fg-muted">({isAr ? lvl.durationAr : lvl.durationEn})</span>
              </span>
            ))}
          </div>
        </div>

        {/* Direct Action Footer */}
        <div className="pt-4 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-fg-muted text-center sm:text-start">
            {isAr
              ? 'الدروس تُبث مباشرة أسبوعياً مع مذكرات وتكاليف عبر المنصة'
              : 'Live weekly broadcast with lecture notes, assignments & audio reviews.'}
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-surface-2 ring-1 ring-line hover:bg-surface-3 text-xs font-bold text-fg transition-colors flex-1 sm:flex-initial"
            >
              {isAr ? 'إغلاق' : 'Close'}
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onEnroll(course.id);
              }}
              className="px-5 py-2.5 rounded-xl bg-accent-600 hover:bg-accent-700 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5 flex-1 sm:flex-initial"
            >
              <span>{isAr ? 'التسجيل في هذا المقرر' : 'Enroll in this Subject'}</span>
              <Arrow className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </Modal>
  );
};
