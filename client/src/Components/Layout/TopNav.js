import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useUI } from '../../contexts/UIContext';
import { useCategories } from '../../contexts/CategoryContext';
import { useSites } from '../../contexts/SiteContext';
import { Search, Settings, LogOut, Shield, Info, MessageSquare, LogIn } from 'lucide-react';
import './TopNav.css';

export default function TopNav() {
  const { token, adminToken, username, logout, adminLogout } = useAuth();
  const { 
    toggleSpotlight, 
    toggleSettings, 
    openModal, 
    showHomeSites, 
    setShowHomeSites,
    editMode,
    setEditMode,
    adminEditMode,
    setAdminEditMode
  } = useUI();
  
  const { commonCategories, userCategories } = useCategories();
  const { lockedUsers } = useSites();
  const isLocked = token && lockedUsers.includes(username);

  // Explicit dropdown states
  const [activeDropdown, setActiveDropdown] = useState(null); // 'categories' | 'view' | 'admin' | null
  const topNavRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (topNavRef.current && !topNavRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogoutClick = () => {
    if (adminToken) {
      adminLogout();
    } else {
      logout();
    }
    setActiveDropdown(null);
  };

  const handleDropdownToggle = (name) => {
    setActiveDropdown(prev => prev === name ? null : name);
  };

  const activeCategories = token ? userCategories : commonCategories;

  return (
    <header className="topnav-glass" ref={topNavRef}>
      <div className="topnav-left">
        <div className="topnav-logo">
          <img src="https://i.ibb.co/twFfTph6/pngegg.png" alt="Glance Logo" />
          <span>{token ? username : 'GLANCE'}</span>
        </div>
      </div>

      <div className="topnav-center" onClick={toggleSpotlight}>
        <div className="search-trigger-bar">
          <Search size={16} />
          <span>Search websites or Google...</span>
          <span className="shortcut-hint">⌘K</span>
        </div>
      </div>

      <div className="topnav-right">
        {/* Categories Menu */}
        <div className="topnav-dropdown">
          <button 
            className={`topnav-menu-btn ${activeDropdown === 'categories' ? 'active' : ''}`}
            onClick={() => handleDropdownToggle('categories')}
          >
            Categories
          </button>
          {activeDropdown === 'categories' && (
            <div className="dropdown-panel show">
              {activeCategories.length === 0 ? (
                <span className="dropdown-empty">No categories</span>
              ) : (
                activeCategories.map((cat) => {
                  const name = cat.Category || cat.Name;
                  const linkId = name.replace(/\s+/g, '-').toLowerCase();
                  return (
                    <a 
                      key={cat._id} 
                      href={`#${linkId}`} 
                      className="dropdown-item"
                      onClick={() => setActiveDropdown(null)}
                    >
                      {name}
                    </a>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* View mode settings */}
        {token && (
          <div className="topnav-dropdown">
            <button 
              className={`topnav-menu-btn ${activeDropdown === 'view' ? 'active' : ''}`}
              onClick={() => handleDropdownToggle('view')}
            >
              View
            </button>
            {activeDropdown === 'view' && (
              <div className="dropdown-panel show">
                <label className="dropdown-item-checkbox">
                  <input 
                    type="checkbox" 
                    checked={showHomeSites} 
                    onChange={(e) => setShowHomeSites(e.target.checked)} 
                  />
                  Show Public Sites
                </label>
                {!isLocked && (
                  <label className="dropdown-item-checkbox">
                    <input 
                      type="checkbox" 
                      checked={editMode} 
                      onChange={(e) => setEditMode(e.target.checked)} 
                    />
                    Edit Mode
                  </label>
                )}
              </div>
            )}
          </div>
        )}

        {adminToken && (
          <div className="topnav-dropdown">
            <button 
              className={`topnav-menu-btn ${activeDropdown === 'admin' ? 'active' : ''}`}
              onClick={() => handleDropdownToggle('admin')}
            >
              Admin
            </button>
            {activeDropdown === 'admin' && (
              <div className="dropdown-panel show">
                <label className="dropdown-item-checkbox">
                  <input 
                    type="checkbox" 
                    checked={adminEditMode} 
                    onChange={(e) => setAdminEditMode(e.target.checked)} 
                  />
                  Edit Dashboard
                </label>
                <button 
                  className="dropdown-item" 
                  onClick={() => {
                    openModal('feedbacksList');
                    setActiveDropdown(null);
                  }}
                >
                  Show Feedback
                </button>
              </div>
            )}
          </div>
        )}

        {!token && !adminToken && (
          <>
            <button className="topnav-icon-btn" onClick={() => openModal('about')} title="About Glance">
              <Info size={18} />
            </button>
            <button className="topnav-icon-btn" onClick={() => openModal('feedback')} title="Submit Feedback">
              <MessageSquare size={18} />
            </button>
            <button className="topnav-icon-btn text-success" onClick={() => openModal('login')} title="User Login">
              <LogIn size={18} />
            </button>
            <button className="topnav-icon-btn text-danger" onClick={() => openModal('adminLogin')} title="Admin Login">
              <Shield size={18} />
            </button>
          </>
        )}

        {(token || adminToken) && (
          <>
            <button className="topnav-icon-btn" onClick={toggleSettings} title="Settings Panel">
              <Settings size={18} />
            </button>
            <button className="topnav-icon-btn text-danger" onClick={handleLogoutClick} title="Logout">
              <LogOut size={18} />
            </button>
          </>
        )}
      </div>
    </header>
  );
}
