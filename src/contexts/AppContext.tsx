import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AppView, TouristPage, AuthorityPage, Tourist, AuthorityUser, Alert } from '@/types';

interface AppContextType {
  // App state
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  
  // Tourist app state
  touristPage: TouristPage;
  setTouristPage: (page: TouristPage) => void;
  currentTourist: Tourist | null;
  setCurrentTourist: (tourist: Tourist | null) => void;
  
  // Authority app state
  authorityPage: AuthorityPage;
  setAuthorityPage: (page: AuthorityPage) => void;
  currentAuthority: AuthorityUser | null;
  setCurrentAuthority: (authority: AuthorityUser | null) => void;
  
  // Shared state
  alerts: Alert[];
  setAlerts: (alerts: Alert[]) => void;
  emergencyActive: boolean;
  setEmergencyActive: (active: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('tourist');
  const [touristPage, setTouristPage] = useState<TouristPage>('splash');
  const [authorityPage, setAuthorityPage] = useState<AuthorityPage>('login');
  const [currentTourist, setCurrentTourist] = useState<Tourist | null>(null);
  const [currentAuthority, setCurrentAuthority] = useState<AuthorityUser | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [emergencyActive, setEmergencyActive] = useState(false);

  const value: AppContextType = {
    currentView,
    setCurrentView,
    touristPage,
    setTouristPage,
    authorityPage,
    setAuthorityPage,
    currentTourist,
    setCurrentTourist,
    currentAuthority,
    setCurrentAuthority,
    alerts,
    setAlerts,
    emergencyActive,
    setEmergencyActive,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};