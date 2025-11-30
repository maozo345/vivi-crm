
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCRM } from '../context/CRMContext';
import { Plus, Layout, ExternalLink, Edit, Trash2, Eye } from 'lucide-react';

export const LandingPagesList: React.FC = () => {
  const { landingPages, deleteLandingPage } = useCRM();
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">דפי נחיתה</h1>
          <p className="text-gray-500">צור ונהל דפי נחיתה ממירים עם בינה מלאכותית</p>
        </div>
        <button 
          onClick={() => navigate('/landing-pages/new')}
          className="bg-purple-600 text-white px-5 py-2.5 rounded-xl hover:bg-purple-700 transition flex items-center gap-2 shadow-lg shadow-purple-200"
        >
          <Plus size={20} />
          דף חדש
        </button>
      </div>

      {landingPages.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm flex flex-col items-center">
             <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mb-4">
                <Layout size={32} className="text-purple-500" />
             </div>
             <h3 className="text-xl font-bold text-gray-900 mb-2">עדיין אין דפי נחיתה</h3>
             <p className="text-gray-500 mb-6 max-w-md">התחל לבנות דפי נחיתה מקצועיים בתוך דקות בעזרת כלי ה-AI שלנו.</p>
             <button 
                onClick={() => navigate('/landing-pages/new')}
                className="text-purple-600 font-medium hover:text-purple-700 hover:underline"
             >
                צור את הדף הראשון שלך &larr;
             </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {landingPages.map(page => (
                <div key={page.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all group">
                    <div className="h-40 bg-gray-100 relative overflow-hidden">
                        {page.sections.find(s => s.type === 'hero')?.content.imageUrl ? (
                             <img 
                                src={page.sections.find(s => s.type === 'hero')?.content.imageUrl} 
                                alt={page.name} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                             />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <Layout size={40} />
                            </div>
                        )}
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold shadow-sm">
                            {page.published ? '🟢 באוויר' : '⚪ טיוטה'}
                        </div>
                    </div>
                    
                    <div className="p-5">
                        <h3 className="font-bold text-lg text-gray-900 mb-1 truncate">{page.name}</h3>
                        <p className="text-gray-500 text-sm mb-4 line-clamp-2 h-10">
                            {page.sections.find(s => s.type === 'hero')?.content.headline || 'ללא כותרת'}
                        </p>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => navigate(`/landing-pages/edit/${page.id}`)}
                                    className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition" 
                                    title="ערוך"
                                >
                                    <Edit size={18} />
                                </button>
                                <button 
                                    onClick={() => deleteLandingPage(page.id)}
                                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition" 
                                    title="מחק"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                            <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium">
                                <ExternalLink size={16} />
                                צפה בדף
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      )}
    </div>
  );
};
