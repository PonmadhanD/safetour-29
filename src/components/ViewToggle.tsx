import React from 'react';
import { Button } from '@/components/ui/button';
import { Smartphone, Monitor } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const ViewToggle: React.FC = () => {
  const { currentView, setCurrentView } = useApp();

  return (
    <div className="fixed top-4 right-4 z-50 flex gap-2 bg-white rounded-lg shadow-lg p-2">
      <Button
        variant={currentView === 'tourist' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setCurrentView('tourist')}
        className="flex items-center gap-2"
      >
        <Smartphone className="w-4 h-4" />
        Tourist App
      </Button>
      <Button
        variant={currentView === 'authority' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setCurrentView('authority')}
        className="flex items-center gap-2"
      >
        <Monitor className="w-4 h-4" />
        Authority Dashboard
      </Button>
    </div>
  );
};

export default ViewToggle;