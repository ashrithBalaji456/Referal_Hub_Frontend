import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  FileUp, 
  Mail, 
  History 
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, profile, onOpenProfile, onLogout }) {
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

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium hover:bg-red-500/10 text-slate-400 hover:text-red-400 border border-transparent transition-all duration-200 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-slate-400 group-hover:text-red-400"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Logout
          </button>
        </nav>
      </div>

      <button 
        onClick={onOpenProfile}
        className="p-6 border-t border-slate-900 bg-slate-950/50 flex items-center justify-between gap-3 text-left hover:bg-slate-900/50 transition-colors w-full cursor-pointer group"
      >
        <div className="flex flex-col gap-1 truncate">
          <span className="text-xs text-slate-500 font-medium group-hover:text-purple-400 transition-colors">Candidate Profiler</span>
          <span className="text-sm font-semibold text-slate-300 truncate">{profile?.fullName || 'Ashrith Balaji Gudla'}</span>
          <span className="text-xs text-purple-500 font-medium truncate">{profile?.roleName || 'Java Backend Developer'}</span>
        </div>
        <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 text-slate-400 group-hover:text-white transition-colors shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
        </div>
      </button>
    </aside>
  );
}
