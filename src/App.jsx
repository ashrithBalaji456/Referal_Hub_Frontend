import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Toast from './components/Toast';
import ProfileModal from './components/ProfileModal';
import { profileApi } from './services/api';

// Pages
import Dashboard from './pages/Dashboard';
import Recruiters from './pages/Recruiters';
import Templates from './pages/Templates';
import Resumes from './pages/Resumes';
import Campaigns from './pages/Campaigns';
import History from './pages/History';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authToken'));
  const [authPage, setAuthPage] = useState('login');
  const [resetToken, setResetToken] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [toast, setToast] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navigateAuth = (page) => {
    setAuthPage(page);
    window.history.replaceState({}, document.title, `/${page}`);
  };

  useEffect(() => {
    // Check if password reset token is in URL query parameters
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const path = window.location.pathname;

    if (token) {
      setResetToken(token);
      setAuthPage('reset-password');
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (!isAuthenticated) {
      if (path === '/register') navigateAuth('register');
      else if (path === '/forgot-password') navigateAuth('forgot-password');
      else if (path === '/reset-password') navigateAuth('reset-password');
      else navigateAuth('login');
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadProfile();
      // Clean up /login, /register, etc. from browser address bar when logged in
      const authPaths = ['/login', '/register', '/forgot-password', '/reset-password'];
      if (authPaths.includes(window.location.pathname)) {
        window.history.replaceState({}, document.title, '/');
      }
    } else {
      setProfile(null);
    }
  }, [isAuthenticated]);

  const loadProfile = async () => {
    try {
      const res = await profileApi.get();
      setProfile(res.data);
    } catch (err) {
      console.error("Failed to load candidate profile on startup", err);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setActiveTab('dashboard');
    window.history.replaceState({}, document.title, '/');
    showToast('Signed in successfully!');
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    setIsAuthenticated(false);
    navigateAuth('login');
    showToast('Signed out successfully!', 'info');
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

  // If not authenticated, render Login, Register, ForgotPassword or ResetPassword pages
  if (!isAuthenticated) {
    if (authPage === 'register') {
      return (
        <Register 
          onRegisterSuccess={() => navigateAuth('login')} 
          onNavigateToLogin={() => navigateAuth('login')} 
        />
      );
    }
    if (authPage === 'forgot-password') {
      return (
        <ForgotPassword 
          onNavigateToLogin={() => navigateAuth('login')} 
        />
      );
    }
    if (authPage === 'reset-password') {
      return (
        <ResetPassword 
          token={resetToken} 
          onResetSuccess={() => {
            navigateAuth('login');
            setResetToken('');
          }} 
        />
      );
    }
    return (
      <Login 
        onLoginSuccess={handleLoginSuccess} 
        onNavigateToRegister={() => navigateAuth('register')} 
        onNavigateToForgotPassword={() => navigateAuth('forgot-password')} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex">
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        profile={profile}
        onOpenProfile={() => setIsProfileOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-8 lg:p-10 max-w-7xl">
        {renderContent()}
      </main>

      {/* Profile Settings Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        showToast={showToast}
        onProfileUpdate={(newProfile) => setProfile(newProfile)}
      />

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
