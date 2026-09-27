'use client';

import React, { useEffect, useState } from 'react';
import { Download, X, Share2, Smartphone, CheckCircle, Sparkles } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PwaManager: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [dismissed, setDismissed] = useState(true); // default true until verified

  useEffect(() => {
    // 1. Register Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((reg) => {
          // Check for worker updates
          reg.onupdatefound = () => {
            const installingWorker = reg.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('New Ibn Basheer Academy version available.');
                }
              };
            }
          };
        })
        .catch((err) => {
          console.warn('PWA service worker registration failed:', err);
        });
    }

    // 2. Check if already running in standalone mode (installed)
    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        (navigator as unknown as { standalone?: boolean }).standalone === true ||
        document.referrer.includes('android-app://');
      setIsStandalone(Boolean(isStandaloneMode));
    };
    checkStandalone();

    // 3. Check dismissal history (allow re-prompt after 7 days)
    const dismissTimestamp = localStorage.getItem('ib_pwa_dismiss_time');
    const now = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    if (!dismissTimestamp || now - Number(dismissTimestamp) > sevenDays) {
      setDismissed(false);
    }

    // 4. Detect iOS Safari
    const ua = window.navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(ua);
    const isSafari = /safari/.test(ua) && !/chrome|crios|fxios/.test(ua);
    if (isAppleDevice && isSafari && !isStandalone) {
      setIsIos(true);
    }

    // 5. Capture Chromium BeforeInstallPrompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // 6. Listen for successful install
    window.addEventListener('appinstalled', () => {
      setIsInstallable(false);
      setIsStandalone(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('ib_pwa_dismiss_time', String(Date.now()));
  };

  // Do not render anything if already installed in standalone mode, or dismissed, or not ready
  if (isStandalone || dismissed) {
    return null;
  }

  return (
    <>
      {/* 1. Android / Desktop Chromium Install Banner */}
      {isInstallable && (
        <aside
          aria-label="تثبيت التطبيق / Install Academy Application"
          className="fixed bottom-4 start-4 end-4 sm:start-auto sm:end-6 sm:max-w-md z-50 animate-float-slow"
        >
          <div className="rounded-2xl bg-surface/95 backdrop-blur-md ring-1 ring-line shadow-2xl p-4 sm:p-5 flex items-start gap-3.5 border border-brand-500/20">
            {/* App Icon badge */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-800 to-brand-950 p-2 flex items-center justify-center shrink-0 ring-1 ring-accent-400/40 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/icons/icon-192x192.png"
                alt="Ibn Basheer Academy"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 text-[11px] font-bold text-accent-600 dark:text-accent-400 uppercase tracking-wider mb-0.5">
                <Sparkles className="w-3 h-3" />
                <span>تطبيق الأكاديمية الرسمي</span>
              </div>
              <h4 className="text-sm font-bold text-fg leading-tight">
                تثبيت أكاديمية ابن بشير على جهازك
              </h4>
              <p className="text-xs text-fg-muted mt-1 leading-relaxed">
                وصول سريع للحلقات الحية، والمتون المعتمدة دون الحاجة للمتصفح.
              </p>

              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleInstallClick}
                  className="px-3.5 py-1.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all cursor-pointer hover:shadow-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>تثبيت / Install App</span>
                </button>
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="px-2.5 py-1.5 rounded-xl text-fg-subtle hover:text-fg text-xs font-semibold transition-colors cursor-pointer"
                >
                  لاحقاً
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDismiss}
              aria-label="إغلاق التنبيه"
              className="text-fg-subtle hover:text-fg p-1 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </aside>
      )}

      {/* 2. iOS Safari Step-by-Step Banner */}
      {isIos && !isInstallable && (
        <aside
          aria-label="تعليمات تثبيت التطبيق على آيفون"
          className="fixed bottom-4 start-4 end-4 sm:start-auto sm:end-6 sm:max-w-md z-50"
        >
          <div className="rounded-2xl bg-surface/95 backdrop-blur-md ring-1 ring-line shadow-2xl p-4 sm:p-5 flex items-start gap-3.5 border border-brand-500/20">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-800 to-brand-950 p-2 flex items-center justify-center shrink-0 ring-1 ring-accent-400/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/icons/icon-192x192.png"
                alt="Ibn Basheer Academy"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-fg leading-tight">
                تثبيت الأكاديمية على الشاشة الرئيسية (iOS)
              </h4>
              
              {!showIosGuide ? (
                <>
                  <p className="text-xs text-fg-muted mt-1 leading-relaxed">
                    احصل على تجربة تطبيق متكاملة وتلقَّ تنبيهات الحلقات.
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowIosGuide(true)}
                      className="px-3.5 py-1.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>طريقة التثبيت / How to Install</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleDismiss}
                      className="px-2 py-1.5 text-xs text-fg-subtle hover:text-fg font-semibold cursor-pointer"
                    >
                      إغلاق
                    </button>
                  </div>
                </>
              ) : (
                <div className="mt-2.5 p-3 rounded-xl bg-surface-2 ring-1 ring-line text-xs text-fg space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-brand-ink text-white font-bold text-[10px] flex items-center justify-center shrink-0">1</span>
                    <span>اضغط زر المشاركة <Share2 className="w-3.5 h-3.5 inline mx-1 text-brand-ink" /> أسفل المتصفح.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-brand-ink text-white font-bold text-[10px] flex items-center justify-center shrink-0">2</span>
                    <span>اختر <strong>«إضافة إلى الصفحة الرئيسية»</strong> (Add to Home Screen).</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-brand-ink text-white font-bold text-[10px] flex items-center justify-center shrink-0">3</span>
                    <span>اضغط <strong>«إضافة»</strong> (Add) بأعلى الشاشة.</span>
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleDismiss}
              aria-label="إغلاق التنبيه"
              className="text-fg-subtle hover:text-fg p-1 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </aside>
      )}
    </>
  );
};
