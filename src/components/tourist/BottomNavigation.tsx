import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge, MapPin, Clock, Settings, CreditCard } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { TouristPage } from '@/types';

const BottomNavigation: React.FC = () => {
  const { touristPage, setTouristPage, currentTourist } = useApp();

  // Show ID tab only if user is not logged in or not verified
  const showIdTab = !currentTourist || !currentTourist.isVerified;

  const navItems = [
    { id: 'digitalId' as TouristPage, label: 'ID', icon: CreditCard, show: showIdTab },
    { id: 'history' as TouristPage, label: 'History', icon: Clock, show: true },
    { id: 'home' as TouristPage, label: 'Map', icon: MapPin, show: true },
    { id: 'settings' as TouristPage, label: 'Settings', icon: Settings, show: true }
  ].filter(item => item.show);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="max-w-md mx-auto">
        <div className={`grid gap-0 ${navItems.length === 3 ? 'grid-cols-3' : 'grid-cols-4'}`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = touristPage === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={`h-16 rounded-none flex-col gap-1 ${
                  isActive 
                    ? 'text-primary bg-primary/5 border-t-2 border-t-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setTouristPage(item.id)}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;