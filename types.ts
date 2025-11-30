
export type LeadStatus = {
  id: string;
  name: string;
  color: string;
  order: number;
};

export type FieldType = 'text' | 'number' | 'date' | 'select' | 'email' | 'phone';

export type CustomField = {
  id: string;
  label: string;
  type: FieldType;
  options?: string[]; // For select inputs
  required?: boolean;
};

export type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  statusId: string;
  source: string;
  createdAt: string; // ISO Date
  customValues: Record<string, string | number>; // Dynamic values based on CustomFields
  tags: string[];
};

export type Priority = 'low' | 'medium' | 'high';

export type User = {
  id: string;
  name: string;
  avatar: string;
  role: 'admin' | 'agent';
};

export type Task = {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  assignedTo?: string; // User ID
  priority: Priority;
  relatedLeadId?: string;
  syncedToGoogle?: boolean;
};

export type AutomationTrigger = 'LEAD_CREATED' | 'STATUS_CHANGED' | 'TAG_ADDED';
export type AutomationAction = 'SEND_EMAIL' | 'CREATE_TASK' | 'SEND_WHATSAPP';

export type Automation = {
  id: string;
  name: string;
  active: boolean;
  trigger: AutomationTrigger;
  action: AutomationAction;
  config: Record<string, any>;
};

// Landing Page Types
export type LandingPageSectionType = 'hero' | 'features' | 'about' | 'cta' | 'testimonials' | 'text' | 'form';

export type LandingPageSection = {
  id: string;
  type: LandingPageSectionType;
  content: {
    headline?: string;
    subheadline?: string;
    description?: string;
    imageUrl?: string;
    buttonText?: string;
    features?: Array<{ id: string; title: string; description: string; icon: string }>;
    testimonials?: Array<{ id: string; name: string; role: string; quote: string; avatar?: string }>;
    html?: string;
  };
};

export type LandingPage = {
  id: string;
  name: string;
  description?: string; // Used for AI generation context
  theme: {
    primaryColor: string;
    font: string;
  };
  sections: LandingPageSection[];
  formConfig: {
    title: string;
    fields: string[]; // IDs of fields to show (name, email, phone, customFieldIds)
    buttonText: string;
  };
  thankYouPage: {
    title: string;
    message: string;
  };
  published: boolean;
  createdAt: string;
};

// Calendar & Scheduling Types
export type MeetingType = {
  id: string;
  title: string;
  duration: number; // minutes
  description?: string;
  active: boolean;
  slug: string;
};

export type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  type: 'meeting' | 'task' | 'blocked';
  attendees?: string[];
  description?: string;
  syncedToGoogle?: boolean;
};

export const DEFAULT_STATUSES: LeadStatus[] = [
  { id: 'new', name: 'חדש', color: 'bg-blue-100 text-blue-800 border-blue-200', order: 1 },
  { id: 'contacted', name: 'נוצר קשר', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', order: 2 },
  { id: 'meeting', name: 'פגישה תואמה', color: 'bg-purple-100 text-purple-800 border-purple-200', order: 3 },
  { id: 'negotiation', name: 'משא ומתן', color: 'bg-orange-100 text-orange-800 border-orange-200', order: 4 },
  { id: 'closed_won', name: 'נסגר בהצלחה', color: 'bg-green-100 text-green-800 border-green-200', order: 5 },
  { id: 'closed_lost', name: 'לא רלוונטי', color: 'bg-gray-100 text-gray-800 border-gray-200', order: 6 },
];

export const INITIAL_CUSTOM_FIELDS: CustomField[] = [
  { id: 'budget', label: 'תקציב משוער', type: 'number' },
  { id: 'interest', label: 'תחום עניין', type: 'select', options: ['פיתוח', 'עיצוב', 'שיווק', 'אחר'] }
];
