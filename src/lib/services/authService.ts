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

// Check for active user session via Supabase Auth
export async function getCurrentUser(): Promise<UserProfile | null> {
  if (typeof window === 'undefined') return null;

  // 1. Primary: Check real Supabase Auth session
  if (isSupabaseConfigured()) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        localStorage.removeItem(LOCAL_AUTH_STORAGE_KEY);
        return null;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();

      if (profile) {
        const user: UserProfile = {
          id: profile.id,
          email: profile.email,
          fullName: profile.full_name,
          role: profile.role,
          phone: profile.phone_number,
          enrolledLevelId: profile.enrolled_level_id,
          avatarUrl: profile.avatar_url,
        };
        localStorage.setItem(LOCAL_AUTH_STORAGE_KEY, JSON.stringify(user));
        return user;
      }

      const fallbackUser: UserProfile = {
        id: session.user.id,
        email: session.user.email || '',
        fullName: session.user.user_metadata?.full_name || 'Academy Student',
        role: (session.user.user_metadata?.role as UserRole) || 'student',
        phone: session.user.user_metadata?.phone_number || null,
        enrolledLevelId: session.user.user_metadata?.enrolled_level_id || null,
      };
      localStorage.setItem(LOCAL_AUTH_STORAGE_KEY, JSON.stringify(fallbackUser));
      return fallbackUser;
    } catch (err) {
      console.warn('Error verifying Supabase auth session:', err);
    }
  }

  // 2. Fallback: Retrieve active registered session from storage if present
  const localStored = localStorage.getItem(LOCAL_AUTH_STORAGE_KEY);
  if (localStored) {
    try {
      return JSON.parse(localStored) as UserProfile;
    } catch {
      localStorage.removeItem(LOCAL_AUTH_STORAGE_KEY);
    }
  }

  return null;
}

// Sign in with Email & Password
export async function signIn(email: string, password: string): Promise<{ user: UserProfile | null; error?: string }> {
  const cleanEmail = email.trim();

  if (!cleanEmail || !password) {
    return { user: null, error: 'Please enter both your email address and password.' };
  }

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        return { user: null, error: error.message };
      }

      if (!data.user) {
        return { user: null, error: 'Authentication failed. Please check your credentials.' };
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle();

      const user: UserProfile = {
        id: data.user.id,
        email: data.user.email || cleanEmail,
        fullName: profile?.full_name || data.user.user_metadata?.full_name || 'Academy Member',
        role: profile?.role || (data.user.user_metadata?.role as UserRole) || 'student',
        phone: profile?.phone_number || data.user.user_metadata?.phone_number || null,
        enrolledLevelId: profile?.enrolled_level_id || data.user.user_metadata?.enrolled_level_id || null,
        avatarUrl: profile?.avatar_url || null,
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_AUTH_STORAGE_KEY, JSON.stringify(user));
        window.dispatchEvent(new Event('auth-state-change'));
      }

      return { user };
    } catch (err) {
      return { user: null, error: (err as Error).message || 'Failed to authenticate.' };
    }
  }

  // If Supabase is not configured yet (local testing), check for previously registered local user
  if (typeof window !== 'undefined') {
    const localStored = localStorage.getItem(LOCAL_AUTH_STORAGE_KEY);
    if (localStored) {
      try {
        const storedUser = JSON.parse(localStored) as UserProfile;
        if (storedUser.email.toLowerCase() === cleanEmail.toLowerCase()) {
          window.dispatchEvent(new Event('auth-state-change'));
          return { user: storedUser };
        }
      } catch {
        // ignore
      }
    }
  }

  return {
    user: null,
    error: 'Invalid email or password. Please verify your credentials or register a new account.',
  };
}

// Sign up new student account
export async function signUpStudent(data: {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  levelId?: string;
}): Promise<{ user: UserProfile | null; error?: string }> {
  const cleanEmail = data.email.trim();
  const cleanName = data.fullName.trim();
  const cleanPhone = data.phone?.trim() || null;

  if (!cleanEmail || !data.password || !cleanName) {
    return { user: null, error: 'Full name, email address, and password are required.' };
  }

  if (data.password.length < 6) {
    return { user: null, error: 'Password must be at least 6 characters in length.' };
  }

  if (isSupabaseConfigured()) {
    try {
      const { data: authData, error: authErr } = await supabase.auth.signUp({
        email: cleanEmail,
        password: data.password,
        options: {
          data: {
            full_name: cleanName,
            role: 'student',
            phone_number: cleanPhone,
            enrolled_level_id: data.levelId || null,
          },
        },
      });

      if (authErr) {
        return { user: null, error: authErr.message };
      }

      if (!authData.user) {
        return { user: null, error: 'Failed to create student account.' };
      }

      // Upsert into profiles table to ensure role & identity are maintained
      await supabase.from('profiles').upsert({
        id: authData.user.id,
        email: cleanEmail,
        full_name: cleanName,
        role: 'student',
        phone_number: cleanPhone,
        enrolled_level_id: data.levelId || null,
      });

      const user: UserProfile = {
        id: authData.user.id,
        email: cleanEmail,
        fullName: cleanName,
        role: 'student',
        phone: cleanPhone,
        enrolledLevelId: data.levelId || null,
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_AUTH_STORAGE_KEY, JSON.stringify(user));
        window.dispatchEvent(new Event('auth-state-change'));
      }

      return { user };
    } catch (err) {
      return { user: null, error: (err as Error).message || 'Failed to create student account.' };
    }
  }

  // Local fallback registration
  const newUser: UserProfile = {
    id: `usr-${Date.now()}`,
    email: cleanEmail,
    fullName: cleanName,
    role: 'student',
    phone: cleanPhone,
    enrolledLevelId: data.levelId || null,
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_AUTH_STORAGE_KEY, JSON.stringify(newUser));
    window.dispatchEvent(new Event('auth-state-change'));
  }

  return { user: newUser };
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
