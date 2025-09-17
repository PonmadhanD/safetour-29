import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { AppProvider } from '@/contexts/AppContext';
import MapDashboard from '@/components/authority/MapDashboard';
import VerificationScreen from '@/components/authority/VerificationScreen';
import AlertsScreen from '@/components/authority/AlertsScreen';
import EFirScreen from '@/components/authority/EFirScreen';
import AnalyticsScreen from '@/components/authority/AnalyticsScreen';
import SettingsScreen from '@/components/authority/SettingsScreen';

const AdminAppContent: React.FC = () => {
  const { authorityPage } = useApp();

  const renderPage = () => {
    switch (authorityPage) {
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
        return <MapDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderPage()}
    </div>
  );
};

const AdminApp: React.FC = () => {
  return (
    <AppProvider>
      <AdminAppContent />
    </AppProvider>
  );
};

export default AdminApp;