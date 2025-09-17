import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, Smartphone, Monitor, X } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const ViewToggle: React.FC = () => {
  const { currentView, setCurrentView } = useApp();
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isExpanded ? (
        <div className="flex flex-col gap-2 bg-white rounded-lg shadow-lg p-2 animate-fade-in">
          <Button
            variant={currentView === 'tourist' ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setCurrentView('tourist');
              setIsExpanded(false);
            }}
            className="flex items-center gap-2 w-full justify-start"
          >
            <Smartphone className="w-4 h-4" />
            Tourist App
          </Button>
          <Button
            variant={currentView === 'authority' ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setCurrentView('authority');
              setIsExpanded(false);
            }}
            className="flex items-center gap-2 w-full justify-start"
          >
            <Monitor className="w-4 h-4" />
            Authority Dashboard
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleExpand}
            className="flex items-center gap-2 w-full justify-start mt-1"
          >
            <X className="w-4 h-4" />
            Close
          </Button>
        </div>
      ) : (
        <Button
          variant="default"
          size="icon"
          onClick={toggleExpand}
          className="rounded-full w-12 h-12 bg-blue-600 hover:bg-blue-700 transition-all duration-300 animate-bounce-in"
        >
          <Menu className="w-6 h-6 text-white" />
        </Button>
      )}
    </div>
  );
};

export default ViewToggle;