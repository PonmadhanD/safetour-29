import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AdminAuthScreen from './auth/AdminAuthScreen';
import MapDashboard from '@/components/authority/MapDashboard';
import VerificationScreen from '@/components/authority/VerificationScreen';
import AlertsScreen from '@/components/authority/AlertsScreen';
import EFirScreen from '@/components/authority/EFirScreen';
import AnalyticsScreen from '@/components/authority/AnalyticsScreen';
import SettingsScreen from '@/components/authority/SettingsScreen';
import { useApp } from '@/contexts/AppContext';

const AuthorityApp: React.FC = () => {
  const { authorityPage } = useApp();
  const { user, loading } = useAuth(); // Assume AuthContext provides user and loading state

  // If authentication is still loading, show a loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // If no user is authenticated, show AdminAuthScreen
  if (!user) {
    return <AdminAuthScreen />;
  }

  // Render the appropriate page based on authorityPage state
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
        return <MapDashboard />; // Default to dashboard after login
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderPage()}
    </div>
  );
};

export default AuthorityApp;