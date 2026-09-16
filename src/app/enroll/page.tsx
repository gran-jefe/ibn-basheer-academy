'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  BookOpen, CheckCircle2, MessageCircle, ArrowLeft, ArrowRight,
  Loader2, AlertCircle, Sparkles, Send, Globe, Sun, Moon, GraduationCap
} from 'lucide-react';
import { ACADEMIC_LEVELS, MAJOR_COURSES, ACADEMY_INFO, type Course } from '@/lib/data/academyData';
import { usePreferences } from '@/lib/usePreferences';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

function EnrollContent() {
  const searchParams = useSearchParams();
  const preLevelId = searchParams.get('level') || 'tamheediy';
  const preCourseId = searchParams.get('course') || 'tajweed';

  const { lang, setLang, theme, toggleTheme } = usePreferences();
  const isAr = lang === 'ar';

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedLevelId, setSelectedLevelId] = useState(preLevelId);
  const [selectedCourseId, setSelectedCourseId] = useState(preCourseId);
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const selectedLevel = ACADEMIC_LEVELS.find((l) => l.id === selectedLevelId);
  const selectedCourse = MAJOR_COURSES.find((c: Course) => c.id === selectedCourseId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      if (isSupabaseConfigured()) {
        const { error } = await supabase.from('enrollments').insert({
          full_name: fullName,
          email,
          phone_number: phoneNumber,
          level_id: selectedLevelId,
          course_id: selectedCourseId,
          notes: notes || null,
          status: 'pending',
          applied_at: new Date().toISOString(),
        });

        if (error) {
          console.error('Supabase enrollment error:', error);
          setErrorMsg(error.message);
          setIsSubmitting(false);
          return;
        }
      }

      setIsSubmitting(false);
      setSubmitted(true);
    } catch (err) {
      setIsSubmitting(false);
      setErrorMsg((err as Error).message || 'Failed to submit application');
    }
  };

  const generateWhatsAppMessage = () => {
    const levelName = isAr ? selectedLevel?.titleAr : selectedLevel?.titleEn;
    const courseName = isAr ? selectedCourse?.titleAr : selectedCourse?.titleEn;

    if (isAr) {
      return encodeURIComponent(
        `السلام عليكم ورحمة الله وبركاته،\nأرغب في إتمام تسديد رسوم القيد في أكاديمية ابن بشير للدراسات العربية والإسلامية:\n- الاسم: ${fullName}\n- المرحلة: ${levelName}\n- المادة: ${courseName}\n- البريد: ${email}\n- الهاتف: ${phoneNumber}\nيرجى تزويدي بحساب التحويل والتأكيد.`
      );
    }

    return encodeURIComponent(
      `As-salāmu 'alaykum wa rahmatullāh,\nI have submitted an admission application for Ibn Basheer Academy:\n- Name: ${fullName}\n- Track: ${levelName}\n- Course: ${courseName}\n- Email: ${email}\n- Phone: ${phoneNumber}\nPlease advise on tuition payment details to finalize enrollment.`
    );
  };

  const whatsappUrl = `${ACADEMY_INFO.contact.whatsappLink}?text=${generateWhatsAppMessage()}`;

  return (
    <div className="min-h-screen flex flex-col bg-paper text-fg">
      {/* Header */}
      <header className="w-full border-b border-line/60 bg-surface/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-fg-muted hover:text-brand-ink transition-colors"
          >
            {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{isAr ? 'العودة للرئيسية' : 'Back to Academy'}</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl text-fg-muted hover:text-fg hover:bg-surface-2 ring-1 ring-line/50 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={() => setLang(isAr ? 'en' : 'ar')}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-fg-muted hover:text-fg hover:bg-surface-2 ring-1 ring-line/50 transition-colors flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{isAr ? 'English' : 'العربية'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-8">

          {/* Heading */}
          <div className="text-center space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-accent-50 text-accent-800 text-xs font-bold ring-1 ring-accent-200">
              <GraduationCap className="w-4 h-4" />
              <span>{isAr ? 'الالتحاق الأكاديمي المعتمد ١٤٤٨هـ' : 'Academic Admissions Open 1448 AH'}</span>
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-ink font-display tracking-tight">
              {isAr ? 'استمارة طلب القيد والتسجيل' : 'Admission & Enrollment Application'}
            </h1>
            <p className="text-sm sm:text-base text-fg-muted max-w-xl mx-auto leading-relaxed">
              {isAr
                ? 'سجّل في برامج العلوم الشرعية واللغة العربية بإشراف الشيخ أبو عبد الله المبارك. سيتم تأكيد القيد فور استلام إيصال الرسوم عبر الواتساب.'
                : 'Enroll in authentic classical Islamic and Arabic programs under Ustaz Abu Abdullah Al-Mubaarak. Tuition is coordinated directly via WhatsApp.'}
            </p>
          </div>

          {submitted ? (
            /* Success confirmation card */
            <div className="p-8 rounded-3xl bg-surface ring-1 ring-line shadow-sm text-center space-y-6 animate-fade-in">
              <div className="w-16 h-16 rounded-3xl bg-success-soft text-success mx-auto flex items-center justify-center ring-1 ring-success/30">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold text-fg">
                  {isAr ? 'تم استلام طلب قيدك بنجاح!' : 'Application Submitted Successfully!'}
                </h2>
                <p className="text-sm text-fg-muted max-w-lg mx-auto leading-relaxed">
                  {isAr
                    ? `شكراً لك يا ${fullName}. تم تسجيل طلبك في (${selectedLevel?.titleAr}). يرجى إتمام تسديد الرسوم عبر الواتساب لتفعيل حسابك ومقعدك الدراسي فوراً.`
                    : `Thank you, ${fullName}. Your application has been logged for (${selectedLevel?.titleEn}). Please finalize tuition payment via WhatsApp to activate your student account.`}
                </p>
              </div>

              {/* Direct WhatsApp Action */}
              <div className="p-6 rounded-2xl bg-brand-50/70 border border-brand-200 text-start space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-brand-ink uppercase tracking-wider">
                  <MessageCircle className="w-4 h-4 text-brand-700" />
                  <span>{isAr ? 'الخطوة التالية — تأكيد الرسوم على واتساب:' : 'Final Step — Confirm Tuition on WhatsApp:'}</span>
                </div>
                <p className="text-xs sm:text-sm text-fg-muted leading-relaxed">
                  {isAr
                    ? 'اضغط على الزر أدناه لإرسال بيانات تسجيلك إلى إدارة القيد والحسابات. سيزودك الشيخ بالحساب البنكي وإيصال السداد لتفعيل حسابك.'
                    : 'Click below to send your pre-formatted application details directly to the academy bursary on WhatsApp to receive account details and immediate access.'}
                </p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>{isAr ? 'تأكيد التسجيل والدفع عبر واتساب' : 'Chat with Bursary on WhatsApp'}</span>
                </a>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <Link
                  href="/login"
                  className="px-5 py-2.5 rounded-xl bg-surface-2 hover:bg-surface-3 ring-1 ring-line text-xs font-bold text-fg transition-colors"
                >
                  {isAr ? 'دخول بوابة الطالب' : 'Go to Student Login'}
                </Link>
                <Link
                  href="/"
                  className="px-5 py-2.5 rounded-xl bg-surface hover:bg-surface-2 ring-1 ring-line text-xs font-bold text-fg-muted hover:text-fg transition-colors"
                >
                  {isAr ? 'العودة للرئيسية' : 'Return Home'}
                </Link>
              </div>
            </div>
          ) : (
            /* Enrollment Form */
            <div className="p-6 sm:p-10 rounded-3xl bg-surface ring-1 ring-line shadow-sm space-y-6">
              {errorMsg && (
                <div className="p-4 rounded-2xl bg-danger-soft border border-danger/20 text-danger-fg text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Stage Selection */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-fg uppercase tracking-wider">
                    {isAr ? '١. اختر المرحلة الدراسية' : '1. Choose Academic Track'}
                  </label>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {ACADEMIC_LEVELS.map((lvl) => {
                      const selected = selectedLevelId === lvl.id;
                      return (
                        <button
                          key={lvl.id}
                          type="button"
                          onClick={() => setSelectedLevelId(lvl.id)}
                          className={`p-4 rounded-2xl text-start ring-1 transition-all flex flex-col justify-between gap-2 ${
                            selected
                              ? 'bg-brand-50/70 ring-2 ring-brand-700 text-brand-ink shadow-xs'
                              : 'bg-surface hover:bg-surface-2 ring-line text-fg'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-surface-2 text-fg-subtle">
                              {isAr ? `المرحلة ${lvl.stage}` : `Stage ${lvl.stage}`}
                            </span>
                            <span className="text-[11px] font-semibold text-fg-subtle">
                              {isAr ? lvl.durationAr : lvl.durationEn}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-sm font-extrabold text-fg mt-1">
                              {isAr ? lvl.titleAr : lvl.titleEn}
                            </h3>
                            <p className="text-xs text-fg-muted line-clamp-2 mt-1">
                              {isAr ? lvl.descriptionAr : lvl.descriptionEn}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Primary Subject */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-fg uppercase tracking-wider">
                    {isAr ? '٢. المادة الأساسية المطلوبة' : '2. Primary Desired Subject'}
                  </label>
                  <select
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-surface ring-1 ring-line focus:ring-2 focus:ring-brand-ring outline-none text-sm text-fg transition-all cursor-pointer"
                  >
                    {MAJOR_COURSES.map((c: Course) => (
                      <option key={c.id} value={c.id}>
                        {isAr ? `${c.titleAr} (${c.titleEn})` : `${c.titleEn} (${c.titleAr})`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Personal Information */}
                <div className="space-y-4 pt-2 border-t border-line">
                  <label className="block text-xs font-bold text-fg uppercase tracking-wider">
                    {isAr ? '٣. بيانات الطالب' : '3. Applicant Information'}
                  </label>

                  <div>
                    <label className="block text-xs font-bold text-fg mb-1.5">
                      {isAr ? 'الاسم الثلاثي كاملاً' : 'Full Legal Name'}
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={isAr ? 'أحمد بن عبد الله' : 'Ahmad Ibn Abdullah'}
                      className="w-full px-4 py-3 rounded-xl bg-surface ring-1 ring-line focus:ring-2 focus:ring-brand-ring outline-none text-sm text-fg placeholder:text-fg-subtle transition-all"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-fg mb-1.5">
                        {isAr ? 'البريد الإلكتروني' : 'Email Address'}
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ahmad@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-surface ring-1 ring-line focus:ring-2 focus:ring-brand-ring outline-none text-sm text-fg placeholder:text-fg-subtle transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-fg mb-1.5">
                        {isAr ? 'رقم الواتساب (للتواصل وإرسال الإيصال)' : 'WhatsApp Phone (For Tuition & Receipt)'}
                      </label>
                      <input
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+234 800 000 0000"
                        className="w-full px-4 py-3 rounded-xl bg-surface ring-1 ring-line focus:ring-2 focus:ring-brand-ring outline-none text-sm text-fg placeholder:text-fg-subtle transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-fg mb-1.5">
                      {isAr ? 'ملاحظات أو أسئلة إضافية (اختياري)' : 'Additional Notes / Previous Studies (Optional)'}
                    </label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder={isAr ? 'اذكر ما حفظته من القرآن أو المتون الشرعية...' : 'Mention any texts memorized or prior studies...'}
                      className="w-full px-4 py-3 rounded-xl bg-surface ring-1 ring-line focus:ring-2 focus:ring-brand-ring outline-none text-sm text-fg placeholder:text-fg-subtle transition-all resize-none"
                    />
                  </div>
                </div>

                {/* WhatsApp Notice Banner */}
                <div className="p-4 rounded-2xl bg-surface-2 ring-1 ring-line/80 text-xs text-fg-muted space-y-1.5">
                  <span className="font-bold text-brand-ink block">
                    {isAr ? 'ملاحظة بخصوص الرسوم والدفع:' : 'Tuition & Payment Notice:'}
                  </span>
                  <p>
                    {isAr
                      ? 'لا توجد بوابات دفع إلكترونية تابعة لجهات خارجية. يتم تسديد الرسوم مباشرة إلى إدارة الأكاديمية عبر الواتساب لتأكيد القبول.'
                      : 'All tuition fees are verified directly with the academy bursary on WhatsApp. No third-party card processors required.'}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm sm:text-base shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  <span>{isSubmitting ? (isAr ? 'جاري إرسال الطلب...' : 'Submitting Application...') : (isAr ? 'إرسال طلب القيد والمتابعة على واتساب' : 'Submit Admission Application')}</span>
                </button>
              </form>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default function EnrollPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-paper text-fg"><Loader2 className="w-6 h-6 animate-spin text-brand-700" /></div>}>
      <EnrollContent />
    </Suspense>
  );
}
