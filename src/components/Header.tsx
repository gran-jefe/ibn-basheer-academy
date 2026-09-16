'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BookOpen, Globe, GraduationCap, LogIn, LogOut, Menu, MessageCircle,
  Moon, Sun, User, UserCog, X,
} from 'lucide-react';
import { ACADEMY_INFO } from '@/lib/data/academyData';
import type { Lang, Theme } from '@/lib/usePreferences';

import type { UserProfile } from '@/lib/services/authService';

interface HeaderProps {
  lang: Lang;
  setLang: (lang: Lang) => void;
  theme: Theme;
  toggleTheme: () => void;
  user: UserProfile | null;
  onOpenAuth?: () => void;
  onSignOut: () => void;
  onOpenEnrollment?: () => void;
  onOpenStudentPortal?: () => void;
  onOpenTeacherPortal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  setLang,
  theme,
  toggleTheme,
  user,
  onOpenAuth,
  onSignOut,
  onOpenEnrollment,
  onOpenStudentPortal,
  onOpenTeacherPortal,
}) => {
  const isAr = lang === 'ar';
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the mobile sheet when the viewport grows past the breakpoint.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = () => mq.matches && setMenuOpen(false);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const navLinks = [
    { href: '#levels', labelAr: 'المستويات', labelEn: 'Levels' },
    { href: '#courses', labelAr: 'المواد', labelEn: 'Courses' },
    { href: '#features', labelAr: 'المميزات', labelEn: 'Why Us' },
    { href: '#instructor', labelAr: 'المدرس', labelEn: 'Instructor' },
  ];

  const iconBtn =
    'p-2 rounded-lg text-brand-100 hover:text-white hover:bg-white/10 transition-colors';

  return (
    <header className="sticky top-0 z-40 bg-brand-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-4">

          {/* Wordmark */}
          <a href="#main" className="flex items-center gap-3 min-w-0 group">
            <div className="w-10 h-10 shrink-0 rounded-xl bg-accent-400 text-brand-950 flex items-center justify-center shadow-sm">
              <BookOpen className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-sm sm:text-base leading-tight truncate">
                {isAr ? 'أكاديمية ابن بشير' : 'Ibn Basheer Academy'}
              </p>
              <p className="text-[11px] text-brand-200 truncate hidden sm:block">
                {isAr ? ACADEMY_INFO.subHeadingAr : ACADEMY_INFO.subHeadingEn}
              </p>
            </div>
          </a>

          {/* Desktop navigation */}
          <nav
            aria-label={isAr ? 'التنقل الرئيسي' : 'Main navigation'}
            className="hidden lg:flex items-center gap-1 text-sm font-medium"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-2 rounded-lg text-brand-100 hover:text-white hover:bg-white/10 transition-colors"
              >
                {isAr ? link.labelAr : link.labelEn}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className={iconBtn}
              aria-label={
                theme === 'dark'
                  ? isAr ? 'تفعيل الوضع النهاري' : 'Switch to light mode'
                  : isAr ? 'تفعيل الوضع الليلي' : 'Switch to dark mode'
              }
            >
              {theme === 'dark'
                ? <Sun className="w-[18px] h-[18px]" aria-hidden="true" />
                : <Moon className="w-[18px] h-[18px]" aria-hidden="true" />}
            </button>

            <button
              type="button"
              onClick={() => setLang(isAr ? 'en' : 'ar')}
              className={`${iconBtn} flex items-center gap-1.5 text-xs font-bold`}
              aria-label={isAr ? 'Switch to English' : 'التبديل إلى العربية'}
            >
              <Globe className="w-[18px] h-[18px]" aria-hidden="true" />
              <span className="hidden sm:inline">{isAr ? 'EN' : 'ع'}</span>
            </button>

            <div className="hidden lg:block w-px h-6 bg-white/15" aria-hidden="true" />

            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href={user.role === 'teacher' ? '/teacher' : '/student'}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 ring-1 ring-white/20 text-xs font-bold text-brand-50 transition-colors"
                >
                  <div className="w-5 h-5 rounded-full bg-accent-400 text-brand-950 flex items-center justify-center font-bold text-[10px]">
                    {user.role === 'teacher' ? 'U' : 'S'}
                  </div>
                  <span className="truncate max-w-[120px]">{user.fullName}</span>
                </Link>
                <button
                  type="button"
                  onClick={onSignOut}
                  className="p-2 rounded-lg text-brand-200 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label={isAr ? 'تسجيل الخروج' : 'Sign out'}
                  title={isAr ? 'تسجيل الخروج' : 'Sign out'}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-brand-50 ring-1 ring-white/20 hover:bg-white/10 transition-colors"
              >
                <LogIn className="w-4 h-4" aria-hidden="true" />
                <span>{isAr ? 'دخول' : 'Sign in'}</span>
              </Link>
            )}

            <Link
              href="/enroll"
              className="px-3.5 py-2 rounded-lg bg-accent-400 hover:bg-accent-300 text-brand-950 text-sm font-bold shadow-sm transition-colors"
            >
              {isAr ? 'سجّل الآن' : 'Enroll'}
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className={`${iconBtn} lg:hidden`}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={isAr ? 'القائمة' : 'Menu'}
            >
              {menuOpen
                ? <X className="w-5 h-5" aria-hidden="true" />
                : <Menu className="w-5 h-5" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile sheet */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="lg:hidden border-t border-white/10 bg-brand-900 animate-fade-in"
        >
          <nav
            aria-label={isAr ? 'التنقل الرئيسي' : 'Main navigation'}
            className="max-w-7xl mx-auto px-4 py-3 grid gap-1"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm font-medium text-brand-100 hover:bg-white/10"
              >
                {isAr ? link.labelAr : link.labelEn}
              </a>
            ))}

            <div className="h-px bg-white/10 my-2" aria-hidden="true" />

            {user ? (
              <div className="p-3 rounded-xl bg-white/10 space-y-2 mb-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-accent-400 text-brand-950 flex items-center justify-center font-bold text-xs">
                      {user.role === 'teacher' ? 'U' : 'S'}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{user.fullName}</p>
                      <p className="text-[10px] text-brand-200">{user.email}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setMenuOpen(false); onSignOut(); }}
                    className="text-xs text-danger hover:underline font-bold"
                  >
                    {isAr ? 'خروج' : 'Sign out'}
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold text-brand-50 hover:bg-white/10 text-start"
              >
                <LogIn className="w-4 h-4" aria-hidden="true" />
                <span>{isAr ? 'تسجيل الدخول' : 'Sign In'}</span>
              </Link>
            )}

            <Link
              href="/student"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold text-brand-50 hover:bg-white/10 text-start"
            >
              <GraduationCap className="w-4 h-4" aria-hidden="true" />
              <span>{isAr ? 'بوابة الطالب' : 'Student portal'}</span>
            </Link>

            <Link
              href="/teacher"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold text-brand-50 hover:bg-white/10 text-start"
            >
              <UserCog className="w-4 h-4" aria-hidden="true" />
              <span>{isAr ? 'بوابة المعلم' : 'Teacher portal'}</span>
            </Link>

            <a
              href={ACADEMY_INFO.contact.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold text-brand-50 hover:bg-white/10"
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              <span>{isAr ? 'واتساب' : 'WhatsApp'}</span>
            </a>
          </nav>
        </div>
      )}

      {/* Teacher portal lives in a quiet secondary bar — it is staff-only,
          so it should never compete with the student's primary path. */}
      <div className="hidden lg:block border-t border-white/10 bg-brand-950/40">
        <div className="max-w-7xl mx-auto px-8 h-9 flex items-center justify-between text-[11px] text-brand-200">
          <span className="font-display">
            {isAr ? ACADEMY_INFO.taglineAr : ACADEMY_INFO.taglineEn}
          </span>
          <div className="flex items-center gap-4">
            <a
              href={ACADEMY_INFO.contact.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
              <span dir="ltr">{ACADEMY_INFO.contact.whatsappNumber}</span>
            </a>
            <Link
              href="/teacher"
              className="flex items-center gap-1.5 hover:text-white transition-colors font-semibold"
            >
              <UserCog className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{isAr ? 'بوابة المعلم' : 'Teacher portal'}</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="h-px rule-brass" aria-hidden="true" />
    </header>
  );
};
