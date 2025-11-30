
import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { Calendar, Clock, Link as LinkIcon, Copy, Check, Plus, Video, RefreshCw, AlertCircle, ExternalLink } from 'lucide-react';

export const CalendarPage: React.FC = () => {
  const { meetingTypes, addMeetingType, isGoogleCalendarConnected, toggleGoogleCalendar, calendarEvents, tasks, syncToGoogle } = useCRM();
  const [activeTab, setActiveTab] = useState<'schedule' | 'types'>('types');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New Meeting Type Form
  const [newType, setNewType] = useState({ title: '', duration: 30, description: '' });
  const [showAddModal, setShowAddModal] = useState(false);

  const handleCopy = (id: string, slug: string) => {
    navigator.clipboard.writeText(`https://cal.vivicrm.com/meet/user/${slug}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddType = (e: React.FormEvent) => {
      e.preventDefault();
      addMeetingType({
          title: newType.title,
          duration: newType.duration,
          description: newType.description,
          active: true,
          slug: newType.title.toLowerCase().replace(/ /g, '-') + '-' + Math.floor(Math.random() * 1000)
      });
      setShowAddModal(false);
      setNewType({ title: '', duration: 30, description: '' });
  };

  const generateGoogleCalendarUrl = (title: string, date: Date, description: string = '') => {
      const start = date.toISOString().replace(/-|:|\.\d\d\d/g, "");
      // End time is start + 1 hour by default for tasks
      const endDate = new Date(date.getTime() + 60 * 60 * 1000);
      const end = endDate.toISOString().replace(/-|:|\.\d\d\d/g, "");
      
      const details = encodeURIComponent(description || 'נוצר על ידי VIVI CRM');
      const location = encodeURIComponent('Online');
      
      return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=${details}&location=${location}`;
  };

  const handleSyncClick = (id: string, type: 'task' | 'event', title: string, date: Date) => {
      // Mark as synced in local state
      syncToGoogle(id, type);
      
      // Open Google Calendar in new tab with pre-filled details
      const url = generateGoogleCalendarUrl(title, date);
      window.open(url, '_blank');
  };

  const allEvents = [
      ...calendarEvents.map(e => ({...e, date: new Date(e.start), kind: 'event' as const})),
      ...tasks.filter(t => !t.completed && t.dueDate).map(t => ({
          id: t.id,
          title: t.title,
          start: t.dueDate,
          end: t.dueDate,
          type: 'task' as const,
          date: new Date(t.dueDate),
          kind: 'task' as const,
          syncedToGoogle: t.syncedToGoogle,
          attendees: []
      }))
  ].sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">יומן ופגישות</h1>
          <p className="text-gray-500">נהל את הלו"ז שלך וסנכרן עם Google Calendar</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-lg">
             <button 
                onClick={() => setActiveTab('types')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'types' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
             >
                סוגי פגישות
             </button>
             <button 
                onClick={() => setActiveTab('schedule')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'schedule' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
             >
                הלו"ז שלי
             </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Main Content Area */}
         <div className="lg:col-span-2 space-y-8">
            
            {/* Integration Status Card */}
            <div className={`rounded-xl border p-6 flex items-center justify-between transition-colors ${isGoogleCalendarConnected ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100">
                        {/* Google Logo Placeholder */}
                        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">Google Calendar</h3>
                        <p className="text-sm text-gray-500">
                            {isGoogleCalendarConnected ? 'מחובר ומסונכרן אוטומטית' : 'חבר את היומן לסנכרון פגישות דו-כיווני'}
                        </p>
                    </div>
                </div>
                <button 
                    onClick={toggleGoogleCalendar}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                        isGoogleCalendarConnected 
                        ? 'bg-white text-red-600 border border-red-100 hover:bg-red-50' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                >
                    {isGoogleCalendarConnected ? 'התנתק' : 'התחבר עכשיו'}
                </button>
            </div>

            {/* Content Tabs */}
            {activeTab === 'types' && (
                <div className="animate-in fade-in duration-300">
                     <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-800 text-lg">סוגי פגישות</h3>
                        <button 
                            onClick={() => setShowAddModal(true)}
                            className="text-purple-600 text-sm font-medium hover:bg-purple-50 px-3 py-1.5 rounded-lg transition flex items-center gap-1"
                        >
                            <Plus size={16} />
                            סוג פגישה חדש
                        </button>
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {meetingTypes.map(type => (
                            <div key={type.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition group">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-gray-900">{type.title}</h4>
                                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                        <Clock size={12} />
                                        {type.duration} דק'
                                    </span>
                                </div>
                                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{type.description}</p>
                                
                                <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-2">
                                    <button className="text-gray-400 hover:text-gray-600 text-sm">עריכה</button>
                                    <button 
                                        onClick={() => handleCopy(type.id, type.slug)}
                                        className="flex items-center gap-2 text-purple-600 font-medium text-sm hover:text-purple-700 bg-purple-50 px-3 py-1.5 rounded-lg transition"
                                    >
                                        {copiedId === type.id ? <Check size={16} /> : <LinkIcon size={16} />}
                                        {copiedId === type.id ? 'הועתק!' : 'העתק קישור'}
                                    </button>
                                </div>
                            </div>
                        ))}
                     </div>
                </div>
            )}

            {activeTab === 'schedule' && (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-in fade-in duration-300">
                    <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                        <h3 className="font-bold text-gray-800">היומן שלי</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                             <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-purple-500"></div> פגישה</span>
                             <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-orange-500"></div> משימה</span>
                        </div>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {allEvents.length === 0 ? (
                            <div className="p-8 text-center text-gray-400">היומן שלך ריק להיום.</div>
                        ) : (
                            allEvents.map((event, idx) => (
                                <div key={idx} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition group">
                                    <div className="text-center min-w-[50px]">
                                        <span className="block text-xs text-gray-500 font-bold uppercase">{event.date.toLocaleDateString('en-US', {weekday: 'short'})}</span>
                                        <span className="block text-xl font-bold text-gray-800">{event.date.getDate()}</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-gray-800">{event.title}</h4>
                                            <span className="text-xs text-gray-500">{event.date.toLocaleTimeString('he-IL', {hour: '2-digit', minute:'2-digit'})}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full text-white ${event.type === 'meeting' ? 'bg-purple-500' : 'bg-orange-500'}`}>
                                                {event.type === 'meeting' ? 'פגישה' : 'משימה'}
                                            </span>
                                            {event.type === 'meeting' && (
                                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                                    <Video size={12} />
                                                    Zoom Meeting
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Sync Button */}
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => handleSyncClick(event.id, event.kind, event.title, event.date)}
                                            className={`p-2 rounded-lg transition border flex items-center gap-2 text-xs font-medium ${
                                                event.syncedToGoogle 
                                                ? 'text-green-600 bg-green-50 border-green-200' 
                                                : 'text-gray-600 bg-white border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200'
                                            }`}
                                            title={event.syncedToGoogle ? "מסונכרן עם Google Calendar" : "הוסף ל-Google Calendar"}
                                        >
                                            {event.syncedToGoogle ? (
                                                <>
                                                    <Check size={14} />
                                                    <span>סונכרן</span>
                                                </>
                                            ) : (
                                                <>
                                                    <ExternalLink size={14} />
                                                    <span>הוסף ליומן</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
         </div>

         {/* Sidebar / Help */}
         <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg">
                <h3 className="font-bold text-lg mb-2">הטמעת יומן באתר</h3>
                <p className="text-indigo-100 text-sm mb-4">
                    ניתן להטמיע את יומן הפגישות שלך ישירות באתר האינטרנט שלך כדי שלקוחות יוכלו לקבוע פגישות באופן עצמאי.
                </p>
                <button className="w-full bg-white/20 hover:bg-white/30 text-white py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2">
                    <Copy size={16} />
                    העתק קוד הטמעה
                </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-4">טיפ לניהול זמן</h3>
                <p className="text-gray-600 text-sm mb-2">
                    לחיצה על כפתור "הוסף ליומן" תפתח את יומן גוגל עם פרטי הפגישה מוכנים לשמירה מיידית.
                </p>
                <div className="flex items-center gap-2 text-purple-600 text-sm font-medium cursor-pointer mt-2 hover:underline">
                    <RefreshCw size={14} />
                    בדוק סנכרון כעת
                </div>
            </div>
         </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
                <h3 className="font-bold text-lg text-gray-900 mb-4">יצירת סוג פגישה חדש</h3>
                <form onSubmit={handleAddType} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">כותרת הפגישה</label>
                        <input 
                            required
                            value={newType.title}
                            onChange={(e) => setNewType({...newType, title: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                            placeholder="לדוגמה: שיחת ייעוץ"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">משך זמן (דקות)</label>
                        <select
                            value={newType.duration}
                            onChange={(e) => setNewType({...newType, duration: parseInt(e.target.value)})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                        >
                            <option value={15}>15 דקות</option>
                            <option value={30}>30 דקות</option>
                            <option value={45}>45 דקות</option>
                            <option value={60}>60 דקות</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">תיאור קצר</label>
                        <textarea 
                            value={newType.description}
                            onChange={(e) => setNewType({...newType, description: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none h-20 resize-none"
                            placeholder="מה הלקוח צריך להכין לפגישה?"
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">ביטול</button>
                        <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">שמור</button>
                    </div>
                </form>
            </div>
          </div>
      )}
    </div>
  );
};
