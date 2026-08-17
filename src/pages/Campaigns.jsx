import React, { useEffect, useState } from 'react';
import { campaignApi, templateApi, resumeApi, recruiterApi } from '../services/api';
import CustomSelect from '../components/CustomSelect';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Mail, 
  X, 
  Eye, 
  Send,
  Play,
  Briefcase
} from 'lucide-react';

const AVAILABLE_GROUPS = [
  { id: 'HR', label: 'HR / Recruiters' },
  { id: 'LEAD', label: 'Leads / Managers' },
  { id: 'BPO', label: 'BPO Recruiters' },
  { id: 'SALES', label: 'Sales / BDM Recruiters' },
  { id: 'TECHNICAL', label: 'Technical Recruiters' },
  { id: 'NON_IT', label: 'Non-IT Recruiters' },
];

export default function Campaigns({ showToast }) {
  const [campaigns, setCampaigns] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleToggleGroup = (groupId) => {
    const current = formData.targetTitleGroup ? formData.targetTitleGroup.split(',').map(g => g.trim()).filter(Boolean) : [];
    let newGroups;
    if (current.includes(groupId)) {
      newGroups = current.filter(g => g !== groupId);
    } else {
      newGroups = [...current.filter(g => g !== 'ALL'), groupId];
    }
    if (newGroups.length === 0) {
      newGroups = ['ALL'];
    }
    setFormData({ ...formData, targetTitleGroup: newGroups.join(',') });
  };
  
  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCampaign, setCurrentCampaign] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    templateId: '',
    resumeId: '',
    enabled: false,
    targetSet: '',
    targetTitleGroup: 'ALL',
  });

  // Preview & Trigger Modals
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isTriggerOpen, setIsTriggerOpen] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);
  const [selectedRecruiterId, setSelectedRecruiterId] = useState('');
  const [previewContent, setPreviewContent] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [sendingOutreach, setSendingOutreach] = useState(false);
  const [sendMode, setSendMode] = useState('single'); // 'single' or 'batch'
  const [batchLimit, setBatchLimit] = useState(30);

  const loadData = async () => {
    try {
      setLoading(true);
      const [campRes, tempRes, resRes, recRes] = await Promise.all([
        campaignApi.getAll(),
        templateApi.getAll(),
        resumeApi.getAll(),
        recruiterApi.getAll(),
      ]);

      setCampaigns(campRes.data || []);
      setTemplates(tempRes.data || []);
      setResumes(resRes.data || []);
      setRecruiters(recRes.data || []);
    } catch (err) {
      console.error(err);
      showToast('Failed to load campaigns or assets', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAddModal = () => {
    setCurrentCampaign(null);
    setFormData({
      name: '',
      templateId: templates[0]?.id || '',
      resumeId: resumes.find(r => r.active)?.id || resumes[0]?.id || '',
      enabled: false,
      targetSet: '',
      targetTitleGroup: 'ALL',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (camp) => {
    setCurrentCampaign(camp);
    setFormData({
      name: camp.name,
      templateId: camp.templateId,
      resumeId: camp.resumeId,
      enabled: camp.enabled,
      targetSet: camp.targetSet !== null && camp.targetSet !== undefined ? camp.targetSet.toString() : '',
      targetTitleGroup: camp.targetTitleGroup || 'ALL',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this campaign?')) return;
    try {
      await campaignApi.delete(id);
      showToast('Campaign deleted successfully');
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Failed to delete campaign', 'error');
    }
  };

  const handleToggleEnable = async (id, enabled) => {
    try {
      if (enabled) {
        await campaignApi.disable(id);
        showToast('Campaign disabled');
      } else {
        await campaignApi.enable(id);
        showToast('Campaign enabled (others disabled)');
      }
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Failed to toggle status', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      targetSet: formData.targetSet === '' ? null : parseInt(formData.targetSet),
    };
    try {
      if (currentCampaign) {
        await campaignApi.update(currentCampaign.id, payload);
        showToast('Campaign updated successfully');
      } else {
        await campaignApi.create(payload);
        showToast('Campaign created successfully');
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || 'Failed to save campaign details';
      showToast(errorMsg, 'error');
    }
  };

  // Preview logic
  const handleOpenPreview = (campId) => {
    setSelectedCampaignId(campId);
    setSelectedRecruiterId(recruiters[0]?.id || '');
    setPreviewContent(null);
    setIsPreviewOpen(true);
  };

  const handleFetchPreview = async () => {
    if (!selectedRecruiterId) return;
    try {
      setPreviewLoading(true);
      const res = await campaignApi.preview(selectedCampaignId, selectedRecruiterId);
      setPreviewContent(res.data);
    } catch (err) {
      console.error(err);
      showToast('Failed to generate preview', 'error');
    } finally {
      setPreviewLoading(false);
    }
  };

  useEffect(() => {
    if (isPreviewOpen && selectedRecruiterId) {
      handleFetchPreview();
    }
  }, [selectedRecruiterId, selectedCampaignId]);

  // Trigger manual send logic
  const handleOpenTrigger = (campId) => {
    setSelectedCampaignId(campId);
    setSelectedRecruiterId(recruiters.filter(r => r.status === 'ACTIVE')[0]?.id || '');
    setSendMode('single');
    setBatchLimit(30);
    setIsTriggerOpen(true);
  };

  const handleManualSend = async (e) => {
    e.preventDefault();
    try {
      setSendingOutreach(true);
      if (sendMode === 'single') {
        if (!selectedRecruiterId) return;
        await campaignApi.trigger(selectedCampaignId, selectedRecruiterId);
        showToast('Email sent successfully!');
      } else {
        const res = await campaignApi.triggerBatch(selectedCampaignId, batchLimit);
        const count = res.data?.count || 0;
        showToast(`Successfully queued outreach for ${count} recruiter(s) in the background!`);
      }
      setIsTriggerOpen(false);
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || 'Failed to dispatch email';
      showToast(errorMsg, 'error');
    } finally {
      setSendingOutreach(false);
    }
  };

  const templateOptions = templates.map(t => ({
    value: t.id.toString(),
    label: t.templateName
  }));

  const resumeOptions = resumes.map(r => ({
    value: r.id.toString(),
    label: `${r.originalFilename} ${r.active ? '(Active)' : ''}`
  }));

  const targetSetOptions = [
    { value: '', label: 'All Sets (Irrespective)' },
    { value: '1', label: 'Set 1' },
    { value: '2', label: 'Set 2' },
    { value: '3', label: 'Set 3' },
    { value: '4', label: 'Set 4' },
    { value: '5', label: 'Set 5' }
  ];

  const batchOptions = [
    { value: 10, label: 'First 10 Recruiters' },
    { value: 30, label: 'First 30 Recruiters' },
    { value: 40, label: 'First 40 Recruiters' },
    { value: 50, label: 'First 50 Recruiters' },
    { value: 100, label: 'First 100 Recruiters' },
    { value: 10000, label: 'All Eligible Recruiters' }
  ];

  return (
    <>
      <div className="space-y-6 animate-slide-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Campaign Management</h2>
          <p className="text-sm text-slate-400">Map templates and resumes to outreach schedules.</p>
        </div>
        <button 
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-all duration-200 shadow-lg shadow-purple-500/20"
        >
          <Plus className="h-4 w-4" /> Create Campaign
        </button>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {campaigns.length === 0 ? (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-12 text-center text-slate-500 italic">
              No campaigns found. Create one to enable weekly outreach.
            </div>
          ) : (
            campaigns.map((camp) => (
              <div 
                key={camp.id} 
                className={`bg-slate-950 border rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-200 ${
                  camp.enabled 
                    ? 'border-purple-500/40 shadow-lg shadow-purple-500/5' 
                    : 'border-slate-800'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${camp.enabled ? 'bg-purple-600/15 text-purple-400' : 'bg-slate-900 text-slate-500'}`}>
                      <Mail className="h-4 w-4" />
                    </div>
                    <h3 className="font-bold text-white text-md">{camp.name}</h3>
                    {camp.enabled && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/10 text-purple-400">
                        Active Sequence
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                    <span>Template: <strong className="text-slate-300">{camp.templateName}</strong></span>
                    <span className="text-slate-600">|</span>
                    <span>Resume: <strong className="text-slate-300">{camp.resumeFilename}</strong></span>
                    <span className="text-slate-600">|</span>
                    <span>Targeting Set: <strong className="text-slate-300">{camp.targetSet ? `Set ${camp.targetSet}` : 'All Sets'}</strong></span>
                    <span className="text-slate-600">|</span>
                    <span>Groups: <strong className="text-slate-300">
                      {camp.targetTitleGroup 
                        ? camp.targetTitleGroup.split(',')
                            .map(g => AVAILABLE_GROUPS.find(ag => ag.id === g.trim())?.label || (g.trim() === 'ALL' ? 'All Titles' : g.trim()))
                            .join(', ')
                        : 'All Titles'}
                    </strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-center">
                  <button 
                    onClick={() => handleToggleEnable(camp.id, camp.enabled)}
                    className={`text-xs px-3 py-1.5 rounded-xl font-semibold select-none cursor-pointer transition-colors ${
                      camp.enabled 
                        ? 'bg-purple-600 text-white hover:bg-purple-700' 
                        : 'bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800'
                    }`}
                  >
                    {camp.enabled ? 'Enabled' : 'Disabled'}
                  </button>

                  <button 
                    onClick={() => handleOpenPreview(camp.id)}
                    className="p-2 hover:bg-slate-900 rounded-lg text-slate-400 hover:text-white transition-colors"
                    title="Preview Email"
                  >
                    <Eye className="h-4 w-4" />
                  </button>

                  <button 
                    onClick={() => handleOpenTrigger(camp.id)}
                    className="p-2 hover:bg-slate-900 rounded-lg text-slate-400 hover:text-white transition-colors"
                    title="Run Manual Outreach"
                  >
                    <Play className="h-4 w-4" />
                  </button>

                  <span className="text-slate-800">|</span>

                  <button 
                    onClick={() => handleOpenEditModal(camp)}
                    className="p-2 hover:bg-slate-900 rounded-lg text-slate-400 hover:text-white transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>

                  <button 
                    onClick={() => handleDelete(camp.id)}
                    className="p-2 hover:bg-slate-900 rounded-lg text-slate-400 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      </div>

      {/* Campaign Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-850 rounded-2xl max-w-md w-full shadow-2xl p-6 relative animate-slide-in">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 hover:bg-slate-900 p-1.5 rounded-lg text-slate-500 hover:text-slate-300"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2.5 mb-6 border-b border-slate-900 pb-4">
              <Mail className="h-5 w-5 text-purple-500" />
              <h3 className="text-lg font-bold text-white font-heading">
                {currentCampaign ? 'Edit Campaign' : 'Create Campaign'}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Campaign Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Spring Outreach"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm outline-none text-slate-200 focus:border-purple-600 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Email Template</label>
                {templates.length === 0 ? (
                  <p className="text-xs text-rose-400">No templates found. Add one first.</p>
                ) : (
                  <CustomSelect
                    value={formData.templateId}
                    onChange={(val) => setFormData({...formData, templateId: val})}
                    options={templateOptions}
                    selectClassName="w-full py-2.5 text-sm"
                    className="w-full"
                  />
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Resume File</label>
                {resumes.length === 0 ? (
                  <p className="text-xs text-rose-400">No resumes found. Upload one first.</p>
                ) : (
                  <CustomSelect
                    value={formData.resumeId}
                    onChange={(val) => setFormData({...formData, resumeId: val})}
                    options={resumeOptions}
                    selectClassName="w-full py-2.5 text-sm"
                    className="w-full"
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1.5">Target Contact Set</label>
                  <CustomSelect
                    value={formData.targetSet}
                    onChange={(val) => setFormData({...formData, targetSet: val})}
                    options={targetSetOptions}
                    selectClassName="w-full py-2.5 text-sm"
                    className="w-full font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-2">Target Title Groups</label>
                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-900 border border-slate-850 rounded-xl">
                  {AVAILABLE_GROUPS.map(group => {
                    const current = formData.targetTitleGroup ? formData.targetTitleGroup.split(',').map(g => g.trim()) : [];
                    const isChecked = current.includes(group.id);
                    return (
                      <label key={group.id} className="flex items-center gap-2 text-xs text-slate-300 font-semibold cursor-pointer select-none">
                        <input 
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleGroup(group.id)}
                          className="rounded border-slate-800 text-purple-600 focus:ring-0 focus:ring-offset-0 bg-slate-950 w-4 h-4 cursor-pointer"
                        />
                        {group.label}
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox"
                  id="enabled"
                  checked={formData.enabled}
                  onChange={(e) => setFormData({...formData, enabled: e.target.checked})}
                  className="rounded border-slate-800 text-purple-600 focus:ring-0 focus:ring-offset-0 bg-slate-900 w-4 h-4"
                />
                <label htmlFor="enabled" className="text-xs font-semibold text-slate-300 cursor-pointer">
                  Enable Campaign immediately (deactivates others)
                </label>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-900 mt-6">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-855 text-slate-300 text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={templates.length === 0 || resumes.length === 0}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  {currentCampaign ? 'Save Changes' : 'Create Campaign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-850 rounded-2xl max-w-2xl w-full shadow-2xl p-6 relative animate-slide-in max-h-[85vh] flex flex-col">
            <button 
              onClick={() => setIsPreviewOpen(false)}
              className="absolute top-4 right-4 hover:bg-slate-900 p-1.5 rounded-lg text-slate-500 hover:text-slate-300"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 mb-4 border-b border-slate-900 pb-3">
              <Eye className="h-5 w-5 text-purple-400" />
              <h3 className="text-lg font-bold text-white">Email Compiler Preview</h3>
            </div>

            <div className="flex items-center gap-3 mb-6 bg-slate-900 border border-slate-800 p-3 rounded-xl">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider shrink-0">Recruiter Profile</label>
              {recruiters.length === 0 ? (
                <span className="text-xs text-slate-500 italic">No recruiters available</span>
              ) : (
                <CustomSelect
                  value={selectedRecruiterId}
                  onChange={setSelectedRecruiterId}
                  options={recruiters.map(r => ({
                    value: r.id.toString(),
                    label: `${r.name} - ${r.title || 'HR'} (${r.company})`
                  }))}
                  placeholder="Select recruiter profile..."
                  selectClassName="bg-transparent border-0 outline-none text-xs font-bold text-purple-400 focus:ring-0 w-full min-w-0"
                  className="w-full animate-none"
                />
              )}
            </div>

            {previewLoading ? (
              <div className="flex-1 flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
              </div>
            ) : previewContent ? (
              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                <div className="border border-slate-900 rounded-xl p-4 bg-slate-900/40">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">Subject Line</span>
                  <p className="text-sm font-bold text-white">{previewContent.subject}</p>
                </div>

                <div className="border border-slate-900 rounded-xl p-4 bg-slate-900/40">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">Message Body</span>
                  <p className="text-xs text-slate-300 leading-relaxed font-mono whitespace-pre-wrap">{previewContent.body}</p>
                </div>
              </div>
            ) : (
              <div className="flex-1 text-center py-12 text-slate-500 italic text-sm">
                Select a recruiter contact above to parse dynamic placeholders.
              </div>
            )}

            {/* Modal Footer */}
            <div className="flex justify-end pt-4 border-t border-slate-900 mt-4 shrink-0">
              <button 
                onClick={() => setIsPreviewOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 text-sm font-semibold transition-colors cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Run Manual Send Trigger Modal */}
      {isTriggerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-850 rounded-2xl max-w-md w-full shadow-2xl p-6 relative animate-slide-in">
            <button 
              onClick={() => setIsTriggerOpen(false)}
              className="absolute top-4 right-4 hover:bg-slate-900 p-1.5 rounded-lg text-slate-500 hover:text-slate-300"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 mb-6 border-b border-slate-900 pb-3">
              <Send className="h-5 w-5 text-purple-400" />
              <h3 className="text-lg font-bold text-white">Manual Outreach Dispatch</h3>
            </div>

            <form onSubmit={handleManualSend} className="space-y-4">
              {/* Send Mode Toggle */}
              <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-850 mb-2">
                <button
                  type="button"
                  onClick={() => setSendMode('single')}
                  className={`flex-1 text-center py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    sendMode === 'single'
                      ? 'bg-purple-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Single Recruiter
                </button>
                <button
                  type="button"
                  onClick={() => setSendMode('batch')}
                  className={`flex-1 text-center py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    sendMode === 'batch'
                      ? 'bg-purple-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Batch Send
                </button>
              </div>

              {sendMode === 'single' ? (
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1.5">Select Recruiter Contact</label>
                  {recruiters.filter(r => r.status === 'ACTIVE').length === 0 ? (
                    <p className="text-xs text-rose-400">No active recruiters available to send.</p>
                  ) : (
                    <CustomSelect
                      value={selectedRecruiterId}
                      onChange={setSelectedRecruiterId}
                      options={recruiters.filter(r => r.status === 'ACTIVE').map(r => ({
                        value: r.id.toString(),
                        label: `${r.name} - ${r.title || 'HR'} (${r.company})`
                      }))}
                      placeholder="Select active recruiter contact..."
                      selectClassName="w-full py-2.5 text-sm"
                      className="w-full"
                    />
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1.5">Batch Size Limit</label>
                    <CustomSelect
                      value={batchLimit}
                      onChange={setBatchLimit}
                      options={batchOptions}
                      placeholder="Select batch limit..."
                      selectClassName="w-full py-2.5 text-sm"
                      className="w-full"
                    />
                  </div>
                  <div className="p-3 bg-slate-905 border border-slate-800 rounded-xl text-[10px] text-slate-400 leading-normal">
                    Batch outreach skips any recruiters who are set to <strong>Inactive</strong> or who have been contacted within the last <strong>30 days</strong>.
                  </div>
                </div>
              )}

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-900 mt-6">
                <button 
                  type="button"
                  onClick={() => setIsTriggerOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={sendingOutreach || (sendMode === 'single' && !selectedRecruiterId)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  {sendingOutreach ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" /> {sendMode === 'single' ? 'Dispatch Email' : 'Trigger Batch'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
