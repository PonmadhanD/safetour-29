import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Shield, MapPin } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import appIcon from '@/assets/app-icon.jpg';

const SplashScreen: React.FC = () => {
  const { setTouristPage } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => {
      setTouristPage('onboarding');
    }, 3000);

    return () => clearTimeout(timer);
  }, [setTouristPage]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-hero text-white p-6">
      <div className="text-center space-y-6 animate-slide-up">
        <div className="mx-auto w-24 h-24 mb-6 rounded-2xl overflow-hidden shadow-lg">
          <img src={appIcon} alt="SafeTravel NE" className="w-full h-full object-cover" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">SafeTravel NE</h1>
          <p className="text-white/90 text-lg">Northeast India Tourism Safety</p>
        </div>
        
        <div className="flex items-center justify-center gap-4 text-sm text-white/80">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span>Secure</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>Location-Aware</span>
          </div>
        </div>
        
        <div className="pt-8">
          <Button
            variant="glass"
            onClick={() => setTouristPage('onboarding')}
            className="animate-pulse"
          >
            Get Started
          </Button>
        </div>
      </div>
      
      <div className="absolute bottom-6 text-center text-white/60 text-sm">
        <p>Government of India Initiative</p>
        <p>Ministry of Tourism</p>
      </div>
    </div>
  );
};

export default SplashScreen;