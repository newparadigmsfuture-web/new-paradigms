export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          avatar_url: string | null;
          role: 'educator' | 'trainer' | 'admin';
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          avatar_url?: string | null;
          role?: 'educator' | 'trainer' | 'admin';
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          avatar_url?: string | null;
          role?: 'educator' | 'trainer' | 'admin';
          created_at?: string;
        };
      };
      appointments: {
        Row: {
          id: string;
          educator_id: string;
          client_name: string;
          client_email: string;
          client_phone: string | null;
          scheduled_at: string;
          duration_minutes: number;
          status: 'scheduled' | 'completed' | 'cancelled';
          notes: string | null;
          outcome: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          educator_id: string;
          client_name: string;
          client_email: string;
          client_phone?: string | null;
          scheduled_at: string;
          duration_minutes?: number;
          status?: 'scheduled' | 'completed' | 'cancelled';
          notes?: string | null;
          outcome?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          educator_id?: string;
          client_name?: string;
          client_email?: string;
          client_phone?: string | null;
          scheduled_at?: string;
          duration_minutes?: number;
          status?: 'scheduled' | 'completed' | 'cancelled';
          notes?: string | null;
          outcome?: string | null;
          created_at?: string;
        };
      };
      performance_metrics: {
        Row: {
          id: string;
          educator_id: string;
          period_start: string;
          period_end: string;
          total_appointments: number;
          conversions: number;
          feedback_score: number | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          educator_id: string;
          period_start: string;
          period_end: string;
          total_appointments?: number;
          conversions?: number;
          feedback_score?: number | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          educator_id?: string;
          period_start?: string;
          period_end?: string;
          total_appointments?: number;
          conversions?: number;
          feedback_score?: number | null;
          notes?: string | null;
          created_at?: string;
        };
      };
      training_resources: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          type: 'document' | 'video' | 'link';
          file_url: string;
          category: string;
          uploaded_by: string;
          access_roles: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          type: 'document' | 'video' | 'link';
          file_url: string;
          category: string;
          uploaded_by: string;
          access_roles: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          type?: 'document' | 'video' | 'link';
          file_url?: string;
          category?: string;
          uploaded_by?: string;
          access_roles?: string[];
          created_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          sender_id: string;
          receiver_id: string | null;
          conversation_id: string;
          content: string;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          sender_id: string;
          receiver_id?: string | null;
          conversation_id: string;
          content: string;
          read_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          sender_id?: string;
          receiver_id?: string | null;
          conversation_id?: string;
          content?: string;
          read_at?: string | null;
          created_at?: string;
        };
      };
      conversations: {
        Row: {
          id: string;
          participant_ids: string[];
          type: 'direct' | 'group';
          name: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          participant_ids: string[];
          type?: 'direct' | 'group';
          name?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          participant_ids?: string[];
          type?: 'direct' | 'group';
          name?: string | null;
          created_at?: string;
        };
      };
      feedback: {
        Row: {
          id: string;
          from_user_id: string;
          to_user_id: string;
          appointment_id: string | null;
          rating: number;
          comment: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          from_user_id: string;
          to_user_id: string;
          appointment_id?: string | null;
          rating: number;
          comment?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          from_user_id?: string;
          to_user_id?: string;
          appointment_id?: string | null;
          rating?: number;
          comment?: string | null;
          created_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          read: boolean;
          action_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          read?: boolean;
          action_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          title?: string;
          message?: string;
          read?: boolean;
          action_url?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
