import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Shield, MapPin, Phone, IdCard } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import northeastHero from '@/assets/northeast-hero.jpg';

const OnboardingScreen: React.FC = () => {
  const { setTouristPage } = useApp();
  const [currentStep, setCurrentStep] = useState(0);

  const onboardingSteps = [
    {
      icon: <Shield className="w-16 h-16 text-primary" />,
      title: "Your Safety, Our Priority",
      description: "Advanced geo-fencing and real-time alerts keep you safe while exploring Northeast India's beautiful destinations.",
      image: northeastHero
    },
    {
      icon: <IdCard className="w-16 h-16 text-secondary" />,
      title: "Digital Tourist ID",
      description: "Secure, blockchain-verified digital identification for seamless travel and instant verification by authorities.",
      image: null
    },
    {
      icon: <Phone className="w-16 h-16 text-success" />,
      title: "Emergency Response",
      description: "One-tap panic button connects you instantly to local authorities and emergency services across the region.",
      image: null
    },
    {
      icon: <MapPin className="w-16 h-16 text-warning" />,
      title: "Smart Travel Tracking",
      description: "Automatic check-ins, travel history, and location sharing with trusted contacts for peace of mind.",
      image: null
    }
  ];

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setTouristPage('digitalId');
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = onboardingSteps[currentStep];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={prevStep}
          disabled={currentStep === 0}
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        
        <div className="flex gap-2">
          {onboardingSteps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentStep ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
        
        <Button 
          variant="ghost" 
          onClick={() => setTouristPage('digitalId')}
          className="text-muted-foreground"
        >
          Skip
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-8">
        {currentStepData.image && (
          <div className="w-full h-48 rounded-xl overflow-hidden shadow-lg mb-4">
            <img 
              src={currentStepData.image} 
              alt="Northeast India" 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="space-y-4">
          <div className="mx-auto">{currentStepData.icon}</div>
          <h2 className="text-2xl font-bold text-foreground">{currentStepData.title}</h2>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-sm">
            {currentStepData.description}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 space-y-4">
        <Button 
          variant="hero" 
          className="w-full"
          onClick={nextStep}
        >
          {currentStep === onboardingSteps.length - 1 ? 'Create Digital ID' : 'Continue'}
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default OnboardingScreen;