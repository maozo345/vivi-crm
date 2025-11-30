import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { Plus, Trash2, Edit } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { customFields, addCustomField, statuses, addStatus } = useCRM();
  const [activeTab, setActiveTab] = useState<'fields' | 'statuses'>('fields');
  
  // Field Form State
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldType, setNewFieldType] = useState('text');

  // Status Form State
  const [newStatusName, setNewStatusName] = useState('');

  const handleAddField = () => {
    if(!newFieldLabel) return;
    addCustomField({
        id: Math.random().toString(36).substr(2, 9),
        label: newFieldLabel,
        type: newFieldType as any
    });
    setNewFieldLabel('');
  };

  const handleAddStatus = () => {
    if(!newStatusName) return;
    addStatus(newStatusName, 'bg-gray-100 text-gray-800 border-gray-200');
    setNewStatusName('');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">הגדרות מערכת</h1>
      <p className="text-gray-500 mb-8">התאם את המערכת לצרכים העסקיים שלך</p>

      <div className="flex gap-6 mb-8 border-b border-gray-200">
        <button 
            onClick={() => setActiveTab('fields')}
            className={`pb-4 px-2 font-medium transition-colors relative ${activeTab === 'fields' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
            שדות מותאמים אישית
            {activeTab === 'fields' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></span>}
        </button>
        <button 
            onClick={() => setActiveTab('statuses')}
            className={`pb-4 px-2 font-medium transition-colors relative ${activeTab === 'statuses' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
            ניהול סטטוסים
            {activeTab === 'statuses' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></span>}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[400px]">
        
        {activeTab === 'fields' && (
            <div className="animate-in fade-in duration-300">
                <div className="flex items-end gap-4 mb-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">שם השדה</label>
                        <input 
                            value={newFieldLabel}
                            onChange={(e) => setNewFieldLabel(e.target.value)}
                            placeholder="לדוגמה: תקציב משוער"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="w-48">
                        <label className="block text-sm font-medium text-gray-700 mb-1">סוג שדה</label>
                        <select 
                            value={newFieldType}
                            onChange={(e) => setNewFieldType(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                        >
                            <option value="text">טקסט</option>
                            <option value="number">מספר</option>
                            <option value="date">תאריך</option>
                            <option value="select">רשימה</option>
                        </select>
                    </div>
                    <button 
                        onClick={handleAddField}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                    >
                        <Plus size={18} /> הוסף שדה
                    </button>
                </div>

                <div className="space-y-3">
                    {customFields.map((field) => (
                        <div key={field.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:border-blue-200 hover:bg-blue-50/30 transition">
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                                    <Edit size={16} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800">{field.label}</h4>
                                    <p className="text-xs text-gray-500 capitalize">{field.type}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="text-gray-400 hover:text-red-500 transition">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {activeTab === 'statuses' && (
             <div className="animate-in fade-in duration-300">
                 <div className="flex items-end gap-4 mb-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">שם הסטטוס</label>
                        <input 
                            value={newStatusName}
                            onChange={(e) => setNewStatusName(e.target.value)}
                            placeholder="לדוגמה: מחכה לאישור"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                        />
                    </div>
                    <button 
                        onClick={handleAddStatus}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                    >
                        <Plus size={18} /> הוסף סטטוס
                    </button>
                 </div>

                 <div className="space-y-2">
                    {statuses.map((status, index) => (
                        <div key={status.id} className="flex items-center p-3 border border-gray-100 rounded-lg bg-white">
                             <span className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded text-xs font-bold text-gray-500 ml-4">
                                {index + 1}
                             </span>
                             <div className={`px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                                {status.name}
                             </div>
                             <div className="mr-auto">
                                <button className="text-gray-400 hover:text-red-500 transition">
                                    <Trash2 size={18} />
                                </button>
                             </div>
                        </div>
                    ))}
                 </div>
             </div>
        )}

      </div>
    </div>
  );
};
