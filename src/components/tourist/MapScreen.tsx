import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import MapView from '../MapView';
import FloatingPanicButton from './FloatingPanicButton';

const MapScreen: React.FC = () => {
  const { setTouristPage } = useApp();

  const handlePanicAlert = () => {
    setTouristPage('panic');
  };

  return (
    <div className="h-screen flex flex-col bg-background relative">
      {/* Header */}
      <div className="bg-card/95 backdrop-blur-sm shadow-sm border-b z-40 flex-shrink-0">
        <div className="p-4 flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setTouristPage('home')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">Map & Navigation</h1>
            <p className="text-sm text-muted-foreground">Safe zones and routes</p>
          </div>
        </div>
      </div>

      {/* Full-screen Map */}
      <div className="flex-1 relative">
        <MapView 
          mode="tourist"
          onPanicAlert={handlePanicAlert}
          showPanicButton={false}
          className="w-full h-full"
        />
      </div>

      {/* Bottom Navigation Actions */}
      <div className="absolute bottom-16 left-0 right-0 z-40 px-4">
        <Card className="bg-card/95 backdrop-blur-sm border">
          <CardContent className="p-4">
            <div className="flex gap-2 justify-between">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setTouristPage('zones')}
                className="flex-1"
              >
                Safe Zones
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setTouristPage('routes')}
                className="flex-1"
              >
                Routes
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setTouristPage('history')}
                className="flex-1"
              >
                History
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Floating Panic Button */}
      <FloatingPanicButton />
    </div>
  );
};

export default MapScreen;