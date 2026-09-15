'use client';

import React, { useEffect, useState } from 'react';
import { ACADEMIC_LEVELS, MAJOR_COURSES, ACADEMY_INFO } from '@/lib/data/academyData';
import { CheckCircle2, GraduationCap, Mail, MessageCircle, Phone, Send, User, Loader2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import {
  iconInFieldClass, inputClass, inputWithIconClass, labelClass, selectClass,
} from '@/components/ui/form';
import type { Lang } from '@/lib/usePreferences';
import { submitEnrollmentApplication } from '@/lib/services/enrollmentService';

interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Lang;
  preSelectedLevelId?: string;
  preSelectedCourseId?: string;
}

export const EnrollmentModal: React.FC<EnrollmentModalProps> = ({
  isOpen,
  onClose,
  lang,
  preSelectedLevelId,
  preSelectedCourseId,
}) => {
  const isAr = lang === 'ar';

  const [studentName, setStudentName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('tamheediy');
  const [selectedCourse, setSelectedCourse] = useState('quran');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* The selects used to read their pre-selection only once, at mount, so
     clicking a different level card left the form on the previous choice. */
  useEffect(() => {
    if (!isOpen) return;
    if (preSelectedLevelId) setSelectedLevel(preSelectedLevelId);
    if (preSelectedCourseId) setSelectedCourse(preSelectedCourseId);
  }, [isOpen, preSelectedLevelId, preSelectedCourseId]);

  // Start each visit on a clean form.
  useEffect(() => {
    if (!isOpen) setIsSubmitted(false);
  }, [isOpen]);

  const levelObj = ACADEMIC_LEVELS.find((l) => l.id === selectedLevel);
  const courseObj = MAJOR_COURSES.find((c) => c.id === selectedCourse);

  const whatsappMessage = encodeURIComponent(
    'السلام عليكم ورحمة الله وبركاته\n' +
      'أرغب في التسجيل في أكاديمية ابن بشير:\n' +
      `الاسم: ${studentName}\n` +
      `البريد: ${email}\n` +
      `الهاتف: ${phone}\n` +
      `المستوى المطلوب: ${levelObj ? levelObj.titleAr : selectedLevel}\n` +
      `المادة الأساسية: ${courseObj ? courseObj.titleAr : selectedCourse}\n` +
      `ملاحظات: ${notes || 'لا يوجد'}`,
  );

  const confirmUrl =
    `https://wa.me/${ACADEMY_INFO.contact.whatsappFormatted.replace(/\D/g, '')}` +
    `?text=${whatsappMessage}`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isAr ? 'طلب الالتحاق بالأكاديمية' : 'Academy admission request'}
      subtitle={
        isAr
          ? 'اختر المستوى والمادة وأدخل بياناتك'
          : 'Choose a level and subject, then add your details'
      }
      icon={<GraduationCap className="w-5 h-5" aria-hidden="true" />}
      closeLabel={isAr ? 'إغلاق' : 'Close'}
    >
      {!isSubmitted ? (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setIsSubmitting(true);
            await submitEnrollmentApplication({
              fullName: studentName,
              email,
              phoneNumber: phone,
              levelId: selectedLevel,
              courseId: selectedCourse,
              notes,
            });
            setIsSubmitting(false);
            setIsSubmitted(true);
          }}
          className="p-5 sm:p-6 space-y-5"
        >
          {/* What they're applying for — confirmed up front */}
          <div className="rounded-xl bg-brand-tint ring-1 ring-brand-ring px-4 py-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-brand-ink">
              {isAr ? 'طلب الالتحاق بـ' : 'Applying for'}
            </p>
            <p className="text-sm font-semibold text-fg mt-0.5">
              {isAr ? levelObj?.titleAr : levelObj?.titleEn}
              {courseObj && <> · {isAr ? courseObj.titleAr : courseObj.titleEn}</>}
            </p>
          </div>

          <div>
            <label htmlFor="enr-name" className={labelClass}>
              {isAr ? 'الاسم الكامل' : 'Full name'}{' '}
              <span className="text-danger">*</span>
            </label>
            <div className="relative">
              <User className={iconInFieldClass} aria-hidden="true" />
              <input
                id="enr-name"
                type="text"
                required
                autoComplete="name"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder={isAr ? 'مثال: أحمد عبد الله' : 'e.g. Ahmed Abdullah'}
                className={inputWithIconClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="enr-email" className={labelClass}>
                {isAr ? 'البريد الإلكتروني' : 'Email address'}{' '}
                <span className="text-danger">*</span>
              </label>
              <div className="relative" dir="ltr">
                <Mail className={iconInFieldClass} aria-hidden="true" />
                <input
                  id="enr-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  className={inputWithIconClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor="enr-phone" className={labelClass}>
                {isAr ? 'رقم الواتساب' : 'WhatsApp number'}{' '}
                <span className="text-danger">*</span>
              </label>
              <div className="relative" dir="ltr">
                <Phone className={iconInFieldClass} aria-hidden="true" />
                <input
                  id="enr-phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+234 708 168 0864"
                  className={`${inputWithIconClass} tabular`}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="enr-level" className={labelClass}>
                {isAr ? 'المستوى الدراسي' : 'Level'}{' '}
                <span className="text-danger">*</span>
              </label>
              <select
                id="enr-level"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className={selectClass}
              >
                {ACADEMIC_LEVELS.map((l) => (
                  <option key={l.id} value={l.id}>
                    {isAr ? `${l.titleAr} — ${l.durationAr}` : `${l.titleEn} — ${l.durationEn}`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="enr-course" className={labelClass}>
                {isAr ? 'المادة الرئيسية' : 'Primary subject'}{' '}
                <span className="text-danger">*</span>
              </label>
              <select
                id="enr-course"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className={selectClass}
              >
                {MAJOR_COURSES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.number}. {isAr ? c.titleAr : c.titleEn}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="enr-notes" className={labelClass}>
              {isAr ? 'ملاحظات إضافية' : 'Additional notes'}
              <span className="font-normal text-fg-subtle">
                {' '}({isAr ? 'اختياري' : 'optional'})
              </span>
            </label>
            <textarea
              id="enr-notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={
                isAr
                  ? 'أي خبرة سابقة أو طلبات تود إخبار المعلم بها...'
                  : 'Any previous study or requests for the instructor...'
              }
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-75"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            ) : (
              <Send className="w-4 h-4" aria-hidden="true" />
            )}
            <span>
              {isSubmitting
                ? (isAr ? 'جاري الإرسال...' : 'Submitting...')
                : (isAr ? 'إرسال طلب التسجيل' : 'Submit application')}
            </span>
          </button>
        </form>
      ) : (
        <div className="p-8 text-center space-y-5" role="status" aria-live="polite">
          <div className="w-14 h-14 mx-auto rounded-full bg-success-soft text-success flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
          </div>

          <div>
            <h3 className="text-xl font-extrabold text-fg">
              {isAr ? 'تم استلام طلبك' : 'Application received'}
            </h3>
            <p className="mt-2 text-sm text-fg-muted max-w-md mx-auto leading-relaxed">
              {isAr
                ? 'مرحباً بك في أكاديمية ابن بشير. أكّد تسجيلك عبر الواتساب ليصلك رابط الفصل وجدول الحصص.'
                : 'Welcome to Ibn Basheer Academy. Confirm over WhatsApp to receive your class link and timetable.'}
            </p>
          </div>

          <div className="rounded-xl bg-surface-2 ring-1 ring-line px-4 py-3 text-start max-w-md mx-auto">
            <dl className="text-sm space-y-1.5">
              <div className="flex justify-between gap-4">
                <dt className="text-fg-subtle">{isAr ? 'الاسم' : 'Name'}</dt>
                <dd className="font-semibold text-fg truncate">{studentName}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-fg-subtle">{isAr ? 'المستوى' : 'Level'}</dt>
                <dd className="font-semibold text-fg truncate">
                  {isAr ? levelObj?.titleAr : levelObj?.titleEn}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-fg-subtle">{isAr ? 'المادة' : 'Subject'}</dt>
                <dd className="font-semibold text-fg truncate">
                  {isAr ? courseObj?.titleAr : courseObj?.titleEn}
                </dd>
              </div>
            </dl>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
            <a
              href={confirmUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              <span>{isAr ? 'تأكيد عبر الواتساب' : 'Confirm on WhatsApp'}</span>
            </a>

            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3 rounded-xl ring-1 ring-line text-fg-muted hover:text-fg hover:bg-surface-2 font-semibold text-sm transition-colors"
            >
              {isAr ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};
