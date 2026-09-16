'use client';

import React, { useState } from 'react';
import {
  GraduationCap, Award, Printer, Download, CheckCircle2,
  FileText, Sparkles, BookOpen, ShieldCheck, ArrowRight, ArrowLeft
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import type { Lang } from '@/lib/usePreferences';
import { ACADEMY_INFO } from '@/lib/data/academyData';

interface TranscriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Lang;
  studentName?: string;
}

interface CourseRecord {
  code: string;
  titleEn: string;
  titleAr: string;
  matnEn: string;
  matnAr: string;
  credits: number;
  assignmentScore: number;
  recitationScore: number;
  finalScore: number;
  letterGrade: string;
}

const TRANSCRIPT_RECORDS: CourseRecord[] = [
  {
    code: 'TAJ-101',
    titleEn: 'Tajwīd & Phonetic Rules',
    titleAr: 'أحكام التجويد ومخارج الحروف',
    matnEn: 'Tuḥfat al-Aṭfāl',
    matnAr: 'تحفة الأطفال للجمزوري',
    credits: 4,
    assignmentScore: 98,
    recitationScore: 48,
    finalScore: 97,
    letterGrade: 'A+',
  },
  {
    code: 'ARB-101',
    titleEn: 'Arabic Grammar & Morphology',
    titleAr: 'قواعد النحو والصرف',
    matnEn: 'Matn al-Ajrūmiyyah',
    matnAr: 'متن الآجرومية لابن آجروم',
    credits: 5,
    assignmentScore: 94,
    recitationScore: 45,
    finalScore: 93,
    letterGrade: 'A',
  },
  {
    code: 'FIQ-101',
    titleEn: 'Islamic Jurisprudence (Fiqh)',
    titleAr: 'الفقه الإسلامي — العبادات',
    matnEn: 'Matn Abī Shujāʿ',
    matnAr: 'متن أبي شجاع (غاية الاختصار)',
    credits: 5,
    assignmentScore: 95,
    recitationScore: 46,
    finalScore: 94,
    letterGrade: 'A',
  },
  {
    code: 'AQD-101',
    titleEn: 'Tawḥīd & ʿAqīdah Foundations',
    titleAr: 'التوحيد وأصول العقيدة',
    matnEn: 'Al-Uṣūl al-Thalāthah',
    matnAr: 'الأصول الثلاثة وأدلتها',
    credits: 4,
    assignmentScore: 100,
    recitationScore: 50,
    finalScore: 99,
    letterGrade: 'A+',
  },
  {
    code: 'HAD-101',
    titleEn: 'Ḥadīth Sciences',
    titleAr: 'الحديث الشريف وعلومه',
    matnEn: 'Al-Arbaʿūn al-Nawawiyyah',
    matnAr: 'الأربعون النووية للإمام النووي',
    credits: 4,
    assignmentScore: 96,
    recitationScore: 47,
    finalScore: 95,
    letterGrade: 'A',
  },
];

