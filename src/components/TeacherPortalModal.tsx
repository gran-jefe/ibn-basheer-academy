'use client';

import React, { useState, useEffect } from 'react';
import {
  Check, CheckSquare, FilePlus, PlusCircle, Send, UserCog, Users, Loader2,
  MessageCircle, UserCheck, CheckCircle2, Play, Pause, Volume2, Megaphone,
  Mic, Sparkles, AlertCircle, Clock, ExternalLink
} from 'lucide-react';
import { ACADEMIC_LEVELS, MAJOR_COURSES, MOCK_ASSIGNMENTS } from '@/lib/data/academyData';
import { Modal } from '@/components/ui/Modal';
import { Tabs } from '@/components/ui/Tabs';
import { inputClass, labelClass, selectClass } from '@/components/ui/form';
import type { Lang } from '@/lib/usePreferences';
import {
  createAssignment, publishCourseMaterial, gradeRecitation,
  fetchEnrollmentApplications, updateEnrollmentStatus, publishAnnouncement,
  type ApplicantRecord, MOCK_APPLICANTS
} from '@/lib/services/teacherService';

interface TeacherPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Lang;
}

type TabId = 'admissions' | 'grading' | 'assignment' | 'material' | 'announcements';

interface RecitationQueueItem {
  id: string;
  studentName: string;
  surahName: string;
  verses: string;
  date: string;
  duration: string;
  audioUrl: string;
  status: 'pending' | 'reviewed';
}

const MOCK_RECITATIONS: RecitationQueueItem[] = [
  {
    id: 'rec-1',
    studentName: 'Ahmad Ibrahim (طالب العلم)',
    surahName: 'Surah Al-Mulk',
    verses: 'Verses 1–5',
    date: '2026-09-15',
    duration: '0:42',
    audioUrl: 'https://placeholder.supabase.co/audio/al-mulk-ahmad.mp3',
    status: 'pending',
  },
  {
    id: 'rec-2',
    studentName: 'Maryam Bello (مريم بيلو)',
    surahName: 'Surah An-Naba’',
    verses: 'Verses 1–15',
    date: '2026-09-14',
    duration: '1:15',
    audioUrl: 'https://placeholder.supabase.co/audio/an-naba-maryam.mp3',
    status: 'reviewed',
  },
];

