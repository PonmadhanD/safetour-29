import React from 'react';
import { useAuthorityAuth } from '@/contexts/AuthorityAuthContext';
import AdminAuthScreen from '@/components/authority/AdminAuthScreen';
import VerificationScreen from '@/components/authority/VerificationScreen';
import AlertsScreen from '@/components/authority/AlertsScreen';
import EFirScreen from '@/components/authority/EFirScreen';
import AnalyticsScreen from '@/components/authority/AnalyticsScreen';
import SettingsScreen from '@/components/authority/SettingsScreen';
import { useApp } from '@/contexts/AppContext';
import Dashboard from '@/components/authority/DashboardScreen';

const AuthorityApp: React.FC = () => {
  const { authorityPage } = useApp();
  const { authorityUser, loading } = useAuthorityAuth();

  // If authentication is still loading, show a loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // If the page is 'login', always show the login screen
  if (authorityPage === 'login') {
    return <AdminAuthScreen />;
  }

  // If no user is authenticated, show AdminAuthScreen
  if (!authorityUser) {
    return <AdminAuthScreen />;
  }

  // Render the appropriate page based on authorityPage state
  const renderPage = () => {
    switch (authorityPage) {
      case 'dashboard':
        return <Dashboard />;
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
        return <Dashboard />; // Default to dashboard after login
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderPage()}
    </div>
  );
};

export default AuthorityApp;