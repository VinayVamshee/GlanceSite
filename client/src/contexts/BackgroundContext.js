import React, { createContext, useState, useEffect, useContext } from 'react';
import { backgroundService } from '../services/background.service';
import { useAuth } from './AuthContext';

const BackgroundContext = createContext();

const DEFAULT_BACKGROUND = 'https://c4.wallpaperflare.com/wallpaper/379/399/753/rainbow-day-light-wait-wallpaper-preview.jpg';

export function BackgroundProvider({ children }) {
  const { token, adminToken } = useAuth();
  const [backgroundImage, setBackgroundImage] = useState(DEFAULT_BACKGROUND);
  const [loading, setLoading] = useState(false);

  const fetchBackground = async () => {
    setLoading(true);
    try {
      if (token) {
        const data = await backgroundService.getUserBackground();
        setBackgroundImage(data.backgroundImage || DEFAULT_BACKGROUND);
      } else {
        const data = await backgroundService.getCommonBackground();
        setBackgroundImage(data.backgroundImage || DEFAULT_BACKGROUND);
      }
    } catch (error) {
      console.error('Failed to fetch background:', error);
      setBackgroundImage(DEFAULT_BACKGROUND);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBackground();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, adminToken]);

  const saveUserBackground = async (imageLink) => {
    setLoading(true);
    try {
      await backgroundService.saveUserBackground(imageLink);
      setBackgroundImage(imageLink);
    } finally {
      setLoading(false);
    }
  };

  const saveCommonBackground = async (imageLink) => {
    setLoading(true);
    try {
      await backgroundService.saveCommonBackground(imageLink);
      setBackgroundImage(imageLink);
    } finally {
      setLoading(false);
    }
  };

  const isVideo = backgroundImage?.match(/\.(mp4|webm|ogg)(\?.*)?$/i);

  return (
    <BackgroundContext.Provider value={{
      backgroundImage,
      isVideo,
      loading,
      saveUserBackground,
      saveCommonBackground,
      fetchBackground
    }}>
      {children}
    </BackgroundContext.Provider>
  );
}

export function useBackground() {
  return useContext(BackgroundContext);
}
