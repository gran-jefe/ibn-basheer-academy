'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BookOpen, LogOut, Globe, Sun, Moon, UserCog, UserCheck,
  Mic, PlusCircle, FilePlus, Megaphone, MessageCircle, Play, Pause,
  Volume2, Check, AlertCircle, Loader2, ArrowLeft, ArrowRight,
  Sparkles, ExternalLink
} from 'lucide-react';
import { usePreferences } from '@/lib/usePreferences';
import {
  fetchEnrollmentApplications, updateEnrollmentStatus, gradeRecitation,
  createAssignment, publishCourseMaterial, publishAnnouncement,
  type ApplicantRecord, MOCK_APPLICANTS
} from '@/lib/services/teacherService';
import { ACADEMIC_LEVELS, MAJOR_COURSES, ACADEMY_INFO, type Course } from '@/lib/data/academyData';
import { getCurrentUser, signOut, type UserProfile } from '@/lib/services/authService';

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

export default function TeacherPortalPage() {
  const router = useRouter();
  const { lang, setLang, theme, toggleTheme } = usePreferences();
  const isAr = lang === 'ar';

  const [user, setUser] = useState<UserProfile | null>(null);
  const [authChecking, setAuthChecking] = useState(true);

  const [activeTab, setActiveTab] = useState<TabId>('admissions');

  // Admissions state
  const [applicants, setApplicants] = useState<ApplicantRecord[]>(MOCK_APPLICANTS);
  const [isUpdatingApplicantId, setIsUpdatingApplicantId] = useState<string | null>(null);

  // Assignment form state
  const [assgTitle, setAssgTitle] = useState('');
  const [assgLevel, setAssgLevel] = useState('tamheediy');
  const [assgCourse, setAssgCourse] = useState('tajweed');
  const [assgDueDate, setAssgDueDate] = useState('');
  const [assgPoints, setAssgPoints] = useState('100');
  const [assgSuccess, setAssgSuccess] = useState(false);
  const [isCreatingAssg, setIsCreatingAssg] = useState(false);

  // Material form state
  const [matTitle, setMatTitle] = useState('');
  const [matType, setMatType] = useState<'pdf' | 'audio'>('pdf');
  const [matCourse, setMatCourse] = useState('tajweed');
  const [matSizeOrDuration, setMatSizeOrDuration] = useState('2.4 MB');
  const [matDownloadUrl, setMatDownloadUrl] = useState('#');
  const [matSuccess, setMatSuccess] = useState(false);
  const [isPublishingMat, setIsPublishingMat] = useState(false);

  // Announcement state
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

  useEffect(() => {
    let mounted = true;
    getCurrentUser().then((u) => {
      if (mounted) {
        setUser(u);
        setAuthChecking(false);
      }
    });
    fetchEnrollmentApplications().then((apps) => {
      if (mounted && apps.length > 0) setApplicants(apps);
    });
    return () => { mounted = false; };
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
    router.push('/login');
  };


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
      title: matTitle,
      type: matType,
      courseId: matCourse,
      sizeOrDuration: matSizeOrDuration,
      downloadUrl: matDownloadUrl,
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
    { id: 'admissions' as const, label: isAr ? 'طلبات القيد والقبول' : 'Admissions Queue', icon: <UserCheck className="w-4 h-4" />, badge: pendingApplicantsCount },
    { id: 'grading' as const, label: isAr ? 'تقييم التلاوات' : 'Recitation Studio', icon: <Mic className="w-4 h-4" />, badge: pendingRecitationsCount },
    { id: 'assignment' as const, label: isAr ? 'إضافة واجب جديد' : 'New Assignment', icon: <PlusCircle className="w-4 h-4" /> },
    { id: 'material' as const, label: isAr ? 'رفع مذكرة / مادة' : 'Upload Material', icon: <FilePlus className="w-4 h-4" /> },
    { id: 'announcements' as const, label: isAr ? 'بث إعلان أكاديمي' : 'Publish Announcement', icon: <Megaphone className="w-4 h-4" /> },
  ];

  if (authChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper text-fg">
        <Loader2 className="w-8 h-8 animate-spin text-brand-700" />
      </div>
    );
  }

  /* Unauthenticated Guard Screen */
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-paper text-fg">
        <header className="border-b border-line/60 bg-surface/80 p-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-xs font-bold text-fg-muted hover:text-fg">
              {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              <span>{isAr ? 'العودة للرئيسية' : 'Back to Academy'}</span>
            </Link>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full p-8 rounded-3xl bg-surface ring-1 ring-line shadow-sm text-center space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-brand-900 text-accent-400 flex items-center justify-center mx-auto shadow-sm">
              <UserCog className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-fg font-display">
                {isAr ? 'يلزم تسجيل دخول هيئة التدريس والإدارة' : 'Faculty & Admin Credentials Required'}
              </h1>
              <p className="text-xs sm:text-sm text-fg-muted mt-2 leading-relaxed">
                {isAr
                  ? 'هذه البوابة مخصصة للشيخ وإدارة الأكاديمية لمراجعة القيد، وتصحيح التلاوات، ونشر المقررات.'
                  : 'This portal is restricted to instructors and administrators for reviewing admissions, grading recitations, and curriculum publishing.'}
              </p>
            </div>

            <div className="space-y-3">
              <Link
                href="/login?redirect=/teacher"
                className="w-full py-3.5 px-4 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>{isAr ? 'تسجيل الدخول بحساب المعلم' : 'Sign In as Faculty / Admin'}</span>
              </Link>

              <p className="text-xs text-fg-subtle pt-2 border-t border-line">
                {isAr
                  ? 'يتم إصدار حسابات المشايخ وإدارة الأكاديمية حصرياً من قبل عمادة القبول والتسجيل.'
                  : 'Faculty and administrative accounts are provisioned exclusively by the academy registry.'}
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-paper text-fg">
      {/* Faculty Bar */}
      <header className="sticky top-0 z-40 bg-brand-950 text-white border-b border-brand-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-accent-400 text-brand-950 flex items-center justify-center font-bold shadow-xs">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="hidden sm:block">
                <p className="font-bold text-sm leading-tight text-white group-hover:text-accent-300 transition-colors">
                  {isAr ? 'أكاديمية ابن بشير' : 'Ibn Basheer Academy'}
                </p>
                <p className="text-[11px] text-accent-400 leading-none mt-0.5">
                  {isAr ? 'بوابة هيئة التدريس والإدارة' : 'Faculty & Admin LMS Portal'}
                </p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl text-brand-200 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={() => setLang(isAr ? 'en' : 'ar')}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-brand-200 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{isAr ? 'EN' : 'ع'}</span>
            </button>

            <div className="w-px h-5 bg-white/20 hidden sm:block" />

            <div className="flex items-center gap-2 ps-1">
              <div className="w-8 h-8 rounded-full bg-accent-400 text-brand-950 font-extrabold flex items-center justify-center text-xs">
                {user.fullName.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-bold text-white hidden lg:inline max-w-[140px] truncate">
                {user.fullName}
              </span>
              <button
                type="button"
                onClick={handleSignOut}
                className="p-2 rounded-xl text-brand-200 hover:text-danger hover:bg-white/10 transition-colors"
                title={isAr ? 'تسجيل الخروج' : 'Sign Out'}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Faculty Header Card */}
        <section className="rounded-3xl bg-surface p-6 sm:p-8 ring-1 ring-line shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-line/60 pb-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-accent-50 text-accent-800 text-xs font-bold ring-1 ring-accent-200">
                  {isAr ? 'هيئة التدريس والإدارة' : 'Faculty & Admin'}
                </span>
                <span className="text-xs text-fg-subtle" dir="ltr">{user.email}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-ink font-display">
                {user.fullName}
              </h1>
              <p className="text-sm text-fg-muted font-medium">
                {isAr
                  ? 'المشرف العام · مراجعة القبول، تصحيح التلاوات، وإدارة الفصول والواجبات'
                  : 'Director & Lead Instructor · Admissions verification, voice recitation grading & coursework publishing'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 shrink-0">
              <div className="p-4 rounded-2xl bg-surface-2 ring-1 ring-line text-center">
                <p className="text-[11px] font-bold text-fg-subtle">{isAr ? 'طلبات قيد قيد المراجعة' : 'Pending Admissions'}</p>
                <p className="text-2xl font-extrabold text-accent-700 mt-1">{pendingApplicantsCount}</p>
              </div>
              <div className="p-4 rounded-2xl bg-surface-2 ring-1 ring-line text-center">
                <p className="text-[11px] font-bold text-fg-subtle">{isAr ? 'تلاوات تحتاج تصحيح' : 'Recitations to Grade'}</p>
                <p className="text-2xl font-extrabold text-brand-ink mt-1">{pendingRecitationsCount}</p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap items-center gap-2 border-b border-line pb-4">
            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                    active
                      ? 'bg-brand-700 text-white shadow-md'
                      : 'bg-surface-2 text-fg-muted hover:bg-surface-3 hover:text-fg ring-1 ring-line'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.badge ? (
                    <span className="px-2 py-0.5 rounded-full bg-accent-400 text-brand-950 font-extrabold text-[11px]">
                      {tab.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          {/* TAB 1: ADMISSIONS QUEUE */}
          {activeTab === 'admissions' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-fg">
                    {isAr ? 'طلبات الالتحاق بالأكاديمية (التحقق من الرسوم والتفعيل)' : 'Student Admissions & Tuition Verification'}
                  </h3>
                  <p className="text-xs text-fg-muted mt-1">
                    {isAr
                      ? 'تواصل مع الطالب عبر الواتساب بنقرة واحدة لتأكيد تسديد الرسوم وتفعيل حسابه الدراسي.'
                      : 'Connect with applicants on WhatsApp with 1 click to verify tuition and activate their student status.'}
                  </p>
                </div>
                <span className="text-xs font-bold text-fg-subtle">{applicants.length} {isAr ? 'طالب' : 'applicants'}</span>
              </div>

              <div className="overflow-x-auto rounded-2xl ring-1 ring-line">
                <table className="w-full text-xs sm:text-sm text-start border-collapse">
                  <thead>
                    <tr className="border-b border-line bg-surface-2 text-fg font-extrabold text-[11px] uppercase tracking-wider">
                      <th className="py-3 px-4 text-start">{isAr ? 'اسم الطالب' : 'Applicant'}</th>
                      <th className="py-3 px-4 text-start">{isAr ? 'المرحلة' : 'Track'}</th>
                      <th className="py-3 px-4 text-start">{isAr ? 'الواتساب والبريد' : 'Contact'}</th>
                      <th className="py-3 px-4 text-center">{isAr ? 'تاريخ التقديم' : 'Applied'}</th>
                      <th className="py-3 px-4 text-center">{isAr ? 'الحالة' : 'Status'}</th>
                      <th className="py-3 px-4 text-end">{isAr ? 'إجراءات الشيخ' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line/60">
                    {applicants.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-10 text-center text-fg-muted text-xs sm:text-sm">
                          {isAr ? 'لا توجد طلبات قيد جديدة بانتظار المراجعة حالياً.' : 'No enrollment applications pending review.'}
                        </td>
                      </tr>
                    ) : (
                      applicants.map((app) => {
                      const isPending = app.status === 'pending';
                      const levelObj = ACADEMIC_LEVELS.find((l) => l.id === app.levelId);
                      const levelName = isAr ? levelObj?.titleAr : levelObj?.titleEn;

                      const whatsAppText = isAr
                        ? encodeURIComponent(`السلام عليكم يا ${app.fullName}، بخصوص طلب قيدك في أكاديمية ابن بشير (${levelName})، نود تأكيد استلام إشعار التحويل البنكي لتفعيل حسابك ومقعدك.`)
                        : encodeURIComponent(`As-salāmu 'alaykum ${app.fullName}, regarding your enrollment application at Ibn Basheer Academy for ${levelName}, please share your tuition transfer receipt to activate your student account.`);
                      const cleanPhone = app.phone.replace(/[^0-9]/g, '');
                      const chatUrl = `https://wa.me/${cleanPhone}?text=${whatsAppText}`;

                      return (
                        <tr key={app.id} className="hover:bg-surface-2/40 transition-colors">
                          <td className="py-3.5 px-4 font-extrabold text-fg">{app.fullName}</td>
                          <td className="py-3.5 px-4 text-xs font-semibold text-brand-ink">{levelName || app.levelId}</td>
                          <td className="py-3.5 px-4 text-xs text-fg-muted">
                            <span dir="ltr" className="block font-mono">{app.phone}</span>
                            <span className="block text-[11px] text-fg-subtle">{app.email}</span>
                          </td>
                          <td className="py-3.5 px-4 text-center text-xs text-fg-subtle tabular" dir="ltr">{app.appliedAt}</td>
                          <td className="py-3.5 px-4 text-center">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${isPending ? 'bg-warn-soft text-warn-fg' : 'bg-success-soft text-success-fg'}`}>
                              {isPending ? (isAr ? 'بانتظار الرسوم' : 'Pending Tuition') : (isAr ? 'مقبول ونشط' : 'Active Student')}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-end">
                            <div className="flex items-center justify-end gap-2">
                              <a
                                href={chatUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-xl bg-surface hover:bg-surface-2 ring-1 ring-line text-xs font-bold text-fg transition-all flex items-center gap-1.5"
                                title={isAr ? 'مراسلة عبر واتساب' : 'Chat on WhatsApp'}
                              >
                                <MessageCircle className="w-3.5 h-3.5 text-brand-700" />
                                <span className="hidden sm:inline">{isAr ? 'واتساب' : 'WhatsApp'}</span>
                              </a>
                              {isPending ? (
                                <button
                                  type="button"
                                  disabled={isUpdatingApplicantId === app.id}
                                  onClick={() => handleApproveApplicant(app.id)}
                                  className="px-3 py-1.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-50"
                                >
                                  {isUpdatingApplicantId === app.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                                  <span>{isAr ? 'تفعيل القيد' : 'Approve'}</span>
                                </button>
                              ) : (
                                <span className="text-xs text-success-fg font-bold flex items-center gap-1">
                                  <Check className="w-3.5 h-3.5 text-success" />
                                  <span>{isAr ? 'تم التفعيل' : 'Enrolled'}</span>
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: RECITATION GRADING WORKBENCH */}
          {activeTab === 'grading' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-fg">
                    {isAr ? 'استوديو تصحيح التلاوات الصوتي وملاحظات التجويد' : 'Voice Recitation Evaluation Workbench'}
                  </h3>
                  <p className="text-xs text-fg-muted mt-1">
                    {isAr
                      ? 'استمع لتسجيلات الطلاب واعتمد درجات مخارج الحروف، والصفات، والمدود مع إضافة ملاحظاتك.'
                      : 'Listen to student recordings, apply the Tajweed rubric, and record marks out of 50.'}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {recitations.map((rec) => {
                  const isPlayingThis = playingAudioId === rec.id;
                  const isGraded = savedRecitations[rec.id];

                  return (
                    <div key={rec.id} className="p-6 sm:p-8 rounded-3xl bg-surface-2 ring-1 ring-line shadow-xs space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-fg-subtle">
                            {rec.surahName} · {rec.verses}
                          </span>
                          <h4 className="text-base sm:text-lg font-extrabold text-fg mt-1">
                            {rec.studentName}
                          </h4>
                          <p className="text-xs text-fg-muted mt-0.5 tabular" dir="ltr">{rec.date} · {rec.duration}</p>
                        </div>

                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${isGraded ? 'bg-success-soft text-success-fg' : 'bg-warn-soft text-warn-fg'}`}>
                          {isGraded ? (isAr ? 'تم التصحيح والاعتماد' : 'Graded & Saved') : (isAr ? 'بانتظار تصحيح الشيخ' : 'Pending Review')}
                        </span>
                      </div>

                      {/* Audio Player */}
                      <div className="p-4 rounded-2xl bg-surface ring-1 ring-line flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                          <button
                            type="button"
                            onClick={() => setPlayingAudioId(isPlayingThis ? null : rec.id)}
                            className="w-11 h-11 rounded-2xl bg-brand-700 hover:bg-brand-800 text-white flex items-center justify-center shrink-0 shadow-xs transition-colors"
                          >
                            {isPlayingThis ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                          </button>
                          <div>
                            <p className="text-xs font-bold text-fg">
                              {isPlayingThis ? (isAr ? 'قيد الاستماع للتلاوة...' : 'Playing student audio...') : (isAr ? 'تسجيل تلاوة الطالب' : 'Student Recitation Recording')}
                            </p>
                            <p className="text-[11px] text-fg-subtle">{rec.duration}</p>
                          </div>
                        </div>

                        <audio
                          controls
                          className="w-full sm:w-72 h-8"
                          src="https://cdn.islamic.network/quran/audio/128/ar.alafasy/67.mp3"
                        />
                      </div>

                      {/* Rubric and Marks */}
                      <div className="grid sm:grid-cols-3 gap-4 pt-2">
                        <label className="p-4 rounded-xl bg-surface ring-1 ring-line flex items-center justify-between cursor-pointer">
                          <span className="text-xs font-bold text-fg">{isAr ? 'مخارج الحروف (Makhārij)' : 'Makhārij (Articulation)'}</span>
                          <input
                            type="checkbox"
                            checked={rubricMakharij[rec.id] ?? true}
                            onChange={(e) => setRubricMakharij((m) => ({ ...m, [rec.id]: e.target.checked }))}
                            className="w-4 h-4 rounded text-brand-700 focus:ring-brand-ring"
                          />
                        </label>
                        <label className="p-4 rounded-xl bg-surface ring-1 ring-line flex items-center justify-between cursor-pointer">
                          <span className="text-xs font-bold text-fg">{isAr ? 'الصفات والقلقلة (Ṣifāt)' : 'Ṣifāt (Phonetics)'}</span>
                          <input
                            type="checkbox"
                            checked={rubricSifat[rec.id] ?? true}
                            onChange={(e) => setRubricSifat((m) => ({ ...m, [rec.id]: e.target.checked }))}
                            className="w-4 h-4 rounded text-brand-700 focus:ring-brand-ring"
                          />
                        </label>
                        <label className="p-4 rounded-xl bg-surface ring-1 ring-line flex items-center justify-between cursor-pointer">
                          <span className="text-xs font-bold text-fg">{isAr ? 'المدود والغنة (Madd)' : 'Madd & Ghunnah'}</span>
                          <input
                            type="checkbox"
                            checked={rubricMadd[rec.id] ?? false}
                            onChange={(e) => setRubricMadd((m) => ({ ...m, [rec.id]: e.target.checked }))}
                            className="w-4 h-4 rounded text-brand-700 focus:ring-brand-ring"
                          />
                        </label>
                      </div>

                      {/* Score and Notes */}
                      <div className="grid sm:grid-cols-12 gap-4">
                        <div className="sm:col-span-3">
                          <label className="block text-xs font-bold text-fg mb-1.5">
                            {isAr ? 'الدرجة من ٥٠:' : 'Score (Out of 50):'}
                          </label>
                          <input
                            type="number"
                            max={50}
                            min={0}
                            value={recitationScores[rec.id] ?? '48'}
                            onChange={(e) => setRecitationScores((s) => ({ ...s, [rec.id]: e.target.value }))}
                            className="w-full px-4 py-2.5 rounded-xl bg-surface ring-1 ring-line font-bold text-sm text-fg"
                          />
                        </div>
                        <div className="sm:col-span-9">
                          <label className="block text-xs font-bold text-fg mb-1.5">
                            {isAr ? 'ملاحظات وتوجيهات الشيخ للطالب:' : 'Instructor Feedback & Notes:'}
                          </label>
                          <input
                            type="text"
                            value={teacherNotes[rec.id] ?? ''}
                            onChange={(e) => setTeacherNotes((n) => ({ ...n, [rec.id]: e.target.value }))}
                            placeholder={isAr ? 'ما شاء الله، مخارج واضحة. انتبه لزمن الغنة...' : 'Clear throat letters. Review Ghunnah count...'}
                            className="w-full px-4 py-2.5 rounded-xl bg-surface ring-1 ring-line text-xs text-fg"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="button"
                          disabled={isGradingRecId === rec.id}
                          onClick={() => handleSaveRecitationGrade(rec.id)}
                          className="px-6 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                          {isGradingRecId === rec.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                          <span>{isAr ? 'حفظ التقييم وإرساله للطالب' : 'Save & Send Evaluation'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: CREATE ASSIGNMENT */}
          {activeTab === 'assignment' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div>
                <h3 className="text-lg font-bold text-fg">
                  {isAr ? 'نشر واجب دراسي وتكليف جديد' : 'Publish New Coursework Assignment'}
                </h3>
                <p className="text-xs text-fg-muted mt-1">
                  {isAr
                    ? 'أضف عنوان الواجب وتاريخ التسليم. سيظهر مباشرة في بوابة الطلاب.'
                    : 'Add assignment title and due date. This will appear instantly in the student portal.'}
                </p>
              </div>

              {assgSuccess && (
                <div className="p-4 rounded-2xl bg-success-soft text-success-fg text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4 text-success" />
                  <span>{isAr ? 'تم نشر الواجب بنجاح في المنصة!' : 'Assignment published successfully!'}</span>
                </div>
              )}

              <form onSubmit={handleCreateAssignment} className="p-6 sm:p-8 rounded-3xl bg-surface-2 ring-1 ring-line space-y-4">
                <div>
                  <label className="block text-xs font-bold text-fg mb-1.5">{isAr ? 'عنوان الواجب' : 'Assignment Title'}</label>
                  <input
                    type="text"
                    required
                    value={assgTitle}
                    onChange={(e) => setAssgTitle(e.target.value)}
                    placeholder={isAr ? 'إعراب سورة العصر وتطبيق قواعد النحو' : 'Grammatical Parsing of Surah Al-Asr'}
                    className="w-full px-4 py-3 rounded-xl bg-surface ring-1 ring-line text-sm text-fg outline-none focus:ring-2 focus:ring-brand-ring"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-fg mb-1.5">{isAr ? 'المرحلة' : 'Stage'}</label>
                    <select
                      value={assgLevel}
                      onChange={(e) => setAssgLevel(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-surface ring-1 ring-line text-xs text-fg"
                    >
                      {ACADEMIC_LEVELS.map((lvl) => (
                        <option key={lvl.id} value={lvl.id}>{isAr ? lvl.titleAr : lvl.titleEn}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-fg mb-1.5">{isAr ? 'المادة' : 'Subject'}</label>
                    <select
                      value={assgCourse}
                      onChange={(e) => setAssgCourse(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-surface ring-1 ring-line text-xs text-fg"
                    >
                      {MAJOR_COURSES.map((c: Course) => (
                        <option key={c.id} value={c.id}>{isAr ? c.titleAr : c.titleEn}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-fg mb-1.5">{isAr ? 'تاريخ التسليم الأخير' : 'Due Date'}</label>
                    <input
                      type="date"
                      required
                      value={assgDueDate}
                      onChange={(e) => setAssgDueDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-surface ring-1 ring-line text-xs text-fg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-fg mb-1.5">{isAr ? 'الدرجة الكلية' : 'Total Points'}</label>
                    <input
                      type="number"
                      value={assgPoints}
                      onChange={(e) => setAssgPoints(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-surface ring-1 ring-line text-xs text-fg"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isCreatingAssg}
                  className="w-full py-3.5 px-4 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2 mt-2"
                >
                  {isCreatingAssg ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
                  <span>{isCreatingAssg ? (isAr ? 'جاري النشر...' : 'Publishing...') : (isAr ? 'نشر الواجب للطلاب' : 'Publish Assignment')}</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: PUBLISH MATERIAL */}
          {activeTab === 'material' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div>
                <h3 className="text-lg font-bold text-fg">
                  {isAr ? 'رفع مذكرة أو تسجيل صوتي للدرس' : 'Upload Study Notes or Audio Lecture'}
                </h3>
                <p className="text-xs text-fg-muted mt-1">
                  {isAr
                    ? 'سيتمكن الطلاب من تحميل المذكرات والاستماع للتسجيلات الصوتية مباشرة عبر المنصة.'
                    : 'Students will be able to download study notes or stream audio lectures in the portal.'}
                </p>
              </div>

              {matSuccess && (
                <div className="p-4 rounded-2xl bg-success-soft text-success-fg text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4 text-success" />
                  <span>{isAr ? 'تمت إضافة المادة الدراسية بنجاح!' : 'Material uploaded successfully!'}</span>
                </div>
              )}

              <form onSubmit={handlePublishMaterial} className="p-6 sm:p-8 rounded-3xl bg-surface-2 ring-1 ring-line space-y-4">
                <div>
                  <label className="block text-xs font-bold text-fg mb-1.5">{isAr ? 'عنوان المادة أو المذكرة' : 'Material Title'}</label>
                  <input
                    type="text"
                    required
                    value={matTitle}
                    onChange={(e) => setMatTitle(e.target.value)}
                    placeholder={isAr ? 'ملخص أحكام المد والقصر PDF' : 'Rules of Madd Summary Guide (PDF)'}
                    className="w-full px-4 py-3 rounded-xl bg-surface ring-1 ring-line text-sm text-fg outline-none focus:ring-2 focus:ring-brand-ring"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-fg mb-1.5">{isAr ? 'نوع الملف' : 'File Type'}</label>
                    <select
                      value={matType}
                      onChange={(e) => setMatType(e.target.value as 'pdf' | 'audio')}
                      className="w-full px-4 py-3 rounded-xl bg-surface ring-1 ring-line text-xs text-fg"
                    >
                      <option value="pdf">{isAr ? 'مذكرة PDF' : 'PDF Study Guide'}</option>
                      <option value="audio">{isAr ? 'تسجيل صوتي MP3' : 'Audio Lecture (MP3)'}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-fg mb-1.5">{isAr ? 'المادة الدراسية' : 'Subject'}</label>
                    <select
                      value={matCourse}
                      onChange={(e) => setMatCourse(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-surface ring-1 ring-line text-xs text-fg"
                    >
                      {MAJOR_COURSES.map((c: Course) => (
                        <option key={c.id} value={c.id}>{isAr ? c.titleAr : c.titleEn}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-fg mb-1.5">{isAr ? 'الحجم أو المدة' : 'Size or Duration'}</label>
                    <input
                      type="text"
                      value={matSizeOrDuration}
                      onChange={(e) => setMatSizeOrDuration(e.target.value)}
                      placeholder="e.g. 2.4 MB or 45 mins"
                      className="w-full px-4 py-3 rounded-xl bg-surface ring-1 ring-line text-xs text-fg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-fg mb-1.5">{isAr ? 'رابط التحميل / الملف' : 'Download / Cloud URL'}</label>
                    <input
                      type="text"
                      value={matDownloadUrl}
                      onChange={(e) => setMatDownloadUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-4 py-3 rounded-xl bg-surface ring-1 ring-line text-xs text-fg"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isPublishingMat}
                  className="w-full py-3.5 px-4 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2 mt-2"
                >
                  {isPublishingMat ? <Loader2 className="w-4 h-4 animate-spin" /> : <FilePlus className="w-4 h-4" />}
                  <span>{isPublishingMat ? (isAr ? 'جاري الرفع...' : 'Publishing...') : (isAr ? 'رفع المادة للمنصة' : 'Upload Material')}</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 5: PUBLISH ANNOUNCEMENT */}
          {activeTab === 'announcements' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div>
                <h3 className="text-lg font-bold text-fg">
                  {isAr ? 'بث إعلان أكاديمي للطلاب' : 'Broadcast Academy Announcement'}
                </h3>
                <p className="text-xs text-fg-muted mt-1">
                  {isAr
                    ? 'سيظهر هذا الإعلان في لوحة إعلانات كافة الطلاب المقيدين.'
                    : 'This announcement will be displayed on all enrolled students’ dashboards.'}
                </p>
              </div>

              {annSuccess && (
                <div className="p-4 rounded-2xl bg-success-soft text-success-fg text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4 text-success" />
                  <span>{isAr ? 'تم بث الإعلان بنجاح!' : 'Announcement broadcasted successfully!'}</span>
                </div>
              )}

              <form onSubmit={handlePublishAnnouncement} className="p-6 sm:p-8 rounded-3xl bg-surface-2 ring-1 ring-line space-y-4">
                <div>
                  <label className="block text-xs font-bold text-fg mb-1.5">{isAr ? 'عنوان الإعلان' : 'Announcement Title'}</label>
                  <input
                    type="text"
                    required
                    value={annTitle}
                    onChange={(e) => setAnnTitle(e.target.value)}
                    placeholder={isAr ? 'جدول الاختبارات النصفية للعلوم الشرعية' : 'Midterm Examination Schedule Announcement'}
                    className="w-full px-4 py-3 rounded-xl bg-surface ring-1 ring-line text-sm text-fg outline-none focus:ring-2 focus:ring-brand-ring"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-fg mb-1.5">{isAr ? 'نوع الإعلان' : 'Category'}</label>
                  <select
                    value={annCategory}
                    onChange={(e) => setAnnCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-surface ring-1 ring-line text-xs text-fg"
                  >
                    <option value="general">{isAr ? 'عام' : 'General'}</option>
                    <option value="exam">{isAr ? 'اختبارات' : 'Exam Schedule'}</option>
                    <option value="schedule">{isAr ? 'مواعيد الحلقات' : 'Class Schedule'}</option>
                    <option value="event">{isAr ? 'فعالية خاصة' : 'Special Event'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-fg mb-1.5">{isAr ? 'نص الإعلان' : 'Announcement Body'}</label>
                  <textarea
                    rows={4}
                    required
                    value={annContent}
                    onChange={(e) => setAnnContent(e.target.value)}
                    placeholder={isAr ? 'اكتب تفاصيل الإعلان هنا...' : 'Write announcement content here...'}
                    className="w-full px-4 py-3 rounded-xl bg-surface ring-1 ring-line text-xs text-fg resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isPublishingAnn}
                  className="w-full py-3.5 px-4 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2 mt-2"
                >
                  {isPublishingAnn ? <Loader2 className="w-4 h-4 animate-spin" /> : <Megaphone className="w-4 h-4" />}
                  <span>{isPublishingAnn ? (isAr ? 'جاري البث...' : 'Broadcasting...') : (isAr ? 'بث الإعلان للطلاب' : 'Broadcast Announcement')}</span>
                </button>
              </form>
            </div>
          )}

        </section>

      </main>
    </div>
  );
}
