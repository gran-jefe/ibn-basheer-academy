'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { LevelsSection } from '@/components/LevelsSection';
import { CoursesSection } from '@/components/CoursesSection';
import { FeaturesSection } from '@/components/FeaturesSection';
import { InstructorSection } from '@/components/InstructorSection';
import { Footer } from '@/components/Footer';
import { CourseDetailModal } from '@/components/CourseDetailModal';
import { usePreferences } from '@/lib/usePreferences';
import { getCurrentUser, signOut, type UserProfile } from '@/lib/services/authService';
import type { Course } from '@/lib/data/academyData';

export default function Home() {
  const router = useRouter();
  const { lang, setLang, theme, toggleTheme } = usePreferences();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [detailCourse, setDetailCourse] = useState<Course | null>(null);

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
        onSignOut={handleSignOut}
      />

      <main id="main" className="flex-1">
        <Hero lang={lang} />
        <LevelsSection
          lang={lang}
          onSelectLevel={(levelId) => router.push(`/enroll?level=${encodeURIComponent(levelId)}`)}
        />
        <CoursesSection
          lang={lang}
          onSelectCourse={(courseId) => router.push(`/enroll?course=${encodeURIComponent(courseId)}`)}
          onViewDetails={(course) => setDetailCourse(course)}
        />
        <FeaturesSection lang={lang} />
        <InstructorSection lang={lang} />
      </main>

      <Footer lang={lang} />

      {/* Course Detail & Classical Matn Syllabus Dialog */}
      <CourseDetailModal
        isOpen={!!detailCourse}
        onClose={() => setDetailCourse(null)}
        course={detailCourse}
        lang={lang}
        onEnroll={(courseId) => {
          setDetailCourse(null);
          router.push(`/enroll?course=${encodeURIComponent(courseId)}`);
        }}
      />
    </div>
  );
}
