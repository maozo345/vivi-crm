import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { Copy, Code, Check } from 'lucide-react';

export const FormsPage: React.FC = () => {
  const { customFields } = useCRM();
  const [copied, setCopied] = useState(false);
  
  const [formConfig, setFormConfig] = useState({
    title: 'טופס יצירת קשר',
    showName: true,
    showPhone: true,
    showEmail: true,
    customFields: [] as string[]
  });

  const toggleField = (fieldId: string) => {
    setFormConfig(prev => {
        if (prev.customFields.includes(fieldId)) {
            return { ...prev, customFields: prev.customFields.filter(f => f !== fieldId) };
        } else {
            return { ...prev, customFields: [...prev.customFields, fieldId] };
        }
    });
  };

  const generateEmbedCode = () => {
    const fieldsParam = [
        formConfig.showName ? 'name' : '',
        formConfig.showPhone ? 'phone' : '',
        formConfig.showEmail ? 'email' : '',
        ...formConfig.customFields
    ].filter(Boolean).join(',');

    return `<script src="https://cdn.vivicrm.com/widget.js" 
  data-key="pk_live_5123456789" 
  data-title="${formConfig.title}" 
  data-fields="${fieldsParam}">
</script>`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateEmbedCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
        <div>
            <h1 className="text-3xl font-bold text-gray-900">טפסים ואינטגרציות</h1>
            <p className="text-gray-500">חבר את האתר שלך למערכת VIVI CRM בקלות</p>
        </div>

        {/* API Credentials Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Code size={20} className="text-purple-600" />
                מפתחות API
            </h3>
            <p className="text-sm text-gray-600 mb-4">השתמש במפתחות אלו כדי לחבר את האתר שלך ישירות ל-API שלנו.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">API Endpoint</label>
                    <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600 font-mono border border-gray-200 select-all">
                        https://api.vivicrm.com/v1/leads
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Public Key</label>
                    <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-800 font-mono border border-gray-200 flex justify-between items-center">
                        <span>pk_live_5123456789_abcdef</span>
                        <Copy size={14} className="cursor-pointer text-gray-400 hover:text-gray-600" />
                    </div>
                </div>
            </div>
        </div>

        {/* Form Builder Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4">מחולל טפסים</h3>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">כותרת הטופס</label>
                        <input 
                            value={formConfig.title}
                            onChange={(e) => setFormConfig({...formConfig, title: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">שדות בסיס</label>
                        <div className="flex gap-4">
                             <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                <input type="checkbox" checked={formConfig.showName} onChange={(e) => setFormConfig({...formConfig, showName: e.target.checked})} className="rounded text-purple-600 focus:ring-purple-500" />
                                שם מלא
                             </label>
                             <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                <input type="checkbox" checked={formConfig.showPhone} onChange={(e) => setFormConfig({...formConfig, showPhone: e.target.checked})} className="rounded text-purple-600 focus:ring-purple-500" />
                                טלפון
                             </label>
                             <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                <input type="checkbox" checked={formConfig.showEmail} onChange={(e) => setFormConfig({...formConfig, showEmail: e.target.checked})} className="rounded text-purple-600 focus:ring-purple-500" />
                                אימייל
                             </label>
                        </div>
                    </div>

                    {customFields.length > 0 && (
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">שדות מותאמים אישית</label>
                            <div className="grid grid-cols-2 gap-2">
                                {customFields.map(field => (
                                    <label key={field.id} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            checked={formConfig.customFields.includes(field.id)} 
                                            onChange={() => toggleField(field.id)}
                                            className="rounded text-purple-600 focus:ring-purple-500" 
                                        />
                                        {field.label}
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-8">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-semibold text-gray-700">קוד הטמעה</label>
                        <button 
                            onClick={handleCopy}
                            className="text-xs flex items-center gap-1 text-purple-600 hover:text-purple-700 font-medium"
                        >
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                            {copied ? 'הועתק!' : 'העתק קוד'}
                        </button>
                    </div>
                    <div className="bg-gray-900 text-gray-300 p-4 rounded-lg font-mono text-xs overflow-x-auto relative group">
                        <pre>{generateEmbedCode()}</pre>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">הדבק קוד זה באתר שלך (WordPress, Wix, או HTML) להצגת הטופס.</p>
                </div>
            </div>

            {/* Live Preview */}
            <div className="bg-gray-50 p-6 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-full max-w-sm bg-white shadow-lg rounded-xl overflow-hidden">
                    <div className="bg-purple-600 p-4 text-white">
                        <h4 className="font-bold text-lg text-center">{formConfig.title}</h4>
                    </div>
                    <div className="p-6 space-y-4">
                        {formConfig.showName && (
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-500">שם מלא</label>
                                <div className="h-8 bg-gray-100 rounded border border-gray-200"></div>
                            </div>
                        )}
                        {formConfig.showPhone && (
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-500">טלפון</label>
                                <div className="h-8 bg-gray-100 rounded border border-gray-200"></div>
                            </div>
                        )}
                        {formConfig.showEmail && (
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-500">אימייל</label>
                                <div className="h-8 bg-gray-100 rounded border border-gray-200"></div>
                            </div>
                        )}
                        {formConfig.customFields.map(fid => {
                            const field = customFields.find(f => f.id === fid);
                            return field ? (
                                <div key={fid} className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500">{field.label}</label>
                                    <div className="h-8 bg-gray-100 rounded border border-gray-200"></div>
                                </div>
                            ) : null;
                        })}
                        <div className="pt-2">
                            <button className="w-full bg-purple-600 text-white py-2 rounded-lg text-sm font-medium opacity-90">שלח פרטים</button>
                        </div>
                    </div>
                </div>
                <p className="text-sm text-gray-400 mt-4">תצוגה מקדימה</p>
            </div>
        </div>
    </div>
  );
};