import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Phone, Shield, MapPin, Navigation, Clock } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import MapView from '@/components/MapView';

const MapScreen: React.FC = () => {
  const { setEmergencyActive, setTouristPage } = useApp();

  const handlePanicAlert = () => {
    setEmergencyActive(true);
    setTouristPage('panic');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card shadow-sm border-b">
        <div className="p-4">
          <h1 className="text-xl font-bold text-foreground">SafeTravel Map</h1>
          <p className="text-sm text-muted-foreground">Real-time safety navigation</p>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative h-[calc(100vh-140px)]">
        <MapView
          mode="tourist"
          onPanicAlert={handlePanicAlert}
          showPanicButton={true}
          className="w-full h-full"
        />
      </div>

      {/* Quick Actions Bar */}
      <div className="absolute bottom-20 left-4 right-4">
        <Card className="bg-card/95 backdrop-blur">
          <CardContent className="p-3">
            <div className="flex justify-between items-center">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setTouristPage('routes')}
                className="flex-1 mr-2"
              >
                <Navigation className="w-4 h-4 mr-1" />
                Routes
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setTouristPage('zones')}
                className="flex-1 mr-2"
              >
                <Shield className="w-4 h-4 mr-1" />
                Safe Zones
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setTouristPage('history')}
                className="flex-1"
              >
                <Clock className="w-4 h-4 mr-1" />
                History
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Bar */}
      <div className="absolute top-20 left-4 right-4">
        <Card className="bg-card/95 backdrop-blur">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-success rounded-full animate-pulse" />
                <span className="text-sm font-medium">Connected & Safe</span>
              </div>
              <Badge variant="outline" className="text-xs">
                GPS Active
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MapScreen;