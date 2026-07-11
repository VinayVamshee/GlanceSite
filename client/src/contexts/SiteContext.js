import React, { createContext, useState, useEffect, useContext } from 'react';
import { siteService } from '../services/site.service';
import { adminService } from '../services/admin.service';
import { useAuth } from './AuthContext';
import useLocalStorage from '../hooks/useLocalStorage';

const SiteContext = createContext();

export function SiteProvider({ children }) {
  const { token, adminToken } = useAuth();
  const [userSites, setUserSites] = useState([]);
  const [commonSites, setCommonSites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lockedUsers, setLockedUsers] = useState([]);
  
  // Local storage lists
  const [favorites, setFavorites] = useLocalStorage('glance_favorites', []);
  const [recentlyVisited, setRecentlyVisited] = useLocalStorage('glance_recent', []);
  const [searchHistory, setSearchHistory] = useLocalStorage('glance_search_history', []);
  
  // Reordering lists
  const [categoryOrder, setCategoryOrder] = useLocalStorage('glance_category_order', []);
  const [siteOrder, setSiteOrder] = useLocalStorage('glance_site_order', {}); // mapping: categoryName -> [siteId, siteId, ...]

  const fetchSites = async () => {
    setLoading(true);
    try {
      const common = await siteService.getAllCommonSites();
      setCommonSites(common);
      
      if (token) {
        const user = await siteService.getUserSites();
        setUserSites(user);
      } else {
        setUserSites([]);
      }
    } catch (error) {
      console.error('Error fetching sites:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSites();
    
    const fetchLockedUsers = async () => {
      try {
        const data = await adminService.getLockedUsers();
        setLockedUsers(data.map(u => u.name));
      } catch (err) {
        console.error('Error fetching locked users:', err);
      }
    };
    fetchLockedUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, adminToken]);

  // Actions for User Sites
  const addUserSite = async (siteData) => {
    const newSite = await siteService.addUserSite(siteData);
    setUserSites(prev => [...prev, newSite]);
    
    // Append to site reordering list
    const catName = newSite.Category;
    setSiteOrder(prev => {
      const current = prev[catName] || [];
      return { ...prev, [catName]: [...current, newSite._id] };
    });
    return newSite;
  };

  const updateUserSite = async (id, siteData) => {
    const updated = await siteService.updateUserSite(id, siteData);
    await fetchSites();
    return updated;
  };

  const deleteUserSite = async (id) => {
    await siteService.deleteUserSite(id);
    setUserSites(prev => prev.filter(s => s._id !== id));
    setFavorites(prev => prev.filter(siteId => siteId !== id));
    setRecentlyVisited(prev => prev.filter(siteId => siteId !== id));
    
    // Remove from reordering maps
    setSiteOrder(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(cat => {
        next[cat] = next[cat].filter(siteId => siteId !== id);
      });
      return next;
    });
  };

  // Actions for Common Sites
  const addCommonSite = async (siteData) => {
    const newSite = await siteService.addCommonSite(siteData);
    setCommonSites(prev => [...prev, newSite]);
    
    const catName = newSite.Category;
    setSiteOrder(prev => {
      const current = prev[catName] || [];
      return { ...prev, [catName]: [...current, newSite._id] };
    });
    return newSite;
  };

  const updateCommonSite = async (id, siteData) => {
    const updated = await siteService.updateCommonSite(id, siteData);
    await fetchSites();
    return updated;
  };

  const deleteCommonSite = async (id) => {
    await siteService.deleteCommonSite(id);
    setCommonSites(prev => prev.filter(s => s._id !== id));
    setFavorites(prev => prev.filter(siteId => siteId !== id));
    setRecentlyVisited(prev => prev.filter(siteId => siteId !== id));
    
    setSiteOrder(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(cat => {
        next[cat] = next[cat].filter(siteId => siteId !== id);
      });
      return next;
    });
  };

  // Favorites & Recents management
  const toggleFavorite = (siteId) => {
    setFavorites(prev => 
      prev.includes(siteId) ? prev.filter(id => id !== siteId) : [...prev, siteId]
    );
  };

  const trackVisit = (siteId) => {
    setRecentlyVisited(prev => {
      const filtered = prev.filter(id => id !== siteId);
      return [siteId, ...filtered].slice(0, 10);
    });
  };

  // Reorder handlers (custom drag and drop operations helper)
  const reorderCategoriesList = (startIndex, endIndex) => {
    setCategoryOrder(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  };

  const reorderSitesList = (catName, startIndex, endIndex) => {
    setSiteOrder(prev => {
      const current = Array.from(prev[catName] || []);
      const [removed] = current.splice(startIndex, 1);
      current.splice(endIndex, 0, removed);
      return { ...prev, [catName]: current };
    });
  };

  return (
    <SiteContext.Provider value={{
      userSites,
      commonSites,
      loading,
      favorites,
      recentlyVisited,
      searchHistory,
      setSearchHistory,
      
      // Reordering fields
      categoryOrder,
      setCategoryOrder,
      siteOrder,
      setSiteOrder,
      reorderCategoriesList,
      reorderSitesList,
      
      lockedUsers,
      
      addUserSite,
      updateUserSite,
      deleteUserSite,
      addCommonSite,
      updateCommonSite,
      deleteCommonSite,
      toggleFavorite,
      trackVisit,
      refreshSites: fetchSites
    }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSites() {
  return useContext(SiteContext);
}
