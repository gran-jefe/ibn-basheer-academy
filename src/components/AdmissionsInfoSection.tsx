'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TUITION_PLANS, ADMISSION_FAQS, ACADEMY_INFO } from '@/lib/data/academyData';
import { 
  Check, 
  ChevronDown, 
  Clock, 
  CreditCard, 
  FileText, 
  HelpCircle, 
  MessageCircle, 
  Sparkles, 
  UserCheck, 
  Users, 
  Video 
} from 'lucide-react';
import type { Lang } from '@/lib/usePreferences';

interface AdmissionsInfoSectionProps {
  lang: Lang;
}

export const AdmissionsInfoSection: React.FC<AdmissionsInfoSectionProps> = ({ lang }) => {
  const isAr = lang === 'ar';
  const router = useRouter();

  const [openFaqId, setOpenFaqId] = useState<string | null>(ADMISSION_FAQS[0].id);

  const steps = [
    {
      step: '01',
      icon: FileText,
      titleAr: 'تقديم طلب الالتحاق',
      titleEn: 'Submit Online Application',
      descAr: 'اختر مستواك الدراسي وأدخل بياناتك الشخصية عبر استمارة التسجيل الرسمية.',
      descEn: 'Select your preferred academic level and submit your details via our admissions form.',
    },
    {
      step: '02',
      icon: CreditCard,
      titleAr: 'سداد الرسوم وتأكيد الواتساب',
      titleEn: 'Tuition Transfer & WhatsApp Notice',
      descAr: 'حوّل الرسوم فصلياً وأرسل إشعار التحويل المباشر مع أمين صندوق الأكاديمية.',
      descEn: 'Transfer term tuition and confirm your payment slip directly via WhatsApp.',
    },
    {
      step: '03',
      icon: UserCheck,
      titleAr: 'جلسة التقييم وتحديد المستوى',
      titleEn: 'Diagnostic Placement Session',
      descAr: 'مقابلة شفهية موجزة لتحديد مستواك الصوتي واللغوي وإلحاقك بالحلقة المناسبة.',
      descEn: 'Brief oral assessment to calibrate your recitation level and assign your halaqah.',
    },
    {
      step: '04',
      icon: Video,
      titleAr: 'تفعيل الحساب وبدء الحلقات',
      titleEn: 'Portal Activation & Live Study',
      descAr: 'استلم بيانات بوابتك الإلكترونية وروابط Google Meet المباشرة وانطلق في طلب العلم.',
      descEn: 'Receive student portal credentials, syllabus PDFs, and join your live study circle.',
    },
  ];

  return (
    <section id="admissions" className="py-20 bg-paper scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-tint ring-1 ring-brand-ring text-brand-ink text-xs font-bold tracking-wide uppercase mb-3">
            <CreditCard className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{isAr ? 'القبول والتسجيل والرسوم' : 'Admissions & Tuition Framework'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-fg font-display tracking-tight">
            {isAr
              ? 'رسوم دراسية واضحة وخطوات تسجيل ميسرة'
              : 'Transparent Tuition & Straightforward Admissions'}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-fg-muted leading-relaxed">
            {isAr
              ? 'نؤمن أن طلب العلم الشرعي أمانة يجب أن تكون ميسرة لكل راغب دون عوائق خفية أو تعقيدات.'
              : 'Quality Islamic scholarship with transparent term fees, family assistance, and personal attention.'}
          </p>
        </div>

        {/* 4-Step Visual Admission Flow */}
        <div className="mb-20">
          <div className="text-center mb-8">
            <h3 className="text-lg font-bold text-fg">
              {isAr ? 'كيف تبدأ مسيرتك التعليمية معنا؟' : 'Your 4-Step Admission Journey'}
            </h3>
            <p className="text-xs sm:text-sm text-fg-muted mt-1">
              {isAr
                ? 'من التسجيل الأولي وحتى حضور حلقتك الأولى في أقل من ٤٨ ساعة'
                : 'From submission to your first live halaqah in under 48 hours'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((s, idx) => (
              <div
                key={s.step}
                className="rounded-2xl bg-surface ring-1 ring-line p-5 sm:p-6 flex flex-col justify-between shadow-sm relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-tint text-brand-ink flex items-center justify-center font-bold ring-1 ring-brand-ring">
                      <s.icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <span className="text-2xl font-black font-display text-brand-ink/20">
                      {s.step}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-fg mb-2">
                    {isAr ? s.titleAr : s.titleEn}
                  </h4>
                  <p className="text-xs text-fg-muted leading-relaxed">
                    {isAr ? s.descAr : s.descEn}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-line flex items-center gap-1.5 text-[11px] font-semibold text-brand-ink">
                  <span>{isAr ? `المرحلة ${idx + 1}` : `Phase ${idx + 1}`}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tuition Plans Grid */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-extrabold text-fg font-display">
              {isAr ? 'جدول الرسوم الفصلية المعتمدة' : 'Official Term Tuition Plans'}
            </h3>
            <p className="text-xs sm:text-sm text-fg-muted mt-1">
              {isAr
                ? 'تشمل الرسوم كافة الحصص الحية، الكتب والمذكرات الرقمية، والاختبارات الدورية.'
                : 'Includes all live halaqahs, digital study materials, and formal examination grading.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {TUITION_PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all relative ${
                  plan.isPopular
                    ? 'bg-surface ring-2 ring-brand-500 shadow-xl lg:-translate-y-2'
                    : 'bg-surface ring-1 ring-line shadow-sm hover:shadow-md'
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3.5 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-700 text-white text-xs font-bold shadow-md">
                    <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{isAr ? 'البرنامج الأكثر تسجيلاً' : 'Most Popular'}</span>
                  </div>
                )}

                <div>
                  <h4 className="text-xl font-bold text-fg">
                    {isAr ? plan.titleAr : plan.titleEn}
                  </h4>
                  <p className="text-xs text-fg-muted mt-1 min-h-[32px]">
                    {isAr ? plan.taglineAr : plan.taglineEn}
                  </p>

                  <div className="mt-6 p-4 rounded-2xl bg-surface-2 ring-1 ring-line text-center">
                    <span className="text-3xl font-extrabold text-brand-ink font-display">
                      {plan.termFee}
                    </span>
                    <p className="text-xs font-medium text-fg-muted mt-0.5">
                      {isAr ? plan.billingPeriodAr : plan.billingPeriodEn}
                    </p>
                  </div>

                  <ul className="mt-6 space-y-3">
                    {(isAr ? plan.featuresAr : plan.featuresEn).map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-fg">
                        <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-6 border-t border-line space-y-3">
                  <button
                    type="button"
                    onClick={() => router.push(`/enroll?level=${encodeURIComponent(plan.levelId)}`)}
                    className={`w-full py-3 rounded-xl font-bold text-sm transition-colors text-center ${
                      plan.isPopular
                        ? 'bg-brand-700 hover:bg-brand-800 text-white shadow-md'
                        : 'bg-brand-tint hover:bg-brand-ring/30 text-brand-ink ring-1 ring-brand-ring'
                    }`}
                  >
                    {isAr ? 'سجّل في هذا المستوى الآن' : 'Enroll in this Level'}
                  </button>

                  <a
                    href={`${ACADEMY_INFO.contact.whatsappLink}?text=${encodeURIComponent(
                      `Assalamu Alaykum, I am inquiring about tuition and enrollment for ${plan.titleEn}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 rounded-lg text-xs font-semibold text-fg-muted hover:text-fg flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{isAr ? 'استفسار عبر واتساب' : 'Inquire via WhatsApp'}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Sibling & Family Discount Banner */}
          <div className="mt-8 rounded-2xl bg-surface-2 ring-1 ring-line p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent-400/15 text-accent-700 dark:text-accent-300 flex items-center justify-center shrink-0 ring-1 ring-accent-500/20">
                <Users className="w-6 h-6" aria-hidden="true" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-fg">
                  {isAr ? 'برنامج خصومات الأسر والأشقاء' : 'Family & Sibling Discount Scheme'}
                </h4>
                <p className="text-xs text-fg-muted mt-0.5">
                  {isAr
                    ? 'خصم ١٥٪ للطفل الثاني و٢٥٪ للطفل الثالث المسجلين من نفس الأسرة لتشجيع العائلات على طلب العلم.'
                    : '15% discount for the 2nd child and 25% for the 3rd child from the same household.'}
                </p>
              </div>
            </div>
            <a
              href={`${ACADEMY_INFO.contact.whatsappLink}?text=${encodeURIComponent(
                'Assalamu Alaykum, I would like to apply for the Sibling & Family Discount scheme.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-surface ring-1 ring-line hover:bg-surface-3 text-fg font-bold text-xs shrink-0 transition-colors"
            >
              {isAr ? 'طلب تفعيل خصم الأسرة' : 'Request Sibling Discount'}
            </a>
          </div>
        </div>

        {/* Schedule & Timing Guidance */}
        <div className="mb-20 rounded-3xl bg-surface ring-1 ring-line p-6 sm:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-tint text-brand-ink text-xs font-bold mb-3">
                <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{isAr ? 'مرونة تناسب دوامك' : 'Flexible Study Tracks'}</span>
              </div>
              <h3 className="text-2xl font-extrabold text-fg font-display">
                {isAr
                  ? 'مواعيد مصممة للمدارس والمهنيين'
                  : 'Schedules Engineered for Modern Realities'}
              </h3>
              <p className="text-xs sm:text-sm text-fg-muted leading-relaxed mt-2">
                {isAr
                  ? 'ندرك ارتباطات الطلاب بمدارسهم والمهنيين بأعمالهم؛ لذلك توفر الأكاديمية مسارين مرنين لتلقي العلم دون إخلال بمسؤولياتك اليومية.'
                  : 'We know parents juggle school pick-ups and adults have demanding shifts. Our halaqahs are positioned deliberately across two flexible time windows.'}
              </p>

              <div className="mt-6 space-y-3">
                <div className="p-4 rounded-xl bg-surface-2 ring-1 ring-line">
                  <h4 className="text-sm font-bold text-fg">
                    {isAr ? 'المسار أ: عطلة نهاية الأسبوع (للطلاب والناشئة)' : 'Track A: Weekend Intensive (Youth & Students)'}
                  </h4>
                  <p className="text-xs text-fg-muted mt-1">
                    {isAr
                      ? 'السبت والأحد (صباحاً وبعد الظهر) — مثالي لطلاب المدارس دون تعارض مع واجباتهم المدرسية.'
                      : 'Saturday & Sunday (Mornings / Afternoons) — zero conflict with secular schooling.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-surface-2 ring-1 ring-line">
                  <h4 className="text-sm font-bold text-fg">
                    {isAr ? 'المسار ب: الأمسيات الهادئة (للعاملين والمتقدمين)' : 'Track B: Evening Circles (Professionals & Advanced)'}
                  </h4>
                  <p className="text-xs text-fg-muted mt-1">
                    {isAr
                      ? 'أمسيات منتصف الأسبوع (بعد صلاة المغرب أو العشاء) — للموظفين وطلبة الجامعة المتفرغين مساءً.'
                      : 'Mid-week quiet evening slots after work hours with full recording archive availability.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-paper ring-1 ring-line p-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-brand-tint text-brand-ink flex items-center justify-center mx-auto ring-1 ring-brand-ring">
                <Video className="w-8 h-8" aria-hidden="true" />
              </div>
              <h4 className="text-lg font-bold text-fg">
                {isAr ? 'فاتتك حصة حية؟ لا تقلق أبداً' : 'Missed a Live Halaqah? No Problem.'}
              </h4>
              <p className="text-xs sm:text-sm text-fg-muted leading-relaxed max-w-sm mx-auto">
                {isAr
                  ? 'تسجل جميع الفصول التفاعلية بجودة عالية وترفع تلقائياً إلى بوابتك الإلكترونية مع المذكرات والمراجع لمراجعتها متى شئت.'
                  : 'Every session is automatically recorded in HD and archived into your personal student portal with companion PDF slides and audio drills.'}
              </p>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <Check className="w-4 h-4" aria-hidden="true" />
                  <span>{isAr ? 'وصول غير محدود على مدار ٢٤ ساعة' : '24/7 Unlimited Lifetime Access'}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-2 ring-1 ring-line text-fg-subtle text-xs font-bold uppercase mb-2">
              <HelpCircle className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{isAr ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}</span>
            </div>
            <h3 className="text-2xl font-extrabold text-fg font-display">
              {isAr ? 'إجابات عن استفسارات القبول والدراسة' : 'Everything You Need to Know'}
            </h3>
          </div>

          <div className="space-y-3">
            {ADMISSION_FAQS.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="rounded-2xl bg-surface ring-1 ring-line overflow-hidden transition-all shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                    className="w-full p-5 sm:p-6 text-start flex items-center justify-between gap-4 hover:bg-surface-2 transition-colors"
                  >
                    <span className="text-sm sm:text-base font-bold text-fg">
                      {isAr ? faq.questionAr : faq.questionEn}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-fg-subtle shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-brand-ink' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0 text-xs sm:text-sm text-fg-muted leading-relaxed border-t border-line/50">
                      {isAr ? faq.answerAr : faq.answerEn}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-fg-muted">
              {isAr
                ? 'لديك سؤال آخر لم تجد إجابته هنا؟ '
                : 'Have another question not answered above? '}
              <a
                href={ACADEMY_INFO.contact.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-ink font-bold underline hover:opacity-80"
              >
                {isAr ? 'تحدث مباشرة مع مكتب التسجيل عبر واتساب' : 'Chat directly with Admissions on WhatsApp'}
              </a>
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
