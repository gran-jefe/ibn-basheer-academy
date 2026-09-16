'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BookOpen, LogOut, Globe, Sun, Moon, Radio, Video, ExternalLink,
  FileText, PlayCircle, Download, CheckCircle2, Award, Sparkles,
  Mic, Square, Play, Pause, Volume2, Send, Loader2, Music, X,
  ChevronDown, ChevronUp, AlertCircle, User, ArrowLeft, ArrowRight,
  MessageSquare, Save, Copy, FileDown
} from 'lucide-react';
import { usePreferences } from '@/lib/usePreferences';
import {
  MOCK_LIVE_CLASSES, MOCK_MATERIALS, MOCK_ASSIGNMENTS, MOCK_ANNOUNCEMENTS,
  type LiveClass, type Material
} from '@/lib/data/academyData';
import { getCurrentUser, signOut, type UserProfile } from '@/lib/services/authService';
import { submitRecitation } from '@/lib/services/recitationService';
import { submitAssignmentSolution } from '@/lib/services/submissionService';

type TabId = 'live' | 'materials' | 'assignments' | 'recitation' | 'announcements';

const daysUntil = (iso: string) => {
  const due = new Date(`${iso}T23:59:59`).getTime();
  if (Number.isNaN(due)) return null;
  return Math.ceil((due - Date.now()) / 86_400_000);
};