export const TeacherPortalModal: React.FC<TeacherPortalModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  const isAr = lang === 'ar';
  const [activeTab, setActiveTab] = useState<TabId>('admissions');

  // Admissions state
  const [applicants, setApplicants] = useState<ApplicantRecord[]>(MOCK_APPLICANTS);
  const [isUpdatingApplicantId, setIsUpdatingApplicantId] = useState<string | null>(null);

  // Assignment form state
  const [assgTitle, setAssgTitle] = useState('');
  const [assgLevel, setAssgLevel] = useState('tamheediy');
  const [assgCourse, setAssgCourse] = useState('tajweed');
  const [assgPoints, setAssgPoints] = useState('100');
  const [assgDueDate, setAssgDueDate] = useState('');
  const [assgSuccess, setAssgSuccess] = useState(false);
  const [isCreatingAssg, setIsCreatingAssg] = useState(false);

  // Material upload state
  const [matTitle, setMatTitle] = useState('');
  const [matType, setMatType] = useState<'pdf' | 'audio'>('pdf');
  const [matSuccess, setMatSuccess] = useState(false);
  const [isPublishingMat, setIsPublishingMat] = useState(false);

  // Announcements form state
  const [annTitle, setAnnTitle] = useState('');
  const [annCategory, setAnnCategory] = useState('general');
  const [annContent, setAnnContent] = useState('');
  const [annSuccess, setAnnSuccess] = useState(false);
  const [isPublishingAnn, setIsPublishingAnn] = useState(false);

  // Recitation Audio Grading State
  const [recitations, setRecitations] = useState<RecitationQueueItem[]>(MOCK_RECITATIONS);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [recitationScores, setRecitationScores] = useState<Record<string, string>>({ 'rec-1': '48' });
  const [rubricMakharij, setRubricMakharij] = useState<Record<string, boolean>>({ 'rec-1': true });
  const [rubricSifat, setRubricSifat] = useState<Record<string, boolean>>({ 'rec-1': true });
  const [rubricMadd, setRubricMadd] = useState<Record<string, boolean>>({ 'rec-1': false });
  const [teacherNotes, setTeacherNotes] = useState<Record<string, string>>({
    'rec-1': 'Excellent articulation of throat letters in min tafāwut. Review natural madd duration.',
  });
  const [isGradingRecId, setIsGradingRecId] = useState<string | null>(null);
  const [savedRecitations, setSavedRecitations] = useState<Record<string, boolean>>({ 'rec-2': true });

  // Load applicants on open
  useEffect(() => {
    if (isOpen) {
      fetchEnrollmentApplications().then((data) => setApplicants(data));
    }
  }, [isOpen]);

  const handleApproveApplicant = async (appId: string) => {
    setIsUpdatingApplicantId(appId);
    await updateEnrollmentStatus(appId, 'active');
    setApplicants((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: 'active' } : a))
    );
    setIsUpdatingApplicantId(null);
  };

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

  const handlePublishAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPublishingAnn(true);
    await publishAnnouncement({
      titleEn: annTitle,
      titleAr: annTitle,
      contentEn: annContent,
      contentAr: annContent,
      category: annCategory,
    });
    setIsPublishingAnn(false);
    setAnnSuccess(true);
    setAnnTitle('');
    setAnnContent('');
  };

  const handleSaveRecitationGrade = async (recId: string) => {
    setIsGradingRecId(recId);
    await gradeRecitation({
      recitationId: recId,
      score: Number(recitationScores[recId]) || 48,
      feedbackMakharij: rubricMakharij[recId] ? 'Makharij clear with proper throat letters.' : 'Review articulation points.',
      feedbackSifat: rubricSifat[recId] ? 'Qalqalah and Hams correctly observed.' : 'Attention to whispering letters.',
      instructorNotes: teacherNotes[recId] || 'Good effort.',
    });
    setIsGradingRecId(null);
    setSavedRecitations((prev) => ({ ...prev, [recId]: true }));
  };

  const pendingApplicantsCount = applicants.filter((a) => a.status === 'pending').length;
  const pendingRecitationsCount = recitations.filter((r) => !savedRecitations[r.id]).length;

  const tabs = [
    {
      id: 'admissions' as const,
      label: isAr ? 'طلبات القيد' : 'Admissions',
      icon: <UserCheck className="w-4 h-4" aria-hidden="true" />,
      badge: pendingApplicantsCount,
    },
    {
      id: 'grading' as const,
      label: isAr ? 'تقييم التلاوات' : 'Recitation Studio',
      icon: <Mic className="w-4 h-4" aria-hidden="true" />,
      badge: pendingRecitationsCount,
    },
    {
      id: 'assignment' as const,
      label: isAr ? 'واجب جديد' : 'New Assignment',
      icon: <PlusCircle className="w-4 h-4" aria-hidden="true" />,
    },
    {
      id: 'material' as const,
      label: isAr ? 'رفع مادة' : 'Upload Material',
      icon: <FilePlus className="w-4 h-4" aria-hidden="true" />,
    },
    {
      id: 'announcements' as const,
      label: isAr ? 'إعلان أكاديمي' : 'Announcements',
      icon: <Megaphone className="w-4 h-4" aria-hidden="true" />,
    },
  ];

  const successNote = (text: string) => (
    <p
      role="status"
      className="flex items-center gap-2 rounded-xl bg-success-soft px-4 py-3 text-xs font-bold text-success-fg animate-fade-in"
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
      size="xl"
      title={isAr ? 'بوابة المعلم والإشراف الأكاديمي' : 'Teacher & Dean LMS Management Portal'}
      subtitle={
        isAr
          ? 'الشيخ أبو عبد الله المبارك · إدارة القيد، وتصحيح التلاوات، والواجبات والمذكرات'
          : 'Ustaz Abu Abdullah Al-Mubaarak · Admissions, Voice Recitations & Coursework'
      }
      icon={<UserCog className="w-5 h-5 text-accent-400" aria-hidden="true" />}
      closeLabel={isAr ? 'إغلاق' : 'Close'}
    >
      <Tabs
        items={tabs}
        active={activeTab}
        onChange={(id) => setActiveTab(id)}
        label={isAr ? 'أقسام إدارة الأكاديمية' : 'Academy management sections'}
      />

      <div className="p-5 sm:p-6">

        {/* TAB 1: ADMISSIONS & APPLICANTS */}
        {activeTab === 'admissions' && (
          <div {...panelProps('admissions')} className="space-y-4 outline-none">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-fg flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-brand-ink" />
                  <span>{isAr ? 'طلبات الالتحاق بالأكاديمية' : 'Student Admission Applications'}</span>
                </h3>
                <p className="text-xs text-fg-muted mt-0.5">
                  {isAr
                    ? 'تأكد من استلام الرسوم عبر الواتساب قبل تفعيل حساب الطالب.'
                    : 'Verify tuition receipt via WhatsApp before activating student accounts.'}
                </p>
              </div>
              <span className="tabular text-xs font-bold px-2.5 py-1 rounded-full bg-accent-50 text-accent-700">
                {pendingApplicantsCount} {isAr ? 'بانتظار التأكيد' : 'pending'}
              </span>
            </div>

            <ul className="space-y-3">
              {applicants.map((app) => {
                const isActive = app.status === 'active';
                const levelData = ACADEMIC_LEVELS.find((l) => l.id === app.levelId);
                const courseData = MAJOR_COURSES.find((c) => c.id === app.courseId);

                const cleanPhone = app.phone.replace(/\D/g, '');
                const waMessage = encodeURIComponent(
                  `السلام عليكم ورحمة الله وبركاته يا ${app.fullName}، مرحباً بك في أكاديمية ابن بشير. نود تأكيد استلام الرسوم الدراسية الخاصة بالمستوى (${levelData ? levelData.titleAr : app.levelId}).`
                );
                const waLink = `https://wa.me/${cleanPhone}?text=${waMessage}`;

                return (
                  <li
                    key={app.id}
                    className="p-5 rounded-2xl bg-surface ring-1 ring-line shadow-xs space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-fg">{app.fullName}</h4>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isActive ? 'bg-success-soft text-success-fg' : 'bg-warn-soft text-warn-fg'
                            }`}
                          >
                            {isActive ? (isAr ? 'مقبول ونشط' : 'Active Student') : (isAr ? 'قيد المراجعة' : 'Pending Review')}
                          </span>
                        </div>
                        <p className="text-xs text-fg-muted mt-0.5">
                          {app.email} • <span dir="ltr">{app.phone}</span>
                        </p>
                      </div>

                      <span className="tabular text-xs text-fg-subtle" dir="ltr">
                        {app.appliedAt}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-surface-2 ring-1 ring-line/60 text-xs text-fg-muted flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="font-bold text-fg">
                          {isAr ? 'المستوى: ' : 'Level: '}
                        </span>
                        <span>{isAr ? levelData?.titleAr : levelData?.titleEn}</span>
                        {courseData && (
                          <span className="ms-2">
                            • <span className="font-bold text-fg">{isAr ? 'المادة: ' : 'Subject: '}</span>
                            <span>{isAr ? courseData.titleAr : courseData.titleEn}</span>
                          </span>
                        )}
                      </div>
                      {app.notes && (
                        <div className="text-[11px] text-fg-subtle italic truncate max-w-xs">
                          &ldquo;{app.notes}&rdquo;
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 rounded-xl bg-accent-50 hover:bg-accent-100 text-accent-900 border border-accent-200 text-xs font-bold transition-colors flex items-center gap-1.5"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-accent-700" />
                        <span>{isAr ? 'محادثة عبر الواتساب' : 'Chat on WhatsApp'}</span>
                      </a>

                      {!isActive ? (
                        <button
                          type="button"
                          disabled={isUpdatingApplicantId === app.id}
                          onClick={() => handleApproveApplicant(app.id)}
                          className="px-4 py-1.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
                        >
                          {isUpdatingApplicantId === app.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          )}
                          <span>{isAr ? 'تأكيد القيد وتفعيل الطالب' : 'Approve & Activate'}</span>
                        </button>
                      ) : (
                        <span className="text-xs text-success font-bold flex items-center gap-1">
                          <Check className="w-4 h-4" />
                          <span>{isAr ? 'تم تفعيل الحساب' : 'Activated'}</span>
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* TAB 2: VOICE RECITATION GRADING WORKBENCH */}
        {activeTab === 'grading' && (
          <div {...panelProps('grading')} className="space-y-4 outline-none">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-fg flex items-center gap-2">
                  <Mic className="w-4 h-4 text-accent-600" />
                  <span>{isAr ? 'استوديو تصحيح التلاوة والتجويد' : 'Quran Recitation Evaluation Studio'}</span>
                </h3>
                <p className="text-xs text-fg-muted mt-0.5">
                  {isAr
                    ? 'استمع لتلاوة الطالب وسجل ملاحظات المخارج والصفات وأحكام النون والمد.'
                    : 'Listen to recordings, evaluate phonetic points, and issue scores.'}
                </p>
              </div>
            </div>

            <ul className="space-y-4">
              {recitations.map((item) => {
                const isSaved = savedRecitations[item.id];
                const isPlaying = playingAudioId === item.id;

                return (
                  <li
                    key={item.id}
                    className="p-5 sm:p-6 rounded-3xl bg-surface ring-1 ring-line shadow-sm space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-accent-700 bg-accent-50 px-2 py-0.5 rounded">
                          {isAr ? 'تسجيل تلاوة صوتي' : 'Student Audio Recitation'}
                        </span>
                        <h4 className="font-bold text-base text-fg mt-1">
                          {item.studentName} — <span className="font-display">{item.surahName} ({item.verses})</span>
                        </h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="tabular text-xs text-fg-subtle" dir="ltr">{item.date}</span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            isSaved ? 'bg-success-soft text-success-fg' : 'bg-warn-soft text-warn-fg'
                          }`}
                        >
                          {isSaved ? (isAr ? 'تم التقييم' : 'Graded') : (isAr ? 'بانتظار المراجعة' : 'Pending')}
                        </span>
                      </div>
                    </div>

                    {/* Audio Player Strip */}
                    <div className="p-4 rounded-2xl bg-surface-2 ring-1 ring-line/70 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setPlayingAudioId(isPlaying ? null : item.id)}
                          className="w-10 h-10 rounded-full bg-brand-700 hover:bg-brand-800 text-white flex items-center justify-center shadow-md transition-transform active:scale-95"
                        >
                          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ms-0.5" />}
                        </button>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-fg">
                              {isPlaying ? (isAr ? 'جاري الاستماع...' : 'Playing Recitation...') : (isAr ? 'جاهز للاستماع' : 'Audio Ready')}
                            </span>
                            <span className="tabular text-[11px] text-fg-subtle">({item.duration})</span>
                          </div>
                          <div className="w-36 sm:w-48 h-1.5 bg-line rounded-full mt-1.5 overflow-hidden">
                            <div
                              className={`h-full bg-accent-500 rounded-full transition-all duration-300 ${
                                isPlaying ? 'w-2/3 animate-pulse' : 'w-0'
                              }`}
                            />
                          </div>
                        </div>
                      </div>

                      <span className="text-xs font-medium text-fg-muted hidden sm:inline">
                        🎤 {isAr ? 'جودة الصوت: نقية' : 'Quality: Clear Waveform'}
                      </span>
                    </div>

                    {/* Tajweed Evaluation Rubric Checklist */}
                    <div className="p-4 rounded-2xl bg-surface-2 ring-1 ring-line/60 space-y-3">
                      <span className="text-xs font-bold text-brand-ink uppercase tracking-wider block">
                        {isAr ? 'معايير التقييم التجويدي:' : 'Tajweed Rubric Checkpoints:'}
                      </span>
                      <div className="grid sm:grid-cols-3 gap-2 text-xs">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={rubricMakharij[item.id] ?? false}
                            onChange={(e) =>
                              setRubricMakharij((prev) => ({ ...prev, [item.id]: e.target.checked }))
                            }
                            className="rounded text-brand-700 focus:ring-brand-500"
                          />
                          <span>{isAr ? 'مخارج الحروف الحلقية' : 'Throat Makhārij'}</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={rubricSifat[item.id] ?? false}
                            onChange={(e) =>
                              setRubricSifat((prev) => ({ ...prev, [item.id]: e.target.checked }))
                            }
                            className="rounded text-brand-700 focus:ring-brand-500"
                          />
                          <span>{isAr ? 'صفات القلقلة والهمس' : 'Qalqalah & Hams'}</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={rubricMadd[item.id] ?? false}
                            onChange={(e) =>
                              setRubricMadd((prev) => ({ ...prev, [item.id]: e.target.checked }))
                            }
                            className="rounded text-brand-700 focus:ring-brand-500"
                          />
                          <span>{isAr ? 'أحكام المد الطبيعي' : 'Natural Madd Duration'}</span>
                        </label>
                      </div>

                      {/* Instructor Remarks & Marks */}
                      <div className="grid sm:grid-cols-4 gap-3 pt-2">
                        <div className="sm:col-span-1">
                          <label className={labelClass}>
                            {isAr ? 'الدرجة (من ٥٠)' : 'Score (Out of 50)'}
                          </label>
                          <input
                            type="number"
                            min={0}
                            max={50}
                            value={recitationScores[item.id] ?? ''}
                            onChange={(e) =>
                              setRecitationScores((prev) => ({ ...prev, [item.id]: e.target.value }))
                            }
                            placeholder="48"
                            className={`${inputClass} tabular font-bold`}
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label className={labelClass}>
                            {isAr ? 'ملاحظات وتوجيهات الشيخ' : 'Instructor Remarks & Advice'}
                          </label>
                          <input
                            type="text"
                            value={teacherNotes[item.id] ?? ''}
                            onChange={(e) =>
                              setTeacherNotes((prev) => ({ ...prev, [item.id]: e.target.value }))
                            }
                            placeholder={isAr ? 'تلاوة طيبة، راجع زمن الغنة في الميم المشددة...' : 'Great recitation, review Ghunnah duration...'}
                            className={inputClass}
                          />
                        </div>
                      </div>

                      <div className="pt-2 flex justify-end">
                        <button
                          type="button"
                          disabled={isGradingRecId === item.id}
                          onClick={() => handleSaveRecitationGrade(item.id)}
                          className="px-5 py-2 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
                        >
                          {isGradingRecId === item.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Check className="w-3.5 h-3.5" />
                          )}
                          <span>
                            {isGradingRecId === item.id
                              ? (isAr ? 'جاري الحفظ...' : 'Saving...')
                              : (isAr ? 'حفظ التقييم وإرسال الدرجة للطالب' : 'Save Grade & Feedback')}
                          </span>
                        </button>
                      </div>
                    </div>

                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* TAB 3: CREATE ASSIGNMENT */}
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
                  ? 'تم نشر الواجب وحفظه في قاعدة البيانات وإرساله إلى الطلاب.'
                  : 'Assignment published and saved to Supabase successfully.',
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
              className="w-full py-3 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-md"
            >
              {isCreatingAssg ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" aria-hidden="true" />}
              <span>{isCreatingAssg ? (isAr ? 'جاري النشر...' : 'Publishing...') : (isAr ? 'نشر الواجب للطلاب' : 'Publish Assignment')}</span>
            </button>
          </form>
        )}

        {/* TAB 4: UPLOAD MATERIAL */}
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
              className="w-full py-3 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-md"
            >
              {isPublishingMat ? <Loader2 className="w-4 h-4 animate-spin" /> : <FilePlus className="w-4 h-4" aria-hidden="true" />}
              <span>{isPublishingMat ? (isAr ? 'جاري الرفع للمنصة...' : 'Uploading...') : (isAr ? 'رفع المادة' : 'Upload to LMS')}</span>
            </button>
          </form>
        )}

        {/* TAB 5: BROADCAST ANNOUNCEMENT */}
        {activeTab === 'announcements' && (
          <form
            {...panelProps('announcements')}
            onSubmit={handlePublishAnnouncement}
            className={`${cardClass} outline-none`}
          >
            <h3 className="font-bold text-fg flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-accent-600" />
              <span>{isAr ? 'نشر إعلان أكاديمي عام' : 'Broadcast Academy Announcement'}</span>
            </h3>

            {annSuccess &&
              successNote(
                isAr
                  ? 'تم نشر الإعلان وظهر لجميع الطلاب في البوابة.'
                  : 'Announcement broadcast to all student dashboards.',
              )}

            <div>
              <label className={labelClass}>{isAr ? 'عنوان الإعلان' : 'Announcement Title'}</label>
              <input
                type="text"
                required
                value={annTitle}
                onChange={(e) => { setAnnTitle(e.target.value); setAnnSuccess(false); }}
                placeholder={isAr ? 'تعديل جدول الحصص لشهر رمضان المبارك' : 'e.g. Schedule adjustments for Ramadan'}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>{isAr ? 'التصنيف' : 'Category'}</label>
              <select
                value={annCategory}
                onChange={(e) => setAnnCategory(e.target.value)}
                className={selectClass}
              >
                <option value="general">{isAr ? 'عام' : 'General'}</option>
                <option value="schedule">{isAr ? 'جدول ومواعيد' : 'Schedule'}</option>
                <option value="exam">{isAr ? 'اختبارات' : 'Exams'}</option>
                <option value="event">{isAr ? 'مناسبات وندوات' : 'Events'}</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>{isAr ? 'نص الإعلان' : 'Announcement Content'}</label>
              <textarea
                rows={4}
                required
                value={annContent}
                onChange={(e) => setAnnContent(e.target.value)}
                placeholder={isAr ? 'اكتب تفاصيل الإعلان هنا...' : 'Write announcement details...'}
                className="w-full text-xs p-3.5 rounded-2xl bg-surface-2 ring-1 ring-line text-fg placeholder:text-fg-subtle focus:outline-none focus:ring-2 focus:ring-brand-500 leading-relaxed resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isPublishingAnn}
              className="w-full py-3 rounded-xl bg-accent-600 hover:bg-accent-700 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-md"
            >
              {isPublishingAnn ? <Loader2 className="w-4 h-4 animate-spin" /> : <Megaphone className="w-4 h-4" />}
              <span>{isPublishingAnn ? (isAr ? 'جاري البث...' : 'Broadcasting...') : (isAr ? 'بث الإعلان للطلاب' : 'Broadcast Announcement')}</span>
            </button>
          </form>
        )}

      </div>
    </Modal>
  );
};
