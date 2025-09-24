import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, MapPin, Settings, Bell, Users, Map, AlertTriangle, CheckCircle, LogOut } from 'lucide-react';
import FloatingPanicButton from './FloatingPanicButton';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';

const HomeScreen: React.FC = () => {
  const { currentTourist, setTouristPage } = useApp();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    // The AppContext will handle the user state change
  };

  // Mock data for demonstration
  const safetyData = { score: 85, level: 'safe', color: 'green' };
  const activeAlerts = [
    {
      id: '1',
      type: 'weather',
      title: 'Heavy Rain Alert',
      message: 'Heavy rainfall expected in Shillong area',
      severity: 'medium',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 relative">
      <div className="bg-white/95 backdrop-blur-sm shadow-sm border-b sticky top-0 z-40">
        <div className="p-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
            <p className="text-sm text-gray-500">{currentTourist?.name || 'Traveler'}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={`bg-${safetyData.color}-100 text-${safetyData.color}-800`}>
              <CheckCircle className="w-3 h-3 mr-1" />
              <span>{safetyData.level}</span>
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTouristPage('settings')}
            >
              <Settings className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6 pb-24">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className={`bg-${safetyData.color}-500 text-white p-6`}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Safety Score</h2>
                  <p className="text-sm opacity-90">Your current safety rating</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{safetyData.score}</div>
                  <div className="text-sm opacity-90">{safetyData.level.toUpperCase()}</div>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="w-4 h-4" />
                <span>Shillong, Meghalaya • Safe Zone</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Quick Actions</h3>

          <Button
            size="lg"
            className="w-full h-16 bg-red-600 hover:bg-red-700 text-white shadow-lg rounded-2xl"
            onClick={() => setTouristPage('panic')}
          >
            <AlertTriangle className="w-6 h-6 mr-3" />
            <div className="text-left">
              <div className="font-bold">Panic Button</div>
              <div className="text-sm opacity-90">Emergency assistance</div>
            </div>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full h-16 bg-white hover:bg-blue-50 rounded-2xl"
            onClick={() => setTouristPage('map')}
          >
            <Map className="w-6 h-6 mr-3 text-blue-600" />
            <div className="text-left">
              <div className="font-bold">View Map</div>
              <div className="text-sm text-gray-500">Navigate safely</div>
            </div>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full h-16 bg-white hover:bg-green-50 rounded-2xl"
            onClick={() => setTouristPage('familyTracking')}
          >
            <Users className="w-6 h-6 mr-3 text-green-600" />
            <div className="text-left">
              <div className="font-bold">Family Tracking</div>
              <div className="text-sm text-gray-500">Stay connected</div>
            </div>
          </Button>
        </div>

        {activeAlerts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-yellow-600" />
                Recent Alerts ({activeAlerts.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-1" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{alert.title}</p>
                    <p className="text-xs text-gray-500">{alert.message}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    <span>{alert.severity}</span>
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      <FloatingPanicButton />
    </div>
  );
};

export default HomeScreen;