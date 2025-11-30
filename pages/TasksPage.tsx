import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { CheckSquare, Square, Calendar, User as UserIcon, Flag, Plus, X } from 'lucide-react';
import { Priority } from '../types';

export const TasksPage: React.FC = () => {
  const { tasks, toggleTask, users, leads, addTask } = useCRM();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [relatedLeadId, setRelatedLeadId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTask({
        title,
        dueDate: dueDate || new Date().toISOString(),
        completed: false,
        priority,
        assignedTo: assignedTo || undefined,
        relatedLeadId: relatedLeadId || undefined
    });
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDueDate('');
    setAssignedTo('');
    setPriority('medium');
    setRelatedLeadId('');
  };

  const getPriorityColor = (p: Priority) => {
    switch(p) {
        case 'high': return 'bg-red-100 text-red-600';
        case 'medium': return 'bg-orange-100 text-orange-600';
        case 'low': return 'bg-blue-100 text-blue-600';
    }
  };

  const getPriorityLabel = (p: Priority) => {
    switch(p) {
        case 'high': return 'גבוה';
        case 'medium': return 'בינוני';
        case 'low': return 'נמוך';
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <div>
                 <h1 className="text-3xl font-bold text-gray-900">המשימות שלי</h1>
                 <p className="text-gray-500">עקוב אחר ביצועים ומטלות פתוחות</p>
            </div>
            <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
            >
                <Plus size={20} />
                משימה חדשה
            </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[400px]">
            {tasks.length === 0 ? (
                <div className="p-12 text-center text-gray-400 flex flex-col items-center justify-center h-full">
                    <CheckSquare size={48} className="mx-auto mb-4 opacity-50" />
                    <p>אין משימות פתוחות. איזה כיף!</p>
                </div>
            ) : (
                <div className="divide-y divide-gray-100">
                    {tasks.map(task => {
                        const assignee = users.find(u => u.id === task.assignedTo);
                        return (
                            <div key={task.id} className="p-4 flex items-center hover:bg-gray-50 transition group">
                                <button 
                                    onClick={() => toggleTask(task.id)}
                                    className={`ml-4 transition-colors ${task.completed ? 'text-green-500' : 'text-gray-300 hover:text-purple-500'}`}
                                >
                                    {task.completed ? <CheckSquare size={24} /> : <Square size={24} />}
                                </button>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className={`font-medium text-gray-800 ${task.completed ? 'line-through text-gray-400' : ''}`}>
                                            {task.title}
                                        </h3>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getPriorityColor(task.priority)}`}>
                                            {getPriorityLabel(task.priority)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <Calendar size={12} />
                                            <span>{new Date(task.dueDate).toLocaleDateString('he-IL')}</span>
                                        </div>
                                        {assignee && (
                                            <div className="flex items-center gap-1" title={assignee.name}>
                                                <img src={assignee.avatar} alt={assignee.name} className="w-4 h-4 rounded-full" />
                                                <span>{assignee.name}</span>
                                            </div>
                                        )}
                                        {task.relatedLeadId && (
                                            <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                                                ליד מקושר
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>

        {/* Create Task Modal */}
        {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50">
                        <h3 className="font-bold text-lg text-gray-800">משימה חדשה</h3>
                        <button onClick={() => setIsModalOpen(false)}><X size={20} className="text-gray-400 hover:text-gray-600" /></button>
                    </div>
                    <form onSubmit={handleSubmit} className="p-5 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">נושא המשימה</label>
                            <input 
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" 
                                placeholder="לדוגמה: לחזור ללקוח"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">תאריך יעד</label>
                                <input 
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">עדיפות</label>
                                <select 
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value as Priority)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" 
                                >
                                    <option value="low">נמוך</option>
                                    <option value="medium">בינוני</option>
                                    <option value="high">גבוה</option>
                                </select>
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">הקצאה לנציג</label>
                            <select 
                                value={assignedTo}
                                onChange={(e) => setAssignedTo(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" 
                            >
                                <option value="">ללא הקצאה</option>
                                {users.map(u => (
                                    <option key={u.id} value={u.id}>{u.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">קשר לליד (אופציונלי)</label>
                            <select 
                                value={relatedLeadId}
                                onChange={(e) => setRelatedLeadId(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" 
                            >
                                <option value="">ללא ליד</option>
                                {leads.map(l => (
                                    <option key={l.id} value={l.id}>{l.name} - {l.phone}</option>
                                ))}
                            </select>
                        </div>

                        <div className="pt-2 flex justify-end gap-2">
                             <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">ביטול</button>
                             <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">צור משימה</button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
};