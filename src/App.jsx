import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Toast from './components/Toast';

// Pages
import Dashboard from './pages/Dashboard';
import Recruiters from './pages/Recruiters';
import Templates from './pages/Templates';
import Resumes from './pages/Resumes';
import Campaigns from './pages/Campaigns';
import History from './pages/History';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard setActiveTab={setActiveTab} showToast={showToast} />;
      case 'recruiters':
        return <Recruiters showToast={showToast} />;
      case 'templates':
        return <Templates showToast={showToast} />;
      case 'resumes':
        return <Resumes showToast={showToast} />;
      case 'campaigns':
        return <Campaigns showToast={showToast} />;
      case 'history':
        return <History showToast={showToast} />;
      default:
        return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-8 lg:p-10 max-w-7xl">
        {renderContent()}
      </main>

      {/* Toast Notification Layer */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
}
