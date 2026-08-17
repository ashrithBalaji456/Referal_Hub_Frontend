import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, User, Mail, Link, Phone, MapPin, Briefcase } from 'lucide-react';
import { profileApi } from '../services/api';

export default function ProfileModal({ isOpen, onClose, showToast, onProfileUpdate }) {
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    linkedinUrl: '',
    githubUrl: '',
    phoneNumber: '',
    location: '',
    roleName: '',
  });
  const [customFields, setCustomFields] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadProfile();
    }
  }, [isOpen]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await profileApi.get();
      setProfile({
        fullName: res.data.fullName || '',
        email: res.data.email || '',
        linkedinUrl: res.data.linkedinUrl || '',
        githubUrl: res.data.githubUrl || '',
        phoneNumber: res.data.phoneNumber || '',
        location: res.data.location || '',
        roleName: res.data.roleName || '',
      });

      // Parse custom fields JSON
      if (res.data.customFieldsJson) {
        try {
          const customObj = JSON.parse(res.data.customFieldsJson);
          const fieldsArray = Object.keys(customObj).map(key => ({
            key,
            value: customObj[key]
          }));
          setCustomFields(fieldsArray);
        } catch (e) {
          console.error("Failed to parse custom fields JSON", e);
          setCustomFields([]);
        }
      } else {
        setCustomFields([]);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to load candidate profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomField = () => {
    setCustomFields([...customFields, { key: '', value: '' }]);
  };

  const handleRemoveCustomField = (index) => {
    setCustomFields(customFields.filter((_, i) => i !== index));
  };

  const handleCustomFieldChange = (index, keyOrValue, value) => {
    const updated = [...customFields];
    updated[index][keyOrValue] = value;
    setCustomFields(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Convert custom fields array to JSON object
      const customObj = {};
      customFields.forEach(f => {
        if (f.key.trim() !== '') {
          customObj[f.key.trim()] = f.value;
        }
      });

      const payload = {
        ...profile,
        customFieldsJson: JSON.stringify(customObj)
      };

      const res = await profileApi.update(payload);
      showToast('Candidate profile updated successfully!');
      
      // Notify parent app of new profile data
      if (onProfileUpdate) {
        onProfileUpdate(res.data);
      }
      onClose();
    } catch (err) {
      console.error(err);
      showToast('Failed to update candidate profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-950 border border-slate-850 rounded-2xl max-w-2xl w-full shadow-2xl p-6 relative max-h-[90vh] flex flex-col animate-slide-in">
        
        {/* Header */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 hover:bg-slate-900 p-1.5 rounded-lg text-slate-500 hover:text-slate-300"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2 mb-4 border-b border-slate-900 pb-3 shrink-0">
          <User className="h-5 w-5 text-purple-400" />
          <div>
            <h3 className="text-lg font-bold text-white">Candidate Profiler Settings</h3>
            <p className="text-xs text-slate-500">Configure your credentials, contact URLs, and custom variables for email templates.</p>
          </div>
        </div>

        {loading && (
          <div className="absolute inset-0 bg-slate-950/70 z-50 rounded-2xl flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          </div>
        )}

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 pr-1">
          
          {/* Main Credentials */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">Full Name</label>
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-850 rounded-xl px-3.5 py-2">
                <User className="h-4 w-4 text-slate-500" />
                <input 
                  type="text"
                  required
                  value={profile.fullName}
                  onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                  placeholder="Gudla Ashrith Balaji"
                  className="bg-transparent border-0 outline-none text-xs text-slate-200 w-full placeholder:text-slate-700"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">Target Job Role</label>
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-850 rounded-xl px-3.5 py-2">
                <Briefcase className="h-4 w-4 text-slate-500" />
                <input 
                  type="text"
                  required
                  value={profile.roleName}
                  onChange={(e) => setProfile({...profile, roleName: e.target.value})}
                  placeholder="Java Backend Developer"
                  className="bg-transparent border-0 outline-none text-xs text-slate-200 w-full placeholder:text-slate-700"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">Email Address</label>
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-850 rounded-xl px-3.5 py-2">
                <Mail className="h-4 w-4 text-slate-500" />
                <input 
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  placeholder="ashrithbalajigudla@gmail.com"
                  className="bg-transparent border-0 outline-none text-xs text-slate-200 w-full placeholder:text-slate-700"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">Phone Number</label>
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-850 rounded-xl px-3.5 py-2">
                <Phone className="h-4 w-4 text-slate-500" />
                <input 
                  type="text"
                  value={profile.phoneNumber}
                  onChange={(e) => setProfile({...profile, phoneNumber: e.target.value})}
                  placeholder="+91 XXXXX XXXXX"
                  className="bg-transparent border-0 outline-none text-xs text-slate-200 w-full placeholder:text-slate-700"
                />
              </div>
            </div>
          </div>

          {/* Social and Profiles */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">LinkedIn Profile URL</label>
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-850 rounded-xl px-3.5 py-2">
                <Link className="h-4 w-4 text-slate-500" />
                <input 
                  type="text"
                  value={profile.linkedinUrl}
                  onChange={(e) => setProfile({...profile, linkedinUrl: e.target.value})}
                  placeholder="linkedin.com/in/username"
                  className="bg-transparent border-0 outline-none text-xs text-slate-200 w-full placeholder:text-slate-700"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">GitHub Profile URL</label>
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-850 rounded-xl px-3.5 py-2">
                <Link className="h-4 w-4 text-slate-500" />
                <input 
                  type="text"
                  value={profile.githubUrl}
                  onChange={(e) => setProfile({...profile, githubUrl: e.target.value})}
                  placeholder="github.com/username"
                  className="bg-transparent border-0 outline-none text-xs text-slate-200 w-full placeholder:text-slate-700"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1.5">Candidate Location</label>
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-850 rounded-xl px-3.5 py-2">
              <MapPin className="h-4 w-4 text-slate-500" />
              <input 
                type="text"
                value={profile.location}
                onChange={(e) => setProfile({...profile, location: e.target.value})}
                placeholder="City, Country"
                className="bg-transparent border-0 outline-none text-xs text-slate-200 w-full placeholder:text-slate-700"
              />
            </div>
          </div>

          {/* Dynamic Custom Fields */}
          <div className="border-t border-slate-900 pt-4 mt-6">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Custom Variables</h4>
                <p className="text-[10px] text-slate-500">Create new fields to map to template placeholders (e.g. key "experience" resolves to {"{{experience}}"})</p>
              </div>
              <button
                type="button"
                onClick={handleAddCustomField}
                className="flex items-center gap-1 bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 border border-purple-600/20 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
              >
                <Plus className="h-3.5 w-3.5" /> Add Field
              </button>
            </div>

            {customFields.length === 0 ? (
              <div className="text-center py-4 bg-slate-900/40 border border-dashed border-slate-850 rounded-xl text-xs text-slate-500 italic">
                No custom variables created yet. Click "Add Field" to define dynamic values.
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {customFields.map((field, idx) => (
                  <div key={idx} className="flex gap-2 items-center bg-slate-900/60 p-2 border border-slate-850 rounded-xl">
                    <input 
                      type="text"
                      placeholder="Placeholder Key (e.g. experience)"
                      value={field.key}
                      onChange={(e) => handleCustomFieldChange(idx, 'key', e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-purple-600"
                    />
                    <input 
                      type="text"
                      placeholder="Placeholder Value"
                      value={field.value}
                      onChange={(e) => handleCustomFieldChange(idx, 'value', e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-purple-600"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveCustomField(idx)}
                      className="p-2 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 rounded-lg text-slate-500 hover:text-rose-400 cursor-pointer transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="flex gap-3 justify-end pt-4 border-t border-slate-900 mt-6 shrink-0">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold transition-all duration-200 cursor-pointer shadow-lg shadow-purple-500/20"
            >
              Save Changes
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
