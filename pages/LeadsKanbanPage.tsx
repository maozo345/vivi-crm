import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { LeadFormModal } from '../components/LeadFormModal';
import { Plus, Phone, Calendar, Search, Filter, Download, MoreVertical } from 'lucide-react';

export const LeadsKanbanPage: React.FC = () => {
  const { leads, statuses, updateLeadStatus } = useCRM();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    setDraggedLeadId(leadId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, statusId: string) => {
    e.preventDefault();
    if (draggedLeadId) {
      updateLeadStatus(draggedLeadId, statusId);
      setDraggedLeadId(null);
    }
  };

  const filteredLeads = leads.filter(l => 
    l.name.includes(searchTerm) || l.phone.includes(searchTerm) || l.email.includes(searchTerm)
  );

  const downloadCSV = (statusId: string | 'all') => {
    const leadsToExport = statusId === 'all' 
        ? leads 
        : leads.filter(l => l.statusId === statusId);

    const headers = ['ID', 'שם', 'טלפון', 'אימייל', 'סטטוס', 'מקור', 'תאריך יצירה', 'תגיות'];
    const csvContent = [
        headers.join(','),
        ...leadsToExport.map(l => {
            const statusName = statuses.find(s => s.id === l.statusId)?.name || l.statusId;
            return [
                l.id,
                `"${l.name}"`,
                `"${l.phone}"`,
                l.email,
                statusName,
                l.source,
                new Date(l.createdAt).toLocaleDateString('he-IL'),
                `"${l.tags.join(';')}"`
            ].join(',');
        })
    ].join('\n');

    // Add BOM for Hebrew support in Excel
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `leads_export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowExportMenu(false);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">ניהול לידים</h1>
           <p className="text-gray-500 text-sm">גרירה ושחרור לניהול תהליך המכירה</p>
        </div>
        <div className="flex gap-3">
           <div className="relative">
             <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
             <input 
                type="text" 
                placeholder="חיפוש ליד..." 
                className="pl-4 pr-10 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>
           
           <div className="relative">
                <button 
                    onClick={() => setShowExportMenu(!showExportMenu)}
                    className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition"
                >
                    <Download size={18} />
                    <span>ייצוא CSV</span>
                </button>
                {showExportMenu && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-50 py-1">
                        <button onClick={() => downloadCSV('all')} className="w-full text-right px-4 py-2 hover:bg-gray-50 text-sm text-gray-700">הכל</button>
                        <div className="h-px bg-gray-100 my-1"></div>
                        {statuses.map(s => (
                             <button key={s.id} onClick={() => downloadCSV(s.id)} className="w-full text-right px-4 py-2 hover:bg-gray-50 text-sm text-gray-700">
                                רק {s.name}
                             </button>
                        ))}
                    </div>
                )}
           </div>

           <button 
             onClick={() => setIsModalOpen(true)}
             className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium shadow-lg shadow-purple-200"
           >
             <Plus size={20} />
             <span>ליד חדש</span>
           </button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
        <div className="flex gap-4 h-full min-w-max">
          {statuses.map((status) => (
            <div 
                key={status.id}
                className="w-80 flex-shrink-0 flex flex-col bg-gray-100/50 rounded-xl border border-gray-200/60"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, status.id)}
            >
              {/* Column Header */}
              <div className={`p-4 rounded-t-xl border-b border-gray-200 flex justify-between items-center ${status.color.split(' ')[0]} bg-opacity-30`}>
                <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${status.color.replace('bg-', 'bg-').replace('text-', 'bg-').split(' ')[1]}`}></span>
                    <h3 className="font-bold text-gray-800">{status.name}</h3>
                </div>
                <span className="text-xs font-semibold bg-white/50 px-2 py-1 rounded-md text-gray-600">
                    {filteredLeads.filter(l => l.statusId === status.id).length}
                </span>
              </div>

              {/* Column Content */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                {filteredLeads.filter(l => l.statusId === status.id).map(lead => (
                  <div 
                    key={lead.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, lead.id)}
                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-move group relative"
                  >
                    <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity">
                         <MoreVertical size={16} className="text-gray-400 cursor-pointer" />
                    </div>

                    <div className="flex justify-between items-start mb-2">
                         <h4 className="font-bold text-gray-800">{lead.name}</h4>
                    </div>

                    <div className="space-y-2 mb-3">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Phone size={12} />
                            <span>{lead.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Calendar size={12} />
                            <span>{new Date(lead.createdAt).toLocaleDateString('he-IL')}</span>
                        </div>
                    </div>

                    {/* Custom Values Preview */}
                    <div className="flex flex-wrap gap-1 mt-2">
                        {lead.tags.map(tag => (
                            <span key={tag} className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium">
                                {tag}
                            </span>
                        ))}
                         <span className="text-[10px] bg-gray-50 text-gray-600 px-2 py-0.5 rounded-full border border-gray-200">
                                {lead.source}
                         </span>
                    </div>
                  </div>
                ))}
                {filteredLeads.filter(l => l.statusId === status.id).length === 0 && (
                    <div className="h-full flex items-center justify-center text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg min-h-[100px]">
                        גרור לכאן
                    </div>
                )}
              </div>
            </div>
          ))}
          
          {/* Add Column Button */}
          <div className="w-12 h-full flex flex-col items-center pt-2">
                <button className="p-2 rounded-full hover:bg-gray-200 text-gray-400 transition">
                    <Plus size={24} />
                </button>
          </div>
        </div>
      </div>

      <LeadFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};