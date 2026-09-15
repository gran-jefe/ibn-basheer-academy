'use client';

import React, { useMemo, useState } from 'react';
import {
  AlertCircle, CheckCircle2, Download, ExternalLink, FileText,
  GraduationCap, PlayCircle, Upload, Video,
} from 'lucide-react';
import {
  MOCK_ANNOUNCEMENTS, MOCK_ASSIGNMENTS, MOCK_LIVE_CLASSES, MOCK_MATERIALS,
} from '@/lib/data/academyData';
import { Modal } from '@/components/ui/Modal';
import { Tabs } from '@/components/ui/Tabs';
import { inputClass } from '@/components/ui/form';
import type { Lang } from '@/lib/usePreferences';

interface StudentPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Lang;
}

type TabId = 'live' | 'materials' | 'assignments' | 'announcements';

/** Days until a due date; negative means overdue. */
const daysUntil = (iso: string) => {
  const due = new Date(`${iso}T23:59:59`).getTime();
  if (Number.isNaN(due)) return null;
  return Math.ceil((due - Date.now()) / 86_400_000);
};

export const StudentPortalModal: React.FC<StudentPortalModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  const isAr = lang === 'ar';
  const [activeTab, setActiveTab] = useState<TabId>('live');
  const [submitted, setSubmitted] = useState<Record<string, string>>({});
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const openAssignments = useMemo(
    () => MOCK_ASSIGNMENTS.filter((a) => a.status !== 'graded' && !submitted[a.id]),
    [submitted],
  );

  const liveNow = MOCK_LIVE_CLASSES.filter((c) => c.status === 'live').length;

  const tabs = [
    {
      id: 'live' as const,
      label: isAr ? 'الفصول المباشرة' : 'Live classes',
      icon: <Video className="w-4 h-4" aria-hidden="true" />,
      badge: liveNow,
    },
    {
      id: 'materials' as const,
      label: isAr ? 'المواد والمذكرات' : 'Materials',
      icon: <FileText className="w-4 h-4" aria-hidden="true" />,
    },
    {
      id: 'assignments' as const,
      label: isAr ? 'الواجبات' : 'Assignments',
      icon: <Upload className="w-4 h-4" aria-hidden="true" />,
      badge: openAssignments.length,
    },
    {
      id: 'announcements' as const,
      label: isAr ? 'الإعلانات' : 'Announcements',
      icon: <AlertCircle className="w-4 h-4" aria-hidden="true" />,
    },
  ];

  const stats = [
    {
      labelAr: 'واجبات مفتوحة',
      labelEn: 'Open assignments',
      value: openAssignments.length,
    },
    {
      labelAr: 'حصص هذا الأسبوع',
      labelEn: 'Sessions this week',
      value: MOCK_LIVE_CLASSES.length,
    },
    {
      labelAr: 'مواد متاحة',
      labelEn: 'Materials available',
      value: MOCK_MATERIALS.length,
    },
  ];

  const panelProps = (id: TabId) => ({
    role: 'tabpanel' as const,
    id: `panel-${id}`,
    'aria-labelledby': `tab-${id}`,
    tabIndex: 0,
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title={isAr ? 'بوابة الطالب' : 'Student portal'}
      subtitle={
        isAr
          ? 'عبد الرحمن محمد · دورة التجويد والمرحلة الابتدائية'
          : 'Abdulrahman Mohammed · Tejweed & Primary'
      }
      icon={<GraduationCap className="w-5 h-5" aria-hidden="true" />}
      closeLabel={isAr ? 'إغلاق' : 'Close'}
    >
      {/* At-a-glance strip — what a returning student needs before drilling in */}
      <dl className="grid grid-cols-3 divide-x rtl:divide-x-reverse divide-line border-b border-line bg-surface">
        {stats.map((s) => (
          <div key={s.labelEn} className="px-4 py-3.5 text-center">
            <dd className="tabular text-2xl font-extrabold text-brand-ink">
              {s.value}
            </dd>
            <dt className="text-[11px] font-semibold text-fg-muted mt-0.5">
              {isAr ? s.labelAr : s.labelEn}
            </dt>
          </div>
        ))}
      </dl>

      <Tabs
        items={tabs}
        active={activeTab}
        onChange={setActiveTab}
        label={isAr ? 'أقسام البوابة' : 'Portal sections'}
      />

      <div className="p-5 sm:p-6">

        {/* Live classes */}
        {activeTab === 'live' && (
          <div {...panelProps('live')} className="space-y-4 outline-none">
            <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {MOCK_LIVE_CLASSES.map((cls) => {
                const isLive = cls.status === 'live';
                return (
                  <li
                    key={cls.id}
                    className="flex flex-col rounded-2xl bg-surface p-5 ring-1 ring-line shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      {isLive ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-danger-soft text-danger-fg text-[11px] font-extrabold uppercase tracking-wide">
                          <span className="w-1.5 h-1.5 rounded-full bg-danger animate-live" aria-hidden="true" />
                          {isAr ? 'مباشر الآن' : 'Live now'}
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-surface-3 text-fg-muted text-[11px] font-bold uppercase tracking-wide">
                          {isAr ? 'قادمة' : 'Upcoming'}
                        </span>
                      )}
                      <span className="text-xs font-semibold text-fg-subtle text-end">
                        {cls.level}
                      </span>
                    </div>

                    <h3 className="font-bold text-fg leading-snug">
                      {isAr ? cls.titleAr : cls.titleEn}
                    </h3>
                    <p className="text-xs text-brand-ink font-semibold mt-1">
                      {isAr ? cls.subjectAr : cls.subjectEn}
                    </p>

                    <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-lg bg-surface-2 ring-1 ring-line px-3 py-2">
                        <dt className="text-fg-subtle">{isAr ? 'اليوم' : 'Day'}</dt>
                        <dd className="font-semibold text-fg mt-0.5">
                          {isAr ? cls.dayAr : cls.dayEn}
                        </dd>
                      </div>
                      <div className="rounded-lg bg-surface-2 ring-1 ring-line px-3 py-2">
                        <dt className="text-fg-subtle">{isAr ? 'الوقت' : 'Time'}</dt>
                        <dd className="tabular font-semibold text-fg mt-0.5">
                          {isAr ? cls.timeAr : cls.timeEn}
                        </dd>
                      </div>
                    </dl>

                    <a
                      href={cls.meetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`mt-4 py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 ${
                        isLive
                          ? 'bg-brand-700 hover:bg-brand-800 text-white'
                          : 'text-brand-ink ring-1 ring-brand-ring hover:bg-brand-tint'
                      }`}
                    >
                      <Video className="w-4 h-4" aria-hidden="true" />
                      <span>
                        {isLive
                          ? (isAr ? 'انضم الآن' : 'Join now')
                          : (isAr ? 'رابط الحصة' : 'Session link')}
                      </span>
                      <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Materials */}
        {activeTab === 'materials' && (
          <div {...panelProps('materials')} className="space-y-3 outline-none">
            <ul className="space-y-3">
              {MOCK_MATERIALS.map((mat) => (
                <li
                  key={mat.id}
                  className="flex items-center justify-between gap-4 rounded-2xl bg-surface p-4 ring-1 ring-line shadow-sm"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center ${
                        mat.type === 'pdf'
                          ? 'bg-danger-soft text-danger'
                          : 'bg-info-soft text-info'
                      }`}
                    >
                      {mat.type === 'pdf'
                        ? <FileText className="w-5 h-5" aria-hidden="true" />
                        : <PlayCircle className="w-5 h-5" aria-hidden="true" />}
                    </div>

                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-fg truncate">
                        {isAr ? mat.titleAr : mat.titleEn}
                      </p>
                      <p className="tabular text-xs text-fg-subtle mt-0.5">
                        {mat.type.toUpperCase()} · {mat.sizeOrDuration} · <span dir="ltr">{mat.uploadedDate}</span>
                      </p>
                    </div>
                  </div>

                  <a
                    href={mat.downloadUrl}
                    download
                    className="shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold text-brand-ink ring-1 ring-brand-ring hover:bg-brand-700 hover:text-white hover:ring-brand-700 transition-colors flex items-center gap-1.5"
                  >
                    <Download className="w-4 h-4" aria-hidden="true" />
                    <span>{isAr ? 'تحميل' : 'Download'}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Assignments */}
        {activeTab === 'assignments' && (
          <div {...panelProps('assignments')} className="space-y-4 outline-none">
            <ul className="space-y-4">
              {MOCK_ASSIGNMENTS.map((assg) => {
                const graded = assg.status === 'graded';
                const answer = submitted[assg.id];
                const done = graded || !!answer;
                const remaining = daysUntil(assg.dueDate);
                const overdue = !done && remaining !== null && remaining < 0;
                const dueSoon = !done && remaining !== null && remaining >= 0 && remaining <= 3;

                return (
                  <li
                    key={assg.id}
                    className="rounded-2xl bg-surface p-5 ring-1 ring-line shadow-sm space-y-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-fg-subtle">
                          {assg.level}
                        </span>
                        <h3 className="font-bold text-fg leading-snug mt-1">
                          {isAr ? assg.titleAr : assg.titleEn}
                        </h3>
                      </div>

                      <span
                        className={`tabular shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold ${
                          graded
                            ? 'bg-success-soft text-success-fg'
                            : overdue
                              ? 'bg-danger-soft text-danger-fg'
                              : dueSoon
                                ? 'bg-warn-soft text-warn-fg'
                                : 'bg-surface-3 text-fg-muted'
                        }`}
                      >
                        {graded
                          ? (isAr ? 'تم التصحيح' : 'Graded')
                          : overdue
                            ? (isAr ? 'فات الموعد' : 'Overdue')
                            : (
                              <>
                                {isAr ? 'التسليم' : 'Due'}{' '}
                                <span dir="ltr">{assg.dueDate}</span>
                              </>
                            )}
                        {' · '}
                        {assg.totalPoints} {isAr ? 'درجة' : 'pts'}
                      </span>
                    </div>

                    {done ? (
                      <p className="flex items-start gap-2 rounded-xl bg-success-soft px-4 py-3 text-xs font-semibold text-success-fg">
                        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                        <span className="min-w-0">
                          {answer ? (
                            <>
                              {isAr ? 'تم التسليم: ' : 'Submitted: '}
                              <span className="font-normal break-words">{answer}</span>
                            </>
                          ) : (
                            isAr
                              ? 'تم تصحيح هذا الواجب — راجع ملاحظات المعلم.'
                              : 'This assignment has been graded — see your instructor feedback.'
                          )}
                        </span>
                      </p>
                    ) : (
                      <div className="pt-1 border-t border-line space-y-2">
                        <label
                          htmlFor={`submit-${assg.id}`}
                          className="block text-xs font-bold text-fg pt-3"
                        >
                          {isAr
                            ? 'إجابتك أو رابط التسجيل الصوتي'
                            : 'Your answer or audio recording link'}
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            id={`submit-${assg.id}`}
                            type="text"
                            value={drafts[assg.id] ?? ''}
                            onChange={(e) =>
                              setDrafts((d) => ({ ...d, [assg.id]: e.target.value }))
                            }
                            placeholder={
                              isAr
                                ? 'أدخل إجابتك أو ألصق رابط الملف...'
                                : 'Type your answer or paste a file link...'
                            }
                            className={inputClass}
                          />
                          <button
                            type="button"
                            disabled={!drafts[assg.id]?.trim()}
                            onClick={() =>
                              setSubmitted((s) => ({
                                ...s,
                                [assg.id]: drafts[assg.id].trim(),
                              }))
                            }
                            className="shrink-0 px-5 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 disabled:bg-surface-3 disabled:text-fg-subtle disabled:cursor-not-allowed text-white font-bold text-sm transition-colors"
                          >
                            {isAr ? 'تسليم' : 'Submit'}
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Announcements */}
        {activeTab === 'announcements' && (
          <div {...panelProps('announcements')} className="space-y-3 outline-none">
            <ul className="space-y-3">
              {MOCK_ANNOUNCEMENTS.map((ann) => (
                <li
                  key={ann.id}
                  className="rounded-2xl bg-surface p-5 ring-1 ring-line shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-bold text-sm text-fg leading-snug">
                      {isAr ? ann.titleAr : ann.titleEn}
                    </h3>
                    <span className="tabular shrink-0 text-xs text-fg-subtle" dir="ltr">
                      {ann.date}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-fg-muted leading-relaxed">
                    {isAr ? ann.contentAr : ann.contentEn}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>
    </Modal>
  );
};
