'use client';

import React, { useMemo, useState, useEffect } from 'react';
import {
  AlertCircle, CheckCircle2, Download, ExternalLink, FileText,
  GraduationCap, PlayCircle, Upload, Video, Mic, Square, Play, Pause,
  Volume2, Sparkles, Send, RefreshCw
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

type TabId = 'live' | 'materials' | 'assignments' | 'recitation' | 'announcements';

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

  // Recitation Studio State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasRecording, setHasRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recitationSubmitted, setRecitationSubmitted] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((t) => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleStartRecord = () => {
    setRecordingTime(0);
    setIsRecording(true);
    setHasRecording(false);
    setRecitationSubmitted(false);
  };

  const handleStopRecord = () => {
    setIsRecording(false);
    setHasRecording(true);
  };

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSubmitRecitation = () => {
    setRecitationSubmitted(true);
  };

  const openAssignments = useMemo(
    () => MOCK_ASSIGNMENTS.filter((a) => a.status !== 'graded' && !submitted[a.id]),
    [submitted],
  );

  const liveNow = MOCK_LIVE_CLASSES.filter((c) => c.status === 'live').length;

  const tabs = [
    {
      id: 'live' as const,
      label: isAr ? 'الفصول المباشرة' : 'Live Classes',
      icon: <Video className="w-4 h-4" aria-hidden="true" />,
      badge: liveNow,
    },
    {
      id: 'materials' as const,
      label: isAr ? 'المواد والمذكرات' : 'Course Notes & Audio',
      icon: <FileText className="w-4 h-4" aria-hidden="true" />,
    },
    {
      id: 'assignments' as const,
      label: isAr ? 'الواجبات' : 'Assignments',
      icon: <Upload className="w-4 h-4" aria-hidden="true" />,
      badge: openAssignments.length,
    },
    {
      id: 'recitation' as const,
      label: isAr ? 'استوديو التلاوة' : 'Recitation Studio',
      icon: <Mic className="w-4 h-4" aria-hidden="true" />,
      badge: hasRecording && !recitationSubmitted ? 1 : 0,
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
      labelEn: 'Open Assignments',
      value: openAssignments.length,
    },
    {
      labelAr: 'حصص هذا الأسبوع',
      labelEn: 'Weekly Sessions',
      value: MOCK_LIVE_CLASSES.length,
    },
    {
      labelAr: 'استوديو التجويد',
      labelEn: 'Tajweed Studio',
      value: isAr ? 'نشط' : 'Active',
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
      title={isAr ? 'بوابة الطالب الافتراضية' : 'Student Virtual LMS Portal'}
      subtitle={
        isAr
          ? 'أكاديمية ابن بشير · متابعة الدروس والواجبات والتلاوة'
          : 'Ibn Basheer Academy · Live Classes, Coursework & Tajweed Recitation'
      }
      icon={<GraduationCap className="w-5 h-5 text-accent-300" aria-hidden="true" />}
      size="xl"
      closeLabel={isAr ? 'إغلاق البوابة' : 'Close Portal'}
    >
      <div className="space-y-6">

        {/* Urgent at-a-glance banner */}
        <section
          aria-label={isAr ? 'ملخص الحساب' : 'Account summary'}
          className="rounded-2xl bg-surface-2 ring-1 ring-line p-5"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-fg-subtle">
                {isAr ? 'المستوى المقيد به' : 'Enrolled Track'}
              </p>
              <h2 className="text-base font-extrabold text-fg mt-0.5">
                {isAr
                  ? 'المرحلة الابتدائية + دورة التجويد المكثفة'
                  : 'Primary Level (Ibtidā’iyya) & Tajweed Intensive Track'}
              </h2>
              <p className="text-xs text-fg-muted mt-1">
                {isAr ? 'المشرف الأكاديمي: الشيخ أبو عبد الله المبارك' : 'Academic Director: Ustaz Abu Abdullah Al-Mubaarak'}
              </p>
            </div>

            <dl className="flex items-center gap-6 sm:border-s sm:border-line sm:ps-6">
              {stats.map((s) => (
                <div key={s.labelEn}>
                  <dt className="text-[11px] font-semibold text-fg-subtle">
                    {isAr ? s.labelAr : s.labelEn}
                  </dt>
                  <dd className="tabular text-xl font-extrabold text-brand-ink mt-0.5">
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Tab navigation */}
        <Tabs
          items={tabs}
          active={activeTab}
          onChange={(id) => setActiveTab(id)}
          label={isAr ? 'أقسام بوابة الطالب' : 'Student portal sections'}
        />

        {/* Live Classes */}
        {activeTab === 'live' && (
          <div {...panelProps('live')} className="space-y-4 outline-none">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MOCK_LIVE_CLASSES.map((cls) => {
                const live = cls.status === 'live';

                return (
                  <li
                    key={cls.id}
                    className={`rounded-2xl p-5 ring-1 transition-all flex flex-col justify-between gap-4 ${
                      live
                        ? 'bg-surface ring-brand-ring shadow-md'
                        : 'bg-surface ring-line'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-2">
                        {live ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-danger-soft text-danger-fg text-[11px] font-extrabold uppercase tracking-wide">
                            <span className="w-1.5 h-1.5 rounded-full bg-danger animate-live" aria-hidden="true" />
                            {isAr ? 'مباشر الآن' : 'Live Now'}
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-surface-3 text-fg-muted text-[11px] font-bold uppercase tracking-wide">
                            {isAr ? 'قادمة' : 'Upcoming'}
                          </span>
                        )}

                        <span className="text-xs font-semibold text-fg-subtle">
                          {cls.level}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-fg leading-snug">
                        {isAr ? cls.titleAr : cls.titleEn}
                      </h3>
                      <p className="text-xs text-brand-ink font-semibold mt-1">
                        {isAr ? cls.subjectAr : cls.subjectEn} · {cls.instructor}
                      </p>

                      <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
                        <div className="rounded-lg bg-surface-2 p-2 ring-1 ring-line/60">
                          <dt className="text-fg-subtle">{isAr ? 'اليوم' : 'Day'}</dt>
                          <dd className="font-semibold text-fg mt-0.5">
                            {isAr ? cls.dayAr : cls.dayEn}
                          </dd>
                        </div>
                        <div className="rounded-lg bg-surface-2 p-2 ring-1 ring-line/60">
                          <dt className="text-fg-subtle">{isAr ? 'الوقت' : 'Time'}</dt>
                          <dd className="tabular font-semibold text-fg mt-0.5">
                            {isAr ? cls.timeAr : cls.timeEn}
                          </dd>
                        </div>
                      </dl>
                    </div>

                    <a
                      href={cls.meetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 ${
                        live
                          ? 'bg-brand-700 hover:bg-brand-800 text-white shadow-md'
                          : 'bg-surface-3 hover:bg-brand-700 hover:text-white text-fg'
                      }`}
                    >
                      <Video className="w-4 h-4" aria-hidden="true" />
                      <span>
                        {live
                          ? (isAr ? 'انضم إلى البث المباشر (Google Meet)' : 'Join Live Session (Google Meet)')
                          : (isAr ? 'فتح رابط الفصل' : 'Open Meeting Room')}
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
                            ? 'إجابتك أو رابط الملف'
                            : 'Your answer or file/drive link'}
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
                            onClick={() => {
                              const v = (drafts[assg.id] ?? '').trim();
                              if (!v) return;
                              setSubmitted((s) => ({ ...s, [assg.id]: v }));
                            }}
                            className="shrink-0 px-4 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs shadow transition-colors"
                          >
                            {isAr ? 'تسليم الواجب' : 'Submit'}
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

        {/* Studio Arabiya Style: Recitation & Tajweed Studio Tab */}
        {activeTab === 'recitation' && (
          <div {...panelProps('recitation')} className="space-y-6 outline-none">
            
            {/* Passage to Recite Card */}
            <div className="p-6 rounded-3xl bg-surface ring-1 ring-line shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-accent-700 bg-accent-50 px-2.5 py-1 rounded-full">
                    {isAr ? 'التكليف الأسبوعي للتلاوة' : 'Weekly Recitation Assessment'}
                  </span>
                  <h3 className="text-base font-bold text-fg mt-1">
                    {isAr ? 'سورة الملك — الآيات (١ - ٥)' : 'Surah Al-Mulk — Verses 1–5'}
                  </h3>
                </div>
                <span className="text-xs font-bold text-fg-subtle">
                  {isAr ? 'الدرجة: ٥٠ درجة' : 'Value: 50 pts'}
                </span>
              </div>

              {/* Uthmanic Arabic Quran Passage */}
              <div className="p-5 rounded-2xl bg-surface-2 ring-1 ring-line/70 text-center font-display text-xl sm:text-2xl leading-[2.2] text-fg select-all" dir="rtl">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ <br />
                تَبَٰرَكَ ٱلَّذِي بِيَدِهِ ٱلۡمُلۡكُ وَهُوَ عَلَىٰ كُلِّ شَيۡءٖ قَدِيرٌ ۝١ ٱلَّذِي خَلَقَ ٱلۡمَوۡتَ وَٱلۡحَيَوٰةَ لِيَبۡلُوَكُمۡ أَيُّكُمۡ أَحۡسَنُ عَمَلٗاۚ وَهُوَ ٱلۡعَزِيزُ ٱلۡغَفُورُ ۝٢ ٱلَّذِي خَلَقَ سَبۡعَ سَمَٰوَٰتٖ طِبَاقٗاۖ مَّا تَرَىٰ فِي خَلۡقِ ٱلرَّحۡمَٰنِ مِن تَفَٰوُتٖۖ فَٱرۡجِعِ ٱلۡبَصَرَ هَلۡ تَرَىٰ مِن فُطُورٖ ۝٣
              </div>

              {/* Pronunciation & Tajweed Target Checklist */}
              <div className="p-3.5 rounded-xl bg-brand-50/50 border border-brand-200 text-xs">
                <span className="font-bold text-brand-ink uppercase tracking-wider block text-[11px] mb-1">
                  {isAr ? 'نقاط التقييم الصوتي المستهدفة:' : 'Tajweed Evaluation Checklist:'}
                </span>
                <ul className="grid sm:grid-cols-2 gap-2 text-fg-muted text-xs">
                  <li className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-accent-500 shrink-0" />
                    <span>{isAr ? 'الإخفاء الحقيقي في (مِن تَفَٰوُتٖ)' : 'Real Ikhfā’ in (min tafāwut)'}</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-accent-500 shrink-0" />
                    <span>{isAr ? 'قلقلة الباء في (لِيَبۡلُوَكُمۡ)' : 'Qalqalah on Bā’ in (liyabluwakum)'}</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-accent-500 shrink-0" />
                    <span>{isAr ? 'المد الطبيعي ومخارج الحلق' : 'Natural Madd & Throat Letters'}</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-accent-500 shrink-0" />
                    <span>{isAr ? 'ترقيق الراء وتفخيمها' : 'Tafkhīm & Tarqīq of Rā’'}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Audio Recording Workbench */}
            <div className="p-6 rounded-3xl bg-surface ring-1 ring-line shadow-sm space-y-5 text-center">
              <div>
                <h4 className="text-base font-bold text-fg">
                  {isAr ? 'تسجيل تلاوتك بصوتك' : 'Voice Recitation Recorder'}
                </h4>
                <p className="text-xs text-fg-muted mt-1">
                  {isAr 
                    ? 'سجّل قراءتك بهدوء ووضوح. سيستمع الشيخ أبو عبد الله المبارك لتسجيلك ويقدم لك تصويباً صوتياً مفصلاً.'
                    : 'Record your recitation clearly. Ustaz Abu Abdullah Al-Mubaarak will review your recording with timestamped feedback.'}
                </p>
              </div>

              {/* Visual Audio Waveform Simulation */}
              <div className="h-16 rounded-2xl bg-surface-2 ring-1 ring-line flex items-center justify-center px-4 gap-1.5 overflow-hidden">
                {isRecording ? (
                  Array.from({ length: 28 }).map((_, i) => (
                    <span
                      key={i}
                      className="w-1.5 bg-brand-ink rounded-full animate-pulse"
                      style={{
                        height: `${Math.max(15, (Math.sin(i * 0.5 + recordingTime) * 35 + 35))}%`,
                        animationDuration: `${0.4 + (i % 5) * 0.1}s`,
                      }}
                    />
                  ))
                ) : hasRecording ? (
                  <div className="flex items-center gap-2 text-xs font-semibold text-brand-ink">
                    <Volume2 className="w-5 h-5 text-accent-500" />
                    <span>{isAr ? 'تم حفظ التسجيل الصوتي بنجاح (جاهز للمراجعة والتسليم)' : 'Audio recitation captured and ready for submission'}</span>
                  </div>
                ) : (
                  <p className="text-xs text-fg-subtle">
                    {isAr ? 'اضغط على زر التسجيل أدناه لبدء التلاوة' : 'Click the record button below to start your recitation'}
                  </p>
                )}
              </div>

              {/* Timer display */}
              {(isRecording || hasRecording) && (
                <div className="tabular text-sm font-bold text-fg">
                  ⏱️ {String(Math.floor(recordingTime / 60)).padStart(2, '0')}:
                  {String(recordingTime % 60).padStart(2, '0')}
                </div>
              )}

              {/* Control Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                {!isRecording ? (
                  <button
                    type="button"
                    onClick={handleStartRecord}
                    className="px-5 py-3 rounded-2xl bg-danger hover:bg-danger/90 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
                  >
                    <Mic className="w-4 h-4" />
                    <span>{hasRecording ? (isAr ? 'إعادة التسجيل' : 'Re-record Audio') : (isAr ? 'بدء تسجيل التلاوة' : 'Start Recording')}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleStopRecord}
                    className="px-5 py-3 rounded-2xl bg-fg hover:bg-fg/90 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
                  >
                    <Square className="w-4 h-4" />
                    <span>{isAr ? 'إيقاف التسجيل' : 'Stop Recording'}</span>
                  </button>
                )}

                {hasRecording && !isRecording && (
                  <>
                    <button
                      type="button"
                      onClick={handleTogglePlay}
                      className="px-4 py-3 rounded-2xl bg-surface-2 ring-1 ring-line hover:bg-surface-3 text-fg font-bold text-xs sm:text-sm transition-all flex items-center gap-2"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      <span>{isPlaying ? (isAr ? 'إيقاف مؤقت' : 'Pause') : (isAr ? 'استماع لتسجيلك' : 'Listen')}</span>
                    </button>

                    {!recitationSubmitted ? (
                      <button
                        type="button"
                        onClick={handleSubmitRecitation}
                        className="px-6 py-3 rounded-2xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs sm:text-sm shadow-lg transition-all flex items-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        <span>{isAr ? 'إرسال التلاوة للشيخ' : 'Submit Recitation to Ustaz'}</span>
                      </button>
                    ) : null}
                  </>
                )}
              </div>

              {/* Submission Confirmation Banner */}
              {recitationSubmitted && (
                <div className="p-4 rounded-2xl bg-success-soft border border-success/30 text-success-fg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 mt-4 animate-fade-in">
                  <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                  <span>
                    {isAr
                      ? 'تم إرسال تلاوتك بنجاح للشيخ أبو عبد الله المبارك! ستصلك ملاحظات التجويد والدرجة هنا قريباً.'
                      : 'Recitation submitted successfully to Ustaz Abu Abdullah Al-Mubaarak! Feedback & grade will appear here.'}
                  </span>
                </div>
              )}
            </div>

            {/* Previous Feedback from Ustaz Abu Abdullah */}
            <div className="p-5 rounded-2xl bg-surface ring-1 ring-line space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-fg-subtle">
                {isAr ? 'آخر تقييم صوتي من المدرس' : 'Previous Instructor Evaluation'}
              </span>

              <div className="p-4 rounded-xl bg-surface-2 ring-1 ring-line/60 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-fg">
                  <span>{isAr ? 'تلاوة سورة النبأ (١ - ١٥)' : 'Surah An-Naba’ (1–15)'}</span>
                  <span className="px-2 py-0.5 rounded bg-success-soft text-success-fg">48 / 50 pts</span>
                </div>
                <p className="text-xs text-fg-muted leading-relaxed">
                  {isAr 
                    ? '«ما شاء الله، مخارج الحروف ممتازة جداً. احرص فقط على إتمام زمن الغنة في النون المشددة بمقدار حركتين دون استعجال.» — الشيخ أبو عبد الله المبارك'
                    : '“Māshā’Allāh, very clear articulation of throat letters. Pay slight attention to giving the full two-count duration to the Ghunnah on the Nūn Mushaddadah.” — Ustaz Abu Abdullah Al-Mubaarak'}
                </p>
              </div>
            </div>

          </div>
        )}

        {/* Announcements */}
        {activeTab === 'announcements' && (
          <div {...panelProps('announcements')} className="space-y-3 outline-none">
            <ul className="space-y-3">
              {MOCK_ANNOUNCEMENTS.map((ann) => (
                <li
                  key={ann.id}
                  className="rounded-2xl bg-surface p-5 ring-1 ring-line shadow-sm space-y-2"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-bold text-sm text-fg">
                      {isAr ? ann.titleAr : ann.titleEn}
                    </h3>
                    <span className="tabular text-xs text-fg-subtle" dir="ltr">
                      {ann.date}
                    </span>
                  </div>
                  <p className="text-xs text-fg-muted leading-relaxed">
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
