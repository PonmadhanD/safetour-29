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
  const { touristPage } = useApp();

  const renderPage = () => {
    switch (touristPage) {
      case 'splash':
        return <SplashScreen />;
      case 'onboarding':
        return <OnboardingScreen />;
      case 'digitalId':
        return <DigitalIdScreen />;
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
        return <SplashScreen />;
    }
  };

  const showBottomNav = ['digitalId', 'history', 'home', 'settings', 'map', 'familyTracking'].includes(touristPage);

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