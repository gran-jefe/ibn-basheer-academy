'use client';

import React, { useState, useEffect } from 'react';
import {
  Video, BookOpen, Hand, MessageSquare, Send, Users, ExternalLink,
  Copy, Check, Download, Radio, Volume2, Sparkles, AlertCircle
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import type { Lang } from '@/lib/usePreferences';
import type { LiveClass } from '@/lib/data/academyData';

interface ClassroomModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Lang;
  liveClass: LiveClass | null;
}

interface QuestionItem {
  id: string;
  studentName: string;
  question: string;
  category: string;
  status: 'pending' | 'answered';
  time: string;
}

const DEFAULT_QUESTIONS: QuestionItem[] = [
  {
    id: 'q1',
    studentName: 'Ahmad Ibrahim',
    question: 'How do we differentiate between Hams and Jahr when articulating letter Tā’ (ت)?',
    category: 'Tajweed',
    status: 'answered',
    time: '10 mins ago',
  },
  {
    id: 'q2',
    studentName: 'Maryam Bello',
    question: 'Could Ustaz kindly repeat the distinction between Madd Muttasil and Madd Munfasil?',
    category: 'Tajweed',
    status: 'pending',
    time: '3 mins ago',
  },
];

export const ClassroomModal: React.FC<ClassroomModalProps> = ({
  isOpen,
  onClose,
  lang,
  liveClass,
}) => {
  const isAr = lang === 'ar';

  const [textSize, setTextSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [activePaneTab, setActivePaneTab] = useState<'queue' | 'notes'>('queue');
  
  // Student Question Queue
  const [questions, setQuestions] = useState<QuestionItem[]>(DEFAULT_QUESTIONS);
  const [newQuestion, setNewQuestion] = useState('');
  const [questionCategory, setQuestionCategory] = useState('Tajweed');
  const [questionSent, setQuestionSent] = useState(false);

  // Lesson Notepad
  const [notes, setNotes] = useState('');
  const [copiedNotes, setCopiedNotes] = useState(false);

  // Restore saved notes for this class
  useEffect(() => {
    if (typeof window !== 'undefined' && liveClass) {
      const saved = localStorage.getItem(`ib-notes-${liveClass.id}`);
      if (saved) setNotes(saved);
    }
  }, [liveClass]);

  const handleSaveNotes = (val: string) => {
    setNotes(val);
    if (typeof window !== 'undefined' && liveClass) {
      localStorage.setItem(`ib-notes-${liveClass.id}`, val);
    }
  };

  const handleCopyNotes = () => {
    if (!notes) return;
    navigator.clipboard.writeText(notes);
    setCopiedNotes(true);
    setTimeout(() => setCopiedNotes(false), 2000);
  };

  const handleDownloadNotes = () => {
    if (!notes) return;
    const blob = new Blob([notes], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Ibn-Basheer-Lecture-Notes-${liveClass?.id || 'class'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSubmitQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    const item: QuestionItem = {
      id: `q-${Date.now()}`,
      studentName: isAr ? 'أنت (طالب)' : 'You (Student)',
      question: newQuestion.trim(),
      category: questionCategory,
      status: 'pending',
      time: isAr ? 'الآن' : 'Just now',
    };

    setQuestions((prev) => [item, ...prev]);
    setNewQuestion('');
    setQuestionSent(true);
    setTimeout(() => setQuestionSent(false), 3000);
  };

  if (!liveClass) return null;

  const fontClass =
    textSize === 'xlarge'
      ? 'text-2xl sm:text-3xl leading-[2.6]'
      : textSize === 'large'
      ? 'text-xl sm:text-2xl leading-[2.3]'
      : 'text-lg sm:text-xl leading-[2.1]';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title={isAr ? `قاعة الدرس المباشر: ${liveClass.titleAr}` : `Live Virtual Classroom: ${liveClass.titleEn}`}
      subtitle={isAr ? `المدرس: ${liveClass.instructor} • بث تفاعلي مباشر` : `Instructor: ${liveClass.instructor} • Interactive Broadcast`}
      icon={<Radio className="w-5 h-5 text-danger animate-pulse" />}
    >
      <div className="space-y-6">
        
        {/* Live Broadcast Action Bar */}
        <div className="p-4 sm:p-5 rounded-3xl bg-brand-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-danger/20 text-danger border border-danger/40 flex items-center justify-center shrink-0">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-danger text-white">
                  {isAr ? 'البث المباشر نشط' : 'Live Now'}
                </span>
                <span className="text-xs text-brand-200 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  <span>{isAr ? '٤٨ طالباً في الحلقة' : '48 students present'}</span>
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mt-0.5">
                {isAr ? liveClass.subjectAr : liveClass.subjectEn} ({isAr ? liveClass.dayAr : liveClass.dayEn})
              </h4>
            </div>
          </div>

          <a
            href={liveClass.meetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-accent-400 hover:bg-accent-300 text-brand-950 text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 shrink-0"
          >
            <Video className="w-4 h-4" />
            <span>{isAr ? 'فتح نافذة البث (Google Meet)' : 'Open Meet Video Stream'}</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>
        </div>

        {/* Dual-Pane Classroom Workbench */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Pane: Classical Text & Mushaf Reader (7 Cols) */}
          <div className="lg:col-span-7 rounded-3xl bg-surface ring-1 ring-line shadow-sm overflow-hidden flex flex-col">
            
            {/* Reader Header & Font Sizer */}
            <div className="p-4 border-b border-line bg-surface-2 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-accent-600" />
                <span className="text-xs font-bold text-fg">
                  {isAr ? 'المتن والقرآن المقروء في الدرس' : 'Prescribed Reading / Classical Matn'}
                </span>
              </div>
              
              <div className="flex items-center gap-1 bg-surface rounded-xl ring-1 ring-line p-1">
                <button
                  type="button"
                  onClick={() => setTextSize('normal')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${textSize === 'normal' ? 'bg-brand-700 text-white' : 'text-fg-muted hover:text-fg'}`}
                >
                  A
                </button>
                <button
                  type="button"
                  onClick={() => setTextSize('large')}
                  className={`px-2 py-0.5 rounded text-xs font-bold ${textSize === 'large' ? 'bg-brand-700 text-white' : 'text-fg-muted hover:text-fg'}`}
                >
                  A+
                </button>
                <button
                  type="button"
                  onClick={() => setTextSize('xlarge')}
                  className={`px-2 py-0.5 rounded text-sm font-bold ${textSize === 'xlarge' ? 'bg-brand-700 text-white' : 'text-fg-muted hover:text-fg'}`}
                >
                  A++
                </button>
              </div>
            </div>

            {/* Classical Arabic Passage Display */}
            <div className="p-6 space-y-6 max-h-[500px] overflow-y-auto">
              {/* Qur'anic Section */}
              <div className="space-y-3">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-accent-700 bg-accent-50 px-2 py-0.5 rounded">
                  {isAr ? 'التلاوة التطبيقية — سورة الملك' : 'Practical Recitation — Surah Al-Mulk'}
                </span>
                <div className={`font-display text-fg select-all text-center rounded-2xl bg-surface-2 p-5 ring-1 ring-line/60 ${fontClass}`} dir="rtl">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ <br />
                  تَبَٰرَكَ ٱلَّذِي بِيَدِهِ ٱلۡمُلۡكُ وَهُوَ عَلَىٰ كُلِّ شَيۡءٖ قَدِيرٌ ۝١ ٱلَّذِي خَلَقَ ٱلۡمَوۡتَ وَٱلۡحَيَوٰةَ لِيَبۡلُوَكُمۡ أَيُّكُمۡ أَحۡسَنُ عَمَلٗاۚ وَهُوَ ٱلۡعَزِيزُ ٱلۡغَفُورُ ۝٢ ٱلَّذِي خَلَقَ سَبۡعَ سَمَٰوَٰتٖ طِبَاقٗاۖ مَّا تَرَىٰ فِي خَلۡقِ ٱلرَّحۡمَٰنِ مِن تَفَٰوُتٖۖ فَٱرۡجِعِ ٱلۡبَصَرَ هَلۡ تَرَىٰ مِن فُطُورٖ ۝٣
                </div>
              </div>

              {/* Matn Section */}
              <div className="space-y-3 pt-4 border-t border-line">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-800 bg-brand-50 px-2 py-0.5 rounded">
                  {isAr ? 'من متن تحفة الأطفال للشيخ الجمزوري' : 'From Tuḥfat al-Aṭfāl by Imām al-Jamzūrī'}
                </span>
                <div className="p-4 rounded-2xl bg-surface-2 ring-1 ring-line/60 space-y-3 text-center" dir="rtl">
                  <p className="font-display text-base sm:text-lg font-bold text-fg">
                    لِلنُّونِ إِنْ تَسْكُنْ وَلِلتَّنْوِينِ ❊ أَرْبَعُ أَحْكَامٍ فَخُذْ تَبْيِينِي <br />
                    فَالأَوَّلُ الإِظْهَارُ قَبْلَ أَحْرُفِ ❊ لِلْحَلْقِ سِتٌّ رُتِّبَتْ فَلْتَعْرِفِ
                  </p>
                  <p className="text-xs text-fg-muted font-sans" dir={isAr ? 'rtl' : 'ltr'}>
                    {isAr
                      ? 'الشرح: بيان حروف الإظهار الستة المجموعة في: همز فهاء ثم عين حاء مهملتان ثم غين خاء.'
                      : 'Commentary: Rules of Nūn Sākinah and Tanwīn: First rule is Izhār (clear pronunciation) before the 6 throat letters.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Pane: Live Halaqah Interactive Controls (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Tabs for Right Pane: Question Queue vs Lesson Notes */}
            <div className="flex rounded-2xl bg-surface-2 p-1 ring-1 ring-line">
              <button
                type="button"
                onClick={() => setActivePaneTab('queue')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activePaneTab === 'queue' ? 'bg-surface text-fg shadow-xs ring-1 ring-line' : 'text-fg-muted hover:text-fg'
                }`}
              >
                <Hand className="w-3.5 h-3.5 text-accent-600" />
                <span>{isAr ? 'طابور الأسئلة' : 'Ask Ustaz'}</span>
                <span className="tabular text-[10px] bg-accent-50 text-accent-700 px-1.5 py-0.2 rounded-full font-bold">
                  {questions.length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActivePaneTab('notes')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activePaneTab === 'notes' ? 'bg-surface text-fg shadow-xs ring-1 ring-line' : 'text-fg-muted hover:text-fg'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 text-brand-600" />
                <span>{isAr ? 'مفكرتي الخاصة' : 'Lesson Notes'}</span>
              </button>
            </div>

            {/* Tab 1: Question Queue */}
            {activePaneTab === 'queue' && (
              <div className="p-5 rounded-3xl bg-surface ring-1 ring-line shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-fg flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-accent-600" />
                    <span>{isAr ? 'اطرح سؤالاً على الشيخ' : 'Submit Question to Ustaz'}</span>
                  </h4>
                  <span className="text-[11px] text-fg-subtle">
                    {isAr ? 'سيجيب الشيخ في فقرة الأسئلة' : 'Answered during Q&A'}
                  </span>
                </div>

                <form onSubmit={handleSubmitQuestion} className="space-y-3">
                  <div className="flex gap-2">
                    <select
                      value={questionCategory}
                      onChange={(e) => setQuestionCategory(e.target.value)}
                      className="text-xs px-2.5 py-2 rounded-xl bg-surface-2 ring-1 ring-line text-fg font-medium"
                    >
                      <option value="Tajweed">{isAr ? 'تجويد' : 'Tajweed'}</option>
                      <option value="Fiqh">{isAr ? 'فقه' : 'Fiqh'}</option>
                      <option value="Arabic">{isAr ? 'لغة عربية' : 'Arabic'}</option>
                      <option value="General">{isAr ? 'عام' : 'General'}</option>
                    </select>
                    <input
                      type="text"
                      required
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      placeholder={isAr ? 'اكتب سؤالك بوضوح هنا...' : 'Type your question clearly...'}
                      className="flex-1 text-xs px-3 py-2 rounded-xl bg-surface-2 ring-1 ring-line text-fg placeholder:text-fg-subtle focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isAr ? 'إرسال السؤال للشيخ' : 'Submit to Queue'}</span>
                  </button>
                </form>

                {questionSent && (
                  <div className="p-2.5 rounded-xl bg-success-soft text-success-fg text-xs font-bold flex items-center gap-2 animate-fade-in">
                    <Check className="w-4 h-4 text-success" />
                    <span>{isAr ? 'تم إرسال سؤالك وسيقوم الشيخ بالإجابة عليه بإذن الله.' : 'Question submitted to Ustaz’s live queue.'}</span>
                  </div>
                )}

                {/* Questions List */}
                <div className="space-y-2.5 pt-2 max-h-[250px] overflow-y-auto">
                  {questions.map((q) => (
                    <div key={q.id} className="p-3 rounded-2xl bg-surface-2 ring-1 ring-line/60 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-fg">{q.studentName}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          q.status === 'answered' ? 'bg-success-soft text-success-fg' : 'bg-accent-50 text-accent-800'
                        }`}>
                          {q.status === 'answered' ? (isAr ? 'تمت الإجابة' : 'Answered') : (isAr ? 'في الطابور' : 'In Queue')}
                        </span>
                      </div>
                      <p className="text-fg-muted">{q.question}</p>
                      <div className="flex items-center justify-between text-[10px] text-fg-subtle pt-1">
                        <span>🏷️ {q.category}</span>
                        <span>{q.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 2: Lesson Notepad */}
            {activePaneTab === 'notes' && (
              <div className="p-5 rounded-3xl bg-surface ring-1 ring-line shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-fg">
                    {isAr ? 'تدوين الفوائد والشوارد' : 'Personal Lecture Notes'}
                  </h4>
                  <span className="text-[10px] text-fg-subtle">
                    {isAr ? 'يحفظ تلقائياً في متصفحك' : 'Auto-saved locally'}
                  </span>
                </div>

                <textarea
                  rows={8}
                  value={notes}
                  onChange={(e) => handleSaveNotes(e.target.value)}
                  placeholder={
                    isAr
                      ? 'قيّد فوائد الدرس وملاحظات الشيخ هنا...'
                      : 'Capture lecture points, vocabulary, and reflections here...'
                  }
                  className="w-full text-xs p-3.5 rounded-2xl bg-surface-2 ring-1 ring-line text-fg placeholder:text-fg-subtle focus:outline-none focus:ring-2 focus:ring-brand-500 leading-relaxed resize-none"
                />

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleCopyNotes}
                    className="flex-1 py-2 rounded-xl bg-surface-2 hover:bg-surface-3 ring-1 ring-line text-xs font-bold text-fg transition-all flex items-center justify-center gap-1.5"
                  >
                    {copiedNotes ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedNotes ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'نسخ الملاحظات' : 'Copy Notes')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadNotes}
                    className="flex-1 py-2 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isAr ? 'تحميل كملف نصي' : 'Download .txt'}</span>
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </Modal>
  );
};
