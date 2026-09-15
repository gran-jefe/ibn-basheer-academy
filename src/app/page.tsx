'use client';

import React, { useState, useEffect } from 'react';
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
import { AuthModal } from '@/components/AuthModal';
import { CourseDetailModal } from '@/components/CourseDetailModal';
import { ClassroomModal } from '@/components/ClassroomModal';
import { TranscriptModal } from '@/components/TranscriptModal';
import { usePreferences } from '@/lib/usePreferences';
import { getCurrentUser, signOut, type UserProfile } from '@/lib/services/authService';
import type { Course, LiveClass } from '@/lib/data/academyData';

export default function Home() {
  const { lang, setLang, theme, toggleTheme } = usePreferences();

  const [user, setUser] = useState<UserProfile | null>(null);

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isEnrollmentOpen, setIsEnrollmentOpen] = useState(false);
  const [isStudentPortalOpen, setIsStudentPortalOpen] = useState(false);
  const [isTeacherPortalOpen, setIsTeacherPortalOpen] = useState(false);
  const [detailCourse, setDetailCourse] = useState<Course | null>(null);
  const [activeClassroom, setActiveClassroom] = useState<LiveClass | null>(null);
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);

  const [selectedLevelId, setSelectedLevelId] = useState<string | undefined>();
  const [selectedCourseId, setSelectedCourseId] = useState<string | undefined>();

  // Load and observe active authentication session
  useEffect(() => {
    let mounted = true;
    const fetchUser = async () => {
      const current = await getCurrentUser();
      if (mounted) setUser(current);
    };

    fetchUser();

    const handleAuthChange = () => {
      fetchUser();
    };

    window.addEventListener('auth-state-change', handleAuthChange);
    return () => {
      mounted = false;
      window.removeEventListener('auth-state-change', handleAuthChange);
    };
  }, []);

  const openEnrollment = (levelId?: string, courseId?: string) => {
    setSelectedLevelId(levelId);
    setSelectedCourseId(courseId);
    setIsEnrollmentOpen(true);
  };

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        lang={lang}
        setLang={setLang}
        theme={theme}
        toggleTheme={toggleTheme}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onSignOut={handleSignOut}
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
          onViewDetails={(course) => setDetailCourse(course)}
        />
        <FeaturesSection lang={lang} />
        <InstructorSection lang={lang} />
      </main>

      <Footer lang={lang} />

      {/* Authentication Dialog */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        lang={lang}
        onSuccess={(loggedUser) => setUser(loggedUser)}
      />

      {/* Course Detail & Classical Matn Syllabus Dialog */}
      <CourseDetailModal
        isOpen={!!detailCourse}
        onClose={() => setDetailCourse(null)}
        course={detailCourse}
        lang={lang}
        onEnroll={(courseId) => openEnrollment(undefined, courseId)}
      />

      {/* Enrollment Dialog */}
      <EnrollmentModal
        isOpen={isEnrollmentOpen}
        onClose={() => setIsEnrollmentOpen(false)}
        lang={lang}
        preSelectedLevelId={selectedLevelId}
        preSelectedCourseId={selectedCourseId}
      />

      {/* Student Portal & Recitation Studio Dialog */}
      <StudentPortalModal
        isOpen={isStudentPortalOpen}
        onClose={() => setIsStudentPortalOpen(false)}
        lang={lang}
        onEnterClassroom={(cls) => setActiveClassroom(cls)}
        onOpenTranscript={() => setIsTranscriptOpen(true)}
      />

      {/* Live Virtual Classroom & Classical Text Reader */}
      <ClassroomModal
        isOpen={!!activeClassroom}
        onClose={() => setActiveClassroom(null)}
        lang={lang}
        liveClass={activeClassroom}
      />

      {/* Official Academic Transcript & Certificate Generator */}
      <TranscriptModal
        isOpen={isTranscriptOpen}
        onClose={() => setIsTranscriptOpen(false)}
        lang={lang}
        studentName={user?.fullName || 'Ahmad Ibn Ibrahim'}
      />

      {/* Teacher Portal & LMS Grading Dialog */}
      <TeacherPortalModal
        isOpen={isTeacherPortalOpen}
        onClose={() => setIsTeacherPortalOpen(false)}
        lang={lang}
      />
    </div>
  );
}
