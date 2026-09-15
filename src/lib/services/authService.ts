import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import type { UserRole } from '@/lib/supabase/types';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  phone?: string | null;
  enrolledLevelId?: string | null;
  avatarUrl?: string | null;
}

const LOCAL_AUTH_STORAGE_KEY = 'ib-auth-user';

export const DEMO_STUDENT_USER: UserProfile = {
  id: 'demo-student-uuid-001',
  email: 'student@ibnbasheer.edu',
  fullName: 'Tālib al-ʿIlm (Ahmad Ibrahim)',
  role: 'student',
  phone: '+234 803 123 4567',
  enrolledLevelId: 'ibtidaiyya',
  avatarUrl: null,
};

export const DEMO_TEACHER_USER: UserProfile = {
  id: 'demo-teacher-uuid-002',
  email: 'ustaz@ibnbasheer.edu',
  fullName: 'Ustaz Abu Abdullah Al-Mubaarak',
  role: 'teacher',
  phone: '+234 800 000 1111',
  avatarUrl: null,
};

// Check for active user session (Supabase or Demo session)
export async function getCurrentUser(): Promise<UserProfile | null> {
  if (typeof window === 'undefined') return null;

  // 1. Check local demo user session first
  const localStored = localStorage.getItem(LOCAL_AUTH_STORAGE_KEY);
  if (localStored) {
    try {
      return JSON.parse(localStored) as UserProfile;
    } catch {
      localStorage.removeItem(LOCAL_AUTH_STORAGE_KEY);
    }
  }

  // 2. Check Supabase auth session if configured
  if (isSupabaseConfigured()) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return null;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profile) {
        return {
          id: profile.id,
          email: profile.email,
          fullName: profile.full_name,
          role: profile.role,
          phone: profile.phone_number,
          enrolledLevelId: profile.enrolled_level_id,
          avatarUrl: profile.avatar_url,
        };
      }

      return {
        id: session.user.id,
        email: session.user.email || '',
        fullName: session.user.user_metadata?.full_name || 'Academy Student',
        role: (session.user.user_metadata?.role as UserRole) || 'student',
      };
    } catch (err) {
      console.warn('Error fetching Supabase session:', err);
    }
  }

  return null;
}

// Sign in with Email & Password
export async function signIn(email: string, password: string): Promise<{ user: UserProfile | null; error?: string }> {
  // If demo credentials or Supabase not yet configured, allow demo sign in
  if (!isSupabaseConfigured() || email.includes('demo') || email.includes('student@ibnbasheer') || email.includes('ustaz@ibnbasheer')) {
    const isTeacher = email.includes('ustaz') || email.includes('teacher');
    const user = isTeacher ? DEMO_TEACHER_USER : DEMO_STUDENT_USER;
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_AUTH_STORAGE_KEY, JSON.stringify(user));
      window.dispatchEvent(new Event('auth-state-change'));
    }
    return { user };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { user: null, error: error.message };

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    const user: UserProfile = {
      id: data.user.id,
      email: data.user.email || email,
      fullName: profile?.full_name || data.user.user_metadata?.full_name || 'Academy Member',
      role: profile?.role || (data.user.user_metadata?.role as UserRole) || 'student',
      phone: profile?.phone_number,
      enrolledLevelId: profile?.enrolled_level_id,
    };

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('auth-state-change'));
    }

    return { user };
  } catch (err) {
    return { user: null, error: (err as Error).message || 'Failed to sign in' };
  }
}

// Sign up new student
export async function signUpStudent(data: {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  levelId?: string;
}): Promise<{ user: UserProfile | null; error?: string }> {
  if (!isSupabaseConfigured()) {
    const newUser: UserProfile = {
      id: `local-${Date.now()}`,
      email: data.email,
      fullName: data.fullName,
      role: 'student',
      phone: data.phone,
      enrolledLevelId: data.levelId,
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_AUTH_STORAGE_KEY, JSON.stringify(newUser));
      window.dispatchEvent(new Event('auth-state-change'));
    }
    return { user: newUser };
  }

  try {
    const { data: authData, error: authErr } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
          role: 'student',
          phone_number: data.phone,
          enrolled_level_id: data.levelId,
        },
      },
    });

    if (authErr) return { user: null, error: authErr.message };

    const user: UserProfile = {
      id: authData.user?.id || `user-${Date.now()}`,
      email: data.email,
      fullName: data.fullName,
      role: 'student',
      phone: data.phone,
      enrolledLevelId: data.levelId,
    };

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('auth-state-change'));
    }

    return { user };
  } catch (err) {
    return { user: null, error: (err as Error).message || 'Failed to create student account' };
  }
}

// Demo Login Quick-switch
export function loginAsDemo(type: 'student' | 'teacher'): UserProfile {
  const user = type === 'teacher' ? DEMO_TEACHER_USER : DEMO_STUDENT_USER;
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_AUTH_STORAGE_KEY, JSON.stringify(user));
    window.dispatchEvent(new Event('auth-state-change'));
  }
  return user;
}

// Sign Out
export async function signOut(): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(LOCAL_AUTH_STORAGE_KEY);
  }
  if (isSupabaseConfigured()) {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('auth-state-change'));
  }
}
