import React from 'react';
import { useCRM } from '../context/CRMContext';
import { Zap, ArrowLeft, Plus } from 'lucide-react';
import { AUTOMATION_ICONS } from '../constants';

export const AutomationsPage: React.FC = () => {
  const { automations } = useCRM();

  return (
    <div className="max-w-5xl mx-auto">
         <div className="flex justify-between items-center mb-8">
            <div>
                 <h1 className="text-3xl font-bold text-gray-900">אוטומציות</h1>
                 <p className="text-gray-500">הגדר תהליכים אוטומטיים לחיסכון בזמן</p>
            </div>
            <button className="bg-gradient-to-l from-purple-600 to-blue-600 text-white px-5 py-2.5 rounded-lg hover:shadow-lg hover:shadow-purple-200 transition font-medium flex items-center gap-2">
                <Plus size={20} />
                אוטומציה חדשה
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {automations.map(auto => (
                <div key={auto.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative group hover:border-blue-300 transition-all cursor-pointer">
                    <div className={`absolute top-4 left-4 w-3 h-3 rounded-full ${auto.active ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    
                    <div className="mb-4 bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center text-blue-600">
                        <Zap size={24} />
                    </div>

                    <h3 className="font-bold text-lg text-gray-900 mb-2">{auto.name}</h3>
                    
                    <div className="flex flex-col gap-2 relative">
                        {/* Visual Flow */}
                        <div className="flex items-center gap-3 p-2 bg-gray-50 rounded border border-gray-100">
                            <span className="text-xs font-bold text-gray-500 uppercase w-12">מתי?</span>
                            <span className="text-sm text-gray-800 font-medium">
                                {auto.trigger === 'LEAD_CREATED' ? 'נוצר ליד חדש' : 'סטטוס שונה'}
                            </span>
                        </div>
                        
                        <div className="mx-auto text-gray-300">
                            <ArrowLeft size={16} className="-rotate-90" />
                        </div>

                        <div className="flex items-center gap-3 p-2 bg-gray-50 rounded border border-gray-100">
                            <span className="text-xs font-bold text-gray-500 uppercase w-12">אז...</span>
                            <div className="flex items-center gap-2 text-sm text-gray-800 font-medium">
                                {AUTOMATION_ICONS[auto.action]}
                                <span>{auto.action === 'SEND_EMAIL' ? 'שלח אימייל' : 'צור משימה'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Empty State / Add New Card */}
            <button className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-500 transition hover:bg-blue-50/20">
                <Zap size={32} className="mb-2 opacity-50" />
                <span className="font-medium">צור תהליך עבודה חדש</span>
            </button>
        </div>
    </div>
  );
};
