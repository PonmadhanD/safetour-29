import React from 'react';
import { useApp } from '@/contexts/AppContext';
import SplashScreen from '@/components/tourist/SplashScreen';
import OnboardingScreen from '@/components/tourist/OnboardingScreen';
import DigitalIdScreen from '@/components/tourist/DigitalIdScreen';
import HomeScreen from '@/components/tourist/HomeScreen';
import MapScreen from '@/components/tourist/MapScreen';
import ZonesScreen from '@/components/tourist/ZonesScreen';
import RoutesScreen from '@/components/tourist/RoutesScreen';
import PanicScreen from '@/components/tourist/PanicScreen';
import HistoryScreen from '@/components/tourist/HistoryScreen';
import SettingsScreen from '@/components/tourist/SettingsScreen';
import FamilyTrackingScreen from '@/components/tourist/FamilyTrackingScreen';
import BottomNavigation from '@/components/tourist/BottomNavigation';

const TouristApp: React.FC = () => {
  const { currentTourist, touristPage } = useApp();

  const renderPage = () => {
    if (currentTourist) {
      switch (touristPage) {
        case 'home':
          return <HomeScreen />;
        case 'map':
          return <MapScreen />;
        case 'zones':
          return <ZonesScreen />;
        case 'routes':
          return <RoutesScreen />;
        case 'panic':
          return <PanicScreen />;
        case 'history':
          return <HistoryScreen />;
        case 'settings':
          return <SettingsScreen />;
        case 'familyTracking':
          return <FamilyTrackingScreen />;
        default:
          return <HomeScreen />;
      }
    } else {
      switch (touristPage) {
        case 'splash':
          return <SplashScreen />;
        case 'onboarding':
          return <OnboardingScreen />;
        default:
          return <DigitalIdScreen />;
      }
    }
  };

  const showBottomNav = currentTourist && ['history', 'home', 'settings', 'map', 'familyTracking'].includes(touristPage);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-md bg-card shadow-lg min-h-screen relative">
        <div className={showBottomNav ? 'pb-16' : ''}>
          {renderPage()}
        </div>
        {showBottomNav && <BottomNavigation />}
      </div>
    </div>
  );
};

export default TouristApp;