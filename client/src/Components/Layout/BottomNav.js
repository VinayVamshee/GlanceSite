import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useUI } from '../../contexts/UIContext';
import { Search, Settings, Shield, Info, MessageSquare, LogIn, LogOut } from 'lucide-react';
import './BottomNav.css';

export default function BottomNav() {
  const { token, adminToken, logout, adminLogout } = useAuth();
  const { toggleSpotlight, toggleSettings, openModal } = useUI();

  return (
    <nav className="bottomnav-mobile">
      <div className="bottomnav-tab" onClick={() => openModal('about')}>
        <Info size={20} />
        <span>About</span>
      </div>

      <div className="bottomnav-tab" onClick={() => openModal('feedback')}>
        <MessageSquare size={20} />
        <span>Feedback</span>
      </div>

      {/* Floating search triggers spotlight overlay */}
      <div className="bottomnav-center-action" onClick={toggleSpotlight}>
        <div className="center-action-btn">
          <Search size={22} />
        </div>
      </div>

      {token || adminToken ? (
        <>
          <div className="bottomnav-tab" onClick={toggleSettings}>
            <Settings size={20} />
            <span>Settings</span>
          </div>
          <div className="bottomnav-tab text-danger" onClick={adminToken ? adminLogout : logout}>
            <LogOut size={20} />
            <span>Logout</span>
          </div>
        </>
      ) : (
        <>
          <div className="bottomnav-tab text-success" onClick={() => openModal('login')}>
            <LogIn size={20} />
            <span>Login</span>
          </div>
          <div className="bottomnav-tab text-danger" onClick={() => openModal('adminLogin')}>
            <Shield size={20} />
            <span>Admin</span>
          </div>
        </>
      )}
    </nav>
  );
}
