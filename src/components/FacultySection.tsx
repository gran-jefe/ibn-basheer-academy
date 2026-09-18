'use client';

import React, { useState } from 'react';
import { FACULTY_MEMBERS, ACADEMY_INFO, type FacultyMember } from '@/lib/data/academyData';
import { Award, BookOpen, CheckCircle2, MessageCircle, ShieldCheck, ChevronRight } from 'lucide-react';
import type { Lang } from '@/lib/usePreferences';

interface FacultySectionProps {
  lang: Lang;
}

export const FacultySection: React.FC<FacultySectionProps> = ({ lang }) => {
  const isAr = lang === 'ar';
  const [activeFacultyId, setActiveFacultyId] = useState<string>(FACULTY_MEMBERS[0].id);

  const activeFaculty = FACULTY_MEMBERS.find((f) => f.id === activeFacultyId) || FACULTY_MEMBERS[0];

  return (
    <section id="faculty" className="py-20 bg-paper scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-tint ring-1 ring-brand-ring text-brand-ink text-xs font-bold tracking-wide uppercase mb-3">
            <Award className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{isAr ? 'الهيئة العلمية والمشايخ' : 'Scholarly Faculty Council'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-fg font-display tracking-tight">
            {isAr
              ? 'تعلّم على أيدي نخبة من المشايخ المسندين'
              : 'Learn Directly from Authenticated Scholars'}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-fg-muted leading-relaxed">
            {isAr
              ? 'لا نعتمد على التسجيلات المجهولة، بل على التلقي المباشر والسند المتصل والمتابعة الحية في حلقات العلم.'
              : 'Knowledge is transmitted through authentic lineage, oral recitation, and direct scholarly oversight.'}
          </p>
        </div>

        {/* Desktop & Tablet Faculty Selector Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {FACULTY_MEMBERS.map((member) => {
            const isSelected = member.id === activeFaculty.id;
            return (
              <button
                key={member.id}
                type="button"
                onClick={() => setActiveFacultyId(member.id)}
                className={`p-4 rounded-2xl text-start transition-all border flex flex-col justify-between gap-3 ${
                  isSelected
                    ? 'bg-surface border-brand-500 shadow-md ring-2 ring-brand-500/20'
                    : 'bg-surface-2 border-line hover:border-line-strong hover:bg-surface'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-xl bg-gradient-to-br ${member.accentColor} text-white font-bold font-display flex items-center justify-center text-sm shadow-sm shrink-0`}
                    aria-hidden="true"
                  >
                    {member.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-fg truncate">
                      {isAr ? member.nameAr : member.nameEn}
                    </p>
                    <p className="text-xs text-fg-muted truncate">
                      {isAr ? member.titleAr : member.titleEn}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold pt-2 border-t border-line">
                  <span className={isSelected ? 'text-brand-ink' : 'text-fg-subtle'}>
                    {isAr ? 'عرض الملف العلمي' : 'View Profile'}
                  </span>
                  <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-brand-ink' : 'text-fg-subtle'} rtl:rotate-180`} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Faculty Detailed Showcase Card */}
        <div className="rounded-3xl bg-surface ring-1 ring-line shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left Hero Profile Banner */}
            <div className="lg:col-span-4 bg-brand-950 text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 end-0 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div>
                <div
                  className={`w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br ${activeFaculty.accentColor} text-white font-display font-bold text-4xl flex items-center justify-center shadow-lg ring-4 ring-white/10 mb-6`}
                  aria-hidden="true"
                >
                  {activeFaculty.initials}
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-accent-400/20 text-accent-300 text-xs font-bold uppercase tracking-wider mb-2">
                  <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{isAr ? 'سند وإجازة معتمدة' : 'Verified Sanad / Isnād'}</span>
                </div>
                <h3 className="text-2xl font-bold font-display text-white">
                  {isAr ? activeFaculty.nameAr : activeFaculty.nameEn}
                </h3>
                <p className="text-xs font-semibold text-accent-300 mt-1">
                  {isAr ? activeFaculty.roleAr : activeFaculty.roleEn}
                </p>
                <p className="text-xs text-brand-200 mt-2">
                  {isAr ? activeFaculty.specializationAr : activeFaculty.specializationEn}
                </p>
              </div>

              {activeFaculty.sanadCertificationEn && (
                <div className="mt-8 pt-6 border-t border-white/10">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-accent-400 mb-1">
                    {isAr ? 'سلسلة التلقي والرواية' : 'Lineage of Transmission'}
                  </p>
                  <p className="text-xs text-brand-100 leading-relaxed italic">
                    &ldquo;{isAr ? activeFaculty.sanadCertificationAr : activeFaculty.sanadCertificationEn}&rdquo;
                  </p>
                </div>
              )}
            </div>

            {/* Right Detailed Dossier */}
            <div className="lg:col-span-8 p-8 sm:p-10 space-y-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-brand-ink">
                  {isAr ? 'السيرة العلمية والتربوية' : 'Scholarly Background & Pedagogy'}
                </p>
                <h4 className="mt-1 text-2xl font-extrabold text-fg">
                  {isAr ? activeFaculty.titleAr : activeFaculty.titleEn}
                </h4>
              </div>

              <p className="text-fg-muted leading-relaxed text-sm sm:text-base">
                {isAr ? activeFaculty.bioAr : activeFaculty.bioEn}
              </p>

              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-fg mb-3">
                  {isAr ? 'المؤهلات العلمية والخبرات' : 'Academic Qualifications & Credentials'}
                </h5>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(isAr ? activeFaculty.credentialsAr : activeFaculty.credentialsEn).map((cred, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 rounded-xl bg-surface-2 ring-1 ring-line px-3.5 py-3"
                    >
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-brand-ink mt-0.5" aria-hidden="true" />
                      <span className="text-xs sm:text-sm font-medium text-fg">
                        {cred}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Day & Boarding Program Callout (from official academy poster) */}
              {activeFaculty.id === 'ustadh-numon-basheer' && (
                <div className="rounded-2xl bg-surface-2 ring-1 ring-line p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-line">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-accent-600 dark:text-accent-400">
                        {isAr ? 'برامج الأكاديمية الرسمية' : 'Academy Study Modes'}
                      </span>
                      <h5 className="text-sm font-extrabold text-fg mt-0.5">
                        {isAr ? 'برامج يومية وبرامج داخلية (Day & Boarding Programs)' : 'Day & Boarding Programs Available'}
                      </h5>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-brand-tint text-brand-ink text-xs font-bold ring-1 ring-brand-ring">
                      {isAr ? 'دورة مكثفة ٣ أشهر' : '3-Month Intensive Track'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-surface ring-1 ring-line">
                      <p className="text-xs font-bold text-fg">
                        ☀️ {isAr ? 'البرنامج النهاري (Day Program)' : 'Day Program'}
                      </p>
                      <p className="text-[11px] text-fg-muted mt-1 leading-relaxed">
                        {isAr
                          ? 'تعليم نوعي وتأسيس رصين خلال ساعات النهار.'
                          : 'Quality structured learning during daylight hours.'}
                      </p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-surface ring-1 ring-line">
                      <p className="text-xs font-bold text-fg">
                        🛏️ {isAr ? 'البرنامج الداخلي (Boarding Program)' : 'Boarding Program'}
                      </p>
                      <p className="text-[11px] text-fg-muted mt-1 leading-relaxed">
                        {isAr
                          ? 'معايشة كاملة في بيئة إسلامية وتميز أكاديمي متواصل.'
                          : 'Full immersion in Islamic character and academic excellence.'}
                      </p>
                    </div>
                  </div>

                  {/* Mission Callout */}
                  <div className="p-3.5 rounded-xl bg-brand-tint ring-1 ring-brand-ring flex items-start gap-3">
                    <span className="text-xl shrink-0" aria-hidden="true">🎯</span>
                    <div>
                      <p className="text-xs font-bold text-brand-ink">
                        {isAr ? 'رسالة الشيخ نعمان بن بشير' : 'His Mission'}
                      </p>
                      <p className="text-xs text-fg leading-relaxed mt-0.5 italic">
                        &ldquo;{isAr
                          ? 'مساعدة الطلاب على الانتقال من مجرد التلاوة إلى فهم لغة القرآن وتدبر رسالة الله عبر تجربة تعليمية منظمة وتطبيقية وشيقة.'
                          : 'To help students move beyond recitation to understanding the language of the Qur’an through a structured, practical and engaging learning experience.'}&rdquo;
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Consultation and Contact Links */}
              <div className="pt-6 border-t border-line flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-fg-subtle">
                  <BookOpen className="w-4 h-4 text-brand-ink" aria-hidden="true" />
                  <span>
                    {isAr
                      ? `يشرف على مواد: ${activeFaculty.coursesTaught.join('، ')}`
                      : `Supervises courses: ${activeFaculty.coursesTaught.join(', ')}`}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={`${ACADEMY_INFO.contact.whatsappLink}?text=${encodeURIComponent(
                      `Assalamu Alaykum, I would like to consult regarding learning with ${activeFaculty.nameEn}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs sm:text-sm transition-colors flex items-center gap-2 shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4" aria-hidden="true" />
                    <span>{isAr ? 'استشارة علمية عبر واتساب' : 'Consult via WhatsApp'}</span>
                  </a>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
