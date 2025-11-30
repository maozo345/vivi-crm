
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Lead, LeadStatus, CustomField, Task, Automation, User, LandingPage, MeetingType, CalendarEvent, DEFAULT_STATUSES, INITIAL_CUSTOM_FIELDS } from '../types';
import { MOCK_LEADS_DATA, MOCK_USERS } from '../constants';

interface CRMContextType {
  leads: Lead[];
  addLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => void;
  updateLeadStatus: (leadId: string, newStatusId: string) => void;
  statuses: LeadStatus[];
  addStatus: (name: string, color: string) => void;
  customFields: CustomField[];
  addCustomField: (field: CustomField) => void;
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  toggleTask: (taskId: string) => void;
  automations: Automation[];
  addAutomation: (automation: Omit<Automation, 'id'>) => void;
  users: User[];
  landingPages: LandingPage[];
  addLandingPage: (page: Omit<LandingPage, 'id' | 'createdAt'>) => void;
  updateLandingPage: (id: string, page: Partial<LandingPage>) => void;
  deleteLandingPage: (id: string) => void;
  // Calendar & Scheduling
  meetingTypes: MeetingType[];
  addMeetingType: (type: Omit<MeetingType, 'id'>) => void;
  calendarEvents: CalendarEvent[];
  isGoogleCalendarConnected: boolean;
  toggleGoogleCalendar: () => void;
  syncToGoogle: (id: string, type: 'task' | 'event') => void;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

export const CRMProvider = ({ children }: { children?: ReactNode }) => {
  // State initialization
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS_DATA);
  const [statuses, setStatuses] = useState<LeadStatus[]>(DEFAULT_STATUSES);
  const [customFields, setCustomFields] = useState<CustomField[]>(INITIAL_CUSTOM_FIELDS);
  const [users] = useState<User[]>(MOCK_USERS);
  
  const [tasks, setTasks] = useState<Task[]>([
    { 
      id: 't1', 
      title: 'להתקשר לישראל', 
      dueDate: new Date().toISOString(), 
      completed: false, 
      relatedLeadId: 'l1',
      priority: 'high',
      assignedTo: 'u2',
      syncedToGoogle: false
    },
    { 
      id: 't2', 
      title: 'לשלוח הצעת מחיר לשרה', 
      dueDate: new Date().toISOString(), 
      completed: true, 
      relatedLeadId: 'l2',
      priority: 'medium',
      assignedTo: 'u1',
      syncedToGoogle: true
    }
  ]);
  
  const [automations, setAutomations] = useState<Automation[]>([
    { id: 'a1', name: 'ברוכים הבאים - מייל', active: true, trigger: 'LEAD_CREATED', action: 'SEND_EMAIL', config: {} }
  ]);

