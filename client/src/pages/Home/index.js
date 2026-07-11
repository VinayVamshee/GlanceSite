import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useUI } from '../../contexts/UIContext';
import { useSites } from '../../contexts/SiteContext';
import { useCategories } from '../../contexts/CategoryContext';
import CategorySection from '../../Components/Categories/CategorySection';
import WebSiteCard from '../../Components/Cards/WebSiteCard';
import Modal from '../../Components/UI/Modal';
import Button from '../../Components/UI/Button';
import { Star, Clock, FolderHeart, ShieldAlert, Sparkles } from 'lucide-react';
import './index.css';

import ClockWidget from '../../Components/UI/ClockWidget';

export default function Home() {
  const { token, adminToken, username } = useAuth();
  const { 
    editMode, 
    adminEditMode, 
    showHomeSites, 
    toggleSpotlight,
    dashboardPref
  } = useUI();
  
  const { 
    userSites, 
    commonSites, 
    favorites, 
    recentlyVisited, 
    updateUserSite, 
    updateCommonSite,
    categoryOrder,
    setCategoryOrder,
    lockedUsers
  } = useSites();
  
  const { userCategories, commonCategories } = useCategories();

  // Edit site form modal state
  const [editingSite, setEditingSite] = useState(null);
  const [editForm, setEditForm] = useState({ Name: '', Url: '', Logo: '', Category: '' });

  // Gather actual favorite site objects
  const allSitesCombined = [...userSites, ...commonSites];
  const favoriteSites = allSitesCombined.filter(site => favorites.includes(site._id));
  
  // Gather recently visited site objects
  const recentSites = recentlyVisited
    .map(id => allSitesCombined.find(site => site._id === id || site.Url === id))
    .filter(Boolean)
    .slice(0, 5);

  const handleEditClick = (site) => {
    setEditingSite(site);
    setEditForm({
      Name: site.Name || '',
      Url: site.Url || '',
      Logo: site.Logo || '',
      Category: site.Category || ''
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      if (adminToken) {
        await updateCommonSite(editingSite._id, editForm);
      } else {
        await updateUserSite(editingSite._id, editForm);
      }
      alert('Site details updated!');
      setEditingSite(null);
    } catch (err) {
      console.error(err);
      alert('Failed to update website details.');
    }
  };

  // Determine active categories and sites to display
  const activeCategories = token ? userCategories : commonCategories;
  const isLocked = token && lockedUsers.includes(username);
  const isUserEdit = editMode && token && !isLocked;
  const isAdminEdit = adminEditMode && adminToken;
  const isEditingEnabled = isUserEdit || isAdminEdit;

  // Sorting categories using local categoryOrder list
  const sortedCategories = useMemo(() => {
    const categories = token ? userCategories : commonCategories;
    if (!categoryOrder || categoryOrder.length === 0) return categories;

    return [...categories].sort((a, b) => {
      const nameA = a.Category || a.Name;
      const nameB = b.Category || b.Name;
      const indexA = categoryOrder.indexOf(nameA);
      const indexB = categoryOrder.indexOf(nameB);
      if (indexA === -1 && indexB === -1) return 0;
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  }, [token, userCategories, commonCategories, categoryOrder]);

  // Category Drag and Drop Handlers
  const handleCategoryDragStart = (e, index) => {
    window.draggedCategoryIndex = index;
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleCategoryDrop = (e, targetIndex) => {
    e.preventDefault();
    const sourceIndex = window.draggedCategoryIndex;
    if (sourceIndex !== undefined && sourceIndex !== targetIndex) {
      const namesList = sortedCategories.map(c => c.Category || c.Name);
      const updated = [...namesList];
      const [removed] = updated.splice(sourceIndex, 1);
      updated.splice(targetIndex, 0, removed);
      setCategoryOrder(updated);
    }
  };

  // Auto-scroll to Shared Commons when enabled
  useEffect(() => {
    if (showHomeSites) {
      const timer = setTimeout(() => {
        const el = document.getElementById('shared-commons-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 380);
      return () => clearTimeout(timer);
    }
  }, [showHomeSites]);

  return (
    <div className={`home-dashboard density-${dashboardPref.layoutDensity}`}>
      
      {/* Clock Widget */}
      <ClockWidget />

      {/* 1. Hero Search Panel */}
      <section className="hero-section">
        <h1 className="hero-title animate-fade-in">
          <span>Search, Save & </span>
          <span className="gradient-text">Navigate.</span>
        </h1>
        <p className="hero-subtitle">
          Your personal productivity landing page. Keep all your favorite links organized.
        </p>

        <div className="spotlight-search-trigger" onClick={toggleSpotlight}>
          <span className="trigger-placeholder">Launch search bar...</span>
          <kbd className="trigger-shortcut">⌘K</kbd>
        </div>
      </section>

      {/* 2. Favorites Panel */}
      {dashboardPref.showFavorites && favoriteSites.length > 0 && (
        <section className="dashboard-row-section">
          <div className="section-title-wrap">
            <Star size={16} className="text-warning" />
            <h3>Favorite Pins</h3>
          </div>
          <div className="favorites-grid">
            {favoriteSites.map(site => (
              <WebSiteCard 
                key={site._id}
                site={site}
                onEdit={handleEditClick}
                isEditMode={isEditingEnabled}
                isAdmin={adminToken && !token}
              />
            ))}
          </div>
        </section>
      )}

      {/* 3. Recently Visited */}
      {dashboardPref.showRecent && recentSites.length > 0 && (
        <section className="dashboard-row-section">
          <div className="section-title-wrap">
            <Clock size={16} className="text-primary" />
            <h3>Recently Visited</h3>
          </div>
          <div className="favorites-grid">
            {recentSites.map(site => (
              <WebSiteCard 
                key={site._id}
                site={site}
                onEdit={handleEditClick}
                isEditMode={isEditingEnabled}
                isAdmin={adminToken && !token}
              />
            ))}
          </div>
        </section>
      )}

      {/* 4. Main Category Grids */}
      <div className="dashboard-grids-area">
        {/* User Specific Categories */}
        {token && (
          <>
            <div className="grids-header-badge">
              <FolderHeart size={14} />
              <span>Personal Collection {dashboardPref.showCategoryCount && `(${sortedCategories.length})`}</span>
            </div>
            
            {sortedCategories.length === 0 ? (
              <div className="empty-collection-state">
                <p>Welcome! Click on "Settings" in the top bar to add your first category and websites.</p>
              </div>
            ) : (
              <motion.div className="categories-list-wrapper" layout>
                {sortedCategories.map((cat, catIdx) => {
                  const categorySites = userSites.filter(
                    site => site.Category?.trim().toLowerCase() === cat.Category?.trim().toLowerCase()
                  );
                  return (
                    <CategorySection 
                      key={cat._id}
                      categoryId={cat._id}
                      category={cat.Category}
                      sites={categorySites}
                      onEditSite={handleEditClick}
                      isEditMode={isUserEdit}
                      isAdmin={false}
                      index={catIdx}
                      onCategoryDragStart={handleCategoryDragStart}
                      onCategoryDrop={handleCategoryDrop}
                      onCategoryDragOver={(e) => e.preventDefault()}
                    />
                  );
                })}
              </motion.div>
            )}
          </>
        )}

        {/* Common Shared Categories */}
        <AnimatePresence>
          {(!token || showHomeSites) && (
            <motion.div
              key="shared-commons-area"
              id="shared-commons-section"
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              style={{ overflow: 'hidden' }}
            >
              <div className="grids-header-badge">
                <ShieldAlert size={14} />
                <span>Shared Commons {dashboardPref.showCategoryCount && `(${sortedCategories.length})`}</span>
              </div>

              {sortedCategories.length === 0 ? (
                <div className="empty-collection-state">
                  <p>No common categories setup yet.</p>
                </div>
              ) : (
                <motion.div className="categories-list-wrapper" layout>
                  {sortedCategories.map((cat, catIdx) => {
                    const categorySites = commonSites.filter(
                      site => site.Category?.trim().toLowerCase() === cat.Name?.trim().toLowerCase()
                    );
                    return (
                      <CategorySection 
                        key={cat._id}
                        categoryId={cat._id}
                        category={cat.Name}
                        sites={categorySites}
                        onEditSite={handleEditClick}
                        isEditMode={isAdminEdit}
                        isAdmin={true}
                        index={catIdx}
                        onCategoryDragStart={handleCategoryDragStart}
                        onCategoryDrop={handleCategoryDrop}
                        onCategoryDragOver={(e) => e.preventDefault()}
                      />
                    );
                  })}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Branding */}
      <footer className="dashboard-footer">
        <span className="footer-tagline">
          Made with <Sparkles size={12} /> for quick navigation
        </span>
        <span className="footer-copyright">
          © {new Date().getFullYear()} Project GLANCE. All rights reserved.
        </span>
      </footer>

      {/* Reusable Edit Website Modal */}
      <Modal isOpen={!!editingSite} onClose={() => setEditingSite(null)} title="Modify Bookmark">
        {editingSite && (
          <form onSubmit={handleSaveEdit} className="modal-form">
            <label>Name</label>
            <input 
              type="text" 
              value={editForm.Name} 
              onChange={e => setEditForm({ ...editForm, Name: e.target.value })}
              required 
            />

            <label>URL</label>
            <input 
              type="url" 
              value={editForm.Url} 
              onChange={e => setEditForm({ ...editForm, Url: e.target.value })}
              required 
            />

            <label>Logo Image URL</label>
            <input 
              type="url" 
              value={editForm.Logo} 
              onChange={e => setEditForm({ ...editForm, Logo: e.target.value })} 
            />

            <label>Category</label>
            <select 
              value={editForm.Category}
              onChange={e => setEditForm({ ...editForm, Category: e.target.value })}
              required
            >
              <option value="">--Select Category--</option>
              {activeCategories.map(c => {
                const name = c.Category || c.Name;
                return <option key={c._id} value={name}>{name}</option>;
              })}
            </select>

            <div className="modal-actions-end">
              <Button type="button" variant="ghost" onClick={() => setEditingSite(null)} style={{ marginRight: '8px' }}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        )}
      </Modal>

    </div>
  );
}
