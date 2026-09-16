export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'student' | 'teacher' | 'admin';
export type EnrollmentStatus = 'pending' | 'active' | 'completed' | 'suspended';
export type MaterialType = 'pdf' | 'audio' | 'video';
export type SubmissionStatus = 'submitted' | 'graded' | 'revision_required';
export type RecitationStatus = 'pending' | 'reviewed';
export type ClassStatus = 'upcoming' | 'live' | 'completed';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone_number: string | null;
          role: UserRole;
          enrolled_level_id: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          email: string;
          phone_number?: string | null;
          role?: UserRole;
          enrolled_level_id?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
        Relationships: [];
      };
      academic_levels: {
        Row: {
          id: string;
          stage_number: number;
          title_en: string;
          title_ar: string;
          duration_en: string;
          duration_ar: string;
          description_en: string;
          description_ar: string;
          badge_color: string;
          prerequisite_en: string;
          prerequisite_ar: string;
          created_at: string;
        };
        Insert: Database['public']['Tables']['academic_levels']['Row'];
        Update: Partial<Database['public']['Tables']['academic_levels']['Row']>;
        Relationships: [];
      };
      courses: {
        Row: {
          id: string;
          number: number;
          title_en: string;
          title_ar: string;
          description_en: string;
          description_ar: string;
          primary_text_en: string | null;
          primary_text_ar: string | null;
          instructor_name: string;
          icon_name: string;
          created_at: string;
        };
        Insert: Database['public']['Tables']['courses']['Row'];
        Update: Partial<Database['public']['Tables']['courses']['Row']>;
        Relationships: [];
      };
      enrollments: {
        Row: {
          id: string;
          student_id: string | null;
          full_name: string;
          email: string;
          phone_number: string;
          level_id: string | null;
          course_id: string | null;
          notes: string | null;
          status: EnrollmentStatus;
          applied_at: string;
          enrolled_at: string | null;
        };
        Insert: {
          id?: string;
          student_id?: string | null;
          full_name: string;
          email: string;
          phone_number: string;
          level_id?: string | null;
          course_id?: string | null;
          notes?: string | null;
          status?: EnrollmentStatus;
          applied_at?: string;
          enrolled_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['enrollments']['Insert']>;
        Relationships: [];
      };
      live_classes: {
        Row: {
          id: string;
          title_en: string;
          title_ar: string;
          subject_en: string;
          subject_ar: string;
          level_id: string | null;
          instructor_name: string;
          day_en: string;
          day_ar: string;
          time_en: string;
          time_ar: string;
          meet_url: string;
          status: ClassStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          title_en: string;
          title_ar: string;
          subject_en: string;
          subject_ar: string;
          level_id?: string | null;
          instructor_name: string;
          day_en: string;
          day_ar: string;
          time_en: string;
          time_ar: string;
          meet_url: string;
          status?: ClassStatus;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['live_classes']['Insert']>;
        Relationships: [];
      };
      course_materials: {
        Row: {
          id: string;
          course_id: string;
          title_en: string;
          title_ar: string;
          type: MaterialType;
          size_or_duration: string;
          download_url: string;
          uploaded_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          title_en: string;
          title_ar: string;
          type: MaterialType;
          size_or_duration: string;
          download_url: string;
          uploaded_at?: string;
        };
        Update: Partial<Database['public']['Tables']['course_materials']['Insert']>;
        Relationships: [];
      };
      assignments: {
        Row: {
          id: string;
          course_id: string;
          level_id: string | null;
          title_en: string;
          title_ar: string;
          description_en: string | null;
          description_ar: string | null;
          total_points: number;
          due_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          level_id?: string | null;
          title_en: string;
          title_ar: string;
          description_en?: string | null;
          description_ar?: string | null;
          total_points: number;
          due_date: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['assignments']['Insert']>;
        Relationships: [];
      };
      submissions: {
        Row: {
          id: string;
          assignment_id: string;
          student_id: string;
          submission_text: string | null;
          file_url: string | null;
          status: SubmissionStatus;
          grade: number | null;
          instructor_feedback: string | null;
          submitted_at: string;
          graded_at: string | null;
        };
        Insert: {
          id?: string;
          assignment_id: string;
          student_id: string;
          submission_text?: string | null;
          file_url?: string | null;
          status?: SubmissionStatus;
          grade?: number | null;
          instructor_feedback?: string | null;
          submitted_at?: string;
          graded_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['submissions']['Insert']>;
        Relationships: [];
      };
      recitation_submissions: {
        Row: {
          id: string;
          student_id: string;
          surah_name: string;
          verses_range: string;
          audio_url: string;
          duration_seconds: number;
          status: RecitationStatus;
          score: number | null;
          max_score: number;
          feedback_makharij: string | null;
          feedback_sifat: string | null;
          instructor_notes: string | null;
          submitted_at: string;
          reviewed_at: string | null;
        };
        Insert: {
          id?: string;
          student_id: string;
          surah_name: string;
          verses_range: string;
          audio_url: string;
          duration_seconds: number;
          status?: RecitationStatus;
          score?: number | null;
          max_score?: number;
          feedback_makharij?: string | null;
          feedback_sifat?: string | null;
          instructor_notes?: string | null;
          submitted_at?: string;
          reviewed_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['recitation_submissions']['Insert']>;
        Relationships: [];
      };
      announcements: {
        Row: {
          id: string;
          title_en: string;
          title_ar: string;
          content_en: string;
          content_ar: string;
          category: string;
          published_at: string;
        };
        Insert: {
          id?: string;
          title_en: string;
          title_ar: string;
          content_en: string;
          content_ar: string;
          category: string;
          published_at?: string;
        };
        Update: Partial<Database['public']['Tables']['announcements']['Insert']>;
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: UserRole;
      enrollment_status: EnrollmentStatus;
      material_type: MaterialType;
      submission_status: SubmissionStatus;
      recitation_status: RecitationStatus;
      class_status: ClassStatus;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