  const [landingPages, setLandingPages] = useState<LandingPage[]>([
      {
          id: 'lp1',
          name: 'דף נחיתה לדוגמה',
          description: 'קורס שיווק דיגיטלי למתחילים',
          theme: { primaryColor: '#7c3aed', font: 'Rubik' },
          sections: [
              {
                  id: 'hero1',
                  type: 'hero',
                  content: {
                      headline: 'הפוך למקצוען שיווק דיגיטלי ב-30 יום',
                      subheadline: 'הצטרף לקורס המקיף ביותר בישראל ולמד איך להביא לקוחות אמיתיים.',
                      imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=2940',
                      buttonText: 'הירשם עכשיו'
                  }
              },
              {
                  id: 'feat1',
                  type: 'features',
                  content: {
                      features: [
                          { id: 'f1', title: 'לימוד מעשי', description: 'תרגול על פרויקטים אמיתיים', icon: 'check' },
                          { id: 'f2', title: 'ליווי אישי', description: 'מנטור צמוד לכל סטודנט', icon: 'users' },
                          { id: 'f3', title: 'השמה לעבודה', description: 'עזרה במציאת עבודה בסיום', icon: 'briefcase' },
                      ]
                  }
              },
              {
                  id: 'test1',
                  type: 'testimonials',
                  content: {
                      testimonials: [
                          { id: 't1', name: 'דני רופ', role: 'בוגר מחזור א׳', quote: 'הקורס שינה לי את הקריירה מקצה לקצה!', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' },
                          { id: 't2', name: 'שרה לוי', role: 'בעלת עסק', quote: 'סוף סוף אני יודעת איך לשווק את העסק שלי לבד.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka' }
                      ]
                  }
              },
              {
                  id: 'form1',
                  type: 'form',
                  content: {
                      headline: 'מוכנים להתחיל?',
                      subheadline: 'השאירו פרטים ונחזור אליכם עם סילבוס מלא'
                  }
              }
          ],
          formConfig: {
              title: 'טופס הרשמה',
              fields: ['name', 'phone', 'email'],
              buttonText: 'שלח פרטים'
          },
          thankYouPage: {
              title: 'תודה שנרשמת!',
              message: 'קיבלנו את הפרטים שלך, נציג יחזור אליך בהקדם.'
          },
          published: true,
          createdAt: new Date().toISOString()
      }
  ]);

  // Calendar State
  const [meetingTypes, setMeetingTypes] = useState<MeetingType[]>([
      { id: 'm1', title: 'שיחת היכרות', duration: 15, active: true, slug: 'intro-call', description: 'שיחה קצרה לבדיקת התאמה' },
      { id: 'm2', title: 'הדגמת מערכת', duration: 45, active: true, slug: 'demo', description: 'הדגמה מלאה של היכולות בזום' }
  ]);
  
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([
      { id: 'e1', title: 'פגישה עם לקוח פוטנציאלי', start: new Date().toISOString(), end: new Date(Date.now() + 3600000).toISOString(), type: 'meeting', attendees: ['israel@example.com'], syncedToGoogle: false }
  ]);
  
  const [isGoogleCalendarConnected, setIsGoogleCalendarConnected] = useState(false);

  // Actions
  const addLead = (leadData: Omit<Lead, 'id' | 'createdAt'>) => {
    const newLead: Lead = {
      ...leadData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    setLeads(prev => [newLead, ...prev]);
    
    // Check automations
    const activeAutomations = automations.filter(a => a.active && a.trigger === 'LEAD_CREATED');
    if (activeAutomations.length > 0) {
        console.log(`Triggering ${activeAutomations.length} automations for new lead...`);
    }
  };

  const updateLeadStatus = (leadId: string, newStatusId: string) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, statusId: newStatusId } : l));
  };

  const addStatus = (name: string, color: string) => {
    const newStatus: LeadStatus = {
      id: name.toLowerCase().replace(/ /g, '_'),
      name,
      color,
      order: statuses.length + 1
    };
    setStatuses(prev => [...prev, newStatus]);
  };

  const addCustomField = (field: CustomField) => {
    setCustomFields(prev => [...prev, field]);
  };

  const addTask = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: Math.random().toString(36).substr(2, 9),
      syncedToGoogle: isGoogleCalendarConnected // Auto-sync if connected
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };

  const addAutomation = (automation: Omit<Automation, 'id'>) => {
    setAutomations(prev => [...prev, { ...automation, id: Math.random().toString(36).substr(2, 9) }]);
  };

  const addLandingPage = (page: Omit<LandingPage, 'id' | 'createdAt'>) => {
      const newPage: LandingPage = {
          ...page,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString(),
      };
      setLandingPages(prev => [newPage, ...prev]);
  };

  const updateLandingPage = (id: string, page: Partial<LandingPage>) => {
      setLandingPages(prev => prev.map(p => p.id === id ? { ...p, ...page } : p));
  };

  const deleteLandingPage = (id: string) => {
      setLandingPages(prev => prev.filter(p => p.id !== id));
  };

  const addMeetingType = (type: Omit<MeetingType, 'id'>) => {
      setMeetingTypes(prev => [...prev, { ...type, id: Math.random().toString(36).substr(2, 9) }]);
  };

  const toggleGoogleCalendar = () => {
      setIsGoogleCalendarConnected(prev => !prev);
  };

  const syncToGoogle = (id: string, type: 'task' | 'event') => {
      if (type === 'task') {
          setTasks(prev => prev.map(t => t.id === id ? { ...t, syncedToGoogle: true } : t));
      } else {
          setCalendarEvents(prev => prev.map(e => e.id === id ? { ...e, syncedToGoogle: true } : e));
      }
  };

  return (
    <CRMContext.Provider value={{
      leads, addLead, updateLeadStatus,
      statuses, addStatus,
      customFields, addCustomField,
      tasks, addTask, toggleTask,
      automations, addAutomation,
      users,
      landingPages, addLandingPage, updateLandingPage, deleteLandingPage,
      meetingTypes, addMeetingType, calendarEvents, isGoogleCalendarConnected, toggleGoogleCalendar,
      syncToGoogle
    }}>
      {children}
    </CRMContext.Provider>
  );
};

export const useCRM = () => {
  const context = useContext(CRMContext);
  if (!context) throw new Error('useCRM must be used within a CRMProvider');
  return context;
};
