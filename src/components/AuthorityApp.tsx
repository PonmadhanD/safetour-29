import React from 'react';
import { useApp } from '@/contexts/AppContext';
import LoginScreen from '@/components/authority/LoginScreen';
import MapDashboard from '@/components/authority/MapDashboard';
import VerificationScreen from '@/components/authority/VerificationScreen';
import AlertsScreen from '@/components/authority/AlertsScreen';
import EFirScreen from '@/components/authority/EFirScreen';
import AnalyticsScreen from '@/components/authority/AnalyticsScreen';
import SettingsScreen from '@/components/authority/SettingsScreen';

const AuthorityApp: React.FC = () => {
  const { authorityPage } = useApp();

  const renderPage = () => {
    switch (authorityPage) {
      case 'login':
        return <LoginScreen />;
      case 'dashboard':
        return <MapDashboard />;
      case 'verification':
        return <VerificationScreen />;
      case 'alerts':
        return <AlertsScreen />;
      case 'efir':
        return <EFirScreen />;
      case 'analytics':
        return <AnalyticsScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <LoginScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderPage()}
    </div>
  );
};

export default AuthorityApp;