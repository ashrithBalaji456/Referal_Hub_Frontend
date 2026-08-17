import React, { useEffect, useState } from 'react';
import { historyApi } from '../services/api';
import CustomSelect from '../components/CustomSelect';
import CustomDatePicker from '../components/CustomDatePicker';
import { 
  Search, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Clock
} from 'lucide-react';

export default function History({ showToast }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('latest');

  // Filters State
  const [filters, setFilters] = useState({
    company: '',
    status: '',
    startDate: '',
    endDate: '',
  });

  const loadHistory = async () => {
    try {
      setLoading(true);

      // Format ISO string dates if provided
      const params = {
        company: filters.company || undefined,
        status: filters.status || undefined,
        startDate: filters.startDate ? `${filters.startDate}T00:00:00` : undefined,
        endDate: filters.endDate ? `${filters.endDate}T23:59:59` : undefined,
      };

      const res = await historyApi.getFiltered(params);
      setHistory(res.data || []);
    } catch (err) {
      console.error(err);
      showToast('Failed to load email history', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [filters.status, filters.startDate, filters.endDate]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadHistory();
  };

  const handleClearFilters = () => {
    setFilters({
      company: '',
      status: '',
      startDate: '',
      endDate: '',
    });
    setSortBy('latest');
  };

  useEffect(() => {
    if (filters.company === '') {
      loadHistory();
    }
  }, [filters.company]);

  const statusOptions = [
    { value: '', label: 'All Deliveries' },
    { value: 'SUCCESS', label: 'Success Only' },
    { value: 'FAILED', label: 'Failures Only' }
  ];

  const sortOptions = [
    { value: 'latest', label: 'Latest First' },
    { value: 'oldest', label: 'Oldest First' }
  ];

  return (
    <div className="space-y-6 animate-slide-in">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Outreach History Logs</h2>
        <p className="text-sm text-slate-400">Monitor and audit the results of your referral outreach emails.</p>
      </div>

      {/* Filter panel */}
      <form onSubmit={handleSearchSubmit} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Company Name</label>
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2">
            <Search className="h-4.5 w-4.5 text-slate-600" />
            <input 
              type="text" 
              placeholder="e.g. Netflix" 
              value={filters.company}
              onChange={(e) => setFilters({...filters, company: e.target.value})}
              className="bg-transparent border-0 outline-none text-xs text-slate-200 placeholder:text-slate-600 w-full"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Outreach Status</label>
          <CustomSelect
            value={filters.status}
            onChange={(val) => setFilters({...filters, status: val})}
            options={statusOptions}
            selectClassName="w-full py-2"
            className="w-full block"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Start Date</label>
          <CustomDatePicker
            value={filters.startDate}
            onChange={(val) => setFilters({...filters, startDate: val})}
            placeholder="Select Start Date"
            className="w-full block"
            buttonClassName="w-full py-2"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">End Date</label>
          <CustomDatePicker
            value={filters.endDate}
            onChange={(val) => setFilters({...filters, endDate: val})}
            placeholder="Select End Date"
            className="w-full block"
            buttonClassName="w-full py-2"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Sort By</label>
          <CustomSelect
            value={sortBy}
            onChange={setSortBy}
            options={sortOptions}
            selectClassName="w-full py-2"
            className="w-full block"
          />
        </div>

        <div className="flex gap-2">
          <button 
            type="submit"
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors cursor-pointer text-center select-none"
          >
            Apply
          </button>
          <button 
            type="button"
            onClick={handleClearFilters}
            className="bg-slate-900 hover:bg-slate-850 text-slate-400 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-800 transition-colors cursor-pointer text-center select-none"
          >
            Clear
          </button>
        </div>
      </form>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {history.length === 0 ? (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-12 text-center text-slate-500 italic">
              No outreach history logs found matching these parameters.
            </div>
          ) : (
            [...history]
              .sort((a, b) => {
                const timeA = new Date(a.sentTimestamp).getTime();
                const timeB = new Date(b.sentTimestamp).getTime();
                return sortBy === 'latest' ? timeB - timeA : timeA - timeB;
              })
              .map((log) => {
                const isSuccess = log.status === 'SUCCESS';
                return (
                  <div 
                    key={log.id} 
                    className={`bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition-colors`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-white text-sm">{log.recruiterName}</h3>
                          <span className="text-xs text-slate-500">({log.recipientEmail})</span>
                          <span className="text-slate-800 font-semibold">•</span>
                          <span className="text-xs text-purple-400 font-medium">{log.recruiterCompany}</span>
                        </div>
                        <p className="text-xs text-slate-400 font-semibold pr-2">Subject: <span className="text-slate-300 font-normal">{log.subjectUsed}</span></p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                          isSuccess ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                        }`}>
                          {isSuccess ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                          {isSuccess ? 'Success' : 'Failed'}
                        </span>
                        <span className="text-[10px] text-slate-500 flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {new Date(log.sentTimestamp).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Error Diagnostic */}
                    {!isSuccess && log.errorMessage && (
                      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-500/5 border border-rose-500/10">
                        <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">Diagnostic Error Code</span>
                          <p className="text-xs text-slate-300 mt-1 font-mono">{log.errorMessage}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
          )}
        </div>
      )}
    </div>
  );
}