export default function StudentPortalPage() {
  const router = useRouter();
  const { lang, setLang, theme, toggleTheme } = usePreferences();
  const isAr = lang === 'ar';

  const [user, setUser] = useState<UserProfile | null>(null);
  const [authChecking, setAuthChecking] = useState(true);

  const [activeTab, setActiveTab] = useState<TabId>('live');
  const [submitted, setSubmitted] = useState<Record<string, string>>({});
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [isSubmittingAssignmentId, setIsSubmittingAssignmentId] = useState<string | null>(null);
  const [expandedFeedbackId, setExpandedFeedbackId] = useState<string | null>('assg-3');
  const [materialFilter, setMaterialFilter] = useState<'all' | 'pdf' | 'audio'>('all');
  const [playingMaterial, setPlayingMaterial] = useState<Material | null>(null);

  // Virtual Halaqah state inside student portal
  const [activeClassroom, setActiveClassroom] = useState<LiveClass | null>(null);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('large');
  const [notes, setNotes] = useState('');
  const [notesSaved, setNotesSaved] = useState(false);
  const [notesCopied, setNotesCopied] = useState(false);
  const [studentQuestions, setStudentQuestions] = useState<Array<{ id: string; student: string; question: string; category: string; answered: boolean }>>([
    { id: 'q1', student: 'Ahmad I.', question: 'What is the exact duration of Madd Munfasil in Tariq Shatibiyyah?', category: 'tajweed', answered: true },
    { id: 'q2', student: 'Zainab M.', question: 'Does touching a non-mahram invalidate Wudu in the Maliki Madhhab?', category: 'fiqh', answered: false },
  ]);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [questionCategory, setQuestionCategory] = useState('tajweed');

  // Recitation Studio State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasRecording, setHasRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recitationSubmitted, setRecitationSubmitted] = useState(false);
  const [isSubmittingRecitation, setIsSubmittingRecitation] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((t) => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  useEffect(() => {
    let mounted = true;
    getCurrentUser().then((u) => {
      if (mounted) {
        setUser(u);
        setAuthChecking(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
    router.push('/login');
  };


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
    setIsPlaying((prev) => !prev);
  };

  const handleSubmitRecitation = async () => {
    setIsSubmittingRecitation(true);
    await submitRecitation({
      surahName: 'Al-Mulk',
      versesRange: '1-5',
      durationSeconds: recordingTime,
      audioUrl: 'https://placeholder.supabase.co/recitations/al-mulk-sample.webm',
    });
    setIsSubmittingRecitation(false);
    setRecitationSubmitted(true);
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;
    setStudentQuestions((prev) => [
      {
        id: `q-${Date.now()}`,
        student: user?.fullName || 'Student',
        question: newQuestionText.trim(),
        category: questionCategory,
        answered: false,
      },
      ...prev,
    ]);
    setNewQuestionText('');
  };

  const openAssignments = useMemo(
    () => MOCK_ASSIGNMENTS.filter((a) => a.status !== 'graded' && !submitted[a.id]),
    [submitted],
  );

  const tabs = [
    { id: 'live' as const, label: isAr ? 'الحلقات المباشرة' : 'Live Halaqāt', icon: <Radio className="w-4 h-4 text-danger animate-pulse" /> },
    { id: 'materials' as const, label: isAr ? 'المذكرات والتسجيلات' : 'Study Materials', icon: <FileText className="w-4 h-4" /> },
    { id: 'assignments' as const, label: isAr ? 'الواجبات والتكاليف' : 'Coursework', icon: <BookOpen className="w-4 h-4" />, badge: openAssignments.length },
    { id: 'recitation' as const, label: isAr ? 'استوديو التلاوة والتجويد' : 'Recitation Studio', icon: <Mic className="w-4 h-4 text-accent-600" /> },
    { id: 'announcements' as const, label: isAr ? 'الإعلانات' : 'Announcements', icon: <AlertCircle className="w-4 h-4" /> },
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
            <div className="w-14 h-14 rounded-2xl bg-brand-tint text-brand-ink flex items-center justify-center mx-auto ring-1 ring-brand-ring">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-fg font-display">
                {isAr ? 'يلزم تسجيل الدخول لدخول بوابة الطالب' : 'Student Authentication Required'}
              </h1>
              <p className="text-xs sm:text-sm text-fg-muted mt-2 leading-relaxed">
                {isAr
                  ? 'بوابة الطالب الافتراضية مخصصة للطلاب المقيدين في أكاديمية ابن بشير لمتابعة الحلقات والتلاوات.'
                  : 'The student LMS portal is reserved for registered students to participate in live circles and submit coursework.'}
              </p>
            </div>

            <div className="space-y-3">
              <Link
                href="/login?redirect=/student"
                className="w-full py-3.5 px-4 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>{isAr ? 'تسجيل الدخول إلى حسابك' : 'Sign In to Student Account'}</span>
              </Link>

              <Link
                href="/signup"
                className="w-full py-3 px-4 rounded-xl bg-surface-2 hover:bg-surface-3 ring-1 ring-line text-xs font-bold text-fg transition-all flex items-center justify-center gap-2"
              >
                <span>{isAr ? 'إنشاء حساب طالب جديد' : 'Register New Student Account'}</span>
              </Link>
            </div>

            <p className="text-xs text-fg-subtle pt-2 border-t border-line">
              {isAr ? 'ترغب في التسجيل في أحد المستويات؟ ' : 'Want to join an academic level? '}
              <Link href="/enroll" className="font-bold text-brand-ink hover:underline">
                {isAr ? 'تقديم طلب القيد والقبول' : 'Submit Admission Application'}
              </Link>
            </p>
          </div>
        </main>
      </div>
    );
  }

  /* Authenticated Dedicated Student Portal */
  return (
    <div className="min-h-screen flex flex-col bg-paper text-fg">
      {/* Top Seminary Navigation Bar */}
      <header className="sticky top-0 z-40 bg-brand-900 text-white border-b border-brand-800 shadow-sm">
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
                <p className="text-[11px] text-brand-200 leading-none mt-0.5">
                  {isAr ? 'بوابة الطالب الافتراضية' : 'Student LMS Portal'}
                </p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/student/transcript"
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 ring-1 ring-white/20 text-xs font-bold text-accent-300 transition-colors flex items-center gap-1.5"
            >
              <Award className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{isAr ? 'كشف الدرجات والشهادة' : 'Transcript & Ijāzah'}</span>
            </Link>

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
              <span className="text-xs font-bold text-white hidden lg:inline max-w-[120px] truncate">
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

        {/* High-Legibility Student Track Card */}
        <section className="rounded-3xl bg-surface p-6 sm:p-8 ring-1 ring-line shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-line/60 pb-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-brand-tint text-brand-ink text-xs font-bold ring-1 ring-brand-ring">
                  {isAr ? 'طالب منتظم' : 'Active Student'}
                </span>
                <span className="text-xs text-fg-subtle" dir="ltr">{user.email}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-ink font-display">
                {user.fullName}
              </h1>
              <p className="text-sm text-fg-muted font-medium">
                {isAr
                  ? 'المرحلة الابتدائية الشرعية + دورة التجويد المكثفة · بإشراف الشيخ أبو عبد الله المبارك'
                  : 'Primary Shari’ah Level & Tajweed Intensive Track · Supervised by Ustaz Abu Abdullah Al-Mubaarak'}
              </p>
            </div>

            {/* Quick KPI stats */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 shrink-0">
              <div className="p-3.5 sm:p-4 rounded-2xl bg-surface-2 ring-1 ring-line text-center">
                <p className="text-[11px] font-bold text-fg-subtle">{isAr ? 'حصص الأسبوع' : 'Weekly Classes'}</p>
                <p className="text-xl sm:text-2xl font-extrabold text-brand-ink mt-1">3</p>
              </div>
              <div className="p-3.5 sm:p-4 rounded-2xl bg-surface-2 ring-1 ring-line text-center">
                <p className="text-[11px] font-bold text-fg-subtle">{isAr ? 'واجبات مفتوحة' : 'Open Tasks'}</p>
                <p className="text-xl sm:text-2xl font-extrabold text-brand-ink mt-1">{openAssignments.length}</p>
              </div>
              <div className="p-3.5 sm:p-4 rounded-2xl bg-surface-2 ring-1 ring-line text-center">
                <p className="text-[11px] font-bold text-fg-subtle">{isAr ? 'التلاوة' : 'Recitation'}</p>
                <p className="text-xl sm:text-2xl font-extrabold text-success mt-1">{isAr ? 'نشط' : 'Active'}</p>
              </div>
            </div>
          </div>

          {/* Tab Navigation Navigation Bar */}
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

          {/* TAB 1: LIVE CLASSES & VIRTUAL HALAQAH */}
          {activeTab === 'live' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {MOCK_LIVE_CLASSES.map((cls) => {
                  const live = cls.status === 'live';
                  const isViewingInHalaqah = activeClassroom?.id === cls.id;

                  return (
                    <div
                      key={cls.id}
                      className={`p-6 rounded-3xl ring-1 transition-all flex flex-col justify-between gap-5 ${
                        live
                          ? 'bg-surface ring-2 ring-brand-ring shadow-md'
                          : 'bg-surface-2/60 ring-line'
                      }`}
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          {live ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-danger-soft text-danger-fg text-xs font-extrabold uppercase tracking-wide">
                              <span className="w-2 h-2 rounded-full bg-danger animate-ping" />
                              {isAr ? 'مباشر الآن' : 'Live Now'}
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full bg-surface-3 text-fg-muted text-xs font-bold uppercase tracking-wide">
                              {isAr ? 'حصة قادمة' : 'Upcoming Session'}
                            </span>
                          )}
                          <span className="text-xs font-bold text-fg-subtle">{cls.level}</span>
                        </div>

                        <h3 className="text-lg font-bold text-fg">
                          {isAr ? cls.titleAr : cls.titleEn}
                        </h3>
                        <p className="text-xs font-bold text-brand-ink">
                          {isAr ? cls.subjectAr : cls.subjectEn} · {cls.instructor}
                        </p>

                        <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                          <div className="p-2.5 rounded-xl bg-surface ring-1 ring-line/70">
                            <span className="text-fg-subtle block">{isAr ? 'اليوم' : 'Day'}</span>
                            <span className="font-bold text-fg mt-0.5 block">{isAr ? cls.dayAr : cls.dayEn}</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-surface ring-1 ring-line/70">
                            <span className="text-fg-subtle block">{isAr ? 'التوقيت' : 'Time'}</span>
                            <span className="font-bold text-fg mt-0.5 block tabular" dir="ltr">{isAr ? cls.timeAr : cls.timeEn}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
                        <button
                          type="button"
                          onClick={() => setActiveClassroom(isViewingInHalaqah ? null : cls)}
                          className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center justify-center gap-2 ${
                            isViewingInHalaqah
                              ? 'bg-brand-900 text-white'
                              : 'bg-brand-700 hover:bg-brand-800 text-white'
                          }`}
                        >
                          <Radio className="w-4 h-4 text-danger animate-pulse" />
                          <span>{isViewingInHalaqah ? (isAr ? 'إغلاق قاعة المتن' : 'Close Halaqah View') : (isAr ? 'فتح قاعة الدرس والمتن' : 'Open Virtual Halaqah')}</span>
                        </button>

                        <a
                          href={cls.meetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-surface hover:bg-surface-2 ring-1 ring-line text-fg transition-all flex items-center justify-center gap-2"
                        >
                          <Video className="w-4 h-4 text-brand-ink" />
                          <span>{isAr ? 'رابط Google Meet' : 'Direct Meet Link'}</span>
                          <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Integrated Virtual Halaqah Workbench (Dual Pane) */}
              {activeClassroom && (
                <div className="p-6 sm:p-8 rounded-3xl bg-surface-2 ring-1 ring-line shadow-sm space-y-6 animate-fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
                    <div>
                      <span className="text-xs font-bold text-accent-700 dark:text-accent-300 uppercase tracking-wider bg-accent-400/15 px-2.5 py-1 rounded-full ring-1 ring-accent-400/30">
                        {isAr ? 'قاعة الدرس التفاعلية' : 'Interactive Halaqah Workbench'}
                      </span>
                      <h2 className="text-xl font-bold text-fg mt-2">
                        {isAr ? activeClassroom.titleAr : activeClassroom.titleEn}
                      </h2>
                    </div>

                    {/* Font size controller */}
                    <div className="flex items-center gap-1 bg-surface p-1 rounded-xl ring-1 ring-line">
                      <span className="text-xs font-semibold text-fg-subtle px-2">{isAr ? 'حجم الخط:' : 'Text Size:'}</span>
                      <button
                        type="button"
                        onClick={() => setFontSize('normal')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${fontSize === 'normal' ? 'bg-brand-700 text-white' : 'text-fg-muted'}`}
                      >
                        A
                      </button>
                      <button
                        type="button"
                        onClick={() => setFontSize('large')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${fontSize === 'large' ? 'bg-brand-700 text-white' : 'text-fg-muted'}`}
                      >
                        A+
                      </button>
                      <button
                        type="button"
                        onClick={() => setFontSize('xlarge')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${fontSize === 'xlarge' ? 'bg-brand-700 text-white' : 'text-fg-muted'}`}
                      >
                        A++
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left 7 cols: Classical Text & Mushaf Reader */}
                    <div className="lg:col-span-7 space-y-5">
                      
                      {/* Quranic Passage Card */}
                      <div className="p-6 rounded-2xl bg-surface ring-1 ring-line space-y-3">
                        <div className="flex items-center justify-between text-xs font-bold text-brand-ink">
                          <span>{isAr ? 'المصحف الشريف — سورة الملك' : 'Holy Quran — Surah Al-Mulk'}</span>
                          <span>{isAr ? 'الآيات ١ - ٥' : 'Verses 1–5'}</span>
                        </div>
                        <div
                          className={`p-5 rounded-xl bg-surface-2/60 text-center font-display leading-[2.4] text-fg select-all ${
                            fontSize === 'normal' ? 'text-lg' : fontSize === 'large' ? 'text-2xl' : 'text-3xl'
                          }`}
                          dir="rtl"
                        >
                          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ <br />
                          تَبَٰرَكَ ٱلَّذِي بِيَدِهِ ٱلۡمُلۡكُ وَهُوَ عَلَىٰ كُلِّ شَيۡءٖ قَدِيرٌ ۝١ ٱلَّذِي خَلَقَ ٱلۡمَوۡتَ وَٱلۡحَيَوٰةَ لِيَبۡلُوَكُمۡ أَيُّكُمۡ أَحۡسَنُ عَمَلٗاۚ وَهُوَ ٱلۡعَزِيزُ ٱلۡغَفُورُ ۝٢ ٱلَّذِي خَلَقَ سَبۡعَ سَمَٰوَٰتٖ طِبَاقٗاۖ مَّا تَرَىٰ فِي خَلۡقِ ٱلرَّحۡمَٰنِ مِن تَفَٰوُتٖۖ فَٱرۡجِعِ ٱلۡبَصَرَ هَلۡ تَرَىٰ مِن فُطُورٖ ۝٣
                        </div>
                      </div>

                      {/* Classical Matn Poetry Card */}
                      <div className="p-6 rounded-2xl bg-surface ring-1 ring-line space-y-3">
                        <div className="flex items-center justify-between text-xs font-bold text-accent-800">
                          <span>{isAr ? 'المتن المعتمد: تحفة الأطفال — أحكام النون الساكنة والتنوين' : 'Prescribed Matn: Tuhfat al-Atfal — Rules of Nun & Tanween'}</span>
                          <span>{isAr ? 'أبيات (٦ - ٩)' : 'Verses 6–9'}</span>
                        </div>
                        <div className="space-y-3 font-display text-base sm:text-lg leading-relaxed text-center bg-surface-2/60 p-5 rounded-xl" dir="rtl">
                          <p className="border-b border-line/40 pb-2">
                            لِلنُّـونِ إِنْ تَسْكُـنْ وَلِلتَّنْوِيـنِ ❊ أَرْبَـعُ أَحْكَـامٍ فَخُـذْ تَبْيِينِـي
                          </p>
                          <p className="border-b border-line/40 pb-2">
                            فَالأَوَّلُ الإِظْهَـارُ قَبْـلَ أَحْـرُفِ ❊ لِلْحَلْـقِ سِـتٌّ رُتِّبَـتْ فَلْتَعْـرِفِ
                          </p>
                          <p className="text-brand-ink">
                            هَمْـزٌ فَهَـاءٌ ثُـمَّ عَيْـنٌ حَـاءُ ❊ مُهْمَلَتَـانِ ثُـمَّ غَيْـنٌ خَـاءُ
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right 5 cols: Student Question Queue & Live Notepad */}
                    <div className="lg:col-span-5 space-y-5">
                      
                      {/* Live Question Queue */}
                      <div className="p-5 rounded-2xl bg-surface ring-1 ring-line space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-fg flex items-center gap-1.5">
                            <MessageSquare className="w-3.5 h-3.5 text-accent-600" />
                            <span>{isAr ? 'طرح سؤال على الشيخ (رفع اليد)' : 'Ask Ustaz in Session'}</span>
                          </h3>
                          <span className="text-[11px] text-fg-subtle">{studentQuestions.length} {isAr ? 'أسئلة' : 'queued'}</span>
                        </div>

                        <form onSubmit={handleAddQuestion} className="space-y-2.5">
                          <textarea
                            rows={2}
                            value={newQuestionText}
                            onChange={(e) => setNewQuestionText(e.target.value)}
                            placeholder={isAr ? 'اكتب سؤالك هنا ليجيب عليه الشيخ في الحلقة...' : 'Type your question for Ustaz to answer...'}
                            className="w-full p-3 rounded-xl bg-surface-2 ring-1 ring-line text-xs outline-none focus:ring-2 focus:ring-brand-ring resize-none"
                          />
                          <div className="flex items-center justify-between gap-2">
                            <select
                              value={questionCategory}
                              onChange={(e) => setQuestionCategory(e.target.value)}
                              className="text-xs px-2.5 py-1.5 rounded-lg bg-surface ring-1 ring-line text-fg-muted"
                            >
                              <option value="tajweed">{isAr ? 'تجويد' : 'Tajweed'}</option>
                              <option value="fiqh">{isAr ? 'فقه' : 'Fiqh'}</option>
                              <option value="arabic">{isAr ? 'عربية' : 'Arabic'}</option>
                            </select>
                            <button
                              type="submit"
                              className="px-3.5 py-1.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                            >
                              <Send className="w-3 h-3" />
                              <span>{isAr ? 'إرسال السؤال' : 'Queue Question'}</span>
                            </button>
                          </div>
                        </form>

                        {/* Questions List */}
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {studentQuestions.map((q) => (
                            <div key={q.id} className="p-3 rounded-xl bg-surface-2 ring-1 ring-line/60 text-xs space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-fg">{q.student}</span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${q.answered ? 'bg-success-soft text-success-fg' : 'bg-warn-soft text-warn-fg'}`}>
                                  {q.answered ? (isAr ? 'تمت الإجابة' : 'Answered') : (isAr ? 'قيد الانتظار' : 'Pending')}
                                </span>
                              </div>
                              <p className="text-fg-muted">{q.question}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Personal Lesson Notepad */}
                      <div className="p-5 rounded-2xl bg-surface ring-1 ring-line space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-fg flex items-center gap-1.5">
                            <Save className="w-3.5 h-3.5 text-brand-ink" />
                            <span>{isAr ? 'مفكرة الفوائد الشخصية' : 'Personal Lesson Notepad'}</span>
                          </h3>
                          <div className="flex items-center gap-1.5 text-xs">
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(notes);
                                setNotesCopied(true);
                                setTimeout(() => setNotesCopied(false), 1500);
                              }}
                              className="p-1.5 rounded-lg hover:bg-surface-2 text-fg-subtle hover:text-fg transition-colors"
                              title={isAr ? 'نسخ الفوائد' : 'Copy notes'}
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const blob = new Blob([notes], { type: 'text/plain;charset=utf-8' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = 'ibn-basheer-lesson-notes.txt';
                                a.click();
                              }}
                              className="p-1.5 rounded-lg hover:bg-surface-2 text-fg-subtle hover:text-fg transition-colors"
                              title={isAr ? 'تنزيل الفوائد ملف نصي' : 'Export .txt'}
                            >
                              <FileDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <textarea
                          rows={4}
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder={isAr ? 'دوّن هنا الفوائد والشوارد من شرح الشيخ...' : 'Write gems & explanations from Ustaz here...'}
                          className="w-full p-3.5 rounded-xl bg-surface-2 ring-1 ring-line text-xs outline-none focus:ring-2 focus:ring-brand-ring leading-relaxed resize-none"
                        />
                        {notesCopied && (
                          <p className="text-[11px] text-success-fg font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-success" />
                            <span>{isAr ? 'تم نسخ الفوائد إلى الحافظة' : 'Notes copied to clipboard!'}</span>
                          </p>
                        )}
                      </div>

                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: COURSE MATERIALS & NOTES */}
          {activeTab === 'materials' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setMaterialFilter('all')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      materialFilter === 'all'
                        ? 'bg-brand-700 text-white shadow-xs'
                        : 'bg-surface-2 text-fg-muted hover:bg-surface-3 ring-1 ring-line'
                    }`}
                  >
                    {isAr ? 'كافة المواد والملازم' : 'All Materials'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setMaterialFilter('pdf')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      materialFilter === 'pdf'
                        ? 'bg-brand-700 text-white shadow-xs'
                        : 'bg-surface-2 text-fg-muted hover:bg-surface-3 ring-1 ring-line'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{isAr ? 'مذكرات وملازم PDF' : 'PDF Study Notes'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMaterialFilter('audio')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      materialFilter === 'audio'
                        ? 'bg-brand-700 text-white shadow-xs'
                        : 'bg-surface-2 text-fg-muted hover:bg-surface-3 ring-1 ring-line'
                    }`}
                  >
                    <Music className="w-3.5 h-3.5" />
                    <span>{isAr ? 'تسجيلات صوتية' : 'Audio Lectures'}</span>
                  </button>
                </div>
              </div>

              {/* Streaming Audio Player Bar */}
              {playingMaterial && (
                <div className="p-5 rounded-3xl bg-brand-tint/70 border border-brand-ring shadow-sm space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-2xl bg-brand-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Music className="w-5 h-5 animate-bounce" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-fg truncate">
                          {isAr ? playingMaterial.titleAr : playingMaterial.titleEn}
                        </p>
                        <p className="text-xs text-brand-ink font-semibold mt-0.5">
                          {isAr ? 'مشغّل المحاضرات المباشر' : 'In-Browser Streaming Player'} · {playingMaterial.sizeOrDuration}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPlayingMaterial(null)}
                      className="p-2 rounded-xl text-fg-subtle hover:text-fg hover:bg-surface-2 transition-colors"
                      title={isAr ? 'إغلاق المشغل' : 'Close Player'}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <audio
                    controls
                    autoPlay
                    className="w-full h-10 accent-brand-700"
                    src={playingMaterial.downloadUrl !== '#' ? playingMaterial.downloadUrl : 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/67.mp3'}
                  />
                </div>
              )}

              {/* Material Items List */}
              <ul className="space-y-3.5">
                {MOCK_MATERIALS
                  .filter((m) => materialFilter === 'all' || m.type === materialFilter)
                  .map((mat) => (
                    <li
                      key={mat.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-surface p-5 ring-1 ring-line shadow-xs hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div
                          className={`w-11 h-11 shrink-0 rounded-2xl flex items-center justify-center ${
                            mat.type === 'pdf' ? 'bg-danger-soft text-danger' : 'bg-info-soft text-info'
                          }`}
                        >
                          {mat.type === 'pdf' ? <FileText className="w-5 h-5" /> : <PlayCircle className="w-5 h-5" />}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-sm sm:text-base text-fg truncate">
                            {isAr ? mat.titleAr : mat.titleEn}
                          </h4>
                          <p className="text-xs text-fg-subtle mt-0.5 tabular">
                            {mat.type.toUpperCase()} · {mat.sizeOrDuration} · <span dir="ltr">{mat.uploadedDate}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto">
                        {mat.type === 'audio' && (
                          <button
                            type="button"
                            onClick={() => setPlayingMaterial(mat)}
                            className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                              playingMaterial?.id === mat.id
                                ? 'bg-brand-700 text-white shadow-xs'
                                : 'bg-surface-2 text-fg-muted hover:bg-surface-3 ring-1 ring-line'
                            }`}
                          >
                            <Play className="w-3.5 h-3.5" />
                            <span>{playingMaterial?.id === mat.id ? (isAr ? 'قيد التشغيل' : 'Playing...') : (isAr ? 'استماع' : 'Listen')}</span>
                          </button>
                        )}
                        <a
                          href={mat.downloadUrl}
                          download
                          className="px-4 py-2.5 rounded-xl text-xs font-bold text-brand-ink ring-1 ring-brand-ring hover:bg-brand-700 hover:text-white hover:ring-brand-700 transition-colors flex items-center gap-1.5"
                        >
                          <Download className="w-4 h-4" />
                          <span>{isAr ? 'تحميل' : 'Download'}</span>
                        </a>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {/* TAB 3: COURSEWORK & ASSIGNMENTS */}
          {activeTab === 'assignments' && (
            <div className="space-y-6">
              <ul className="space-y-5">
                {MOCK_ASSIGNMENTS.map((assg) => {
                  const graded = assg.status === 'graded';
                  const answer = submitted[assg.id];
                  const done = graded || !!answer;
                  const remaining = daysUntil(assg.dueDate);
                  const overdue = !done && remaining !== null && remaining < 0;
                  const isSubmittingThis = isSubmittingAssignmentId === assg.id;

                  return (
                    <li
                      key={assg.id}
                      className="rounded-3xl bg-surface p-6 ring-1 ring-line shadow-xs space-y-5"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-fg-subtle">
                            {assg.level}
                          </span>
                          <h3 className="text-base sm:text-lg font-bold text-fg leading-snug mt-1">
                            {isAr ? assg.titleAr : assg.titleEn}
                          </h3>
                        </div>

                        <span
                          className={`tabular shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold ${
                            graded
                              ? 'bg-success-soft text-success-fg'
                              : overdue
                                ? 'bg-danger-soft text-danger-fg'
                                : 'bg-surface-3 text-fg-muted'
                          }`}
                        >
                          {graded ? (isAr ? 'تم التصحيح' : 'Graded') : overdue ? (isAr ? 'فات الموعد' : 'Overdue') : `${isAr ? 'التسليم' : 'Due'}: ${assg.dueDate}`}
                          {' · '}
                          {assg.totalPoints} {isAr ? 'درجة' : 'pts'}
                        </span>
                      </div>

                      {done ? (
                        <div className="space-y-4">
                          <div className="p-4 rounded-2xl bg-success-soft text-success-fg text-xs font-bold flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 shrink-0 text-success" />
                            <span>
                              {answer
                                ? `${isAr ? 'تم تسليم الحل بنجاح: ' : 'Submitted: '}${answer}`
                                : (isAr ? 'تم تصحيح هذا الواجب — راجع ملاحظات الشيخ أدناه.' : 'Assignment graded — see instructor feedback.')}
                            </span>
                          </div>

                          {graded && (
                            <div className="rounded-2xl border border-line/70 bg-surface-2/60 overflow-hidden">
                              <button
                                type="button"
                                onClick={() => setExpandedFeedbackId(expandedFeedbackId === assg.id ? null : assg.id)}
                                className="w-full p-4 flex items-center justify-between text-xs font-bold text-fg hover:bg-surface-2 transition-colors text-start"
                              >
                                <div className="flex items-center gap-2">
                                  <Award className="w-4 h-4 text-accent-600" />
                                  <span>{isAr ? 'تقييم وملاحظات المعلم' : 'Instructor Feedback & Evaluation'}</span>
                                  <span className="px-2.5 py-0.5 rounded-full bg-success-soft text-success-fg text-xs font-extrabold">
                                    95 / 100 (A+)
                                  </span>
                                </div>
                                {expandedFeedbackId === assg.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              </button>

                              {expandedFeedbackId === assg.id && (
                                <div className="p-4 pt-0 border-t border-line/40 space-y-2 text-xs animate-fade-in">
                                  <div className="flex items-center justify-between text-fg-subtle pt-2">
                                    <span>{isAr ? 'المصحح: الشيخ أبو عبد الله المبارك' : 'Evaluated by: Ustaz Abu Abdullah Al-Mubaarak'}</span>
                                    <span className="text-success-fg font-bold">{isAr ? 'درجة الامتياز' : 'High Honors'}</span>
                                  </div>
                                  <p className="text-fg-muted leading-relaxed bg-surface p-4 rounded-xl ring-1 ring-line/60">
                                    {isAr
                                      ? '«ما شاء الله، إجابة متقنة ومفصلة. تقسيم الورثة دقيق وتأصيل المسائل صحيح تماماً. بارك الله في فهمك وجدّك.»'
                                      : '“Māshā’Allāh, very thorough and sound analysis. The distribution of inheritance shares and determination of the base problem (aṣl al-mas’alah) is accurate. Keep up the high standard!”'}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="pt-2 border-t border-line space-y-3">
                          <label className="block text-xs font-bold text-fg">
                            {isAr ? 'إجابتك التحريرية أو رابط ملف الحل:' : 'Your written answer or solution drive link:'}
                          </label>
                          <div className="flex flex-col sm:flex-row gap-2.5">
                            <input
                              type="text"
                              value={drafts[assg.id] ?? ''}
                              onChange={(e) => setDrafts((d) => ({ ...d, [assg.id]: e.target.value }))}
                              placeholder={isAr ? 'اكتب إجابتك أو ألصق الرابط هنا...' : 'Type answer or paste file link...'}
                              className="flex-1 px-4 py-3 rounded-xl bg-surface ring-1 ring-line text-xs outline-none focus:ring-2 focus:ring-brand-ring"
                              disabled={isSubmittingThis}
                            />
                            <button
                              type="button"
                              disabled={isSubmittingThis}
                              onClick={async () => {
                                const v = (drafts[assg.id] ?? '').trim();
                                if (!v) return;
                                setIsSubmittingAssignmentId(assg.id);
                                await submitAssignmentSolution({
                                  assignmentId: assg.id,
                                  studentId: user.id,
                                  submissionText: v,
                                });
                                setSubmitted((s) => ({ ...s, [assg.id]: v }));
                                setIsSubmittingAssignmentId(null);
                              }}
                              className="px-5 py-3 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                              {isSubmittingThis ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>{isAr ? 'تسليم الواجب' : 'Submit'}</span>}
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

          {/* TAB 4: RECITATION & TAJWEED STUDIO */}
          {activeTab === 'recitation' && (
            <div className="space-y-8">
              
              {/* Weekly Passage Card */}
              <div className="p-6 sm:p-8 rounded-3xl bg-surface ring-1 ring-line shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-line pb-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-accent-700 dark:text-accent-300 bg-accent-400/15 px-3 py-1 rounded-full ring-1 ring-accent-400/30">
                      {isAr ? 'التكليف الأسبوعي للتلاوة' : 'Weekly Recitation Assessment'}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-fg mt-2">
                      {isAr ? 'سورة الملك — الآيات (١ - ٥)' : 'Surah Al-Mulk — Verses 1–5'}
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-fg-subtle">{isAr ? 'الدرجة: ٥٠ درجة' : 'Value: 50 pts'}</span>
                </div>

                <div className="p-6 sm:p-8 rounded-2xl bg-surface-2 text-center font-display text-2xl sm:text-3xl leading-[2.4] text-fg select-all" dir="rtl">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ <br />
                  تَبَٰرَكَ ٱلَّذِي بِيَدِهِ ٱلۡمُلۡكُ وَهُوَ عَلَىٰ كُلِّ شَيۡءٖ قَدِيرٌ ۝١ ٱلَّذِي خَلَقَ ٱلۡمَوۡتَ وَٱلۡحَيَوٰةَ لِيَبۡلُوَكُمۡ أَيُّكُمۡ أَحۡسَنُ عَمَلٗاۚ وَهُوَ ٱلۡعَزِيزُ ٱلۡغَفُورُ ۝٢ ٱلَّذِي خَلَقَ سَبۡعَ سَمَٰوَٰتٖ طِبَاقٗاۖ مَّا تَرَىٰ فِي خَلۡقِ ٱلرَّحۡمَٰنِ مِن تَفَٰوُتٖۖ فَٱرۡجِعِ ٱلۡبَصَرَ هَلۡ تَرَىٰ مِن فُطُورٖ ۝٣
                </div>

                {/* Pronunciation Target Checklist */}
                <div className="p-4 rounded-2xl bg-brand-tint/50 border border-brand-ring text-xs">
                  <span className="font-bold text-brand-ink uppercase tracking-wider block mb-2">
                    {isAr ? 'نقاط التقييم الصوتي المستهدفة:' : 'Tajweed Evaluation Checklist:'}
                  </span>
                  <ul className="grid sm:grid-cols-2 gap-2.5 text-fg-muted">
                    <li className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-accent-600 shrink-0" />
                      <span>{isAr ? 'الإخفاء الحقيقي في (مِن تَفَٰوُتٖ)' : 'Real Ikhfā’ in (min tafāwut)'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-accent-600 shrink-0" />
                      <span>{isAr ? 'قلقلة الباء في (لِيَبۡلُوَكُمۡ)' : 'Qalqalah on Bā’ in (liyabluwakum)'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-accent-600 shrink-0" />
                      <span>{isAr ? 'المد الطبيعي ومخارج الحلق' : 'Natural Madd & Throat Letters'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-accent-600 shrink-0" />
                      <span>{isAr ? 'ترقيق الراء وتفخيمها' : 'Tafkhīm & Tarqīq of Rā’'}</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Recording Workbench */}
              <div className="p-6 sm:p-8 rounded-3xl bg-surface ring-1 ring-line shadow-xs space-y-6 text-center">
                <div>
                  <h4 className="text-lg font-bold text-fg">
                    {isAr ? 'تسجيل تلاوتك بصوتك' : 'Voice Recitation Recorder'}
                  </h4>
                  <p className="text-xs sm:text-sm text-fg-muted mt-1 max-w-lg mx-auto">
                    {isAr
                      ? 'سجّل قراءتك بهدوء ووضوح. سيستمع الشيخ لتسجيلك ويقدم لك تصويباً صوتياً مفصلاً.'
                      : 'Record your recitation clearly. Ustaz Abu Abdullah will review your audio with timestamped feedback.'}
                  </p>
                </div>

                {/* Animated Waveform bar */}
                <div className="h-20 rounded-2xl bg-surface-2 ring-1 ring-line flex items-center justify-center px-4 gap-1.5 overflow-hidden">
                  {isRecording ? (
                    Array.from({ length: 32 }).map((_, i) => (
                      <span
                        key={i}
                        className="w-1.5 bg-brand-ink rounded-full animate-pulse"
                        style={{
                          height: `${Math.max(15, (Math.sin(i * 0.5 + recordingTime) * 35 + 40))}%`,
                          animationDuration: `${0.4 + (i % 5) * 0.1}s`,
                        }}
                      />
                    ))
                  ) : hasRecording ? (
                    <div className="flex items-center gap-2.5 text-sm font-semibold text-brand-ink">
                      <Volume2 className="w-5 h-5 text-accent-600" />
                      <span>{isAr ? 'تم تسجيل التلاوة بنجاح (جاهزة للإرسال للشيخ)' : 'Audio recitation captured and ready for evaluation'}</span>
                    </div>
                  ) : (
                    <p className="text-xs text-fg-subtle">
                      {isAr ? 'اضغط على زر التسجيل أدناه لبدء التلاوة' : 'Click the record button below to begin reciting'}
                    </p>
                  )}
                </div>

                {(isRecording || hasRecording) && (
                  <div className="tabular text-base font-bold text-fg">
                    ⏱️ {String(Math.floor(recordingTime / 60)).padStart(2, '0')}:
                    {String(recordingTime % 60).padStart(2, '0')}
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-center gap-3">
                  {!isRecording ? (
                    <button
                      type="button"
                      onClick={handleStartRecord}
                      className="px-6 py-3.5 rounded-2xl bg-danger hover:bg-danger/90 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
                    >
                      <Mic className="w-5 h-5" />
                      <span>{hasRecording ? (isAr ? 'إعادة التسجيل' : 'Re-record') : (isAr ? 'بدء تسجيل التلاوة' : 'Start Recording')}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleStopRecord}
                      className="px-6 py-3.5 rounded-2xl bg-fg hover:bg-fg/90 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
                    >
                      <Square className="w-5 h-5" />
                      <span>{isAr ? 'إيقاف التسجيل' : 'Stop Recording'}</span>
                    </button>
                  )}

                  {hasRecording && !isRecording && (
                    <>
                      <button
                        type="button"
                        onClick={handleTogglePlay}
                        className="px-5 py-3.5 rounded-2xl bg-surface-2 ring-1 ring-line hover:bg-surface-3 text-fg font-bold text-sm transition-all flex items-center gap-2"
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        <span>{isPlaying ? (isAr ? 'إيقاف' : 'Pause') : (isAr ? 'استماع لتسجيلك' : 'Listen')}</span>
                      </button>

                      {!recitationSubmitted && (
                        <button
                          type="button"
                          onClick={handleSubmitRecitation}
                          disabled={isSubmittingRecitation}
                          className="px-6 py-3.5 rounded-2xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                          {isSubmittingRecitation ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                          <span>{isSubmittingRecitation ? (isAr ? 'جاري الإرسال...' : 'Submitting...') : (isAr ? 'إرسال التلاوة للشيخ' : 'Submit Recitation to Ustaz')}</span>
                        </button>
                      )}
                    </>
                  )}
                </div>

                {recitationSubmitted && (
                  <div className="p-4 rounded-2xl bg-success-soft border border-success/30 text-success-fg text-sm font-bold flex items-center justify-center gap-2 mt-4 animate-fade-in">
                    <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                    <span>
                      {isAr
                        ? 'تم إرسال تلاوتك بنجاح للشيخ أبو عبد الله المبارك! ستصلك ملاحظات التجويد والدرجة هنا.'
                        : 'Recitation submitted successfully to Ustaz Abu Abdullah Al-Mubaarak! Feedback will appear here.'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: ANNOUNCEMENTS */}
          {activeTab === 'announcements' && (
            <div className="space-y-4">
              <ul className="space-y-4">
                {MOCK_ANNOUNCEMENTS.map((ann) => (
                  <li key={ann.id} className="p-6 rounded-3xl bg-surface ring-1 ring-line shadow-xs space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-bold text-base text-fg">{isAr ? ann.titleAr : ann.titleEn}</h3>
                      <span className="text-xs text-fg-subtle tabular" dir="ltr">{ann.date}</span>
                    </div>
                    <p className="text-sm text-fg-muted leading-relaxed">{isAr ? ann.contentAr : ann.contentEn}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </section>

      </main>
    </div>
  );
}
