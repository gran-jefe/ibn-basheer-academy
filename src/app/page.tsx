'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { LevelsSection } from '@/components/LevelsSection';
import { CoursesSection } from '@/components/CoursesSection';
import { FeaturesSection } from '@/components/FeaturesSection';
import { InstructorSection } from '@/components/InstructorSection';
import { Footer } from '@/components/Footer';
import { EnrollmentModal } from '@/components/EnrollmentModal';
import { StudentPortalModal } from '@/components/StudentPortalModal';
import { TeacherPortalModal } from '@/components/TeacherPortalModal';
import { usePreferences } from '@/lib/usePreferences';

export default function Home() {
  const { lang, setLang, theme, toggleTheme } = usePreferences();

  const [isEnrollmentOpen, setIsEnrollmentOpen] = useState(false);
  const [isStudentPortalOpen, setIsStudentPortalOpen] = useState(false);
  const [isTeacherPortalOpen, setIsTeacherPortalOpen] = useState(false);

  const [selectedLevelId, setSelectedLevelId] = useState<string | undefined>();
  const [selectedCourseId, setSelectedCourseId] = useState<string | undefined>();

  const openEnrollment = (levelId?: string, courseId?: string) => {
    setSelectedLevelId(levelId);
    setSelectedCourseId(courseId);
    setIsEnrollmentOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        lang={lang}
        setLang={setLang}
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenEnrollment={() => openEnrollment()}
        onOpenStudentPortal={() => setIsStudentPortalOpen(true)}
        onOpenTeacherPortal={() => setIsTeacherPortalOpen(true)}
      />

      <main id="main" className="flex-1">
        <Hero
          lang={lang}
          onOpenEnrollment={() => openEnrollment()}
          onOpenStudentPortal={() => setIsStudentPortalOpen(true)}
        />
        <LevelsSection
          lang={lang}
          onSelectLevel={(levelId) => openEnrollment(levelId, undefined)}
        />
        <CoursesSection
          lang={lang}
          onSelectCourse={(courseId) => openEnrollment(undefined, courseId)}
        />
        <FeaturesSection lang={lang} />
        <InstructorSection lang={lang} />
      </main>

      <Footer lang={lang} />

      <EnrollmentModal
        isOpen={isEnrollmentOpen}
        onClose={() => setIsEnrollmentOpen(false)}
        lang={lang}
        preSelectedLevelId={selectedLevelId}
        preSelectedCourseId={selectedCourseId}
      />

      <StudentPortalModal
        isOpen={isStudentPortalOpen}
        onClose={() => setIsStudentPortalOpen(false)}
        lang={lang}
      />

      <TeacherPortalModal
        isOpen={isTeacherPortalOpen}
        onClose={() => setIsTeacherPortalOpen(false)}
        lang={lang}
      />
    </div>
  );
}
