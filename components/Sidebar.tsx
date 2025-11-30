import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAV_ITEMS, FUTURE_MODULES } from '../constants';

export const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-white h-screen border-l border-gray-200 flex flex-col fixed right-0 top-0 z-10 shadow-sm transition-all duration-300">
      <div className="p-6 flex items-center gap-3 border-b border-gray-100">
        <div className="bg-gradient-to-tr from-purple-500 to-pink-500 p-2 rounded-xl text-white shadow-lg shadow-purple-200">
            {/* VIVI Butterfly Logo */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 12c-2-3-5-3-7-1s-3 5-1 7c2 2 5 2 8 0"/>
                <path d="M12 12c2-3 5-3 7-1s3 5 1 7c-2 2-5 2-8 0"/>
                <path d="M12 12c-1.5-2.5-4-3-6-1.5S3 14 5 15.5"/>
                <path d="M12 12c1.5-2.5 4-3 6-1.5S21 14 19 15.5"/>
            </svg>
        </div>
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-l from-purple-600 to-pink-600 tracking-tight">VIVI CRM</h1>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-2">
          תפריט ראשי
        </p>
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                ${isActive 
                  ? 'bg-purple-50 text-purple-700 font-medium shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
            >
              <span className={`${isActive ? 'text-purple-600' : 'text-gray-400 group-hover:text-gray-600'}`}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}

        <div className="border-t border-gray-100 my-4 pt-4">
          <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            מודולים נוספים (בקרוב)
          </p>
          {FUTURE_MODULES.map((mod) => (
            <div key={mod.id} className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 cursor-not-allowed opacity-70">
              {mod.icon}
              <span>{mod.label}</span>
            </div>
          ))}
        </div>
      </nav>
      
      <div className="p-4 border-t border-gray-100">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-4 text-white">
          <p className="text-sm font-medium mb-1">זקוק לעזרה?</p>
          <p className="text-xs opacity-90 mb-3">צור קשר עם התמיכה הטכנית</p>
          <button className="w-full bg-white/20 hover:bg-white/30 text-white text-xs py-2 rounded-lg transition">
            פתח קריאה
          </button>
        </div>
      </div>
    </div>
  );
};