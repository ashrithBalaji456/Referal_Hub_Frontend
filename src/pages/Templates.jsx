import React, { useEffect, useState } from 'react';
import { templateApi } from '../services/api';
import { 
  Plus, 
  Edit, 
  Trash2, 
  FileText, 
  X, 
  Info 
} from 'lucide-react';

export default function Templates({ showToast }) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState(null); // null means Add, else Edit
  const [formData, setFormData] = useState({
    templateName: '',
    subject: '',
    body: '',
  });

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const res = await templateApi.getAll();
      setTemplates(res.data || []);
    } catch (err) {
      console.error(err);
      showToast('Failed to load templates', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const handleOpenAddModal = () => {
    setCurrentTemplate(null);
    setFormData({
      templateName: '',
      subject: '',
      body: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (template) => {
    setCurrentTemplate(template);
    setFormData({
      templateName: template.templateName,
      subject: template.subject,
      body: template.body,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this template?')) return;
    try {
      await templateApi.delete(id);
      showToast('Template deleted successfully');
      loadTemplates();
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || 'Failed to delete template';
      showToast(errorMsg, 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentTemplate) {
        // Edit
        await templateApi.update(currentTemplate.id, formData);
        showToast('Template updated successfully');
      } else {
        // Add
        await templateApi.create(formData);
        showToast('Template added successfully');
      }
      setIsModalOpen(false);
      loadTemplates();
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || 'Failed to save template details';
      showToast(errorMsg, 'error');
    }
  };

  const insertPlaceholder = (placeholder) => {
    setFormData({
      ...formData,
      body: formData.body + placeholder
    });
  };

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Email Templates</h2>
          <p className="text-sm text-slate-400">Configure reusable message layouts for job application emails.</p>
        </div>
        <button 
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-all duration-200 shadow-lg shadow-purple-500/20"
        >
          <Plus className="h-4 w-4" /> Add Template
        </button>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {templates.length === 0 ? (
            <div className="md:col-span-2 bg-slate-950 border border-slate-800 rounded-2xl p-12 text-center text-slate-500 italic">
              No email templates found. Create one to begin.
            </div>
          ) : (
            templates.map((template) => (
              <div key={template.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-colors">
                <div>
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-purple-600/10 text-purple-400">
                        <FileText className="h-4 w-4" />
                      </div>
                      <h3 className="font-bold text-white text-md">{template.templateName}</h3>
                    </div>
                    <div className="flex gap-1">
                      <button 
                        onClick={() => handleOpenEditModal(template)}
                        className="p-2 hover:bg-slate-900 rounded-lg text-slate-400 hover:text-white transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(template.id)}
                        className="p-2 hover:bg-slate-900 rounded-lg text-slate-400 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Subject Line</span>
                      <p className="text-sm font-semibold text-slate-200 mt-1 truncate">{template.subject}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Body Preview</span>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-4 whitespace-pre-wrap">{template.body}</p>
                    </div>
                  </div>
                </div>
                <div className="text-[10px] text-slate-500 pt-4 border-t border-slate-900 mt-6 flex justify-between">
                  <span>Created: {new Date(template.createdTimestamp).toLocaleDateString()}</span>
                  <span>Updated: {new Date(template.updatedTimestamp).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-850 rounded-2xl max-w-2xl w-full shadow-2xl p-6 relative animate-slide-in">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 hover:bg-slate-900 p-1.5 rounded-lg text-slate-500 hover:text-slate-300"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2.5 mb-6 border-b border-slate-900 pb-4">
              <FileText className="h-5 w-5 text-purple-500" />
              <h3 className="text-lg font-bold text-white">
                {currentTemplate ? 'Edit Email Template' : 'Add Email Template'}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Template Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.templateName}
                  onChange={(e) => setFormData({...formData, templateName: e.target.value})}
                  placeholder="e.g. Universal Referral Template"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm outline-none text-slate-200 focus:border-purple-600 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Subject Line</label>
                <input 
                  type="text" 
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  placeholder="e.g. Job Referral Request - {{candidateName}}"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm outline-none text-slate-200 focus:border-purple-600 transition-colors"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-slate-400">Message Body</label>
                  <div className="flex flex-wrap gap-1">
                    {['{{recruiterName}}', '{{companyName}}', '{{candidateName}}', '{{roleName}}'].map((placeholder) => (
                      <button
                        key={placeholder}
                        type="button"
                        onClick={() => insertPlaceholder(placeholder)}
                        className="text-[10px] px-2 py-1 rounded bg-slate-900 border border-slate-800 text-purple-400 hover:border-purple-500 hover:text-white transition-colors"
                      >
                        {placeholder}
                      </button>
                    ))}
                  </div>
                </div>
                <textarea 
                  required
                  rows="8"
                  value={formData.body}
                  onChange={(e) => setFormData({...formData, body: e.target.value})}
                  placeholder="Type your cover letter / email body. Click placeholders above to insert them."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs outline-none text-slate-200 focus:border-purple-600 transition-colors font-mono whitespace-pre-wrap leading-relaxed"
                />
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/50 border border-slate-800">
                <Info className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
                <p className="text-[11px] text-slate-400 leading-normal">
                  The placeholders above are automatically replaced on dispatch. For example, 
                  <strong> {'{{recruiterName}}'}</strong> compiles to the contact's name, and 
                  <strong> {'{{roleName}}'}</strong> resolves to "Java Backend Developer" or "Spring Boot Developer" matching the recruiter's category.
                </p>
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
                  {currentTemplate ? 'Save Changes' : 'Create Template'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
