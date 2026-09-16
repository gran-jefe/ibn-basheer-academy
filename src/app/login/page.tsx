'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  BookOpen, LogIn, Sparkles, UserCheck, Shield, AlertCircle,
  CheckCircle2, Loader2, ArrowLeft, ArrowRight, Globe, Sun, Moon
} from 'lucide-react';
import { usePreferences } from '@/lib/usePreferences';
import { signIn, loginAsDemo } from '@/lib/services/authService';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect');

  const { lang, setLang, theme, toggleTheme } = usePreferences();
  const isAr = lang === 'ar';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const routeUser = (role: 'student' | 'teacher' | 'admin') => {
    if (redirectTarget) {
      router.push(redirectTarget);
    } else if (role === 'teacher' || role === 'admin') {
      router.push('/teacher');
    } else {
      router.push('/student');
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { user, error: authErr } = await signIn(email, password);
    setLoading(false);

    if (authErr || !user) {
      setError(authErr || (isAr ? 'البريد أو كلمة المرور غير صحيحة' : 'Invalid email or password'));
      return;
    }

    setSuccessMsg(isAr ? `مرحباً بك مجدداً، ${user.fullName}!` : `Welcome back, ${user.fullName}!`);
    setTimeout(() => {
      routeUser(user.role);
    }, 800);
  };

  const handleDemoLogin = (role: 'student' | 'teacher') => {
    setError(null);
    const user = loginAsDemo(role);
    setSuccessMsg(isAr ? `تم تسجيل الدخول كـ ${user.fullName}` : `Signed in as ${user.fullName}`);
    setTimeout(() => {
      routeUser(user.role);
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col bg-paper text-fg">
      {/* Top Navigation Bar */}
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

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md space-y-6">
          
          {/* Logo & Seminary Header */}
          <div className="text-center space-y-3">
            <Link href="/" className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-800 text-accent-300 shadow-md ring-1 ring-brand-700/50">
              <BookOpen className="w-7 h-7" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-ink tracking-tight font-display">
                {isAr ? 'تسجيل الدخول إلى الأكاديمية' : 'Sign in to Ibn Basheer Academy'}
              </h1>
              <p className="text-sm text-fg-muted mt-1.5 leading-relaxed">
                {isAr
                  ? 'أدخل بيانات حسابك للوصول إلى حلقاتك، التلاوات، والمقررات'
                  : 'Access your virtual study circles, recitation workbench, and coursework'}
              </p>
            </div>
          </div>

          {/* Quick Demo Login Box */}
          <div className="p-4 rounded-2xl bg-surface-2 ring-1 ring-line shadow-xs space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-fg-subtle">
              <Sparkles className="w-3.5 h-3.5 text-accent-600" />
              <span>{isAr ? 'تجربة فورية بنقرة واحدة (بدون كلمة مرور):' : 'Instant 1-Click Evaluation Login:'}</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleDemoLogin('student')}
                className="px-3.5 py-2.5 rounded-xl bg-surface hover:bg-surface-3 ring-1 ring-line text-xs font-bold text-fg transition-all flex items-center justify-center gap-2 shadow-xs"
              >
                <UserCheck className="w-4 h-4 text-accent-600" />
                <span>{isAr ? 'دخول كطالب' : 'Demo Student'}</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('teacher')}
                className="px-3.5 py-2.5 rounded-xl bg-surface hover:bg-surface-3 ring-1 ring-line text-xs font-bold text-fg transition-all flex items-center justify-center gap-2 shadow-xs"
              >
                <Shield className="w-4 h-4 text-brand-700" />
                <span>{isAr ? 'دخول كالشيخ' : 'Demo Ustaz'}</span>
              </button>
            </div>
          </div>

          {/* Feedback Alerts */}
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

          {/* Standard Form */}
          <div className="p-6 sm:p-7 rounded-3xl bg-surface ring-1 ring-line shadow-sm space-y-5">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-fg mb-1.5">
                  {isAr ? 'البريد الإلكتروني' : 'Email Address'}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@ibnbasheer.edu"
                  className="w-full px-4 py-3 rounded-xl bg-surface ring-1 ring-line focus:ring-2 focus:ring-brand-ring outline-none text-sm text-fg placeholder:text-fg-subtle transition-all"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-fg">
                    {isAr ? 'كلمة المرور' : 'Password'}
                  </label>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-surface ring-1 ring-line focus:ring-2 focus:ring-brand-ring outline-none text-sm text-fg placeholder:text-fg-subtle transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
                <span>{loading ? (isAr ? 'جاري التحقق...' : 'Signing in...') : (isAr ? 'دخول إلى الحساب' : 'Sign In')}</span>
              </button>
            </form>

            <div className="pt-4 border-t border-line text-center text-xs text-fg-muted">
              <span>{isAr ? 'طالب جديد لم تسجل بعد؟ ' : 'New to the academy? '}</span>
              <Link
                href="/signup"
                className="font-bold text-brand-ink hover:underline inline-flex items-center gap-1"
              >
                <span>{isAr ? 'إنشاء حساب طالب جديد' : 'Register as a Student'}</span>
              </Link>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-paper text-fg"><Loader2 className="w-6 h-6 animate-spin text-brand-700" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
