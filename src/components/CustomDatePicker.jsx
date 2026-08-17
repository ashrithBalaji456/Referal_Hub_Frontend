import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function CustomDatePicker({ 
  value, 
  onChange, 
  placeholder = "Select date...", 
  className = "", 
  buttonClassName = "" 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Parse YYYY-MM-DD or default to today for calendar view
  const parseDate = (val) => {
    if (!val) return null;
    const parts = val.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
    return null;
  };

  const selectedDate = parseDate(value);

  // View state for month/year navigation
  const [viewDate, setViewDate] = useState(() => selectedDate || new Date());

  useEffect(() => {
    if (selectedDate) {
      setViewDate(selectedDate);
    }
  }, [value]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();

  const handlePrevMonth = () => {
    setViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleSelectDay = (day) => {
    const monthStr = String(currentMonth + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const formatted = `${currentYear}-${monthStr}-${dayStr}`;
    onChange(formatted);
    setIsOpen(false);
  };

  const handleSelectToday = () => {
    const today = new Date();
    const monthStr = String(today.getMonth() + 1).padStart(2, '0');
    const dayStr = String(today.getDate()).padStart(2, '0');
    const formatted = `${today.getFullYear()}-${monthStr}-${dayStr}`;
    onChange(formatted);
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange('');
    setIsOpen(false);
  };

  // Calendar grid calculations
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  const calendarDays = [];

  // Previous month padding days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    calendarDays.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      isPrev: true
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push({
      day: d,
      isCurrentMonth: true
    });
  }

  // Next month padding days to fill 35 or 42 grid cells
  const remainingCells = (calendarDays.length > 35 ? 42 : 35) - calendarDays.length;
  for (let i = 1; i <= remainingCells; i++) {
    calendarDays.push({
      day: i,
      isCurrentMonth: false,
      isNext: true
    });
  }

  const isToday = (day) => {
    const today = new Date();
    return today.getFullYear() === currentYear &&
           today.getMonth() === currentMonth &&
           today.getDate() === day;
  };

  const isSelected = (day) => {
    if (!selectedDate) return false;
    return selectedDate.getFullYear() === currentYear &&
           selectedDate.getMonth() === currentMonth &&
           selectedDate.getDate() === day;
  };

  const formatDisplay = (val) => {
    const dateObj = parseDate(val);
    if (!dateObj) return null;
    return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className={`relative inline-block ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 outline-none focus:border-purple-600 transition-all cursor-pointer select-none text-left w-full ${buttonClassName}`}
      >
        <CalendarIcon className="h-4 w-4 text-purple-400 shrink-0" />
        <span className={`flex-1 truncate ${value ? 'text-slate-200 font-semibold' : 'text-slate-500'}`}>
          {formatDisplay(value) || placeholder}
        </span>
        {value && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              handleClear();
            }}
            className="p-0.5 hover:bg-slate-800 rounded-full text-slate-500 hover:text-slate-300 transition-colors"
          >
            <X className="h-3 w-3" />
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-72 bg-slate-950/95 border border-slate-800/90 backdrop-blur-xl rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
          {/* Header Month / Year controls */}
          <div className="flex items-center justify-between mb-3 px-1">
            <h4 className="text-xs font-bold text-slate-100">
              {monthNames[currentMonth]} {currentYear}
            </h4>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1 hover:bg-slate-850 rounded-lg text-slate-400 hover:text-white transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1 hover:bg-slate-850 rounded-lg text-slate-400 hover:text-white transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {daysOfWeek.map((day) => (
              <span key={day} className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                {day}
              </span>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {calendarDays.map((item, index) => {
              if (!item.isCurrentMonth) {
                return (
                  <span
                    key={index}
                    className="h-8 flex items-center justify-center text-xs text-slate-700 select-none"
                  >
                    {item.day}
                  </span>
                );
              }

              const selected = isSelected(item.day);
              const today = isToday(item.day);

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSelectDay(item.day)}
                  className={`h-8 w-8 mx-auto flex items-center justify-center text-xs rounded-xl transition-all select-none cursor-pointer ${
                    selected
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold shadow-lg shadow-purple-500/25 scale-105'
                      : today
                      ? 'border border-purple-500/60 text-purple-300 font-semibold hover:bg-slate-850'
                      : 'text-slate-300 hover:bg-slate-850 hover:text-white'
                  }`}
                >
                  {item.day}
                </button>
              );
            })}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between border-t border-slate-850 mt-3 pt-3 px-1 text-xs">
            <button
              type="button"
              onClick={handleClear}
              className="text-slate-400 hover:text-slate-200 transition-colors font-medium cursor-pointer"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleSelectToday}
              className="text-purple-400 hover:text-purple-300 font-semibold transition-colors cursor-pointer"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
