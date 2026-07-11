import React from 'react';
import { useSites } from '../../contexts/SiteContext';
import { Star, ExternalLink, Edit3, Trash } from 'lucide-react';
import './WebSiteCard.css';

export default function WebSiteCard({ site, onEdit, isEditMode, isAdmin }) {
  const { favorites, toggleFavorite, trackVisit, deleteUserSite, deleteCommonSite } = useSites();

  const isFavorite = favorites.includes(site._id);

  // Helper to extract domain name for visual layout
  const getDomain = (url) => {
    try {
      const hostname = new URL(url).hostname;
      return hostname.replace('www.', '');
    } catch {
      return '';
    }
  };

  const handleOpen = () => {
    trackVisit(site._id || site.Url);
    window.open(site.Url, '_blank', 'noopener,noreferrer');
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    const isConfirmed = window.confirm(`Are you sure you want to delete ${site.Name}?`);
    if (!isConfirmed) return;

    if (isAdmin) {
      deleteCommonSite(site._id);
    } else {
      deleteUserSite(site._id);
    }
  };

  return (
    <div className="website-card-glass" onClick={handleOpen}>
      <div className="card-left">
        <div className="card-logo-wrapper">
          <img 
            src={site.Logo || 'https://www.freeiconspng.com/uploads/logo-website-png-17.png'} 
            alt={`${site.Name} Logo`}
            className="card-logo"
            onError={(e) => {
              e.target.src = 'https://www.freeiconspng.com/uploads/logo-website-png-17.png';
            }}
          />
        </div>
        <div className="card-info">
          <h4 className="card-title">{site.Name}</h4>
          <span className="card-domain">{getDomain(site.Url)}</span>
        </div>
      </div>

      <div className="card-right-actions">
        <button 
          className={`card-action-btn favorite-btn ${isFavorite ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(site._id);
          }}
          title={isFavorite ? 'Unfavorite' : 'Favorite'}
        >
          <Star size={13} fill={isFavorite ? 'var(--warning)' : 'none'} />
        </button>

        {isEditMode && (
          <>
            <button 
              className="card-action-btn edit-btn"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(site);
              }}
              title="Edit site"
            >
              <Edit3 size={13} />
            </button>
            <button 
              className="card-action-btn delete-btn"
              onClick={handleDelete}
              title="Delete site"
            >
              <Trash size={13} />
            </button>
          </>
        )}
        
        <ExternalLink className="card-arrow" size={13} />
      </div>
    </div>
  );
}
