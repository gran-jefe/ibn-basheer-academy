import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

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
