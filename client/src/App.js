import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { UIProvider } from './contexts/UIContext';
import { BackgroundProvider } from './contexts/BackgroundContext';
import { CategoryProvider } from './contexts/CategoryContext';
import { SiteProvider } from './contexts/SiteContext';
import AppLayout from './Components/Layout/AppLayout';
import Home from './pages/Home';
import SpotlightSearch from './Components/Search/SpotlightSearch';
import SettingsDrawer from './Components/Settings/SettingsDrawer';
import ModalManager from './Components/Modals/ModalManager';

import './styles/global.css';

function App() {
  return (
    <AuthProvider>
      <BackgroundProvider>
        <CategoryProvider>
          <SiteProvider>
            <UIProvider>
              <AppLayout>
                <Home />
                
                {/* Global Overlays & Modals */}
                <SpotlightSearch />
                <SettingsDrawer />
                <ModalManager />
              </AppLayout>
            </UIProvider>
          </SiteProvider>
        </CategoryProvider>
      </BackgroundProvider>
    </AuthProvider>
  );
}

export default App;
