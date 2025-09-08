import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge, MapPin, Clock, Settings, CreditCard } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { TouristPage } from '@/types';

const BottomNavigation: React.FC = () => {
  const { touristPage, setTouristPage } = useApp();

  const navItems: Array<{
    id: TouristPage;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { id: 'digitalId', label: 'ID', icon: Badge },
    { id: 'history', label: 'History', icon: Clock },
    { id: 'home', label: 'Map', icon: MapPin },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="max-w-md mx-auto">
        <div className="grid grid-cols-4 gap-0">
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