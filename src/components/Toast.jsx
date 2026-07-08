import React, { useEffect } from 'react';
import { CheckCircle2, XCircle, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = type === 'success';

  return (
    <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl animate-slide-in transition-all duration-300 ${
      isSuccess 
        ? 'bg-slate-900 border-emerald-500/20 text-emerald-400 shadow-emerald-500/5' 
        : 'bg-slate-900 border-rose-500/20 text-rose-400 shadow-rose-500/5'
    }`}>
      {isSuccess 
        ? <CheckCircle2 className="h-5 w-5 text-emerald-500 animate-bounce" /> 
        : <XCircle className="h-5 w-5 text-rose-500 animate-pulse" />
      }
      <span className="text-sm font-medium text-slate-200">{message}</span>
      <button 
        onClick={onClose}
        className="ml-2 hover:bg-slate-800 p-1 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
