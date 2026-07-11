import React, { createContext, useState, useEffect, useContext } from 'react';

const UIContext = createContext();

export function UIProvider({ children }) {
  // Navigation & Modal triggers
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [adminEditMode, setAdminEditMode] = useState(false);
  const [showHomeSites, setShowHomeSites] = useState(() => {
    return localStorage.getItem('glance_show_public') === 'true';
  });

  // Theme Settings
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem('glance_theme_mode') || 'dark'; // 'dark' | 'light' | 'custom'
  });

  // Custom Theme Customizations
  const [customTheme, setCustomTheme] = useState(() => {
    const saved = localStorage.getItem('glance_custom_theme_config');
    return saved ? JSON.parse(saved) : {
      bgOverlayOpacity: 0.65,
      bgOverlayColor: '#0B0F19',
      blurAmount: 16,
      cardStyle: 'glass', // 'glass' | 'solid' | 'minimal' | 'outline'
      borderRadius: 12,
      shadowStrength: 0.4,
      accentColor: '#3b82f6',
      cardOpacity: 0.4
    };
  });

  // Dashboard Preferences
  const [dashboardPref, setDashboardPref] = useState(() => {
    const saved = localStorage.getItem('glance_dashboard_pref');
    return saved ? JSON.parse(saved) : {
      showFavorites: true,
      showRecent: true,
      showCountWebsites: true,
      showCountCategories: true,
      layoutDensity: 'comfortable', // 'comfortable' | 'compact'
      categoryIcons: true
    };
  });

  // Clock Preferences
  const [clockPref, setClockPref] = useState(() => {
    const saved = localStorage.getItem('glance_clock_pref');
    return saved ? JSON.parse(saved) : {
      showClock: true,
      showSeconds: true,
      showDate: true,
      format24h: false
    };
  });

  // Synchronize preferences to localStorage
  useEffect(() => {
    localStorage.setItem('glance_show_public', showHomeSites);
  }, [showHomeSites]);

  useEffect(() => {
    localStorage.setItem('glance_theme_mode', themeMode);
    
    // Apply body classes for Light/Dark themes
    const body = document.body;
    if (themeMode === 'light') {
      body.classList.add('theme-light');
      body.classList.remove('theme-custom');
    } else if (themeMode === 'custom') {
      body.classList.add('theme-custom');
      body.classList.remove('theme-light');
    } else {
      body.classList.remove('theme-light', 'theme-custom');
    }
  }, [themeMode]);

  useEffect(() => {
    localStorage.setItem('glance_custom_theme_config', JSON.stringify(customTheme));
  }, [customTheme]);

  useEffect(() => {
    localStorage.setItem('glance_dashboard_pref', JSON.stringify(dashboardPref));
  }, [dashboardPref]);

  useEffect(() => {
    localStorage.setItem('glance_clock_pref', JSON.stringify(clockPref));
  }, [clockPref]);

  // Dynamically generate inline styles for Custom Theme override
  useEffect(() => {
    if (themeMode !== 'custom') {
      // Clear custom inline styles on body/document
      const root = document.documentElement;
      root.style.removeProperty('--bg-overlay');
      root.style.removeProperty('--blur-normal');
      root.style.removeProperty('--radius-md');
      root.style.removeProperty('--radius-lg');
      root.style.removeProperty('--primary');
      root.style.removeProperty('--primary-hover');
      root.style.removeProperty('--surface-card');
      root.style.removeProperty('--shadow-md');
      return;
    }

    const root = document.documentElement;
    
    // Hex to RGBA overlay
    const hex = customTheme.bgOverlayColor || '#0B0F19';
    const r = parseInt(hex.slice(1, 3), 16) || 11;
    const g = parseInt(hex.slice(3, 5), 16) || 15;
    const b = parseInt(hex.slice(5, 7), 16) || 25;
    root.style.setProperty('--bg-overlay', `rgba(${r}, ${g}, ${b}, ${customTheme.bgOverlayOpacity})`);
    root.style.setProperty('--blur-normal', `blur(${customTheme.blurAmount}px)`);
    root.style.setProperty('--radius-md', `${customTheme.borderRadius}px`);
    root.style.setProperty('--radius-lg', `${customTheme.borderRadius + 8}px`);
    root.style.setProperty('--primary', customTheme.accentColor);
    root.style.setProperty('--primary-hover', customTheme.accentColor + 'dd');
    
    // Card styles
    if (customTheme.cardStyle === 'solid') {
      root.style.setProperty('--surface-card', `rgba(${r}, ${g}, ${b}, 0.95)`);
      root.style.setProperty('--border-light', 'rgba(255, 255, 255, 0.05)');
    } else if (customTheme.cardStyle === 'minimal') {
      root.style.setProperty('--surface-card', 'transparent');
      root.style.setProperty('--border-light', 'transparent');
    } else if (customTheme.cardStyle === 'outline') {
      root.style.setProperty('--surface-card', 'transparent');
      root.style.setProperty('--border-light', 'rgba(255, 255, 255, 0.2)');
    } else {
      // Glass
      root.style.setProperty('--surface-card', `rgba(255, 255, 255, ${customTheme.cardOpacity})`);
      root.style.setProperty('--border-light', 'rgba(255, 255, 255, 0.08)');
    }
    
    root.style.setProperty('--shadow-md', `0 8px 32px rgba(0, 0, 0, ${customTheme.shadowStrength})`);
  }, [themeMode, customTheme]);

  const toggleSpotlight = () => setIsSpotlightOpen(prev => !prev);
  const toggleSettings = () => setIsSettingsOpen(prev => !prev);
  const openModal = (name) => setActiveModal(name);
  const closeModal = () => setActiveModal(null);

  return (
    <UIContext.Provider value={{
      isSpotlightOpen,
      setIsSpotlightOpen,
      toggleSpotlight,
      isSettingsOpen,
      setIsSettingsOpen,
      toggleSettings,
      activeModal,
      openModal,
      closeModal,
      editMode,
      setEditMode,
      adminEditMode,
      setAdminEditMode,
      showHomeSites,
      setShowHomeSites,
      
      // Theme engine state
      themeMode,
      setThemeMode,
      customTheme,
      setCustomTheme,
      dashboardPref,
      setDashboardPref,
      clockPref,
      setClockPref
    }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  return useContext(UIContext);
}
