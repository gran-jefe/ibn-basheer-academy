'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BookOpen, UserPlus, AlertCircle, CheckCircle2, Loader2,
  ArrowLeft, ArrowRight, Globe, Sun, Moon, Sparkles
} from 'lucide-react';
import { usePreferences } from '@/lib/usePreferences';
import { ACADEMIC_LEVELS } from '@/lib/data/academyData';
import { signUpStudent } from '@/lib/services/authService';

export default function SignUpPage() {
  const router = useRouter();
  const { lang, setLang, theme, toggleTheme } = usePreferences();
  const isAr = lang === 'ar';

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [levelId, setLevelId] = useState('tamheediy');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { user, error: authErr } = await signUpStudent({
      fullName,
      email,
      password,
      phone,
      levelId,
    });
    setLoading(false);

    if (authErr || !user) {
      setError(authErr || (isAr ? 'فشل إنشاء الحساب، يرجى مراجعة البيانات' : 'Registration failed, please check your information'));
      return;
    }

    setSuccessMsg(isAr ? `تم إنشاء حسابك بنجاح! أهلاً بك يا ${user.fullName}.` : `Account created! Welcome, ${user.fullName}.`);
    setTimeout(() => {
      router.push('/student');
    }, 1000);
  };

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

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-lg space-y-6">

          {/* Seminary Header */}
          <div className="text-center space-y-3">
            <Link href="/" className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-800 text-accent-300 shadow-md ring-1 ring-brand-700/50">
              <BookOpen className="w-7 h-7" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-ink tracking-tight font-display">
                {isAr ? 'تسجيل طالب جديد في الأكاديمية' : 'Create Student Account'}
              </h1>
              <p className="text-sm text-fg-muted mt-1.5 leading-relaxed">
                {isAr
                  ? 'سجّل بياناتك لبدء دراسة العلوم الشرعية واللغة العربية وحضور الحلقات'
                  : 'Register your details to begin your classical Islamic studies curriculum'}
              </p>
            </div>
          </div>

          {/* Feedback alerts */}
          {error && (
            <div className="p-4 rounded-2xl bg-danger-soft border border-danger/20 text-danger-fg text-xs font-semibold flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-4 rounded-2xl bg-success-soft border border-success/30 text-success-fg text-xs font-bold flex items-center gap-2.5 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-success" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Registration Form */}
          <div className="p-6 sm:p-8 rounded-3xl bg-surface ring-1 ring-line shadow-sm space-y-5">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-fg mb-1.5">
                  {isAr ? 'الاسم الكامل الثلاثي (كما يظهر بالشهادة)' : 'Full Legal Name (For Transcript & Ijāzah)'}
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={isAr ? 'أحمد بن عبد الله آل إبراهيم' : 'Ahmad Ibn Abdullah'}
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
                    placeholder="student@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-surface ring-1 ring-line focus:ring-2 focus:ring-brand-ring outline-none text-sm text-fg placeholder:text-fg-subtle transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-fg mb-1.5">
                    {isAr ? 'رقم الهاتف / واتساب' : 'WhatsApp Phone'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234 800 000 0000"
                    className="w-full px-4 py-3 rounded-xl bg-surface ring-1 ring-line focus:ring-2 focus:ring-brand-ring outline-none text-sm text-fg placeholder:text-fg-subtle transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-fg mb-1.5">
                  {isAr ? 'المستوى الدراسي الراغب بالالتحاق به' : 'Target Academic Stage'}
                </label>
                <select
                  value={levelId}
                  onChange={(e) => setLevelId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-surface ring-1 ring-line focus:ring-2 focus:ring-brand-ring outline-none text-sm text-fg transition-all cursor-pointer"
                >
                  {ACADEMIC_LEVELS.map((lvl) => (
                    <option key={lvl.id} value={lvl.id}>
                      {isAr
                        ? `${lvl.stage}. ${lvl.titleAr} (${lvl.durationAr})`
                        : `${lvl.stage}. ${lvl.titleEn} (${lvl.durationEn})`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-fg mb-1.5">
                  {isAr ? 'كلمة المرور (٦ أحرف على الأقل)' : 'Password (Min. 6 characters)'}
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-surface ring-1 ring-line focus:ring-2 focus:ring-brand-ring outline-none text-sm text-fg placeholder:text-fg-subtle transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-accent-700 hover:bg-accent-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                <span>{loading ? (isAr ? 'جاري إنشاء الحساب...' : 'Creating account...') : (isAr ? 'تأكيد التسجيل والدخول' : 'Complete Registration')}</span>
              </button>
            </form>

            <div className="pt-4 border-t border-line text-center text-xs text-fg-muted">
              <span>{isAr ? 'لديك حساب بالفعل؟ ' : 'Already have an account? '}</span>
              <Link
                href="/login"
                className="font-bold text-brand-ink hover:underline inline-flex items-center gap-1"
              >
                <span>{isAr ? 'تسجيل الدخول هنا' : 'Sign in here'}</span>
              </Link>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
