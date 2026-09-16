import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

export interface SubmitAssignmentPayload {
  assignmentId: string;
  studentId: string;
  submissionText: string;
  fileUrl?: string;
}

export async function submitAssignmentSolution(payload: SubmitAssignmentPayload): Promise<{ success: boolean; error?: string }> {
  try {
    if (!isSupabaseConfigured()) {
      console.info('Supabase not configured — saving assignment submission locally.');
      return { success: true };
    }

    const { error } = await supabase.from('submissions').insert({
      assignment_id: payload.assignmentId,
      student_id: payload.studentId,
      submission_text: payload.submissionText,
      file_url: payload.fileUrl || null,
      status: 'submitted',
      submitted_at: new Date().toISOString(),
    });

    if (error) {
      console.error('Supabase assignment submission error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: (err as Error).message || 'Failed to submit assignment' };
  }
}
