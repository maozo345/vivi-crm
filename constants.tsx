
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  CheckSquare, 
  Workflow, 
  CreditCard, 
  FileText,
  MessageCircle,
  Mail,
  Zap,
  FileCode,
  LayoutTemplate,
  Calendar
} from 'lucide-react';
import { User } from './types';

export const NAV_ITEMS = [
  { path: '/', label: 'דשבורד', icon: <LayoutDashboard size={20} /> },
  { path: '/leads', label: 'ניהול לידים', icon: <Users size={20} /> },
  { path: '/tasks', label: 'משימות', icon: <CheckSquare size={20} /> },
  { path: '/calendar', label: 'יומן ופגישות', icon: <Calendar size={20} /> },
  { path: '/landing-pages', label: 'דפי נחיתה', icon: <LayoutTemplate size={20} /> },
  { path: '/automations', label: 'אוטומציות', icon: <Workflow size={20} /> },
  { path: '/forms', label: 'טפסים ואינטגרציות', icon: <FileCode size={20} /> },
  { path: '/settings', label: 'הגדרות מערכת', icon: <Settings size={20} /> },
];

// Placeholder for future modules
export const FUTURE_MODULES = [
  { id: 'invoices', label: 'חשבוניות', icon: <FileText size={20} /> },
  { id: 'payments', label: 'סליקה', icon: <CreditCard size={20} /> },
];

export const AUTOMATION_ICONS = {
  'SEND_WHATSAPP': <MessageCircle className="text-green-500" />,
  'SEND_EMAIL': <Mail className="text-blue-500" />,
  'CREATE_TASK': <CheckSquare className="text-purple-500" />
};

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'דניאל מנהל', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Daniel', role: 'admin' },
  { id: 'u2', name: 'רונית מכירות', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ronit', role: 'agent' },
  { id: 'u3', name: 'יוסי תמיכה', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Yossi', role: 'agent' },
];

export const MOCK_LEADS_DATA = [
  { 
    id: 'l1', name: 'ישראל ישראלי', phone: '050-1234567', email: 'israel@example.com', 
    statusId: 'new', source: 'פייסבוק', createdAt: new Date().toISOString(), 
    customValues: { budget: '5000', interest: 'פיתוח' }, tags: ['VIP'] 
  },
  { 
    id: 'l2', name: 'שרה כהן', phone: '052-9876543', email: 'sara@example.com', 
    statusId: 'contacted', source: 'גוגל', createdAt: new Date(Date.now() - 86400000).toISOString(), 
    customValues: { budget: '12000', interest: 'עיצוב' }, tags: [] 
  },
  { 
    id: 'l3', name: 'דני לוי', phone: '054-5555555', email: 'dani@example.com', 
    statusId: 'closed_won', source: 'פה לאוזן', createdAt: new Date(Date.now() - 172800000).toISOString(), 
    customValues: { budget: '25000', interest: 'שיווק' }, tags: ['לקוח חוזר'] 
  }
];
