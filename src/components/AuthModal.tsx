'use client';

import React, { useState } from 'react';
import { LogIn, UserPlus, Shield, Sparkles, Loader2, AlertCircle, CheckCircle2, UserCheck } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Tabs } from '@/components/ui/Tabs';
import { inputClass, labelClass, selectClass } from '@/components/ui/form';
import type { Lang } from '@/lib/usePreferences';
import { ACADEMIC_LEVELS } from '@/lib/data/academyData';
import { signIn, signUpStudent, loginAsDemo, type UserProfile } from '@/lib/services/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Lang;
  onSuccess?: (user: UserProfile) => void;
  intendedPortal?: 'student' | 'teacher' | null;
}

type AuthTab = 'signin' | 'signup';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  lang,
  onSuccess,
  intendedPortal,
}) => {
  const isAr = lang === 'ar';
  const [activeTab, setActiveTab] = useState<AuthTab>('signin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Sign In fields
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Sign Up fields
  const [fullName, setFullName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpLevel, setSignUpLevel] = useState('tamheediy');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { user, error: authErr } = await signIn(signInEmail, signInPassword);
    setLoading(false);

    if (authErr || !user) {
      setError(authErr || (isAr ? 'البريد أو كلمة المرور غير صحيحة' : 'Invalid email or password'));
      return;
    }

    setSuccessMsg(isAr ? `مرحباً بك مجدداً، ${user.fullName}!` : `Welcome back, ${user.fullName}!`);
    setTimeout(() => {
      onSuccess?.(user);
      onClose();
      setSuccessMsg(null);
    }, 1000);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { user, error: authErr } = await signUpStudent({
      fullName,
      email: signUpEmail,
      password: signUpPassword,
      phone: signUpPhone,
      levelId: signUpLevel,
    });
    setLoading(false);

    if (authErr || !user) {
      setError(authErr || (isAr ? 'فشل إنشاء الحساب، يرجى المحاولة لاحقاً' : 'Registration failed, please try again'));
      return;
    }

    setSuccessMsg(isAr ? `تم إنشاء حسابك بنجاح! أهلاً بك يا ${user.fullName}.` : `Account created! Welcome, ${user.fullName}.`);
    setTimeout(() => {
      onSuccess?.(user);
      onClose();
      setSuccessMsg(null);
    }, 1200);
  };

  const handleDemoClick = (role: 'student' | 'teacher') => {
    setError(null);
    const user = loginAsDemo(role);
    setSuccessMsg(isAr ? `تم الدخول كـ ${user.fullName}` : `Logged in as ${user.fullName}`);
    setTimeout(() => {
      onSuccess?.(user);
      onClose();
      setSuccessMsg(null);
    }, 800);
  };

  const tabs = [
    {
      id: 'signin' as const,
      label: isAr ? 'تسجيل الدخول' : 'Sign In',
      icon: <LogIn className="w-4 h-4" />,
    },
    {
      id: 'signup' as const,
      label: isAr ? 'تسجيل طالب جديد' : 'New Student Account',
      icon: <UserPlus className="w-4 h-4" />,
    },
  ];

  const modalTitle = intendedPortal === 'teacher'
    ? (isAr ? 'تسجيل دخول هيئة التدريس والإدارة' : 'Faculty & Admin Sign In')
    : intendedPortal === 'student'
      ? (isAr ? 'تسجيل دخول بوابة الطالب' : 'Student LMS Portal Sign In')
      : (isAr ? 'بوابة الحسابات — أكاديمية ابن بشير' : 'Account Portal — Ibn Basheer Academy');

  const modalSubtitle = intendedPortal === 'teacher'
    ? (isAr ? 'يرجى تسجيل الدخول بحساب المعلم للوصول إلى إدارة الدروس والقبول' : 'Please sign in with your instructor credentials to access LMS grading and admissions')
    : intendedPortal === 'student'
      ? (isAr ? 'يرجى تسجيل الدخول أو إنشاء حساب طالب لمتابعة الحلقات والتلاوة' : 'Please sign in or create an account to access live classes, recitation studio, and coursework')
      : (isAr ? 'سجل دخولك لمتابعة المقررات، إرسال التلاوات، وحضور الحلقات المباشرة' : 'Sign in to access your course syllabus, submit recitations, and join live study circles');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle}
      subtitle={modalSubtitle}
      size="md"
    >
      <div className="space-y-6">
        {/* Quick Demo Login Shortcuts */}
        <div className="p-4 rounded-2xl bg-surface-2 ring-1 ring-line/80 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-fg-subtle">
            <Sparkles className="w-3.5 h-3.5 text-accent-500" />
            <span>{isAr ? 'دخول سريع للتجربة (بدون كلمة مرور):' : 'Instant 1-Click Evaluation:'}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoClick('student')}
              className="px-3 py-2 rounded-xl bg-surface hover:bg-surface-3 ring-1 ring-line text-xs font-bold text-fg transition-all flex items-center justify-center gap-1.5 shadow-xs"
            >
              <UserCheck className="w-3.5 h-3.5 text-accent-600" />
              <span>{isAr ? 'حساب طالب' : 'Demo Student'}</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoClick('teacher')}
              className="px-3 py-2 rounded-xl bg-surface hover:bg-surface-3 ring-1 ring-line text-xs font-bold text-fg transition-all flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Shield className="w-3.5 h-3.5 text-brand-600" />
              <span>{isAr ? 'حساب الشيخ' : 'Demo Ustaz'}</span>
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <Tabs
          items={tabs}
          active={activeTab}
          onChange={(id) => { setActiveTab(id as AuthTab); setError(null); }}
          label={isAr ? 'خيارات الدخول' : 'Sign in options'}
        />

        {/* Feedback alerts */}
        {error && (
          <div className="p-3.5 rounded-xl bg-danger/10 border border-danger/20 text-danger text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-success-soft border border-success/30 text-success-fg text-xs flex items-center gap-2 font-bold animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-success" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Tab 1: Sign In */}
        {activeTab === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className={labelClass}>{isAr ? 'البريد الإلكتروني' : 'Email Address'}</label>
              <input
                type="email"
                required
                value={signInEmail}
                onChange={(e) => setSignInEmail(e.target.value)}
                placeholder="student@ibnbasheer.edu"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>{isAr ? 'كلمة المرور' : 'Password'}</label>
              <input
                type="password"
                required
                value={signInPassword}
                onChange={(e) => setSignInPassword(e.target.value)}
                placeholder="••••••••"
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
              <span>{loading ? (isAr ? 'جاري الدخول...' : 'Signing in...') : (isAr ? 'دخول' : 'Sign In')}</span>
            </button>
          </form>
        )}

        {/* Tab 2: New Student Registration */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className={labelClass}>{isAr ? 'الاسم الكامل الثلاثي' : 'Full Legal Name'}</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={isAr ? 'أحمد بن عبد الله' : 'Ahmad Ibn Abdullah'}
                className={inputClass}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>{isAr ? 'البريد الإلكتروني' : 'Email Address'}</label>
                <input
                  type="email"
                  required
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  placeholder="student@example.com"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>{isAr ? 'رقم الهاتف (واتساب)' : 'WhatsApp Phone'}</label>
                <input
                  type="tel"
                  value={signUpPhone}
                  onChange={(e) => setSignUpPhone(e.target.value)}
                  placeholder="+234 800 000 0000"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>{isAr ? 'المستوى الدراسي الراغب به' : 'Desired Academic Level'}</label>
              <select
                value={signUpLevel}
                onChange={(e) => setSignUpLevel(e.target.value)}
                className={selectClass}
              >
                {ACADEMIC_LEVELS.map((lvl) => (
                  <option key={lvl.id} value={lvl.id}>
                    {isAr ? `${lvl.stage}. ${lvl.titleAr} (${lvl.durationAr})` : `${lvl.stage}. ${lvl.titleEn} (${lvl.durationEn})`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>{isAr ? 'كلمة المرور' : 'Password'}</label>
              <input
                type="password"
                required
                minLength={6}
                value={signUpPassword}
                onChange={(e) => setSignUpPassword(e.target.value)}
                placeholder="At least 6 characters"
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-accent-700 hover:bg-accent-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
              <span>{loading ? (isAr ? 'جاري التسجيل...' : 'Creating account...') : (isAr ? 'إنشاء حساب طالب' : 'Create Student Account')}</span>
            </button>
          </form>
        )}
      </div>
    </Modal>
  );
};
