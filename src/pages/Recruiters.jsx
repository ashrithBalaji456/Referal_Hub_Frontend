import React, { useEffect, useState } from 'react';
import { recruiterApi, campaignApi } from '../services/api';
import CustomSelect from '../components/CustomSelect';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  UserPlus,
  Briefcase,
  Send,
  Download
} from 'lucide-react';

export default function Recruiters({ showToast }) {
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRecruiter, setCurrentRecruiter] = useState(null); // null means Add, else Edit
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    title: '',
    company: '',
    status: 'ACTIVE',
    contactSet: 1,
  });

  // Bulk Import state
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importSetNumber, setImportSetNumber] = useState(2);
  const [importing, setImporting] = useState(false);

  // Filters state
  const [filterSet, setFilterSet] = useState('ALL');
  const [filterTitleGroup, setFilterTitleGroup] = useState('ALL');

  // Selected IDs & Send Modal state
  const [selectedIds, setSelectedIds] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState('');
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [sendingAsap, setSendingAsap] = useState(false);

  const loadRecruiters = async () => {
    try {
      setLoading(true);
      const res = await recruiterApi.getAll();
      setRecruiters(res.data || []);
    } catch (err) {
      console.error(err);
      showToast('Failed to load recruiters', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadCampaigns = async () => {
    try {
      const res = await campaignApi.getAll();
      setCampaigns(res.data || []);
      const active = res.data?.find(c => c.enabled);
      if (active) {
        setSelectedCampaignId(active.id);
      } else if (res.data?.length > 0) {
        setSelectedCampaignId(res.data[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadRecruiters();
    loadCampaigns();
  }, []);

  const handleOpenAddModal = () => {
    setCurrentRecruiter(null);
    setFormData({
      name: '',
      email: '',
      title: '',
      company: '',
      status: 'ACTIVE',
      contactSet: 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (recruiter) => {
    setCurrentRecruiter(recruiter);
    setFormData({
      name: recruiter.name,
      email: recruiter.email,
      title: recruiter.title || '',
      company: recruiter.company,
      status: recruiter.status,
      contactSet: recruiter.contactSet || 1,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this recruiter?')) return;
    try {
      await recruiterApi.delete(id);
      showToast('Recruiter deleted successfully');
      loadRecruiters();
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || 'Failed to delete recruiter';
      showToast(errorMsg, 'error');
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await recruiterApi.updateStatus(id, nextStatus);
      showToast(`Recruiter set to ${nextStatus.toLowerCase()}`);
      loadRecruiters();
    } catch (err) {
      console.error(err);
      showToast('Failed to update status', 'error');
    }
  };

  const handleToggleSelectAll = (checked) => {
    if (checked) {
      const activeIds = filteredRecruiters.map(r => r.id);
      setSelectedIds(activeIds);
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelectOne = (id, checked) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(x => x !== id));
    }
  };

  const handleOpenSendModal = (recIds) => {
    setSelectedIds(recIds);
    setIsSendModalOpen(true);
  };

  const handleSendAsap = async () => {
    if (selectedIds.length === 0) return;
    if (!selectedCampaignId) {
      showToast('Please select a campaign sequence', 'error');
      return;
    }
    try {
      setSendingAsap(true);
      await campaignApi.triggerMultiple(selectedCampaignId, selectedIds);
      showToast(`Outreach email sequence triggered successfully for ${selectedIds.length} contact(s)`);
      setSelectedIds([]);
      setIsSendModalOpen(false);
      loadRecruiters();
    } catch (err) {
      console.error(err);
      showToast('Failed to trigger outreach emails', 'error');
    } finally {
      setSendingAsap(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentRecruiter) {
        // Edit
        await recruiterApi.update(currentRecruiter.id, formData);
        showToast('Recruiter updated successfully');
      } else {
        // Add
        await recruiterApi.create(formData);
        showToast('Recruiter added successfully');
      }
      setIsModalOpen(false);
      loadRecruiters();
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || 'Failed to save recruiter details';
      showToast(errorMsg, 'error');
    }
  };

  const handleImportCsv = async (e) => {
    e.preventDefault();
    if (!importFile) {
      showToast('Please select a CSV file first.', 'error');
      return;
    }
    const fd = new FormData();
    fd.append('file', importFile);
    fd.append('setNumber', importSetNumber);

    try {
      setImporting(true);
      const res = await recruiterApi.importCsv(fd);
      showToast(`Imported ${res.data} recruiters successfully into Set ${importSetNumber}!`);
      setIsImportModalOpen(false);
      setImportFile(null);
      loadRecruiters();
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || 'Failed to import CSV';
      showToast(errorMsg, 'error');
    } finally {
      setImporting(false);
    }
  };

  const handleExportCsv = () => {
    let listToExport = filteredRecruiters;
    let filename = 'recruiters_all.csv';

    if (selectedIds.length > 0) {
      listToExport = recruiters.filter(r => selectedIds.includes(r.id));
      filename = `recruiters_selected_${selectedIds.length}.csv`;
    } else if (filterSet !== 'ALL') {
      filename = `recruiters_set_${filterSet}.csv`;
    }

    if (listToExport.length === 0) {
      showToast('No recruiter contacts available to export', 'error');
      return;
    }

    const headers = ["Name", "Email", "Title", "Company", "Contact Set", "Status", "Last Contacted"];
    const rows = listToExport.map(r => [
      `"${(r.name || '').replace(/"/g, '""')}"`,
      `"${(r.email || '').replace(/"/g, '""')}"`,
      `"${(r.title || '').replace(/"/g, '""')}"`,
      `"${(r.company || '').replace(/"/g, '""')}"`,
      r.contactSet || 1,
      r.status || 'ACTIVE',
      `"${r.lastContactedDate ? new Date(r.lastContactedDate).toLocaleDateString() : 'Never'}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`Exported ${listToExport.length} recruiter contact(s) successfully!`);
  };

  // Extract unique contact sets from recruiter data
  const availableSets = [...new Set(recruiters.map(r => r.contactSet || 1))].sort((a, b) => a - b);

  const contactSetOptions = [
    { value: 'ALL', label: 'All Sets' },
    ...availableSets.map(set => ({ value: set.toString(), label: `Set ${set}` }))
  ];

  const targetGroupOptions = [
    { value: 'ALL', label: 'All Titles' },
    { value: 'HR', label: 'HRs Only' },
    { value: 'LEAD', label: 'Leads/Managers Only' }
  ];

  const filteredRecruiters = recruiters.filter(r => {
    // 1. Search term
    const matchesSearch = 
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email.toLowerCase().includes(searchTerm.toLowerCase());
      
    if (!matchesSearch) return false;
    
    // 2. Set filter
    if (filterSet !== 'ALL' && (r.contactSet || 1) !== parseInt(filterSet)) {
      return false;
    }
    
    // 3. Title group filter
    if (filterTitleGroup === 'HR') {
      const isHr = /hr|human|recruiter|talent/i.test(r.title || '');
      if (!isHr) return false;
    } else if (filterTitleGroup === 'LEAD') {
      const isLead = /head|lead|manager|director|vp|president|founder/i.test(r.title || '');
      if (!isLead) return false;
    }
    
    return true;
  });

  return (
    <>
      <div className="space-y-6 animate-slide-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Recruiter Contacts</h2>
          <p className="text-sm text-slate-400">Add and manage recruiters for your outreach campaigns.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {selectedIds.length > 0 && (
            <button 
              onClick={() => setIsSendModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600/20 border border-purple-500/40 hover:bg-purple-600/35 text-purple-300 text-sm font-semibold transition-all duration-200 cursor-pointer shadow-lg shadow-purple-500/5"
            >
              <Send className="h-4 w-4" /> Send ASAP ({selectedIds.length})
            </button>
          )}
          <button 
            onClick={handleExportCsv}
            title={selectedIds.length > 0 ? `Export ${selectedIds.length} selected contacts` : (filterSet !== 'ALL' ? `Export Set ${filterSet} contacts` : 'Export all contacts')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:border-slate-700 text-slate-300 text-sm font-semibold transition-all duration-200 cursor-pointer"
          >
            <Download className="h-4 w-4 text-purple-400" /> Bulk Export (CSV)
          </button>
          <button 
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:border-slate-700 text-slate-300 text-sm font-semibold transition-all duration-200 cursor-pointer"
          >
            <Briefcase className="h-4 w-4 text-slate-400" /> Bulk Import (CSV)
          </button>
          <button 
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-all duration-200 shadow-lg shadow-purple-500/20 cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Add Recruiter
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-950 border border-slate-900 rounded-2xl p-4">
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-850 rounded-xl px-4 py-2 w-full md:max-w-md">
          <Search className="h-4 w-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search by name, company, or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-0 outline-none text-slate-200 text-sm w-full placeholder:text-slate-600"
          />
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 animate-none">
            <label className="text-xs font-semibold text-slate-400">Contact Set:</label>
            <CustomSelect
              value={filterSet}
              onChange={setFilterSet}
              options={contactSetOptions}
            />
          </div>
          <div className="flex items-center gap-2 animate-none">
            <label className="text-xs font-semibold text-slate-400">Target Group:</label>
            <CustomSelect
              value={filterTitleGroup}
              onChange={setFilterTitleGroup}
              options={targetGroupOptions}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 w-12 text-center">
                    <input 
                      type="checkbox"
                      checked={filteredRecruiters.length > 0 && selectedIds.length === filteredRecruiters.length}
                      onChange={(e) => handleToggleSelectAll(e.target.checked)}
                      className="rounded border-slate-800 text-purple-600 focus:ring-0 focus:ring-offset-0 bg-slate-900 w-4 h-4 cursor-pointer"
                    />
                  </th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Company</th>
                  <th className="px-6 py-4 text-center">Set</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4">Last Contacted</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                 {filteredRecruiters.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="px-6 py-8 text-center text-slate-500 italic">
                      No recruiters found matching the search.
                    </td>
                  </tr>
                ) : (
                  filteredRecruiters.map((recruiter) => (
                    <tr key={recruiter.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="px-6 py-4 w-12 text-center">
                        <input 
                          type="checkbox"
                          checked={selectedIds.includes(recruiter.id)}
                          onChange={(e) => handleToggleSelectOne(recruiter.id, e.target.checked)}
                          className="rounded border-slate-800 text-purple-600 focus:ring-0 focus:ring-offset-0 bg-slate-900 w-4 h-4 cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-4 text-slate-300 font-semibold">{recruiter.name}</td>
                      <td className="px-6 py-4 text-slate-400">{recruiter.email}</td>
                      <td className="px-6 py-4 text-slate-300 text-xs italic">{recruiter.title || 'HR Professional'}</td>
                      <td className="px-6 py-4 text-slate-300">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                          {recruiter.company}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950/40 text-purple-400 border border-purple-800/30">
                          Set {recruiter.contactSet || 1}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => handleToggleStatus(recruiter.id, recruiter.status)}
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold cursor-pointer select-none transition-all duration-200 ${
                            recruiter.status === 'ACTIVE' 
                              ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' 
                              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                          }`}
                        >
                          {recruiter.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-xs">
                        {recruiter.lastContactedDate 
                          ? new Date(recruiter.lastContactedDate).toLocaleDateString() 
                          : 'Never contacted'
                        }
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleOpenSendModal([recruiter.id])}
                            className="p-2 hover:bg-slate-900 rounded-lg text-purple-400 hover:text-purple-300 transition-colors"
                            title="Send Outreach ASAP"
                          >
                            <Send className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleOpenEditModal(recruiter)}
                            className="p-2 hover:bg-slate-900 rounded-lg text-slate-400 hover:text-white transition-colors"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(recruiter.id)}
                            className="p-2 hover:bg-slate-900 rounded-lg text-slate-400 hover:text-rose-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      </div>

      {/* Modal Dialog */}
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
              <UserPlus className="h-5 w-5 text-purple-500" />
              <h3 className="text-lg font-bold text-white">
                {currentRecruiter ? 'Edit Recruiter' : 'Add Recruiter'}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Recruiter Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Jane Doe"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm outline-none text-slate-200 focus:border-purple-600 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="e.g. jane.doe@company.com"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm outline-none text-slate-200 focus:border-purple-600 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Professional Title</label>
                <input 
                  type="text" 
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g. Head HR"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm outline-none text-slate-200 focus:border-purple-600 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Company</label>
                <input 
                  type="text" 
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  placeholder="e.g. Google"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm outline-none text-slate-200 focus:border-purple-600 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Contact Set Number</label>
                <input 
                  type="number" 
                  min="1"
                  required
                  value={formData.contactSet}
                  onChange={(e) => setFormData({...formData, contactSet: parseInt(e.target.value) || 1})}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm outline-none text-slate-200 focus:border-purple-600 transition-colors"
                />
              </div>



              <div className="flex gap-3 justify-end pt-4 border-t border-slate-900 mt-6">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-colors"
                >
                  {currentRecruiter ? 'Save Changes' : 'Create Contact'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk CSV Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-850 rounded-2xl max-w-md w-full shadow-2xl p-6 relative animate-slide-in">
            <button 
              onClick={() => setIsImportModalOpen(false)}
              className="absolute top-4 right-4 hover:bg-slate-900 p-1.5 rounded-lg text-slate-500 hover:text-slate-300"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2.5 mb-6 border-b border-slate-900 pb-4">
              <Briefcase className="h-5 w-5 text-purple-500" />
              <h3 className="text-lg font-bold text-white">Bulk Import Contacts (CSV)</h3>
            </div>

            <form onSubmit={handleImportCsv} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Select CSV File</label>
                <input 
                  type="file" 
                  accept=".csv"
                  required
                  onChange={(e) => setImportFile(e.target.files[0])}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs outline-none text-slate-300 file:bg-purple-600 file:hover:bg-purple-700 file:border-0 file:rounded file:text-white file:px-3 file:py-1 file:mr-3 transition-colors file:font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Import into Set Number</label>
                <input 
                  type="number" 
                  min="1"
                  required
                  value={importSetNumber}
                  onChange={(e) => setImportSetNumber(parseInt(e.target.value) || 1)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm outline-none text-slate-200 focus:border-purple-600 transition-colors"
                />
              </div>

              <div className="p-3.5 bg-slate-905 border border-slate-900 rounded-xl text-[10px] text-slate-400 leading-normal">
                CSV file should have headers in the format: <strong>Name,Email,Title,Company</strong>. Existing email addresses will be skipped automatically to avoid duplicates.
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-900 mt-6">
                <button 
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-855 text-slate-300 text-sm font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={importing || !importFile}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {importing ? (
                    <>
                      <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></div>
                      Importing...
                    </>
                  ) : (
                    'Start Import'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Send ASAP Trigger Modal */}
      {isSendModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-850 rounded-2xl max-w-md w-full shadow-2xl p-6 relative animate-slide-in">
            <button 
              onClick={() => setIsSendModalOpen(false)}
              className="absolute top-4 right-4 hover:bg-slate-900 p-1.5 rounded-lg text-slate-500 hover:text-slate-300"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2.5 mb-6 border-b border-slate-900 pb-4">
              <Send className="h-5 w-5 text-purple-500" />
              <h3 className="text-lg font-bold text-white">Trigger Immediate Outreach</h3>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-300">
                  You are triggering an immediate email dispatch to <strong>{selectedIds.length}</strong> selected recruiter(s).
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Select Campaign Sequence</label>
                <CustomSelect
                  value={selectedCampaignId}
                  onChange={setSelectedCampaignId}
                  options={campaigns.map(c => ({
                    value: c.id.toString(),
                    label: `${c.name} ${c.enabled ? '(Active)' : ''}`
                  }))}
                  placeholder="Select a campaign..."
                  selectClassName="w-full py-2.5 text-sm"
                  className="w-full"
                />
              </div>

              <div className="p-3.5 bg-purple-950/10 border border-purple-900/30 rounded-xl text-xs text-purple-300 leading-normal">
                <strong>Attention:</strong> These emails are sent immediately using your configured SMTP settings. Please make sure your selected campaign has correct resume/templates.
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-900 mt-6">
                <button 
                  type="button"
                  onClick={() => setIsSendModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-855 text-slate-300 text-sm font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={handleSendAsap}
                  disabled={sendingAsap || !selectedCampaignId}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {sendingAsap ? (
                    <>
                      <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></div>
                      Sending...
                    </>
                  ) : (
                    'Send ASAP'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