export const TranscriptModal: React.FC<TranscriptModalProps> = ({
  isOpen,
  onClose,
  lang,
  studentName = 'Ahmad Ibn Ibrahim (طالب العلم)',
}) => {
  const isAr = lang === 'ar';
  const [viewMode, setViewMode] = useState<'transcript' | 'certificate'>('transcript');

  const totalCredits = TRANSCRIPT_RECORDS.reduce((sum, r) => sum + r.credits, 0);
  const weightedTotal = TRANSCRIPT_RECORDS.reduce((sum, r) => sum + r.finalScore * r.credits, 0);
  const averageGrade = (weightedTotal / totalCredits).toFixed(1);
  const gpa = (Number(averageGrade) / 25).toFixed(2); // converts ~95.6 to ~3.82 / 4.0 scale

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title={isAr ? 'السجل الأكاديمي والشهادات الرسمية' : 'Official Academic Transcript & Certificates'}
      subtitle={
        isAr
          ? 'سجل الدرجات المعتمد وشهادة الإتمام التأصيلية لطلاب أكاديمية ابن بشير'
          : 'Verified scholastic records & certificate of classical seminary attainment'
      }
      icon={<GraduationCap className="w-5 h-5 text-accent-600" />}
    >
      <div className="space-y-6">
        
        {/* Sub-view Switcher Bar */}
        <div className="flex items-center justify-between p-2 rounded-2xl bg-surface-2 ring-1 ring-line print:hidden">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setViewMode('transcript')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                viewMode === 'transcript' ? 'bg-surface text-fg shadow-xs ring-1 ring-line' : 'text-fg-muted hover:text-fg'
              }`}
            >
              <FileText className="w-4 h-4 text-brand-600" />
              <span>{isAr ? 'كشف الدرجات الأكاديمي' : 'Academic Transcript'}</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('certificate')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                viewMode === 'certificate' ? 'bg-surface text-fg shadow-xs ring-1 ring-line' : 'text-fg-muted hover:text-fg'
              }`}
            >
              <Award className="w-4 h-4 text-accent-600" />
              <span>{isAr ? 'عرض شهادة الإتمام' : 'Certificate of Completion'}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>{isAr ? 'طباعة / حفظ PDF' : 'Print / Save PDF'}</span>
          </button>
        </div>

        {/* VIEW 1: ACADEMIC TRANSCRIPT */}
        {viewMode === 'transcript' && (
          <div className="space-y-6">
            
            {/* Student Header Card */}
            <div className="p-5 sm:p-6 rounded-3xl bg-surface ring-1 ring-line shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-line pb-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-accent-700 bg-accent-50 px-2.5 py-1 rounded-full">
                    {isAr ? 'طالب منتظم — المرحلة الابتدائية' : 'Enrolled Student — Stage 2: Ibtidā’iyya'}
                  </span>
                  <h3 className="text-xl font-bold text-fg mt-1.5">{studentName}</h3>
                  <p className="text-xs text-fg-muted">
                    {isAr ? 'رقم القيد الأكاديمي: IBA-2026-0842' : 'Student ID: IBA-2026-0842 • Regular Track'}
                  </p>
                </div>

                <div className="flex items-center gap-3 bg-surface-2 p-3.5 rounded-2xl ring-1 ring-line/80">
                  <div className="text-center px-2">
                    <span className="block text-[10px] font-bold text-fg-subtle uppercase">
                      {isAr ? 'المعدل التراكمي' : 'Cumulative GPA'}
                    </span>
                    <span className="text-lg font-black text-brand-ink tabular font-display">
                      {gpa} <span className="text-xs text-fg-muted">/ 4.00</span>
                    </span>
                  </div>
                  <div className="w-px h-8 bg-line" />
                  <div className="text-center px-2">
                    <span className="block text-[10px] font-bold text-fg-subtle uppercase">
                      {isAr ? 'الساعات المعتمدة' : 'Credits Passed'}
                    </span>
                    <span className="text-lg font-black text-fg tabular">
                      {totalCredits} <span className="text-xs text-fg-muted">units</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Course Grade Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-start">
                  <thead>
                    <tr className="border-b border-line text-fg-subtle font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-2.5 px-3 text-start">{isAr ? 'المادة الدراسية' : 'Course'}</th>
                      <th className="py-2.5 px-3 text-start">{isAr ? 'المتن المعتمد' : 'Classical Text (Matn)'}</th>
                      <th className="py-2.5 px-3 text-center">{isAr ? 'الوحدات' : 'Units'}</th>
                      <th className="py-2.5 px-3 text-center">{isAr ? 'الواجبات' : 'Coursework'}</th>
                      <th className="py-2.5 px-3 text-center">{isAr ? 'التلاوة' : 'Recitation'}</th>
                      <th className="py-2.5 px-3 text-center">{isAr ? 'التقدير' : 'Grade'}</th>
                      <th className="py-2.5 px-3 text-end">{isAr ? 'الحالة' : 'Status'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line/60 font-medium">
                    {TRANSCRIPT_RECORDS.map((item) => (
                      <tr key={item.code} className="hover:bg-surface-2/60 transition-colors">
                        <td className="py-3 px-3 font-bold text-fg">
                          <div>{isAr ? item.titleAr : item.titleEn}</div>
                          <span className="text-[10px] text-fg-subtle">{item.code}</span>
                        </td>
                        <td className="py-3 px-3 text-brand-ink font-semibold">
                          {isAr ? item.matnAr : item.matnEn}
                        </td>
                        <td className="py-3 px-3 text-center tabular">{item.credits}</td>
                        <td className="py-3 px-3 text-center tabular">{item.assignmentScore}%</td>
                        <td className="py-3 px-3 text-center tabular">{item.recitationScore} / 50</td>
                        <td className="py-3 px-3 text-center">
                          <span className="px-2 py-0.5 rounded-md font-bold bg-brand-tint text-brand-ink ring-1 ring-brand-ring">
                            {item.letterGrade}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-end text-success font-bold flex items-center justify-end gap-1 pt-4">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{isAr ? 'ناجح' : 'Passed'}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Bottom Verification Seal */}
              <div className="p-4 rounded-2xl bg-surface-2 ring-1 ring-line flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-fg-muted">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-accent-600 shrink-0" />
                  <span>
                    {isAr
                      ? 'وثيقة رسمية صادرة ومعتمدة من عمادة الشؤون الأكاديمية — أكاديمية ابن بشير'
                      : 'Certified academic record issued by the Academic Dean — Ibn Basheer Academy'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setViewMode('certificate')}
                  className="px-4 py-2 rounded-xl bg-accent-600 hover:bg-accent-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>{isAr ? 'إصدار الشهادة الرسمية' : 'View Branded Certificate'}</span>
                </button>
              </div>

            </div>

          </div>
        )}

        {/* VIEW 2: ORNAMENTAL CERTIFICATE OF ATTAINMENT */}
        {viewMode === 'certificate' && (
          <div className="p-2 sm:p-4">
            
            {/* The Classical Certificate Canvas */}
            <div
              className="relative p-8 sm:p-12 rounded-3xl bg-surface ring-2 ring-accent-400/60 shadow-2xl border-8 border-double border-accent-200/60 text-center space-y-6 overflow-hidden"
              style={{
                backgroundImage: 'radial-gradient(ellipse at center, var(--surface) 0%, var(--surface-2) 100%)',
              }}
            >
              {/* Corner Ornaments */}
              <div className="absolute top-3 start-3 text-accent-500 opacity-60 text-2xl select-none">❖</div>
              <div className="absolute top-3 end-3 text-accent-500 opacity-60 text-2xl select-none">❖</div>
              <div className="absolute bottom-3 start-3 text-accent-500 opacity-60 text-2xl select-none">❖</div>
              <div className="absolute bottom-3 end-3 text-accent-500 opacity-60 text-2xl select-none">❖</div>

              {/* Basmalah */}
              <div className="font-display text-xl sm:text-2xl font-bold text-accent-800 select-none" dir="rtl">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </div>

              {/* Academy Name */}
              <div className="space-y-1">
                <h3 className="font-display text-lg sm:text-2xl font-extrabold text-brand-ink tracking-wide">
                  أكاديمية ابن بشير للدراسات العربية والإسلامية
                </h3>
                <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-fg-subtle">
                  IBN BASHEER ACADEMY FOR ARABIC & ISLAMIC STUDIES
                </p>
              </div>

              {/* Certificate Title Banner */}
              <div className="inline-block px-6 py-2 rounded-full bg-accent-500/15 border border-accent-400 text-accent-700 dark:text-accent-300 text-xs sm:text-sm font-extrabold uppercase tracking-widest">
                {isAr ? 'شهادة إتمام وتحصيل علمي تأصيلي' : 'Certificate of Scholastic Merit & Classical Attainment'}
              </div>

              {/* Testimonial Statement */}
              <div className="max-w-2xl mx-auto space-y-3 text-xs sm:text-sm leading-relaxed text-fg">
                <p className="text-fg-muted">
                  {isAr
                    ? 'تشهد إدارة الأكاديمية بأن الطالب المكرَّم:'
                    : 'This is to certify that the dedicated student:'}
                </p>
                <div className="font-display text-2xl sm:text-3xl font-extrabold text-brand-ink border-b border-accent-300 pb-2">
                  {studentName}
                </div>
                <p className="text-fg leading-relaxed">
                  {isAr
                    ? 'قد أتم بحمد الله وتوفيقه دراسة وحفظ المقررات التأصيلية المقررة في المرحلة الابتدائية، وأتقن متني (الآجرومية في النحو) و(تحفة الأطفال في التجويد) بأداء متميز ومعدل ممتاز.'
                    : 'has successfully completed and mastered the prescribed seminary curriculum, demonstrating scholastic proficiency in Classical Arabic Grammar (Matn al-Ajrūmiyyah) and Tajwīd Recitation (Tuḥfat al-Aṭfāl) with an exemplary academic record.'}
                </p>
              </div>

              {/* Signatures & Seal Block */}
              <div className="pt-8 grid grid-cols-3 items-end max-w-2xl mx-auto gap-4">
                
                {/* Dean Signature */}
                <div className="text-center space-y-1">
                  <div className="font-serif italic text-sm text-fg-muted font-bold">Dr. S. Al-Bukhari</div>
                  <div className="w-28 mx-auto h-px bg-fg-subtle" />
                  <span className="text-[10px] font-bold text-fg-subtle uppercase block">
                    {isAr ? 'عميد الشؤون الأكاديمية' : 'Academic Dean'}
                  </span>
                </div>

                {/* Golden Academy Seal */}
                <div className="flex flex-col items-center justify-center">
                  <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-accent-400 text-brand-950 flex flex-col items-center justify-center shadow-lg border-4 border-accent-200">
                    <Sparkles className="w-6 h-6 text-brand-950" />
                    <span className="text-[8px] font-black uppercase tracking-tighter">VERIFIED</span>
                  </div>
                  <span className="text-[9px] font-bold text-accent-700 dark:text-accent-300 mt-1">SEAL OF ATTAINMENT</span>
                </div>

                {/* Lead Instructor Signature */}
                <div className="text-center space-y-1">
                  <div className="font-display font-bold text-sm text-brand-ink">الشيخ أبو عبد الله المبارك</div>
                  <div className="w-28 mx-auto h-px bg-fg-subtle" />
                  <span className="text-[10px] font-bold text-fg-subtle uppercase block">
                    {isAr ? 'المدرس والمشرف العام' : 'Lead Instructor'}
                  </span>
                </div>

              </div>

              {/* Certificate Footer Verification Code */}
              <div className="pt-4 border-t border-line/60 text-[10px] text-fg-subtle flex flex-wrap items-center justify-between gap-2">
                <span>Registration No: IBA-2026-CERT-0842</span>
                <span>Issued: 1448 AH / 2026 CE</span>
                <span>Verification: verify.ibnbasheer.edu/0842</span>
              </div>

            </div>

          </div>
        )}

      </div>
    </Modal>
  );
};
