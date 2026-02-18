export type UserRole = 'educator' | 'trainer' | 'admin';

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
}

export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  educator_id: string;
  client_name: string;
  client_email: string;
  client_phone: string | null;
  scheduled_at: string;
  duration_minutes: number;
  status: AppointmentStatus;
  notes: string | null;
  outcome: string | null;
  created_at: string;
  educator?: User;
}

export interface PerformanceMetric {
  id: string;
  educator_id: string;
  period_start: string;
  period_end: string;
  total_appointments: number;
  conversions: number;
  feedback_score: number | null;
  notes: string | null;
  created_at: string;
  educator?: User;
}

export type ResourceType = 'document' | 'video' | 'link';

export interface TrainingResource {
  id: string;
  title: string;
  description: string | null;
  type: ResourceType;
  file_url: string;
  category: string;
  uploaded_by: string;
  access_roles: UserRole[];
  created_at: string;
  uploader?: User;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string | null;
  conversation_id: string;
  content: string;
  read_at: string | null;
  created_at: string;
  sender?: User;
}

export type ConversationType = 'direct' | 'group';

export interface Conversation {
  id: string;
  participant_ids: string[];
  type: ConversationType;
  name: string | null;
  created_at: string;
  participants?: User[];
  last_message?: Message;
  unread_count?: number;
}

export interface Feedback {
  id: string;
  from_user_id: string;
  to_user_id: string;
  appointment_id: string | null;
  rating: number;
  comment: string | null;
  created_at: string;
  from_user?: User;
  to_user?: User;
  appointment?: Appointment;
}

export type NotificationType =
  | 'appointment_reminder'
  | 'new_message'
  | 'feedback_received'
  | 'resource_added'
  | 'system';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  action_url: string | null;
  created_at: string;
}

export interface DashboardStats {
  totalAppointments: number;
  completedAppointments: number;
  conversionRate: number;
  averageFeedbackScore: number;
  pendingTasks: number;
  unreadMessages: number;
}

export interface AIInsight {
  id: string;
  type: 'trend' | 'recommendation' | 'anomaly' | 'summary';
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  created_at: string;
}
