import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  FileUp, 
  Mail, 
  History 
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'recruiters', label: 'Recruiters', icon: Users },
    { id: 'templates', label: 'Templates', icon: FileText },
    { id: 'resumes', label: 'Resumes', icon: FileUp },
    { id: 'campaigns', label: 'Campaigns', icon: Mail },
    { id: 'history', label: 'History', icon: History },
  ];

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between h-screen fixed left-0 top-0 text-slate-300">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Mail className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-md font-bold text-white tracking-wide">Referral Outreach</h1>
            <span className="text-xs text-purple-400 font-semibold uppercase tracking-wider">Manager</span>
          </div>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group ${
                  isActive 
                    ? 'bg-purple-600/10 text-purple-400 border border-purple-600/20' 
                    : 'hover:bg-slate-900 text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                <Icon className={`h-4 w-4 transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? 'text-purple-400' : 'text-slate-400 group-hover:text-slate-300'
                }`} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-6 border-t border-slate-900 bg-slate-950/50 flex flex-col gap-1">
        <span className="text-xs text-slate-500">Candidate Profiler</span>
        <span className="text-sm font-semibold text-slate-300">Ashrith Balaji Gudla</span>
        <span className="text-xs text-purple-500 font-medium">Java Backend Developer</span>
      </div>
    </aside>
  );
}
