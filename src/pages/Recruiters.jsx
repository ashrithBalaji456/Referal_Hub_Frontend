import React, { useEffect, useState } from 'react';
import { recruiterApi } from '../services/api';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  UserPlus,
  Briefcase
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
    company: '',
    roleCategory: 'JAVA_BACKEND_DEVELOPER',
    status: 'ACTIVE',
  });

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

  useEffect(() => {
    loadRecruiters();
  }, []);

  const handleOpenAddModal = () => {
    setCurrentRecruiter(null);
    setFormData({
      name: '',
      email: '',
      company: '',
      roleCategory: 'JAVA_BACKEND_DEVELOPER',
      status: 'ACTIVE',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (recruiter) => {
    setCurrentRecruiter(recruiter);
    setFormData({
      name: recruiter.name,
      email: recruiter.email,
      company: recruiter.company,
      roleCategory: recruiter.roleCategory,
      status: recruiter.status,
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

  const filteredRecruiters = recruiters.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Recruiter Contacts</h2>
          <p className="text-sm text-slate-400">Add and manage recruiters for your java / spring boot outreach.</p>
        </div>
        <button 
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-all duration-200 shadow-lg shadow-purple-500/20"
        >
          <Plus className="h-4 w-4" /> Add Recruiter
        </button>
      </div>

      <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 max-w-md">
        <Search className="h-4 w-4 text-slate-500" />
        <input 
          type="text" 
          placeholder="Search by name, company, or email..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent border-0 outline-none text-slate-200 text-sm w-full placeholder:text-slate-600"
        />
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
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Company</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4">Last Contacted</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filteredRecruiters.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-slate-500 italic">
                      No recruiters found matching the search.
                    </td>
                  </tr>
                ) : (
                  filteredRecruiters.map((recruiter) => (
                    <tr key={recruiter.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="px-6 py-4 font-semibold text-white">{recruiter.name}</td>
                      <td className="px-6 py-4 text-slate-400">{recruiter.email}</td>
                      <td className="px-6 py-4 text-slate-300">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                          {recruiter.company}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium text-purple-400">
                          {recruiter.roleCategory === 'JAVA_BACKEND_DEVELOPER' ? 'Java Backend' : 'Spring Boot'}
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
                            onClick={() => handleOpenEditModal(recruiter)}
                            className="p-2 hover:bg-slate-900 rounded-lg text-slate-400 hover:text-white transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(recruiter.id)}
                            className="p-2 hover:bg-slate-900 rounded-lg text-slate-400 hover:text-rose-400 transition-colors"
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
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Role Category</label>
                <select 
                  value={formData.roleCategory}
                  onChange={(e) => setFormData({...formData, roleCategory: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm outline-none text-slate-200 focus:border-purple-600 transition-colors"
                >
                  <option value="JAVA_BACKEND_DEVELOPER">Java Backend Developer</option>
                  <option value="SPRING_BOOT_DEVELOPER">Spring Boot Developer</option>
                </select>
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
    </div>
  );
}
