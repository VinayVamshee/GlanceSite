import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSites } from '../../contexts/SiteContext';
import { useUI } from '../../contexts/UIContext';
import { Search, Globe, CornerDownLeft, X, Sparkles } from 'lucide-react';
import './SpotlightSearch.css';

export default function SpotlightSearch() {
  const { isSpotlightOpen, setIsSpotlightOpen } = useUI();
  const { userSites, commonSites, trackVisit } = useSites();
  
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Keyboard shortcut ⌘K or Ctrl+K to toggle search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSpotlightOpen(prev => !prev);
      }
      if (e.key === 'Escape' && isSpotlightOpen) {
        setIsSpotlightOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSpotlightOpen, setIsSpotlightOpen]);

  // Focus input when search opens
  useEffect(() => {
    if (isSpotlightOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isSpotlightOpen]);

  // Perform search filtering
  useEffect(() => {
    if (!query.trim()) {
      // Suggest top 5 sites initially
      setResults([...userSites, ...commonSites].slice(0, 5));
      return;
    }

    const filtered = [...userSites, ...commonSites].filter(site => 
      site.Name?.toLowerCase().includes(query.toLowerCase()) ||
      site.Category?.toLowerCase().includes(query.toLowerCase()) ||
      site.Url?.toLowerCase().includes(query.toLowerCase())
    );

    // Deduplicate sites by URL
    const uniqueMap = {};
    filtered.forEach(site => {
      uniqueMap[site.Url] = site;
    });

    setResults(Object.values(uniqueMap).slice(0, 8));
    setSelectedIndex(0);
  }, [query, userSites, commonSites]);

  const handleGoogleSearch = (text) => {
    const cleanQuery = text.trim().replace(/\s+/g, '+');
    const url = `https://www.google.com/search?q=${cleanQuery}`;
    window.open(url, '_blank');
    setIsSpotlightOpen(false);
  };

  const handleOpenSite = (site) => {
    trackVisit(site._id || site.Url);
    window.open(site.Url, '_blank', 'noopener,noreferrer');
    setIsSpotlightOpen(false);
  };

  // Keyboard navigation inside search results
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (results.length + 1)); // +1 for the Google Search suggestion
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + (results.length + 1)) % (results.length + 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex === results.length || results.length === 0) {
        handleGoogleSearch(query || 'Project Glance');
      } else {
        handleOpenSite(results[selectedIndex]);
      }
    }
  };

  return (
    <AnimatePresence>
      {isSpotlightOpen && (
        <div className="spotlight-portal">
          <motion.div 
            className="spotlight-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSpotlightOpen(false)}
          />

          <motion.div
            ref={containerRef}
            className="spotlight-box"
            initial={{ opacity: 0, scale: 0.97, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          >
            {/* Search Input Head */}
            <div className="spotlight-search-header">
              <Search className="spotlight-search-icon" size={20} />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search websites, categories, or Google..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              {query && (
                <button className="spotlight-clear-btn" onClick={() => setQuery('')}>
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Results body */}
            <div className="spotlight-results">
              {results.map((site, index) => (
                <div
                  key={`${site._id}-${index}`}
                  className={`spotlight-item ${selectedIndex === index ? 'selected' : ''}`}
                  onClick={() => handleOpenSite(site)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <img src={site.Logo || ''} alt="" className="spotlight-item-logo" />
                  <div className="spotlight-item-details">
                    <span className="spotlight-item-name">{site.Name}</span>
                    <span className="spotlight-item-url">{site.Url}</span>
                  </div>
                  <span className="spotlight-item-tag">{site.Category}</span>
                </div>
              ))}

              {/* Google Search Entry */}
              <div
                className={`spotlight-item google-option ${selectedIndex === results.length ? 'selected' : ''}`}
                onClick={() => handleGoogleSearch(query || 'Project Glance')}
                onMouseEnter={() => setSelectedIndex(results.length)}
              >
                <Globe className="spotlight-item-logo text-primary" size={18} />
                <div className="spotlight-item-details">
                  <span className="spotlight-item-name">Search Google for "{query || '...'}"</span>
                  <span className="spotlight-item-url">Open in a new tab</span>
                </div>
                <div className="enter-hint">
                  <span>Enter</span>
                  <CornerDownLeft size={12} />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="spotlight-footer">
              <span className="footer-tip">
                <Sparkles size={12} />
                Use <kbd>↑</kbd> <kbd>↓</kbd> to navigate, <kbd>Enter</kbd> to open, <kbd>Esc</kbd> to close.
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
