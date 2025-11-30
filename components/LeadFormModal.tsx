import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { X, Save } from 'lucide-react';
import { FieldType } from '../types';

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LeadFormModal: React.FC<LeadFormModalProps> = ({ isOpen, onClose }) => {
  const { addLead, customFields, statuses } = useCRM();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    source: '',
    statusId: statuses[0].id,
    customValues: {} as Record<string, any>
  });

  if (!isOpen) return null;

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCustomFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      customValues: {
        ...prev.customValues,
        [fieldId]: value
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addLead({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      source: formData.source || 'ידני',
      statusId: formData.statusId,
      customValues: formData.customValues,
      tags: []
    });
    onClose();
  };

  const renderInput = (label: string, value: string, onChange: (val: string) => void, type: string = 'text', required = false) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">הוספת ליד חדש</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 max-h-[80vh] overflow-y-auto">
          {renderInput('שם מלא', formData.name, (v) => handleChange('name', v), 'text', true)}
          <div className="grid grid-cols-2 gap-4">
            {renderInput('טלפון', formData.phone, (v) => handleChange('phone', v), 'tel', true)}
            {renderInput('אימייל', formData.email, (v) => handleChange('email', v), 'email')}
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">מקור הגעה</label>
                <select 
                    value={formData.source}
                    onChange={(e) => handleChange('source', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">בחר מקור...</option>
                    <option value="Facebook">פייסבוק</option>
                    <option value="Google">גוגל</option>
                    <option value="Instagram">אינסטגרם</option>
                    <option value="Referral">המלצה</option>
                    <option value="Website">אתר הבית</option>
                </select>
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">סטטוס התחלתי</label>
                <select 
                    value={formData.statusId}
                    onChange={(e) => handleChange('statusId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                    {statuses.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                </select>
             </div>
          </div>

          {/* Dynamic Fields Section */}
          {customFields.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">שדות מותאמים אישית</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {customFields.map(field => (
                  <div key={field.id} className="mb-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                    {field.type === 'select' ? (
                       <select
                        onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                       >
                         <option value="">בחר...</option>
                         {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                       </select>
                    ) : (
                      <input
                        type={field.type === 'number' ? 'number' : 'text'}
                        onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-end gap-3">
             <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition">
               ביטול
             </button>
             <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 shadow-lg shadow-blue-200 transition">
               <Save size={18} />
               שמור ליד
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};
