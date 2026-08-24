import React, { useEffect, useState } from 'react';
import { resumeApi } from '../services/api';
import { formatDate } from '../utils/dateUtils';
import { 
  FileUp, 
  Trash2, 
  CheckCircle, 
  FileText,
  AlertCircle
} from 'lucide-react';

export default function Resumes({ showToast }) {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const loadResumes = async () => {
    try {
      setLoading(true);
      const res = await resumeApi.getAll();
      setResumes(res.data || []);
    } catch (err) {
      console.error(err);
      showToast('Failed to load resumes list', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResumes();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      showToast('Only PDF files are allowed', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Maximum file size allowed is 5MB', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      await resumeApi.upload(formData);
      showToast('Resume uploaded successfully');
      loadResumes();
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || 'Upload failed. Check file bounds.';
      showToast(errorMsg, 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleMarkActive = async (id) => {
    try {
      await resumeApi.markAsActive(id);
      showToast('Resume set as active');
      loadResumes();
    } catch (err) {
      console.error(err);
      showToast('Failed to toggle active resume', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this resume from the storage?')) return;
    try {
      await resumeApi.delete(id);
      showToast('Resume deleted successfully');
      loadResumes();
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || 'Failed to delete resume';
      showToast(errorMsg, 'error');
    }
  };

  return (
    <div className="space-y-6 animate-slide-in">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Resume Management</h2>
        <p className="text-sm text-slate-400">Upload your PDF resumes. Mark one active to attach it to campaigns.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Upload card */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 lg:col-span-1">
          <h3 className="font-bold text-white mb-4 text-md">Upload New PDF</h3>
          <div className="relative border-2 border-dashed border-slate-800 hover:border-purple-600/50 rounded-xl p-8 transition-colors flex flex-col items-center justify-center text-center cursor-pointer group">
            <input 
              type="file" 
              accept=".pdf"
              onChange={handleFileUpload}
              disabled={uploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                <span className="text-xs text-slate-400">Uploading file...</span>
              </div>
            ) : (
              <>
                <div className="p-3 rounded-full bg-slate-900 text-slate-400 group-hover:text-purple-400 group-hover:bg-purple-600/5 transition-all duration-200 mb-3">
                  <FileUp className="h-6 w-6" />
                </div>
                <span className="text-xs font-semibold text-slate-200 group-hover:text-purple-400 transition-colors">Select PDF File</span>
                <span className="text-[10px] text-slate-500 mt-1">Accepts only PDF, Max 5MB</span>
              </>
            )}
          </div>
        </div>

        {/* Resumes List */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 lg:col-span-2 space-y-4">
          <h3 className="font-bold text-white text-md">Resume History</h3>

          {loading ? (
            <div className="flex h-32 items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
            </div>
          ) : resumes.length === 0 ? (
            <div className="p-8 border border-slate-900 border-dashed rounded-xl text-center text-slate-500 italic text-xs">
              No resumes uploaded yet. Choose a file on the left.
            </div>
          ) : (
            <div className="space-y-3">
              {resumes.map((resume) => (
                <div 
                  key={resume.id} 
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                    resume.active 
                      ? 'bg-purple-600/5 border-purple-500/30' 
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className={`p-2 rounded-lg ${resume.active ? 'bg-purple-600/10 text-purple-400' : 'bg-slate-800 text-slate-400'}`}>
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="text-sm font-semibold text-slate-200 truncate pr-2">{resume.originalFilename}</h4>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500">
                        <span>{(resume.fileSize / 1024).toFixed(1)} KB</span>
                        <span>•</span>
                        <span>{formatDate(resume.uploadedTimestamp)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {resume.active ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400">
                        <CheckCircle className="h-3 w-3" /> Active
                      </span>
                    ) : (
                      <button
                        onClick={() => handleMarkActive(resume.id)}
                        className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold transition-colors"
                      >
                        Set Active
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(resume.id)}
                      className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
