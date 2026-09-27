'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight, CalendarClock, CheckCircle2, MessageCircle, Play, Users, Sparkles
} from 'lucide-react';
import { ACADEMY_INFO, MOCK_LIVE_CLASSES } from '@/lib/data/academyData';
import { FloatingParticles } from '@/components/motion/FloatingParticles';
import type { Lang } from '@/lib/usePreferences';

interface HeroProps {
  lang: Lang;
  onOpenEnrollment?: () => void;
  onOpenStudentPortal?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  lang,
}) => {
  const isAr = lang === 'ar';

  const nextClass =
    MOCK_LIVE_CLASSES.find((c) => c.status === 'live') ?? MOCK_LIVE_CLASSES[0];
  const isLive = nextClass?.status === 'live';

  const proofPoints = [
    { value: '10', labelAr: 'مواد رئيسية', labelEn: 'Core subjects' },
    { value: '5', labelAr: 'مستويات دراسية', labelEn: 'Academic levels' },
    { value: '100%', labelAr: 'عن بُعد', labelEn: 'Online' },
  ];

  const highlights = isAr
    ? ['فصول مباشرة مع متابعة فردية', 'تسجيلات ومذكرات دائمة', 'اختبارات دورية وتقارير تقدّم']
    : ['Live classes with individual follow-up', 'Permanent recordings & notes', 'Periodic assessments & progress reports'];

  return (
    <section className="relative bg-motif text-white overflow-hidden min-h-[580px] lg:min-h-[640px] flex flex-col justify-center">
      {/* Floating Canvas Particles */}
      <FloatingParticles />

      {/* Atmospheric Ambient Glow Orbs */}
      <div 
        aria-hidden="true" 
        className="absolute -top-32 -start-32 w-96 h-96 rounded-full bg-emerald-500/15 blur-3xl animate-glow pointer-events-none" 
      />
      <div 
        aria-hidden="true" 
        className="absolute -bottom-32 end-10 w-[28rem] h-[28rem] rounded-full bg-amber-500/10 blur-3xl animate-glow pointer-events-none" 
        style={{ animationDelay: '3s' }} 
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Message Column */}
          <motion.div 
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 space-y-7"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 ring-1 ring-white/20 backdrop-blur-md shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-accent-300 animate-pulse" />
              <p className="font-display text-accent-300 text-sm sm:text-base font-semibold">
                {isAr ? ACADEMY_INFO.taglineAr : ACADEMY_INFO.taglineEn}
              </p>
            </motion.div>

            <h1 className="text-3xl sm:text-5xl lg:text-[3.4rem] font-extrabold leading-[1.15] tracking-tight text-balance font-display">
              {isAr ? (
                <>
                  تعلَّم القرآن والعلوم الشرعية
                  <span className="block text-accent-300 mt-2 drop-shadow-sm">في حلقة علمية منظّمة</span>
                </>
              ) : (
                <>
                  Study Qur&apos;an and the Islamic sciences
                  <span className="block text-accent-300 mt-2 drop-shadow-sm">in a structured circle of learning</span>
                </>
              )}
            </h1>

            <p className="text-base sm:text-lg text-brand-100 max-w-2xl leading-relaxed">
              {isAr
                ? 'معهد افتراضي متكامل يجمع بين منهج علمي متدرّج وفصول مباشرة ومتابعة شخصية، تحت إشراف نخبة من المتخصصين.'
                : 'A complete virtual institute pairing a graded curriculum with live classes and personal follow-up, supervised by qualified specialists.'}
            </p>

            <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5">
              {highlights.map((item, idx) => (
                <motion.li 
                  key={item} 
                  initial={{ opacity: 0, x: isAr ? 16 : -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + idx * 0.1, duration: 0.5 }}
                  className="flex items-start gap-2.5 text-sm text-brand-50"
                >
                  <CheckCircle2 className="w-[18px] h-[18px] mt-0.5 shrink-0 text-accent-400" aria-hidden="true" />
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>

            {/* Actions with Shimmer & Magnetic Touch */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/enroll"
                className="relative overflow-hidden group px-6 py-3.5 rounded-xl bg-accent-400 hover:bg-accent-300 text-brand-950 font-bold text-base shadow-xl hover:shadow-accent-400/20 hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                {/* Light shimmer sweep */}
                <div 
                  aria-hidden="true"
                  className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 translate-x-[-150%] group-hover:animate-shimmer pointer-events-none"
                />
                <span className="relative z-10">{isAr ? 'قدّم طلب الانضمام' : 'Apply for admission'}</span>
                <ArrowRight className="w-[18px] h-[18px] rtl:rotate-180 relative z-10 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
              </Link>

              <Link
                href="/student"
                className="px-5 py-3.5 rounded-xl text-white font-semibold text-base ring-1 ring-white/25 hover:bg-white/10 hover:-translate-y-0.5 transition-all flex items-center gap-2 backdrop-blur-xs"
              >
                <Play className="w-[18px] h-[18px]" aria-hidden="true" />
                <span>{isAr ? 'دخول البوابة' : 'Open the portal'}</span>
              </Link>

              <a
                href={ACADEMY_INFO.contact.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 rounded-xl text-brand-100 font-semibold text-base hover:text-white hover:bg-white/10 transition-colors flex items-center gap-2"
              >
                <MessageCircle className="w-[18px] h-[18px]" aria-hidden="true" />
                <span>{isAr ? 'استفسار' : 'Ask a question'}</span>
              </a>
            </div>

            {/* Proof points */}
            <dl className="flex flex-wrap gap-x-10 gap-y-4 pt-6 border-t border-white/10">
              {proofPoints.map((p) => (
                <div key={p.value} className="group">
                  <dt className="sr-only">{isAr ? p.labelAr : p.labelEn}</dt>
                  <dd>
                    <span className="tabular block text-2xl font-extrabold text-accent-300 group-hover:scale-105 transition-transform origin-left rtl:origin-right">
                      {p.value}
                    </span>
                    <span className="text-xs text-brand-200">
                      {isAr ? p.labelAr : p.labelEn}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </motion.div>

          {/* Next session panel — with floating physics & 3D presence */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <div className="relative animate-float-slow">
              {/* Outer decorative glow halo */}
              <div 
                aria-hidden="true" 
                className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-accent-400/30 via-brand-400/20 to-accent-300/30 blur-lg opacity-75 group-hover:opacity-100 transition-opacity" 
              />

              <div className="relative rounded-2xl bg-surface text-fg shadow-2xl ring-1 ring-black/10 overflow-hidden backdrop-blur-md">
                <div className="px-6 py-4 border-b border-line flex items-center justify-between gap-3 bg-surface-2/60">
                  <div className="flex items-center gap-2 text-sm font-bold text-fg">
                    <CalendarClock className="w-4 h-4 text-brand-ink" aria-hidden="true" />
                    {isAr ? 'الحصة القادمة' : 'Next session'}
                  </div>

                  {isLive ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-danger-soft text-danger-fg text-[11px] font-extrabold uppercase tracking-wide ring-1 ring-danger/20">
                      <span className="w-2 h-2 rounded-full bg-danger animate-live" aria-hidden="true" />
                      {isAr ? 'مباشر الآن' : 'Live now'}
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-surface-3 text-fg-muted text-[11px] font-bold uppercase tracking-wide">
                      {isAr ? 'قادمة' : 'Upcoming'}
                    </span>
                  )}
                </div>

                <div className="px-6 py-5 space-y-4">
                  <div>
                    <h2 className="text-lg font-bold text-fg leading-snug">
                      {isAr ? nextClass?.titleAr : nextClass?.titleEn}
                    </h2>
                    <p className="text-sm text-fg-muted mt-1">
                      {isAr ? nextClass?.subjectAr : nextClass?.subjectEn}
                    </p>
                  </div>

                  <dl className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-xl bg-surface-2 ring-1 ring-line px-3 py-2.5 transition-colors hover:bg-surface-3">
                      <dt className="text-[11px] font-bold uppercase tracking-wide text-fg-subtle">
                        {isAr ? 'اليوم' : 'Day'}
                      </dt>
                      <dd className="font-semibold text-fg mt-0.5">
                        {isAr ? nextClass?.dayAr : nextClass?.dayEn}
                      </dd>
                    </div>
                    <div className="rounded-xl bg-surface-2 ring-1 ring-line px-3 py-2.5 transition-colors hover:bg-surface-3">
                      <dt className="text-[11px] font-bold uppercase tracking-wide text-fg-subtle">
                        {isAr ? 'الوقت' : 'Time'}
                      </dt>
                      <dd className="tabular font-semibold text-fg mt-0.5">
                        {isAr ? nextClass?.timeAr : nextClass?.timeEn}
                      </dd>
                    </div>
                  </dl>

                  <div className="flex items-center gap-3 pt-1">
                    <div
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 text-white font-display font-bold flex items-center justify-center shrink-0 shadow-sm"
                      aria-hidden="true"
                    >
                      NB
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold uppercase tracking-wide text-fg-subtle">
                        {isAr ? 'المدرس' : 'Instructor'}
                      </p>
                      <p className="text-sm font-semibold text-fg truncate">
                        {isAr
                          ? ACADEMY_INFO.leadInstructor.nameAr
                          : ACADEMY_INFO.leadInstructor.nameEn}
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/student"
                    className="w-full py-3 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 shadow-md hover:shadow-brand-700/25"
                  >
                    <Users className="w-4 h-4" aria-hidden="true" />
                    <span>{isAr ? 'انضم إلى الحصة' : 'Join the session'}</span>
                  </Link>

                  <p className="text-xs text-fg-subtle text-center">
                    {isAr
                      ? 'تحتاج حساباً؟ '
                      : 'No account yet? '}
                    <Link href="/enroll" className="font-bold text-brand-ink hover:underline">
                      {isAr ? 'قدّم طلب الانضمام هنا' : 'Apply for admission here'}
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      <div className="h-px rule-brass" aria-hidden="true" />
    </section>
  );
};
