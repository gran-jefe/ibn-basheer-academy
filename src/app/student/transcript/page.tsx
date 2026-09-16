'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Printer, ArrowLeft, ArrowRight, Award, ShieldCheck, CheckCircle2,
  BookOpen, Globe, Sun, Moon, Sparkles, FileText
} from 'lucide-react';
import { usePreferences } from '@/lib/usePreferences';
import { ACADEMY_INFO } from '@/lib/data/academyData';
import { getCurrentUser, type UserProfile } from '@/lib/services/authService';

interface CourseGrade {
  code: string;
  titleAr: string;
  titleEn: string;
  matn: string;
  credits: number;
  coursework: number;
  recitation: number;
  grade: string;
  status: 'Passed' | 'ناجح';
}

const TRANSCRIPT_DATA: CourseGrade[] = [
  {
    code: 'TAJ-101',
    titleAr: 'علم التجويد ومخارج الحروف',
    titleEn: 'Tajwīd & Phonetics (Tuḥfat al-Aṭfāl)',
    matn: 'تحفة الأطفال للجمزوري',
    credits: 3,
    coursework: 48,
    recitation: 49,
    grade: 'A+',
    status: 'Passed',
  },
  {
    code: 'ARB-101',
    titleAr: 'النحو العربي وقواعد الإعراب',
    titleEn: 'Arabic Syntax & Grammar (Al-Ajrūmiyyah)',
    matn: 'متن الآجرومية لابن آجروم',
    credits: 4,
    coursework: 45,
    recitation: 46,
    grade: 'A',
    status: 'Passed',
  },
  {
    code: 'FIQ-101',
    titleAr: 'فقه العبادات (الطهارة والصلاة)',
    titleEn: 'Jurisprudence of Worship (Al-Murshid al-Mu’īn)',
    matn: 'المرشد المعين لابن عاشر',
    credits: 4,
    coursework: 47,
    recitation: 48,
    grade: 'A+',
    status: 'Passed',
  },
  {
    code: 'AQD-101',
    titleAr: 'العقيدة الإسلامية والتوحيد',
    titleEn: 'Islamic Creed & Tawḥīd (Al-Uṣūl al-Thalāthah)',
    matn: 'الأصول الثلاثة وأدلتها',
    credits: 3,
    coursework: 50,
    recitation: 50,
    grade: 'A+',
    status: 'Passed',
  },
  {
    code: 'HDT-101',
    titleAr: 'شرح الحديث النبوي الشريف',
    titleEn: 'Hadith Studies (An-Nawawī 40 Hadith)',
    matn: 'الأربعون النووية',
    credits: 4,
    coursework: 46,
    recitation: 47,
    grade: 'A',
    status: 'Passed',
  },
  {
    code: 'FAR-101',
    titleAr: 'مبادئ الفرائض والمواريث',
    titleEn: 'Islamic Inheritance Law (Al-Raḥabiyyah)',
    matn: 'بغية الباحث عن جُمَل الموارث',
    credits: 4,
    coursework: 44,
    recitation: 45,
    grade: 'A-',
    status: 'Passed',
  },
];

