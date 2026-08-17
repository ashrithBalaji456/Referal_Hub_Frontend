import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export default function CustomSelect({ value, onChange, options, placeholder = "Select...", className = "", selectClassName = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close the dropdown when clicking outside of it
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value?.toString() === value?.toString());
  const displayLabel = selectedOption ? selectedOption.label : placeholder;

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-2 bg-slate-900 border border-slate-850 hover:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-300 outline-none focus:border-purple-600 transition-all cursor-pointer select-none text-left min-w-[120px] ${selectClassName}`}
      >
        <span className="truncate">{displayLabel}</span>
        <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1.5 min-w-[150px] bg-slate-950 border border-slate-800 rounded-xl shadow-2xl py-1 z-50 max-h-60 overflow-y-auto w-max">
          {options.map((opt) => {
            const isSelected = opt.value?.toString() === value?.toString();
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs transition-colors cursor-pointer select-none block ${
                  isSelected 
                    ? 'bg-purple-600/10 text-purple-400 font-semibold' 
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
