import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Folder, Trash, GripVertical } from 'lucide-react';
import WebSiteCard from '../Cards/WebSiteCard';
import { useCategories } from '../../contexts/CategoryContext';
import { useSites } from '../../contexts/SiteContext';
import './CategorySection.css';

export default function CategorySection({ 
  category, 
  sites, 
  onEditSite, 
  isEditMode, 
  isAdmin,
  categoryId,
  index,
  onCategoryDragStart,
  onCategoryDrop,
  onCategoryDragOver
}) {
  const { deleteUserCategory, deleteCommonCategory } = useCategories();
  const { siteOrder, setSiteOrder } = useSites();

  const handleCategoryDelete = () => {
    const isConfirmed = window.confirm(`Are you sure you want to delete the category "${category}"?`);
    if (!isConfirmed) return;

    if (isAdmin) {
      deleteCommonCategory(categoryId);
    } else {
      deleteUserCategory(categoryId);
    }
  };

  // Sort sites inside this category using local storage order
  const sortedSites = useMemo(() => {
    const currentOrder = siteOrder[category] || [];
    if (currentOrder.length === 0) return sites;

    return [...sites].sort((a, b) => {
      const indexA = currentOrder.indexOf(a._id);
      const indexB = currentOrder.indexOf(b._id);
      if (indexA === -1 && indexB === -1) return 0;
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  }, [sites, siteOrder, category]);

  // Card drag and drop handlers (inside the same category)
  const handleCardDragStart = (e, siteId, cardIdx) => {
    window.draggedCardId = siteId;
    window.draggedCardCategory = category;
    window.draggedCardIndex = cardIdx;
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleCardDrop = (e, targetIdx) => {
    e.preventDefault();
    if (window.draggedCardCategory !== category) return; // Only support same-category reordering
    
    const sourceIdx = window.draggedCardIndex;
    if (sourceIdx !== undefined && sourceIdx !== targetIdx) {
      const siteIdsList = sortedSites.map(s => s._id);
      const updated = [...siteIdsList];
      const [removed] = updated.splice(sourceIdx, 1);
      updated.splice(targetIdx, 0, removed);
      
      setSiteOrder(prev => ({
        ...prev,
        [category]: updated
      }));
    }
  };

  const idLink = category.replace(/\s+/g, '-').toLowerCase();

  return (
    <motion.section 
      layout
      className={`category-section ${isEditMode ? 'edit-active' : ''}`} 
      id={idLink}
      onDragOver={onCategoryDragOver}
      onDrop={(e) => onCategoryDrop(e, index)}
    >
      {/* Category Header */}
      <div className="category-header">
        <div className="category-title-group">
          {isEditMode && (
            <div 
              className="category-drag-handle"
              draggable
              onDragStart={(e) => onCategoryDragStart(e, index)}
              title="Drag to reorder category"
            >
              <GripVertical size={16} />
            </div>
          )}
          <Folder size={18} className="category-folder-icon" />
          <h3 className="category-title-text">{category}</h3>
          <span className="category-count-badge">
            {sites.length} {sites.length === 1 ? 'website' : 'websites'}
          </span>
        </div>

        {isEditMode && (
          <button 
            className="category-delete-btn"
            onClick={handleCategoryDelete}
            title="Delete Category"
          >
            <Trash size={14} />
            <span>Delete Category</span>
          </button>
        )}
      </div>

      {/* Grid container with card reordering and framer-motion layout animations */}
      {sites.length === 0 ? (
        <div className="category-empty-state">
          <p>No websites in this category.</p>
        </div>
      ) : (
        <div className="category-grid">
          {sortedSites.map((site, cardIdx) => (
            <motion.div 
              key={site._id}
              layout
              draggable={isEditMode}
              onDragStart={(e) => handleCardDragStart(e, site._id, cardIdx)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleCardDrop(e, cardIdx)}
              className="draggable-card-wrapper"
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            >
              <WebSiteCard 
                site={site}
                onEdit={onEditSite}
                isEditMode={isEditMode}
                isAdmin={isAdmin}
              />
            </motion.div>
          ))}
        </div>
      )}
    </motion.section>
  );
}
