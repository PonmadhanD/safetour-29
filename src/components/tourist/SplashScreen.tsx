import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Shield, MapPin } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import appIcon from '../../../public/logo.jpeg';

const SplashScreen: React.FC = () => {
  const { setTouristPage } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => {
      setTouristPage('onboarding');
    }, 3000);

    return () => clearTimeout(timer);
  }, [setTouristPage]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-primary text-primary-foreground p-6">
      <div className="text-center space-y-6 animate-slide-up">
        <div className="mx-auto w-24 h-24 mb-6 rounded-2xl overflow-hidden shadow-lg bg-card">
          <img src={appIcon} alt="SafeTravel NE" className="w-full h-full object-cover" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Trip Bharat</h1>
          <p className="text-primary-foreground/90 text-lg">Northeast India Tourism Safety</p>
        </div>
        
        <div className="flex items-center justify-center gap-6 text-sm text-primary-foreground/80">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            <span>Government Verified</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            <span>Real-time Safety</span>
          </div>
        </div>
        
        <div className="pt-8">
          <Button
            variant="hero"
            size="lg"
            onClick={() => setTouristPage('onboarding')}
            className="shadow-lg font-semibold"
          >
            Get Started
          </Button>
        </div>
      </div>
      
      <div className="absolute bottom-6 text-center text-primary-foreground/70 text-sm">
        <p className="font-medium">Government of India Initiative</p>
        <p>Ministry of Tourism • Northeast Region</p>
      </div>
    </div>
  );
};

export default SplashScreen;