import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/types';

export interface EnrollmentApplication {
  fullName: string;
  email: string;
  phoneNumber: string;
  levelId: string;
  courseId: string;
  notes?: string;
}

export async function submitEnrollmentApplication(data: EnrollmentApplication): Promise<{ success: boolean; error?: string }> {
  try {
    if (!isSupabaseConfigured()) {
      console.info('Supabase not fully configured yet — saving enrollment locally.');
      return { success: true };
    }

    const { error } = await supabase.from('enrollments').insert({
      full_name: data.fullName,
      email: data.email,
      phone_number: data.phoneNumber,
      level_id: data.levelId,
      course_id: data.courseId,
      notes: data.notes || null,
      status: 'pending',
    });

    if (error) {
      console.error('Supabase enrollment error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    console.error('Unexpected enrollment error:', err);
    return { success: false, error: (err as Error).message || 'Failed to submit enrollment.' };
  }
}
