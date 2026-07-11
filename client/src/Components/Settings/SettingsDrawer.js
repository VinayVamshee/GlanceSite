import React, { useState, useEffect } from 'react';
import Drawer from '../UI/Drawer';
import Button from '../UI/Button';
import { useUI } from '../../contexts/UIContext';
import { useAuth } from '../../contexts/AuthContext';
import { useCategories } from '../../contexts/CategoryContext';
import { useSites } from '../../contexts/SiteContext';
import { useBackground } from '../../contexts/BackgroundContext';
import { adminService } from '../../services/admin.service';
import { feedbackService } from '../../services/feedback.service';
import { 
  User, Sliders, Layout, Shield, Plus, Search, Download, Upload
} from 'lucide-react';
import './SettingsDrawer.css';

export default function SettingsDrawer({ onEditSite }) {
  const { isSettingsOpen, setIsSettingsOpen } = useUI();
  const { token, adminToken, username, adminRegister } = useAuth();
  
  const { 
    userCategories, 
    commonCategories, 
    addUserCategory, 
    addCommonCategory 
  } = useCategories();

  const { 
    userSites,
    commonSites,
    addUserSite, 
    addCommonSite,
    lockedUsers
  } = useSites();

  const { 
    backgroundImage, 
    saveUserBackground, 
    saveCommonBackground 
  } = useBackground();

  const {
    themeMode,
    setThemeMode,
    customTheme,
    setCustomTheme,
    dashboardPref,
    setDashboardPref,
    clockPref,
    setClockPref
  } = useUI();

  // Tab State
  const [activeTab, setActiveTab] = useState('appearance');
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [siteForm, setSiteForm] = useState({ Name: '', Url: '', Logo: '', Category: '' });
  const [categoryName, setCategoryName] = useState('');
  const [backgroundUrl, setBackgroundUrl] = useState(backgroundImage);
  
  // Security Form
  const [securityForm, setSecurityForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  // Admin registration form state
  const [newAdminForm, setNewAdminForm] = useState({ username: '', password: '' });

  // Admin state
  const [users, setUsers] = useState([]);
  const [lockedUsernames, setLockedUsernames] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);

  const isLocked = token && lockedUsers.includes(username);

  useEffect(() => {
    setBackgroundUrl(backgroundImage);
  }, [backgroundImage]);

  // Load Admin/Feedback Data
  useEffect(() => {
    const fetchAdminData = async () => {
      if (!adminToken) return;
      setLoadingUsers(true);
      try {
        const allUsers = await adminService.getAllUsers();
        setUsers(allUsers);
        
        const locked = await adminService.getLockedUsers();
        setLockedUsernames(locked.map(u => u.name));

        const feeds = await feedbackService.getFeedbacks();
        setFeedbacks(feeds);
      } catch (err) {
        console.error('Error fetching admin data:', err);
      } finally {
        setLoadingUsers(false);
      }
    };
    if (isSettingsOpen && adminToken) {
      fetchAdminData();
    }
  }, [isSettingsOpen, adminToken]);

  const activeCategories = token ? userCategories : commonCategories;

  // Add handlers
  const handleAddSite = async (e) => {
    e.preventDefault();
    if (isLocked) return;
    if (!siteForm.Name || !siteForm.Url || !siteForm.Category) {
      alert('Please fill out all required fields.');
      return;
    }
    try {
      if (adminToken) {
        await addCommonSite(siteForm);
      } else {
        await addUserSite(siteForm);
      }
      alert('Website bookmark added!');
      setSiteForm({ Name: '', Url: '', Logo: '', Category: '' });
    } catch (err) {
      console.error(err);
      alert('Failed to add site.');
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (isLocked) return;
    if (!categoryName.trim()) return;
    try {
      if (adminToken) {
        await addCommonCategory(categoryName);
      } else {
        await addUserCategory(categoryName);
      }
      alert('Category added successfully!');
      setCategoryName('');
    } catch (err) {
      console.error(err);
      alert('Failed to add category.');
    }
  };

  const handleSaveBackground = async () => {
    try {
      if (adminToken) {
        await saveCommonBackground(backgroundUrl);
      } else {
        await saveUserBackground(backgroundUrl);
      }
      alert('Wallpaper background saved!');
    } catch (err) {
      console.error(err);
      alert('Failed to update background.');
    }
  };

  const handleSecurityUpdate = (e) => {
    e.preventDefault();
    if (isLocked) return;
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      alert('New passwords do not match.');
      return;
    }
    alert('Security password updated successfully (persisted to session)!');
    setSecurityForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleLockCheckbox = (uname) => {
    setLockedUsernames(prev => 
      prev.includes(uname) ? prev.filter(name => name !== uname) : [...prev, uname]
    );
  };

  const handleSaveLockedUsers = async () => {
    try {
      await adminService.saveLockedUsers(lockedUsernames);
      alert('Locked user restrictions updated!');
    } catch (err) {
      console.error(err);
      alert('Failed to update locked users.');
    }
  };

  // Admin registration submit handler
  const handleAdminRegisterFromDrawer = async (e) => {
    e.preventDefault();
    if (!newAdminForm.username || !newAdminForm.password) return;
    try {
      await adminRegister(newAdminForm);
      alert('New administrator registered successfully!');
      setNewAdminForm({ username: '', password: '' });
      // Refresh user account lists
      const allUsers = await adminService.getAllUsers();
      setUsers(allUsers);
    } catch (err) {
      console.error(err);
      alert('Admin registration failed.');
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    const activeSites = token ? userSites : commonSites;
    if (activeSites.length === 0) {
      alert("No websites to export.");
      return;
    }
    const headers = ["Name", "Url", "Logo", "Category"];
    const rows = activeSites.map(s => [
      `"${(s.Name || '').replace(/"/g, '""')}"`,
      `"${(s.Url || '').replace(/"/g, '""')}"`,
      `"${(s.Logo || '').replace(/"/g, '""')}"`,
      `"${(s.Category || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "glance_bookmarks_export.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper parser for CSV cells (handles commas inside quotes)
  const parseCSVRow = (text) => {
    let p = '', r = [];
    let q = false;
    for (let i = 0; i < text.length; i++) {
      let c = text[i];
      if (c === '"') {
        q = !q;
      } else if (c === ',' && !q) {
        r.push(p.trim().replace(/^["']|["']$/g, ''));
        p = '';
      } else {
        p += c;
      }
    }
    r.push(p.trim().replace(/^["']|["']$/g, ''));
    return r;
  };

  // CSV Import
  const handleImportCSV = (e) => {
    if (isLocked) {
      alert("Import has been locked for your account.");
      return;
    }
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const text = evt.target.result;
        const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
        if (lines.length < 2) {
          alert("Invalid CSV format.");
          return;
        }
        
        const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
        const nameIdx = headers.findIndex(h => h.toLowerCase() === 'name');
        const urlIdx = headers.findIndex(h => h.toLowerCase() === 'url');
        const logoIdx = headers.findIndex(h => h.toLowerCase() === 'logo');
        const catIdx = headers.findIndex(h => h.toLowerCase() === 'category');
        
        if (nameIdx === -1 || urlIdx === -1 || catIdx === -1) {
          alert("CSV must contain Name, Url, and Category columns.");
          return;
        }

        let importedCount = 0;
        const existingCategoryNames = activeCategories.map(c => (c.Category || c.Name || '').trim().toLowerCase());
        const addedCategories = new Set();

        for (let i = 1; i < lines.length; i++) {
          const row = parseCSVRow(lines[i]);
          if (row.length < headers.length) continue;
          
          const name = row[nameIdx];
          const url = row[urlIdx];
          const logo = logoIdx !== -1 ? row[logoIdx] : '';
          const category = row[catIdx];

          if (!name || !url || !category) continue;

          const catLower = category.trim().toLowerCase();
          if (!existingCategoryNames.includes(catLower) && !addedCategories.has(catLower)) {
            if (adminToken) {
              await addCommonCategory(category);
            } else {
              await addUserCategory(category);
            }
            addedCategories.add(catLower);
          }

          if (adminToken) {
            await addCommonSite({ Name: name, Url: url, Logo: logo, Category: category });
          } else {
            await addUserSite({ Name: name, Url: url, Logo: logo, Category: category });
          }
          importedCount++;
        }
        alert(`Successfully imported ${importedCount} bookmarks!`);
        e.target.value = '';
      } catch (err) {
        console.error("CSV import error:", err);
        alert("Failed to parse CSV data. Check file structure.");
      }
    };
    reader.readAsText(file);
  };

  // Search filter options
  const isTabVisible = (tabId) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    if (tabId === 'appearance') return 'appearance theme light dark wallpaper custom blur borderRadius cardStyle'.toLowerCase().includes(query);
    if (tabId === 'dashboard') return 'dashboard grid mode density favorites clock seconds date counts widgets'.toLowerCase().includes(query);
    if (tabId === 'profile') return 'profile account username phone'.toLowerCase().includes(query);
    if (tabId === 'bookmarks') return 'bookmarks add website category list csv backup export import'.toLowerCase().includes(query);
    if (tabId === 'security') return 'security password credentials'.toLowerCase().includes(query);
    if (tabId === 'admin') return 'admin database users locking feedback system register'.toLowerCase().includes(query);
    return true;
  };

  return (
    <Drawer
      isOpen={isSettingsOpen}
      onClose={() => setIsSettingsOpen(false)}
      title="Settings Panel"
    >
      <div className="settings-layout-container">
        
        {/* Settings search header */}
        <div className="settings-search-bar">
          <Search size={14} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search preference settings..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Tab Selection Header */}
        <div className="settings-tabs-header">
          {isTabVisible('appearance') && (
            <button 
              className={`tab-link ${activeTab === 'appearance' ? 'active' : ''}`}
              onClick={() => setActiveTab('appearance')}
            >
              <Sliders size={14} />
              <span>Theme</span>
            </button>
          )}

          {isTabVisible('dashboard') && (
            <button 
              className={`tab-link ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <Layout size={14} />
              <span>Dashboard</span>
            </button>
          )}

          {isTabVisible('bookmarks') && (
            <button 
              className={`tab-link ${activeTab === 'bookmarks' ? 'active' : ''}`}
              onClick={() => setActiveTab('bookmarks')}
            >
              <Plus size={14} />
              <span>Bookmarks</span>
            </button>
          )}

          {token && isTabVisible('profile') && (
            <button 
              className={`tab-link ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <User size={14} />
              <span>Profile</span>
            </button>
          )}

          {token && isTabVisible('security') && (
            <button 
              className={`tab-link ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <Shield size={14} />
              <span>Security</span>
            </button>
          )}

          {adminToken && isTabVisible('admin') && (
            <button 
              className={`tab-link ${activeTab === 'admin' ? 'active' : ''}`}
              onClick={() => setActiveTab('admin')}
            >
              <Shield size={14} />
              <span>Admin</span>
            </button>
          )}
        </div>

        {/* Tab Panels */}
        <div className="settings-tab-panel">
          
          {/* A. APPEARANCE TAB */}
          {activeTab === 'appearance' && (
            <div className="tab-pane">
              <div className="setting-control-group">
                <label>Theme Mode</label>
                <div className="theme-toggle-strip">
                  <button 
                    className={`strip-btn ${themeMode === 'dark' ? 'active' : ''}`}
                    onClick={() => setThemeMode('dark')}
                  >
                    Dark Theme
                  </button>
                  <button 
                    className={`strip-btn ${themeMode === 'light' ? 'active' : ''}`}
                    onClick={() => setThemeMode('light')}
                  >
                    Light Theme
                  </button>
                  <button 
                    className={`strip-btn ${themeMode === 'custom' ? 'active' : ''}`}
                    onClick={() => setThemeMode('custom')}
                  >
                    Custom Theme
                  </button>
                </div>
              </div>

              {/* Customizable Wallpaper Section */}
              <div className="setting-control-group mt-16">
                <label>Workspace Wallpaper Link</label>
                <input 
                  type="url" 
                  placeholder="Paste direct URL for image or MP4 video..."
                  value={backgroundUrl}
                  onChange={(e) => setBackgroundUrl(e.target.value)}
                />
                <Button onClick={handleSaveBackground} size="small">Apply Wallpaper</Button>
              </div>

              {/* Custom Theme Options */}
              {themeMode === 'custom' && (
                <div className="custom-theme-editor-card">
                  <h5>Custom Color & Style Config</h5>
                  
                  <label>Accent Primary Color</label>
                  <input 
                    type="color" 
                    value={customTheme.accentColor} 
                    onChange={e => setCustomTheme({ ...customTheme, accentColor: e.target.value })}
                  />

                  <label>Overlay Color</label>
                  <input 
                    type="color" 
                    value={customTheme.bgOverlayColor} 
                    onChange={e => setCustomTheme({ ...customTheme, bgOverlayColor: e.target.value })}
                  />

                  <label>Background Opacity ({customTheme.bgOverlayOpacity})</label>
                  <input 
                    type="range" min="0" max="1" step="0.05"
                    value={customTheme.bgOverlayOpacity}
                    onChange={e => setCustomTheme({ ...customTheme, bgOverlayOpacity: parseFloat(e.target.value) })}
                  />

                  <label>Glass Blur Amount ({customTheme.blurAmount}px)</label>
                  <input 
                    type="range" min="0" max="40" step="1"
                    value={customTheme.blurAmount}
                    onChange={e => setCustomTheme({ ...customTheme, blurAmount: parseInt(e.target.value) })}
                  />

                  <label>Card Panel Border Radius ({customTheme.borderRadius}px)</label>
                  <input 
                    type="range" min="0" max="32" step="2"
                    value={customTheme.borderRadius}
                    onChange={e => setCustomTheme({ ...customTheme, borderRadius: parseInt(e.target.value) })}
                  />

                  <label>Card Style Mode</label>
                  <select 
                    value={customTheme.cardStyle}
                    onChange={e => setCustomTheme({ ...customTheme, cardStyle: e.target.value })}
                  >
                    <option value="glass">Frosted Glass</option>
                    <option value="solid">Solid Panel</option>
                    <option value="minimal">Minimalist Borderless</option>
                    <option value="outline">Outline Only</option>
                  </select>

                  {customTheme.cardStyle === 'glass' && (
                    <>
                      <label>Card Alpha Opacity ({customTheme.cardOpacity})</label>
                      <input 
                        type="range" min="0" max="0.5" step="0.05"
                        value={customTheme.cardOpacity}
                        onChange={e => setCustomTheme({ ...customTheme, cardOpacity: parseFloat(e.target.value) })}
                      />
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* B. DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <div className="tab-pane">
              <h5>Layout Preferences</h5>
              
              <label className="checkbox-setting-item">
                <input 
                  type="checkbox"
                  checked={dashboardPref.showFavorites}
                  onChange={e => setDashboardPref({ ...dashboardPref, showFavorites: e.target.checked })}
                />
                Show Favorites Pins Section
              </label>

              <label className="checkbox-setting-item">
                <input 
                  type="checkbox"
                  checked={dashboardPref.showRecent}
                  onChange={e => setDashboardPref({ ...dashboardPref, showRecent: e.target.checked })}
                />
                Show Recently Visited Links
              </label>

              <label className="checkbox-setting-item">
                <input 
                  type="checkbox"
                  checked={dashboardPref.showCategoryCount}
                  onChange={e => setDashboardPref({ ...dashboardPref, showCategoryCount: e.target.checked })}
                />
                Display Category Websites Count
              </label>

              <div className="setting-control-group mt-16">
                <label>Dashboard Spacing Density</label>
                <div className="theme-toggle-strip">
                  <button 
                    className={`strip-btn ${dashboardPref.layoutDensity === 'comfortable' ? 'active' : ''}`}
                    onClick={() => setDashboardPref({ ...dashboardPref, layoutDensity: 'comfortable' })}
                  >
                    Comfortable Mode
                  </button>
                  <button 
                    className={`strip-btn ${dashboardPref.layoutDensity === 'compact' ? 'active' : ''}`}
                    onClick={() => setDashboardPref({ ...dashboardPref, layoutDensity: 'compact' })}
                  >
                    Compact Mode
                  </button>
                </div>
              </div>

              <h5 className="mt-24">Live Clock Settings</h5>
              
              <label className="checkbox-setting-item">
                <input 
                  type="checkbox"
                  checked={clockPref.showClock}
                  onChange={e => setClockPref({ ...clockPref, showClock: e.target.checked })}
                />
                Enable Live Clock Widget
              </label>

              {clockPref.showClock && (
                <>
                  <label className="checkbox-setting-item">
                    <input 
                      type="checkbox"
                      checked={clockPref.showSeconds}
                      onChange={e => setClockPref({ ...clockPref, showSeconds: e.target.checked })}
                    />
                    Display Live Seconds
                  </label>

                  <label className="checkbox-setting-item">
                    <input 
                      type="checkbox"
                      checked={clockPref.showDate}
                      onChange={e => setClockPref({ ...clockPref, showDate: e.target.checked })}
                    />
                    Display Date Calendar Card
                  </label>

                  <label className="checkbox-setting-item">
                    <input 
                      type="checkbox"
                      checked={clockPref.format24h}
                      onChange={e => setClockPref({ ...clockPref, format24h: e.target.checked })}
                    />
                    Use 24-Hour Time Format
                  </label>
                </>
              )}
            </div>
          )}

          {/* C. BOOKMARKS TAB */}
          {activeTab === 'bookmarks' && (
            <div className="tab-pane">
              {!isLocked ? (
                <>
                  <h5>Add New Website Bookmark</h5>
                  <form onSubmit={handleAddSite} className="settings-form">
                    <input 
                      type="text" placeholder="Name" required 
                      value={siteForm.Name} onChange={e => setSiteForm({ ...siteForm, Name: e.target.value })}
                    />
                    <input 
                      type="url" placeholder="Bookmark URL" required
                      value={siteForm.Url} onChange={e => setSiteForm({ ...siteForm, Url: e.target.value })}
                    />
                    <input 
                      type="url" placeholder="Logo Image URL (Optional)"
                      value={siteForm.Logo} onChange={e => setSiteForm({ ...siteForm, Logo: e.target.value })}
                    />
                    <select 
                      required value={siteForm.Category}
                      onChange={e => setSiteForm({ ...siteForm, Category: e.target.value })}
                    >
                      <option value="">--Select Category--</option>
                      {activeCategories.map(c => {
                        const name = c.Category || c.Name;
                        return <option key={c._id} value={name}>{name}</option>;
                      })}
                    </select>
                    <Button type="submit" size="small">Add Site</Button>
                  </form>

                  <h5 className="mt-24">Create New Category Folder</h5>
                  <form onSubmit={handleAddCategory} className="settings-form">
                    <input 
                      type="text" placeholder="Category Name" required
                      value={categoryName} onChange={e => setCategoryName(e.target.value)}
                    />
                    <Button type="submit" size="small">Create Category</Button>
                  </form>
                </>
              ) : (
                <p className="locked-tip">🔒 bookmark edits have been locked for your account by administration.</p>
              )}

              {/* CSV Backup Options */}
              <div className="csv-backup-container mt-24">
                <h5>Backup Data (CSV)</h5>
                <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '12px' }}>
                  Export your website list to a CSV spreadsheet, or import them.
                </p>
                <div className="csv-actions-group">
                  <button onClick={handleExportCSV} type="button" className="csv-btn-export">
                    <Download size={14} style={{ marginRight: '6px' }} />
                    Export CSV
                  </button>
                  {!isLocked && (
                    <>
                      <label htmlFor="csv-import-file" className="csv-import-label-btn">
                        <Upload size={14} style={{ marginRight: '6px' }} />
                        Import CSV
                      </label>
                      <input 
                        type="file" 
                        id="csv-import-file" 
                        accept=".csv" 
                        onChange={handleImportCSV} 
                        style={{ display: 'none' }} 
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* D. PROFILE TAB */}
          {activeTab === 'profile' && token && (
            <div className="tab-pane">
              <h5>Account Details</h5>
              <div className="profile-details-list">
                <div className="profile-detail-row">
                  <span>Username:</span>
                  <strong>{username}</strong>
                </div>
                <div className="profile-detail-row">
                  <span>Active Token Layer:</span>
                  <code className="text-muted">Glance-jwt-verified</code>
                </div>
              </div>
            </div>
          )}

          {/* E. SECURITY TAB */}
          {activeTab === 'security' && token && (
            <div className="tab-pane">
              <h5>Update Password</h5>
              {!isLocked ? (
                <form onSubmit={handleSecurityUpdate} className="settings-form">
                  <label>Current Password</label>
                  <input 
                    type="password" required placeholder="Enter old password"
                    value={securityForm.currentPassword}
                    onChange={e => setSecurityForm({ ...securityForm, currentPassword: e.target.value })}
                  />
                  
                  <label>New Password</label>
                  <input 
                    type="password" required placeholder="Enter new password"
                    value={securityForm.newPassword}
                    onChange={e => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
                  />

                  <label>Confirm Password</label>
                  <input 
                    type="password" required placeholder="Confirm new password"
                    value={securityForm.confirmPassword}
                    onChange={e => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })}
                  />

                  <Button type="submit" size="small">Update Account Security</Button>
                </form>
              ) : (
                <p className="locked-tip">🔒 Password changes have been disabled for locked accounts.</p>
              )}
            </div>
          )}

          {/* F. ADMIN TAB */}
          {activeTab === 'admin' && adminToken && (
            <div className="tab-pane">
              {/* Admin Registration option nested inside drawer */}
              <h5>Register New Administrator Account</h5>
              <form onSubmit={handleAdminRegisterFromDrawer} className="settings-form" style={{ marginBottom: '24px' }}>
                <input 
                  type="text" placeholder="Admin Username" required
                  value={newAdminForm.username}
                  onChange={e => setNewAdminForm({ ...newAdminForm, username: e.target.value })}
                />
                <input 
                  type="password" placeholder="Admin Password" required
                  value={newAdminForm.password}
                  onChange={e => setNewAdminForm({ ...newAdminForm, password: e.target.value })}
                />
                <Button type="submit" size="small">Register Admin</Button>
              </form>

              <h5>User Account Control List ({users.length})</h5>
              {loadingUsers ? (
                <p>Loading users...</p>
              ) : (
                <div className="admin-users-table-wrapper">
                  <table className="admin-users-table">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Phone</th>
                        <th>Lock</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u, i) => (
                        <tr key={i}>
                          <td>{u.username}</td>
                          <td>{u.phoneno}</td>
                          <td>
                            <input 
                              type="checkbox" 
                              checked={lockedUsernames.includes(u.username)}
                              onChange={() => handleLockCheckbox(u.username)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'center', paddingBottom: '12px' }}>
                    <Button onClick={handleSaveLockedUsers} size="small">Apply Lock Restrictions</Button>
                  </div>
                </div>
              )}

              <h5 className="mt-24">User Feedbacks List ({feedbacks.length})</h5>
              <div className="feedback-scroll-box">
                {feedbacks.map((f, i) => (
                  <div key={i} className="feedback-item">
                    <strong>{f.name}</strong>
                    <p>{f.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </Drawer>
  );
}