export default function TranscriptPage() {
  const { lang, setLang, theme, toggleTheme } = usePreferences();
  const isAr = lang === 'ar';

  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'transcript' | 'certificate'>('transcript');

  useEffect(() => {
    getCurrentUser().then((u) => setUser(u));
  }, []);

  const studentDisplayName = user?.fullName || (isAr ? 'أحمد بن إبراهيم' : 'Ahmad Ibn Ibrahim');
  const totalCredits = TRANSCRIPT_DATA.reduce((acc, c) => acc + c.credits, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-paper text-fg">
      {/* Top Navigation Bar - Hidden on print */}
      <header className="border-b border-line/60 bg-surface/80 backdrop-blur-md sticky top-0 z-30 print:hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/student"
            className="flex items-center gap-2 text-xs sm:text-sm font-bold text-fg-muted hover:text-brand-ink transition-colors"
          >
            {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{isAr ? 'العودة لبوابة الطالب' : 'Back to Student LMS'}</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isAr ? 'طباعة / حفظ PDF' : 'Print / Save PDF'}</span>
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl text-fg-muted hover:text-fg hover:bg-surface-2 ring-1 ring-line/50 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={() => setLang(isAr ? 'en' : 'ar')}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-fg-muted hover:text-fg hover:bg-surface-2 ring-1 ring-line/50 transition-colors flex items-center gap-1"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{isAr ? 'EN' : 'ع'}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-8">
        
        {/* Toggle between Transcript and Ijāzah Certificate */}
        <div className="flex items-center justify-center gap-3 print:hidden">
          <button
            type="button"
            onClick={() => setActiveTab('transcript')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'transcript'
                ? 'bg-brand-700 text-white shadow-md'
                : 'bg-surface ring-1 ring-line text-fg-muted hover:text-fg'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{isAr ? 'كشف الدرجات الأكاديمي' : 'Academic Grade Transcript'}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('certificate')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'certificate'
                ? 'bg-accent-700 text-white shadow-md'
                : 'bg-surface ring-1 ring-line text-fg-muted hover:text-fg'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>{isAr ? 'شهادة التخرج والإجازة' : 'Formal Ijāzah Certificate'}</span>
          </button>
        </div>

        {activeTab === 'transcript' ? (
          /* TAB 1: ACADEMIC TRANSCRIPT */
          <div className="p-8 sm:p-12 rounded-3xl bg-surface ring-1 ring-line shadow-sm space-y-8 print:ring-0 print:shadow-none print:p-0">
            
            {/* Header with crest */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b-2 border-brand-900/20 pb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-brand-900 text-accent-400 flex items-center justify-center shadow-sm">
                  <BookOpen className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-brand-950 font-display">
                    {isAr ? 'أكاديمية ابن بشير للدراسات العربية والإسلامية' : 'Ibn Basheer Academy for Arabic & Islamic Studies'}
                  </h1>
                  <p className="text-xs text-brand-ink font-semibold">
                    {isAr ? 'السجل الأكاديمي الرسمي المعتمد · قسم التعليم الافتراضي' : 'Official Academic Transcript of Records · Virtual Seminary Division'}
                  </p>
                </div>
              </div>

              <div className="text-end text-xs font-semibold text-fg-subtle">
                <p>{isAr ? 'الرقم المرجعي:' : 'Doc ID:'} <span className="font-mono text-fg font-bold" dir="ltr">IBA-TR-1448-092</span></p>
                <p className="mt-1">{isAr ? 'تاريخ التحرير:' : 'Issued:'} <span className="tabular font-bold text-fg" dir="ltr">15 Sept 2026</span></p>
              </div>
            </div>

            {/* Student Bio Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-surface-2 ring-1 ring-line/70 text-xs">
              <div>
                <span className="text-fg-subtle block">{isAr ? 'اسم الطالب:' : 'Student Name:'}</span>
                <span className="font-extrabold text-fg text-sm mt-0.5 block">{studentDisplayName}</span>
              </div>
              <div>
                <span className="text-fg-subtle block">{isAr ? 'المرحلة المقيد بها:' : 'Academic Stage:'}</span>
                <span className="font-extrabold text-fg text-sm mt-0.5 block">{isAr ? 'المرحلة الابتدائية الشرعية' : 'Primary Shari’ah Level'}</span>
              </div>
              <div>
                <span className="text-fg-subtle block">{isAr ? 'المعدل التراكمي (GPA):' : 'Cumulative GPA:'}</span>
                <span className="font-extrabold text-accent-700 text-base mt-0.5 block tabular">3.82 / 4.00</span>
              </div>
              <div>
                <span className="text-fg-subtle block">{isAr ? 'الوحدات المنجزة:' : 'Total Credits:'}</span>
                <span className="font-extrabold text-brand-ink text-base mt-0.5 block tabular">{totalCredits} {isAr ? 'وحدة' : 'Units'}</span>
              </div>
            </div>

            {/* Courses Grade Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm text-start border-collapse">
                <thead>
                  <tr className="border-b-2 border-line bg-surface-2 text-fg font-extrabold text-[11px] uppercase tracking-wider">
                    <th className="py-3 px-3.5 text-start">{isAr ? 'رمز المقرر' : 'Code'}</th>
                    <th className="py-3 px-3.5 text-start">{isAr ? 'المادة والمتن المعتمد' : 'Course & Matn Text'}</th>
                    <th className="py-3 px-3 text-center">{isAr ? 'الوحدات' : 'Credits'}</th>
                    <th className="py-3 px-3 text-center">{isAr ? 'التحريري' : 'Exam'}</th>
                    <th className="py-3 px-3 text-center">{isAr ? 'التسميع' : 'Recitation'}</th>
                    <th className="py-3 px-3 text-center">{isAr ? 'التقدير' : 'Grade'}</th>
                    <th className="py-3 px-3.5 text-end">{isAr ? 'النتيجة' : 'Status'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/60">
                  {TRANSCRIPT_DATA.map((c) => (
                    <tr key={c.code} className="hover:bg-surface-2/40 transition-colors">
                      <td className="py-3.5 px-3.5 font-mono font-bold text-fg-subtle" dir="ltr">{c.code}</td>
                      <td className="py-3.5 px-3.5">
                        <p className="font-extrabold text-fg">{isAr ? c.titleAr : c.titleEn}</p>
                        <p className="text-xs text-brand-ink font-medium mt-0.5">{c.matn}</p>
                      </td>
                      <td className="py-3.5 px-3 text-center font-semibold tabular">{c.credits}</td>
                      <td className="py-3.5 px-3 text-center font-semibold tabular">{c.coursework}/50</td>
                      <td className="py-3.5 px-3 text-center font-semibold tabular">{c.recitation}/50</td>
                      <td className="py-3.5 px-3 text-center font-extrabold text-accent-700">{c.grade}</td>
                      <td className="py-3.5 px-3.5 text-end">
                        <span className="px-2.5 py-1 rounded-md bg-success-soft text-success-fg text-xs font-bold">
                          {isAr ? 'ناجح' : 'Passed'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Seal & Institutional Signatures */}
            <div className="pt-8 border-t-2 border-line/60 grid grid-cols-2 sm:grid-cols-3 gap-6 items-center text-center text-xs">
              <div className="space-y-2">
                <p className="font-bold text-fg">{isAr ? 'المدرس والمقرئ الرئيسي:' : 'Lead Instructor:'}</p>
                <div className="font-display text-base font-bold text-brand-ink">الشيخ أبو عبد الله المبارك</div>
                <p className="text-[11px] text-fg-subtle">Ustaz Abu Abdullah Al-Mubaarak</p>
              </div>

              <div className="flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-accent-600/60 flex items-center justify-center p-2 text-center text-[9px] font-bold uppercase tracking-wider text-accent-800 rotate-[-8deg]">
                  <span>Verified Institutional Record</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-fg">{isAr ? 'عميد الشؤون التعليمية:' : 'Academic Dean:'}</p>
                <div className="font-display text-base font-bold text-brand-ink">إدارة التعليم والامتحانات</div>
                <p className="text-[11px] text-fg-subtle">Office of Academic Registrar</p>
              </div>
            </div>

          </div>
        ) : (
          /* TAB 2: ORNAMENTAL CALLIGRAPHIC CERTIFICATE / IJĀZAH */
          <div className="p-8 sm:p-14 rounded-3xl bg-surface ring-4 ring-double ring-accent-500/50 shadow-md space-y-8 text-center print:ring-0 print:shadow-none print:p-4">
            
            <div className="space-y-4">
              <div className="text-xl sm:text-2xl font-display text-brand-900 font-bold" dir="rtl">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </div>

              <div className="w-16 h-16 rounded-2xl bg-brand-900 text-accent-400 mx-auto flex items-center justify-center shadow-md">
                <BookOpen className="w-8 h-8" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-ink font-display tracking-tight">
                {isAr ? 'شهادة إتمام واجتياز مرحلة علمية' : 'Formal Certificate of Completion & Text Mastery'}
              </h2>
              <p className="text-xs uppercase tracking-widest text-accent-800 font-bold">
                أكاديمية ابن بشير للدراسات العربية والإسلامية
              </p>
            </div>

            {/* Certificate Testimonial Body */}
            <div className="p-8 rounded-2xl bg-surface-2/60 ring-1 ring-line/80 space-y-6 text-sm sm:text-base leading-loose max-w-3xl mx-auto">
              <p className="text-fg font-medium">
                {isAr
                  ? 'تشهد إدارة أكاديمية ابن بشير بأن الأخ الطالب / الأخت الطالبة:'
                  : 'Ibn Basheer Academy hereby certifies that the student:'}
              </p>

              <div className="py-2 text-2xl sm:text-3xl font-extrabold text-brand-900 font-display border-b-2 border-dashed border-accent-600/40 inline-block px-8">
                {studentDisplayName}
              </div>

              <p className="text-fg-muted leading-relaxed">
                {isAr
                  ? 'قد أتم بنجاح متطلبات (المرحلة الابتدائية الشرعية) متقناً للمتون المعتمدة في أحكام التجويد (تحفة الأطفال)، ومبادئ النحو (الآجرومية)، وفقه العبادات، والأربعين النووية، بعد حضور الحلقات واجتياز التسميع والاختبارات التحريرية بتقدير (ممتاز مرتفع — GPA: 3.82).'
                  : 'Has successfully fulfilled all curricular requirements for the Primary Shari’ah Track, demonstrating mastery of the classical texts in Tajwīd (Tuḥfat al-Aṭfāl), Arabic Syntax (Al-Ajrūmiyyah), Jurisprudence of Worship, and the 40 Hadith with High Honors (GPA: 3.82).'}
              </p>
            </div>

            {/* Signatures */}
            <div className="pt-6 grid grid-cols-2 gap-8 max-w-2xl mx-auto text-xs sm:text-sm">
              <div className="space-y-1.5 border-t border-line pt-3">
                <p className="font-extrabold text-fg">{isAr ? 'الشيخ أبو عبد الله المبارك' : 'Ustaz Abu Abdullah Al-Mubaarak'}</p>
                <p className="text-xs text-fg-subtle">{isAr ? 'المدرس والمقرئ المشرف' : 'Lead Instructor & Reciter'}</p>
              </div>

              <div className="space-y-1.5 border-t border-line pt-3">
                <p className="font-extrabold text-fg">{isAr ? 'إدارة الشؤون الأكاديمية' : 'Academic Registrar'}</p>
                <p className="text-xs text-fg-subtle">{isAr ? 'أكاديمية ابن بشير الافتراضية' : 'Ibn Basheer Online Seminary'}</p>
              </div>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}
