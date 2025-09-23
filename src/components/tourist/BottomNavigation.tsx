import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Badge, MapPin, Clock, Settings, CreditCard, Users } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const BottomNavigation: React.FC = () => {
  const { currentTourist } = useApp();
  const location = useLocation();

  // Show ID tab only if user is not logged in or not verified
  const showIdTab = !currentTourist || !currentTourist.isVerified;

  const navItems = [
    { path: '/digital-id', label: 'ID', icon: CreditCard, show: showIdTab },
    { path: '/history', label: 'History', icon: Clock, show: true },
    { path: '/', label: 'Home', icon: MapPin, show: true },
    { path: '/family', label: 'Family', icon: Users, show: true },
    { path: '/settings', label: 'Settings', icon: Settings, show: true }
  ].filter(item => item.show);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="max-w-md mx-auto">
        <div className={`grid gap-0 ${navItems.length <= 4 ? 'grid-cols-4' : 'grid-cols-5'}`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`h-16 rounded-none flex-col gap-1 ${
                  isActive 
                    ? 'text-primary bg-primary/5 border-t-2 border-t-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                } flex items-center justify-center transition-colors`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;