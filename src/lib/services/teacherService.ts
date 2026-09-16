import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import type { EnrollmentStatus } from '@/lib/supabase/types';

export interface CreateAssignmentPayload {
  title: string;
  levelId: string;
  courseId: string;
  totalPoints: number;
  dueDate: string;
  description?: string;
}

export interface PublishMaterialPayload {
  courseId: string;
  title: string;
  type: 'pdf' | 'audio' | 'video';
  sizeOrDuration: string;
  downloadUrl: string;
}

export interface GradeRecitationPayload {
  recitationId: string;
  score: number;
  feedbackMakharij: string;
  feedbackSifat: string;
  instructorNotes: string;
}

export interface ApplicantRecord {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  levelId: string;
  courseId: string;
  status: EnrollmentStatus;
  appliedAt: string;
  notes?: string | null;
}

export const MOCK_APPLICANTS: ApplicantRecord[] = [
  {
    id: 'app-1',
    fullName: 'Zayd Ibn Harith (زيد بن حارث)',
    email: 'zayd.h@example.com',
    phone: '+234 802 333 4455',
    levelId: 'tamheediy',
    courseId: 'tajweed',
    status: 'pending',
    appliedAt: '2026-09-15',
    notes: 'Beginner in Arabic reading, seeking Tajweed intensive foundation.',
  },
  {
    id: 'app-2',
    fullName: 'Khadijah Abdulsalam (خديجة عبد السلام)',
    email: 'khadijah.a@example.com',
    phone: '+234 809 777 8899',
    levelId: 'ibtidaiyya',
    courseId: 'arabic',
    status: 'active',
    appliedAt: '2026-09-14',
    notes: 'Paid tuition fees via WhatsApp transfer. Active student.',
  },
  {
    id: 'app-3',
    fullName: 'Bilal Al-Habashi (بلال الحبشي)',
    email: 'bilal.h@example.com',
    phone: '+234 803 555 1212',
    levelId: 'idadiyya',
    courseId: 'fiqh',
    status: 'pending',
    appliedAt: '2026-09-15',
    notes: 'Completed Ibtidā’iyya last term. Ready for Fiqh transactions.',
  },
];

// 1. Create and publish new assignment
export async function createAssignment(payload: CreateAssignmentPayload): Promise<{ success: boolean; error?: string }> {
  try {
    if (!isSupabaseConfigured()) {
      console.info('Supabase not configured — mock creating assignment:', payload.title);
      return { success: true };
    }

    const { error } = await supabase.from('assignments').insert({
      title_en: payload.title,
      title_ar: payload.title,
      level_id: payload.levelId,
      course_id: payload.courseId,
      total_points: payload.totalPoints,
      due_date: payload.dueDate,
      description_en: payload.description || null,
      description_ar: payload.description || null,
    });

    if (error) {
      console.error('Error creating assignment in Supabase:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: (err as Error).message || 'Failed to create assignment' };
  }
}

// 2. Publish new course material / lecture notes
export async function publishCourseMaterial(payload: PublishMaterialPayload): Promise<{ success: boolean; error?: string }> {
  try {
    if (!isSupabaseConfigured()) {
      console.info('Supabase not configured — mock publishing material:', payload.title);
      return { success: true };
    }

    const { error } = await supabase.from('course_materials').insert({
      course_id: payload.courseId,
      title_en: payload.title,
      title_ar: payload.title,
      type: payload.type,
      size_or_duration: payload.sizeOrDuration,
      download_url: payload.downloadUrl,
    });

    if (error) {
      console.error('Error publishing material in Supabase:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: (err as Error).message || 'Failed to publish material' };
  }
}

// 3. Grade audio recitation submission
export async function gradeRecitation(payload: GradeRecitationPayload): Promise<{ success: boolean; error?: string }> {
  try {
    if (!isSupabaseConfigured()) {
      console.info('Supabase not configured — mock grading recitation:', payload.recitationId);
      return { success: true };
    }

    const { error } = await supabase
      .from('recitation_submissions')
      .update({
        score: payload.score,
        status: 'reviewed',
        feedback_makharij: payload.feedbackMakharij,
        feedback_sifat: payload.feedbackSifat,
        instructor_notes: payload.instructorNotes,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', payload.recitationId);

    if (error) {
      console.error('Error updating recitation in Supabase:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: (err as Error).message || 'Failed to submit grade' };
  }
}

// 4. Fetch student admissions applications
export async function fetchEnrollmentApplications(): Promise<ApplicantRecord[]> {
  try {
    if (!isSupabaseConfigured()) {
      return MOCK_APPLICANTS;
    }

    const { data, error } = await supabase
      .from('enrollments')
      .select('*')
      .order('applied_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return MOCK_APPLICANTS;
    }

    return data.map((item) => ({
      id: item.id,
      fullName: item.full_name,
      email: item.email,
      phone: item.phone_number,
      levelId: item.level_id || 'tamheediy',
      courseId: item.course_id || 'quran',
      status: item.status,
      appliedAt: item.applied_at ? item.applied_at.split('T')[0] : '2026-09-15',
      notes: item.notes,
    }));
  } catch {
    return MOCK_APPLICANTS;
  }
}

// 5. Approve & update applicant enrollment status
export async function updateEnrollmentStatus(id: string, status: EnrollmentStatus): Promise<{ success: boolean; error?: string }> {
  try {
    if (!isSupabaseConfigured()) {
      return { success: true };
    }

    const { error } = await supabase
      .from('enrollments')
      .update({ status })
      .eq('id', id);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    return { success: false, error: (err as Error).message || 'Failed to update enrollment status' };
  }
}

// 6. Broadcast new announcement
export async function publishAnnouncement(payload: {
  titleEn: string;
  titleAr: string;
  contentEn: string;
  contentAr: string;
  category: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    if (!isSupabaseConfigured()) {
      return { success: true };
    }

    const { error } = await supabase.from('announcements').insert({
      title_en: payload.titleEn,
      title_ar: payload.titleAr,
      content_en: payload.contentEn,
      content_ar: payload.contentAr,
      category: payload.category,
    });

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    return { success: false, error: (err as Error).message || 'Failed to publish announcement' };
  }
}
