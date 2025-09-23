import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
  const { currentTourist } = useApp();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-md bg-card shadow-lg min-h-screen relative">
        <Routes>
          {/* Onboarding flow */}
          <Route path="/splash" element={<SplashScreen />} />
          <Route path="/onboarding" element={<OnboardingScreen />} />
          <Route path="/digital-id" element={<DigitalIdScreen />} />
          
          {/* Main app routes with bottom navigation */}
          <Route path="/" element={
            <div className="pb-16">
              <HomeScreen />
              <BottomNavigation />
            </div>
          } />
          <Route path="/panic" element={<PanicScreen />} />
          <Route path="/map" element={
            <div className="pb-16">
              <MapScreen />
              <BottomNavigation />
            </div>
          } />
          <Route path="/family" element={
            <div className="pb-16">
              <FamilyTrackingScreen />
              <BottomNavigation />
            </div>
          } />
          <Route path="/zones" element={
            <div className="pb-16">
              <ZonesScreen />
              <BottomNavigation />
            </div>
          } />
          <Route path="/routes" element={
            <div className="pb-16">
              <RoutesScreen />
              <BottomNavigation />
            </div>
          } />
          <Route path="/history" element={
            <div className="pb-16">
              <HistoryScreen />
              <BottomNavigation />
            </div>
          } />
          <Route path="/settings" element={
            <div className="pb-16">
              <SettingsScreen />
              <BottomNavigation />
            </div>
          } />
          
          {/* Redirect unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default TouristApp;