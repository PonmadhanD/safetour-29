import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, MapPin, Settings, Bell, Users, Map,
  AlertTriangle, CheckCircle, Clock, Phone, LogOut, Camera
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import FloatingPanicButton from './FloatingPanicButton';

const HomeScreen: React.FC = () => {
  const { setTouristPage, currentTourist, setEmergencyActive } = useApp();
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
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

  // Calculate safety score (mock logic)
  const getSafetyScore = () => {
    const score = 85; // Mock score
    if (score >= 80) return { score, level: 'safe', color: 'success' };
    if (score >= 60) return { score, level: 'moderate', color: 'warning' };
    return { score, level: 'risky', color: 'emergency' };
  };

  const safetyData = getSafetyScore();

  return (
    <div className="min-h-screen bg-gradient-tourism">
      {/* Header */}
      <div className="bg-card/95 backdrop-blur-sm shadow-sm border-b sticky top-0 z-40">
        <div className="p-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {t('welcomeBack')} {user?.user_metadata?.full_name || user?.email?.split('@')[0]}!
            </h1>
            <p className="text-sm text-muted-foreground">{currentTourist?.name || 'Traveler'}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={`bg-${safetyData.color}-light text-${safetyData.color}`}>
              <CheckCircle className="w-3 h-3 mr-1" />
              {safetyData.level}
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
              onClick={signOut}
              title={t('signOut')}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6 pb-24">
        {/* Tourist Safety Score Card */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className={`bg-${safetyData.color} text-${safetyData.color}-foreground p-6`}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">{t('safetyScore')}</h2>
                  <p className="text-sm opacity-90">Your current safety rating</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{safetyData.score}</div>
                  <div className="text-sm opacity-90">{safetyData.level.toUpperCase()}</div>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Shillong, Meghalaya • Safe Zone</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions - 3 Main Buttons */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-card-foreground">{t('quickActions')}</h3>
          
          {/* Emergency Button */}
          <Button
            size="lg"
            className="w-full h-16 bg-emergency hover:bg-emergency/90 text-emergency-foreground shadow-lg rounded-2xl"
            onClick={() => {
              setEmergencyActive(true);
              setTouristPage('panic');
            }}
          >
            <Phone className="w-6 h-6 mr-3" />
            <div className="text-left">
              <div className="font-bold">🚨 {t('panicButton')}</div>
              <div className="text-sm opacity-90">Emergency assistance</div>
            </div>
          </Button>

          {/* Map & Safe Zones */}
          <Button
            variant="outline"
            size="lg" 
            className="w-full h-16 bg-card hover:bg-primary/10 rounded-2xl"
            onClick={() => setTouristPage('map')}
          >
            <Map className="w-6 h-6 mr-3 text-primary" />
            <div className="text-left">
              <div className="font-bold">🗺️ {t('viewMap')}</div>
              <div className="text-sm text-muted-foreground">Navigate safely</div>
            </div>
          </Button>

          {/* Family Tracking */}
          <Button
            variant="outline"
            size="lg"
            className="w-full h-16 bg-card hover:bg-secondary/10 rounded-2xl"
            onClick={() => setTouristPage('familyTracking')}
          >
            <Users className="w-6 h-6 mr-3 text-secondary" />
            <div className="text-left">
              <div className="font-bold">👨‍👩‍👧 {t('familyTracking')}</div>
              <div className="text-sm text-muted-foreground">Stay connected</div>
            </div>
          </Button>
          
          {/* Tourist Attractions */}
          <Button
            variant="outline"
            size="lg"
            className="w-full h-16 bg-card hover:bg-accent/10 rounded-2xl"
            onClick={() => setTouristPage('attractions')}
          >
            <Camera className="w-6 h-6 mr-3 text-accent" />
            <div className="text-left">
              <div className="font-bold">🏛️ {t('touristAttractions')}</div>
              <div className="text-sm text-muted-foreground">Discover places</div>
            </div>
          </Button>
        </div>

        {/* Recent Alerts / Notifications */}
        {activeAlerts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-warning" />
                {t('recentAlerts')} ({activeAlerts.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 p-3 bg-warning-light/50 rounded-lg">
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

        {/* Current Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              {t('currentLocation')}
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

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-secondary" />
              {t('recentActivity')}
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

      {/* Floating Panic Button */}
      <FloatingPanicButton />
    </div>
  );
};

export default HomeScreen;