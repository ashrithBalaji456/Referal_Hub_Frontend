import React, { useEffect, useState } from 'react';
import { recruiterApi, campaignApi, resumeApi, historyApi } from '../services/api';
import { 
  Users, 
  FileUp, 
  Send, 
  AlertCircle, 
  TrendingUp, 
  Clock 
} from 'lucide-react';

export default function Dashboard({ setActiveTab, showToast }) {
  const [stats, setStats] = useState({
    totalRecruiters: 0,
    activeRecruiters: 0,
    activeResume: 'None',
    activeCampaign: 'None',
    sentSuccess: 0,
    sentFailed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);

  const handleTriggerScheduler = async () => {
    try {
      setTriggering(true);
      await campaignApi.triggerScheduler();
      if (showToast) {
        showToast('Weekly outreach run initiated successfully in the background!');
      }
    } catch (err) {
      console.error(err);
      if (showToast) {
        showToast('Failed to trigger weekly outreach', 'error');
      }
    } finally {
      setTriggering(false);
    }
  };

  useEffect(() => {
    async function loadStats() {
      try {
        const [recruiterRes, campaignRes, resumeRes, historyRes] = await Promise.all([
          recruiterApi.getAll(),
          campaignApi.getAll(),
          resumeApi.getActive().catch(() => null),
          historyApi.getFiltered({}),
        ]);

        const recruiters = recruiterRes.data || [];
        const activeRecs = recruiters.filter(r => r.status === 'ACTIVE').length;
        const activeCamp = campaignRes.data?.find(c => c.enabled)?.name || 'None';
        const activeResName = resumeRes?.data?.originalFilename || 'None';

        const history = historyRes.data || [];
        const successCount = history.filter(h => h.status === 'SUCCESS').length;
        const failedCount = history.filter(h => h.status === 'FAILED').length;

        setStats({
          totalRecruiters: recruiters.length,
          activeRecruiters: activeRecs,
          activeResume: activeResName,
          activeCampaign: activeCamp,
          sentSuccess: successCount,
          sentFailed: failedCount,
        });
      } catch (err) {
        console.error('Failed to load dashboard statistics', err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const cards = [
    { label: 'Total Contacts', value: stats.totalRecruiters, desc: `${stats.activeRecruiters} Active`, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Active Campaign', value: stats.activeCampaign, desc: 'Enabled sequence', icon: Send, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Active Resume', value: stats.activeResume, desc: 'PDF attachment', icon: FileUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Sent Successfully', value: stats.sentSuccess, desc: 'Email dispatches', icon: TrendingUp, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { label: 'Failed Deliveries', value: stats.sentFailed, desc: 'SMTP Errors', icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-500/10' },
  ];

  return (
    <div className="space-y-8 animate-slide-in">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Welcome Back, Ashrith</h2>
        <p className="text-slate-400">Here is the latest status of your professional referral outreach pipeline.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex items-start gap-4 hover:border-slate-700 transition-colors duration-200">
              <div className={`p-3 rounded-xl ${card.bg}`}>
                <Icon className={`h-6 w-6 ${card.color}`} />
              </div>
              <div className="overflow-hidden">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{card.label}</span>
                <h3 className="text-2xl font-bold text-white mt-1 truncate">{card.value}</h3>
                <span className="text-xs text-slate-400 mt-1 block">{card.desc}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Quick Links</h3>
          <div className="space-y-3">
            <button 
              onClick={() => setActiveTab('recruiters')} 
              className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-900/50 transition-all duration-200 text-left group"
            >
              <div>
                <h4 className="text-sm font-semibold text-slate-200">Manage Recruiter Contacts</h4>
                <p className="text-xs text-slate-500 mt-0.5">Add, edit, or deactivate HR contacts.</p>
              </div>
              <span className="text-sm font-bold text-purple-400 group-hover:translate-x-1 transition-transform">→</span>
            </button>

            <button 
              onClick={() => setActiveTab('campaigns')} 
              className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-900/50 transition-all duration-200 text-left group"
            >
              <div>
                <h4 className="text-sm font-semibold text-slate-200">Configure Outreach Sequences</h4>
                <p className="text-xs text-slate-500 mt-0.5">Edit email templates and map campaigns.</p>
              </div>
              <span className="text-sm font-bold text-purple-400 group-hover:translate-x-1 transition-transform">→</span>
            </button>

            <button 
              onClick={() => setActiveTab('history')} 
              className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-900/50 transition-all duration-200 text-left group"
            >
              <div>
                <h4 className="text-sm font-semibold text-slate-200">Outreach Audit Logs</h4>
                <p className="text-xs text-slate-500 mt-0.5">Filter and check email delivery history.</p>
              </div>
              <span className="text-sm font-bold text-purple-400 group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-2">Automated Execution Details</h3>
            <p className="text-xs text-slate-400 mb-6">Weekly sequence schedules configured on the server.</p>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                <span className="text-sm text-slate-500">Scheduler Status</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                <span className="text-sm text-slate-500 flex items-center gap-2"><Clock className="h-4 w-4" /> Schedule</span>
                <span className="text-sm text-slate-300 font-semibold">Every Monday at 9:00 AM</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                <span className="text-sm text-slate-500">Contact Cooldown</span>
                <span className="text-sm text-slate-300 font-semibold">30 Days</span>
              </div>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            <button
              onClick={handleTriggerScheduler}
              disabled={triggering}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold transition-all duration-200 disabled:opacity-50 cursor-pointer"
            >
              {triggering ? 'Initiating...' : 'Run Campaign Outreach Now'}
            </button>
            <div className="text-[10px] text-slate-500 text-center italic">
              Triggers outreach immediately to all eligible active contacts.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
