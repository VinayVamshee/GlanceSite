import React from 'react';
import { useBackground } from '../../contexts/BackgroundContext';
import TopNav from './TopNav';
import BottomNav from './BottomNav';
import './AppLayout.css';

export default function AppLayout({ children }) {
  const { backgroundImage, isVideo } = useBackground();

  return (
    <div 
      className="app-layout"
      style={!isVideo ? { backgroundImage: `url(${backgroundImage})` } : {}}
    >
      {isVideo && (
        <video
          src={backgroundImage}
          autoPlay
          muted
          loop
          playsInline
          webkit-playsinline="true"
          className="app-bg-video"
          key={backgroundImage} // re-mount video when background URL changes
        />
      )}
      
      {/* Blurs and shadows overlays to match Arc and macOS styling */}
      <div className="app-backdrop-overlay" />

      {/* Main app container */}
      <div className="app-viewport">
        <TopNav />
        <main className="app-main-content">
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
