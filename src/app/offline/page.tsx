'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { WifiOff, RefreshCw, Home, BookOpen, GraduationCap, ShieldAlert } from 'lucide-react';
import { AcademyLogo } from '@/components/ui/AcademyLogo';

export default function OfflinePage() {
  const [isChecking, setIsChecking] = useState(false);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      window.location.reload();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = () => {
    setIsChecking(true);
    setTimeout(() => {
      if (navigator.onLine) {
        window.location.reload();
      } else {
        setIsChecking(false);
      }
    }, 600);
  };

  return (
    <main className="min-h-screen bg-paper flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Ambient background decoration */}
      <div 
        aria-hidden="true" 
        className="absolute top-1/3 start-1/2 -translate-x-1/2 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" 
      />

      <div className="relative z-10 max-w-lg w-full rounded-3xl bg-surface ring-1 ring-line shadow-2xl p-8 sm:p-10">
        
        {/* Academy Logo */}
        <div className="flex justify-center mb-4">
          <AcademyLogo size="lg" isAr={true} priority />
        </div>

        {/* Offline Icon with breathing badge */}
        <div className="relative w-20 h-20 rounded-3xl bg-surface-2 ring-1 ring-line flex items-center justify-center mx-auto mb-6">
          <WifiOff className="w-10 h-10 text-amber-500" aria-hidden="true" />
          <span className="absolute -top-1 -end-1 w-4 h-4 rounded-full bg-amber-500 animate-ping" />
          <span className="absolute -top-1 -end-1 w-4 h-4 rounded-full bg-amber-500" />
        </div>

        {/* Heading in English & Arabic */}
        <div className="space-y-1 mb-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-fg font-display">
            You Are Currently Offline
          </h1>
          <p className="text-base sm:text-lg font-bold text-fg-muted font-display" dir="rtl">
            أنت غير متصل بالإنترنت حالياً
          </p>
        </div>

        <p className="text-xs sm:text-sm text-fg-muted leading-relaxed mb-3">
          You are currently disconnected from the internet. Pre-cached curriculum materials remain accessible. We will automatically reload your halaqah portal once your connection is restored.
        </p>

        <p className="text-xs text-fg-subtle leading-relaxed mb-8" dir="rtl">
          يبدو أنك فقدت الاتصال بشبكة الإنترنت. يتم حفظ المواد التي تصفحتها مسبقاً في الذاكرة المؤقتة، وسيتم إعادة الاتصال تلقائياً فور عودة الشبكة.
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleRetry}
            disabled={isChecking}
            className="w-full py-3.5 rounded-2xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} aria-hidden="true" />
            <span>Check Connection & Retry / إعادة المحاولة</span>
          </button>

          <Link
            href="/"
            className="w-full py-3 rounded-2xl bg-surface-2 hover:bg-surface-3 ring-1 ring-line text-fg font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4 text-fg-muted" aria-hidden="true" />
            <span>Return Home / العودة للرئيسية</span>
          </Link>
        </div>

        {/* Student Offline Tips */}
        <div className="mt-8 pt-6 border-t border-line text-start">
          <div className="flex items-center gap-2 text-xs font-bold text-brand-ink mb-1.5">
            <BookOpen className="w-4 h-4 shrink-0" />
            <span>Note for Students / إرشادات للطلاب:</span>
          </div>
          <p className="text-[11px] text-fg-muted leading-relaxed">
            All downloaded syllabi, audio drills, and previously visited halaqah notes remain saved on your device for offline study.
          </p>
          <p className="text-[11px] text-fg-subtle leading-relaxed mt-1" dir="rtl">
            المتون المحفوظة والمذكرات التي قمت بتحميلها تظل متاحة على جهازك دون الحاجة لاتصال مباشر.
          </p>
        </div>

      </div>
    </main>
  );
}
