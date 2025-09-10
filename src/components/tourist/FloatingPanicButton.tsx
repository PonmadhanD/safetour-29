import React from 'react';
import { Button } from '@/components/ui/button';
import { Phone } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

interface FloatingPanicButtonProps {
  className?: string;
}

const FloatingPanicButton: React.FC<FloatingPanicButtonProps> = ({ className = '' }) => {
  const { setEmergencyActive, setTouristPage } = useApp();

  const handlePanic = () => {
    setEmergencyActive(true);
    setTouristPage('panic');
  };

  return (
    <Button
      onClick={handlePanic}
      className={`fixed bottom-20 right-4 z-50 w-16 h-16 rounded-full bg-emergency hover:bg-emergency/90 text-emergency-foreground shadow-emergency animate-pulse-emergency ${className}`}
      size="icon"
    >
      <Phone className="w-6 h-6" />
    </Button>
  );
};

export default FloatingPanicButton;