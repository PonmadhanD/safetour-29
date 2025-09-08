import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, MapPin, Phone, Settings, History, AlertTriangle, 
  CheckCircle, Clock, Navigation, Bell 
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const HomeScreen: React.FC = () => {
  const { setTouristPage, currentTourist, setEmergencyActive } = useApp();
  const [activeAlerts] = useState([
    {
      id: '1',
      type: 'weather',
      title: 'Heavy Rain Alert',
      message: 'Heavy rainfall expected in Shillong area',
      severity: 'medium'
    },
    {
      id: '2', 
      type: 'security',
      title: 'Travel Advisory',
      message: 'Avoid remote areas after 8 PM',
      severity: 'low'
    }
  ]);

  const handlePanicButton = () => {
    setEmergencyActive(true);
    setTouristPage('panic');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light/30 to-secondary-light/30">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="p-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Welcome back!</h1>
            <p className="text-sm text-muted-foreground">{currentTourist?.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-success-light text-success">
              <CheckCircle className="w-3 h-3 mr-1" />
              Safe
            </Badge>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setTouristPage('settings')}
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Emergency Button */}
        <Card className="bg-gradient-emergency shadow-lg">
          <CardContent className="p-6 text-center">
            <Button
              variant="panic"
              size="lg"
              className="w-full mb-4"
              onClick={handlePanicButton}
            >
              <Phone className="w-6 h-6 mr-2" />
              EMERGENCY
            </Button>
            <p className="text-white text-sm">
              Tap for immediate assistance from local authorities
            </p>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            className="h-20 flex-col gap-2"
            onClick={() => setTouristPage('zones')}
          >
            <MapPin className="w-6 h-6" />
            <span className="text-sm">Safe Zones</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-20 flex-col gap-2"
            onClick={() => setTouristPage('history')}
          >
            <History className="w-6 h-6" />
            <span className="text-sm">Travel History</span>
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            className="h-20 flex-col gap-2"
            onClick={() => setTouristPage('routes')}
          >
            <Navigation className="w-6 h-6" />
            <span className="text-sm">Safe Routes</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-20 flex-col gap-2"
          >
            <Shield className="w-6 h-6" />
            <span className="text-sm">Check-in</span>
          </Button>
        </div>

        {/* Current Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Current Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="font-medium">Shillong, Meghalaya</p>
              <p className="text-sm text-muted-foreground">Police Bazaar Area</p>
              <div className="flex items-center gap-2 text-sm text-success">
                <Shield className="w-4 h-4" />
                <span>Safe Zone</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Alerts */}
        {activeAlerts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-warning" />
                Active Alerts ({activeAlerts.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 p-3 bg-warning-light rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-warning mt-1" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{alert.title}</p>
                    <p className="text-xs text-muted-foreground">{alert.message}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {alert.severity}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-secondary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span>Checked in at Police Bazaar</span>
              <span className="text-muted-foreground ml-auto">2 hours ago</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Digital ID verified</span>
              <span className="text-muted-foreground ml-auto">5 hours ago</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-secondary rounded-full"></div>
              <span>Entered Meghalaya</span>
              <span className="text-muted-foreground ml-auto">1 day ago</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomeScreen;