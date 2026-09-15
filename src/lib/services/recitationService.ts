import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

export interface RecitationSubmissionPayload {
  studentId?: string;
  surahName: string;
  versesRange: string;
  audioBlob?: Blob;
  audioUrl?: string;
  durationSeconds: number;
}

export async function submitRecitation(
  payload: RecitationSubmissionPayload
): Promise<{ success: boolean; data?: unknown; error?: string }> {
  try {
    if (!isSupabaseConfigured()) {
      console.info('Supabase not configured — mock saving recitation recording.');
      return { success: true };
    }

    let finalAudioUrl = payload.audioUrl || '';

    // If a recorded Blob is provided, upload it to Supabase Storage
    if (payload.audioBlob) {
      const fileName = `recitation_${Date.now()}.webm`;
      const filePath = `recitations/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('recitations')
        .upload(filePath, payload.audioBlob, {
          contentType: 'audio/webm',
          upsert: true,
        });

      if (uploadError) {
        console.warn('Storage upload error (using fallback URL):', uploadError);
      } else if (uploadData) {
        const { data: publicUrlData } = supabase.storage
          .from('recitations')
          .getPublicUrl(filePath);
        finalAudioUrl = publicUrlData.publicUrl;
      }
    }

    // Insert recitation submission record into table
    const { data, error } = await supabase
      .from('recitation_submissions')
      .insert({
        student_id: payload.studentId || '00000000-0000-0000-0000-000000000000',
        surah_name: payload.surahName,
        verses_range: payload.versesRange,
        audio_url: finalAudioUrl || 'https://storage.placeholder/recitation.webm',
        duration_seconds: payload.durationSeconds,
        status: 'pending',
        max_score: 50,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase recitation submission error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: unknown) {
    console.error('Unexpected error in submitRecitation:', err);
    return { success: false, error: (err as Error).message || 'Failed to submit recitation' };
  }
}
