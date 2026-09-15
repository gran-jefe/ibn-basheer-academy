'use client';

import React, { useState } from 'react';
import {
  Check, CheckSquare, FilePlus, PlusCircle, Send, UserCog, Users, Loader2,
} from 'lucide-react';
import { ACADEMIC_LEVELS, MAJOR_COURSES, MOCK_ASSIGNMENTS } from '@/lib/data/academyData';
import { Modal } from '@/components/ui/Modal';
import { Tabs } from '@/components/ui/Tabs';
import { inputClass, labelClass, selectClass } from '@/components/ui/form';
import type { Lang } from '@/lib/usePreferences';
import { createAssignment, publishCourseMaterial, gradeRecitation } from '@/lib/services/teacherService';

interface TeacherPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Lang;
}

type TabId = 'assignment' | 'material' | 'grading';

const PENDING_SUBMISSIONS = [
  {
    id: 'sub-1',
    studentAr: 'عبد الرحمن محمد',
    studentEn: 'Abdulrahman Mohammed',
    courseAr: 'التجويد',
    courseEn: 'Tajwīd',
    bodyAr: 'تسجيل تلاوة سورة الملك (أحكام الإظهار والشفوي)',
    bodyEn: 'Recitation of Surah Al-Mulk (Izhar & Shafawi rules)',
    date: '2026-09-15',
  },
  {
    id: 'sub-2',
    studentAr: 'فاطمة الزهراء',
    studentEn: 'Fatimah Az-Zahra',
    courseAr: 'اللغة العربية',
    courseEn: 'Arabic Language',
    bodyAr: 'إعراب سورة الكوثر بالكامل',
    bodyEn: 'Full grammatical parsing of Surah Al-Kawthar',
    date: '2026-09-14',
  },
];

