import React from 'react';
import { useCRM } from '../context/CRMContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, CheckCircle, Clock } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { leads, tasks } = useCRM();

  // Stats calculation
  const newLeadsToday = leads.filter(l => new Date(l.createdAt).toDateString() === new Date().toDateString()).length;
  const activeLeads = leads.filter(l => l.statusId !== 'closed_lost' && l.statusId !== 'closed_won').length;
  const pendingTasks = tasks.filter(t => !t.completed).length;
  
  // Data for charts
  const statusData = leads.reduce((acc: any[], curr) => {
    const existing = acc.find(i => i.name === curr.statusId);
    if (existing) existing.value++;
    else acc.push({ name: curr.statusId, value: 1 });
    return acc;
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const StatCard = ({ title, value, icon, color }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
       <div>
         <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
         <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
       </div>
       <div className={`p-3 rounded-lg ${color}`}>
         {icon}
       </div>
    </div>
  );

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-end">
         <div>
            <h1 className="text-3xl font-bold text-gray-900">דשבורד ראשי</h1>
            <p className="text-gray-500 mt-1">סקירה כללית של הפעילות העסקית שלך</p>
         </div>
         <div className="flex gap-2">
            <select className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 outline-none">
                <option>היום</option>
                <option>השבוע</option>
                <option>החודש</option>
            </select>
         </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="לידים חדשים היום" value={newLeadsToday} icon={<Users size={24} className="text-blue-600" />} color="bg-blue-50" />
          <StatCard title="לידים בטיפול" value={activeLeads} icon={<TrendingUp size={24} className="text-purple-600" />} color="bg-purple-50" />
          <StatCard title="משימות פתוחות" value={pendingTasks} icon={<Clock size={24} className="text-orange-600" />} color="bg-orange-50" />
          <StatCard title="יחס המרה" value="12%" icon={<CheckCircle size={24} className="text-green-600" />} color="bg-green-50" />
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
            <h3 className="text-lg font-bold text-gray-800 mb-4">מגמת לידים (7 ימים אחרונים)</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[{name: 'א', val: 4}, {name: 'ב', val: 7}, {name: 'ג', val: 3}, {name: 'ד', val: 8}, {name: 'ה', val: 12}, {name: 'ו', val: 5}, {name: 'ש', val: 2}]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Bar dataKey="val" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
             <h3 className="text-lg font-bold text-gray-800 mb-4">התפלגות סטטוסים</h3>
             <div className="h-64 w-full flex justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
             </div>
             <div className="space-y-2 mt-4">
                {statusData.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[i % COLORS.length]}}></div>
                            <span className="text-gray-600 capitalize">{item.name.replace('_', ' ')}</span>
                        </div>
                        <span className="font-medium text-gray-800">{item.value}</span>
                    </div>
                ))}
             </div>
          </div>
       </div>
    </div>
  );
};