export const TeacherPortalModal: React.FC<TeacherPortalModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  const isAr = lang === 'ar';
  const [activeTab, setActiveTab] = useState<TabId>('assignment');

  const [assgTitle, setAssgTitle] = useState('');
  const [assgLevel, setAssgLevel] = useState('tamheediy');
  const [assgCourse, setAssgCourse] = useState('tajweed');
  const [assgPoints, setAssgPoints] = useState('100');
  const [assgDueDate, setAssgDueDate] = useState('');
  const [assgSuccess, setAssgSuccess] = useState(false);
  const [isCreatingAssg, setIsCreatingAssg] = useState(false);

  const [matTitle, setMatTitle] = useState('');
  const [matType, setMatType] = useState<'pdf' | 'audio'>('pdf');
  const [matSuccess, setMatSuccess] = useState(false);
  const [isPublishingMat, setIsPublishingMat] = useState(false);

  /* Grades resolve inline rather than through a blocking alert(). */
  const [grades, setGrades] = useState<Record<string, string>>({});
  const [savedGrades, setSavedGrades] = useState<Record<string, string>>({});
  const [isGradingId, setIsGradingId] = useState<string | null>(null);

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingAssg(true);
    await createAssignment({
      title: assgTitle,
      levelId: assgLevel,
      courseId: assgCourse,
      totalPoints: Number(assgPoints) || 100,
      dueDate: assgDueDate,
    });
    setIsCreatingAssg(false);
    setAssgSuccess(true);
    setAssgTitle('');
    setAssgDueDate('');
  };

  const handlePublishMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPublishingMat(true);
    await publishCourseMaterial({
      courseId: assgCourse,
      title: matTitle,
      type: matType,
      sizeOrDuration: matType === 'pdf' ? '2.4 MB' : '38 mins',
      downloadUrl: 'https://placeholder.supabase.co/materials/sample.pdf',
    });
    setIsPublishingMat(false);
    setMatSuccess(true);
    setMatTitle('');
  };

  const handleSaveGrade = async (subId: string, mark: string) => {
    setIsGradingId(subId);
    await gradeRecitation({
      recitationId: subId,
      score: Number(mark) || 50,
      feedbackMakharij: 'Makharij clear with proper articulation of throat letters.',
      feedbackSifat: 'Qalqalah observed correctly.',
      instructorNotes: 'Excellent effort, recommended to review Ghunnah duration.',
    });
    setIsGradingId(null);
    setSavedGrades((s) => ({ ...s, [subId]: mark }));
  };

  const tabs = [
    {
      id: 'assignment' as const,
      label: isAr ? 'واجب جديد' : 'New assignment',
      icon: <PlusCircle className="w-4 h-4" aria-hidden="true" />,
    },
    {
      id: 'material' as const,
      label: isAr ? 'رفع مادة' : 'Upload material',
      icon: <FilePlus className="w-4 h-4" aria-hidden="true" />,
    },
    {
      id: 'grading' as const,
      label: isAr ? 'التصحيح' : 'Grading',
      icon: <CheckSquare className="w-4 h-4" aria-hidden="true" />,
      badge: PENDING_SUBMISSIONS.filter((s) => !savedGrades[s.id]).length,
    },
  ];

  const successNote = (text: string) => (
    <p
      role="status"
      className="flex items-center gap-2 rounded-xl bg-success-soft px-4 py-3 text-xs font-bold text-success-fg"
    >
      <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
      {text}
    </p>
  );

  const panelProps = (id: TabId) => ({
    role: 'tabpanel' as const,
    id: `panel-${id}`,
    'aria-labelledby': `tab-${id}`,
    tabIndex: 0,
  });

  const cardClass =
    'rounded-2xl bg-surface p-5 sm:p-6 ring-1 ring-line shadow-sm space-y-5 max-w-2xl mx-auto';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={isAr ? 'بوابة المعلم' : 'Teacher portal'}
      subtitle={
        isAr
          ? 'الشيخ أبو عبد الله المبارك'
          : 'Ustaz Abu Abdullah Al-Mubaarak'
      }
      icon={<UserCog className="w-5 h-5" aria-hidden="true" />}
      closeLabel={isAr ? 'إغلاق' : 'Close'}
    >
      <Tabs
        items={tabs}
        active={activeTab}
        onChange={setActiveTab}
        label={isAr ? 'أقسام إدارة الأكاديمية' : 'Academy management sections'}
      />

      <div className="p-5 sm:p-6">

        {/* Create assignment */}
        {activeTab === 'assignment' && (
          <form
            {...panelProps('assignment')}
            onSubmit={handleCreateAssignment}
            className={`${cardClass} outline-none`}
          >
            <h3 className="font-bold text-fg">
              {isAr ? 'إضافة واجب أو اختبار جديد' : 'Create a new assignment'}
            </h3>

            {assgSuccess &&
              successNote(
                isAr
                  ? 'تم نشر الواجب وإرساله إلى الطلاب.'
                  : 'Assignment published and sent to students.',
              )}

            <div>
              <label htmlFor="tp-title" className={labelClass}>
                {isAr ? 'عنوان الواجب' : 'Assignment title'}{' '}
                <span className="text-danger">*</span>
              </label>
              <input
                id="tp-title"
                type="text"
                required
                value={assgTitle}
                onChange={(e) => { setAssgTitle(e.target.value); setAssgSuccess(false); }}
                placeholder={
                  isAr ? 'مثال: تطبيق أحكام النون الساكنة' : 'e.g. Recitation assessment 1'
                }
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="tp-level" className={labelClass}>
                  {isAr ? 'المستوى المستهدف' : 'Target level'}{' '}
                  <span className="text-danger">*</span>
                </label>
                <select
                  id="tp-level"
                  value={assgLevel}
                  onChange={(e) => setAssgLevel(e.target.value)}
                  className={selectClass}
                >
                  {ACADEMIC_LEVELS.map((l) => (
                    <option key={l.id} value={l.id}>
                      {isAr ? l.titleAr : l.titleEn}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="tp-course" className={labelClass}>
                  {isAr ? 'المادة' : 'Subject'}{' '}
                  <span className="text-danger">*</span>
                </label>
                <select
                  id="tp-course"
                  value={assgCourse}
                  onChange={(e) => setAssgCourse(e.target.value)}
                  className={selectClass}
                >
                  {MAJOR_COURSES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {isAr ? c.titleAr : c.titleEn}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="tp-points" className={labelClass}>
                  {isAr ? 'الدرجة الكلية' : 'Total points'}{' '}
                  <span className="text-danger">*</span>
                </label>
                <input
                  id="tp-points"
                  type="number"
                  min={1}
                  max={1000}
                  required
                  value={assgPoints}
                  onChange={(e) => setAssgPoints(e.target.value)}
                  className={`${inputClass} tabular`}
                />
              </div>

              <div>
                <label htmlFor="tp-due" className={labelClass}>
                  {isAr ? 'تاريخ التسليم' : 'Due date'}{' '}
                  <span className="text-danger">*</span>
                </label>
                <input
                  id="tp-due"
                  type="date"
                  required
                  value={assgDueDate}
                  onChange={(e) => setAssgDueDate(e.target.value)}
                  className={`${inputClass} tabular`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isCreatingAssg}
              className="w-full py-3 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isCreatingAssg ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" aria-hidden="true" />}
              <span>{isCreatingAssg ? (isAr ? 'جاري النشر...' : 'Publishing...') : (isAr ? 'نشر الواجب' : 'Publish assignment')}</span>
            </button>

            <p className="text-xs text-fg-subtle text-center">
              {isAr
                ? `سيصل الإشعار إلى ${MOCK_ASSIGNMENTS.length > 0 ? 'طلاب المستوى المحدد' : 'الطلاب'} فور النشر.`
                : 'Students in the selected level are notified on publish.'}
            </p>
          </form>
        )}

        {/* Upload material */}
        {activeTab === 'material' && (
          <form
            {...panelProps('material')}
            onSubmit={handlePublishMaterial}
            className={`${cardClass} outline-none`}
          >
            <h3 className="font-bold text-fg">
              {isAr ? 'رفع مذكرة أو تسجيل صوتي' : 'Upload lecture material'}
            </h3>

            {matSuccess &&
              successNote(
                isAr ? 'تم رفع المادة التعليمية بنجاح إلى المنصة.' : 'Material uploaded successfully to the academy LMS.',
              )}

            <div>
              <label htmlFor="tp-mat-title" className={labelClass}>
                {isAr ? 'اسم الدرس أو المذكرة' : 'Title'}{' '}
                <span className="text-danger">*</span>
              </label>
              <input
                id="tp-mat-title"
                type="text"
                required
                value={matTitle}
                onChange={(e) => { setMatTitle(e.target.value); setMatSuccess(false); }}
                placeholder={
                  isAr ? 'مثال: شرح منظومة الجزري (PDF)' : 'e.g. Tajweed lecture 3 (audio)'
                }
                className={inputClass}
              />
            </div>

            <fieldset>
              <legend className={labelClass}>
                {isAr ? 'نوع الملف' : 'File type'}{' '}
                <span className="text-danger">*</span>
              </legend>
              <div className="grid grid-cols-2 gap-3">
                {(['pdf', 'audio'] as const).map((type) => (
                  <label
                    key={type}
                    className={`cursor-pointer rounded-xl px-4 py-3 text-sm font-semibold text-center transition-colors ring-1 ${
                      matType === type
                        ? 'bg-brand-tint text-brand-ink ring-brand-ring'
                        : 'bg-surface text-fg-muted ring-line hover:ring-brand-ring'
                    }`}
                  >
                    <input
                      type="radio"
                      name="matType"
                      value={type}
                      checked={matType === type}
                      onChange={() => setMatType(type)}
                      className="sr-only"
                    />
                    {type === 'pdf'
                      ? (isAr ? 'مستند PDF' : 'PDF document')
                      : (isAr ? 'تسجيل صوتي' : 'Audio recording')}
                  </label>
                ))}
              </div>
            </fieldset>

            <div>
              <label
                htmlFor="tp-file"
                className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-line-strong bg-surface-2 px-6 py-8 text-center cursor-pointer hover:border-brand-400 transition-colors"
              >
                <FilePlus className="w-7 h-7 text-fg-subtle" aria-hidden="true" />
                <span className="text-xs text-fg-muted">
                  {isAr
                    ? 'اختر الملف من جهازك أو أسقطه هنا'
                    : 'Choose a file or drop it here'}
                </span>
              </label>
              <input
                id="tp-file"
                type="file"
                className="sr-only"
                accept={matType === 'pdf' ? '.pdf' : 'audio/*'}
              />
            </div>

            <button
              type="submit"
              disabled={isPublishingMat}
              className="w-full py-3 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isPublishingMat ? <Loader2 className="w-4 h-4 animate-spin" /> : <FilePlus className="w-4 h-4" aria-hidden="true" />}
              <span>{isPublishingMat ? (isAr ? 'جاري الرفع للمنصة...' : 'Uploading...') : (isAr ? 'رفع المادة' : 'Upload to LMS')}</span>
            </button>
          </form>
        )}

        {/* Grading */}
        {activeTab === 'grading' && (
          <div {...panelProps('grading')} className="space-y-4 outline-none">
            <h3 className="flex items-center gap-2 font-bold text-fg">
              <Users className="w-4 h-4 text-brand-ink" aria-hidden="true" />
              {isAr ? 'واجبات بانتظار التصحيح' : 'Submissions pending review'}
            </h3>

            <ul className="space-y-3">
              {PENDING_SUBMISSIONS.map((item) => {
                const saved = savedGrades[item.id];

                return (
                  <li
                    key={item.id}
                    className="rounded-2xl bg-surface p-5 ring-1 ring-line shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="font-bold text-fg">
                        {isAr ? item.studentAr : item.studentEn}
                      </span>
                      <span className="tabular text-xs text-fg-subtle" dir="ltr">{item.date}</span>
                    </div>

                    <p className="rounded-xl bg-surface-2 px-4 py-3 text-sm text-fg-muted">
                      <strong className="text-fg">
                        {isAr ? item.courseAr : item.courseEn}:
                      </strong>{' '}
                      {isAr ? item.bodyAr : item.bodyEn}
                    </p>

                    {saved ? (
                      <p
                        role="status"
                        className="flex items-center gap-2 rounded-xl bg-success-soft px-4 py-2.5 text-xs font-bold text-success-fg"
                      >
                        <Check className="w-4 h-4" aria-hidden="true" />
                        <span className="tabular">
                          {isAr ? `تم حفظ الدرجة: ${saved}/100` : `Grade saved: ${saved}/100`}
                        </span>
                      </p>
                    ) : (
                      <div className="flex items-center gap-2">
                        <label htmlFor={`grade-${item.id}`} className="sr-only">
                          {isAr ? 'الدرجة من 100' : 'Grade out of 100'}
                        </label>
                        <input
                          id={`grade-${item.id}`}
                          type="number"
                          min={0}
                          max={100}
                          value={grades[item.id] ?? ''}
                          onChange={(e) =>
                            setGrades((g) => ({ ...g, [item.id]: e.target.value }))
                          }
                          placeholder={isAr ? 'الدرجة' : 'Grade'}
                          className={`${inputClass} tabular w-28`}
                        />
                        <button
                          type="button"
                          disabled={!grades[item.id] || isGradingId === item.id}
                          onClick={() => handleSaveGrade(item.id, grades[item.id])}
                          className="px-4 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 disabled:bg-surface-3 disabled:text-fg-subtle disabled:cursor-not-allowed text-white font-bold text-xs transition-colors flex items-center gap-1.5"
                        >
                          {isGradingId === item.id && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                          <span>{isGradingId === item.id ? (isAr ? 'جاري الحفظ...' : 'Saving...') : (isAr ? 'حفظ الدرجة' : 'Save grade')}</span>
                        </button>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

      </div>
    </Modal>
  );
};
